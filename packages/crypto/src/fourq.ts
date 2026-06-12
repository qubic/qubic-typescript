/**
 * @module fourq
 * FourQ twisted Edwards curve point arithmetic with GLV endomorphism.
 * Port of Cloudflare CIRCL ecc/fourq/point.go + point_generic.go.
 *
 * Curve equation: -x^2 + y^2 = 1 + d*x^2*y^2  over GF(p^2), p = 2^127-1.
 */

import { GENERATOR_X, GENERATOR_Y, PARAM_D } from './fourq-constants.js'
import { fpNeg } from './fp.js'
import type { FqElement } from './fq.js'
import {
  fqAdd,
  fqCmov,
  fqCopy,
  fqFromBytes,
  fqInv,
  fqIsZero,
  fqMul,
  fqNeg,
  fqOne,
  fqSgn,
  fqSqr,
  fqSqrt,
  fqSub,
  fqToBytes,
  fqZero,
} from './fq.js'

const ORDER_GENERATOR = [
  0x2fb2540ec7768ce7n,
  0xdfbd004dfe0f7999n,
  0xf05397829cbc14e5n,
  0x0029cbc14e5e0a72n,
]

export interface PointR1 {
  X: FqElement
  Y: FqElement
  Z: FqElement
  Ta: FqElement
  Tb: FqElement
}

export interface PointR3 {
  addYX: FqElement
  subYX: FqElement
  dt2: FqElement
}

export interface PointR2 extends PointR3 {
  z2: FqElement
}

export function pointIdentity(): PointR1 {
  return { X: fqZero(), Y: fqOne(), Z: fqOne(), Ta: fqZero(), Tb: fqZero() }
}

export function pointGenerator(): PointR1 {
  return {
    X: fqCopy(GENERATOR_X),
    Y: fqCopy(GENERATOR_Y),
    Z: fqOne(),
    Ta: fqCopy(GENERATOR_X),
    Tb: fqCopy(GENERATOR_Y),
  }
}

export function pointCopy(P: PointR1): PointR1 {
  return {
    X: fqCopy(P.X),
    Y: fqCopy(P.Y),
    Z: fqCopy(P.Z),
    Ta: fqCopy(P.Ta),
    Tb: fqCopy(P.Tb),
  }
}

export function pointDouble(P: PointR1): PointR1 {
  const a = fqSqr(P.X)
  const b = fqSqr(P.Y)
  const c = fqSqr(P.Z)
  const c2 = fqAdd(c, c)
  const d = fqAdd(a, b)
  const xplusySqr = fqSqr(fqAdd(P.X, P.Y))
  const e = fqSub(xplusySqr, d)
  const f = fqSub(b, a)
  const g = fqSub(c2, f)
  return { X: fqMul(e, g), Y: fqMul(d, f), Z: fqMul(f, g), Ta: d, Tb: e }
}

export function pointAdd(P: PointR1, Q: PointR2): PointR1 {
  const cc = fqMul(P.Ta, P.Tb)
  const h = fqSub(P.Y, P.X)
  const bb = fqAdd(P.Y, P.X)
  const a = fqMul(h, Q.subYX)
  const bv = fqMul(bb, Q.addYX)
  const e = fqSub(bv, a)
  const hh = fqAdd(bv, a)
  const dd = fqMul(P.Z, Q.z2)
  const c2 = fqMul(cc, Q.dt2)
  const f = fqSub(dd, c2)
  const g = fqAdd(dd, c2)
  return { X: fqMul(e, f), Y: fqMul(g, hh), Z: fqMul(f, g), Ta: e, Tb: hh }
}

export function toR2(P: PointR1): PointR2 {
  const t = fqMul(P.Ta, P.Tb)
  const dt = fqMul(t, PARAM_D)
  const dt2 = fqAdd(dt, dt)
  return { addYX: fqAdd(P.Y, P.X), subYX: fqSub(P.Y, P.X), z2: fqAdd(P.Z, P.Z), dt2 }
}

function r3Cmov(a: PointR3, b: PointR3, flag: number): PointR3 {
  return {
    addYX: fqCmov(a.addYX, b.addYX, flag),
    subYX: fqCmov(a.subYX, b.subYX, flag),
    dt2: fqCmov(a.dt2, b.dt2, flag),
  }
}

function r3Cneg(P: PointR3, flag: number): PointR3 {
  const tAddYX = fqCopy(P.addYX)
  const tSubYX = fqCopy(P.subYX)
  const tNegDt2 = fqNeg(P.dt2)
  return {
    addYX: fqCmov(tAddYX, tSubYX, flag),
    subYX: fqCmov(tSubYX, tAddYX, flag),
    dt2: fqCmov(P.dt2, tNegDt2, flag),
  }
}

