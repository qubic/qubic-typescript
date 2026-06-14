import { describe, expect, test } from 'bun:test'
import { isIdentity, isSeed, isTxHash, toBase64, toIdentity, toSeed, toTxHash } from '../brands.js'
import {
  InvalidBase64Error,
  InvalidIdentityError,
  InvalidSeedError,
  InvalidTxHashError,
} from '../errors.js'

const VALID_IDENTITY = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFXIB'
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

  test('only checks identity structure, not checksum', () => {
    expect(() => toIdentity('A'.repeat(60))).not.toThrow()
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

  // --- New padding edge case tests ---

  test('accepts strings needing 0 padding chars (length divisible by 4, no padding)', () => {
    // "sure" encodes to "c3VyZQ==" but "surem" -> "c3VyZW0=" ...
    // 3 bytes -> 4 base64 chars, no padding: e.g. btoa('abc') = 'YWJj'
    expect(() => toBase64('YWJj')).not.toThrow() // btoa('abc') = 'YWJj', 0 pad chars
    expect(toBase64('YWJj')).toBe('YWJj')
  })

  test('accepts strings needing 1 padding char', () => {
    // btoa('ab') = 'YWI=' — 1 padding char
    expect(() => toBase64('YWI=')).not.toThrow()
    expect(toBase64('YWI=')).toBe('YWI=')
  })

  test('accepts strings needing 2 padding chars', () => {
    // btoa('a') = 'YQ==' — 2 padding chars
    expect(() => toBase64('YQ==')).not.toThrow()
    expect(toBase64('YQ==')).toBe('YQ==')
  })

  test('accepts empty string as valid base64', () => {
    // Empty string: length 0, 0 % 4 === 0, passes regex
    expect(() => toBase64('')).not.toThrow()
    expect(toBase64('')).toBe('')
  })

  test('rejects strings with wrong length (not multiple of 4)', () => {
    expect(() => toBase64('YWJ')).toThrow(InvalidBase64Error) // 3 chars
    expect(() => toBase64('YW')).toThrow(InvalidBase64Error) // 2 chars
    expect(() => toBase64('Y')).toThrow(InvalidBase64Error) // 1 char
  })

  test('rejects strings with padding in wrong position', () => {
    expect(() => toBase64('=YWJ')).toThrow(InvalidBase64Error)
    expect(() => toBase64('Y=WJ')).toThrow(InvalidBase64Error)
  })

  test('rejects strings with more than 2 padding chars', () => {
    expect(() => toBase64('Y===')).toThrow(InvalidBase64Error)
  })

  test('accepts base64 with + and / characters', () => {
    // btoa('i\xB7\xBB') = 'abc/' (conceptual) — test + and / in the alphabet
    expect(() => toBase64('ab+/')).not.toThrow()
    expect(() => toBase64('a/c=')).not.toThrow()
  })

  test('rejects base64url characters (- and _)', () => {
    expect(() => toBase64('ab-_')).toThrow(InvalidBase64Error)
  })

  test('rejects whitespace in base64', () => {
    expect(() => toBase64('YW Jj')).toThrow(InvalidBase64Error)
    expect(() => toBase64('YWJj\n')).toThrow(InvalidBase64Error)
  })

  test('accepts longer valid base64 strings', () => {
    // btoa('Hello, World!') = 'SGVsbG8sIFdvcmxkIQ=='
    expect(() => toBase64('SGVsbG8sIFdvcmxkIQ==')).not.toThrow()
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
