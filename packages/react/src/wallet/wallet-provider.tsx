import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  ConnectOptions,
  SendTransactionResult,
  SignMessageResult,
  SignTransactionResult,
  WalletAccount,
  WalletConnector,
} from '../connectors/connector.js'

// ── Context ───────────────────────────────────────────────────────────────────

export interface WalletContextValue {
  /** All registered connectors — use connector.isAvailable() to filter in UI. */
  connectors: readonly WalletConnector[]
  /** Currently connected account, or null. */
  account: WalletAccount | null
  /** The connector that established the current connection. */
  activeConnector: WalletConnector | null
  isConnected: boolean
  isConnecting: boolean
  error: Error | undefined
  /**
   * Connect via a specific connector. For WalletConnect, pass `onUri` to show the QR code:
   * ```ts
   * connect('walletconnect', { onUri: (uri) => setQrUri(uri) })
   * ```
   */
  connect(connectorId: string, options?: ConnectOptions): Promise<void>
  disconnect(): Promise<void>
  sendTransaction(tx: unknown): Promise<SendTransactionResult>
  signTransaction(tx: unknown): Promise<SignTransactionResult>
  signMessage(message: unknown): Promise<SignMessageResult>
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined)

// ── Provider ──────────────────────────────────────────────────────────────────

export interface WalletProviderProps {
  /** List of connectors to offer. Pass a stable array (created outside the component). */
  connectors: WalletConnector[]
  /**
   * localStorage key used to remember which connector was active across page loads.
   * Default: 'qubic-active-connector'.
   */
  storageKey?: string
  children: ReactNode
}

/**
 * Manages multi-connector wallet state. Wrap your app (or the section that needs wallet access)
 * with this provider and use useWallet() in any child component.
 *
 * @example
 * ```tsx
 * import { extensionConnector, createWalletConnectConnector, WalletProvider } from '@qubic.org/react'
 * import SignClient from '@walletconnect/sign-client'
 *
 * const connectors = [
 *   extensionConnector,
 *   createWalletConnectConnector({
 *     createClient: () => SignClient.init({ projectId: '…', metadata: { … } }),
 *   }),
 * ]
 *
 * <WalletProvider connectors={connectors}>
 *   <App />
 * </WalletProvider>
 * ```
 */
export function WalletProvider({
  connectors,
  storageKey = 'qubic-active-connector',
  children,
}: WalletProviderProps) {
  const [account, setAccount] = useState<WalletAccount | null>(null)
  const [activeConnectorId, setActiveConnectorId] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  const activeConnector = connectors.find((c) => c.id === activeConnectorId) ?? null

  // Active event subscriptions — cleaned up when connector changes or on unmount.
  const unsubsRef = useRef<(() => void)[]>([])

  const clearSubs = useCallback(() => {
    for (const unsub of unsubsRef.current) unsub()
    unsubsRef.current = []
  }, [])

  const subscribeToConnector = useCallback(
    (connector: WalletConnector) => {
      clearSubs()

      const unsubAccount = connector.on('accountChanged', (payload) => {
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
      })

      const unsubDisconnect = connector.on('disconnect', () => {
        clearSubs()
        setAccount(null)
        setActiveConnectorId(null)
        try {
          localStorage.removeItem(storageKey)
        } catch {
          // ignore
        }
      })

      unsubsRef.current = [unsubAccount, unsubDisconnect]
    },
    [clearSubs, storageKey],
  )

  // ── Session restore on mount ───────────────────────────────────────────────

  useEffect(() => {
    let mounted = true
    void (async () => {
      let savedId: string | null = null
      try {
        savedId = localStorage.getItem(storageKey)
      } catch {
        return
      }
      if (!savedId) return
      const connector = connectors.find((c) => c.id === savedId)
      if (!connector?.isAvailable()) return
      try {
        const acc = await connector.getAccount()
        if (!acc || !mounted) return
        setAccount(acc)
        setActiveConnectorId(savedId)
        subscribeToConnector(connector)
      } catch {
        // silently ignore — stale session
      }
    })()
    return () => {
      mounted = false
    }
  }, [connectors, storageKey, subscribeToConnector])

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => clearSubs, [clearSubs])

  // ── Actions ────────────────────────────────────────────────────────────────

  const connect = useCallback(
    async (connectorId: string, options?: ConnectOptions) => {
      const connector = connectors.find((c) => c.id === connectorId)
      if (!connector) throw new Error(`WalletProvider: no connector with id "${connectorId}"`)

      setIsConnecting(true)
      setError(undefined)
      try {
        const acc = await connector.connect(options)
        setAccount(acc)
        setActiveConnectorId(connectorId)
        try {
          localStorage.setItem(storageKey, connectorId)
        } catch {
          // ignore
        }
        subscribeToConnector(connector)
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
      } finally {
        setIsConnecting(false)
      }
    },
    [connectors, storageKey, subscribeToConnector],
  )

  const disconnect = useCallback(async () => {
    setError(undefined)
    clearSubs()
    try {
      await activeConnector?.disconnect()
    } catch {
      // ignore connector errors on disconnect
    }
    setAccount(null)
    setActiveConnectorId(null)
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // ignore
    }
  }, [activeConnector, clearSubs, storageKey])

  const sendTransaction = useCallback(
    (tx: unknown): Promise<SendTransactionResult> => {
      if (!activeConnector) throw new Error('WalletProvider: no active connector')
      return activeConnector.sendTransaction(tx)
    },
    [activeConnector],
  )

  const signTransaction = useCallback(
    (tx: unknown): Promise<SignTransactionResult> => {
      if (!activeConnector) throw new Error('WalletProvider: no active connector')
      return activeConnector.signTransaction(tx)
    },
    [activeConnector],
  )

  const signMessage = useCallback(
    (message: unknown): Promise<SignMessageResult> => {
      if (!activeConnector) throw new Error('WalletProvider: no active connector')
      return activeConnector.signMessage(message)
    },
    [activeConnector],
  )

  const value = useMemo<WalletContextValue>(
    () => ({
      connectors,
      account,
      activeConnector,
      isConnected: account !== null,
      isConnecting,
      error,
      connect,
      disconnect,
      sendTransaction,
      signTransaction,
      signMessage,
    }),
    [
      connectors,
      account,
      activeConnector,
      isConnecting,
      error,
      connect,
      disconnect,
      sendTransaction,
      signTransaction,
      signMessage,
    ],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Returns wallet connection state and actions. Must be used inside WalletProvider.
 *
 * @example
 * ```tsx
 * function ConnectModal() {
 *   const { connectors, isConnected, account, connect, disconnect, error } = useWallet()
 *
 *   if (isConnected) {
 *     return (
 *       <div>
 *         <p>{account?.name ?? account?.identity}</p>
 *         <button onClick={disconnect}>Disconnect</button>
 *       </div>
 *     )
 *   }
 *
 *   return (
 *     <div>
 *       {connectors.filter(c => c.isAvailable()).map(c => (
 *         <button key={c.id} onClick={() => connect(c.id)}>
 *           {c.id}
 *         </button>
 *       ))}
 *       {error && <p>{error.message}</p>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext)
  if (ctx === undefined) throw new Error('useWallet must be used inside WalletProvider')
  return ctx
}
