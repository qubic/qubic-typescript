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

  test('is deterministic', async () => {
    const message = new Uint8Array(32).fill(99)
    const sig1 = await sign(message, KNOWN_SEED)
    const sig2 = await sign(message, KNOWN_SEED)
    expect(sig1).toEqual(sig2)
  })
})
