import { describe, it, expect } from 'bun:test'
import { readFile } from 'node:fs/promises'
import { VaultManager } from '../vault-manager.js'

describe('VaultManager with real v1 vault', () => {
  const vault = new VaultManager()

  it('should unlock a real v1 vault file', async () => {
    const data = await readFile('/home/alez/github.com/qubic-vaults/test.qubic-vault')
    const password = 'alex2003'

    expect(vault.getVersion(data)).toBe(1)

    const payload = await vault.unlock(data, password)

    expect(payload.version).toBe(3)
    expect(payload.seeds).toBeDefined()
    expect(Array.isArray(payload.seeds)).toBe(true)
    expect(payload.metadata.schemaVersion).toBe(3)
  })

  it('should reject wrong password for v1 vault', async () => {
    const data = await readFile('/home/alez/github.com/qubic-vaults/test.qubic-vault')
    const wrongPassword = 'wrongpassword'

    await expect(vault.unlock(data, wrongPassword)).rejects.toThrow()
  })

  it('should upgrade v1 vault to v3', async () => {
    const data = await readFile('/home/alez/github.com/qubic-vaults/test.qubic-vault')
    const password = 'alex2003'

    const upgraded = await vault.upgrade(data, password)

    expect(upgraded[0]).toBe(0x03) // v3 version byte
    expect(vault.getVersion(upgraded)).toBe(3)

    const payload = await vault.unlock(upgraded, password)
    expect(payload.version).toBe(3)
    expect(payload.seeds).toBeDefined()
  })
})