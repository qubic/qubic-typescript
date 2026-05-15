import type { Identity, Seed } from '@qubic.org/types'
import type { Wallet } from '@qubic.org/wallet'
import { createWallet, unlockVault } from '@qubic.org/wallet'
import type { VaultData } from '@qubic.org/wallet'
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
import { clearSession, restoreSession, saveSession } from './session-store.js'

const DEFAULT_SESSION_KEY = 'qubic-session'

// Pure module-level helper — no hook deps needed.
function buildWalletMap(seeds: Seed[]): { map: Map<Identity, Wallet>; ids: Identity[] } {
  const map = new Map<Identity, Wallet>()
  const ids: Identity[] = []
  for (const seed of seeds) {
    const wallet = createWallet(seed)
    map.set(wallet.identity, wallet)
    ids.push(wallet.identity)
  }
  return { map, ids }
}

// ── Public context (exported via useVaultState) ───────────────────────────────

export interface VaultStateValue {
  /** Whether the vault has been unlocked and wallets are in memory. */
  isUnlocked: boolean
  /** True while the vault is being decrypted or a session is being restored. */
  isUnlocking: boolean
  /** Identities derived from the vault. Safe to expose in component code. */
  identities: readonly Identity[]
  /** Error from the last unlock attempt. */
  error: Error | undefined
  /**
   * Decrypt the vault with the given password and load wallets into memory.
   * Seeds are decrypted transiently; wallets are derived immediately and the
   * seeds fall out of scope. Seeds and wallets are stored in a Ref —
   * never in React state, never serialisable by dev tools.
   */
  unlock(password: string): Promise<void>
  /** Remove all wallets from memory and clear any active session. */
  lock(): void
}

const VaultStateContext = createContext<VaultStateValue | undefined>(undefined)

// ── Internal signing context (NOT exported from the package barrel) ───────────

export interface VaultSigningValue {
  getWallet(identity: Identity): Wallet | undefined
}

export const VaultSigningContext = createContext<VaultSigningValue | undefined>(undefined)

// ── Provider ──────────────────────────────────────────────────────────────────

export interface VaultProviderProps {
  vaultData: VaultData
  /**
   * Persist the session across page refreshes using a non-extractable
   * AES-GCM CryptoKey in IndexedDB and an encrypted seed payload in
   * sessionStorage. The session is automatically revoked when the tab closes
   * (sessionStorage is tab-scoped). Keys rotate on every restore (forward secrecy).
   *
   * Default: false.
   */
  persistSession?: boolean
  /**
   * sessionStorage key used to store the encrypted session payload.
   * Override if you need multiple independent vaults on the same origin.
   * Default: 'qubic-session'.
   */
  sessionStorageKey?: string
  /**
   * Auto-lock after this many milliseconds of inactivity.
   * Resets on every unlock. Also locks when the page is hidden.
   * Omit to disable auto-lock.
   */
  autoLockMs?: number
  children: ReactNode
}

/**
 * Manages an encrypted Qubic vault for child components.
 *
 * Security properties:
 * - Wallets live in a Ref, never in React state (invisible to DevTools).
 * - Components only see identities (strings) via useVaultState().
 * - useSendTransfer / useSendContractCall sign internally — no wallet exposure.
 * - Auto-locks on page hide and after a configurable idle timeout.
 * - With persistSession: keys are non-extractable (XSS-resistant), session
 *   expires on tab close, keys rotate on restore (forward secrecy).
 *
 * @example
 * ```tsx
 * <QubicProvider liveClient={live}>
 *   <VaultProvider vaultData={vault} persistSession autoLockMs={15 * 60_000}>
 *     <App />
 *   </VaultProvider>
 * </QubicProvider>
 * ```
 */
export function VaultProvider({
  vaultData,
  persistSession = false,
  sessionStorageKey = DEFAULT_SESSION_KEY,
  autoLockMs,
  children,
}: VaultProviderProps) {
  // Wallets stored in a Ref: invisible to DevTools, not serialisable,
  // not part of the render cycle.
  const walletsRef = useRef<Map<Identity, Wallet>>(new Map())

  const [identities, setIdentities] = useState<readonly Identity[]>([])
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const isUnlocked = identities.length > 0

  const performLock = useCallback(() => {
    clearTimeout(lockTimerRef.current)
    walletsRef.current.clear()
    setIdentities([])
    setError(undefined)
    if (persistSession) clearSession(sessionStorageKey).catch(() => {})
  }, [persistSession, sessionStorageKey])

  const resetLockTimer = useCallback(() => {
    clearTimeout(lockTimerRef.current)
    if (autoLockMs != null) {
      lockTimerRef.current = setTimeout(performLock, autoLockMs)
    }
  }, [autoLockMs, performLock])

  // ── Session restore on mount ────────────────────────────────────────────────

  useEffect(() => {
    if (!persistSession) return
    let mounted = true
    setIsUnlocking(true)
    restoreSession(sessionStorageKey)
      .then(async (seeds) => {
        if (!mounted || !seeds) return
        const { map, ids } = buildWalletMap(seeds)
        walletsRef.current = map
        setIdentities(ids)
        // Re-save with fresh rotated key (restoreSession deleted the old key).
        await saveSession(seeds, sessionStorageKey)
        resetLockTimer()
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setIsUnlocking(false)
      })
    return () => {
      mounted = false
    }
  }, [persistSession, sessionStorageKey, resetLockTimer])

  // ── Lock on page hide ───────────────────────────────────────────────────────

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) performLock()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [performLock])

  // ── Clear timer on unmount ──────────────────────────────────────────────────

  useEffect(() => () => clearTimeout(lockTimerRef.current), [])

  // ── Unlock ──────────────────────────────────────────────────────────────────

  const unlock = useCallback(
    async (password: string) => {
      setIsUnlocking(true)
      setError(undefined)
      try {
        const seeds = await unlockVault(vaultData, password)
        // Save session before seeds go out of scope.
        if (persistSession) await saveSession(seeds, sessionStorageKey)
        const { map, ids } = buildWalletMap(seeds)
        walletsRef.current = map
        setIdentities(ids)
        resetLockTimer()
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
      } finally {
        setIsUnlocking(false)
      }
    },
    [vaultData, persistSession, sessionStorageKey, resetLockTimer],
  )

  // ── Context values ──────────────────────────────────────────────────────────

  // signingValue wraps a ref — stable across renders, no deps needed.
  const signingValue = useMemo<VaultSigningValue>(
    () => ({ getWallet: (identity) => walletsRef.current.get(identity) }),
    [],
  )

  const stateValue = useMemo<VaultStateValue>(
    () => ({ isUnlocked, isUnlocking, identities, error, unlock, lock: performLock }),
    [isUnlocked, isUnlocking, identities, error, unlock, performLock],
  )

  return (
    <VaultSigningContext.Provider value={signingValue}>
      <VaultStateContext.Provider value={stateValue}>{children}</VaultStateContext.Provider>
    </VaultSigningContext.Provider>
  )
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Returns vault state: identities, lock/unlock controls, loading and error state.
 * Must be called inside a VaultProvider.
 */
export function useVaultState(): VaultStateValue {
  const ctx = useContext(VaultStateContext)
  if (ctx === undefined) throw new Error('useVaultState must be used inside VaultProvider')
  return ctx
}

/**
 * Internal hook — access signing capability without exposing wallets.
 * NOT exported from the package barrel.
 */
export function useVaultSigning(): VaultSigningValue {
  const ctx = useContext(VaultSigningContext)
  if (ctx === undefined) throw new Error('useVaultSigning must be used inside VaultProvider')
  return ctx
}
