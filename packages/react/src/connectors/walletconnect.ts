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

// Duck-typed subset of @walletconnect/sign-client — no import needed.
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

// Qubic WalletConnect method names.
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

export interface WalletConnectConnectorOptions {
  /**
   * Factory called once — lazily on the first connect() — to create and
   * initialize the SignClient. This avoids blocking app startup.
   *
   * @example
   * createClient: () => SignClient.init({ projectId: '…', metadata: { … } })
   */
  createClient: () => Promise<WcSignClient>
  /** Qubic chain identifier. Default: 'qubic:mainnet'. */
  chainId?: string
  /** localStorage key used to persist the session topic. Default: 'qubic-wc-session'. */
  sessionStorageKey?: string
}

/**
 * WalletConnector for WalletConnect v2 (Qubic namespace).
 * The SignClient is initialized lazily on first connect() — no upfront await needed.
 *
 * Requires `@walletconnect/sign-client` installed in your app.
 *
 * @example
 * ```ts
 * import SignClient from '@walletconnect/sign-client'
 * import { createWalletConnectConnector } from '@qubic.org/react'
 *
 * const wcConnector = createWalletConnectConnector({
 *   createClient: () => SignClient.init({ projectId: 'YOUR_ID', metadata: { … } }),
 * })
 * ```
 */
export function createWalletConnectConnector(
  options: WalletConnectConnectorOptions,
): WalletConnector {
  const chainId = options.chainId ?? 'qubic:mainnet'
  const sessionKey = options.sessionStorageKey ?? 'qubic-wc-session'

  const listeners = new Map<WalletConnectorEvent, Set<EventCallback>>()

  function emit(event: WalletConnectorEvent, payload?: unknown) {
    for (const cb of listeners.get(event) ?? []) cb(payload)
  }

  // Lazy client — initialized once on first use.
  let clientPromise: Promise<WcSignClient> | null = null

  async function getClient(): Promise<WcSignClient> {
    if (!clientPromise) {
      clientPromise = options
        .createClient()
        .then((client) => {
          client.on('session_delete', () => {
            clearSavedTopic()
            emit('disconnect')
          })
          client.on('session_expire', () => {
            clearSavedTopic()
            emit('disconnect')
          })
          return client
        })
        .catch((err: unknown) => {
          clientPromise = null // allow retry on next call
          throw err
        })
    }
    return clientPromise
  }

  // ── Session topic helpers ──────────────────────────────────────────────────

  function getSavedTopic(): string | null {
    try {
      return localStorage.getItem(sessionKey)
    } catch {
      return null
    }
  }

  function saveTopic(topic: string) {
    try {
      localStorage.setItem(sessionKey, topic)
    } catch {
      // ignore
    }
  }

  function clearSavedTopic() {
    try {
      localStorage.removeItem(sessionKey)
    } catch {
      // ignore
    }
  }

  function accountFromSession(session: WcSession): WalletAccount | null {
    const ns = session.namespaces.qubic
    if (!ns?.accounts?.length) return null
    const raw = ns.accounts[0]
    if (!raw) return null
    // Format: "qubic:mainnet:<identity>"
    const identity = raw.split(':').at(-1)
    if (!identity) return null
    return { identity: identity as Identity }
  }

  // ── Connector ──────────────────────────────────────────────────────────────

  return {
    id: 'walletconnect',

    isAvailable(): boolean {
      return true
    },

    async connect(connectOptions?: ConnectOptions): Promise<WalletAccount> {
      // Reuse existing session if valid.
      const savedTopic = getSavedTopic()
      if (savedTopic) {
        const client = await getClient()
        const existing = client.session.get(savedTopic)
        if (existing) {
          const account = accountFromSession(existing)
          if (account) return account
        }
        clearSavedTopic()
      }

      const client = await getClient()
      const { uri, approval } = await client.connect({
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
      saveTopic(session.topic)

      const account = accountFromSession(session)
      if (!account) throw new Error('WalletConnect: no account in session namespaces')
      return account
    },

    async getAccount(): Promise<WalletAccount | null> {
      const savedTopic = getSavedTopic()
      if (!savedTopic) return null

      try {
        const client = await getClient()
        const session = client.session.get(savedTopic)
        if (!session) {
          clearSavedTopic()
          return null
        }

        const accounts = await client.request<WcAccount[]>({
          topic: savedTopic,
          chainId,
          request: {
            method: WC_METHODS.requestAccounts,
            params: { nonce: Date.now().toString() },
          },
        })

        const first = accounts[0]
        if (!first) return null
        const acc: WalletAccount = { identity: first.address as Identity }
        if (first.alias) acc.name = first.alias
        return acc
      } catch {
        return null
      }
    },

    async disconnect(): Promise<void> {
      const topic = getSavedTopic()
      clearSavedTopic()
      if (topic) {
        try {
          const client = await getClient()
          await client.disconnect({ topic, reason: { code: 6000, message: 'User disconnected' } })
        } catch {
          // ignore — session may already be gone
        }
      }
    },

    async sendTransaction(tx: unknown): Promise<SendTransactionResult> {
      const topic = getSavedTopic()
      if (!topic) throw new Error('WalletConnect: not connected')
      const client = await getClient()
      return client.request<SendTransactionResult>({
        topic,
        chainId,
        request: { method: WC_METHODS.sendTransaction, params: tx },
      })
    },

    async signTransaction(tx: unknown): Promise<SignTransactionResult> {
      const topic = getSavedTopic()
      if (!topic) throw new Error('WalletConnect: not connected')
      const client = await getClient()
      return client.request<SignTransactionResult>({
        topic,
        chainId,
        request: { method: WC_METHODS.signTransaction, params: tx },
      })
    },

    async signMessage(message: unknown): Promise<SignMessageResult> {
      const topic = getSavedTopic()
      if (!topic) throw new Error('WalletConnect: not connected')
      const client = await getClient()
      return client.request<SignMessageResult>({
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
