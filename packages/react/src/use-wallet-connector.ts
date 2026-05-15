import { useCallback, useEffect, useState } from 'react'
import type {
  SendTransactionResult,
  SignMessageResult,
  SignTransactionResult,
  WalletAccount,
  WalletConnector,
} from './connector.js'

export interface WalletConnectorState {
  /** Whether the wallet backend is present in this environment. */
  isAvailable: boolean
  /** True when an account is connected. */
  isConnected: boolean
  /** True while connect() is in progress. */
  isConnecting: boolean
  /** The connected account, or null if not connected. */
  account: WalletAccount | null
  /** Error from the last connect/disconnect attempt. */
  error: Error | undefined
  connect(): Promise<void>
  disconnect(): Promise<void>
  sendTransaction(tx: unknown): Promise<SendTransactionResult>
  signTransaction(tx: unknown): Promise<SignTransactionResult>
  signMessage(message: unknown): Promise<SignMessageResult>
}

/**
 * Manages connection state for any WalletConnector (extension, WalletConnect, etc.).
 * SSR-safe: availability is checked after mount, not during render.
 *
 * @example
 * ```tsx
 * import { extensionConnector, useWalletConnector } from '@qubic.ts/react'
 *
 * function ConnectButton() {
 *   const { isAvailable, isConnected, isConnecting, account, connect, disconnect } =
 *     useWalletConnector(extensionConnector)
 *
 *   if (!isAvailable) return <p>Install the Qubic extension</p>
 *   if (!isConnected) return <button onClick={connect} disabled={isConnecting}>Connect</button>
 *   return (
 *     <div>
 *       <p>{account?.name ?? account?.identity}</p>
 *       <button onClick={disconnect}>Disconnect</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useWalletConnector(connector: WalletConnector): WalletConnectorState {
  const [isAvailable, setIsAvailable] = useState(false)
  const [account, setAccount] = useState<WalletAccount | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  // Availability check after mount — safe for SSR.
  useEffect(() => {
    setIsAvailable(connector.isAvailable())
  }, [connector])

  // Auto-fetch account when the connector becomes available.
  useEffect(() => {
    if (!isAvailable) return
    connector
      .getAccount()
      .then(setAccount)
      .catch(() => setAccount(null))
  }, [connector, isAvailable])

  // Subscribe to wallet events.
  useEffect(() => {
    if (!isAvailable) return

    const handleAccountChanged = (payload: unknown) => {
      if (payload && typeof payload === 'object') {
        const record = payload as Partial<WalletAccount>
        if (typeof record.identity === 'string') {
          const acc: WalletAccount = { identity: record.identity }
          if (record.name) acc.name = record.name
          setAccount(acc)
          return
        }
      }
      setAccount(null)
    }

    const handleDisconnect = () => {
      setAccount(null)
    }

    const unsubAccount = connector.on('accountChanged', handleAccountChanged)
    const unsubDisconnect = connector.on('disconnect', handleDisconnect)

    return () => {
      unsubAccount()
      unsubDisconnect()
    }
  }, [connector, isAvailable])

  const connect = useCallback(async () => {
    setIsConnecting(true)
    setError(undefined)
    try {
      const acc = await connector.connect()
      setAccount(acc)
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setIsConnecting(false)
    }
  }, [connector])

  const disconnect = useCallback(async () => {
    setError(undefined)
    try {
      await connector.disconnect()
      setAccount(null)
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
    }
  }, [connector])

  const sendTransaction = useCallback((tx: unknown) => connector.sendTransaction(tx), [connector])

  const signTransaction = useCallback((tx: unknown) => connector.signTransaction(tx), [connector])

  const signMessage = useCallback((message: unknown) => connector.signMessage(message), [connector])

  return {
    isAvailable,
    isConnected: account !== null,
    isConnecting,
    account,
    error,
    connect,
    disconnect,
    sendTransaction,
    signTransaction,
    signMessage,
  }
}
