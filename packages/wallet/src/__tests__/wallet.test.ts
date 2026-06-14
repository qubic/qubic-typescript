import { describe, expect, test } from 'bun:test'
import { deriveIdentityFromSeed } from '@qubic.org/crypto'
import { verifyTransactionSignature } from '@qubic.org/tx'
import type { Seed } from '@qubic.org/types'
import { InvalidSeedError } from '@qubic.org/types'
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

  test('buildTransaction produces a verifiable signed transaction', async () => {
    const wallet = createWallet(SEED)
    const { bytes, hash, encoded } = await wallet.buildTransaction({
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

  test('buildTransaction with zero amount', async () => {
    const wallet = createWallet(SEED)
    const { bytes } = await wallet.buildTransaction({
      destination: DEST,
      amount: 0n,
      targetTick: 20_000_000,
    })
    expect(verifyTransactionSignature(bytes)).toBe(true)
  })

  test('buildContractCall embeds payload and verifies', async () => {
    const wallet = createWallet(SEED)
    const payload = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
    const { bytes } = await wallet.buildContractCall({
      destination: DEST,
      amount: 0n,
      targetTick: 20_000_000,
      inputType: 1,
      payload,
    })
    expect(verifyTransactionSignature(bytes)).toBe(true)
  })

  test('buildTransaction with currentTick validation: throws when targetTick <= currentTick', async () => {
    const wallet = createWallet(SEED)
    await expect(
      wallet.buildTransaction({
        destination: DEST,
        amount: 0n,
        targetTick: 100,
        currentTick: 200,
      }),
    ).rejects.toThrow()
  })

  test('buildTransaction hash is deterministic for same inputs', async () => {
    const wallet = createWallet(SEED)
    const params = { destination: DEST, amount: 50n, targetTick: 20_000_000 }
    const a = await wallet.buildTransaction(params)
    const b = await wallet.buildTransaction(params)
    expect(a.hash).toBe(b.hash)
  })

  test('throws InvalidSeedError for too-short seed', () => {
    expect(() => createWallet('a'.repeat(54) as Seed)).toThrow(InvalidSeedError)
  })

  test('throws InvalidSeedError for too-long seed', () => {
    expect(() => createWallet('a'.repeat(56) as Seed)).toThrow(InvalidSeedError)
  })

  test('throws InvalidSeedError for uppercase seed', () => {
    expect(() => createWallet('A'.repeat(55) as Seed)).toThrow(InvalidSeedError)
  })

  test('throws InvalidSeedError for numeric seed', () => {
    expect(() => createWallet('1'.repeat(55) as Seed)).toThrow(InvalidSeedError)
  })

  test('throws InvalidSeedError for empty string', () => {
    expect(() => createWallet('' as Seed)).toThrow(InvalidSeedError)
  })
})
