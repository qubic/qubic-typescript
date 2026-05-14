import { generateRandomSeed } from '@qubic.ts/crypto'
import { isSeed, toSeed } from '@qubic.ts/types'
import type { Seed } from '@qubic.ts/types'

/**
 * Generates a cryptographically secure random 55-character Qubic seed.
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
 */
export function validateSeed(s: string): s is Seed {
  return isSeed(s)
}

/**
 * Validates and brands a string as a `Seed`.
 * @throws {InvalidSeedError} If not exactly 55 lowercase letters.
 */
export { toSeed }
