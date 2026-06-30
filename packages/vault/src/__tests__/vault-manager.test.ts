import { describe, expect, it } from 'bun:test'
import { TaintStatus } from '../models/types.js'
import { VaultManager } from '../vault-manager.js'

describe('VaultManager', () => {
  const vault = new VaultManager()

  const samplePayload = {
    seeds: [
      {
        publicId: 'MZTVEQPHKLNDSYXBWUFAJGORCEIMVWHTFDCQNZALKBXSPJYUIDMVGOEXYZAB',
        taintStatus: TaintStatus.UNTAINTED,
      },
    ],
    metadata: {
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      appVersion: '1.0.0',
      schemaVersion: 3 as const,
    },
  }

  it('should create and unlock a vault', async () => {
    const password = 'test-password-123'
    const encrypted = await vault.create(samplePayload, password)

    expect(encrypted).toBeInstanceOf(Uint8Array)
    expect(encrypted[0]).toBe(0x03) // v3 version byte

    const unlocked = await vault.unlock(encrypted, password)

    expect(unlocked.version).toBe(3)
    expect(unlocked.seeds).toHaveLength(1)
    expect(unlocked.seeds[0].publicId).toBe(samplePayload.seeds[0].publicId)
    expect(unlocked.metadata.schemaVersion).toBe(3)
  })

  it('should detect vault version', async () => {
    const password = 'test-password-123'
    const encrypted = await vault.create(samplePayload, password)

    expect(vault.getVersion(encrypted)).toBe(3)
  })

  it('should reject wrong password', async () => {
    const password = 'correct-password'
    const wrongPassword = 'wrong-password'
    const encrypted = await vault.create(samplePayload, password)

    await expect(vault.unlock(encrypted, wrongPassword)).rejects.toThrow()
  })

  it('should handle multiple seeds', async () => {
    const payload = {
      ...samplePayload,
      seeds: [
        samplePayload.seeds[0],
        {
          publicId: 'QRGDSNMYHKVPXJEFBWZLOUAHTCEIMKRNVYCDSFBGXWPJZNITQVDALOXQXYZW',
          taintStatus: TaintStatus.TAINTED,
          alias: 'Bob',
        },
      ],
    }

    const password = 'test-password-123'
    const encrypted = await vault.create(payload, password)
    const unlocked = await vault.unlock(encrypted, password)

    expect(unlocked.seeds).toHaveLength(2)
    expect(unlocked.seeds[0].taintStatus).toBe(TaintStatus.UNTAINTED)
    expect(unlocked.seeds[1].taintStatus).toBe(TaintStatus.TAINTED)
    expect(unlocked.seeds[1].alias).toBe('Bob')
  })
})