function r2Cmov(a: PointR2, b: PointR2, flag: number): PointR2 {
  const r3 = r3Cmov(a, b, flag)
  return { ...r3, z2: fqCmov(a.z2, b.z2, flag) }
}

function r2Cneg(P: PointR2, flag: number): PointR2 {
  const r3 = r3Cneg(P, flag)
  return { ...r3, z2: fqCopy(P.z2) }
}

export function toAffine(P: PointR1): PointR1 {
  const zInv = fqInv(P.Z)
  const X = fqMul(P.X, zInv)
  const Y = fqMul(P.Y, zInv)
  return { X, Y, Z: fqOne(), Ta: fqCopy(X), Tb: fqCopy(Y) }
}

export function bytesToBigIntLE(b: Uint8Array): bigint {
  let res = 0n
  for (let i = 0; i < b.length; i++) res |= BigInt(b[i] as number) << BigInt(8 * i)
  return res
}

function add64(a: bigint, b: bigint, carry: bigint): [bigint, bigint] {
  const sum = a + b + carry
  return [sum & MASK64, sum >> 64n]
}

function sub64(a: bigint, b: bigint, borrow: bigint): [bigint, bigint] {
  const res = a - b - borrow
  return [res & MASK64, (res >> 64n) & 1n]
}

const MASK64 = 0xffffffffffffffffn

function condAddOrderN(x: BigUint64Array): void {
  const mask = ((x[0] as bigint) & 1n) - 1n
  let carry = 0n
  for (let i = 0; i < 4; i++) {
    const addend = (ORDER_GENERATOR[i] as bigint) & mask
    const [res, nextCarry] = add64(x[i] as bigint, addend, carry)
    x[i] = res
    carry = nextCarry
  }
  const [res4] = add64(x[4] as bigint, 0n, carry)
  x[4] = res4
}

function div2subY(x: BigUint64Array, y: bigint): void {
  const s = (y >> 63n) & MASK64
  const x0 = x[0] as bigint
  const x1 = x[1] as bigint
  const x2 = x[2] as bigint
  const x3 = x[3] as bigint

  const [r0, b0] = sub64((x0 >> 1n) | (x1 << 63n), y & MASK64, 0n)
  const [r1, b1] = sub64((x1 >> 1n) | (x2 << 63n), s, b0)
  const [r2, b2] = sub64((x2 >> 1n) | (x3 << 63n), s, b1)
  const [r3] = sub64(x3 >> 1n, s, b2)

  x[0] = r0
  x[1] = r1
  x[2] = r2
  x[3] = r3
}

function subYDiv16(x: BigUint64Array, y: number): void {
  const yBig = BigInt(y)
  const s = (yBig >> 63n) & MASK64
  const [r0, b0] = sub64(x[0] as bigint, yBig & MASK64, 0n)
  const [r1, b1] = sub64(x[1] as bigint, s, b0)
  const [r2, b2] = sub64(x[2] as bigint, s, b1)
  const [r3, b3] = sub64(x[3] as bigint, s, b2)
  const [r4] = sub64(x[4] as bigint, s, b3)

  x[0] = (r0 >> 4n) | (r1 << 60n)
  x[1] = (r1 >> 4n) | (r2 << 60n)
  x[2] = (r2 >> 4n) | (r3 << 60n)
  x[3] = (r3 >> 4n) | (r4 << 60n)
  x[4] = r4 >> 4n
}

function mLSBRecoding(L: Int8Array, k: Uint8Array): void {
  const FX_T = 257
  const FX_V = 2
  const FX_W = 3
  const e = Math.floor((FX_T + FX_W * FX_V - 1) / (FX_W * FX_V))
  const d = e * FX_V
  const l = d * FX_W

  const m = new BigUint64Array(5)
  const view = new DataView(k.buffer, k.byteOffset, 32)
  m[0] = view.getBigUint64(0, true)
  m[1] = view.getBigUint64(8, true)
  m[2] = bytesToBigIntLE(k.slice(16, 24))
  m[3] = bytesToBigIntLE(k.slice(24, 32))
  m[4] = 0n

  condAddOrderN(m)

  L[d - 1] = 1
  for (let i = 0; i < d - 1; i++) {
    const kip1 = Number(((m[(i + 1) >> 6] as bigint) >> BigInt((i + 1) & 63)) & 1n)
    L[i] = kip1 * 2 - 1
  }

  const right = BigInt(d & 63)
  const left = BigInt(64 - (d & 63))
  const j = d >> 6

  for (let i = 0; i < 5 - j - 1; i++) {
    m[i] = (((m[i + j] as bigint) >> right) | ((m[i + j + 1] as bigint) << left)) & MASK64
  }
  m[4 - j] = ((m[4] as bigint) >> right) & MASK64
  for (let i = 5 - j; i < 5; i++) m[i] = 0n

  for (let i = d; i < l; i++) {
    L[i] = (L[i % d] as number) * Number((m[0] as bigint) & 1n)
    div2subY(m, BigInt((L[i] as number) >> 1))
  }
  L[l] = Number((((m[0] as bigint) & 0xffn) ^ 0x80n) - 0x80n)
}

