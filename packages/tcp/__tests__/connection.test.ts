import { describe, expect, test, afterEach } from 'bun:test'
import { createServer, type Server, type Socket as NetSocket } from 'node:net'
import { HEADER_SIZE, encodeHeader } from '../src/framing.js'
import { MESSAGE_TYPE } from '../src/message-types.js'
import { createNodeConnection } from '../src/connection.js'

/**
 * Helper: build a framed response message (header + payload).
 */
function buildResponse(type: number, payload?: Uint8Array): Buffer {
  const header = encodeHeader(type, payload?.length ?? 0, 1)
  const total = HEADER_SIZE + (payload?.length ?? 0)
  const buf = Buffer.alloc(total)
  buf.set(header, 0)
  if (payload) buf.set(payload, HEADER_SIZE)
  return buf
}

/**
 * Create a test TCP server. Returns a handle that captures connected sockets
 * and data they receive, allowing the test to send responses.
 */
function createTestServer() {
  const sockets: NetSocket[] = []
  const receivedData: Buffer[] = []
  let dataResolve: ((buf: Buffer) => void) | null = null
  let connResolve: ((s: NetSocket) => void) | null = null

  const server = createServer()

  server.on('connection', (s) => {
    sockets.push(s)
    connResolve?.(s)
    connResolve = null

    s.on('data', (d: Buffer) => {
      const buf = Buffer.from(d)
      if (dataResolve) {
        const resolve = dataResolve
        dataResolve = null
        resolve(buf)
      } else {
        receivedData.push(buf)
      }
    })
  })

  const listenPromise = new Promise<void>((resolve) =>
    server.listen(0, '127.0.0.1', resolve),
  )

  return {
    server,
    sockets,
    receivedData,
    listenPromise,
    getPort: () => (server.address() as { port: number }).port,
    /** Wait for the next 'data' event from any connected socket. */
    waitForData: () => {
      if (receivedData.length > 0) return Promise.resolve(receivedData.shift()!)
      return new Promise<Buffer>((resolve) => {
        dataResolve = resolve
      })
    },
    /** Wait for a client to connect. */
    waitForConnection: () => {
      if (sockets.length > 0) return Promise.resolve(sockets[sockets.length - 1]!)
      return new Promise<NetSocket>((resolve) => {
        connResolve = resolve
      })
    },
    close: () => {
      for (const s of sockets) s.destroy()
      server.close()
    },
  }
}

