import { describe, expect, test } from 'bun:test'
import type { Seed } from '@qubic.ts/types'
import { InvalidVaultError, VaultDecryptionError } from '../errors.js'
import { addToVault, createVault, exportVault, importVault, unlockVault } from '../vault.js'

const SEED_A = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Seed
const SEED_B = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as Seed
const PASSWORD = 'hunter2'

describe('createVault / unlockVault', () => {
  test('roundtrip: create and unlock returns original seeds', async () => {
    const vault = await createVault(PASSWORD, [SEED_A, SEED_B])
    const seeds = await unlockVault(vault, PASSWORD)
    expect(seeds).toHaveLength(2)
    expect(seeds[0]).toBe(SEED_A)
    expect(seeds[1]).toBe(SEED_B)
  })

  test('wrong password throws VaultDecryptionError', async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    await expect(unlockVault(vault, 'wrong')).rejects.toThrow(VaultDecryptionError)
  })

  test('creates unique ciphertext on each call (random salt/iv)', async () => {
    const v1 = await createVault(PASSWORD, [SEED_A])
    const v2 = await createVault(PASSWORD, [SEED_A])
    expect(v1.salt).not.toBe(v2.salt)
    expect(v1.iv).not.toBe(v2.iv)
    expect(v1.ciphertext).not.toBe(v2.ciphertext)
  })

  test('vault with empty seeds list roundtrips', async () => {
    const vault = await createVault(PASSWORD, [])
    const seeds = await unlockVault(vault, PASSWORD)
    expect(seeds).toHaveLength(0)
  })
})

describe('addToVault', () => {
  test('appends a seed to existing vault', async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    const updated = await addToVault(vault, PASSWORD, SEED_B)
    const seeds = await unlockVault(updated, PASSWORD)
    expect(seeds).toHaveLength(2)
    expect(seeds[0]).toBe(SEED_A)
    expect(seeds[1]).toBe(SEED_B)
  })

  test('wrong password throws VaultDecryptionError', async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    await expect(addToVault(vault, 'wrong', SEED_B)).rejects.toThrow(VaultDecryptionError)
  })
})

describe('exportVault / importVault', () => {
  test('roundtrip: export → import → unlock', async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    const json = exportVault(vault)
    const imported = importVault(json)
    const seeds = await unlockVault(imported, PASSWORD)
    expect(seeds[0]).toBe(SEED_A)
  })

  test('importVault throws InvalidVaultError for invalid JSON', () => {
    expect(() => importVault('not-json')).toThrow(InvalidVaultError)
  })

  test('importVault throws InvalidVaultError for missing fields', () => {
    expect(() => importVault('{"version":1}')).toThrow(InvalidVaultError)
  })

  test('corrupt ciphertext throws VaultDecryptionError', async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    const corrupt = { ...vault, ciphertext: 'deadbeef'.repeat(20) }
    await expect(unlockVault(corrupt, PASSWORD)).rejects.toThrow(VaultDecryptionError)
  })

  test('unsupported version throws InvalidVaultError', async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    const unsupported = { ...vault, version: 99 }
    await expect(unlockVault(unsupported, PASSWORD)).rejects.toThrow(InvalidVaultError)
  })
})
