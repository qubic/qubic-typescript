import type { Base64, Identity, TxHash } from '@qubic.ts/types'
import { BobRpcError } from './errors.js'
import { type Result, err, ok } from './result.js'
import type {
  BobLogEvent,
  BobLogFilter,
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
        ? AbortSignal.any([signal, timeoutController.signal])
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
  }
}
