import { decodeV1Payload, parseV1Envelope } from './codecs/v1.js'
import { createV3Envelope, decodeV3Payload, encodeV3Payload, parseV3Envelope } from './codecs/v3.js'
import { detectVersion } from './codecs/version-detect.js'
import { decrypt, encrypt } from './crypto/aes-gcm.js'
import { deriveKeyArgon2id } from './crypto/argon2.js'
import { deriveKeys } from './crypto/hkdf.js'
import { deriveKeyPBKDF2 } from './crypto/pbkdf2.js'
import { wrapPrivateKey, unwrapPrivateKey, encryptSeed, decryptSeed } from './crypto/rsa-oaep.js'
import { InvalidVaultError, VaultDecryptionError } from './errors.js'
import { DEFAULT_ARGON2_PARAMS } from './models/types.js'
import type { AlgorithmParams } from './models/types.js'
import type { VaultPayload, SeedEntry } from './models/vault-payload.js'
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
    const { encKey, wrapKey } = await deriveKeys(masterKey)

    // Generate RSA-OAEP key pair for seed encryption
    const rsaKeyPair = await globalThis.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt'],
    )

    // Encrypt each seed with RSA public key
    const encryptedSeeds: SeedEntry[] = []
    for (const seed of payload.seeds) {
      const entry: SeedEntry = {
        publicId: seed.publicId,
        taintStatus: seed.taintStatus,
        ...(seed.alias !== undefined && { alias: seed.alias }),
        ...(seed.isOnlyWatch !== undefined && { isOnlyWatch: seed.isOnlyWatch }),
        ...(seed.createdAt !== undefined && { createdAt: seed.createdAt }),
      }
      if (seed.encryptedSeed) {
        entry.encryptedSeed = await encryptSeed(rsaKeyPair.publicKey, seed.encryptedSeed)
      }
      encryptedSeeds.push(entry)
    }

    // Wrap RSA private key with vault's wrap_key
    const wrappedPrivateKey = await wrapPrivateKey(rsaKeyPair.privateKey, wrapKey)

    const fullPayload: VaultPayload = {
      ...payload,
      version: 3,
      seeds: encryptedSeeds,
      keyPair: {
        publicKey: await globalThis.crypto.subtle.exportKey('jwk', rsaKeyPair.publicKey),
        wrappedPrivateKey,
      },
    }
    const plaintext = encodeV3Payload(fullPayload)

    const aad = new Uint8Array([0x03])
    const { ciphertext, tag } = await encrypt(encKey, plaintext, iv, aad)

    zeroize(encKey)
    zeroize(wrapKey)
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

    return {
      version: 3,
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
  }

  private async unlockV3(data: Uint8Array, password: string): Promise<VaultPayload> {
    const envelope = parseV3Envelope(data)

    const masterKey = await deriveKeyArgon2id(password, envelope.salt, this.argon2Params)
    const { encKey, wrapKey } = await deriveKeys(masterKey)

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

    const payload = decodeV3Payload(plaintext)

    // Decrypt seeds if key pair is present
    if (payload.keyPair) {
      const privateKey = await unwrapPrivateKey(payload.keyPair.wrappedPrivateKey, wrapKey)
      const decryptedSeeds: SeedEntry[] = []
      for (const seed of payload.seeds) {
        const entry: SeedEntry = {
          publicId: seed.publicId,
          taintStatus: seed.taintStatus,
          ...(seed.alias !== undefined && { alias: seed.alias }),
          ...(seed.isOnlyWatch !== undefined && { isOnlyWatch: seed.isOnlyWatch }),
          ...(seed.createdAt !== undefined && { createdAt: seed.createdAt }),
        }
        if (seed.encryptedSeed) {
          entry.encryptedSeed = await decryptSeed(privateKey, seed.encryptedSeed)
        }
        decryptedSeeds.push(entry)
      }
      payload.seeds = decryptedSeeds
    }

    zeroize(wrapKey)

    return payload
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
