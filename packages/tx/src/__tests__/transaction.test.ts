import { describe, expect, test } from 'bun:test'
import { identityToPublicKey, publicKeyToIdentity } from '@qubic.ts/crypto'
import { PROTOCOL, toSeed } from '@qubic.ts/types'
import { InvalidTransactionError, PayloadTooLargeError, TickInThePastError } from '../errors.js'
import {
  buildTransaction,
  computeTransactionHash,
  decodeTransaction,
  encodeTransaction,
  signTransaction,
  verifyTransactionSignature,
} from '../transaction.js'

const SEED = toSeed('a'.repeat(55))
const ZERO_PK = new Uint8Array(32)
const DEST_PK = new Uint8Array(32).fill(1)

const BASE_INPUT = {
  sourcePublicKey: ZERO_PK,
  destinationPublicKey: DEST_PK,
  amount: 100n,
  targetTick: 1000,
  inputType: 0,
}

describe('buildTransaction', () => {
  test('produces correct header size with no payload', () => {
    const tx = buildTransaction(BASE_INPUT)
    expect(tx.byteLength).toBe(PROTOCOL.TX_HEADER_SIZE)
  })

  test('produces correct total size with payload', () => {
    const payload = new Uint8Array(16).fill(0xab)
    const tx = buildTransaction({ ...BASE_INPUT, payload })
    expect(tx.byteLength).toBe(PROTOCOL.TX_HEADER_SIZE + 16)
  })

  test('encodes header fields at correct offsets', () => {
    const srcPk = new Uint8Array(32).fill(2)
    const dstPk = new Uint8Array(32).fill(3)
    const tx = buildTransaction({
      sourcePublicKey: srcPk,
      destinationPublicKey: dstPk,
      amount: 42n,
      targetTick: 9999,
      inputType: 7,
    })
    const view = new DataView(tx.buffer)

    // sourcePublicKey at offset 0
    expect(tx.slice(0, 32)).toEqual(srcPk)
    // destinationPublicKey at offset 32
    expect(tx.slice(32, 64)).toEqual(dstPk)
    // amount at offset 64 (signed 64-bit LE)
    expect(view.getBigInt64(64, true)).toBe(42n)
    // tick at offset 72 (uint32 LE)
    expect(view.getUint32(72, true)).toBe(9999)
    // inputType at offset 76 (uint16 LE)
    expect(view.getUint16(76, true)).toBe(7)
    // inputSize at offset 78 (uint16 LE)
    expect(view.getUint16(78, true)).toBe(0)
  })

  test('encodes negative amount', () => {
    const tx = buildTransaction({ ...BASE_INPUT, amount: -1n })
    const view = new DataView(tx.buffer)
    expect(view.getBigInt64(64, true)).toBe(-1n)
  })

  test('throws PayloadTooLargeError when payload exceeds MAX_INPUT_SIZE', () => {
    const payload = new Uint8Array(PROTOCOL.MAX_INPUT_SIZE + 1)
    expect(() => buildTransaction({ ...BASE_INPUT, payload })).toThrow(PayloadTooLargeError)
  })

  test('throws TickInThePastError when targetTick <= currentTick', () => {
    expect(() => buildTransaction({ ...BASE_INPUT, targetTick: 100, currentTick: 100 })).toThrow(
      TickInThePastError,
    )
    expect(() => buildTransaction({ ...BASE_INPUT, targetTick: 99, currentTick: 100 })).toThrow(
      TickInThePastError,
    )
  })

  test('does not throw when targetTick > currentTick', () => {
    expect(() =>
      buildTransaction({ ...BASE_INPUT, targetTick: 101, currentTick: 100 }),
    ).not.toThrow()
  })
})

describe('signTransaction', () => {
  test('appends 64-byte signature', async () => {
    const tx = buildTransaction(BASE_INPUT)
    const signed = await signTransaction(tx, SEED)
    expect(signed.byteLength).toBe(tx.byteLength + PROTOCOL.SIGNATURE_SIZE)
    expect(signed.slice(0, tx.byteLength)).toEqual(tx)
  })

  test('deterministic for same inputs', async () => {
    const tx = buildTransaction(BASE_INPUT)
    const s1 = await signTransaction(tx, SEED)
    const s2 = await signTransaction(tx, SEED)
    expect(s1).toEqual(s2)
  })
})

