import { describe, expect, test } from 'bun:test'
import {
  InvalidBase64Error,
  InvalidIdentityError,
  InvalidSeedError,
  InvalidTxHashError,
  QubicError,
} from '../errors.js'

describe('QubicError', () => {
  test('is abstract and cannot be instantiated directly', () => {
    // QubicError is abstract, so we test via subclasses
    const err = new InvalidSeedError('abc')
    expect(err).toBeInstanceOf(QubicError)
    expect(err).toBeInstanceOf(Error)
  })
})

describe('InvalidIdentityError', () => {
  test('has correct code property', () => {
    const err = new InvalidIdentityError('short')
    expect(err.code).toBe('INVALID_IDENTITY')
  })

  test('has correct name property', () => {
    const err = new InvalidIdentityError('short')
    expect(err.name).toBe('InvalidIdentityError')
  })

  test('instanceof checks work correctly', () => {
    const err = new InvalidIdentityError('short')
    expect(err).toBeInstanceOf(InvalidIdentityError)
    expect(err).toBeInstanceOf(QubicError)
    expect(err).toBeInstanceOf(Error)
  })

  test('error message includes character count', () => {
    const err = new InvalidIdentityError('short')
    expect(err.message).toContain('5 chars')
    expect(err.message).toContain('60 uppercase letters')
  })

  test('preserves identity property', () => {
    const err = new InvalidIdentityError('test_identity')
    expect(err.identity).toBe('test_identity')
  })
})

describe('InvalidSeedError', () => {
  test('has correct code property', () => {
    const err = new InvalidSeedError('bad')
    expect(err.code).toBe('INVALID_SEED')
  })

  test('has correct name property', () => {
    const err = new InvalidSeedError('bad')
    expect(err.name).toBe('InvalidSeedError')
  })

  test('instanceof checks work correctly', () => {
    const err = new InvalidSeedError('bad')
    expect(err).toBeInstanceOf(InvalidSeedError)
    expect(err).toBeInstanceOf(QubicError)
    expect(err).toBeInstanceOf(Error)
  })

  test('error message mentions expected format', () => {
    const err = new InvalidSeedError('bad')
    expect(err.message).toContain('55 lowercase letters')
  })

  test('preserves seed property', () => {
    const err = new InvalidSeedError('my_bad_seed')
    expect(err.seed).toBe('my_bad_seed')
  })
})

describe('InvalidTxHashError', () => {
  test('has correct code property', () => {
    const err = new InvalidTxHashError('bad')
    expect(err.code).toBe('INVALID_TX_HASH')
  })

  test('has correct name property', () => {
    const err = new InvalidTxHashError('bad')
    expect(err.name).toBe('InvalidTxHashError')
  })

  test('instanceof checks work correctly', () => {
    const err = new InvalidTxHashError('bad')
    expect(err).toBeInstanceOf(InvalidTxHashError)
    expect(err).toBeInstanceOf(QubicError)
    expect(err).toBeInstanceOf(Error)
  })

  test('error message mentions expected format', () => {
    const err = new InvalidTxHashError('bad')
    expect(err.message).toContain('60 lowercase letters')
  })

  test('preserves hash property', () => {
    const err = new InvalidTxHashError('my_hash')
    expect(err.hash).toBe('my_hash')
  })
})

describe('InvalidBase64Error', () => {
  test('has correct code property', () => {
    const err = new InvalidBase64Error('!!!')
    expect(err.code).toBe('INVALID_BASE64')
  })

  test('has correct name property', () => {
    const err = new InvalidBase64Error('!!!')
    expect(err.name).toBe('InvalidBase64Error')
  })

  test('instanceof checks work correctly', () => {
    const err = new InvalidBase64Error('!!!')
    expect(err).toBeInstanceOf(InvalidBase64Error)
    expect(err).toBeInstanceOf(QubicError)
    expect(err).toBeInstanceOf(Error)
  })

  test('error message is descriptive', () => {
    const err = new InvalidBase64Error('!!!')
    expect(err.message).toContain('Invalid base64')
  })

  test('preserves value property', () => {
    const err = new InvalidBase64Error('bad_value')
    expect(err.value).toBe('bad_value')
  })
})

describe('context property', () => {
  // QubicError supports an optional context parameter.
  // The concrete subclasses don't pass context in their constructors,
  // so context should be undefined for all standard errors.
  test('context is undefined when not provided', () => {
    const err = new InvalidSeedError('bad')
    expect(err.context).toBeUndefined()
  })

  test('each error code is unique across error classes', () => {
    const codes = [
      new InvalidIdentityError('x').code,
      new InvalidSeedError('x').code,
      new InvalidTxHashError('x').code,
      new InvalidBase64Error('x').code,
    ]
    const unique = new Set(codes)
    expect(unique.size).toBe(codes.length)
  })
})

describe('error discrimination', () => {
  test('errors can be distinguished by code property', () => {
    const errors: QubicError[] = [
      new InvalidIdentityError('x'),
      new InvalidSeedError('x'),
      new InvalidTxHashError('x'),
      new InvalidBase64Error('x'),
    ]

    const codes = errors.map((e) => e.code)
    expect(codes).toEqual([
      'INVALID_IDENTITY',
      'INVALID_SEED',
      'INVALID_TX_HASH',
      'INVALID_BASE64',
    ])
  })

  test('errors can be distinguished by name property', () => {
    const errors: QubicError[] = [
      new InvalidIdentityError('x'),
      new InvalidSeedError('x'),
      new InvalidTxHashError('x'),
      new InvalidBase64Error('x'),
    ]

    const names = errors.map((e) => e.name)
    expect(names).toEqual([
      'InvalidIdentityError',
      'InvalidSeedError',
      'InvalidTxHashError',
      'InvalidBase64Error',
    ])
  })
})
