import type {
  ConnectOptions,
  SendTransactionResult,
  SignMessageResult,
  SignTransactionResult,
  WalletAccount,
  WalletConnector,
  WalletConnectorEvent,
} from './connector.js'

// Duck-typed subset of @walletconnect/sign-client we actually use.
// The user creates a SignClient and passes it in — no @walletconnect import needed here.
interface WcNamespace {
  accounts: string[]
  methods: string[]
  events: string[]
}

interface WcSession {
  topic: string
  namespaces: { qubic?: WcNamespace } & Record<string, WcNamespace | undefined>
}

interface WcSignClient {
  connect(options: {
    requiredNamespaces: Record<string, { chains: string[]; methods: string[]; events: string[] }>
  }): Promise<{ uri?: string; approval(): Promise<WcSession> }>
  disconnect(options: { topic: string; reason: { code: number; message: string } }): Promise<void>
  request<T>(options: {
    topic: string
    chainId: string
    request: { method: string; params: unknown }
  }): Promise<T>
  session: { get(topic: string): WcSession | undefined }
  on(event: string, callback: () => void): void
  off(event: string, callback: () => void): void
}

export interface WalletConnectConnectorOptions {
  /** Qubic chain identifier. Default: 'qubic:mainnet'. */
  chainId?: string
  /** sessionStorage / localStorage key for session persistence. Default: 'qubic-wc-session'. */
  sessionStorageKey?: string
}

// WalletConnect method names used by Qubic wallets.
const WC_METHODS = {
  requestAccounts: 'qubic_requestAccounts',
  signTransaction: 'qubic_signTransaction',
  sendTransaction: 'qubic_sendQubic',
  sign: 'qubic_sign',
} as const

interface WcAccount {
  address: string
  alias?: string
}

type EventCallback = (payload: unknown) => void

/**
 * WalletConnector implementation for WalletConnect v2 (Qubic namespace).
 *
 * Usage:
 * ```ts
 * import SignClient from '@walletconnect/sign-client'
 * import { createWalletConnectConnector } from '@qubic.ts/react'
 *
 * const client = await SignClient.init({ projectId: '...', metadata: { ... } })
 * const connector = createWalletConnectConnector(client)
 *
 * // In a component:
 * const state = useWalletConnector(connector)
 * // Pass onUri to display the QR code:
 * state.connect({ onUri: (uri) => setQrUri(uri) })
 * ```
 *
 * Peer dependency: `@walletconnect/sign-client` — install it in your app.
 */
export function createWalletConnectConnector(
  signClient: WcSignClient,
  options: WalletConnectConnectorOptions = {},
): WalletConnector {
  const chainId = options.chainId ?? 'qubic:mainnet'
  const sessionKey = options.sessionStorageKey ?? 'qubic-wc-session'

  const listeners = new Map<WalletConnectorEvent, Set<EventCallback>>()

  function emit(event: WalletConnectorEvent, payload?: unknown) {
    for (const cb of listeners.get(event) ?? []) cb(payload)
  }

  function restoreSessionTopic(): string | null {
    try {
      const stored = localStorage.getItem(sessionKey)
      if (!stored) return null
      const session = signClient.session.get(stored)
      return session ? stored : null
    } catch {
      return null
    }
  }

  function saveSessionTopic(topic: string) {
    try {
      localStorage.setItem(sessionKey, topic)
    } catch {
      // ignore
    }
  }

  function clearSessionTopic() {
    try {
      localStorage.removeItem(sessionKey)
    } catch {
      // ignore
    }
  }

  function accountFromNamespaces(session: WcSession): WalletAccount | null {
    const ns = session.namespaces.qubic
    if (!ns?.accounts?.length) return null
    // Format: "qubic:mainnet:<identity>"
    const raw = ns.accounts[0]
    if (!raw) return null
    const parts = raw.split(':')
    const identity = parts[parts.length - 1]
    if (!identity) return null
    return { identity }
  }

  // Wire up session lifecycle events once.
  const handleSessionEnd = () => {
    clearSessionTopic()
    emit('disconnect')
  }
  signClient.on('session_delete', handleSessionEnd)
  signClient.on('session_expire', handleSessionEnd)

  return {
    id: 'walletconnect',

    isAvailable(): boolean {
      return true
    },

    async connect(connectOptions?: ConnectOptions): Promise<WalletAccount> {
      // Try to reuse existing session first.
      const existing = restoreSessionTopic()
      if (existing) {
        const session = signClient.session.get(existing)
        if (session) {
          const account = accountFromNamespaces(session)
          if (account) return account
        }
      }

      const { uri, approval } = await signClient.connect({
        requiredNamespaces: {
          qubic: {
            chains: [chainId],
            methods: Object.values(WC_METHODS),
            events: ['accountsChanged', 'amountChanged'],
          },
        },
      })

      if (uri) connectOptions?.onUri?.(uri)

      const session = await approval()
      saveSessionTopic(session.topic)

      const account = accountFromNamespaces(session)
      if (!account) throw new Error('WalletConnect: no account in session namespaces')
      return account
    },

    async getAccount(): Promise<WalletAccount | null> {
      const topic = restoreSessionTopic()
      if (!topic) return null

      try {
        const accounts = await signClient.request<WcAccount[]>({
          topic,
          chainId,
          request: {
            method: WC_METHODS.requestAccounts,
            params: { nonce: Date.now().toString() },
          },
        })
        const first = accounts[0]
        if (!first) return null
        const acc: WalletAccount = { identity: first.address }
        if (first.alias) acc.name = first.alias
        return acc
      } catch {
        return null
      }
    },

    async disconnect(): Promise<void> {
      const topic = restoreSessionTopic()
      clearSessionTopic()
      if (topic) {
        await signClient
          .disconnect({ topic, reason: { code: 6000, message: 'User disconnected' } })
          .catch(() => {})
      }
    },

    async sendTransaction(tx: unknown): Promise<SendTransactionResult> {
      const topic = restoreSessionTopic()
      if (!topic) throw new Error('WalletConnect: not connected')
      return signClient.request<SendTransactionResult>({
        topic,
        chainId,
        request: { method: WC_METHODS.sendTransaction, params: tx },
      })
    },

    async signTransaction(tx: unknown): Promise<SignTransactionResult> {
      const topic = restoreSessionTopic()
      if (!topic) throw new Error('WalletConnect: not connected')
      return signClient.request<SignTransactionResult>({
        topic,
        chainId,
        request: { method: WC_METHODS.signTransaction, params: tx },
      })
    },

    async signMessage(message: unknown): Promise<SignMessageResult> {
      const topic = restoreSessionTopic()
      if (!topic) throw new Error('WalletConnect: not connected')
      return signClient.request<SignMessageResult>({
        topic,
        chainId,
        request: { method: WC_METHODS.sign, params: message },
      })
    },

    on(event: WalletConnectorEvent, callback: EventCallback): () => void {
      const set = listeners.get(event) ?? new Set()
      set.add(callback)
      listeners.set(event, set)
      return () => set.delete(callback)
    },
  }
}
