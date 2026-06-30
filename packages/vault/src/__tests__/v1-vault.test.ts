import { describe, it, expect } from 'bun:test'
import { readFile } from 'node:fs/promises'
import { VaultManager } from '../vault-manager.js'

const VAULT_PATH = '/home/alez/github.com/qubic-vaults/test.qubic-vault'
const TEST_PASSWORD = 'test1234'

describe('VaultManager with v1 vault', () => {
  const vault = new VaultManager()

  it('should unlock a v1 vault file', async () => {
    const data = await readFile(VAULT_PATH)

    expect(vault.getVersion(data)).toBe(1)

    const payload = await vault.unlock(data, TEST_PASSWORD)

    expect(payload.version).toBe(3)
    expect(payload.seeds).toBeDefined()
    expect(Array.isArray(payload.seeds)).toBe(true)
    expect(payload.metadata.schemaVersion).toBe(3)
  })

  it('should reject wrong password for v1 vault', async () => {
    const data = await readFile(VAULT_PATH)

    await expect(vault.unlock(data, 'wrongpassword')).rejects.toThrow()
  })

  it('should upgrade v1 vault to v3', async () => {
    const data = await readFile(VAULT_PATH)

    const upgraded = await vault.upgrade(data, TEST_PASSWORD)

    expect(upgraded[0]).toBe(0x03)
    expect(vault.getVersion(upgraded)).toBe(3)

    const payload = await vault.unlock(upgraded, TEST_PASSWORD)
    expect(payload.version).toBe(3)
    expect(payload.seeds).toBeDefined()
  })
})