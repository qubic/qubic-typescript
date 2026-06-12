import { generateRandomSeed } from '@qubic.org/crypto'
import { isSeed, toSeed } from '@qubic.org/types'
import type { Seed } from '@qubic.org/types'

/**
 * Generates a cryptographically secure random 55-character Qubic seed.
 *
 * Convenience wrapper around `generateRandomSeed()` from `@qubic.org/crypto`.
 *
 * @example
 * ```ts
 * const seed = generateSeed()
 * const wallet = createWallet(seed)
 * ```
 */
export function generateSeed(): Seed {
  return generateRandomSeed()
}

/**
 * Returns true if `s` is a valid Qubic seed (55 lowercase letters).
 *
 * Convenience wrapper around `isSeed()` from `@qubic.org/types`.
 */
export function validateSeed(s: string): s is Seed {
  return isSeed(s)
}

/**
 * Validates and brands a string as a `Seed`.
 *
 * Re-exported from `@qubic.org/types`.
 *
 * @throws {InvalidSeedError} If not exactly 55 lowercase letters.
 */
export { toSeed }
