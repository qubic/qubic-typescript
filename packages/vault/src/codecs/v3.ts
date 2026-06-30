import { MIN_VAULT_LENGTH, VERSION_BYTE_V3 } from '../models/types.js'
import type { VaultPayload } from '../models/vault-payload.js'

export interface V3Envelope {
  version: number
  salt: Uint8Array
  iv: Uint8Array
  tag: Uint8Array
  ciphertext: Uint8Array
}

export function parseV3Envelope(data: Uint8Array): V3Envelope {
  if (data.length < MIN_VAULT_LENGTH) {
    throw new Error('Invalid v3 envelope: data too short')
  }
  if (data[0] !== VERSION_BYTE_V3) {
    throw new Error('Invalid v3 envelope: wrong version byte')
  }

  return {
    version: VERSION_BYTE_V3,
    salt: data.slice(1, 33),
    iv: data.slice(33, 45),
    tag: data.slice(45, 61),
    ciphertext: data.slice(61),
  }
}

export function createV3Envelope(
  salt: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  ciphertext: Uint8Array,
): Uint8Array {
  const envelope = new Uint8Array(1 + salt.length + iv.length + tag.length + ciphertext.length)
  let offset = 0

  envelope[offset++] = VERSION_BYTE_V3
  envelope.set(salt, offset)
  offset += salt.length
  envelope.set(iv, offset)
  offset += iv.length
  envelope.set(tag, offset)
  offset += tag.length
  envelope.set(ciphertext, offset)

  return envelope
}

export function encodeV3Payload(payload: VaultPayload): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(payload))
}

export function decodeV3Payload(plaintext: Uint8Array): VaultPayload {
  const json = JSON.parse(new TextDecoder().decode(plaintext))
  if (json.version !== 3) {
    throw new Error('Invalid v3 payload: wrong version')
  }
  return json as VaultPayload
}
