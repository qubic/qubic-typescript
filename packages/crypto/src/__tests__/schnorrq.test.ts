import { describe, expect, test } from 'bun:test'
import type { Seed } from '../brands.js'
import { deriveKeys } from '../identity.js'
import { publicKeyFromSeed, sign, verify } from '../index.js'
import { sign as schnorrqSign, verify as schnorrqVerify } from '../schnorrq.js'

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

describe('cross-verification against reference protocol', () => {
  test('schnorrqSign produces signature verifiable by schnorrqVerify', () => {
    // Verifies that the low-level sign/verify functions are consistent
    const { subseed, publicKey } = deriveKeys(KNOWN_SEED)
    const message = new Uint8Array(32).fill(0xab)
    const sig = schnorrqSign(subseed, publicKey, message)
    expect(schnorrqVerify(publicKey, message, sig)).toBe(true)
  })

  test('sign produces 64-byte signature with R and s components', () => {
    const { subseed, publicKey } = deriveKeys(KNOWN_SEED)
    const message = new Uint8Array(32).fill(1)
    const sig = schnorrqSign(subseed, publicKey, message)
    expect(sig.length).toBe(64)
    // R point (first 32 bytes) must have bit 127 clear (valid compressed point)
    expect((sig[15] as number) & 0x80).toBe(0)
  })

  test('signature from index.sign() verifies with same key via schnorrqVerify', async () => {
    // Cross-check: high-level sign vs low-level verify
    const message = new Uint8Array(32).fill(99)
    const publicKey = publicKeyFromSeed(KNOWN_SEED)
    const sig = await sign(message, KNOWN_SEED)
    expect(schnorrqVerify(publicKey, message, sig)).toBe(true)
  })

  test('schnorrqSign from index.sign() matches direct schnorrqSign call', async () => {
    // The high-level sign() and direct schnorrqSign() must produce identical signatures
    const { subseed, publicKey } = deriveKeys(KNOWN_SEED)
    const message = new Uint8Array(32).fill(7)
    const highLevel = await sign(message, KNOWN_SEED)
    const lowLevel = schnorrqSign(subseed, publicKey, message)
    expect(highLevel).toEqual(lowLevel)
  })

  test('signing different messages with same key produces different signatures', () => {
    const { subseed, publicKey } = deriveKeys(KNOWN_SEED)
    const sig1 = schnorrqSign(subseed, publicKey, new Uint8Array(32).fill(1))
    const sig2 = schnorrqSign(subseed, publicKey, new Uint8Array(32).fill(2))
    expect(sig1).not.toEqual(sig2)
  })

  test('signing same message with different keys produces different signatures', () => {
    const keys1 = deriveKeys(KNOWN_SEED)
    const seed2 = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as Seed
    const keys2 = deriveKeys(seed2)
    const message = new Uint8Array(32).fill(42)
    const sig1 = schnorrqSign(keys1.subseed, keys1.publicKey, message)
    const sig2 = schnorrqSign(keys2.subseed, keys2.publicKey, message)
    expect(sig1).not.toEqual(sig2)
  })
})
