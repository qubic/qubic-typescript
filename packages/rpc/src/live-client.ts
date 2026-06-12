import createClient from 'openapi-fetch'
import { sig, unwrap } from './_utils.js'
import { QubicRpcError } from './errors.js'
import type { components, paths } from './live-schema'
import { err, ok } from './result.js'
import type { Result } from './result.js'

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

/** Mapped balance type with numeric string fields converted to bigint. */
export interface QubicBalance {
  id: string
  balance: bigint
  validForTick: number
  latestIncomingTransferTick: number
  latestOutgoingTransferTick: number
  incomingAmount: bigint
  outgoingAmount: bigint
  numberOfIncomingTransfers: number
  numberOfOutgoingTransfers: number
}

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
 * const result = await live.getTickInfo()
 * if (result.ok) console.log(result.value.tick)
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
    async getTickInfo(opts?: Opts): Promise<Result<LiveTickInfo, QubicRpcError>> {
      const r = await unwrap(client.GET('/tick-info', { ...s(opts) }), '/tick-info')
      if (!r.ok) return r
      if (r.value.tickInfo == null) return err(new QubicRpcError(-2, '/tick-info', 'missing tickInfo in response'))
      return ok(r.value.tickInfo as LiveTickInfo)
    },

    /** Returns the balance for the given identity with bigint amounts. */
    async getBalance(identity: string, opts?: Opts): Promise<Result<QubicBalance, QubicRpcError>> {
      const r = await unwrap(
        client.GET('/balances/{id}', { params: { path: { id: identity } }, ...s(opts) }),
        `/balances/${identity}`,
      )
      if (!r.ok) return r
      if (r.value.balance == null) return err(new QubicRpcError(-2, `/balances/${identity}`, 'missing balance in response'))
      const b = r.value.balance as LiveBalance
      return ok({
        id: b.id ?? '',
        balance: BigInt(b.balance ?? 0),
        validForTick: b.validForTick ?? 0,
        latestIncomingTransferTick: b.latestIncomingTransferTick ?? 0,
        latestOutgoingTransferTick: b.latestOutgoingTransferTick ?? 0,
        incomingAmount: BigInt(b.incomingAmount ?? 0),
        outgoingAmount: BigInt(b.outgoingAmount ?? 0),
        numberOfIncomingTransfers: b.numberOfIncomingTransfers ?? 0,
        numberOfOutgoingTransfers: b.numberOfOutgoingTransfers ?? 0,
      })
    },

    /** Broadcasts a base64-encoded signed transaction; returns peer count and tx id. */
    async broadcastTransaction(
      encodedTransaction: string,
      opts?: Opts,
    ): Promise<Result<BroadcastTransactionResponse, QubicRpcError>> {
      return unwrap(
        client.POST('/broadcast-transaction', { body: { encodedTransaction }, ...s(opts) }),
        '/broadcast-transaction',
      )
    },

    /** Calls a smart contract read-only function; returns base64-encoded response data. */
    async querySmartContract(
      req: QuerySmartContractRequest,
      opts?: Opts,
    ): Promise<Result<QuerySmartContractResponse, QubicRpcError>> {
      return unwrap(
        client.POST('/querySmartContract', { body: req, ...s(opts) }),
        '/querySmartContract',
      )
    },

    /** Lists assets issued by the given identity. */
    async getIssuedAssets(
      identity: string,
      opts?: Opts,
    ): Promise<Result<IssuedAsset[], QubicRpcError>> {
      const r = await unwrap(
        client.GET('/assets/{identity}/issued', {
          params: { path: { identity } },
          ...s(opts),
        }),
        `/assets/${identity}/issued`,
      )
      if (!r.ok) return r
      return ok(r.value.issuedAssets ?? [])
    },

    /** Lists assets owned by the given identity. */
    async getOwnedAssets(
      identity: string,
      opts?: Opts,
    ): Promise<Result<OwnedAsset[], QubicRpcError>> {
      const r = await unwrap(
        client.GET('/assets/{identity}/owned', {
          params: { path: { identity } },
          ...s(opts),
        }),
        `/assets/${identity}/owned`,
      )
      if (!r.ok) return r
      return ok(r.value.ownedAssets ?? [])
    },

    /** Lists assets possessed by the given identity. */
    async getPossessedAssets(
      identity: string,
      opts?: Opts,
    ): Promise<Result<PossessedAsset[], QubicRpcError>> {
      const r = await unwrap(
        client.GET('/assets/{identity}/possessed', {
          params: { path: { identity } },
          ...s(opts),
        }),
        `/assets/${identity}/possessed`,
      )
      if (!r.ok) return r
      return ok(r.value.possessedAssets ?? [])
    },

    /** Searches asset issuances by optional filter. */
    async getAssetIssuances(
      filter?: { issuerIdentity?: string; assetName?: string },
      opts?: Opts,
    ): Promise<Result<AssetIssuance[], QubicRpcError>> {
      const r = await unwrap(
        client.GET('/assets/issuances', {
          ...(filter ? { params: { query: filter } } : {}),
          ...s(opts),
        }),
        '/assets/issuances',
      )
      if (!r.ok) return r
      return ok(r.value.assets ?? [])
    },

    /** Returns a single asset issuance by universe index. */
    async getAssetIssuanceByIndex(
      index: number,
      opts?: Opts,
    ): Promise<Result<AssetIssuance, QubicRpcError>> {
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
    ): Promise<Result<AssetOwnership[], QubicRpcError>> {
      const r = await unwrap(
        client.GET('/assets/ownerships', {
          ...(filter ? { params: { query: filter } } : {}),
          ...s(opts),
        }),
        '/assets/ownerships',
      )
      if (!r.ok) return r
      return ok(r.value.assets ?? [])
    },

    /** Returns a single asset ownership by universe index. */
    async getAssetOwnershipByIndex(
      index: number,
      opts?: Opts,
    ): Promise<Result<AssetOwnership, QubicRpcError>> {
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
    ): Promise<Result<AssetPossession[], QubicRpcError>> {
      const r = await unwrap(
        client.GET('/assets/possessions', {
          ...(filter ? { params: { query: filter } } : {}),
          ...s(opts),
        }),
        '/assets/possessions',
      )
      if (!r.ok) return r
      return ok(r.value.assets ?? [])
    },

    /** Returns a single asset possession by universe index. */
    async getAssetPossessionByIndex(
      index: number,
      opts?: Opts,
    ): Promise<Result<AssetPossession, QubicRpcError>> {
      return unwrap(
        client.GET('/assets/possessions/{index}', {
          params: { path: { index } },
          ...s(opts),
        }),
        `/assets/possessions/${index}`,
      )
    },

    /** Returns all active IPOs. */
    async getActiveIpos(opts?: Opts): Promise<Result<Ipo[], QubicRpcError>> {
      const r = await unwrap(client.GET('/ipos/active', { ...s(opts) }), '/ipos/active')
      if (!r.ok) return r
      return ok(r.value.ipos ?? [])
    },

    /**
     * Returns the current block height (tick info).
     * @deprecated Use {@link getTickInfo} instead — this endpoint is deprecated upstream.
     */
    async getBlockHeight(opts?: Opts): Promise<Result<LiveTickInfo, QubicRpcError>> {
      const r = await unwrap(client.GET('/block-height', { ...s(opts) }), '/block-height')
      if (!r.ok) return r
      if (r.value.blockHeight == null) return err(new QubicRpcError(-2, '/block-height', 'missing blockHeight in response'))
      return ok(r.value.blockHeight as LiveTickInfo)
    },
  }
}

export type LiveClient = ReturnType<typeof createLiveClient>
