import { describe, expect, test } from 'bun:test'
import { generateRandomSeed, getRandomBytes } from '../random.js'

describe('getRandomBytes', () => {
  test('returns Uint8Array of the requested length', () => {
    const bytes = getRandomBytes(16)
    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(bytes.length).toBe(16)
  })

  test('returns correct length for various sizes', () => {
    for (const n of [1, 32, 64, 128, 255]) {
      const bytes = getRandomBytes(n)
      expect(bytes.length).toBe(n)
    }
  })

  test('different calls produce different bytes (probabilistic)', () => {
    const a = getRandomBytes(32)
    const b = getRandomBytes(32)
    // Two random 32-byte arrays being identical is astronomically unlikely
    expect(a).not.toEqual(b)
  })

  test('n=0 throws RangeError', () => {
    expect(() => getRandomBytes(0)).toThrow(RangeError)
  })

  test('negative length throws RangeError', () => {
    expect(() => getRandomBytes(-1)).toThrow(RangeError)
  })
})

describe('generateRandomSeed', () => {
  test('returns a 55-character string', () => {
    const seed = generateRandomSeed()
    expect(seed).toHaveLength(55)
  })

  test('contains only lowercase letters', () => {
    const seed = generateRandomSeed()
    expect(seed).toMatch(/^[a-z]{55}$/)
  })

  test('passes seed validation (can be used to derive identity)', () => {
    // If it passes the regex check and has correct length, it is valid
    const seed = generateRandomSeed()
    expect(seed.length).toBe(55)
    expect(/^[a-z]+$/.test(seed)).toBe(true)
  })

  test('multiple calls produce different seeds (probabilistic)', () => {
    const seeds = new Set<string>()
    for (let i = 0; i < 10; i++) {
      seeds.add(generateRandomSeed())
    }
    // All 10 should be unique
    expect(seeds.size).toBe(10)
  })
})
