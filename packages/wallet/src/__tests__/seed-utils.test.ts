import { describe, expect, test } from 'bun:test'
import { InvalidSeedError } from '@qubic.org/types'
import { generateSeed, validateSeed, toSeed } from '../seed-utils.js'

describe('generateSeed', () => {
  test('returns a 55-character lowercase string', () => {
    const seed = generateSeed()
    expect(seed).toHaveLength(55)
    expect(seed).toMatch(/^[a-z]+$/)
  })

  test('multiple calls produce different seeds', () => {
    const seeds = new Set(Array.from({ length: 10 }, () => generateSeed()))
    expect(seeds.size).toBe(10)
  })

  test('result passes validateSeed', () => {
    const seed = generateSeed()
    expect(validateSeed(seed)).toBe(true)
  })
})

describe('validateSeed', () => {
  test('valid 55-char lowercase seed returns true', () => {
    expect(validateSeed('a'.repeat(55))).toBe(true)
  })

  test('valid seed with mixed lowercase letters returns true', () => {
    expect(validateSeed('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc')).toBe(true)
  })

  test('wrong length (54 chars) returns false', () => {
    expect(validateSeed('a'.repeat(54))).toBe(false)
  })

  test('wrong length (56 chars) returns false', () => {
    expect(validateSeed('a'.repeat(56))).toBe(false)
  })

  test('uppercase returns false', () => {
    expect(validateSeed('A'.repeat(55))).toBe(false)
  })

  test('mixed case returns false', () => {
    expect(validateSeed('a'.repeat(27) + 'A'.repeat(28))).toBe(false)
  })

  test('numbers return false', () => {
    expect(validateSeed('1'.repeat(55))).toBe(false)
  })

  test('alphanumeric mix returns false', () => {
    expect(validateSeed('a'.repeat(50) + '12345')).toBe(false)
  })

  test('empty string returns false', () => {
    expect(validateSeed('')).toBe(false)
  })

  test('special characters return false', () => {
    expect(validateSeed('a'.repeat(54) + '!')).toBe(false)
  })

  test('spaces return false', () => {
    expect(validateSeed('a'.repeat(54) + ' ')).toBe(false)
  })

  test('unicode characters return false', () => {
    expect(validateSeed('a'.repeat(54) + 'ñ')).toBe(false)
  })

  test('single character returns false', () => {
    expect(validateSeed('a')).toBe(false)
  })
})

describe('toSeed', () => {
  test('valid seed returns branded Seed', () => {
    const seed = toSeed('a'.repeat(55))
    expect(seed).toBe('a'.repeat(55))
    expect(validateSeed(seed)).toBe(true)
  })

  test('throws InvalidSeedError for wrong length (54 chars)', () => {
    expect(() => toSeed('a'.repeat(54))).toThrow(InvalidSeedError)
  })

  test('throws InvalidSeedError for wrong length (56 chars)', () => {
    expect(() => toSeed('a'.repeat(56))).toThrow(InvalidSeedError)
  })

  test('throws InvalidSeedError for uppercase', () => {
    expect(() => toSeed('A'.repeat(55))).toThrow(InvalidSeedError)
  })

  test('throws InvalidSeedError for numbers', () => {
    expect(() => toSeed('1'.repeat(55))).toThrow(InvalidSeedError)
  })

  test('throws InvalidSeedError for empty string', () => {
    expect(() => toSeed('')).toThrow(InvalidSeedError)
  })

  test('throws InvalidSeedError for special characters', () => {
    expect(() => toSeed('a'.repeat(54) + '@')).toThrow(InvalidSeedError)
  })
})
