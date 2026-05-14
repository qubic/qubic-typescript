import { describe, expect, test } from 'bun:test'
import { deriveIdentityFromSeed } from '@qubic.ts/crypto'
import { verifyTransactionSignature } from '@qubic.ts/tx'
import type { Identity, Seed } from '@qubic.ts/types'
import { createWallet } from '../wallet.js'

const SEED = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Seed
const DEST = deriveIdentityFromSeed(
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as Seed,
)

describe('createWallet', () => {
  test('derives identity from seed', () => {
    const wallet = createWallet(SEED)
    expect(wallet.identity).toBe(deriveIdentityFromSeed(SEED))
    expect(wallet.identity).toHaveLength(60)
    expect(wallet.identity).toMatch(/^[A-Z]+$/)
  })

  test('derives 32-byte public key', () => {
    const wallet = createWallet(SEED)
    expect(wallet.publicKey).toBeInstanceOf(Uint8Array)
    expect(wallet.publicKey.byteLength).toBe(32)
  })

  test('different seeds produce different identities', () => {
    const w1 = createWallet(SEED)
    const w2 = createWallet('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as Seed)
    expect(w1.identity).not.toBe(w2.identity)
  })

  test('buildTransfer produces a verifiable signed transaction', async () => {
    const wallet = createWallet(SEED)
    const { bytes, hash, encoded } = await wallet.buildTransfer({
      destination: DEST,
      amount: 100n,
      targetTick: 20_000_000,
    })

    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(hash).toHaveLength(60)
    expect(hash).toMatch(/^[a-z]+$/)
    expect(typeof encoded).toBe('string')
    expect(verifyTransactionSignature(bytes)).toBe(true)
  })

  test('buildTransfer with zero amount', async () => {
    const wallet = createWallet(SEED)
    const { bytes } = await wallet.buildTransfer({
      destination: DEST,
      amount: 0n,
      targetTick: 20_000_000,
    })
    expect(verifyTransactionSignature(bytes)).toBe(true)
  })

  test('buildScTransaction embeds payload and verifies', async () => {
    const wallet = createWallet(SEED)
    const payload = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
    const { bytes } = await wallet.buildScTransaction({
      destination: DEST,
      amount: 0n,
      targetTick: 20_000_000,
      inputType: 1,
      payload,
    })
    expect(verifyTransactionSignature(bytes)).toBe(true)
  })

  test('buildTransfer with currentTick validation: throws when targetTick <= currentTick', async () => {
    const wallet = createWallet(SEED)
    await expect(
      wallet.buildTransfer({
        destination: DEST,
        amount: 0n,
        targetTick: 100,
        currentTick: 200,
      }),
    ).rejects.toThrow()
  })

  test('buildTransfer hash is deterministic for same inputs', async () => {
    const wallet = createWallet(SEED)
    const params = { destination: DEST, amount: 50n, targetTick: 20_000_000 }
    const a = await wallet.buildTransfer(params)
    const b = await wallet.buildTransfer(params)
    expect(a.hash).toBe(b.hash)
  })
})
