import createClient from 'openapi-fetch'
import type { components, paths } from './__generated__/bob-schema.d.ts'
import { BobRpcError } from './errors.js'
import { type Result, err, ok } from './result.js'

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

const DEFAULT_BASE_URL = 'http://localhost:40420'

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

/** Creates a type-safe REST client for the Bob indexer API. */
export function createBobRestClient(options: BobRestClientOptions = {}) {
  const client = createClient<paths>({
    baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
    ...(options.fetch ? { fetch: options.fetch } : {}),
  })
  const signal = options.signal

  return {
    /** Returns current node status. */
    async getStatus(): Promise<Result<BobStatus, BobRpcError>> {
      return unwrap(client.GET('/status', { ...sig(signal) }), '/status')
    },

    /** Returns balance for an identity. */
    async getBalance(identity: string): Promise<Result<BobBalance, BobRpcError>> {
      return unwrap(
        client.GET('/balance/{identity}', {
          params: { path: { identity } },
          ...sig(signal),
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
    ): Promise<Result<BobAsset, BobRpcError>> {
      return unwrap(
        client.GET('/asset/{identity}/{issuer}/{assetName}/{manageSCIndex}', {
          params: { path: { identity, issuer, assetName, manageSCIndex } },
          ...sig(signal),
        }),
        `/asset/${identity}/${issuer}/${assetName}/${manageSCIndex}`,
      )
    },

    /** Returns epoch info. */
    async getEpochInfo(epoch: number): Promise<Result<BobEpochInfo, BobRpcError>> {
      return unwrap(
        client.GET('/epochinfo/{epoch}', {
          params: { path: { epoch } },
          ...sig(signal),
        }),
        `/epochinfo/${epoch}`,
      )
    },

    /** Returns a transaction by hash. */
    async getTransaction(txHash: string): Promise<Result<BobTx, BobRpcError>> {
      return unwrap(
        client.GET('/tx/{txHash}', {
          params: { path: { txHash } },
          ...sig(signal),
        }),
        `/tx/${txHash}`,
      )
    },

    /** Returns tick data. */
    async getTick(tickNumber: number): Promise<Result<BobTickResponse, BobRpcError>> {
      return unwrap(
        client.GET('/tick/{tickNumber}', {
          params: { path: { tickNumber } },
          ...sig(signal),
        }),
        `/tick/${tickNumber}`,
      )
    },

    /** Queries smart contract. */
    async querySmartContract(body: {
      nonce: number
      scIndex: number
      funcNumber: number
      data: string
    }): Promise<Result<components['schemas']['QuerySmartContractResponse'], BobRpcError>> {
      return unwrap(
        client.POST('/querySmartContract', { body, ...sig(signal) }),
        '/querySmartContract',
      )
    },

    /** Broadcasts a signed transaction. */
    async broadcastTransaction(body: {
      data: string
    }): Promise<Result<components['schemas']['BroadcastResponse'], BobRpcError>> {
      return unwrap(
        client.POST('/broadcastTransaction', { body, ...sig(signal) }),
        '/broadcastTransaction',
      )
    },
  }
}

export type BobRestClient = ReturnType<typeof createBobRestClient>
