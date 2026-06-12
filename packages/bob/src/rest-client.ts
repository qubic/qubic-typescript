import createClient from 'openapi-fetch'
import type { components, paths } from './__generated__/bob-schema.d.ts'
import { DEFAULT_BOB_BASE_URL } from './constants.js'
import { BobRpcError } from './errors.js'
import { type Result, err, ok } from '@qubic.org/types'

export type BobRestClientOptions = {
  baseUrl?: string
  signal?: AbortSignal
  fetch?: (input: Request) => Promise<Response>
}

export type BobStatus = components['schemas']['StatusResponse']
export type BobBalance = components['schemas']['BalanceResponse']
export type BobAsset = components['schemas']['AssetResponse']
export type BobEpochInfo = components['schemas']['EpochInfoResponse']
export type BobTx = components['schemas']['TransactionResponse']
export type BobTickResponse = components['schemas']['TickResponse']

function sig(signal: AbortSignal | undefined): { signal: AbortSignal } | Record<never, never> {
  return signal ? { signal } : {}
}

async function unwrap<T>(
  promise: Promise<{ data?: T; error?: unknown; response: Response }>,
  endpoint: string,
): Promise<Result<T, BobRpcError>> {
  try {
    const { data, error, response } = await promise
    if (error !== undefined || !response.ok) {
      return err(
        new BobRpcError(
          response.status,
          `Bob REST request failed: HTTP ${response.status} on ${endpoint}`,
        ),
      )
    }
    return ok(data as T)
  } catch (e) {
    return err(new BobRpcError(-1, `Bob REST request failed: ${endpoint}`, { cause: e }))
  }
}

/**
 * Creates a type-safe REST client for the Bob indexer API.
 *
 * The REST client provides typed access to the stateless HTTP endpoints defined
 * in the Bob OpenAPI spec.  It intentionally covers only the subset of endpoints
 * that map cleanly to simple GET/POST operations (status, balance, asset, epoch,
 * tick, transaction, querySmartContract, broadcastTransaction).
 *
 * Log queries, transfer history, and other advanced operations are available
 * exclusively through the JSON-RPC client (`createBobRpcClient`) to avoid
 * duplicating maintenance across two transport layers.
 */
export function createBobRestClient(options: BobRestClientOptions = {}) {
  const client = createClient<paths>({
    baseUrl: options.baseUrl ?? DEFAULT_BOB_BASE_URL,
    ...(options.fetch ? { fetch: options.fetch } : {}),
  })
  const signal = options.signal

  type Opts = { signal?: AbortSignal }
  const s = (opts?: Opts) => sig(opts?.signal ?? signal)

  return {
    /** Returns current node status. */
    async getStatus(opts?: Opts): Promise<Result<BobStatus, BobRpcError>> {
      return unwrap(client.GET('/status', { ...s(opts) }), '/status')
    },

    /** Returns balance for an identity. */
    async getBalance(identity: string, opts?: Opts): Promise<Result<BobBalance, BobRpcError>> {
      return unwrap(
        client.GET('/balance/{identity}', {
          params: { path: { identity } },
          ...s(opts),
        }),
        `/balance/${identity}`,
      )
    },

    /** Returns asset info. */
    async getAsset(
      identity: string,
      issuer: string,
      assetName: string,
      manageSCIndex: number,
      opts?: Opts,
    ): Promise<Result<BobAsset, BobRpcError>> {
      return unwrap(
        client.GET('/asset/{identity}/{issuer}/{assetName}/{manageSCIndex}', {
          params: { path: { identity, issuer, assetName, manageSCIndex } },
          ...s(opts),
        }),
        `/asset/${identity}/${issuer}/${assetName}/${manageSCIndex}`,
      )
    },

    /** Returns epoch info. */
    async getEpochInfo(epoch: number, opts?: Opts): Promise<Result<BobEpochInfo, BobRpcError>> {
      return unwrap(
        client.GET('/epochinfo/{epoch}', {
          params: { path: { epoch } },
          ...s(opts),
        }),
        `/epochinfo/${epoch}`,
      )
    },

    /** Returns a transaction by hash. */
    async getTransaction(txHash: string, opts?: Opts): Promise<Result<BobTx, BobRpcError>> {
      return unwrap(
        client.GET('/tx/{txHash}', {
          params: { path: { txHash } },
          ...s(opts),
        }),
        `/tx/${txHash}`,
      )
    },

    /** Returns tick data. */
    async getTick(tickNumber: number, opts?: Opts): Promise<Result<BobTickResponse, BobRpcError>> {
      return unwrap(
        client.GET('/tick/{tickNumber}', {
          params: { path: { tickNumber } },
          ...s(opts),
        }),
        `/tick/${tickNumber}`,
      )
    },

    /** Queries smart contract. */
    async querySmartContract(
      body: { nonce: number; scIndex: number; funcNumber: number; data: string },
      opts?: Opts,
    ): Promise<Result<components['schemas']['QuerySmartContractResponse'], BobRpcError>> {
      return unwrap(client.POST('/querySmartContract', { body, ...s(opts) }), '/querySmartContract')
    },

    /** Broadcasts a signed transaction. */
    async broadcastTransaction(
      body: { data: string },
      opts?: Opts,
    ): Promise<Result<components['schemas']['BroadcastResponse'], BobRpcError>> {
      return unwrap(
        client.POST('/broadcastTransaction', { body, ...s(opts) }),
        '/broadcastTransaction',
      )
    },
  }
}

export type BobRestClient = ReturnType<typeof createBobRestClient>
