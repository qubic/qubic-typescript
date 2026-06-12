import type { Identity } from '@qubic.org/types'
import type {
  ConnectOptions,
  SendTransactionResult,
  SignMessageResult,
  SignTransactionResult,
  TransactionRequest,
  WalletAccount,
  WalletConnector,
  WalletConnectorEvent,
} from './connector.js'

type WindowQubic = {
  isQubic: true
  connect(): Promise<{ connected: true; origin: string }>
  getAccount(): Promise<{ identity: string; name?: string } | null>
  disconnect(): Promise<{ disconnected: true }>
  sendTransaction(tx: unknown): Promise<SendTransactionResult>
  signTransaction(tx: unknown): Promise<SignTransactionResult>
  signMessage(message: unknown): Promise<SignMessageResult>
  on(event: string, callback: (payload: unknown) => void): () => void
  off(event: string, callback: (payload: unknown) => void): void
}

type WindowWithQubic = typeof globalThis & { qubic?: WindowQubic }

function getProvider(): WindowQubic {
  const p = (globalThis as WindowWithQubic).qubic
  if (!p?.isQubic) throw new Error('Qubic extension not available')
  return p
}

/**
 * WalletConnector implementation for the Qubic browser extension (window.qubic).
 *
 * Usage:
 * ```tsx
 * const state = useWalletConnector(extensionConnector)
 * ```
 */
export const extensionConnector: WalletConnector = {
  id: 'qubic-extension',

  isAvailable(): boolean {
    return (globalThis as WindowWithQubic).qubic?.isQubic === true
  },

  async connect(_options?: ConnectOptions): Promise<WalletAccount> {
    const provider = getProvider()
    await provider.connect()
    const account = await provider.getAccount()
    if (!account) throw new Error('No account after connect')
    return { ...account, identity: account.identity as Identity }
  },

  async getAccount(): Promise<WalletAccount | null> {
    const account = await getProvider().getAccount()
    if (!account) return null
    return { ...account, identity: account.identity as Identity }
  },

  async disconnect(): Promise<void> {
    await getProvider().disconnect()
  },

  sendTransaction(tx: TransactionRequest): Promise<SendTransactionResult> {
    return getProvider().sendTransaction(tx)
  },

  signTransaction(tx: TransactionRequest): Promise<SignTransactionResult> {
    return getProvider().signTransaction(tx)
  },

  signMessage(message: string): Promise<SignMessageResult> {
    return getProvider().signMessage(message)
  },

  on(event: WalletConnectorEvent, callback: (payload: unknown) => void): () => void {
    return getProvider().on(event, callback)
  },
}

