import { fromBase64 } from '../utils/encoding.js'

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
  if (!json.salt || !json.iv || !json.cipher) {
    throw new Error('Invalid v1 envelope: missing required fields')
  }
  return json as V1Envelope
}

export function decodeV1Payload(plaintext: Uint8Array): V1VaultData {
  const json = JSON.parse(new TextDecoder().decode(plaintext))
  if (!json.privateKey || !json.publicKey || !json.configuration) {
    throw new Error('Invalid v1 payload: missing required fields')
  }
  return json as V1VaultData
}