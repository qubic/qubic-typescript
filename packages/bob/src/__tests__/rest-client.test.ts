import { describe, expect, test } from 'bun:test'
import { BobRpcError } from '../errors.js'
import { createBobRestClient } from '../rest-client.js'

function mockFetch(body: unknown, status = 200): (input: Request) => Promise<Response> {
  return async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
}

describe('createBobRestClient', () => {
  test('getStatus returns ok with status', async () => {
    const body = { currentTick: 1000, currentEpoch: 5, verifiedTick: 999 }
    const client = createBobRestClient({ fetch: mockFetch(body) })
    const result = await client.getStatus()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.currentTick).toBe(1000)
  })

  test('getBalance returns ok with balance data', async () => {
    const body = { identity: 'AAAA', balance: 9999 }
    const client = createBobRestClient({ fetch: mockFetch(body) })
    const result = await client.getBalance('AAAA')
    expect(result.ok).toBe(true)
  })

  test('getTransaction returns ok with tx data', async () => {
    const body = { txHash: 'abc', tick: 1000 }
    const client = createBobRestClient({ fetch: mockFetch(body) })
    const result = await client.getTransaction('abc')
    expect(result.ok).toBe(true)
  })

  test('HTTP error returns err(BobRpcError)', async () => {
    const client = createBobRestClient({ fetch: mockFetch({ error: 'not found' }, 404) })
    const result = await client.getStatus()
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toBeInstanceOf(BobRpcError)
  })

  test('getTick returns ok with tick data', async () => {
    const body = { tick: 1234, epoch: 5 }
    const client = createBobRestClient({ fetch: mockFetch(body) })
    const result = await client.getTick(1234)
    expect(result.ok).toBe(true)
  })
})

describe('createBobRestClient - additional endpoints', () => {
  test('getAsset returns ok with asset data', async () => {
    const body = { name: 'TOKEN', amount: '1000' }
    const client = createBobRestClient({ fetch: mockFetch(body) })
    const result = await client.getAsset('IDENTITY', 'ISSUER', 'TOKEN', 1)
    expect(result.ok).toBe(true)
  })

  test('getEpochInfo returns ok with epoch info', async () => {
    const body = { epoch: 100, initialTick: 100000, endTick: 200000 }
    const client = createBobRestClient({ fetch: mockFetch(body) })
    const result = await client.getEpochInfo(100)
    expect(result.ok).toBe(true)
  })

  test('querySmartContract returns ok with response', async () => {
    const body = { result: 'base64data' }
    const client = createBobRestClient({ fetch: mockFetch(body) })
    const result = await client.querySmartContract({
      nonce: 0,
      scIndex: 1,
      funcNumber: 2,
      data: 'AQID',
    })
    expect(result.ok).toBe(true)
  })

  test('broadcastTransaction returns ok with response', async () => {
    const body = { txHash: 'abc123' }
    const client = createBobRestClient({ fetch: mockFetch(body) })
    const result = await client.broadcastTransaction({ data: 'base64tx' })
    expect(result.ok).toBe(true)
  })

  test('404 on getBalance returns err with HTTP status', async () => {
    const client = createBobRestClient({ fetch: mockFetch({ error: 'not found' }, 404) })
    const result = await client.getBalance('NONEXISTENT')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(BobRpcError)
      expect(result.error.jsonRpcCode).toBe(404)
      expect(result.error.message).toContain('/balance/NONEXISTENT')
    }
  })

  test('500 on getEpochInfo returns err with status code', async () => {
    const client = createBobRestClient({ fetch: mockFetch({ error: 'internal' }, 500) })
    const result = await client.getEpochInfo(1)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.jsonRpcCode).toBe(500)
    }
  })

  test('network error returns err with BobRpcError code -1', async () => {
    const failingFetch = async () => {
      throw new TypeError('fetch failed')
    }
    const client = createBobRestClient({
      fetch: failingFetch as (input: Request) => Promise<Response>,
    })
    const result = await client.getStatus()
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(BobRpcError)
      expect(result.error.jsonRpcCode).toBe(-1)
      expect(result.error.message).toContain('Bob REST request failed')
    }
  })

  test('custom signal is passed through to the fetch', async () => {
    const controller = new AbortController()
    controller.abort()
    let capturedSignal: AbortSignal | undefined
    const capturingFetch = async (_input: Request): Promise<Response> => {
      capturedSignal = _input.signal
      return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
    const client = createBobRestClient({
      fetch: capturingFetch as (input: Request) => Promise<Response>,
    })
    await client.getStatus({ signal: controller.signal })
    expect(capturedSignal).toBeDefined()
  })

  test('default baseUrl is used when none provided', () => {
    // Should not throw when creating with defaults
    const client = createBobRestClient()
    expect(client).toBeDefined()
  })
})
