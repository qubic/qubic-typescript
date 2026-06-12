/**
 * @module schnorrq
 * SchnorrQ signature scheme over the FourQ curve.
 * Port of Qubic's Go schnorrq implementation.
 */
import { doubleScalarMult, pointMarshal, pointUnmarshal, scalarBaseMult } from './fourq.js'
import { k12 } from './k12.js'

export const ORDER = 0x0029cbc14e5e0a72f05397829cbc14e5dfbd004dfe0f79992fb2540ec7768ce7n

function k12Hash64(data: Uint8Array): Uint8Array {
  return k12(data, 64)
}

function bytesToBigIntBE(bytes: Uint8Array): bigint {
  let res = 0n
  for (let i = bytes.length - 1; i >= 0; i--) {
    res = (res << 8n) | BigInt(bytes[i] as number)
  }
  return res
}

function bigIntToBytes(n: bigint): Uint8Array {
  const res = new Uint8Array(32)
  let temp = n
  for (let i = 0; i < 32; i++) {
    res[i] = Number(temp & 0xffn)
    temp >>= 8n
  }
  return res
}

/**
 * Signs a message digest using SchnorrQ.
 *
 * @param subSeed - 32-byte private sub-seed.
 * @param publicKey - 32-byte public key.
 * @param messageDigest - The message to sign (typically a 32-byte hash).
 * @returns 64-byte signature (R || s).
 */
export function sign(
  subSeed: Uint8Array,
  publicKey: Uint8Array,
  messageDigest: Uint8Array,
): Uint8Array {
  const subSeedHash = k12Hash64(subSeed)

  const temp = new Uint8Array(64)
  temp.set(subSeedHash.slice(32, 64), 0)
  temp.set(messageDigest, 32)
  const tempHash = k12Hash64(temp)

  const rScalarBytes = tempHash.slice(0, 32)
  const rValue = bytesToBigIntBE(rScalarBytes) % ORDER
  const pointR = scalarBaseMult(rScalarBytes)
  const pointREncoding = pointMarshal(pointR)

  const finalTemp = new Uint8Array(96)
  finalTemp.set(pointREncoding, 0)
  finalTemp.set(publicKey, 32)
  finalTemp.set(messageDigest, 64)
  const finalHash = k12Hash64(finalTemp)

  const kValue = bytesToBigIntBE(finalHash.slice(0, 32)) % ORDER
  const aValue = bytesToBigIntBE(subSeedHash.slice(0, 32)) % ORDER

  let sValue = (rValue - ((kValue * aValue) % ORDER)) % ORDER
  sValue += ORDER & (sValue >> 255n)

  const signature = new Uint8Array(64)
  signature.set(pointREncoding, 0)
  signature.set(bigIntToBytes(sValue), 32)

  return signature
}

/**
 * Verifies a SchnorrQ signature.
 *
 * @param publicKey - 32-byte public key.
 * @param messageDigest - The message that was signed.
 * @param signature - 64-byte signature (R || s).
 * @returns true if valid, false otherwise.
 */
export function verify(
  publicKey: Uint8Array,
  messageDigest: Uint8Array,
  signature: Uint8Array,
): boolean {
  if (((publicKey[15] as number) & 0x80) !== 0 || ((signature[15] as number) & 0x80) !== 0) {
    return false
  }

  const pointREncoding = signature.slice(0, 32)
  const sBytes = signature.slice(32, 64)
  const sValue = bytesToBigIntBE(sBytes)
  // Reject non-canonical scalars: S must be strictly less than the curve order.
  // Accepting S in [r, 2^246) would allow a second valid signature S' = S + r for
  // the same message, producing a different tx hash and bypassing dedup.
  if (sValue >= ORDER) return false

  const pointPK = pointUnmarshal(publicKey)
  if (pointPK === null) return false

  const temp = new Uint8Array(96)
  temp.set(pointREncoding, 0)
  temp.set(publicKey, 32)
  temp.set(messageDigest, 64)
  const finalHash = k12Hash64(temp)
  const hScalarBytes = finalHash.slice(0, 32)

  const resultPoint = doubleScalarMult(sBytes, pointPK, hScalarBytes)
  const resultEncoding = pointMarshal(resultPoint)

  let diff = 0
  for (let i = 0; i < 32; i++) {
    diff |= (resultEncoding[i] as number) ^ (pointREncoding[i] as number)
  }

  return diff === 0
}
