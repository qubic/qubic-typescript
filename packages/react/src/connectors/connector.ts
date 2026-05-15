import type { BroadcastTransactionResponse } from '@qubic.org/rpc'
import type { Identity } from '@qubic.org/types'

export interface WalletAccount {
  identity: Identity
  name?: string
}

export interface SignTransactionResult {
  txId: string
  targetTick: number
  txBytesBase64: string
  txBytesHex: string
}

export interface SendTransactionResult extends SignTransactionResult {
  networkTxId: string
  broadcast: BroadcastTransactionResponse
}

export interface SignMessageResult {
  signatureHex: string
  digestHex: string
}

export type WalletConnectorEvent = 'accountChanged' | 'disconnect'

/**
 * Options passed to WalletConnector.connect().
 * Connectors that require an out-of-band pairing step (WalletConnect QR code)
 * call onUri so the app can display it.
 */
export interface ConnectOptions {
  /** Called with the pairing URI to display as a QR code (WalletConnect only). */
  onUri?: (uri: string) => void
}

/**
 * Unified wallet connector interface. Implement this to add new wallet backends
 * (WalletConnect, MetaMask Snap, etc.) that work with useWalletConnector.
 */
export interface WalletConnector {
  /** Stable identifier, e.g. "qubic-extension", "walletconnect", "metamask-snap". */
  readonly id: string
  /** Returns true when the wallet backend is present in this environment. */
  isAvailable(): boolean
  connect(options?: ConnectOptions): Promise<WalletAccount>
  getAccount(): Promise<WalletAccount | null>
  disconnect(): Promise<void>
  sendTransaction(tx: unknown): Promise<SendTransactionResult>
  signTransaction(tx: unknown): Promise<SignTransactionResult>
  signMessage(message: unknown): Promise<SignMessageResult>
  /** Subscribe to a wallet event. Returns an unsubscribe function. */
  on(event: WalletConnectorEvent, callback: (payload: unknown) => void): () => void
}
