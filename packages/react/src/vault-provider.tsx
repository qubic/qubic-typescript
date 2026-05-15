import type { Identity } from '@qubic.ts/types'
import type { Wallet } from '@qubic.ts/wallet'
import { createWallet, unlockVault } from '@qubic.ts/wallet'
import type { VaultData } from '@qubic.ts/wallet'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

// ── Public context (exported via useVaultState) ───────────────────────────────

export interface VaultStateValue {
  /** Whether the vault has been unlocked and wallets are in memory. */
  isUnlocked: boolean
  /** True while the vault is being decrypted. */
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
  /** Remove all wallets from memory. Call on logout or session end. */
  lock(): void
}

const VaultStateContext = createContext<VaultStateValue | undefined>(undefined)

// ── Internal signing context (NOT exported from the package) ──────────────────

export interface VaultSigningValue {
  getWallet(identity: Identity): Wallet | undefined
}

// Exported only within this module — hooks in this package import it directly.
export const VaultSigningContext = createContext<VaultSigningValue | undefined>(undefined)

// ── Provider ──────────────────────────────────────────────────────────────────

export interface VaultProviderProps {
  vaultData: VaultData
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
 * Seeds are never stored in React state — wallets live in a Ref.
 * Child hooks (useSendTransfer, useSendContractCall) access signing internally;
 * components only see identities via useVaultState().
 *
 * @example
 * ```tsx
 * <QubicProvider liveClient={live}>
 *   <VaultProvider vaultData={vault} autoLockMs={15 * 60_000}>
 *     <App />
 *   </VaultProvider>
 * </QubicProvider>
 * ```
 */
export function VaultProvider({ vaultData, autoLockMs, children }: VaultProviderProps) {
  // Wallets are stored in a Ref: invisible to React dev tools, not serialisable,
  // not part of the render cycle — minimises accidental exposure.
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
  }, [])

  const resetLockTimer = useCallback(() => {
    clearTimeout(lockTimerRef.current)
    if (autoLockMs != null) {
      lockTimerRef.current = setTimeout(performLock, autoLockMs)
    }
  }, [autoLockMs, performLock])

  // Lock when the page becomes hidden (tab switch, minimise, etc.)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) performLock()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [performLock])

  // Clear timer on unmount
  useEffect(() => () => clearTimeout(lockTimerRef.current), [])

  const unlock = useCallback(
    async (password: string) => {
      setIsUnlocking(true)
      setError(undefined)
      try {
        const seeds = await unlockVault(vaultData, password)
        const newMap = new Map<Identity, Wallet>()
        const ids: Identity[] = []
        for (const seed of seeds) {
          const wallet = createWallet(seed)
          newMap.set(wallet.identity, wallet)
          ids.push(wallet.identity)
        }
        walletsRef.current = newMap
        setIdentities(ids)
        resetLockTimer()
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
      } finally {
        setIsUnlocking(false)
      }
    },
    [vaultData, resetLockTimer],
  )

  const signingValue: VaultSigningValue = {
    getWallet: (identity) => walletsRef.current.get(identity),
  }

  const stateValue: VaultStateValue = {
    isUnlocked,
    isUnlocking,
    identities,
    error,
    unlock,
    lock: performLock,
  }

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
