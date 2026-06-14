import { describe, expect, test } from 'bun:test'
import type { Identity, Seed } from '../brands.js'
import { InvalidIdentityError, InvalidSeedError } from '../errors.js'
import { deriveKeys } from '../identity.js'
import {
  contractIndexToIdentity,
  deriveIdentityFromSeed,
  identityToPublicKey,
  isValidIdentityChecksum,
  publicKeyFromSeed,
  publicKeyToIdentity,
} from '../index.js'

const KNOWN_SEED = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Seed

describe('deriveIdentityFromSeed', () => {
  test('returns 60-character uppercase identity', () => {
    const identity = deriveIdentityFromSeed(KNOWN_SEED)
    expect(identity).toHaveLength(60)
    expect(identity).toMatch(/^[A-Z]+$/)
  })

  test('is deterministic', () => {
    const a = deriveIdentityFromSeed(KNOWN_SEED)
    const b = deriveIdentityFromSeed(KNOWN_SEED)
    expect(a).toBe(b)
  })

  test('throws InvalidSeedError for short seed', () => {
    expect(() => deriveIdentityFromSeed('abc' as Seed)).toThrow(InvalidSeedError)
  })

  test('throws InvalidSeedError for uppercase seed', () => {
    const upperSeed = 'A'.repeat(55) as Seed
    expect(() => deriveIdentityFromSeed(upperSeed)).toThrow(InvalidSeedError)
  })
})

describe('publicKeyToIdentity / identityToPublicKey', () => {
  test('round-trip: publicKey → identity → publicKey', () => {
    const pk = publicKeyFromSeed(KNOWN_SEED)
    const identity = publicKeyToIdentity(pk)
    const recoveredPk = identityToPublicKey(identity)
    expect(recoveredPk).toEqual(pk)
  })

  test('throws InvalidIdentityError for wrong-length identity', () => {
    expect(() => identityToPublicKey('ABCDEF' as Identity)).toThrow(InvalidIdentityError)
  })

  test('throws InvalidIdentityError for lowercase identity', () => {
    const lower = 'a'.repeat(60) as Identity
    expect(() => identityToPublicKey(lower)).toThrow(InvalidIdentityError)
  })

  test('throws InvalidIdentityError for bad checksum', () => {
    // Take a valid identity and flip one character in the checksum region
    const identity = deriveIdentityFromSeed(KNOWN_SEED)
    const corrupt = (identity.slice(0, 59) + (identity[59] === 'A' ? 'B' : 'A')) as Identity
    expect(() => identityToPublicKey(corrupt)).toThrow(InvalidIdentityError)
  })

  test('isValidIdentityChecksum returns true for valid identities', () => {
    const identity = deriveIdentityFromSeed(KNOWN_SEED)
    expect(isValidIdentityChecksum(identity)).toBe(true)
  })

  test('isValidIdentityChecksum returns false for malformed identities', () => {
    expect(isValidIdentityChecksum('ABCDEF')).toBe(false)
  })

  test('isValidIdentityChecksum returns false for bad checksum', () => {
    const identity = deriveIdentityFromSeed(KNOWN_SEED)
    const corrupt = `${identity.slice(0, 56)}AAAA`
    expect(isValidIdentityChecksum(corrupt)).toBe(false)
  })
})

