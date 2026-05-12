/**
 * @module fp
 * Fp arithmetic over GF(2^127 - 1) — the Mersenne prime field.
 */

export const SIZE_FP = 16

export const P = (1n << 127n) - 1n

export function fpMod(a: bigint): bigint {
  let res = a % P
  res += P & (res >> 127n)
  return res
}

export function fpAdd(a: bigint, b: bigint): bigint {
  return fpMod(a + b)
}

export function fpSub(a: bigint, b: bigint): bigint {
  return fpMod(a - b)
}

export function fpMul(a: bigint, b: bigint): bigint {
  return fpMod(a * b)
}

export function fpSqr(a: bigint): bigint {
  return fpMod(a * a)
}

export function fpNeg(a: bigint): bigint {
  return fpMod(P - a)
}

export function fpInv(a: bigint): bigint {
  if (fpMod(a) === 0n) throw new Error('invert: expected non-zero number')
  const t = fpTwo1251(a)
  let res = t
  res = fpSqr(res)
  res = fpSqr(res)
  return fpMul(res, a)
}

export function fpSgn(a: bigint): number {
  const v = fpMod(a)
  const nonZero = ((v | -v) >> 126n) & 1n
  const negative = (v >> 126n) & 1n
  return Number(nonZero * (1n - (negative << 1n)))
}

export function fpSgnFn(a: bigint): bigint {
  const v = fpMod(a)
  const nonZero = ((v | -v) >> 126n) & 1n
  const negative = (v >> 126n) & 1n
  return nonZero * (1n - (negative << 1n))
}

export function fpHlf(a: bigint): bigint {
  const v = fpMod(a)
  const carry = -(v & 1n)
  return (v + (P & carry)) >> 1n
}

export function fpCmov(a: bigint, b: bigint, flag: number): bigint {
  const mask = -BigInt(flag & 1)
  return (a & ~mask) | (b & mask)
}

export function fpTwo1251(a: bigint): bigint {
  let t2 = fpSqr(a)
  t2 = fpMul(t2, a)
  let t3 = fpSqr(fpSqr(t2))
  t3 = fpMul(t3, t2)
  let t4 = fpSqr(fpSqr(fpSqr(fpSqr(t3))))
  t4 = fpMul(t4, t3)
  let t5 = fpSqr(t4)
  for (let i = 0; i < 7; i++) t5 = fpSqr(t5)
  t5 = fpMul(t5, t4)
  let tt2 = fpSqr(t5)
  for (let i = 0; i < 15; i++) tt2 = fpSqr(tt2)
  tt2 = fpMul(tt2, t5)
  let t1 = fpSqr(tt2)
  for (let i = 0; i < 31; i++) t1 = fpSqr(t1)
  t1 = fpMul(t1, tt2)
  for (let i = 0; i < 32; i++) t1 = fpSqr(t1)
  t1 = fpMul(tt2, t1)
  for (let i = 0; i < 16; i++) t1 = fpSqr(t1)
  t1 = fpMul(t1, t5)
  for (let i = 0; i < 8; i++) t1 = fpSqr(t1)
  t1 = fpMul(t1, t4)
  for (let i = 0; i < 4; i++) t1 = fpSqr(t1)
  t1 = fpMul(t1, t3)
  t1 = fpSqr(t1)
  return fpMul(a, t1)
}

export function fpToBytes(a: bigint): Uint8Array {
  const v = fpMod(a)
  const buf = new Uint8Array(SIZE_FP)
  let tmp = v
  for (let i = 0; i < SIZE_FP; i++) {
    buf[i] = Number(tmp & 0xffn)
    tmp >>= 8n
  }
  return buf
}

export function fpFromBytes(buf: Uint8Array): bigint | null {
  if (buf.length !== SIZE_FP) return null
  if ((buf[SIZE_FP - 1] as number) >> 7 !== 0) return null
  let v = 0n
  for (let i = SIZE_FP - 1; i >= 0; i--) {
    v = (v << 8n) | BigInt(buf[i] as number)
  }
  return fpMod(v)
}
