import { type Socket, createConnection } from 'node:net'
import { QubicTcpConnectionError, QubicTcpTimeoutError } from './errors.js'
import { HEADER_SIZE, decodeHeader, encodeHeader } from './framing.js'
import { DEFAULT_PORT, MESSAGE_TYPE } from './message-types.js'

export interface NodeConnectionOptions {
  port?: number
  timeoutMs?: number
}

export interface NodeConnection {
  readonly hostname: string
  readonly port: number
  /** Send a request and collect all response payloads until END_RESPONSE. */
  request(
    type: number,
    payload?: Uint8Array,
    options?: { signal?: AbortSignal },
  ): Promise<Uint8Array[]>
  close(): void
}

type PendingRequest = {
  requestBytes: Uint8Array
  responses: Uint8Array[]
  resolve(r: Uint8Array[]): void
  reject(e: Error): void
  timer: ReturnType<typeof setTimeout> | null
}

/**
 * Opens a persistent TCP connection to a Qubic node.
 * Requests are serialised — only one is in flight at a time.
 */
export async function createNodeConnection(
  hostname: string,
  options: NodeConnectionOptions = {},
): Promise<NodeConnection> {
  const port = options.port ?? DEFAULT_PORT
  const timeoutMs = options.timeoutMs ?? 10_000

  let socket: Socket | null = null
  const chunks: Uint8Array[] = []
  let chunksLen = 0
  let pending: PendingRequest | null = null
  const queue: Array<() => void> = []
  let processing = false

  function appendBuf(data: Buffer) {
    chunks.push(new Uint8Array(data.buffer, data.byteOffset, data.byteLength))
    chunksLen += data.length
    parseMessages()
  }

  /** Consolidate chunks into a single contiguous buffer when needed. */
  function consolidate(): Uint8Array {
    if (chunks.length === 0) return new Uint8Array(0)
    if (chunks.length === 1) return chunks[0] as Uint8Array
    const result = new Uint8Array(chunksLen)
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }
    chunks.length = 0
    chunks.push(result)
    return result
  }

  /** Remove the first `n` consumed bytes from the chunk list. */
  function consume(n: number) {
    let remaining = n
    while (remaining > 0 && chunks.length > 0) {
      const chunk = chunks[0] as Uint8Array
      if (chunk.length <= remaining) {
        remaining -= chunk.length
        chunks.shift()
      } else {
        chunks[0] = chunk.subarray(remaining)
        remaining = 0
      }
    }
    chunksLen -= n
  }

  function parseMessages() {
    while (chunksLen >= HEADER_SIZE) {
      const buf = consolidate()
      const { size, type } = decodeHeader(buf)
      if (size < HEADER_SIZE) {
        destroySocket(new QubicTcpConnectionError(hostname, 'Malformed header: size < 8'))
        return
      }
      if (chunksLen < size) return
      const payload = buf.slice(HEADER_SIZE, size)
      consume(size)
      onMessage(type, payload)
    }
  }

  function onMessage(type: number, payload: Uint8Array) {
    if (!pending) return
    if (type === MESSAGE_TYPE.END_RESPONSE) {
      if (pending.timer !== null) clearTimeout(pending.timer)
      const { responses, resolve } = pending
      pending = null
      resolve(responses)
      dequeue()
    } else if (type === MESSAGE_TYPE.TRY_AGAIN) {
      // Re-send after 1 s
      if (pending.timer !== null) clearTimeout(pending.timer)
      pending.timer = setTimeout(() => {
        if (pending && socket) socket.write(pending.requestBytes)
      }, 1000)
    } else {
      pending.responses.push(payload)
    }
  }

  function destroySocket(err: Error) {
    if (pending) {
      if (pending.timer !== null) clearTimeout(pending.timer)
      const { reject } = pending
      pending = null
      reject(err)
      processing = false
      dequeue()
    }
    socket?.destroy()
    socket = null
  }

  function dequeue() {
    processing = false
    if (queue.length > 0) {
      const next = queue.shift()
      next?.()
    }
  }

  function openSocket(): Promise<Socket> {
    if (socket && !socket.destroyed) return Promise.resolve(socket)
    return new Promise<Socket>((resolve, reject) => {
      const s = createConnection({ host: hostname, port }, () => {
        socket = s
        resolve(s)
      })
      s.on('data', (chunk: Buffer) => appendBuf(chunk))
      s.on('error', (err: Error) => {
        destroySocket(new QubicTcpConnectionError(hostname, err.message, err))
        reject(err)
      })
      s.on('close', () => {
        if (pending) destroySocket(new QubicTcpConnectionError(hostname, 'Connection closed'))
        socket = null
      })
    })
  }

  return {
    hostname,
    port,

    request(type, payload?, opts?) {
      return new Promise<Uint8Array[]>((resolve, reject) => {
        const run = async () => {
          processing = true

          if (opts?.signal?.aborted) {
            processing = false
            reject(new Error('Aborted'))
            dequeue()
            return
          }

          let s: Socket
          try {
            s = await openSocket()
          } catch (err) {
            processing = false
            reject(err)
            dequeue()
            return
          }

          const payloadBytes = payload ?? new Uint8Array(0)
          const header = encodeHeader(type, payloadBytes.length)
          const requestBytes = new Uint8Array(header.length + payloadBytes.length)
          requestBytes.set(header)
          requestBytes.set(payloadBytes, header.length)

          const timer = setTimeout(() => {
            destroySocket(new QubicTcpTimeoutError(hostname, timeoutMs))
          }, timeoutMs)

          pending = {
            requestBytes,
            responses: [],
            resolve(r) {
              resolve(r)
            },
            reject(e) {
              reject(e)
            },
            timer,
          }

          let onAbort: (() => void) | undefined
          if (opts?.signal) {
            onAbort = () => destroySocket(new Error('Aborted'))
            opts.signal.addEventListener('abort', onAbort, { once: true })
          }

          const originalResolve = pending.resolve
          const originalReject = pending.reject
          pending.resolve = (r) => {
            if (onAbort) opts?.signal?.removeEventListener('abort', onAbort)
            originalResolve(r)
          }
          pending.reject = (e) => {
            if (onAbort) opts?.signal?.removeEventListener('abort', onAbort)
            originalReject(e)
          }

          s.write(Buffer.from(requestBytes))
        }

        if (processing) {
          queue.push(run)
        } else {
          run()
        }
      })
    },

    close() {
      socket?.destroy()
      socket = null
    },
  }
}
