/**
 * @module fq
 * GF(p^2) arithmetic for FourQ curve.
 * Port of Cloudflare CIRCL ecc/fourq/fq.go + fq_generic.go.
 */
import {
  SIZE_FP,
  fpAdd,
  fpCmov,
  fpFromBytes,
  fpHlf,
  fpInv,
  fpMod,
  fpMul,
  fpNeg,
  fpSgn,
  fpSqr,
  fpSub,
  fpToBytes,
  fpTwo1251,
} from './fp.js'

export type FqElement = [bigint, bigint]

export function fqSgn(a: FqElement): number {
  const s0 = fpSgn(a[0])
  const s1 = fpSgn(a[1])
  const useS0 = BigInt(s0 * s0)
  return Number(BigInt(s0) * useS0 + BigInt(s1) * (1n - useS0))
}

export function fqZero(): FqElement {
  return [0n, 0n]
}

export function fqOne(): FqElement {
  return [1n, 0n]
}

export function fqCopy(a: FqElement): FqElement {
  return [a[0], a[1]]
}

export function fqIsZero(a: FqElement): boolean {
  return (fpMod(a[0]) | fpMod(a[1])) === 0n
}

export function fqAdd(a: FqElement, b: FqElement): FqElement {
  return [fpAdd(a[0], b[0]), fpAdd(a[1], b[1])]
}

export function fqSub(a: FqElement, b: FqElement): FqElement {
  return [fpSub(a[0], b[0]), fpSub(a[1], b[1])]
}

export function fqMul(a: FqElement, b: FqElement): FqElement {
  const t1 = fpMul(a[0], b[0])
  const t2 = fpMul(a[1], b[1])
  const t3 = fpAdd(a[0], a[1])
  const t4 = fpAdd(b[0], b[1])
  let t5 = fpMul(t3, t4)
  t5 = fpSub(t5, t1)
  t5 = fpSub(t5, t2)
  const t6 = fpSub(t1, t2)
  return [t6, t5]
}

export function fqSqr(a: FqElement): FqElement {
  const t1 = fpAdd(a[0], a[1])
  const t2 = fpSub(a[0], a[1])
  const t3 = fpAdd(a[0], a[0])
  return [fpMul(t1, t2), fpMul(t3, a[1])]
}

export function fqNeg(a: FqElement): FqElement {
  return [fpNeg(a[0]), fpNeg(a[1])]
}

export function fqInv(a: FqElement): FqElement {
  const t1 = fpSqr(a[0])
  const t2 = fpSqr(a[1])
  const norm = fpAdd(t1, t2)
  const invNorm = fpInv(norm)
  return [fpMul(a[0], invNorm), fpMul(a[1], fpNeg(invNorm))]
}

export function fqSqrt(u: FqElement, v: FqElement, s: number): FqElement {
  const a = fpAdd(fpMul(u[0], v[0]), fpMul(u[1], v[1]))
  const b = fpAdd(fpSqr(v[0]), fpSqr(v[1]))
  const g = fpSub(fpMul(u[1], v[0]), fpMul(u[0], v[1]))

  let t0 = fpAdd(fpSqr(a), fpSqr(g))
  for (let i = 0; i < 125; i++) t0 = fpSqr(t0)
  let t = fpAdd(a, t0)
  const tMod = fpMod(t)
  t = fpCmov(t, fpSub(a, t0), 1 - Number(((tMod | -tMod) >> 126n) & 1n))
  t = fpAdd(t, t)

  let r = fpMul(fpMul(fpSqr(b), b), t)
  r = fpTwo1251(r)

  const rb = fpMul(r, b)
  const c1Mag = fpMul(rb, g)
  const c0Mag = fpHlf(fpMul(rb, t))

  const x02Sqr = fpSqr(fpAdd(c0Mag, c0Mag))
  const check = fpSub(fpMul(b, x02Sqr), t)
  const checkMod = fpMod(check)
  const swapFlag = Number(((checkMod | -checkMod) >> 126n) & 1n)
  let result: FqElement = [fpCmov(c0Mag, c1Mag, swapFlag), fpCmov(c1Mag, c0Mag, swapFlag)]
  const negFlag = (1 - fqSgn(result) * s) >> 1
  result = fqCmov(result, fqNeg(result), negFlag)
  return result
}

export function fqCmov(a: FqElement, b: FqElement, flag: number): FqElement {
  const mask = -BigInt(flag & 1)
  const invMask = ~mask
  return [(a[0] & invMask) | (b[0] & mask), (a[1] & invMask) | (b[1] & mask)]
}

export function fqToBytes(a: FqElement): Uint8Array {
  const buf = new Uint8Array(SIZE_FP * 2)
  buf.set(fpToBytes(a[0]), 0)
  buf.set(fpToBytes(a[1]), SIZE_FP)
  return buf
}

export function fqFromBytes(buf: Uint8Array): FqElement | null {
  if (buf.length !== SIZE_FP * 2) return null
  const a0 = fpFromBytes(buf.slice(0, SIZE_FP))
  const a1 = fpFromBytes(buf.slice(SIZE_FP))
  if (a0 === null || a1 === null) return null
  return [a0, a1]
}
