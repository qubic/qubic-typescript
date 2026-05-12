import { describe, expect, test } from 'bun:test'
import { BobRpcError } from '../errors.js'
import { createBobRpcClient } from '../rpc-client.js'

function mockFetch(body: unknown, status = 200): typeof globalThis.fetch {
  return async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
}

const ENDPOINT = 'http://localhost:40420'

describe('createBobRpcClient', () => {
  test('getChainId returns ok with chain id', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      fetch: mockFetch({ jsonrpc: '2.0', id: 1, result: 'qubic-mainnet' }),
    })
    const result = await client.getChainId()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe('qubic-mainnet')
  })

  test('getTickNumber returns ok with tick', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      fetch: mockFetch({ jsonrpc: '2.0', id: 1, result: 1234567 }),
    })
    const result = await client.getTickNumber()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe(1234567)
  })

  test('request uses JSON-RPC 2.0 framing', async () => {
    let capturedBody: unknown
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        capturedBody = JSON.parse(init?.body as string)
        return new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result: 'chain' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getChainId()
    expect((capturedBody as { jsonrpc?: unknown }).jsonrpc).toBe('2.0')
    expect((capturedBody as { method?: unknown }).method).toBe('qubic_chainId')
    expect((capturedBody as { id?: unknown }).id).toBe(1)
  })

  test('id increments across calls', async () => {
    const ids: number[] = []
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        const body = JSON.parse(init?.body as string) as { id: number }
        ids.push(body.id)
        return new Response(JSON.stringify({ jsonrpc: '2.0', id: body.id, result: 'x' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getChainId()
    await client.getChainId()
    expect(ids).toEqual([1, 2])
  })

  test('error response returns err(BobRpcError)', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch({
        jsonrpc: '2.0',
        id: 1,
        error: { code: -32601, message: 'Method not found' },
      }),
    })
    const result = await client.getChainId()
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(BobRpcError)
      expect(result.error.jsonRpcCode).toBe(-32601)
      expect(result.error.message).toBe('Method not found')
    }
  })

  test('HTTP error returns err(BobRpcError)', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch({ message: 'not found' }, 404),
    })
    const result = await client.getChainId()
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toBeInstanceOf(BobRpcError)
  })

  test('getLogs passes filter as param', async () => {
    let capturedBody: unknown
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        capturedBody = JSON.parse(init?.body as string)
        return new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getLogs({ contractIndex: 1, fromTick: 100 })
    const body = capturedBody as { method: string; params: unknown[] }
    expect(body.method).toBe('qubic_getLogs')
    expect(body.params[0]).toEqual({ contractIndex: 1, fromTick: 100 })
  })

  test('AbortSignal cancels request', async () => {
    const controller = new AbortController()
    controller.abort()
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        const signal = init?.signal
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
        return new Response('{}', { status: 200 })
      },
    })
    const result = await client.getChainId({ signal: controller.signal })
    expect(result.ok).toBe(false)
  })
})
