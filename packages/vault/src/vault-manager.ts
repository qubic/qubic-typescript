import { DEFAULT_ARGON2_PARAMS } from './models/types.js'
import type { AlgorithmParams } from './models/types.js'
import type { VaultPayload, SeedEntry, VaultMetadata } from './models/vault-payload.js'
import { detectVersion } from './codecs/version-detect.js'
import { parseV3Envelope, createV3Envelope, encodeV3Payload, decodeV3Payload } from './codecs/v3.js'
import { parseV1Envelope, decodeV1Payload } from './codecs/v1.js'
import { deriveKeyArgon2id } from './crypto/argon2.js'
import { deriveKeys } from './crypto/hkdf.js'
import { encrypt, decrypt } from './crypto/aes-gcm.js'
import { randomBytes } from './utils/encoding.js'
import { zeroize } from './utils/zeroize.js'

export interface VaultManagerOptions {
  argon2?: Partial<AlgorithmParams>
}

export class VaultManager {
  private argon2Params: AlgorithmParams

  constructor(options?: VaultManagerOptions) {
    this.argon2Params = {
      ...DEFAULT_ARGON2_PARAMS,
      ...options?.argon2,
    }
  }

  async create(payload: Omit<VaultPayload, 'version'>, password: string): Promise<Uint8Array> {
    const salt = randomBytes(32)
    const iv = randomBytes(12)

    const masterKey = await deriveKeyArgon2id(password, salt, this.argon2Params)
    const { encKey } = await deriveKeys(masterKey)

    const fullPayload: VaultPayload = { ...payload, version: 3 }
    const plaintext = encodeV3Payload(fullPayload)

    const aad = new Uint8Array([0x03])
    const { ciphertext, tag } = await encrypt(encKey, plaintext, iv, aad)

    zeroize(encKey)
    zeroize(masterKey)

    return createV3Envelope(salt, iv, tag, ciphertext)
  }

  async unlock(data: Uint8Array, password: string): Promise<VaultPayload> {
    const version = detectVersion(data)

    if (version === 3) {
      return this.unlockV3(data, password)
    }

    if (version === 1) {
      throw new Error('v1 vaults require upgrade. Use upgrade() instead.')
    }

    throw new Error(`Unsupported vault version: ${version}`)
  }

  getVersion(data: Uint8Array): number {
    return detectVersion(data)
  }

  async upgrade(data: Uint8Array, oldPassword: string, newPassword?: string): Promise<Uint8Array> {
    const version = detectVersion(data)

    if (version !== 1) {
      throw new Error('Only v1 vaults can be upgraded')
    }

    const v1Envelope = parseV1Envelope(data)
    const v1Data = decodeV1Payload(fromBase64(v1Envelope.cipher))

    const payload: Omit<VaultPayload, 'version'> = {
      seeds: v1Data.configuration.seeds.map((seed) => ({
        publicId: seed.publicId,
        alias: seed.alias,
        taintStatus: 0 as const,
        ...(seed.isOnlyWatch !== undefined && { isOnlyWatch: seed.isOnlyWatch }),
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        appVersion: '1.0.0',
        schemaVersion: 3,
      },
    }

    return this.create(payload, newPassword ?? oldPassword)
  }

  private async unlockV3(data: Uint8Array, password: string): Promise<VaultPayload> {
    const envelope = parseV3Envelope(data)

    const masterKey = await deriveKeyArgon2id(password, envelope.salt, this.argon2Params)
    const { encKey } = await deriveKeys(masterKey)

    const aad = new Uint8Array([0x03])
    const plaintext = await decrypt(encKey, envelope.ciphertext, envelope.iv, envelope.tag, aad)

    zeroize(encKey)
    zeroize(masterKey)

    return decodeV3Payload(plaintext)
  }

  zeroize(payload: VaultPayload): void {
    for (const seed of payload.seeds) {
      if (seed.encryptedSeed) {
        zeroize(seed.encryptedSeed)
      }
    }
    if (payload.keyPair?.wrappedPrivateKey) {
      zeroize(payload.keyPair.wrappedPrivateKey)
    }
  }
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}