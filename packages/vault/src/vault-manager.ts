import { decodeV1Payload, parseV1Envelope } from './codecs/v1.js'
import { createV3Envelope, decodeV3Payload, encodeV3Payload, parseV3Envelope } from './codecs/v3.js'
import { detectVersion } from './codecs/version-detect.js'
import { decrypt, encrypt } from './crypto/aes-gcm.js'
import { deriveKeyArgon2id } from './crypto/argon2.js'
import { deriveKeys } from './crypto/hkdf.js'
import { deriveKeyPBKDF2 } from './crypto/pbkdf2.js'
import { decryptSeed } from './crypto/rsa-oaep.js'
import { InvalidVaultError, VaultDecryptionError } from './errors.js'
import { DEFAULT_ARGON2_PARAMS, TaintStatus } from './models/types.js'
import type { AlgorithmParams } from './models/types.js'
import type { SeedEntry, VaultPayload } from './models/vault-payload.js'
import { fromBase64, randomBytes } from './utils/encoding.js'
import { zeroize } from './utils/zeroize.js'

const V1_PBKDF2_ITERATIONS = 100_000

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
      return this.unlockV1(data, password)
    }

    throw new InvalidVaultError(`unsupported version: ${version}`)
  }

  getVersion(data: Uint8Array): number {
    return detectVersion(data)
  }

  async upgrade(data: Uint8Array, oldPassword: string, newPassword?: string): Promise<Uint8Array> {
    const version = detectVersion(data)

    if (version !== 1) {
      throw new InvalidVaultError('only v1 vaults can be upgraded')
    }

    const payload = await this.unlockV1(data, oldPassword)

    const { version: _, ...payloadWithoutVersion } = payload
    return this.create(payloadWithoutVersion, newPassword ?? oldPassword)
  }

  async addSeed(data: Uint8Array, password: string, seed: Omit<SeedEntry, 'taintStatus'> & Partial<Pick<SeedEntry, 'taintStatus'>>): Promise<Uint8Array> {
    const payload = await this.unlock(data, password)
    const now = new Date().toISOString()

    const nextPayload: Omit<VaultPayload, 'version'> = {
      ...payload,
      seeds: [
        ...payload.seeds,
        {
          ...seed,
          taintStatus: seed.taintStatus ?? TaintStatus.UNTAINTED,
          createdAt: seed.createdAt ?? now,
        },
      ],
      metadata: {
        ...payload.metadata,
        updatedAt: now,
      },
    }

    return this.create(nextPayload, password)
  }

  private async unlockV1(data: Uint8Array, password: string): Promise<VaultPayload> {
    const envelope = parseV1Envelope(data)
    const salt = fromBase64(envelope.salt)
    const iv = fromBase64(envelope.iv)
    const ciphertext = fromBase64(envelope.cipher)

    const key = await deriveKeyPBKDF2(password, salt, V1_PBKDF2_ITERATIONS)

    let plaintext: Uint8Array
    try {
      plaintext = await decrypt(key, ciphertext.slice(0, -16), iv, ciphertext.slice(-16))
    } catch (e) {
      throw new VaultDecryptionError({ cause: e })
    } finally {
      zeroize(key)
    }

    const v1Data = decodeV1Payload(plaintext)
    const privateKey = await this.importV1PrivateKey(v1Data.privateKey, password)

    return {
      version: 3,
      seeds: await Promise.all(
        v1Data.configuration.seeds.map(async (seed) => ({
          publicId: seed.publicId,
          encryptedSeed: await decryptSeed(privateKey, fromBase64(seed.encryptedSeed)),
          alias: seed.alias,
          taintStatus: TaintStatus.UNTAINTED,
          ...(seed.isOnlyWatch !== undefined && { isOnlyWatch: seed.isOnlyWatch }),
        })),
      ),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        appVersion: '1.0.0',
        schemaVersion: 3,
      },
    }
  }

  private async importV1PrivateKey(wrappedPrivateKey: string, password: string): Promise<CryptoKey> {
    const passwordKey = await globalThis.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password) as unknown as BufferSource,
      { name: 'PBKDF2' },
      false,
      ['deriveKey'],
    )

    const wrappingKey = await globalThis.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(16),
        iterations: V1_PBKDF2_ITERATIONS,
        hash: 'SHA-256',
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['unwrapKey'],
    )

    try {
      return await globalThis.crypto.subtle.unwrapKey(
        'jwk',
        fromBase64(wrappedPrivateKey) as unknown as BufferSource,
        wrappingKey,
        { name: 'AES-GCM', iv: new Uint8Array(12) },
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['decrypt'],
      )
    } catch (e) {
      throw new VaultDecryptionError({ cause: e })
    }
  }

  private async unlockV3(data: Uint8Array, password: string): Promise<VaultPayload> {
    const envelope = parseV3Envelope(data)

    const masterKey = await deriveKeyArgon2id(password, envelope.salt, this.argon2Params)
    const { encKey } = await deriveKeys(masterKey)

    const aad = new Uint8Array([0x03])
    let plaintext: Uint8Array
    try {
      plaintext = await decrypt(encKey, envelope.ciphertext, envelope.iv, envelope.tag, aad)
    } catch (e) {
      throw new VaultDecryptionError({ cause: e })
    } finally {
      zeroize(encKey)
      zeroize(masterKey)
    }

    return decodeV3Payload(plaintext)
  }

  zeroize(payload: VaultPayload): void {
    for (const seed of payload.seeds) {
      if (seed.encryptedSeed) {
        zeroize(seed.encryptedSeed)
      }
    }
  }
}
