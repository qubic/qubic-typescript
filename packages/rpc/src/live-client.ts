import createClient from 'openapi-fetch'
import { QubicRpcError } from './errors.js'
import type { components, paths } from './live-schema.d.ts'

export type LiveClientOptions = {
  baseUrl?: string
  signal?: AbortSignal
  fetch?: (input: Request) => Promise<Response>
}

export type LiveBalance = components['schemas']['Balance']
export type LiveTickInfo = components['schemas']['TickInfo']
export type BroadcastTransactionRequest = components['schemas']['BroadcastTransactionRequest']
export type BroadcastTransactionResponse = components['schemas']['BroadcastTransactionResponse']
export type QuerySmartContractRequest = components['schemas']['QuerySmartContractRequest']
export type QuerySmartContractResponse = components['schemas']['QuerySmartContractResponse']
export type IssuedAsset = components['schemas']['IssuedAsset']
export type OwnedAsset = components['schemas']['OwnedAsset']
export type PossessedAsset = components['schemas']['PossessedAsset']
export type AssetIssuance = components['schemas']['AssetIssuance']
export type AssetOwnership = components['schemas']['AssetOwnership']
export type AssetPossession = components['schemas']['AssetPossession']
export type Ipo = components['schemas']['Ipo']

const DEFAULT_BASE_URL = 'https://rpc.qubic.org/live/v1'

async function unwrap<T>(
  promise: Promise<{ data?: T; error?: unknown; response: Response }>,
  endpoint: string,
): Promise<T> {
  const { data, error, response } = await promise
  if (error !== undefined || !response.ok) {
    throw new QubicRpcError(response.status, endpoint)
  }
  return data as T
}

/** Spreads `signal` only when defined, avoiding `exactOptionalPropertyTypes` conflict. */
function sig(signal: AbortSignal | undefined): { signal: AbortSignal } | Record<never, never> {
  return signal ? { signal } : {}
}

/**
 * Creates a type-safe client for the Qubic live API (`https://rpc.qubic.org/live/v1`).
 *
 * @param options.baseUrl - Override the default base URL.
 * @param options.signal - Default AbortSignal applied to every request.
 * @param options.fetch - Custom fetch implementation.
 * @example
 * ```ts
 * const live = createLiveClient()
 * const tickInfo = await live.getTickInfo()
 * ```
 */
export function createLiveClient(options: LiveClientOptions = {}) {
  const client = createClient<paths>({
    baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
    ...(options.fetch ? { fetch: options.fetch } : {}),
  })
  const signal = options.signal

  return {
    /** Returns current tick, epoch, duration and initial tick. */
    async getTickInfo(): Promise<LiveTickInfo> {
      const res = await unwrap(client.GET('/tick-info', { ...sig(signal) }), '/tick-info')
      return res.tickInfo as LiveTickInfo
    },

    /** Returns the balance and transfer history for the given identity. */
    async getBalance(identity: string): Promise<LiveBalance> {
      const res = await unwrap(
        client.GET('/balances/{id}', { params: { path: { id: identity } }, ...sig(signal) }),
        `/balances/${identity}`,
      )
      return res.balance as LiveBalance
    },

    /** Broadcasts a base64-encoded signed transaction; returns peer count and tx id. */
    async broadcastTransaction(encodedTransaction: string): Promise<BroadcastTransactionResponse> {
      return unwrap(
        client.POST('/broadcast-transaction', { body: { encodedTransaction }, ...sig(signal) }),
        '/broadcast-transaction',
      )
    },

    /** Calls a smart contract read-only function; returns base64-encoded response data. */
    async querySmartContract(req: QuerySmartContractRequest): Promise<QuerySmartContractResponse> {
      return unwrap(
        client.POST('/querySmartContract', { body: req, ...sig(signal) }),
        '/querySmartContract',
      )
    },

    /** Lists assets issued by the given identity. */
    async getIssuedAssets(identity: string): Promise<IssuedAsset[]> {
      const res = await unwrap(
        client.GET('/assets/{identity}/issued', {
          params: { path: { identity } },
          ...sig(signal),
        }),
        `/assets/${identity}/issued`,
      )
      return res.issuedAssets ?? []
    },

    /** Lists assets owned by the given identity. */
    async getOwnedAssets(identity: string): Promise<OwnedAsset[]> {
      const res = await unwrap(
        client.GET('/assets/{identity}/owned', {
          params: { path: { identity } },
          ...sig(signal),
        }),
        `/assets/${identity}/owned`,
      )
      return res.ownedAssets ?? []
    },

    /** Lists assets possessed by the given identity. */
    async getPossessedAssets(identity: string): Promise<PossessedAsset[]> {
      const res = await unwrap(
        client.GET('/assets/{identity}/possessed', {
          params: { path: { identity } },
          ...sig(signal),
        }),
        `/assets/${identity}/possessed`,
      )
      return res.possessedAssets ?? []
    },

    /** Searches asset issuances by optional filter. */
    async getAssetIssuances(filter?: {
      issuerIdentity?: string
      assetName?: string
    }): Promise<AssetIssuance[]> {
      const res = await unwrap(
        client.GET('/assets/issuances', {
          ...(filter ? { params: { query: filter } } : {}),
          ...sig(signal),
        }),
        '/assets/issuances',
      )
      return res.assets ?? []
    },

    /** Returns a single asset issuance by universe index. */
    async getAssetIssuanceByIndex(index: number): Promise<AssetIssuance> {
      return unwrap(
        client.GET('/assets/issuances/{index}', {
          params: { path: { index } },
          ...sig(signal),
        }),
        `/assets/issuances/${index}`,
      )
    },

    /** Searches asset ownerships by optional filter. */
    async getAssetOwnerships(filter?: {
      issuerIdentity?: string
      assetName?: string
      ownerIdentity?: string
      ownershipManagingContract?: number
    }): Promise<AssetOwnership[]> {
      const res = await unwrap(
        client.GET('/assets/ownerships', {
          ...(filter ? { params: { query: filter } } : {}),
          ...sig(signal),
        }),
        '/assets/ownerships',
      )
      return res.assets ?? []
    },

    /** Returns a single asset ownership by universe index. */
    async getAssetOwnershipByIndex(index: number): Promise<AssetOwnership> {
      return unwrap(
        client.GET('/assets/ownerships/{index}', {
          params: { path: { index } },
          ...sig(signal),
        }),
        `/assets/ownerships/${index}`,
      )
    },

    /** Searches asset possessions by optional filter. */
    async getAssetPossessions(filter?: {
      issuerIdentity?: string
      assetName?: string
      ownerIdentity?: string
      possessorIdentity?: string
      ownershipManagingContract?: number
      possessionManagingContract?: number
    }): Promise<AssetPossession[]> {
      const res = await unwrap(
        client.GET('/assets/possessions', {
          ...(filter ? { params: { query: filter } } : {}),
          ...sig(signal),
        }),
        '/assets/possessions',
      )
      return res.assets ?? []
    },

    /** Returns a single asset possession by universe index. */
    async getAssetPossessionByIndex(index: number): Promise<AssetPossession> {
      return unwrap(
        client.GET('/assets/possessions/{index}', {
          params: { path: { index } },
          ...sig(signal),
        }),
        `/assets/possessions/${index}`,
      )
    },

    /** Returns all active IPOs. */
    async getActiveIpos(): Promise<Ipo[]> {
      const res = await unwrap(client.GET('/ipos/active', { ...sig(signal) }), '/ipos/active')
      return res.ipos ?? []
    },
  }
}

export type LiveClient = ReturnType<typeof createLiveClient>
