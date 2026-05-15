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
  // Rejection sampling: discard bytes >= 234 (highest multiple of 26 that fits in 0-255 is
  // 9*26=234). Without this, bytes 234-255 create ~2% bias toward 'a'-'f'.
  const ALPHABET_SIZE = 26
  const REJECT_THRESHOLD = 256 - (256 % ALPHABET_SIZE) // 234

  let seed = ''
  while (seed.length < 55) {
    const bytes = getRandomBytes(Math.ceil((55 - seed.length) * 1.1 + 8))
    for (const byte of bytes) {
      if (byte >= REJECT_THRESHOLD) continue
      seed += String.fromCharCode(97 + (byte % ALPHABET_SIZE))
      if (seed.length === 55) break
    }
  }

  if (seed.length !== 55 || !/^[a-z]+$/.test(seed)) {
    throw new InvalidSeedError(seed)
  }
  return seed as Seed
}
