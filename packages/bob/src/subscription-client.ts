import { BobConnectionError, BobSubscriptionError } from './errors.js'
import type {
  BobLogEvent,
  BobLogFilter,
  BobTickData,
  BobTickNotification,
  BobTransferEvent,
  BobTransferFilter,
} from './types.js'

export interface BobSubscriptionClientOptions {
  wsUrl: string
  /** Default: true */
  autoReconnect?: boolean
  /** Default: Infinity */
  maxReconnects?: number
  /** Max queued events for slow consumers. Default: 1000 */
  bufferSize?: number
  /** Default: 'error' */
  onBufferOverflow?: 'drop' | 'error'
  onReconnect?: (attempt: number, lastLogId: bigint | undefined) => void
}

export interface SubscriptionEvent<T> {
  data: T
  isCatchUp: boolean
  logId?: bigint
  tick?: number
}

export interface BobSubscriptionClient {
  /** Observe connection state changes. */
  readonly connectionStatus: ReadableStream<'connected' | 'disconnected' | 'reconnecting'>

  subscribeNewTicks(options?: {
    signal?: AbortSignal
  }): AsyncIterable<SubscriptionEvent<BobTickNotification>>

  subscribeLogs(
    filter?: BobLogFilter,
    options?: { startLogId?: bigint; startEpoch?: number; signal?: AbortSignal },
  ): AsyncIterable<SubscriptionEvent<BobLogEvent>>

  subscribeTransfers(
    filter?: BobTransferFilter,
    options?: { startLogId?: bigint; signal?: AbortSignal },
  ): AsyncIterable<SubscriptionEvent<BobTransferEvent>>

  subscribeTickStream(options?: {
    signal?: AbortSignal
  }): AsyncIterable<SubscriptionEvent<BobTickData>>

  close(): void
}

interface WsSubscriptionParams {
  topic: string
  params: unknown[]
  startLogId?: bigint | undefined
  startEpoch?: number | undefined
  signal?: AbortSignal | undefined
}

const BACKOFF_MS = [1000, 2000, 4000, 8000, 30_000]

function backoff(attempt: number): number {
  return BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)] ?? 30_000
}

