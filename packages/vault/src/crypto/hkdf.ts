import { hkdf } from '@noble/hashes/hkdf.js'
import { sha256 } from '@noble/hashes/sha2.js'

export async function hkdfExpand(
  key: Uint8Array,
  info: string,
  length: number,
): Promise<Uint8Array> {
  const infoBytes = new TextEncoder().encode(info)
  return hkdf(sha256, key, undefined, infoBytes, length)
}

export async function deriveKeys(masterKey: Uint8Array): Promise<{
  encKey: Uint8Array
  wrapKey: Uint8Array
  authKey: Uint8Array
}> {
  const encKey = await hkdfExpand(masterKey, 'enc_key', 32)
  const wrapKey = await hkdfExpand(masterKey, 'wrap_key', 32)
  const authKey = await hkdfExpand(masterKey, 'auth_key', 32)
  return { encKey, wrapKey, authKey }
}