describe('createNodeConnection', () => {
  let servers: Server[] = []

  afterEach(() => {
    for (const s of servers) {
      try { s.close() } catch {}
    }
    servers = []
  })

  test('returns a connection with hostname and port', async () => {
    const ts = createTestServer()
    servers.push(ts.server)
    await ts.listenPromise

    const conn = await createNodeConnection('127.0.0.1', { port: ts.getPort() })
    expect(conn.hostname).toBe('127.0.0.1')
    expect(conn.port).toBe(ts.getPort())
    conn.close()
    ts.close()
  })

  test('sends request with encoded header + payload', async () => {
    const ts = createTestServer()
    servers.push(ts.server)
    await ts.listenPromise

    const conn = await createNodeConnection('127.0.0.1', {
      port: ts.getPort(),
      timeoutMs: 3000,
    })

    const payload = new Uint8Array([1, 2, 3, 4])
    const requestPromise = conn.request(MESSAGE_TYPE.REQUEST_ENTITY, payload)

    // Get the data the client sent
    const received = await ts.waitForData()

    // Verify header: size should be 8 + 4 = 12
    expect(received[0]).toBe(12)
    expect(received[1]).toBe(0)
    expect(received[2]).toBe(0)
    expect(received[3]).toBe(MESSAGE_TYPE.REQUEST_ENTITY)
    // Payload at offset 8
    expect(received[8]).toBe(1)
    expect(received[9]).toBe(2)
    expect(received[10]).toBe(3)
    expect(received[11]).toBe(4)

    // Reply with END_RESPONSE
    const socket = ts.sockets[0]!
    socket.write(buildResponse(MESSAGE_TYPE.END_RESPONSE))

    const result = await requestPromise
    expect(result).toEqual([])
    conn.close()
    ts.close()
  })

  test('collects response payloads before END_RESPONSE', async () => {
    const ts = createTestServer()
    servers.push(ts.server)
    await ts.listenPromise

    const conn = await createNodeConnection('127.0.0.1', {
      port: ts.getPort(),
      timeoutMs: 3000,
    })

    const requestPromise = conn.request(MESSAGE_TYPE.REQUEST_CURRENT_TICK_INFO)

    // Drain request data
    await ts.waitForData()

    // Build a tick info payload (16 bytes)
    const tickPayload = Buffer.alloc(16)
    tickPayload.writeUInt32LE(50000, 4) // tick = 50000

    const socket = ts.sockets[0]!
    socket.write(buildResponse(MESSAGE_TYPE.RESPOND_CURRENT_TICK_INFO, tickPayload))
    socket.write(buildResponse(MESSAGE_TYPE.END_RESPONSE))

    const result = await requestPromise
    expect(result.length).toBe(1)
    expect(result[0]!.length).toBe(16)
    conn.close()
    ts.close()
  })

  test('collects multiple response payloads', async () => {
    const ts = createTestServer()
    servers.push(ts.server)
    await ts.listenPromise

    const conn = await createNodeConnection('127.0.0.1', {
      port: ts.getPort(),
      timeoutMs: 3000,
    })

    const requestPromise = conn.request(MESSAGE_TYPE.REQUEST_ENTITY)
    await ts.waitForData()

    const socket = ts.sockets[0]!
    const p1 = Buffer.alloc(72, 1)
    const p2 = Buffer.alloc(72, 2)
    socket.write(buildResponse(MESSAGE_TYPE.RESPOND_ENTITY, p1))
    socket.write(buildResponse(MESSAGE_TYPE.RESPOND_ENTITY, p2))
    socket.write(buildResponse(MESSAGE_TYPE.END_RESPONSE))

    const result = await requestPromise
    expect(result.length).toBe(2)
    expect(result[0]![0]).toBe(1)
    expect(result[1]![0]).toBe(2)
    conn.close()
    ts.close()
  })

  test('handles fragmented data across multiple TCP chunks', async () => {
    const ts = createTestServer()
    servers.push(ts.server)
    await ts.listenPromise

    const conn = await createNodeConnection('127.0.0.1', {
      port: ts.getPort(),
      timeoutMs: 3000,
    })

    const requestPromise = conn.request(MESSAGE_TYPE.REQUEST_ENTITY)
    await ts.waitForData()

    const socket = ts.sockets[0]!

    // Build a complete END_RESPONSE and send byte-by-byte
    const response = buildResponse(MESSAGE_TYPE.END_RESPONSE)
    for (let i = 0; i < response.length; i++) {
      socket.write(response.subarray(i, i + 1))
      await new Promise((r) => setTimeout(r, 5))
    }

    const result = await requestPromise
    expect(result).toEqual([])
    conn.close()
    ts.close()
  })

  test('rejects on socket error while request pending', async () => {
    const ts = createTestServer()
    servers.push(ts.server)
    await ts.listenPromise

    const conn = await createNodeConnection('127.0.0.1', {
      port: ts.getPort(),
      timeoutMs: 3000,
    })

    const requestPromise = conn.request(MESSAGE_TYPE.REQUEST_ENTITY)
    await ts.waitForData()

    // Destroy server-side socket to trigger error on client
    ts.sockets[0]!.destroy()

    await expect(requestPromise).rejects.toThrow()
    conn.close()
    ts.close()
  })

  test('rejects immediately if signal is already aborted', async () => {
    const ts = createTestServer()
    servers.push(ts.server)
    await ts.listenPromise

    const conn = await createNodeConnection('127.0.0.1', {
      port: ts.getPort(),
      timeoutMs: 3000,
    })

    const controller = new AbortController()
    controller.abort()

    const requestPromise = conn.request(
      MESSAGE_TYPE.REQUEST_ENTITY,
      undefined,
      { signal: controller.signal },
    )

    await expect(requestPromise).rejects.toThrow('Aborted')
    conn.close()
    ts.close()
  })

  test('queues requests — second request waits for first to complete', async () => {
    const ts = createTestServer()
    servers.push(ts.server)
    await ts.listenPromise

    const conn = await createNodeConnection('127.0.0.1', {
      port: ts.getPort(),
      timeoutMs: 3000,
    })

    // Set up server to handle multiple requests sequentially
    let requestCount = 0
    const socket = ts.sockets[0]! // This won't be available yet...

    // We need to handle this differently since the socket isn't available until connection
    // Let's use a server-side handler that auto-replies with END_RESPONSE
    ts.server.on('connection', (s) => {
      s.on('data', () => {
        requestCount++
        s.write(buildResponse(MESSAGE_TYPE.END_RESPONSE))
      })
    })

    // But wait, we already registered a handler above in createTestServer.
    // The 'connection' event already has a handler. Let me restructure.

    // Actually, the createTestServer already sets up data handling.
    // We need to reply to each request with END_RESPONSE.
    // Let's do it manually:

    const promise1 = conn.request(MESSAGE_TYPE.REQUEST_ENTITY)

    // Wait for first request data
    const req1Data = await ts.waitForData()
    expect(req1Data[3]).toBe(MESSAGE_TYPE.REQUEST_ENTITY)

    // Send second request (will be queued)
    const promise2 = conn.request(MESSAGE_TYPE.REQUEST_CURRENT_TICK_INFO)

    // Reply to first request
    ts.sockets[0]!.write(buildResponse(MESSAGE_TYPE.END_RESPONSE))
    await promise1

    // Now the second request should have been sent
    const req2Data = await ts.waitForData()
    expect(req2Data[3]).toBe(MESSAGE_TYPE.REQUEST_CURRENT_TICK_INFO)

    // Reply to second request
    ts.sockets[0]!.write(buildResponse(MESSAGE_TYPE.END_RESPONSE))
    await promise2

    conn.close()
    ts.close()
  })

  test('destroys socket on malformed header (size < 8)', async () => {
    const ts = createTestServer()
    servers.push(ts.server)
    await ts.listenPromise

    const conn = await createNodeConnection('127.0.0.1', {
      port: ts.getPort(),
      timeoutMs: 3000,
    })

    const requestPromise = conn.request(MESSAGE_TYPE.REQUEST_ENTITY)
    await ts.waitForData()

    // Send malformed header with size = 4 (< HEADER_SIZE)
    const badHeader = Buffer.alloc(8)
    badHeader[0] = 4 // size = 4, less than 8
    ts.sockets[0]!.write(badHeader)

    await expect(requestPromise).rejects.toThrow('Malformed header')
    conn.close()
    ts.close()
  })

  test('close() prevents further use', async () => {
    const ts = createTestServer()
    servers.push(ts.server)
    await ts.listenPromise

    const conn = await createNodeConnection('127.0.0.1', {
      port: ts.getPort(),
      timeoutMs: 500,
    })

    // Trigger a connection by making a request, then immediately close
    const requestPromise = conn.request(MESSAGE_TYPE.REQUEST_ENTITY)
    conn.close()

    // The request should reject (either from close or from timeout)
    await expect(requestPromise).rejects.toThrow()
    ts.close()
  })

  test('forwards signal abort to cancel pending request', async () => {
    const ts = createTestServer()
    servers.push(ts.server)
    await ts.listenPromise

    const conn = await createNodeConnection('127.0.0.1', {
      port: ts.getPort(),
      timeoutMs: 3000,
    })

    const controller = new AbortController()
    const requestPromise = conn.request(
      MESSAGE_TYPE.REQUEST_ENTITY,
      undefined,
      { signal: controller.signal },
    )

    // Wait for request to be sent
    await ts.waitForData()

    // Abort the request
    controller.abort()

    await expect(requestPromise).rejects.toThrow()
    conn.close()
    ts.close()
  })
})
