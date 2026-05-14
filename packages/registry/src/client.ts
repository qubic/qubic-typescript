import { getAbi, getAbiHistory, getCurrentAbi } from './registry.js'
import type { AbiLookupResult, ContractAbiVersion, ContractRegistry } from './types.js'

export interface RegistryClientOptions {
  /** Remote registry.json URL. Default: 'https://registry.qubic.ts/registry.json' */
  url?: string
  /** Caching strategy. Default: 'session' */
  cache?: 'none' | 'session' | 'persistent'
  /** TTL in ms for cached registry. Default: 3_600_000 (1 hour) */
  ttlMs?: number
  /** Custom fetch implementation (for testing or proxying). */
  fetch?: typeof globalThis.fetch
}

export interface RegistryClient {
  getAbi(contractIndex: number, epoch: number): Promise<AbiLookupResult>
  getCurrentAbi(contractIndex: number): Promise<ContractAbiVersion>
  getAbiHistory(contractIndex: number): Promise<ContractAbiVersion[]>
  /** Returns the full raw registry for custom use. */
  getRegistry(): Promise<ContractRegistry>
}

const DEFAULT_URL = 'https://registry.qubic.ts/registry.json'
const DEFAULT_TTL = 3_600_000

/** Module-level session cache shared across all clients in the same process. */
let sessionCache: { registry: ContractRegistry; expiresAt: number } | undefined

/**
 * Creates a client that fetches registry.json from a remote URL and caches it.
 *
 * Cache modes:
 *   'session':    module-level variable (server) or sessionStorage (browser)
 *   'persistent': localStorage (browser) or Bun.file cache (server)
 *   'none':       always fetch fresh
 */
export function createRegistryClient(options: RegistryClientOptions = {}): RegistryClient {
  const url = options.url ?? DEFAULT_URL
  const cacheMode = options.cache ?? 'session'
  const ttlMs = options.ttlMs ?? DEFAULT_TTL
  const fetchFn = options.fetch ?? globalThis.fetch

  const STORAGE_KEY = `@qubic.ts/registry:${url}`

  async function fetchRegistry(): Promise<ContractRegistry> {
    const res = await fetchFn(url)
    if (!res.ok) throw new Error(`Failed to fetch registry: HTTP ${res.status}`)
    return (await res.json()) as ContractRegistry
  }

  async function load(): Promise<ContractRegistry> {
    const now = Date.now()

    if (cacheMode === 'session') {
      if (sessionCache && now < sessionCache.expiresAt) return sessionCache.registry
      if (typeof globalThis.sessionStorage !== 'undefined') {
        try {
          const raw = globalThis.sessionStorage.getItem(STORAGE_KEY)
          if (raw) {
            const cached = JSON.parse(raw) as { registry: ContractRegistry; expiresAt: number }
            if (now < cached.expiresAt) {
              sessionCache = cached
              return cached.registry
            }
          }
        } catch {
          /* ignore storage errors */
        }
      }
    } else if (cacheMode === 'persistent') {
      if (typeof globalThis.localStorage !== 'undefined') {
        try {
          const raw = globalThis.localStorage.getItem(STORAGE_KEY)
          if (raw) {
            const cached = JSON.parse(raw) as { registry: ContractRegistry; expiresAt: number }
            if (now < cached.expiresAt) return cached.registry
          }
        } catch {
          /* ignore storage errors */
        }
      }
    }

    const registry = await fetchRegistry()
    const entry = { registry, expiresAt: now + ttlMs }

    if (cacheMode === 'session') {
      sessionCache = entry
      if (typeof globalThis.sessionStorage !== 'undefined') {
        try {
          globalThis.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
        } catch {
          /* ignore quota errors */
        }
      }
    } else if (cacheMode === 'persistent') {
      if (typeof globalThis.localStorage !== 'undefined') {
        try {
          globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
        } catch {
          /* ignore quota errors */
        }
      }
    }

    return registry
  }

  return {
    async getAbi(contractIndex, epoch) {
      return getAbi(await load(), contractIndex, epoch)
    },
    async getCurrentAbi(contractIndex) {
      return getCurrentAbi(await load(), contractIndex)
    },
    async getAbiHistory(contractIndex) {
      return getAbiHistory(await load(), contractIndex)
    },
    async getRegistry() {
      return load()
    },
  }
}
