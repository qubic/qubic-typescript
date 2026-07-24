import { describe, expect, it } from 'bun:test'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { InvalidVaultError, VaultDecryptionError } from '../errors.js'
import { TaintStatus } from '../models/types.js'
import { VaultManager } from '../vault-manager.js'

const VAULT_PATH = join(import.meta.dir, 'test.qubic-vault')
const TEST_PASSWORD = 'test1234'
const TEST_SEED = 'yfvrbbecrwhowzvklnsdlyykdmccdpakeffktxujlltwecbyhaehmis'
const TIMEOUT = 30_000

describe('VaultManager with v1 vault', () => {
  const vault = new VaultManager()

  it('should unlock a v1 vault file', { timeout: TIMEOUT }, async () => {
    const data = await readFile(VAULT_PATH)

    expect(vault.getVersion(data)).toBe(1)

    const payload = await vault.unlock(data, TEST_PASSWORD)

    expect(payload.version).toBe(3)
    expect(payload.seeds).toBeDefined()
    expect(Array.isArray(payload.seeds)).toBe(true)
    expect(payload.seeds).toHaveLength(1)
    expect(payload.seeds[0].alias).toBe('Account 1')
    expect(payload.seeds[0].encryptedSeed).toBeDefined()
    expect(payload.seeds[0].encryptedSeed).toBeInstanceOf(Uint8Array)
    expect(new TextDecoder().decode(payload.seeds[0].encryptedSeed)).toBe(TEST_SEED)
    expect(payload.metadata.schemaVersion).toBe(3)
  })

  it('should reject wrong password for v1 vault', { timeout: TIMEOUT }, async () => {
    const data = await readFile(VAULT_PATH)

    await expect(vault.unlock(data, 'wrongpassword')).rejects.toThrow(VaultDecryptionError)
  })

  it('should upgrade v1 vault to v3', { timeout: TIMEOUT }, async () => {
    const data = await readFile(VAULT_PATH)

    const upgraded = await vault.upgrade(data, TEST_PASSWORD)

    expect(upgraded[0]).toBe(0x03)
    expect(vault.getVersion(upgraded)).toBe(3)

    const payload = await vault.unlock(upgraded, TEST_PASSWORD)
    expect(payload.version).toBe(3)
    expect(payload.seeds).toBeDefined()
    expect(payload.seeds).toHaveLength(1)
    expect(payload.seeds[0].encryptedSeed).toBeDefined()
    expect(new TextDecoder().decode(payload.seeds[0].encryptedSeed)).toBe(TEST_SEED)
  })

  it('should add a seed to a v1 vault after unlocking it', { timeout: TIMEOUT }, async () => {
    const data = await readFile(VAULT_PATH)
    const addedSeed = new TextEncoder().encode('second-seed')

    const updated = await vault.addSeed(data, TEST_PASSWORD, {
      publicId: 'QRGDSNMYHKVPXJEFBWZLOUAHTCEIMKRNVYCDSFBGXWPJZNITQVDALOXQXYZW',
      encryptedSeed: addedSeed,
      alias: 'Second account',
    })

    expect(vault.getVersion(updated)).toBe(3)

    const payload = await vault.unlock(updated, TEST_PASSWORD)
    expect(payload.seeds).toHaveLength(2)
    expect(new TextDecoder().decode(payload.seeds[0].encryptedSeed)).toBe(TEST_SEED)
    expect(payload.seeds[1]).toMatchObject({
      publicId: 'QRGDSNMYHKVPXJEFBWZLOUAHTCEIMKRNVYCDSFBGXWPJZNITQVDALOXQXYZW',
      alias: 'Second account',
      taintStatus: TaintStatus.UNTAINTED,
    })
    expect(payload.seeds[1].encryptedSeed).toEqual(addedSeed)
  })

  it('should detect old wallet vault format with ciphertext field', () => {
    // Old wallet format uses "ciphertext" instead of "cipher"
    const oldFormat = JSON.stringify({
      version: 1,
      iterations: 100000,
      salt: 'dGVzdA==', // base64 "test"
      iv: 'dGVzdA==', // base64 "test"
      ciphertext: 'dGVzdA==', // base64 "test"
    })
    const data = new TextEncoder().encode(oldFormat)
    expect(vault.getVersion(data)).toBe(1)
  })

  it('should throw InvalidVaultError for unknown format', () => {
    const data = new Uint8Array([0x01, 0x02, 0x03])
    expect(() => vault.getVersion(data)).toThrow(InvalidVaultError)
  })
})
