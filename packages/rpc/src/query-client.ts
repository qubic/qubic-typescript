import createClient from 'openapi-fetch'
import { sig, unwrap } from './_utils.js'
import type { components, paths } from './query-schema.d.ts'

export type QueryClientOptions = {
  baseUrl?: string
  signal?: AbortSignal
  fetch?: (input: Request) => Promise<Response>
}

export type QueryTransaction = components['schemas']['Transaction']
export type QueryTickData = components['schemas']['TickData']
export type QueryEvent = components['schemas']['Event']
export type QueryComputorList = components['schemas']['ComputorList']
export type ProcessedTickInterval = components['schemas']['ProcessedTickInterval']
export type GetEventLogsRequest = components['schemas']['GetEventLogsRequest']
export type GetTransactionsForIdentityRequest =
  components['schemas']['GetTransactionsForIdentityRequest']
export type Hits = components['schemas']['Hits']

const DEFAULT_BASE_URL = 'https://rpc.qubic.org/query/v1'

/**
 * Creates a type-safe client for the Qubic archive query API (`https://rpc.qubic.org/query/v1`).
 *
 * @param options.baseUrl - Override the default base URL.
 * @param options.signal - Default AbortSignal applied to every request.
 * @param options.fetch - Custom fetch implementation.
 * @example
 * ```ts
 * const query = createQueryClient()
 * const tx = await query.getTransactionByHash(hash)
 * ```
 */
export function createQueryClient(options: QueryClientOptions = {}) {
  const client = createClient<paths>({
    baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
    ...(options.fetch ? { fetch: options.fetch } : {}),
  })
  const signal = options.signal

  return {
    /** Returns the last tick processed by the archive indexer. */
    async getLastProcessedTick(): Promise<{
      tickNumber: number
      epoch: number
      intervalInitialTick: number
      logTickNumber: number
    }> {
      return unwrap(
        client.GET('/getLastProcessedTick', { ...sig(signal) }),
        '/getLastProcessedTick',
      ) as Promise<{
        tickNumber: number
        epoch: number
        intervalInitialTick: number
        logTickNumber: number
      }>
    },

    /** Returns the tick intervals that have been processed (indexed) by the archive. */
    async getProcessedTickIntervals(): Promise<ProcessedTickInterval[]> {
      const res = await unwrap(
        client.GET('/getProcessedTickIntervals', { ...sig(signal) }),
        '/getProcessedTickIntervals',
      )
      return res.processedTickIntervals ?? []
    },

    /** Returns computor lists for the given epoch. */
    async getComputorListsForEpoch(epoch: number): Promise<QueryComputorList[]> {
      const res = await unwrap(
        client.POST('/getComputorListsForEpoch', { body: { epoch }, ...sig(signal) }),
        '/getComputorListsForEpoch',
      )
      return res.computorsLists ?? []
    },

    /** Returns full tick data including transaction hashes and computor info. */
    async getTickData(tickNumber: number): Promise<QueryTickData> {
      const res = await unwrap(
        client.POST('/getTickData', { body: { tickNumber }, ...sig(signal) }),
        '/getTickData',
      )
      return res.tickData as QueryTickData
    },

    /** Returns a single transaction by its 60-char lowercase hash. */
    async getTransactionByHash(hash: string): Promise<QueryTransaction> {
      const res = await unwrap(
        client.POST('/getTransactionByHash', { body: { hash }, ...sig(signal) }),
        '/getTransactionByHash',
      )
      return res.transaction as QueryTransaction
    },

    /** Returns transactions for the given identity with optional filters. */
    async getTransactionsForIdentity(
      req: GetTransactionsForIdentityRequest,
    ): Promise<{ transactions: QueryTransaction[]; hits: Hits; validForTick: number }> {
      const res = await unwrap(
        client.POST('/getTransactionsForIdentity', { body: req, ...sig(signal) }),
        '/getTransactionsForIdentity',
      )
      return {
        transactions: res.transactions ?? [],
        hits: res.hits as Hits,
        validForTick: res.validForTick ?? 0,
      }
    },

    /** Returns all transactions included in the given tick. */
    async getTransactionsForTick(tickNumber: number): Promise<QueryTransaction[]> {
      const res = await unwrap(
        client.POST('/getTransactionsForTick', { body: { tickNumber }, ...sig(signal) }),
        '/getTransactionsForTick',
      )
      return res.transactions ?? []
    },

    /** Queries event logs with rich filtering (log type, identity, tick range, pagination). */
    async getEventLogs(
      req: GetEventLogsRequest,
    ): Promise<{ eventLogs: QueryEvent[]; hits: Hits; validForTick: number }> {
      const res = await unwrap(
        client.POST('/getEventLogs', { body: req, ...sig(signal) }),
        '/getEventLogs',
      )
      return {
        eventLogs: res.eventLogs ?? [],
        hits: res.hits as Hits,
        validForTick: res.validForTick ?? 0,
      }
    },
  }
}

export type QueryClient = ReturnType<typeof createQueryClient>
