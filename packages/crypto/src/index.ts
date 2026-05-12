export type { Brand, Identity, Seed } from './brands.js'
export {
  InvalidIdentityError,
  InvalidSeedError,
  QubicCryptoError,
  SignatureVerificationError,
} from './errors.js'
export { k12 } from './k12.js'
export { generateRandomSeed, getRandomBytes } from './random.js'
export { identityToPublicKey, publicKeyToIdentity } from './identity.js'

import type { Identity, Seed } from './brands.js'
import { deriveKeys, publicKeyToIdentity } from './identity.js'
import { sign as schnorrqSign, verify as schnorrqVerify } from './schnorrq.js'

/**
 * Derives the Qubic identity string from a seed.
 *
 * @param seed - 55-character lowercase seed.
 * @returns The 60-character uppercase identity.
 * @throws {InvalidSeedError} If the seed is invalid.
 * @example
 * ```ts
 * const identity = deriveIdentityFromSeed(seed)
 * ```
 */
export function deriveIdentityFromSeed(seed: Seed): Identity {
  const { publicKey } = deriveKeys(seed)
  return publicKeyToIdentity(publicKey)
}

/**
 * Derives the 32-byte public key from a seed.
 *
 * @param seed - 55-character lowercase seed.
 * @returns 32-byte compressed FourQ public key.
 * @throws {InvalidSeedError} If the seed is invalid.
 */
export function publicKeyFromSeed(seed: Seed): Uint8Array {
  return deriveKeys(seed).publicKey
}

/**
 * Signs a message using SchnorrQ with the given seed.
 *
 * @param message - The message to sign (typically a 32-byte digest).
 * @param seed - 55-character lowercase seed.
 * @returns 64-byte SchnorrQ signature.
 * @throws {InvalidSeedError} If the seed is invalid.
 * @example
 * ```ts
 * const digest = k12(txBytes, 32)
 * const signature = await sign(digest, seed)
 * ```
 */
export async function sign(message: Uint8Array, seed: Seed): Promise<Uint8Array> {
  const { subseed, publicKey } = deriveKeys(seed)
  return schnorrqSign(subseed, publicKey, message)
}

/**
 * Verifies a SchnorrQ signature.
 *
 * @param message - The message that was signed.
 * @param signature - 64-byte signature.
 * @param publicKey - 32-byte public key.
 * @returns true if the signature is valid.
 * @example
 * ```ts
 * const valid = verify(digest, signature, publicKey)
 * ```
 */
export function verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean {
  return schnorrqVerify(publicKey, message, signature)
}
