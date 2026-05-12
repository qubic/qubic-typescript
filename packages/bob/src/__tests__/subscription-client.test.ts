import { describe, expect, test } from 'bun:test'
import { BobSubscriptionError } from '../errors.js'
import { createBobSubscriptionClient } from '../subscription-client.js'

/** Minimal WebSocket mock for testing subscription logic without a real server. */
class MockWebSocket {
  static lastInstance: MockWebSocket | undefined
  readonly url: string
  onopen: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onerror: (() => void) | null = null
  onclose: (() => void) | null = null

  constructor(url: string) {
    this.url = url
    MockWebSocket.lastInstance = this
  }

  send(_data: string): void {}
  close(): void {
    this.onclose?.()
  }

  /** Simulate server sending a subscription notification. */
  simulateMessage(result: unknown, isCatchUp = false, logId?: bigint): void {
    const msg = JSON.stringify({
      jsonrpc: '2.0',
      method: 'qubic_subscription',
      params: {
        subscription: 'sub-1',
        result,
        isCatchUp,
        ...(logId !== undefined ? { logId: logId.toString() } : {}),
      },
    })
    this.onmessage?.({ data: msg })
  }

  simulateOpen(): void {
    this.onopen?.()
  }

  simulateClose(): void {
    this.onclose?.()
  }
}

function withMockWs(fn: () => Promise<void>): () => Promise<void> {
  return async () => {
    const original = globalThis.WebSocket
    // @ts-expect-error — replace with mock
    globalThis.WebSocket = MockWebSocket
    try {
      await fn()
    } finally {
      globalThis.WebSocket = original
    }
  }
}

describe('createBobSubscriptionClient', () => {
  test(
    'subscribeNewTicks yields tick notifications',
    withMockWs(async () => {
      const client = createBobSubscriptionClient({ wsUrl: 'ws://localhost:40420/ws/qubic' })

      const controller = new AbortController()
      const iter = client.subscribeNewTicks({ signal: controller.signal })
      const gen = iter[Symbol.asyncIterator]()

      const nextPromise = gen.next()

      // Simulate connection and server message
      const ws = MockWebSocket.lastInstance!
      ws.simulateOpen()
      ws.simulateMessage({ tick: 1000, epoch: 5 }, false)

      const { value } = await nextPromise
      expect(value.data.tick).toBe(1000)
      expect(value.data.epoch).toBe(5)
      expect(value.isCatchUp).toBe(false)

      controller.abort()
      client.close()
    }),
  )

  test(
    'isCatchUp is propagated correctly',
    withMockWs(async () => {
      const client = createBobSubscriptionClient({ wsUrl: 'ws://localhost:40420/ws/qubic' })

      const controller = new AbortController()
      const iter = client.subscribeLogs(undefined, { signal: controller.signal })
      const gen = iter[Symbol.asyncIterator]()

      const nextPromise = gen.next()
      const ws = MockWebSocket.lastInstance!
      ws.simulateOpen()
      ws.simulateMessage(
        { tick: 100, logId: '1', contractIndex: 1, logType: 0, data: '', isCatchUp: true },
        true,
        1n,
      )

      const { value } = await nextPromise
      expect(value.isCatchUp).toBe(true)
      expect(value.logId).toBe(1n)

      controller.abort()
      client.close()
    }),
  )

  test(
    'buffer overflow throws BobSubscriptionError when onBufferOverflow is error',
    withMockWs(async () => {
      const client = createBobSubscriptionClient({
        wsUrl: 'ws://localhost:40420/ws/qubic',
        bufferSize: 1,
        onBufferOverflow: 'error',
      })

      const controller = new AbortController()
      const iter = client.subscribeNewTicks({ signal: controller.signal })
      const gen = iter[Symbol.asyncIterator]()

      // Start consuming (won't resolve until message arrives)
      const firstPromise = gen.next()

      const ws = MockWebSocket.lastInstance!
      ws.simulateOpen()

      // First message fills the buffer (size=1), second overflows
      ws.simulateMessage({ tick: 1, epoch: 1 })
      ws.simulateMessage({ tick: 2, epoch: 1 }) // overflow — triggers error + close

      // First event comes through fine
      const first = await firstPromise
      expect(first.value.data.tick).toBe(1)

      // Next iteration should throw because the socket closed with a buffer overflow error
      await expect(gen.next()).rejects.toBeInstanceOf(BobSubscriptionError)

      controller.abort()
      client.close()
    }),
  )

  test(
    'reconnection re-subscribes with startLogId',
    withMockWs(async () => {
      let connectCount = 0
      let lastSentMessage: unknown

      class TrackingWebSocket extends MockWebSocket {
        constructor(url: string) {
          super(url)
          connectCount++
        }
        override send(data: string): void {
          lastSentMessage = JSON.parse(data)
        }
      }

      // @ts-expect-error — replace with tracking mock
      globalThis.WebSocket = TrackingWebSocket

      const client = createBobSubscriptionClient({
        wsUrl: 'ws://localhost:40420/ws/qubic',
        autoReconnect: true,
        maxReconnects: 1,
      })

      const controller = new AbortController()
      const iter = client.subscribeLogs(undefined, { signal: controller.signal })
      const gen = iter[Symbol.asyncIterator]()

      const firstPromise = gen.next()
      const ws1 = MockWebSocket.lastInstance!
      ws1.simulateOpen()
      ws1.simulateMessage(
        { tick: 10, logId: '42', contractIndex: 1, logType: 0, data: '', isCatchUp: false },
        false,
        42n,
      )

      await firstPromise
      expect(connectCount).toBe(1)

      // Get next to trigger waiting, then simulate disconnect
      const secondPromise = gen.next()
      ws1.simulateClose()

      // Wait for reconnect (backoff is 1000ms, use a longer timeout)
      await new Promise<void>((resolve) => setTimeout(resolve, 1200))

      const ws2 = MockWebSocket.lastInstance!
      ws2.simulateOpen()

      // The reconnect subscribe message should include startLogId
      const msg = lastSentMessage as { params: unknown[] }
      const lastParam = msg.params[msg.params.length - 1] as { startLogId?: unknown }
      expect(lastParam.startLogId).toBe('42')

      controller.abort()
      ws2.simulateClose()
      client.close()

      // Drain
      await secondPromise.catch(() => {})
    }),
  )
})
