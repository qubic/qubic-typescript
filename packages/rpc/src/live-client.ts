import createClient from 'openapi-fetch'
import { sig, unwrap } from './_utils.js'
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

  type Opts = { signal?: AbortSignal }
  const s = (opts?: Opts) => sig(opts?.signal ?? signal)

  return {
    /** Returns current tick, epoch, duration and initial tick. */
    async getTickInfo(opts?: Opts): Promise<LiveTickInfo> {
      const res = await unwrap(client.GET('/tick-info', { ...s(opts) }), '/tick-info')
      return res.tickInfo as LiveTickInfo
    },

    /** Returns the balance and transfer history for the given identity. */
    async getBalance(identity: string, opts?: Opts): Promise<LiveBalance> {
      const res = await unwrap(
        client.GET('/balances/{id}', { params: { path: { id: identity } }, ...s(opts) }),
        `/balances/${identity}`,
      )
      return res.balance as LiveBalance
    },

    /** Broadcasts a base64-encoded signed transaction; returns peer count and tx id. */
    async broadcastTransaction(
      encodedTransaction: string,
      opts?: Opts,
    ): Promise<BroadcastTransactionResponse> {
      return unwrap(
        client.POST('/broadcast-transaction', { body: { encodedTransaction }, ...s(opts) }),
        '/broadcast-transaction',
      )
    },

    /** Calls a smart contract read-only function; returns base64-encoded response data. */
    async querySmartContract(
      req: QuerySmartContractRequest,
      opts?: Opts,
    ): Promise<QuerySmartContractResponse> {
      return unwrap(
        client.POST('/querySmartContract', { body: req, ...s(opts) }),
        '/querySmartContract',
      )
    },

    /** Lists assets issued by the given identity. */
    async getIssuedAssets(identity: string, opts?: Opts): Promise<IssuedAsset[]> {
      const res = await unwrap(
        client.GET('/assets/{identity}/issued', {
          params: { path: { identity } },
          ...s(opts),
        }),
        `/assets/${identity}/issued`,
      )
      return res.issuedAssets ?? []
    },

    /** Lists assets owned by the given identity. */
    async getOwnedAssets(identity: string, opts?: Opts): Promise<OwnedAsset[]> {
      const res = await unwrap(
        client.GET('/assets/{identity}/owned', {
          params: { path: { identity } },
          ...s(opts),
        }),
        `/assets/${identity}/owned`,
      )
      return res.ownedAssets ?? []
    },

    /** Lists assets possessed by the given identity. */
    async getPossessedAssets(identity: string, opts?: Opts): Promise<PossessedAsset[]> {
      const res = await unwrap(
        client.GET('/assets/{identity}/possessed', {
          params: { path: { identity } },
          ...s(opts),
        }),
        `/assets/${identity}/possessed`,
      )
      return res.possessedAssets ?? []
    },

    /** Searches asset issuances by optional filter. */
    async getAssetIssuances(
      filter?: { issuerIdentity?: string; assetName?: string },
      opts?: Opts,
    ): Promise<AssetIssuance[]> {
      const res = await unwrap(
        client.GET('/assets/issuances', {
          ...(filter ? { params: { query: filter } } : {}),
          ...s(opts),
        }),
        '/assets/issuances',
      )
      return res.assets ?? []
    },

    /** Returns a single asset issuance by universe index. */
    async getAssetIssuanceByIndex(index: number, opts?: Opts): Promise<AssetIssuance> {
      return unwrap(
        client.GET('/assets/issuances/{index}', {
          params: { path: { index } },
          ...s(opts),
        }),
        `/assets/issuances/${index}`,
      )
    },

    /** Searches asset ownerships by optional filter. */
    async getAssetOwnerships(
      filter?: {
        issuerIdentity?: string
        assetName?: string
        ownerIdentity?: string
        ownershipManagingContract?: number
      },
      opts?: Opts,
    ): Promise<AssetOwnership[]> {
      const res = await unwrap(
        client.GET('/assets/ownerships', {
          ...(filter ? { params: { query: filter } } : {}),
          ...s(opts),
        }),
        '/assets/ownerships',
      )
      return res.assets ?? []
    },

    /** Returns a single asset ownership by universe index. */
    async getAssetOwnershipByIndex(index: number, opts?: Opts): Promise<AssetOwnership> {
      return unwrap(
        client.GET('/assets/ownerships/{index}', {
          params: { path: { index } },
          ...s(opts),
        }),
        `/assets/ownerships/${index}`,
      )
    },

    /** Searches asset possessions by optional filter. */
    async getAssetPossessions(
      filter?: {
        issuerIdentity?: string
        assetName?: string
        ownerIdentity?: string
        possessorIdentity?: string
        ownershipManagingContract?: number
        possessionManagingContract?: number
      },
      opts?: Opts,
    ): Promise<AssetPossession[]> {
      const res = await unwrap(
        client.GET('/assets/possessions', {
          ...(filter ? { params: { query: filter } } : {}),
          ...s(opts),
        }),
        '/assets/possessions',
      )
      return res.assets ?? []
    },

    /** Returns a single asset possession by universe index. */
    async getAssetPossessionByIndex(index: number, opts?: Opts): Promise<AssetPossession> {
      return unwrap(
        client.GET('/assets/possessions/{index}', {
          params: { path: { index } },
          ...s(opts),
        }),
        `/assets/possessions/${index}`,
      )
    },

    /** Returns all active IPOs. */
    async getActiveIpos(opts?: Opts): Promise<Ipo[]> {
      const res = await unwrap(client.GET('/ipos/active', { ...s(opts) }), '/ipos/active')
      return res.ipos ?? []
    },
  }
}

export type LiveClient = ReturnType<typeof createLiveClient>
