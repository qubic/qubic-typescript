import { kt128 } from '@noble/hashes/sha3-addons.js'

/**
 * Computes a KangarooTwelve (KT128) hash.
 *
 * @param input - The payload to hash.
 * @param outputLength - Desired output length in bytes.
 * @returns The K12 digest.
 */
export function k12(input: Uint8Array, outputLength = 32): Uint8Array {
  return kt128(input, { dkLen: outputLength })
}
