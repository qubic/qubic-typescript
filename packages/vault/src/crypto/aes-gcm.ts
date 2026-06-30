import { gcm } from '@noble/ciphers/aes'

export async function encrypt(
  key: Uint8Array,
  plaintext: Uint8Array,
  iv: Uint8Array,
  aad?: Uint8Array,
): Promise<{ ciphertext: Uint8Array; tag: Uint8Array }> {
  const cipher = gcm(key, iv, aad)
  const encrypted = cipher.encrypt(plaintext)
  // GCM appends the tag to the ciphertext
  const tagLength = 16
  const ciphertext = encrypted.slice(0, -tagLength)
  const tag = encrypted.slice(-tagLength)
  return { ciphertext, tag }
}

export async function decrypt(
  key: Uint8Array,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad?: Uint8Array,
): Promise<Uint8Array> {
  const cipher = gcm(key, iv, aad)
  // Combine ciphertext and tag for decryption
  const combined = new Uint8Array(ciphertext.length + tag.length)
  combined.set(ciphertext)
  combined.set(tag, ciphertext.length)
  return cipher.decrypt(combined)
}