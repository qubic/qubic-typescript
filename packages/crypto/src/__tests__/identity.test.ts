import { describe, expect, test } from 'bun:test'
import type { Identity, Seed } from '../brands.js'
import { InvalidIdentityError, InvalidSeedError } from '../errors.js'
import {
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
    const corrupt = identity.slice(0, 56) + 'AAAA'
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
