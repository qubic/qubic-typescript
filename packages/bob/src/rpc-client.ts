import type { Base64, Identity, TxHash } from '@qubic.org/types'
import { BobRpcError } from './errors.js'
import { type Result, err, ok } from './result.js'
import type {
  BobAllAssetTransferFilter,
  BobAssetTransferFilter,
  BobComputorList,
  BobFindLogFilter,
  BobLogEvent,
  BobLogFilter,
  BobQuTransferFilter,
  BobRestLogEvent,
  BobRpcEpochInfo,
  BobIndexedTick,
  BobTickLogRange,
  BobTransaction,
  BobTransferEvent,
  BobTransferFilter,
} from './types.js'

export interface BobRpcClientOptions {
  /** e.g. http://localhost:40420 */
  endpoint: string
  fetch?: typeof globalThis.fetch
  /** Default: 2 */
  retries?: number
  /** Default: 10000 */
  timeoutMs?: number
}

export interface BobRpcClient {
  /** Returns the chain identifier string. */
  getChainId(options?: { signal?: AbortSignal }): Promise<Result<string, BobRpcError>>
  /** Returns the current tick number. */
  getTickNumber(options?: { signal?: AbortSignal }): Promise<Result<number, BobRpcError>>
  /** Returns log events matching the given filter. */
  getLogs(
    filter: BobLogFilter,
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobLogEvent[], BobRpcError>>
  /** Returns transfers matching the given filter. */
  getTransfers(
    filter: BobTransferFilter,
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobTransferEvent[], BobRpcError>>
  /** Returns the QU balance for an identity. */
  getBalance(
    identity: Identity,
    options?: { signal?: AbortSignal },
  ): Promise<Result<bigint, BobRpcError>>
  /** Returns a transaction by its hash. */
  getTransactionByHash(
    hash: TxHash,
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobTransaction, BobRpcError>>
  /** Calls a smart contract read-only function. */
  querySmartContract(
    contractIndex: number,
    funcNumber: number,
    data: Base64,
    options?: { signal?: AbortSignal },
  ): Promise<Result<Base64, BobRpcError>>
  /** Broadcasts a signed transaction; returns the transaction hash. */
  broadcastTransaction(
    signedTxHex: string,
    options?: { signal?: AbortSignal },
  ): Promise<Result<TxHash, BobRpcError>>
  /** Returns the current epoch number. */
  getCurrentEpoch(options?: { signal?: AbortSignal }): Promise<Result<number, BobRpcError>>
  /** Returns indexed tick metadata. Pass `includeTx=true` to include full transaction objects. */
  getTickByNumber(
    tick: number,
    includeTx: boolean | undefined,
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobIndexedTick, BobRpcError>>
  /** Returns asset balance for an identity. */
  getAssetBalance(
    identity: Identity,
    issuer: Identity,
    assetName: string,
    options?: { signal?: AbortSignal },
  ): Promise<
    Result<
      { identity: Identity; issuer: Identity; assetName: string; balance: bigint },
      BobRpcError
    >
  >
  /** Returns assets owned by an identity. */
  getAssets(
    identity: Identity,
    options?: { signal?: AbortSignal },
  ): Promise<
    Result<
      Array<{ identity: Identity; issuer: Identity; assetName: string; amount: bigint }>,
      BobRpcError
    >
  >
  /** Returns epoch info including tick range and log boundaries. */
  getEpochInfo(
    epoch: number,
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobRpcEpochInfo, BobRpcError>>
  /** Returns end-of-epoch logs for the given epoch. */
  getEndEpochLogs(
    epoch: number,
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobRestLogEvent[], BobRpcError>>
  /** Returns the computor list for an epoch (defaults to current epoch). */
  getComputors(
    epoch?: number,
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobComputorList, BobRpcError>>
  /** Returns QU transfer history for an identity in a tick range. */
  getQuTransfers(
    filter: BobQuTransferFilter,
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobRestLogEvent[], BobRpcError>>
  /** Returns asset transfer history for an identity in a tick range. */
  getAssetTransfers(
    filter: BobAssetTransferFilter,
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobRestLogEvent[], BobRpcError>>
  /** Returns all transfers of a specific asset in a tick range. */
  getAllAssetTransfers(
    filter: BobAllAssetTransferFilter,
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobRestLogEvent[], BobRpcError>>
  /** Returns log IDs matching the given filter. */
  findLogIds(
    filter: BobFindLogFilter,
    options?: { signal?: AbortSignal },
  ): Promise<Result<bigint[], BobRpcError>>
  /** Returns log events in a log ID range for the given epoch. */
  getLogsByIdRange(
    epoch: number,
    fromId: bigint,
    toId: bigint,
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobRestLogEvent[], BobRpcError>>
  /** Returns log ID ranges for the given tick numbers (max 1000). */
  getTickLogRanges(
    ticks: number[],
    options?: { signal?: AbortSignal },
  ): Promise<Result<BobTickLogRange[], BobRpcError>>
}

interface JsonRpcRequest {
  jsonrpc: '2.0'
  id: number
  method: string
  params: unknown[]
}

interface JsonRpcSuccess<T> {
  jsonrpc: '2.0'
  id: number
  result: T
}

interface JsonRpcError {
  jsonrpc: '2.0'
  id: number
  error: { code: number; message: string; data?: unknown }
}

type JsonRpcResponse<T> = JsonRpcSuccess<T> | JsonRpcError

function isJsonRpcError<T>(r: JsonRpcResponse<T>): r is JsonRpcError {
  return 'error' in r
}

function combineSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  if (typeof AbortSignal.any === 'function') return AbortSignal.any([a, b])
  const controller = new AbortController()
  if (a.aborted) {
    controller.abort(a.reason)
    return controller.signal
  }
  if (b.aborted) {
    controller.abort(b.reason)
    return controller.signal
  }
  a.addEventListener('abort', () => controller.abort(a.reason), { once: true })
  b.addEventListener('abort', () => controller.abort(b.reason), { once: true })
  return controller.signal
}

/** Creates a type-safe JSON-RPC 2.0 client for the Bob indexer. */
export function createBobRpcClient(options: BobRpcClientOptions): BobRpcClient {
  const fetchFn = options.fetch ?? globalThis.fetch
  const retries = options.retries ?? 2
  const timeoutMs = options.timeoutMs ?? 10_000
  let idCounter = 0

  async function call<T>(
    method: string,
    params: unknown[],
    signal?: AbortSignal,
  ): Promise<Result<T, BobRpcError>> {
    const id = ++idCounter
    const body: JsonRpcRequest = { jsonrpc: '2.0', id, method, params }

    let lastError: BobRpcError | undefined

    for (let attempt = 0; attempt <= retries; attempt++) {
      const timeoutController = new AbortController()
      const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs)

      const combinedSignal = signal
        ? combineSignals(signal, timeoutController.signal)
        : timeoutController.signal

      try {
        const response = await fetchFn(options.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: combinedSignal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          lastError = new BobRpcError(-32603, `HTTP ${response.status} from Bob RPC`)
          continue
        }

        const json = (await response.json()) as JsonRpcResponse<T>

        if (isJsonRpcError(json)) {
          return err(new BobRpcError(json.error.code, json.error.message))
        }

        return ok(json.result)
      } catch (e) {
        clearTimeout(timeoutId)
        if (signal?.aborted === true) {
          return err(new BobRpcError(-32000, 'Request aborted', { cause: e }))
        }
        lastError = new BobRpcError(-32603, 'Bob RPC request failed', { cause: e })
      }
    }

    return err(lastError ?? new BobRpcError(-32603, 'Bob RPC request failed after retries'))
  }

  return {
    getChainId(options) {
      return call<string>('qubic_chainId', [], options?.signal)
    },

    getTickNumber(options) {
      return call<number>('qubic_getTickNumber', [], options?.signal)
    },

    getLogs(filter, options) {
      return call<BobLogEvent[]>('qubic_getLogs', [filter], options?.signal)
    },

    getTransfers(filter, options) {
      return call<BobTransferEvent[]>('qubic_getTransfers', [filter], options?.signal)
    },

    async getBalance(identity, options) {
      const r = await call<number | string>('qubic_getBalance', [identity], options?.signal)
      return r.ok ? ok(BigInt(r.value)) : r
    },

    getTransactionByHash(hash, options) {
      return call<BobTransaction>('qubic_getTransactionByHash', [hash], options?.signal)
    },

    querySmartContract(contractIndex, funcNumber, data, options) {
      return call<Base64>(
        'qubic_querySmartContract',
        [contractIndex, funcNumber, data],
        options?.signal,
      )
    },

    broadcastTransaction(signedTxHex, options) {
      return call<TxHash>('qubic_broadcastTransaction', [signedTxHex], options?.signal)
    },

    getCurrentEpoch(options) {
      return call<number>('qubic_getCurrentEpoch', [], options?.signal)
    },

    getTickByNumber(tick, includeTx, options) {
      return call<BobIndexedTick>(
        'qubic_getTickByNumber',
        [String(tick), includeTx ?? false],
        options?.signal,
      )
    },

    async getAssetBalance(identity, issuer, assetName, options) {
      type Raw = { identity: string; issuer: string; assetName: string; balance: number | string }
      const r = await call<Raw>(
        'qubic_getAssetBalance',
        [identity, issuer, assetName],
        options?.signal,
      )
      if (!r.ok) return r
      return ok({
        ...r.value,
        identity: r.value.identity as Identity,
        issuer: r.value.issuer as Identity,
        balance: BigInt(r.value.balance),
      })
    },

    async getAssets(identity, options) {
      type RawItem = {
        identity: string
        issuer: string
        assetName: string
        amount: number | string
      }
      const r = await call<RawItem[]>('qubic_getAssets', [identity], options?.signal)
      if (!r.ok) return r
      return ok(
        r.value.map((item) => ({
          ...item,
          identity: item.identity as Identity,
          issuer: item.issuer as Identity,
          amount: BigInt(item.amount),
        })),
      )
    },

    async getEpochInfo(epoch, options) {
      type Raw = {
        epoch: number
        initialTick: number
        endTick: number
        endTickStartLogId: number | string
        endTickEndLogId: number | string
        lastIndexedTick: number
        latestLogId: number | string
      }
      const r = await call<Raw>('qubic_getEpochInfo', [epoch], options?.signal)
      if (!r.ok) return r
      return ok({
        ...r.value,
        endTickStartLogId: BigInt(r.value.endTickStartLogId),
        endTickEndLogId: BigInt(r.value.endTickEndLogId),
        latestLogId: BigInt(r.value.latestLogId),
      } as BobRpcEpochInfo)
    },

    async getEndEpochLogs(epoch, options) {
      type Raw = {
        logId: number | string
        tick: number
        epoch: number
        scIndex: number
        logType: number
        message: unknown
      }
      const r = await call<Raw[]>('qubic_getEndEpochLogs', [epoch], options?.signal)
      if (!r.ok) return r
      return ok(r.value.map((e) => ({ ...e, logId: BigInt(e.logId) }) as BobRestLogEvent))
    },

    async getComputors(epoch, options) {
      type Raw = { epoch: number; identities: string[] }
      const params = epoch !== undefined ? [epoch] : []
      const r = await call<Raw>('qubic_getComputors', params, options?.signal)
      if (!r.ok) return r
      return ok({ epoch: r.value.epoch, identities: r.value.identities as Identity[] })
    },

    async getQuTransfers(filter, options) {
      type Raw = {
        logId: number | string
        tick: number
        epoch: number
        scIndex: number
        logType: number
        message: unknown
      }
      const r = await call<Raw[]>('qubic_getQuTransfers', [filter], options?.signal)
      if (!r.ok) return r
      return ok(r.value.map((e) => ({ ...e, logId: BigInt(e.logId) }) as BobRestLogEvent))
    },

    async getAssetTransfers(filter, options) {
      type Raw = {
        logId: number | string
        tick: number
        epoch: number
        scIndex: number
        logType: number
        message: unknown
      }
      const r = await call<Raw[]>('qubic_getAssetTransfers', [filter], options?.signal)
      if (!r.ok) return r
      return ok(r.value.map((e) => ({ ...e, logId: BigInt(e.logId) }) as BobRestLogEvent))
    },

    async getAllAssetTransfers(filter, options) {
      type Raw = {
        logId: number | string
        tick: number
        epoch: number
        scIndex: number
        logType: number
        message: unknown
      }
      const r = await call<Raw[]>('qubic_getAllAssetTransfers', [filter], options?.signal)
      if (!r.ok) return r
      return ok(r.value.map((e) => ({ ...e, logId: BigInt(e.logId) }) as BobRestLogEvent))
    },

    async findLogIds(filter, options) {
      const r = await call<(number | string)[]>('qubic_findLogIds', [filter], options?.signal)
      if (!r.ok) return r
      return ok(r.value.map(BigInt))
    },

    async getLogsByIdRange(epoch, fromId, toId, options) {
      type Raw = {
        logId: number | string
        tick: number
        epoch: number
        scIndex: number
        logType: number
        message: unknown
      }
      const r = await call<Raw[]>(
        'qubic_getLogsByIdRange',
        [epoch, Number(fromId), Number(toId)],
        options?.signal,
      )
      if (!r.ok) return r
      return ok(r.value.map((e) => ({ ...e, logId: BigInt(e.logId) }) as BobRestLogEvent))
    },

    async getTickLogRanges(ticks, options) {
      type Raw = { tick: number; fromLogId: number | string | null; length: number | string | null }
      const r = await call<Raw[]>('qubic_getTickLogRanges', [ticks], options?.signal)
      if (!r.ok) return r
      return ok(
        r.value.map(
          (e) =>
            ({
              tick: e.tick,
              fromLogId: e.fromLogId != null ? BigInt(e.fromLogId) : null,
              length: e.length != null ? BigInt(e.length) : null,
            }) as BobTickLogRange,
        ),
      )
    },
  }
}
