import { err, ok } from '@qubic.org/types'
import type { Result } from '@qubic.org/types'
import createClient from 'openapi-fetch'
import { sig, unwrap } from './_utils.js'
import { QubicRpcError } from './errors.js'
import type { components, paths } from './query-schema'

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
 * const result = await query.getTransactionByHash(hash)
 * if (result.ok) console.log(result.value)
 * ```
 */
export function createQueryClient(options: QueryClientOptions = {}) {
  const client = createClient<paths>({
    baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
    ...(options.fetch ? { fetch: options.fetch } : {}),
  })
  const signal = options.signal

  type Opts = { signal?: AbortSignal }
  const s = (opts?: Opts) => sig(opts?.signal ?? signal)

  return {
    /** Returns the last tick processed by the archive indexer. */
    async getLastProcessedTick(
      opts?: Opts,
    ): Promise<
      Result<
        { tickNumber: number; epoch: number; intervalInitialTick: number; logTickNumber: number },
        QubicRpcError
      >
    > {
      const r = await unwrap(
        client.GET('/getLastProcessedTick', { ...s(opts) }),
        '/getLastProcessedTick',
      )
      if (!r.ok) return r
      const v = r.value as {
        tickNumber?: number
        epoch?: number
        intervalInitialTick?: number
        logTickNumber?: number
      }
      if (
        v.tickNumber == null ||
        v.epoch == null ||
        v.intervalInitialTick == null ||
        v.logTickNumber == null
      ) {
        return err(
          new QubicRpcError(-2, '/getLastProcessedTick', 'missing required fields in response'),
        )
      }
      return ok(
        v as {
          tickNumber: number
          epoch: number
          intervalInitialTick: number
          logTickNumber: number
        },
      )
    },

    /** Returns the tick intervals that have been processed (indexed) by the archive. */
    async getProcessedTickIntervals(
      opts?: Opts,
    ): Promise<Result<ProcessedTickInterval[], QubicRpcError>> {
      const r = await unwrap(
        client.GET('/getProcessedTickIntervals', { ...s(opts) }),
        '/getProcessedTickIntervals',
      )
      if (!r.ok) return r
      return ok(
        (r.value as { processedTickIntervals?: ProcessedTickInterval[] }).processedTickIntervals ??
          [],
      )
    },

    /** Returns computor lists for the given epoch. */
    async getComputorListsForEpoch(
      epoch: number,
      opts?: Opts,
    ): Promise<Result<QueryComputorList[], QubicRpcError>> {
      const r = await unwrap(
        client.POST('/getComputorListsForEpoch', { body: { epoch }, ...s(opts) }),
        '/getComputorListsForEpoch',
      )
      if (!r.ok) return r
      return ok((r.value as { computorsLists?: QueryComputorList[] }).computorsLists ?? [])
    },

    /** Returns full tick data including transaction hashes and computor info. */
    async getTickData(
      tickNumber: number,
      opts?: Opts,
    ): Promise<Result<QueryTickData, QubicRpcError>> {
      const r = await unwrap(
        client.POST('/getTickData', { body: { tickNumber }, ...s(opts) }),
        '/getTickData',
      )
      if (!r.ok) return r
      const td = (r.value as { tickData?: QueryTickData }).tickData
      if (td == null)
        return err(new QubicRpcError(-2, '/getTickData', 'missing tickData in response'))
      return ok(td)
    },

    /** Returns a single transaction by its 60-char lowercase hash. */
    async getTransactionByHash(
      hash: string,
      opts?: Opts,
    ): Promise<Result<QueryTransaction, QubicRpcError>> {
      const r = await unwrap(
        client.POST('/getTransactionByHash', { body: { hash }, ...s(opts) }),
        '/getTransactionByHash',
      )
      if (!r.ok) return r
      const tx = (r.value as { transaction?: QueryTransaction }).transaction
      if (tx == null)
        return err(
          new QubicRpcError(-2, '/getTransactionByHash', 'missing transaction in response'),
        )
      return ok(tx)
    },

    /** Returns transactions for the given identity with optional filters. */
    async getTransactionsForIdentity(
      req: GetTransactionsForIdentityRequest,
      opts?: Opts,
    ): Promise<
      Result<{ transactions: QueryTransaction[]; hits: Hits; validForTick: number }, QubicRpcError>
    > {
      const r = await unwrap(
        client.POST('/getTransactionsForIdentity', { body: req, ...s(opts) }),
        '/getTransactionsForIdentity',
      )
      if (!r.ok) return r
      const v = r.value as {
        transactions?: QueryTransaction[]
        hits?: Hits
        validForTick?: number
      }
      if (v.hits == null)
        return err(new QubicRpcError(-2, '/getTransactionsForIdentity', 'missing hits in response'))
      return ok({
        transactions: v.transactions ?? [],
        hits: v.hits,
        validForTick: v.validForTick ?? 0,
      })
    },

    /** Returns all transactions included in the given tick. */
    async getTransactionsForTick(
      tickNumber: number,
      opts?: Opts,
    ): Promise<Result<QueryTransaction[], QubicRpcError>> {
      const r = await unwrap(
        client.POST('/getTransactionsForTick', { body: { tickNumber }, ...s(opts) }),
        '/getTransactionsForTick',
      )
      if (!r.ok) return r
      return ok((r.value as { transactions?: QueryTransaction[] }).transactions ?? [])
    },

    /** Queries event logs with rich filtering (log type, identity, tick range, pagination). */
    async getEventLogs(
      req: GetEventLogsRequest,
      opts?: Opts,
    ): Promise<
      Result<{ eventLogs: QueryEvent[]; hits: Hits; validForTick: number }, QubicRpcError>
    > {
      const r = await unwrap(
        client.POST('/getEventLogs', { body: req, ...s(opts) }),
        '/getEventLogs',
      )
      if (!r.ok) return r
      const v = r.value as {
        eventLogs?: QueryEvent[]
        hits?: Hits
        validForTick?: number
      }
      if (v.hits == null)
        return err(new QubicRpcError(-2, '/getEventLogs', 'missing hits in response'))
      return ok({
        eventLogs: v.eventLogs ?? [],
        hits: v.hits,
        validForTick: v.validForTick ?? 0,
      })
    },
  }
}

export type QueryClient = ReturnType<typeof createQueryClient>
