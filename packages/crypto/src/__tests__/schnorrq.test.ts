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
