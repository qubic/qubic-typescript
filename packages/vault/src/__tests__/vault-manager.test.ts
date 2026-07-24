import { describe, expect, it } from 'bun:test'
import { TaintStatus } from '../models/types.js'
import { VaultManager } from '../vault-manager.js'

const TIMEOUT = 30_000

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

  it('should create and unlock a vault', { timeout: TIMEOUT }, async () => {
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

  it('should detect vault version', { timeout: TIMEOUT }, async () => {
    const password = 'test-password-123'
    const encrypted = await vault.create(samplePayload, password)

    expect(vault.getVersion(encrypted)).toBe(3)
  })

  it('should reject wrong password', { timeout: TIMEOUT }, async () => {
    const password = 'correct-password'
    const wrongPassword = 'wrong-password'
    const encrypted = await vault.create(samplePayload, password)

    await expect(vault.unlock(encrypted, wrongPassword)).rejects.toThrow()
  })

  it('should handle multiple seeds', { timeout: TIMEOUT }, async () => {
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

  it(
    'should preserve encrypted seed bytes when round-tripping v3 vaults',
    { timeout: TIMEOUT },
    async () => {
      const seedBytes = new Uint8Array([0, 1, 2, 127, 128, 255])
      const payload = {
        ...samplePayload,
        seeds: [
          {
            ...samplePayload.seeds[0],
            encryptedSeed: seedBytes,
          },
        ],
      }

      const encrypted = await vault.create(payload, 'test-password-123')
      const unlocked = await vault.unlock(encrypted, 'test-password-123')

      expect(unlocked.seeds[0].encryptedSeed).toBeInstanceOf(Uint8Array)
      expect(unlocked.seeds[0].encryptedSeed).toEqual(seedBytes)
    },
  )

  it('should add a seed to a v3 vault and update metadata', { timeout: TIMEOUT }, async () => {
    const encrypted = await vault.create(samplePayload, 'test-password-123')
    const addedSeed = new TextEncoder().encode('added-seed')

    const updated = await vault.addSeed(encrypted, 'test-password-123', {
      publicId: 'QRGDSNMYHKVPXJEFBWZLOUAHTCEIMKRNVYCDSFBGXWPJZNITQVDALOXQXYZW',
      encryptedSeed: addedSeed,
      alias: 'Added',
    })

    const unlocked = await vault.unlock(updated, 'test-password-123')
    expect(unlocked.seeds).toHaveLength(2)
    expect(unlocked.seeds[1]).toMatchObject({
      publicId: 'QRGDSNMYHKVPXJEFBWZLOUAHTCEIMKRNVYCDSFBGXWPJZNITQVDALOXQXYZW',
      alias: 'Added',
      taintStatus: TaintStatus.UNTAINTED,
    })
    expect(unlocked.seeds[1].encryptedSeed).toEqual(addedSeed)
    expect(Date.parse(unlocked.metadata.updatedAt)).toBeGreaterThanOrEqual(
      Date.parse(samplePayload.metadata.updatedAt),
    )
  })
})
