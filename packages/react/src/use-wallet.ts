import type { Seed } from '@qubic.ts/types'
import { createWallet } from '@qubic.ts/wallet'
import type { Wallet } from '@qubic.ts/wallet'
import { useMemo } from 'react'

/**
 * Derives a Wallet from a seed. The Wallet is re-created only when the seed changes.
 *
 * @throws {InvalidSeedError} if the seed is malformed.
 * @example
 * ```tsx
 * const wallet = useWallet(seed)
 * const { encoded } = await wallet.buildTransfer({ destination, amount, targetTick })
 * ```
 */
export function useWallet(seed: Seed): Wallet {
  return useMemo(() => createWallet(seed), [seed])
}