/** Creates a WebSocket subscription client for the Bob indexer. */
export function createBobSubscriptionClient(
  options: BobSubscriptionClientOptions,
): BobSubscriptionClient {
  const autoReconnect = options.autoReconnect ?? true
  const maxReconnects = options.maxReconnects ?? Number.POSITIVE_INFINITY
  const bufferSize = options.bufferSize ?? 1000
  const onBufferOverflow = options.onBufferOverflow ?? 'error'

  let statusController: ReadableStreamDefaultController<
    'connected' | 'disconnected' | 'reconnecting'
  >
  const connectionStatus = new ReadableStream<'connected' | 'disconnected' | 'reconnecting'>({
    start(controller) {
      statusController = controller
    },
  })

  // Shared closed flag — set by close() to stop all active subscriptions.
  let globalClosed = false
  // All currently open sockets, one per active subscribe() call.
  const activeSockets = new Set<WebSocket>()

  function enqueueStatus(status: 'connected' | 'disconnected' | 'reconnecting') {
    try {
      statusController.enqueue(status)
    } catch {
      // stream may already be closed
    }
  }

  function closeAll() {
    globalClosed = true
    for (const socket of activeSockets) socket.close()
    activeSockets.clear()
    try {
      statusController.enqueue('disconnected')
      statusController.close()
    } catch {
      // ignore
    }
  }

  async function* subscribe<T>(p: WsSubscriptionParams): AsyncIterable<SubscriptionEvent<T>> {
    let lastLogId: bigint | undefined
    let reconnectAttempt = 0
    // Per-subscription closed flag so one subscription can stop independently.
    let subClosed = false

    while (!globalClosed && !subClosed && !p.signal?.aborted) {
      if (reconnectAttempt > 0) {
        if (!autoReconnect || reconnectAttempt > maxReconnects) break
        enqueueStatus('reconnecting')
        options.onReconnect?.(reconnectAttempt, lastLogId)
        await new Promise<void>((resolve) => setTimeout(resolve, backoff(reconnectAttempt - 1)))
      }

      const queue: Array<SubscriptionEvent<T>> = []
      let resolveNext: (() => void) | undefined
      let done = false
      let wsError: Error | undefined

      const socket = new WebSocket(options.wsUrl)
      activeSockets.add(socket)

      socket.onopen = () => {
        enqueueStatus('connected')

        const subscribeParams: unknown[] = [p.topic, ...p.params]
        if (lastLogId !== undefined) {
          subscribeParams.push({ startLogId: lastLogId.toString() })
        } else if (p.startLogId !== undefined) {
          subscribeParams.push({ startLogId: p.startLogId.toString() })
        } else if (p.startEpoch !== undefined) {
          subscribeParams.push({ startEpoch: p.startEpoch })
        }

        socket.send(
          JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'qubic_subscribe',
            params: subscribeParams,
          }),
        )
      }

      socket.onmessage = (event: MessageEvent) => {
        let msg: unknown
        try {
          msg = JSON.parse(event.data as string)
        } catch {
          return
        }

        if (!isNotification(msg)) return

        const payload = msg.params
        const item: SubscriptionEvent<T> = {
          data: payload.result as T,
          isCatchUp: Boolean(payload.isCatchUp),
          ...(payload.logId !== undefined
            ? { logId: BigInt(payload.logId as string | number) }
            : {}),
          ...(payload.tick !== undefined ? { tick: payload.tick as number } : {}),
        }

        if (item.logId !== undefined) lastLogId = item.logId

        if (queue.length >= bufferSize) {
          if (onBufferOverflow === 'error') {
            wsError = new BobSubscriptionError('Subscription buffer overflow')
            socket.close()
            return
          }
          return // drop
        }

        queue.push(item)
        resolveNext?.()
        resolveNext = undefined
      }

      socket.onerror = () => {
        wsError = new BobConnectionError('WebSocket error')
        done = true
        resolveNext?.()
        resolveNext = undefined
      }

      socket.onclose = () => {
        activeSockets.delete(socket)
        done = true
        resolveNext?.()
        resolveNext = undefined
      }

      const abortHandler = () => {
        subClosed = true
        socket.close()
        resolveNext?.()
        resolveNext = undefined
      }
      p.signal?.addEventListener('abort', abortHandler)

      try {
        while (!done || queue.length > 0) {
          if (queue.length === 0 && !done) {
            await new Promise<void>((resolve) => {
              resolveNext = resolve
            })
          }

          while (queue.length > 0) {
            const item = queue.shift()
            if (item !== undefined) yield item
          }
        }
      } finally {
        p.signal?.removeEventListener('abort', abortHandler)
        activeSockets.delete(socket)
        socket.close()
      }

      if (wsError) {
        if (wsError instanceof BobSubscriptionError) throw wsError
        // connection error: attempt reconnect
      }

      reconnectAttempt++
    }

    enqueueStatus('disconnected')
  }

  function isNotification(msg: unknown): msg is {
    jsonrpc: '2.0'
    method: 'qubic_subscription'
    params: {
      subscription: unknown
      result: unknown
      isCatchUp: unknown
      logId?: unknown
      tick?: unknown
    }
  } {
    const params = (msg as { params?: unknown }).params
    return (
      typeof msg === 'object' &&
      msg !== null &&
      (msg as { method?: unknown }).method === 'qubic_subscription' &&
      params !== null &&
      typeof params === 'object'
    )
  }

  return {
    connectionStatus,

    subscribeNewTicks(opts) {
      return subscribe<BobTickNotification>({
        topic: 'newTicks',
        params: [],
        ...(opts?.signal ? { signal: opts.signal } : {}),
      })
    },

    subscribeLogs(filter, opts) {
      return subscribe<BobLogEvent>({
        topic: 'logs',
        params: filter ? [filter] : [],
        ...(opts?.startLogId !== undefined ? { startLogId: opts.startLogId } : {}),
        ...(opts?.startEpoch !== undefined ? { startEpoch: opts.startEpoch } : {}),
        ...(opts?.signal ? { signal: opts.signal } : {}),
      })
    },

    subscribeTransfers(filter, opts) {
      return subscribe<BobTransferEvent>({
        topic: 'transfers',
        params: filter ? [filter] : [],
        ...(opts?.startLogId !== undefined ? { startLogId: opts.startLogId } : {}),
        ...(opts?.signal ? { signal: opts.signal } : {}),
      })
    },

    subscribeTickStream(opts) {
      return subscribe<BobTickData>({
        topic: 'tickStream',
        params: [],
        ...(opts?.signal ? { signal: opts.signal } : {}),
      })
    },

    close() {
      closeAll()
    },
  }
}
