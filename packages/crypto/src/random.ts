import type { Seed } from './brands.js'
import { InvalidSeedError } from './errors.js'

/**
 * Generates cryptographically secure random bytes using the Web Crypto API.
 *
 * @param length - Number of bytes to generate.
 * @returns Random bytes.
 * @throws {RangeError} If length is not positive.
 */
export function getRandomBytes(length: number): Uint8Array {
  if (length <= 0) throw new RangeError('Random byte length must be greater than 0')
  const array = new Uint8Array(length)
  globalThis.crypto.getRandomValues(array)
  return array
}

/**
 * Generates a cryptographically secure random 55-character Qubic seed.
 *
 * @returns A random Seed of 55 lowercase letters.
 * @example
 * ```ts
 * const seed = generateRandomSeed()
 * // → "xjklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl"
 * ```
 */
export function generateRandomSeed(): Seed {
  const bytes = getRandomBytes(55)
  let seed = ''
  for (const byte of bytes) {
    seed += String.fromCharCode(97 + (byte % 26))
  }
  if (seed.length !== 55 || !/^[a-z]+$/.test(seed)) {
    throw new InvalidSeedError(seed)
  }
  return seed as Seed
}
