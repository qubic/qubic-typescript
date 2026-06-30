export async function encrypt(
  key: Uint8Array,
  plaintext: Uint8Array,
  iv: Uint8Array,
  aad?: Uint8Array,
): Promise<{ ciphertext: Uint8Array; tag: Uint8Array }> {
  // TODO: Implement in Batch 4
  throw new Error('Not implemented')
}

export async function decrypt(
  key: Uint8Array,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad?: Uint8Array,
): Promise<Uint8Array> {
  // TODO: Implement in Batch 4
  throw new Error('Not implemented')
}