describe('verifyTransactionSignature', () => {
  test('returns true for a valid signature', async () => {
    // Use real derived public key so the signature is verifiable
    const { publicKeyFromSeed } = await import('@qubic.ts/crypto')
    const srcPk = publicKeyFromSeed(SEED)
    const tx = buildTransaction({ ...BASE_INPUT, sourcePublicKey: srcPk })
    const signed = await signTransaction(tx, SEED)
    expect(verifyTransactionSignature(signed)).toBe(true)
  })

  test('returns false for tampered signature', async () => {
    const { publicKeyFromSeed } = await import('@qubic.ts/crypto')
    const srcPk = publicKeyFromSeed(SEED)
    const tx = buildTransaction({ ...BASE_INPUT, sourcePublicKey: srcPk })
    const signed = await signTransaction(tx, SEED)
    signed[signed.byteLength - 1] ^= 0xff
    expect(verifyTransactionSignature(signed)).toBe(false)
  })

  test('returns false for too-short buffer', () => {
    expect(verifyTransactionSignature(new Uint8Array(10))).toBe(false)
  })
})

describe('encodeTransaction', () => {
  test('returns valid base64', async () => {
    const tx = buildTransaction(BASE_INPUT)
    const signed = await signTransaction(tx, SEED)
    const encoded = encodeTransaction(signed)
    expect(typeof encoded).toBe('string')
    expect(/^[A-Za-z0-9+/]+=*$/.test(encoded)).toBe(true)
  })

  test('round-trips through atob', async () => {
    const tx = buildTransaction(BASE_INPUT)
    const signed = await signTransaction(tx, SEED)
    const encoded = encodeTransaction(signed)
    const decoded = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0))
    expect(decoded).toEqual(signed)
  })
})

describe('decodeTransaction', () => {
  test('round-trips header fields', () => {
    const srcPk = new Uint8Array(32).fill(5)
    const dstPk = new Uint8Array(32).fill(6)
    const payload = new Uint8Array([0xde, 0xad])
    const tx = buildTransaction({
      sourcePublicKey: srcPk,
      destinationPublicKey: dstPk,
      amount: 999n,
      targetTick: 12345,
      inputType: 3,
      payload,
    })
    const decoded = decodeTransaction(tx)
    expect(decoded.sourcePublicKey).toEqual(srcPk)
    expect(decoded.destinationPublicKey).toEqual(dstPk)
    expect(decoded.amount).toBe(999n)
    expect(decoded.targetTick).toBe(12345)
    expect(decoded.inputType).toBe(3)
    expect(decoded.payload).toEqual(payload)
  })

  test('throws InvalidTransactionError for short buffer', () => {
    expect(() => decodeTransaction(new Uint8Array(10))).toThrow(InvalidTransactionError)
  })
})

describe('computeTransactionHash', () => {
  test('returns 60 lowercase characters', async () => {
    const tx = buildTransaction(BASE_INPUT)
    const signed = await signTransaction(tx, SEED)
    const hash = computeTransactionHash(signed)
    expect(hash).toHaveLength(60)
    expect(/^[a-z]+$/.test(hash)).toBe(true)
  })

  test('different transactions produce different hashes', async () => {
    const tx1 = buildTransaction({ ...BASE_INPUT, amount: 1n })
    const tx2 = buildTransaction({ ...BASE_INPUT, amount: 2n })
    const s1 = await signTransaction(tx1, SEED)
    const s2 = await signTransaction(tx2, SEED)
    expect(computeTransactionHash(s1)).not.toBe(computeTransactionHash(s2))
  })

  test('identity encoding consistency — identity uses uppercase, txHash uses lowercase', () => {
    // Confirm that our lowercase encoding is consistent with the uppercase identity encoding
    const pk = new Uint8Array(32).fill(7)
    const identity = publicKeyToIdentity(pk)
    expect(/^[A-Z]+$/.test(identity)).toBe(true)
    expect(identity).toHaveLength(60)

    // Verify identityToPublicKey is the inverse
    const recovered = identityToPublicKey(identity)
    expect(recovered).toEqual(pk)
  })
})
