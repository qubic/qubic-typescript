import { pbkdf2Async } from '@noble/hashes/pbkdf2.js'
import { sha256 } from '@noble/hashes/sha2.js'

export async function deriveKeyPBKDF2(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const passwordBytes = new TextEncoder().encode(password)
  return pbkdf2Async(sha256, passwordBytes, salt, { c: iterations, dkLen: 32 })
}