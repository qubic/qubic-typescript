import { describe, expect, test } from 'bun:test'
import { k12 } from '../k12.js'

describe('k12', () => {
  test('empty input produces 32-byte output', () => {
    const out = k12(new Uint8Array(0), 32)
    expect(out).toBeInstanceOf(Uint8Array)
    expect(out.length).toBe(32)
  })

  test('is deterministic', () => {
    const input = new Uint8Array([1, 2, 3, 4, 5])
    const a = k12(input, 32)
    const b = k12(input, 32)
    expect(a).toEqual(b)
  })

  test('different inputs produce different outputs', () => {
    const a = k12(new Uint8Array([0]), 32)
    const b = k12(new Uint8Array([1]), 32)
    expect(a).not.toEqual(b)
  })

  test('respects outputLength parameter', () => {
    const out16 = k12(new Uint8Array([42]), 16)
    const out64 = k12(new Uint8Array([42]), 64)
    expect(out16.length).toBe(16)
    expect(out64.length).toBe(64)
  })

  test('known vector — KT128 of empty string', () => {
    // KangarooTwelve(empty, customization='', outputLen=32)
    // Reference: https://keccak.team/files/KangarooTwelve.pdf test vector
    const out = k12(new Uint8Array(0), 32)
    const hex = Array.from(out)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    expect(hex).toBe('1ac2d450fc3b4205d19da7bfca1b37513c0803577ac7167f06fe2ce1f0ef39e5')
  })
})
