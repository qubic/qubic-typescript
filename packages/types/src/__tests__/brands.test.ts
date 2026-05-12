import { describe, expect, test } from 'bun:test'
import { InvalidIdentityError, InvalidSeedError, InvalidTxHashError } from '../errors.js'
import {
  isIdentity,
  isSeed,
  isTxHash,
  toBase64,
  toIdentity,
  toSeed,
  toTxHash,
} from '../brands.js'

const VALID_IDENTITY = 'A'.repeat(60)
const VALID_SEED = 'a'.repeat(55)
const VALID_TX_HASH = 'a'.repeat(60)

describe('toIdentity', () => {
  test('accepts exactly 60 uppercase letters', () => {
    expect(() => toIdentity(VALID_IDENTITY)).not.toThrow()
    expect(toIdentity(VALID_IDENTITY)).toBe(VALID_IDENTITY)
  })

  test('rejects 59 characters', () => {
    expect(() => toIdentity('A'.repeat(59))).toThrow(InvalidIdentityError)
  })

  test('rejects 61 characters', () => {
    expect(() => toIdentity('A'.repeat(61))).toThrow(InvalidIdentityError)
  })

  test('rejects lowercase letters', () => {
    expect(() => toIdentity('a'.repeat(60))).toThrow(InvalidIdentityError)
  })

  test('rejects digits', () => {
    expect(() => toIdentity('1'.repeat(60))).toThrow(InvalidIdentityError)
  })
})

describe('toSeed', () => {
  test('accepts exactly 55 lowercase letters', () => {
    expect(() => toSeed(VALID_SEED)).not.toThrow()
    expect(toSeed(VALID_SEED)).toBe(VALID_SEED)
  })

  test('rejects 54 characters', () => {
    expect(() => toSeed('a'.repeat(54))).toThrow(InvalidSeedError)
  })

  test('rejects 56 characters', () => {
    expect(() => toSeed('a'.repeat(56))).toThrow(InvalidSeedError)
  })

  test('rejects uppercase letters', () => {
    expect(() => toSeed('A'.repeat(55))).toThrow(InvalidSeedError)
  })

  test('rejects digits', () => {
    expect(() => toSeed('1'.repeat(55))).toThrow(InvalidSeedError)
  })
})

describe('toTxHash', () => {
  test('accepts exactly 60 lowercase letters', () => {
    expect(() => toTxHash(VALID_TX_HASH)).not.toThrow()
    expect(toTxHash(VALID_TX_HASH)).toBe(VALID_TX_HASH)
  })

  test('rejects wrong length', () => {
    expect(() => toTxHash('a'.repeat(59))).toThrow(InvalidTxHashError)
    expect(() => toTxHash('a'.repeat(61))).toThrow(InvalidTxHashError)
  })

  test('rejects uppercase', () => {
    expect(() => toTxHash('A'.repeat(60))).toThrow(InvalidTxHashError)
  })
})

describe('toBase64', () => {
  test('accepts valid base64', () => {
    expect(() => toBase64('SGVsbG8=')).not.toThrow()
    expect(() => toBase64('dGVzdA==')).not.toThrow()
    expect(() => toBase64('AAAA')).not.toThrow()
  })

  test('rejects invalid characters', () => {
    expect(() => toBase64('hello!')).toThrow()
  })
})

describe('isIdentity', () => {
  test('returns true for valid identity', () => {
    expect(isIdentity(VALID_IDENTITY)).toBe(true)
  })

  test('returns false for wrong length', () => {
    expect(isIdentity('A'.repeat(59))).toBe(false)
    expect(isIdentity('A'.repeat(61))).toBe(false)
  })

  test('returns false for lowercase', () => {
    expect(isIdentity('a'.repeat(60))).toBe(false)
  })
})

describe('isSeed', () => {
  test('returns true for valid seed', () => {
    expect(isSeed(VALID_SEED)).toBe(true)
  })

  test('returns false for wrong length', () => {
    expect(isSeed('a'.repeat(54))).toBe(false)
    expect(isSeed('a'.repeat(56))).toBe(false)
  })

  test('returns false for uppercase', () => {
    expect(isSeed('A'.repeat(55))).toBe(false)
  })
})

describe('isTxHash', () => {
  test('returns true for valid tx hash', () => {
    expect(isTxHash(VALID_TX_HASH)).toBe(true)
  })

  test('returns false for wrong length', () => {
    expect(isTxHash('a'.repeat(59))).toBe(false)
  })
})
