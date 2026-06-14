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

// ------- LiveClient: untested methods & error paths -------

describe('LiveClient - untested methods', () => {
  test('getOwnedAssets returns array', async () => {
    const body = { ownedAssets: [{ data: { ownerIdentity: 'A' }, info: {} }] }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getOwnedAssets('AAAA')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toHaveLength(1)
  })

  test('getOwnedAssets returns empty array when field missing', async () => {
    const live = createLiveClient({ fetch: mockFetch({}) })
    const result = await live.getOwnedAssets('AAAA')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual([])
  })

  test('getPossessedAssets returns array', async () => {
    const body = { possessedAssets: [{ data: {}, info: {} }] }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getPossessedAssets('AAAA')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toHaveLength(1)
  })

  test('getPossessedAssets returns empty array when field missing', async () => {
    const live = createLiveClient({ fetch: mockFetch({}) })
    const result = await live.getPossessedAssets('AAAA')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual([])
  })

  test('getAssetIssuances with filter returns assets', async () => {
    const body = { assets: [{ name: 'QX' }] }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getAssetIssuances({ assetName: 'QX' })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toHaveLength(1)
  })

  test('getAssetIssuances returns empty array when field missing', async () => {
    const live = createLiveClient({ fetch: mockFetch({}) })
    const result = await live.getAssetIssuances()
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual([])
  })

  test('getAssetIssuanceByIndex returns asset', async () => {
    const body = { name: 'QX', issuerIdentity: 'AAAA' }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getAssetIssuanceByIndex(0)
    expect(result.ok).toBe(true)
  })

  test('getAssetOwnerships returns array', async () => {
    const body = { assets: [{ ownerIdentity: 'AAAA' }] }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getAssetOwnerships({ ownerIdentity: 'AAAA' })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toHaveLength(1)
  })

  test('getAssetOwnerships returns empty array when field missing', async () => {
    const live = createLiveClient({ fetch: mockFetch({}) })
    const result = await live.getAssetOwnerships()
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual([])
  })

  test('getAssetOwnershipByIndex returns asset', async () => {
    const body = { ownerIdentity: 'AAAA', numberOfShares: 100 }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getAssetOwnershipByIndex(0)
    expect(result.ok).toBe(true)
  })

  test('getAssetPossessions returns array', async () => {
    const body = { assets: [{ possessorIdentity: 'BBBB' }] }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getAssetPossessions({ possessorIdentity: 'BBBB' })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toHaveLength(1)
  })

  test('getAssetPossessions returns empty array when field missing', async () => {
    const live = createLiveClient({ fetch: mockFetch({}) })
    const result = await live.getAssetPossessions()
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual([])
  })

  test('getAssetPossessionByIndex returns asset', async () => {
    const body = { possessorIdentity: 'BBBB', numberOfShares: 50 }
    const live = createLiveClient({ fetch: mockFetch(body) })
    const result = await live.getAssetPossessionByIndex(0)
    expect(result.ok).toBe(true)
  })
})

describe('LiveClient - null/missing response fields', () => {
  test('getTickInfo returns err when tickInfo is null', async () => {
    const live = createLiveClient({ fetch: mockFetch({ tickInfo: null }) })
    const result = await live.getTickInfo()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
    expect(result.error.status).toBe(-2)
    expect(result.error.message).toContain('missing tickInfo')
  })

  test('getTickInfo returns err when tickInfo is absent', async () => {
    const live = createLiveClient({ fetch: mockFetch({}) })
    const result = await live.getTickInfo()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.status).toBe(-2)
  })

  test('getBalance returns err when balance is null', async () => {
    const live = createLiveClient({ fetch: mockFetch({ balance: null }) })
    const result = await live.getBalance('AAAA')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.status).toBe(-2)
    expect(result.error.message).toContain('missing balance')
  })

  test('getBalance maps defaults for missing optional fields', async () => {
    const balance = { id: 'AAAA' } // all other fields missing
    const live = createLiveClient({ fetch: mockFetch({ balance }) })
    const result = await live.getBalance('AAAA')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.balance).toBe(0n)
    expect(result.value.validForTick).toBe(0)
    expect(result.value.latestIncomingTransferTick).toBe(0)
    expect(result.value.latestOutgoingTransferTick).toBe(0)
    expect(result.value.incomingAmount).toBe(0n)
    expect(result.value.outgoingAmount).toBe(0n)
    expect(result.value.numberOfIncomingTransfers).toBe(0)
    expect(result.value.numberOfOutgoingTransfers).toBe(0)
  })

  test('getBlockHeight returns err when blockHeight is null', async () => {
    const live = createLiveClient({ fetch: mockFetch({ blockHeight: null }) })
    const result = await live.getBlockHeight()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.status).toBe(-2)
    expect(result.error.message).toContain('missing blockHeight')
  })
})

describe('LiveClient - network failure', () => {
  test('returns err on fetch rejection', async () => {
    const live = createLiveClient({
      fetch: async () => {
        throw new Error('ECONNREFUSED')
      },
    })
    const result = await live.getTickInfo()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
    expect(result.error.status).toBe(-1)
    expect(result.error.message).toContain('ECONNREFUSED')
  })
})

