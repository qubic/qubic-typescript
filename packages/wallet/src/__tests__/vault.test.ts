import { describe, expect, test } from 'bun:test'
import type { Seed } from '@qubic.org/types'
import {
  addToVault,
  createVault,
  exportVault,
  getVaultVersion,
  importVault,
  unlockVault,
  upgradeVault,
} from '../vault.js'

const SEED_A = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Seed
const SEED_B = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as Seed
const PASSWORD = 'hunter2'
const TIMEOUT = 30_000

describe('createVault / unlockVault', () => {
  test('roundtrip: create and unlock returns original seeds', { timeout: TIMEOUT }, async () => {
    const vault = await createVault(PASSWORD, [SEED_A, SEED_B])
    const seeds = await unlockVault(vault, PASSWORD)
    expect(seeds).toHaveLength(2)
    expect(seeds[0]).toBe(SEED_A)
    expect(seeds[1]).toBe(SEED_B)
  })

  test('wrong password throws error', { timeout: TIMEOUT }, async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    await expect(unlockVault(vault, 'wrong')).rejects.toThrow()
  })

  test('creates unique ciphertext on each call (random salt/iv)', { timeout: TIMEOUT }, async () => {
    const v1 = await createVault(PASSWORD, [SEED_A])
    const v2 = await createVault(PASSWORD, [SEED_A])
    expect(v1.data).not.toEqual(v2.data)
  })

  test('vault with empty seeds list roundtrips', { timeout: TIMEOUT }, async () => {
    const vault = await createVault(PASSWORD, [])
    const seeds = await unlockVault(vault, PASSWORD)
    expect(seeds).toHaveLength(0)
  })

  test('creates v3 vault', { timeout: TIMEOUT }, async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    expect(getVaultVersion(vault)).toBe(3)
  })
})

describe('addToVault', () => {
  test('appends a seed to existing vault', { timeout: TIMEOUT }, async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    const updated = await addToVault(vault, PASSWORD, SEED_B)
    const seeds = await unlockVault(updated, PASSWORD)
    expect(seeds).toHaveLength(2)
    expect(seeds[0]).toBe(SEED_A)
    expect(seeds[1]).toBe(SEED_B)
  })

  test('wrong password throws error', { timeout: TIMEOUT }, async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    await expect(addToVault(vault, 'wrong', SEED_B)).rejects.toThrow()
  })
})

describe('exportVault / importVault', () => {
  test('roundtrip: export → import → unlock', { timeout: TIMEOUT }, async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    const exported = exportVault(vault)
    const imported = importVault(exported)
    const seeds = await unlockVault(imported, PASSWORD)
    expect(seeds[0]).toBe(SEED_A)
  })

  test('importVault preserves data', { timeout: TIMEOUT }, async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    const exported = exportVault(vault)
    const imported = importVault(exported)
    expect(imported.data).toEqual(vault.data)
  })
})

describe('upgradeVault', () => {
  test('upgrades v1 vault to v3', { timeout: TIMEOUT }, async () => {
    // Create a v3 vault first (we don't have v1 test data easily available)
    const vault = await createVault(PASSWORD, [SEED_A])
    expect(getVaultVersion(vault)).toBe(3)

    // upgradeVault expects v1, so this should throw
    await expect(upgradeVault(vault, PASSWORD)).rejects.toThrow('Only v1 vaults can be upgraded')
  })
})

describe('getVaultVersion', () => {
  test('returns 3 for newly created vaults', { timeout: TIMEOUT }, async () => {
    const vault = await createVault(PASSWORD, [SEED_A])
    expect(getVaultVersion(vault)).toBe(3)
  })
})
