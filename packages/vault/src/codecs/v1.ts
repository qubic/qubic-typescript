import { InvalidVaultError } from '../errors.js'

export interface V1Envelope {
  salt: string
  iv: string
  cipher: string
}

export interface V1VaultData {
  privateKey: string
  publicKey: JsonWebKey
  configuration: {
    seeds: Array<{
      alias: string
      publicId: string
      encryptedSeed: string
      balance: number
      balanceTick: number
      lastUpdate?: Date
      assets?: Array<unknown>
      isExported?: boolean
      isOnlyWatch?: boolean
    }>
    publicKey?: JsonWebKey
  }
}

export function parseV1Envelope(data: Uint8Array): V1Envelope {
  const json = JSON.parse(new TextDecoder().decode(data))
  if (!json.salt || !json.iv) {
    throw new InvalidVaultError('missing required fields (salt, iv)')
  }
  // Support both ts-vault-library format (cipher) and old wallet format (ciphertext)
  const cipher = json.cipher || json.ciphertext
  if (!cipher) {
    throw new InvalidVaultError('missing cipher/ciphertext field')
  }
  return { salt: json.salt, iv: json.iv, cipher }
}

export function decodeV1Payload(plaintext: Uint8Array): V1VaultData {
  const json = JSON.parse(new TextDecoder().decode(plaintext))
  if (!json.privateKey || !json.publicKey || !json.configuration) {
    throw new InvalidVaultError('missing required fields (privateKey, publicKey, configuration)')
  }
  return json as V1VaultData
}