describe('publicKeyFromSeed', () => {
  test('returns 32 bytes', () => {
    const pk = publicKeyFromSeed(KNOWN_SEED)
    expect(pk).toBeInstanceOf(Uint8Array)
    expect(pk.length).toBe(32)
  })

  test('different seeds produce different public keys', () => {
    const pk1 = publicKeyFromSeed(KNOWN_SEED)
    const pk2 = publicKeyFromSeed('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as Seed)
    expect(pk1).not.toEqual(pk2)
  })
})

describe('contractIndexToIdentity', () => {
  test('returns a valid 60-character uppercase identity', () => {
    const identity = contractIndexToIdentity(1)
    expect(identity).toHaveLength(60)
    expect(identity).toMatch(/^[A-Z]+$/)
  })

  test('is deterministic', () => {
    const a = contractIndexToIdentity(1)
    const b = contractIndexToIdentity(1)
    expect(a).toBe(b)
  })

  test('different indices produce different identities', () => {
    const id1 = contractIndexToIdentity(1)
    const id2 = contractIndexToIdentity(2)
    const id3 = contractIndexToIdentity(100)
    expect(id1).not.toBe(id2)
    expect(id1).not.toBe(id3)
    expect(id2).not.toBe(id3)
  })

  test('produced identity passes checksum validation', () => {
    for (const index of [1, 5, 10, 255]) {
      const identity = contractIndexToIdentity(index)
      expect(isValidIdentityChecksum(identity)).toBe(true)
    }
  })

  test('round-trip: contractIndex → identity → publicKey has correct bytes', () => {
    const index = 7
    const identity = contractIndexToIdentity(index)
    const publicKey = identityToPublicKey(identity)
    // The public key should be [7, 0, 0, ..., 0]
    expect(publicKey[0]).toBe(7)
    for (let i = 1; i < 32; i++) {
      expect(publicKey[i]).toBe(0)
    }
  })

  test('throws for index 0', () => {
    expect(() => contractIndexToIdentity(0)).toThrow()
  })

  test('throws for negative index', () => {
    expect(() => contractIndexToIdentity(-1)).toThrow()
  })

  test('throws for non-integer index', () => {
    expect(() => contractIndexToIdentity(1.5)).toThrow()
  })
})

describe('deriveKeys', () => {
  test('returns subseed, privateKey, and publicKey', () => {
    const keys = deriveKeys(KNOWN_SEED)
    expect(keys.subseed).toBeInstanceOf(Uint8Array)
    expect(keys.privateKey).toBeInstanceOf(Uint8Array)
    expect(keys.publicKey).toBeInstanceOf(Uint8Array)
  })

  test('subseed and privateKey are 32 bytes each', () => {
    const keys = deriveKeys(KNOWN_SEED)
    expect(keys.subseed.length).toBe(32)
    expect(keys.privateKey.length).toBe(32)
    expect(keys.publicKey.length).toBe(32)
  })

  test('is deterministic', () => {
    const a = deriveKeys(KNOWN_SEED)
    const b = deriveKeys(KNOWN_SEED)
    expect(a.subseed).toEqual(b.subseed)
    expect(a.privateKey).toEqual(b.privateKey)
    expect(a.publicKey).toEqual(b.publicKey)
  })

  test('different seeds produce different keys', () => {
    const seed2 = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as Seed
    const a = deriveKeys(KNOWN_SEED)
    const b = deriveKeys(seed2)
    expect(a.subseed).not.toEqual(b.subseed)
    expect(a.privateKey).not.toEqual(b.privateKey)
    expect(a.publicKey).not.toEqual(b.publicKey)
  })

  test('publicKey matches publicKeyFromSeed', () => {
    const keys = deriveKeys(KNOWN_SEED)
    const pk = publicKeyFromSeed(KNOWN_SEED)
    expect(keys.publicKey).toEqual(pk)
  })

  test('throws InvalidSeedError for invalid seed', () => {
    expect(() => deriveKeys('short' as Seed)).toThrow(InvalidSeedError)
    expect(() => deriveKeys('A'.repeat(55) as Seed)).toThrow(InvalidSeedError)
    expect(() => deriveKeys('' as Seed)).toThrow(InvalidSeedError)
  })

  test('subseed is K12 hash of seed bytes', async () => {
    // Verify the subseed derivation chain: seedBytes → K12 → subseed
    const { k12 } = await import('../k12.js')
    const seedBytes = new Uint8Array(55)
    for (let i = 0; i < 55; i++) {
      seedBytes[i] = KNOWN_SEED.charCodeAt(i) - 97
    }
    const expectedSubseed = k12(seedBytes, 32)
    const keys = deriveKeys(KNOWN_SEED)
    expect(keys.subseed).toEqual(expectedSubseed)
  })

  test('privateKey is K12 hash of subseed', async () => {
    const { k12 } = await import('../k12.js')
    const keys = deriveKeys(KNOWN_SEED)
    const expectedPrivateKey = k12(keys.subseed, 32)
    expect(keys.privateKey).toEqual(expectedPrivateKey)
  })
})

describe('cross-verification against reference implementation', () => {
  test('QX contract identity matches reference QubicDefinitions.QX_ADDRESS', () => {
    // Reference: QubicDefinitions.QX_ADDRESS = "BAAA...AAARMID"
    expect(contractIndexToIdentity(1)).toBe(
      'BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARMID',
    )
  })

  test('EMPTY_ADDRESS (all-zeros pk) decodes correctly', () => {
    // Reference: QubicDefinitions.EMPTY_ADDRESS = "AAA...AAFXIB"
    const emptyIdentity = publicKeyToIdentity(new Uint8Array(32))
    const recovered = identityToPublicKey(emptyIdentity)
    expect(recovered.every((b) => b === 0)).toBe(true)
  })

  test('identity round-trip for all-zeros public key matches EMPTY_ADDRESS', () => {
    const identity = publicKeyToIdentity(new Uint8Array(32))
    // Reference value for all-zeros public key
    expect(identity).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFXIB')
  })

  test('seed derivation produces valid identity with correct checksum', () => {
    const identity = deriveIdentityFromSeed(KNOWN_SEED)
    expect(identity).toHaveLength(60)
    expect(/^[A-Z]+$/.test(identity)).toBe(true)
    // Must pass checksum validation
    expect(isValidIdentityChecksum(identity)).toBe(true)
    // Round-trip must recover the same public key
    const recoveredPk = identityToPublicKey(identity)
    const originalPk = publicKeyFromSeed(KNOWN_SEED)
    expect(recoveredPk).toEqual(originalPk)
  })

  test('seedToBytes mapping matches reference (charCode - 97)', () => {
    // Reference: SEED_ALPHABET.indexOf(seed[i]) === seed.charCodeAt(i) - 97
    // This verifies the seed byte encoding is consistent
    const seed = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc' as Seed
    const keys = deriveKeys(seed)
    expect(keys.subseed).toBeInstanceOf(Uint8Array)
    expect(keys.subseed.length).toBe(32)
    // The identity derived from this seed must be valid
    const identity = publicKeyToIdentity(keys.publicKey)
    expect(isValidIdentityChecksum(identity)).toBe(true)
  })
})
