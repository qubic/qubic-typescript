import { InvalidVaultError } from '../errors.js'

export function detectVersion(data: Uint8Array): number {
  // v3: first byte is 0x03 and total length >= 61
  if (data[0] === 0x03 && data.length >= 61) return 3

  // v1: valid JSON with salt, iv, cipher fields (ts-vault-library format)
  // or salt, iv, ciphertext fields (old wallet format)
  try {
    const json = JSON.parse(new TextDecoder().decode(data))
    if (json.salt && json.iv && (json.cipher || json.ciphertext)) return 1
  } catch {}

  throw new InvalidVaultError('unknown vault format')
}
