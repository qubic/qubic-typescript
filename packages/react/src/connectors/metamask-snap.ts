import type { BroadcastTransactionResponse } from '@qubic.org/rpc'
import type { Identity } from '@qubic.org/types'
import type {
  ConnectOptions,
  SendTransactionResult,
  SignMessageResult,
  SignTransactionResult,
  WalletAccount,
  WalletConnector,
  WalletConnectorEvent,
} from './connector.js'

type WindowEthereum = {
  request<T>(args: { method: string; params?: unknown }): Promise<T>
}

type WindowWithEthereum = typeof globalThis & { ethereum?: WindowEthereum }

export const DEFAULT_SNAP_ID = 'npm:@qubic-lib/qubic-mm-snap'

export interface MetaMaskSnapConnectorOptions {
  /** MetaMask Snap ID. Default: 'npm:@qubic-lib/qubic-mm-snap'. */
  snapId?: string
  /** Account index to use. Default: 0. */
  accountIndex?: number
  /**
   * Called after signing to broadcast the transaction. If not provided,
   * sendTransaction will throw — use signTransaction + broadcast yourself.
   *
   * @example
   * broadcast: async (base64) => {
   *   const result = await liveClient.broadcastTransaction(base64 as Base64)
   *   if (!result.isOk()) throw result.error
   *   return { networkTxId: result.value.transactionId, broadcast: result.value }
   * }
   */
  broadcast?: (
    signedBase64: string,
  ) => Promise<{ networkTxId: string; broadcast: BroadcastTransactionResponse }>
  /**
   * Snap method name for retrieving the identity.
   * Default: 'getIdentity'. Override if the snap version you use differs.
   */
  getIdentityMethod?: string
}

function getEthereum(): WindowEthereum {
  const eth = (globalThis as WindowWithEthereum).ethereum
  if (!eth) throw new Error('MetaMask not found — install MetaMask Flask')
  return eth
}

async function hasSnapsSupport(): Promise<boolean> {
  try {
    const eth = (globalThis as WindowWithEthereum).ethereum
    if (!eth) return false
    const snaps = await eth.request<Record<string, unknown>>({ method: 'wallet_getSnaps' })
    return typeof snaps === 'object' && snaps !== null
  } catch {
    return false
  }
}

type EventCallback = (payload: unknown) => void

/**
 * WalletConnector implementation for the Qubic MetaMask Snap.
 *
 * Usage:
 * ```ts
 * import { createMetaMaskSnapConnector } from '@qubic.org/react'
 *
 * const connector = createMetaMaskSnapConnector({
 *   broadcast: async (base64) => {
 *     const r = await liveClient.broadcastTransaction(base64 as Base64)
 *     if (!r.isOk()) throw r.error
 *     return { networkTxId: r.value.transactionId, broadcast: r.value }
 *   },
 * })
 * const state = useWalletConnector(connector)
 * ```
 *
 * Requires MetaMask Flask with the Qubic Snap installed (`npm:@qubic-lib/qubic-mm-snap`).
 */
export function createMetaMaskSnapConnector(
  options: MetaMaskSnapConnectorOptions = {},
): WalletConnector {
  const snapId = options.snapId ?? DEFAULT_SNAP_ID
  const accountIndex = options.accountIndex ?? 0
  const getIdentityMethod = options.getIdentityMethod ?? 'getIdentity'

  const listeners = new Map<WalletConnectorEvent, Set<EventCallback>>()

  // Eagerly check Snaps support so isAvailable() can be synchronous.
  let snapsAvailable = false
  hasSnapsSupport().then((v) => {
    snapsAvailable = v
  })

  async function invokeSnap<T>(method: string, params?: unknown): Promise<T> {
    return getEthereum().request<T>({
      method: 'wallet_invokeSnap',
      params: { snapId, request: { method, params } },
    })
  }

  return {
    id: 'metamask-snap',

    isAvailable(): boolean {
      return snapsAvailable
    },

    async connect(_options?: ConnectOptions): Promise<WalletAccount> {
      const ethereum = getEthereum()
      if (!(await hasSnapsSupport())) {
        throw new Error('MetaMask Flask required — standard MetaMask does not support Snaps')
      }

      // Install (or reconnect to) the snap.
      await ethereum.request({
        method: 'wallet_requestSnaps',
        params: { [snapId]: {} },
      })

      return this.getAccount().then((acc) => {
        if (!acc) throw new Error('MetaMask Snap: could not retrieve identity after connect')
        return acc
      })
    },

    async getAccount(): Promise<WalletAccount | null> {
      try {
        const result = await invokeSnap<{ identity?: string } | string>(getIdentityMethod, {
          accountIndex,
        })
        const identity = typeof result === 'string' ? result : result?.identity
        if (!identity) return null
        return { identity: identity as Identity }
      } catch {
        return null
      }
    },

    async disconnect(): Promise<void> {
      // MetaMask Snaps have no disconnect concept — clear locally.
      for (const cb of listeners.get('disconnect') ?? []) cb(undefined)
    },

    async signTransaction(tx: unknown): Promise<SignTransactionResult> {
      const result = await invokeSnap<{
        txId?: string
        targetTick?: number
        txBytesBase64?: string
        txBytesHex?: string
        signedTx?: string
      }>('signTransaction', {
        ...(tx as object),
        accountIdx: accountIndex,
      })

      return {
        txId: result.txId ?? '',
        targetTick: result.targetTick ?? 0,
        txBytesBase64: result.txBytesBase64 ?? result.signedTx ?? '',
        txBytesHex: result.txBytesHex ?? '',
      }
    },

    async sendTransaction(tx: unknown): Promise<SendTransactionResult> {
      if (!options.broadcast) {
        throw new Error(
          'MetaMask Snap connector: provide a `broadcast` function in options to use sendTransaction',
        )
      }
      const signed = await this.signTransaction(tx)
      const { networkTxId, broadcast } = await options.broadcast(signed.txBytesBase64)
      return { ...signed, networkTxId, broadcast }
    },

    async signMessage(message: unknown): Promise<SignMessageResult> {
      return invokeSnap<SignMessageResult>('signMessage', { ...(message as object), accountIndex })
    },

    on(event: WalletConnectorEvent, callback: EventCallback): () => void {
      const set = listeners.get(event) ?? new Set()
      set.add(callback)
      listeners.set(event, set)
      return () => set.delete(callback)
    },
  }
}
