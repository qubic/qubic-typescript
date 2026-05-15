import type { Wallet } from '@qubic.ts/wallet'
import { createWallet, unlockVault } from '@qubic.ts/wallet'
import type { VaultData } from '@qubic.ts/wallet'
import { useCallback, useState } from 'react'

export interface UseVaultResult {
  /** Wallets derived from the vault after unlock. Undefined while locked. */
  wallets: readonly Wallet[] | undefined
  /** True after a successful unlock. */
  isUnlocked: boolean
  /** True while the vault is being decrypted. */
  isUnlocking: boolean
  /** Error from the last unlock attempt (wrong password, corrupt vault, etc.) */
  error: Error | undefined
  /**
   * Decrypt the vault with the given password and derive wallets.
   * Seeds are decrypted transiently, wallets are derived, and seeds
   * immediately fall out of scope — they are never stored in React state.
   */
  unlock(password: string): Promise<void>
  /** Clears derived wallets from memory. */
  lock(): void
}

/**
 * Manages a Qubic encrypted vault in React.
 * Call `unlock(password)` to decrypt and derive `Wallet` objects.
 * Seeds are never stored in React state — only their derived wallets.
 *
 * @example
 * ```tsx
 * const { wallets, isUnlocked, unlock, lock, error } = useVault(vaultData)
 *
 * // Unlock
 * await unlock('my-password')
 *
 * // Use wallet
 * const [wallet] = wallets ?? []
 * const { encoded } = await wallet?.buildTransfer({ destination, amount, targetTick })
 * ```
 */
export function useVault(vaultData: VaultData): UseVaultResult {
  const [wallets, setWallets] = useState<readonly Wallet[] | undefined>(undefined)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  const unlock = useCallback(
    async (password: string) => {
      setIsUnlocking(true)
      setError(undefined)
      try {
        const seeds = await unlockVault(vaultData, password)
        // Derive wallets immediately; seeds remain only in wallet closures for signing.
        setWallets(seeds.map((s) => createWallet(s)))
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
      } finally {
        setIsUnlocking(false)
      }
    },
    [vaultData],
  )

  const lock = useCallback(() => {
    setWallets(undefined)
    setError(undefined)
  }, [])

  return {
    wallets,
    isUnlocked: wallets !== undefined,
    isUnlocking,
    error,
    unlock,
    lock,
  }
}
