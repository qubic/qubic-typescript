import { describe, expect, test } from 'bun:test'
import {
  pointGenerator,
  pointIdentity,
  pointMarshal,
  pointUnmarshal,
  scalarBaseMult,
} from '../fourq.js'

function eq(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

describe('pointMarshal / pointUnmarshal', () => {
  test('round-trip: marshal → unmarshal → marshal produces same bytes', () => {
    const G = pointGenerator()
    const m1 = pointMarshal(G)
    const unmarshalled = pointUnmarshal(m1)
    expect(unmarshalled).not.toBeNull()
    const m2 = pointMarshal(unmarshalled!)
    expect(eq(m1, m2)).toBe(true)
  })

  test('round-trip with identity point', () => {
    const O = pointIdentity()
    const m = pointMarshal(O)
    const recovered = pointUnmarshal(m)
    expect(recovered).not.toBeNull()
    const m2 = pointMarshal(recovered!)
    expect(eq(m, m2)).toBe(true)
  })

  test('unmarshal returns null for invalid field element', () => {
    // 33 bytes is not valid (fqFromBytes expects exactly 32 bytes)
    const bad = new Uint8Array(33)
    expect(pointUnmarshal(bad)).toBeNull()
  })

  test('unmarshal returns a point for valid input', () => {
    const G = pointGenerator()
    const m = pointMarshal(G)
    expect(pointUnmarshal(m)).not.toBeNull()
  })
})

describe('scalarBaseMult', () => {
  test('scalar [1,0,...,0] produces the generator point', () => {
    const scalar = new Uint8Array(32)
    scalar[0] = 1

    const P = scalarBaseMult(scalar)
    const m = pointMarshal(P)

    const G = pointGenerator()
    const mG = pointMarshal(G)

    expect(eq(m, mG)).toBe(true)
  })

  test('produces consistent results for same input', () => {
    const scalar = new Uint8Array(32)
    scalar[0] = 0xab
    scalar[1] = 0xcd
    scalar[31] = 0xef

    const P1 = scalarBaseMult(scalar)
    const P2 = scalarBaseMult(scalar)

    expect(eq(pointMarshal(P1), pointMarshal(P2))).toBe(true)
  })

  test('different scalars produce different points', () => {
    const s1 = new Uint8Array(32)
    s1[0] = 2
    const s2 = new Uint8Array(32)
    s2[0] = 3

    const P1 = scalarBaseMult(s1)
    const P2 = scalarBaseMult(s2)

    expect(eq(pointMarshal(P1), pointMarshal(P2))).toBe(false)
  })

  test('produces a point on the curve', () => {
    const scalar = new Uint8Array(32)
    scalar[0] = 42

    const P = scalarBaseMult(scalar)
    const m = pointMarshal(P)
    const recovered = pointUnmarshal(m)
    // If unmarshal returns a valid point, the original was on the curve
    expect(recovered).not.toBeNull()
  })
})
