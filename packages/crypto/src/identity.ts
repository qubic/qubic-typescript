import type { Identity, Seed } from './brands.js'
import { InvalidIdentityError, InvalidSeedError } from './errors.js'
import { pointMarshal, scalarBaseMult } from './fourq.js'
import { k12 } from './k12.js'

const SEED_LENGTH = 55
const IDENTITY_LENGTH = 60

export interface DerivedKeys {
  subseed: Uint8Array
  privateKey: Uint8Array
  publicKey: Uint8Array
}

/**
 * Derives subseed, private key, and public key from a seed.
 *
 * @param seed - 55-character lowercase Qubic seed.
 * @returns Derived cryptographic keys.
 * @throws {InvalidSeedError} If seed is not exactly 55 lowercase letters.
 */
export function deriveKeys(seed: Seed): DerivedKeys {
  if (seed.length !== SEED_LENGTH || !/^[a-z]+$/.test(seed)) {
    throw new InvalidSeedError(seed)
  }

  const seedBytes = new Uint8Array(SEED_LENGTH)
  for (let i = 0; i < SEED_LENGTH; i++) {
    seedBytes[i] = seed.charCodeAt(i) - 97
  }
  const subseed = k12(seedBytes, 32)
  const privateKey = k12(subseed, 32)
  const publicKey = pointMarshal(scalarBaseMult(privateKey))

  return { subseed, privateKey, publicKey }
}

/**
 * Encodes a 32-byte public key into a 60-character Qubic identity string.
 *
 * @param publicKey - 32-byte compressed FourQ public key.
 * @returns The uppercase identity string.
 * @throws {Error} If publicKey is not 32 bytes.
 */
export function publicKeyToIdentity(publicKey: Uint8Array): Identity {
  if (publicKey.byteLength !== 32) {
    throw new InvalidIdentityError('Public keys must be exactly 32 bytes')
  }

  const identity = new Uint16Array(IDENTITY_LENGTH)
  const view = new DataView(publicKey.buffer, publicKey.byteOffset, 32)

  for (let fragmentIndex = 0; fragmentIndex < 4; fragmentIndex++) {
    let fragment = view.getBigUint64(fragmentIndex * 8, true)
    for (let digitIndex = 0; digitIndex < 14; digitIndex++) {
      identity[fragmentIndex * 14 + digitIndex] = Number(fragment % 26n) + 65
      fragment /= 26n
    }
  }

  const checksum = encodeChecksum(publicKey)
  for (let i = 0; i < 4; i++) {
    identity[56 + i] = checksum[i] as number
  }

  return String.fromCharCode(...identity) as Identity
}

/**
 * Decodes a 60-character Qubic identity back into its 32-byte public key.
 *
 * @param identity - 60-character uppercase identity string.
 * @returns The 32-byte public key.
 * @throws {InvalidIdentityError} If the identity is malformed or checksum fails.
 */
export function identityToPublicKey(identity: Identity): Uint8Array {
  if (identity.length !== IDENTITY_LENGTH || !/^[A-Z]+$/.test(identity)) {
    throw new InvalidIdentityError(identity)
  }

  const publicKey = new Uint8Array(32)
  const view = new DataView(publicKey.buffer)

  for (let fragmentIndex = 0; fragmentIndex < 4; fragmentIndex++) {
    let fragment = 0n
    for (let digitIndex = 13; digitIndex >= 0; digitIndex--) {
      const charCode = identity.charCodeAt(fragmentIndex * 14 + digitIndex)
      fragment = fragment * 26n + BigInt(charCode - 65)
    }
    view.setBigUint64(fragmentIndex * 8, fragment, true)
  }

  const expectedChecksum = encodeChecksum(publicKey)
  for (let i = 0; i < 4; i++) {
    if (identity.charCodeAt(56 + i) !== (expectedChecksum[i] as number)) {
      throw new InvalidIdentityError(identity)
    }
  }

  return publicKey
}

/**
 * Returns true when the identity has valid shape and checksum.
 *
 * Unlike the structural brand helpers in `@qubic.org/types`, this performs the
 * full round-trip checksum validation used by the Qubic identity format.
 */
export function isValidIdentityChecksum(identity: string): identity is Identity {
  try {
    identityToPublicKey(identity as Identity)
    return true
  } catch {
    return false
  }
}

function encodeChecksum(publicKey: Uint8Array): number[] {
  const checksumBytes = k12(publicKey, 3)
  let checksum =
    BigInt(checksumBytes[0] as number) |
    (BigInt(checksumBytes[1] as number) << 8n) |
    (BigInt(checksumBytes[2] as number) << 16n)
  checksum &= 0x3ffffn
  const output = new Array<number>(4)

  for (let i = 0; i < 4; i++) {
    output[i] = Number(checksum % 26n) + 65
    checksum /= 26n
  }

  return output
}

/**
 * Returns the deterministic Qubic identity for a smart contract at a given index.
 *
 * Contract addresses are the identity of a 32-byte little-endian integer equal
 * to the contractIndex — i.e. index 1 → publicKey [1,0,...,0].
 *
 * @param contractIndex - Integer contract index (1-based, must be ≥ 1).
 * @returns The 60-character uppercase identity string.
 */
export function contractIndexToIdentity(contractIndex: number): Identity {
  if (!Number.isInteger(contractIndex) || contractIndex < 1) {
    throw new Error(`contractIndex must be a positive integer, got ${contractIndex}`)
  }
  const publicKey = new Uint8Array(32)
  new DataView(publicKey.buffer).setUint32(0, contractIndex, true)
  return publicKeyToIdentity(publicKey)
}
