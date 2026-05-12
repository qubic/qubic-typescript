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