describe('LiveClient - per-request signal override', () => {
  test('uses per-request signal over default', async () => {
    const controller = new AbortController()
    controller.abort()
    const tickInfo = { tick: 100, epoch: 1, duration: 1, initialTick: 1 }
    // Mock fetch that respects abort signal
    const abortFetch = async (req: Request): Promise<Response> => {
      if (req.signal?.aborted) throw new DOMException('The operation was aborted.', 'AbortError')
      return new Response(JSON.stringify({ tickInfo }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const live = createLiveClient({ fetch: abortFetch })
    // Per-request abort signal — should fail because signal is already aborted
    const result = await live.getTickInfo({ signal: controller.signal })
    expect(result.ok).toBe(false)
  })
})

// ------- QueryClient: untested methods & error paths -------

describe('QueryClient - untested methods', () => {
  test('getLastProcessedTick returns tick info', async () => {
    const body = { tickNumber: 1000, epoch: 5, intervalInitialTick: 900, logTickNumber: 999 }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getLastProcessedTick()
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.tickNumber).toBe(1000)
    expect(result.value.epoch).toBe(5)
    expect(result.value.intervalInitialTick).toBe(900)
    expect(result.value.logTickNumber).toBe(999)
  })

  test('getLastProcessedTick returns err when fields missing', async () => {
    const query = createQueryClient({ fetch: mockFetch({ tickNumber: 1000 }) })
    const result = await query.getLastProcessedTick()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.status).toBe(-2)
    expect(result.error.message).toContain('missing required fields')
  })

  test('getComputorListsForEpoch returns lists', async () => {
    const body = { computorsLists: [{ epoch: 5, computors: [] }] }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getComputorListsForEpoch(5)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toHaveLength(1)
  })

  test('getComputorListsForEpoch returns empty array when field missing', async () => {
    const query = createQueryClient({ fetch: mockFetch({}) })
    const result = await query.getComputorListsForEpoch(5)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual([])
  })

  test('getTickData returns tick data', async () => {
    const tickData = { tickNumber: 1000, epoch: 5, timestamp: '2024-01-01' }
    const query = createQueryClient({ fetch: mockFetch({ tickData }) })
    const result = await query.getTickData(1000)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.tickNumber).toBe(1000)
  })

  test('getTickData returns err when tickData is null', async () => {
    const query = createQueryClient({ fetch: mockFetch({ tickData: null }) })
    const result = await query.getTickData(1000)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.status).toBe(-2)
    expect(result.error.message).toContain('missing tickData')
  })

  test('getTickData returns err when tickData is absent', async () => {
    const query = createQueryClient({ fetch: mockFetch({}) })
    const result = await query.getTickData(1000)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.status).toBe(-2)
  })

  test('getTransactionsForIdentity returns transactions with hits', async () => {
    const body = {
      transactions: [{ hash: 'tx1' }],
      hits: { total: 1, from: 0, size: 10 },
      validForTick: 999,
    }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getTransactionsForIdentity({ identity: 'AAAA' })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.transactions).toHaveLength(1)
    expect(result.value.hits.total).toBe(1)
    expect(result.value.validForTick).toBe(999)
  })

  test('getTransactionsForIdentity returns err when hits missing', async () => {
    const body = { transactions: [{ hash: 'tx1' }] }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getTransactionsForIdentity({ identity: 'AAAA' })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.status).toBe(-2)
    expect(result.error.message).toContain('missing hits')
  })

  test('getTransactionsForIdentity returns empty transactions when field missing', async () => {
    const body = { hits: { total: 0, from: 0, size: 10 }, validForTick: 100 }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getTransactionsForIdentity({ identity: 'AAAA' })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.transactions).toEqual([])
  })

  test('getTransactionByHash returns err when transaction is null', async () => {
    const query = createQueryClient({ fetch: mockFetch({ transaction: null }) })
    const result = await query.getTransactionByHash('abc')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.status).toBe(-2)
    expect(result.error.message).toContain('missing transaction')
  })

  test('getTransactionByHash returns err when transaction absent', async () => {
    const query = createQueryClient({ fetch: mockFetch({}) })
    const result = await query.getTransactionByHash('abc')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.status).toBe(-2)
  })

  test('getProcessedTickIntervals returns empty when field missing', async () => {
    const query = createQueryClient({ fetch: mockFetch({}) })
    const result = await query.getProcessedTickIntervals()
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual([])
  })

  test('getEventLogs returns err when hits missing', async () => {
    const body = { eventLogs: [{ epoch: 1 }] }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getEventLogs({ filters: {} })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.status).toBe(-2)
    expect(result.error.message).toContain('missing hits')
  })

  test('getEventLogs returns empty eventLogs when field missing but hits present', async () => {
    const body = { hits: { total: 0, from: 0, size: 10 }, validForTick: 100 }
    const query = createQueryClient({ fetch: mockFetch(body) })
    const result = await query.getEventLogs({ filters: {} })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.eventLogs).toEqual([])
    expect(result.value.validForTick).toBe(100)
  })
})

describe('QueryClient - network failure', () => {
  test('returns err on fetch rejection', async () => {
    const query = createQueryClient({
      fetch: async () => {
        throw new TypeError('Failed to fetch')
      },
    })
    const result = await query.getLastProcessedTick()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
    expect(result.error.status).toBe(-1)
    expect(result.error.message).toContain('Failed to fetch')
  })
})

describe('QubicRpcError', () => {
  test('has correct code property', () => {
    const error = new QubicRpcError(404, '/test')
    expect(error.code).toBe('RPC_ERROR')
  })

  test('has default message based on status and endpoint', () => {
    const error = new QubicRpcError(500, '/endpoint')
    expect(error.message).toContain('HTTP 500')
    expect(error.message).toContain('/endpoint')
  })

  test('uses custom message when provided', () => {
    const error = new QubicRpcError(400, '/path', 'custom message')
    expect(error.message).toBe('custom message')
  })

  test('is an instance of Error', () => {
    const error = new QubicRpcError(503, '/test')
    expect(error).toBeInstanceOf(Error)
  })
})
