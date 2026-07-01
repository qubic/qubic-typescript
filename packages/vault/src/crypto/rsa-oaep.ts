export async function wrapPrivateKey(
  privateKey: CryptoKey,
  wrapKey: Uint8Array,
): Promise<Uint8Array> {
  const aesKey = await globalThis.crypto.subtle.importKey(
    'raw',
    wrapKey as unknown as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['wrapKey'],
  )
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12))
  const wrapped = await globalThis.crypto.subtle.wrapKey('pkcs8', privateKey, aesKey, {
    name: 'AES-GCM',
    iv,
  })
  // Combine IV and wrapped key
  const result = new Uint8Array(iv.length + wrapped.byteLength)
  result.set(iv)
  result.set(new Uint8Array(wrapped), iv.length)
  return result
}

export async function unwrapPrivateKey(
  wrappedKey: Uint8Array,
  wrapKey: Uint8Array,
): Promise<CryptoKey> {
  const iv = wrappedKey.slice(0, 12)
  const wrapped = wrappedKey.slice(12)
  const aesKey = await globalThis.crypto.subtle.importKey(
    'raw',
    wrapKey as unknown as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['unwrapKey'],
  )
  return globalThis.crypto.subtle.unwrapKey(
    'pkcs8',
    wrapped as unknown as BufferSource,
    aesKey,
    { name: 'AES-GCM', iv },
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt'],
  )
}

export async function encryptSeed(publicKey: CryptoKey, seed: Uint8Array): Promise<Uint8Array> {
  const encrypted = await globalThis.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    seed as unknown as BufferSource,
  )
  return new Uint8Array(encrypted)
}

export async function decryptSeed(
  privateKey: CryptoKey,
  encryptedSeed: Uint8Array,
): Promise<Uint8Array> {
  const decrypted = await globalThis.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedSeed as unknown as BufferSource,
  )
  return new Uint8Array(decrypted)
}
