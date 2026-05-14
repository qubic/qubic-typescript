import { toSeed } from '@qubic.ts/types'
import type { Seed } from '@qubic.ts/types'
import { InvalidVaultError, VaultDecryptionError } from './errors.js'

const VAULT_VERSION = 1
const PBKDF2_ITERATIONS = 600_000
const SALT_BYTES = 16
const IV_BYTES = 12

interface VaultPayload {
  seeds: string[]
}

export interface VaultData {
  version: number
  iterations: number
  salt: string
  iv: string
  ciphertext: string
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  if (hex.length % 2 !== 0) throw new InvalidVaultError('odd-length hex string')
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const baseKey = await globalThis.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return globalThis.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

async function encryptPayload(
  seeds: Seed[],
  password: string,
): Promise<{ salt: Uint8Array<ArrayBuffer>; iv: Uint8Array<ArrayBuffer>; ciphertext: Uint8Array }> {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const key = await deriveKey(password, salt)

  const payload: VaultPayload = { seeds: seeds as string[] }
  const plaintext = new TextEncoder().encode(JSON.stringify(payload))
  const ciphertext = new Uint8Array(await globalThis.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext))

  return { salt, iv, ciphertext }
}

async function decryptPayload(vaultData: VaultData, password: string): Promise<Seed[]> {
  let salt: Uint8Array<ArrayBuffer>
  let iv: Uint8Array<ArrayBuffer>
  let ciphertext: Uint8Array<ArrayBuffer>
  try {
    salt = fromHex(vaultData.salt)
    iv = fromHex(vaultData.iv)
    ciphertext = fromHex(vaultData.ciphertext)
  } catch {
    throw new InvalidVaultError('malformed hex fields')
  }

  const key = await deriveKey(password, salt)

  let plaintext: ArrayBuffer
  try {
    plaintext = await globalThis.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  } catch (e) {
    throw new VaultDecryptionError({ cause: e })
  }

  let payload: VaultPayload
  try {
    payload = JSON.parse(new TextDecoder().decode(plaintext)) as VaultPayload
  } catch (e) {
    throw new VaultDecryptionError({ cause: e })
  }

  if (!Array.isArray(payload.seeds)) throw new InvalidVaultError('seeds field is not an array')
  return payload.seeds.map((s) => toSeed(s))
}

/**
 * Creates an encrypted vault containing the given seeds.
 *
 * Uses PBKDF2-SHA256 (100k iterations) to derive an AES-256-GCM key from the password.
 *
 * @example
 * ```ts
 * const vault = await createVault('my-strong-password', [seed])
 * ```
 */
export async function createVault(password: string, seeds: Seed[]): Promise<VaultData> {
  const { salt, iv, ciphertext } = await encryptPayload(seeds, password)
  return {
    version: VAULT_VERSION,
    iterations: PBKDF2_ITERATIONS,
    salt: toHex(salt),
    iv: toHex(iv),
    ciphertext: toHex(ciphertext),
  }
}

/**
 * Decrypts the vault and returns all stored seeds.
 *
 * @throws {VaultDecryptionError} If the password is wrong or the ciphertext is corrupt.
 * @throws {InvalidVaultError} If the vault structure is malformed.
 */
export async function unlockVault(vaultData: VaultData, password: string): Promise<Seed[]> {
  if (vaultData.version !== VAULT_VERSION) {
    throw new InvalidVaultError(`unsupported version ${vaultData.version}`)
  }
  return decryptPayload(vaultData, password)
}

/**
 * Adds a seed to an existing vault and returns a new vault encrypted with the same password.
 *
 * @throws {VaultDecryptionError} If the password is wrong.
 */
export async function addToVault(
  vaultData: VaultData,
  password: string,
  seed: Seed,
): Promise<VaultData> {
  const seeds = await unlockVault(vaultData, password)
  return createVault(password, [...seeds, seed])
}

/**
 * Serialises vault data to a JSON string for storage or transfer.
 */
export function exportVault(vaultData: VaultData): string {
  return JSON.stringify(vaultData, null, 2)
}

/**
 * Parses a JSON vault string back into `VaultData`.
 *
 * @throws {InvalidVaultError} If the JSON is malformed or missing required fields.
 */
export function importVault(json: string): VaultData {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new InvalidVaultError('invalid JSON')
  }
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>)['version'] !== 'number' ||
    typeof (parsed as Record<string, unknown>)['salt'] !== 'string' ||
    typeof (parsed as Record<string, unknown>)['iv'] !== 'string' ||
    typeof (parsed as Record<string, unknown>)['ciphertext'] !== 'string' ||
    typeof (parsed as Record<string, unknown>)['iterations'] !== 'number'
  ) {
    throw new InvalidVaultError('missing required fields')
  }
  return parsed as VaultData
}
