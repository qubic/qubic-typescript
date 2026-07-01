import { deriveIdentityFromSeed } from '@qubic.org/crypto'
import { toSeed } from '@qubic.org/types'
import type { Seed } from '@qubic.org/types'
import { TaintStatusEnum, VaultManager } from '@qubic.org/vault'
import type { VaultPayload } from '@qubic.org/vault'

const vaultManager = new VaultManager()

export interface VaultData {
  data: Uint8Array
}

/**
 * Creates an encrypted vault containing the given seeds.
 *
 * Uses Argon2id + AES-256-GCM (v3 format).
 *
 * @example
 * ```ts
 * const vault = await createVault('my-strong-password', [seed])
 * ```
 */
export async function createVault(password: string, seeds: Seed[]): Promise<VaultData> {
  const data = await vaultManager.create(
    {
      seeds: seeds.map((seed) => ({
        publicId: deriveIdentityFromSeed(seed),
        encryptedSeed: new TextEncoder().encode(seed as string),
        taintStatus: TaintStatusEnum.UNTAINTED,
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        appVersion: '1.0.0',
        schemaVersion: 3,
      },
    },
    password,
  )
  return { data }
}

/**
 * Decrypts the vault and returns all stored seeds.
 *
 * Supports both v1 (legacy PBKDF2) and v3 (Argon2id) formats.
 *
 * @throws {Error} If the password is wrong or the ciphertext is corrupt.
 */
export async function unlockVault(vaultData: VaultData, password: string): Promise<Seed[]> {
  const payload = await vaultManager.unlock(vaultData.data, password)
  return payload.seeds.map((entry) => {
    if (entry.encryptedSeed) {
      const seed = new TextDecoder().decode(entry.encryptedSeed)
      return toSeed(seed)
    }
    // Fallback for vaults without encryptedSeed (e.g., watch-only)
    return toSeed(entry.publicId)
  })
}

/**
 * Adds a seed to an existing vault and returns a new vault encrypted with the same password.
 *
 * @throws {Error} If the password is wrong.
 */
export async function addToVault(
  vaultData: VaultData,
  password: string,
  seed: Seed,
): Promise<VaultData> {
  const payload = await vaultManager.unlock(vaultData.data, password)
  const newPayload: Omit<VaultPayload, 'version'> = {
    ...payload,
    seeds: [
      ...payload.seeds,
      {
        publicId: seed as string,
        taintStatus: TaintStatusEnum.UNTAINTED,
      },
    ],
    metadata: {
      ...payload.metadata,
      updatedAt: new Date().toISOString(),
    },
  }
  const data = await vaultManager.create(newPayload, password)
  return { data }
}

/**
 * Serialises vault data to a Uint8Array for storage or transfer.
 */
export function exportVault(vaultData: VaultData): Uint8Array {
  return vaultData.data
}

/**
 * Parses a Uint8Array vault back into `VaultData`.
 */
export function importVault(data: Uint8Array): VaultData {
  return { data }
}

/**
 * Upgrades a legacy v1 vault to the new v3 format.
 *
 * @throws {Error} If the password is wrong or the vault is not v1.
 */
export async function upgradeVault(
  vaultData: VaultData,
  oldPassword: string,
  newPassword?: string,
): Promise<VaultData> {
  const data = await vaultManager.upgrade(vaultData.data, oldPassword, newPassword)
  return { data }
}

/**
 * Returns the vault format version without decrypting.
 */
export function getVaultVersion(vaultData: VaultData): number {
  return vaultManager.getVersion(vaultData.data)
}
