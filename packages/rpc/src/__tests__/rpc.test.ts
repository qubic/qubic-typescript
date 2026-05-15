import { describe, expect, test } from 'bun:test'
import { QubicRpcError } from '../errors.js'
import { createLiveClient } from '../live-client.js'
import { createQueryClient } from '../query-client.js'

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
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.tick).toBe(1000)
    expect(result.value.epoch).toBe(5)
  })

  test('getBalance returns mapped balance with bigint', async () => {
    const balance = {
      id: 'AAAA',
      balance: '100',
      validForTick: 999,
      incomingAmount: '50',
      outgoingAmount: '10',
    }
    const live = createLiveClient({ fetch: mockFetch({ balance }) })
    const result = await live.getBalance('AAAA')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.id).toBe('AAAA')
    expect(result.value.balance).toBe(100n)
    expect(result.value.incomingAmount).toBe(50n)
    expect(result.value.outgoingAmount).toBe(10n)
    expect(result.value.validForTick).toBe(999)
  })

  test('broadcastTransaction returns response', async () => {
    const body = { peersBroadcasted: 3, encodedTransaction: 'abc', transactionId: 'txid' }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.broadcastTransaction('abc')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.peersBroadcasted).toBe(3)
    expect(result.value.transactionId).toBe('txid')
  })

  test('querySmartContract returns responseData', async () => {
    const body = { responseData: 'AAAA' }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.querySmartContract({
      contractIndex: 1,
      inputType: 0,
      inputSize: 0,
      requestData: '',
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.responseData).toBe('AAAA')
  })

  test('getIssuedAssets returns array', async () => {
    const body = { issuedAssets: [{ data: {}, info: {} }] }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getIssuedAssets('AAAA')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toHaveLength(1)
  })

  test('getAssetIssuances with no filter returns assets', async () => {
    const body = { assets: [{ tick: 1 }] }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getAssetIssuances()
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toHaveLength(1)
  })

  test('getActiveIpos returns empty array when field missing', async () => {
    const live = createLiveClient({ fetch: mockFetch({}) })
    const result = await live.getActiveIpos()
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual([])
  })

  test('returns err Result on HTTP error', async () => {
    const live = createLiveClient({ fetch: mockFetch({ message: 'not found' }, 404) })
    const result = await live.getTickInfo()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
  })

  test('err Result has correct status and endpoint', async () => {
    const live = createLiveClient({ fetch: mockFetch({}, 503) })
    const result = await live.getTickInfo()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
    expect(result.error.status).toBe(503)
    expect(result.error.endpoint).toBe('/tick-info')
  })
})

describe('createQueryClient', () => {
  test('getTransactionByHash returns transaction', async () => {
    const transaction = { hash: 'abc', amount: '100', source: 'A', destination: 'B' }
    const query = createQueryClient({ fetch: mockFetch({ transaction }) })
    const result = await query.getTransactionByHash('abc')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.hash).toBe('abc')
    expect(result.value.amount).toBe('100')
  })

  test('getTransactionsForTick returns array', async () => {
    const body = { transactions: [{ hash: 'tx1' }, { hash: 'tx2' }] }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getTransactionsForTick(1000)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toHaveLength(2)
  })

  test('getTransactionsForTick returns empty array when missing', async () => {
    const query = createQueryClient({ fetch: mockFetch({}) })
    const result = await query.getTransactionsForTick(1000)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual([])
  })

  test('getProcessedTickIntervals returns intervals', async () => {
    const body = { processedTickIntervals: [{ epoch: 1, firstTick: 1, lastTick: 100 }] }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getProcessedTickIntervals()
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toHaveLength(1)
    expect((result.value[0] as { epoch: number }).epoch).toBe(1)
  })

  test('getEventLogs returns eventLogs and hits', async () => {
    const body = {
      eventLogs: [{ epoch: 1, tickNumber: 10 }],
      hits: { total: 1, from: 0, size: 10 },
      validForTick: 999,
    }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getEventLogs({ filters: {} })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.eventLogs).toHaveLength(1)
    expect(result.value.hits.total).toBe(1)
    expect(result.value.validForTick).toBe(999)
  })

  test('returns err Result on 500', async () => {
    const query = createQueryClient({ fetch: mockFetch({}, 500) })
    const result = await query.getTransactionByHash('x')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
  })
})