function recodeScalar(k: Uint8Array): Int8Array {
  const d = new Int8Array(65)
  const m = new BigUint64Array(5)
  const view = new DataView(k.buffer, k.byteOffset, 32)
  m[0] = view.getBigUint64(0, true)
  m[1] = view.getBigUint64(8, true)
  m[2] = view.getBigUint64(16, true)
  m[3] = view.getBigUint64(24, true)

  condAddOrderN(m)

  for (let i = 0; i < 64; i++) {
    d[i] = Number(((m[0] as bigint) & 0x1fn) - 16n)
    subYDiv16(m, d[i] as number)
  }
  d[64] = Number((((m[0] as bigint) & 0xffn) ^ 0x80n) - 0x80n)
  return d
}

export function scalarBaseMult(scalar: Uint8Array): PointR1 {
  return scalarMult(scalar, pointGenerator())
}

function oddMultiples(Q: PointR1): PointR2[] {
  let p2 = pointCopy(Q)
  p2 = pointDouble(p2)
  const pp2 = toR2(p2)
  const T: PointR2[] = [toR2(Q)]
  let R = pointCopy(Q)
  for (let i = 1; i < 8; i++) {
    R = pointAdd(R, pp2)
    T.push(toR2(R))
  }
  return T
}

export function scalarMult(k: Uint8Array, Q: PointR1): PointR1 {
  const tabQ = oddMultiples(Q)
  const d = recodeScalar(k)
  let P = pointIdentity()

  for (let i = 64; i >= 0; i--) {
    P = pointDouble(P)
    P = pointDouble(P)
    P = pointDouble(P)
    P = pointDouble(P)

    const di = d[i] as number
    const mask = di >> 7
    const absDi = (di + mask) ^ mask
    const inx = (absDi - 1) >> 1
    const sig = (di >> 7) & 0x1

    let S: PointR2 = { addYX: fqZero(), subYX: fqZero(), dt2: fqZero(), z2: fqZero() }
    for (let j = 0; j < 8; j++) {
      S = r2Cmov(S, tabQ[j] as PointR2, Number(((BigInt(inx ^ j) - 1n) >> 63n) & 1n))
    }
    S = r2Cneg(S, sig)
    P = pointAdd(P, S)
  }
  return P
}

export function doubleScalarMult(k1: Uint8Array, Q: PointR1, k2: Uint8Array): PointR1 {
  const P1 = scalarBaseMult(k1)
  const P2 = scalarMult(k2, Q)
  const Q2 = toR2(P2)
  return pointAdd(P1, Q2)
}

export function pointMarshal(P: PointR1): Uint8Array {
  const aff = toAffine(P)
  const out = fqToBytes(aff.Y)
  const s = fqSgn(aff.X)
  const b = (1 - s) >> 1
  out[31] = (out[31] as number) | (b << 7)
  return out
}

export function pointUnmarshal(input: Uint8Array): PointR1 | null {
  const buf = new Uint8Array(input)
  const s = (buf[31] as number) >> 7
  buf[31] = (buf[31] as number) & 0x7f

  const Y = fqFromBytes(buf)
  if (Y === null) return null

  const one = fqOne()
  const t0 = fqSqr(Y)
  const t1pre = fqMul(t0, PARAM_D)
  const u = fqSub(t0, one)
  const v = fqAdd(t1pre, one)
  const X = fqSqrt(u, v, 1 - 2 * s)

  const P: PointR1 = { X, Y, Z: fqOne(), Ta: fqCopy(X), Tb: fqCopy(Y) }

  const curveFlag = Number(isOnCurve(P))
  const flippedX: FqElement = [P.X[0], fpNeg(P.X[1])]
  P.X = fqCmov(flippedX, P.X, curveFlag)
  P.Ta = fqCopy(P.X)
  P.Tb = fqCopy(P.Y)

  return P
}

export function isOnCurve(P: PointR1): boolean {
  const t0 = fqAdd(P.Y, P.X)
  let lhs = fqSub(P.Y, P.X)
  lhs = fqMul(lhs, t0)

  let rhs = fqMul(P.X, P.Y)
  rhs = fqSqr(rhs)
  rhs = fqMul(rhs, PARAM_D)
  const one = fqOne()
  rhs = fqAdd(rhs, one)

  const diff = fqSub(lhs, rhs)
  return fqIsZero(diff)
}

// Re-export for GLV usage (unused currently, kept for future fixed-base optimization)
export { mLSBRecoding }
