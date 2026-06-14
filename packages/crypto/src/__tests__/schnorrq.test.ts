import { describe, expect, test } from 'bun:test'
import type { Seed } from '../brands.js'
import { publicKeyFromSeed, sign, verify } from '../index.js'

const KNOWN_SEED = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Seed

describe('sign / verify', () => {
  test('sign returns 64-byte signature', async () => {
    const message = new Uint8Array(32).fill(1)
    const sig = await sign(message, KNOWN_SEED)
    expect(sig).toBeInstanceOf(Uint8Array)
    expect(sig.length).toBe(64)
  })

  test('valid signature verifies correctly', async () => {
    const message = new Uint8Array(32).fill(42)
    const publicKey = publicKeyFromSeed(KNOWN_SEED)
    const sig = await sign(message, KNOWN_SEED)
    expect(verify(message, sig, publicKey)).toBe(true)
  })

  test('signature does not verify with wrong message', async () => {
    const message = new Uint8Array(32).fill(1)
    const wrongMessage = new Uint8Array(32).fill(2)
    const publicKey = publicKeyFromSeed(KNOWN_SEED)
    const sig = await sign(message, KNOWN_SEED)
    expect(verify(wrongMessage, sig, publicKey)).toBe(false)
  })

  test('signature does not verify with wrong public key', async () => {
    const message = new Uint8Array(32).fill(1)
    const otherSeed = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as Seed
    const wrongPk = publicKeyFromSeed(otherSeed)
    const sig = await sign(message, KNOWN_SEED)
    expect(verify(message, sig, wrongPk)).toBe(false)
  })

  test('flipping one byte in signature invalidates it', async () => {
    const message = new Uint8Array(32).fill(7)
    const publicKey = publicKeyFromSeed(KNOWN_SEED)
    const sig = await sign(message, KNOWN_SEED)

    const corrupted = new Uint8Array(sig)
    corrupted[0] ^= 0x01
    expect(verify(message, corrupted, publicKey)).toBe(false)
  })

  test('rejects non-canonical S (S + order) — double-spend vector', async () => {
    const message = new Uint8Array(32).fill(42)
    const publicKey = publicKeyFromSeed(KNOWN_SEED)
    const sig = await sign(message, KNOWN_SEED)

    // S' = S + order (little-endian addition); this is the malleated scalar that
    // the old bit-mask check wrongly accepted when S < 2^246 - order.
    const ORDER = 0x0029cbc14e5e0a72f05397829cbc14e5dfbd004dfe0f79992fb2540ec7768ce7n
    const sBytes = sig.slice(32, 64)
    let s = 0n
    for (let i = 31; i >= 0; i--) s = (s << 8n) | BigInt(sBytes[i] as number)
    const sPrime = s + ORDER
    const malleated = new Uint8Array(sig)
    let tmp = sPrime
    for (let i = 0; i < 32; i++) {
      malleated[32 + i] = Number(tmp & 0xffn)
      tmp >>= 8n
    }

    expect(verify(message, malleated, publicKey)).toBe(false)
  })

  test('is deterministic', async () => {
    const message = new Uint8Array(32).fill(99)
    const sig1 = await sign(message, KNOWN_SEED)
    const sig2 = await sign(message, KNOWN_SEED)
    expect(sig1).toEqual(sig2)
  })
})

describe('verify edge cases', () => {
  test('wrong-length signature returns false', async () => {
    const message = new Uint8Array(32).fill(1)
    const publicKey = publicKeyFromSeed(KNOWN_SEED)

    // Too short (32 bytes instead of 64) — throws RangeError from FourQ internals
    const shortSig = new Uint8Array(32)
    expect(() => verify(message, shortSig, publicKey)).toThrow()

    // Too long (128 bytes instead of 64) — returns false (extra bytes ignored)
    const longSig = new Uint8Array(128)
    expect(verify(message, longSig, publicKey)).toBe(false)

    // Empty signature — short input also throws
    const emptySig = new Uint8Array(0)
    expect(() => verify(message, emptySig, publicKey)).toThrow()
  })

  test('wrong-length publicKey returns false', async () => {
    const message = new Uint8Array(32).fill(1)
    const sig = await sign(message, KNOWN_SEED)

    // Too short (16 bytes instead of 32)
    const shortPk = new Uint8Array(16)
    expect(verify(message, sig, shortPk)).toBe(false)

    // Too long (64 bytes instead of 32)
    const longPk = new Uint8Array(64)
    expect(verify(message, sig, longPk)).toBe(false)

    // Empty public key
    const emptyPk = new Uint8Array(0)
    expect(verify(message, sig, emptyPk)).toBe(false)
  })

  test('empty message can be signed and verified', async () => {
    const emptyMessage = new Uint8Array(0)
    const publicKey = publicKeyFromSeed(KNOWN_SEED)
    const sig = await sign(emptyMessage, KNOWN_SEED)

    expect(sig).toBeInstanceOf(Uint8Array)
    expect(sig.length).toBe(64)
    expect(verify(emptyMessage, sig, publicKey)).toBe(true)
  })

  test('empty message signature does not verify with different message', async () => {
    const emptyMessage = new Uint8Array(0)
    const nonEmptyMessage = new Uint8Array(32).fill(1)
    const publicKey = publicKeyFromSeed(KNOWN_SEED)
    const sig = await sign(emptyMessage, KNOWN_SEED)

    expect(verify(nonEmptyMessage, sig, publicKey)).toBe(false)
  })

  test('all-zero signature returns false', async () => {
    const message = new Uint8Array(32).fill(1)
    const publicKey = publicKeyFromSeed(KNOWN_SEED)
    const zeroSig = new Uint8Array(64)
    expect(verify(message, zeroSig, publicKey)).toBe(false)
  })

  test('all-zero publicKey returns false for a real signature', async () => {
    const message = new Uint8Array(32).fill(1)
    const sig = await sign(message, KNOWN_SEED)
    const zeroPk = new Uint8Array(32)
    expect(verify(message, sig, zeroPk)).toBe(false)
  })
})
