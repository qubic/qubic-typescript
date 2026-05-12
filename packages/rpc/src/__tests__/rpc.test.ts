import { describe, expect, test } from 'bun:test'
import { createLiveClient } from '../live-client.js'
import { createQueryClient } from '../query-client.js'
import { QubicRpcError } from '../errors.js'

function mockFetch(body: unknown, status = 200): (input: Request) => Promise<Response> {
  return async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
}

describe('createLiveClient', () => {
  test('getTickInfo returns tickInfo', async () => {
    const tickInfo = { tick: 1000, epoch: 5, duration: 2, initialTick: 900 }
    const live = createLiveClient({ fetch: mockFetch({ tickInfo }) })
    const result = await live.getTickInfo()
    expect(result.tick).toBe(1000)
    expect(result.epoch).toBe(5)
  })

  test('getBalance returns balance', async () => {
    const balance = { id: 'AAAA', balance: '100', validForTick: 999 }
    const live = createLiveClient({ fetch: mockFetch({ balance }) })
    const result = await live.getBalance('AAAA')
    expect(result.id).toBe('AAAA')
    expect(result.balance).toBe('100')
  })

  test('broadcastTransaction returns response', async () => {
    const body = { peersBroadcasted: 3, encodedTransaction: 'abc', transactionId: 'txid' }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.broadcastTransaction('abc')
    expect(result.peersBroadcasted).toBe(3)
    expect(result.transactionId).toBe('txid')
  })

  test('querySmartContract returns responseData', async () => {
    const body = { responseData: 'AAAA' }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.querySmartContract({ contractIndex: 1, inputType: 0, inputSize: 0, requestData: '' })
    expect(result.responseData).toBe('AAAA')
  })

  test('getIssuedAssets returns array', async () => {
    const body = { issuedAssets: [{ data: {}, info: {} }] }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getIssuedAssets('AAAA')
    expect(result).toHaveLength(1)
  })

  test('getAssetIssuances with no filter returns assets', async () => {
    const body = { assets: [{ tick: 1 }] }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getAssetIssuances()
    expect(result).toHaveLength(1)
  })

  test('getActiveIpos returns empty array when field missing', async () => {
    const live = createLiveClient({ fetch: mockFetch({}) })
    const result = await live.getActiveIpos()
    expect(result).toEqual([])
  })

  test('throws QubicRpcError on HTTP error', async () => {
    const live = createLiveClient({ fetch: mockFetch({ message: 'not found' }, 404) })
    await expect(live.getTickInfo()).rejects.toBeInstanceOf(QubicRpcError)
  })

  test('QubicRpcError has correct status and endpoint', async () => {
    const live = createLiveClient({ fetch: mockFetch({}, 503) })
    try {
      await live.getTickInfo()
    } catch (err) {
      expect(err).toBeInstanceOf(QubicRpcError)
      const rpcErr = err as QubicRpcError
      expect(rpcErr.status).toBe(503)
      expect(rpcErr.endpoint).toBe('/tick-info')
    }
  })
})

describe('createQueryClient', () => {
  test('getTransactionByHash returns transaction', async () => {
    const transaction = { hash: 'abc', amount: '100', source: 'A', destination: 'B' }
    const query = createQueryClient({ fetch: mockFetch({ transaction }) })
    const result = await query.getTransactionByHash('abc')
    expect(result.hash).toBe('abc')
    expect(result.amount).toBe('100')
  })

  test('getTransactionsForTick returns array', async () => {
    const body = { transactions: [{ hash: 'tx1' }, { hash: 'tx2' }] }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getTransactionsForTick(1000)
    expect(result).toHaveLength(2)
  })

  test('getTransactionsForTick returns empty array when missing', async () => {
    const query = createQueryClient({ fetch: mockFetch({}) })
    const result = await query.getTransactionsForTick(1000)
    expect(result).toEqual([])
  })

  test('getProcessedTickIntervals returns intervals', async () => {
    const body = { processedTickIntervals: [{ epoch: 1, firstTick: 1, lastTick: 100 }] }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getProcessedTickIntervals()
    expect(result).toHaveLength(1)
    expect((result[0] as { epoch: number }).epoch).toBe(1)
  })

  test('getEventLogs returns eventLogs and hits', async () => {
    const body = {
      eventLogs: [{ epoch: 1, tickNumber: 10 }],
      hits: { total: 1, from: 0, size: 10 },
      validForTick: 999,
    }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getEventLogs({ filters: {} })
    expect(result.eventLogs).toHaveLength(1)
    expect(result.hits.total).toBe(1)
    expect(result.validForTick).toBe(999)
  })

  test('throws QubicRpcError on 500', async () => {
    const query = createQueryClient({ fetch: mockFetch({}, 500) })
    await expect(query.getTransactionByHash('x')).rejects.toBeInstanceOf(QubicRpcError)
  })
})
