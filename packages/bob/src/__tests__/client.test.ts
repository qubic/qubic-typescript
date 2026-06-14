import { describe, expect, test } from 'bun:test'
import { createBobClient } from '../client.js'

describe('createBobClient', () => {
  test('returns a client with rest, rpc, and subscription sub-clients', () => {
    const client = createBobClient()
    expect(client).toHaveProperty('rest')
    expect(client).toHaveProperty('rpc')
    expect(client).toHaveProperty('subscription')
  })

  test('rest sub-client is an object with expected methods', () => {
    const client = createBobClient()
    expect(typeof client.rest.getStatus).toBe('function')
    expect(typeof client.rest.getBalance).toBe('function')
    expect(typeof client.rest.getAsset).toBe('function')
    expect(typeof client.rest.getEpochInfo).toBe('function')
    expect(typeof client.rest.getTransaction).toBe('function')
    expect(typeof client.rest.getTick).toBe('function')
    expect(typeof client.rest.querySmartContract).toBe('function')
    expect(typeof client.rest.broadcastTransaction).toBe('function')
  })

  test('rpc sub-client is an object with expected methods', () => {
    const client = createBobClient()
    expect(typeof client.rpc.getChainId).toBe('function')
    expect(typeof client.rpc.getTickNumber).toBe('function')
    expect(typeof client.rpc.getLogs).toBe('function')
    expect(typeof client.rpc.getBalance).toBe('function')
    expect(typeof client.rpc.getTransactionByHash).toBe('function')
    expect(typeof client.rpc.getCurrentEpoch).toBe('function')
    expect(typeof client.rpc.getTickByNumber).toBe('function')
    expect(typeof client.rpc.broadcastTransaction).toBe('function')
    expect(typeof client.rpc.getTransactionReceipt).toBe('function')
  })

  test('subscription sub-client has expected methods and connectionStatus', () => {
    const client = createBobClient()
    expect(typeof client.subscription.subscribeNewTicks).toBe('function')
    expect(typeof client.subscription.subscribeLogs).toBe('function')
    expect(typeof client.subscription.subscribeTransfers).toBe('function')
    expect(typeof client.subscription.subscribeTickStream).toBe('function')
    expect(typeof client.subscription.close).toBe('function')
    expect(client.subscription.connectionStatus).toBeInstanceOf(ReadableStream)
  })

  test('accepts custom baseUrl and derives wsUrl', () => {
    const client = createBobClient({ baseUrl: 'http://custom-host:9999' })
    // We can verify the clients were created (no error thrown)
    expect(client.rest).toBeDefined()
    expect(client.rpc).toBeDefined()
    expect(client.subscription).toBeDefined()
  })

  test('accepts explicit wsUrl override', () => {
    const client = createBobClient({
      baseUrl: 'http://custom-host:9999',
      wsUrl: 'ws://other-host:8888/ws',
    })
    expect(client.subscription).toBeDefined()
  })

  test('accepts sub-client option overrides', () => {
    const client = createBobClient({
      rest: { baseUrl: 'http://rest:1111' },
      rpc: { retries: 5, timeoutMs: 30000 },
      subscription: { bufferSize: 500, onBufferOverflow: 'drop' },
    })
    expect(client.rest).toBeDefined()
    expect(client.rpc).toBeDefined()
    expect(client.subscription).toBeDefined()
  })
})
