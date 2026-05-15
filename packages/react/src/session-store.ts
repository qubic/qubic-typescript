import { toSeed } from '@qubic.ts/types'
import type { Seed } from '@qubic.ts/types'

// ── Availability guard ────────────────────────────────────────────────────────

function isSupported(): boolean {
  return (
    typeof globalThis.crypto?.subtle?.generateKey === 'function' &&
    typeof globalThis.indexedDB !== 'undefined' &&
    typeof globalThis.sessionStorage !== 'undefined'
  )
}

// ── Hex helpers ───────────────────────────────────────────────────────────────

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const ab = new ArrayBuffer(hex.length / 2)
  const out = new Uint8Array(ab)
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

// ── IndexedDB — non-extractable CryptoKey store ───────────────────────────────

const DB_NAME = 'qubic-react'
const STORE_NAME = 'session-keys'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbPut(keyId: string, key: CryptoKey): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(key, keyId)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function idbGet(keyId: string): Promise<CryptoKey | undefined> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(keyId)
    req.onsuccess = () => resolve(req.result as CryptoKey | undefined)
    req.onerror = () => reject(req.error)
  })
}

async function idbDelete(keyId: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(keyId)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// ── Session record ────────────────────────────────────────────────────────────

interface SessionRecord {
  /** ID of the non-extractable CryptoKey stored in IndexedDB. */
  keyId: string
  /** AES-GCM IV (hex). */
  iv: string
  /** AES-GCM ciphertext of JSON-serialised seed array (hex). */
  ciphertext: string
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Encrypts seeds with a fresh non-extractable AES-GCM key.
 * Key goes to IndexedDB (not readable by JS), ciphertext goes to sessionStorage
 * (cleared automatically when the tab closes).
 *
 * Security properties:
 * - Non-extractable key: XSS cannot steal the key bytes.
 * - sessionStorage: closing the tab/window revokes the session without any lock call.
 * - Keys rotate on every restore (see restoreSession), providing forward secrecy.
 */
export async function saveSession(seeds: Seed[], storageKey: string): Promise<void> {
  if (!isSupported()) return

  const keyId = globalThis.crypto.randomUUID()
  const sessionKey = await globalThis.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false, // non-extractable — JS cannot read the key bytes
    ['encrypt', 'decrypt'],
  )
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12))
  const plaintext = new TextEncoder().encode(JSON.stringify(seeds as string[]))
  const ciphertext = new Uint8Array(
    await globalThis.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, sessionKey, plaintext),
  )

  await idbPut(keyId, sessionKey)
  sessionStorage.setItem(
    storageKey,
    JSON.stringify({ keyId, iv: toHex(iv), ciphertext: toHex(ciphertext) } satisfies SessionRecord),
  )
}

/**
 * Restores seeds from the current session if one exists.
 * Deletes the used IDB key immediately (key rotation — forward secrecy).
 * Returns null if no session exists or if decryption fails.
 */
export async function restoreSession(storageKey: string): Promise<Seed[] | null> {
  if (!isSupported()) return null

  const raw = sessionStorage.getItem(storageKey)
  if (!raw) return null

  let record: SessionRecord
  try {
    record = JSON.parse(raw) as SessionRecord
  } catch {
    sessionStorage.removeItem(storageKey)
    return null
  }

  const key = await idbGet(record.keyId)
  if (!key) {
    sessionStorage.removeItem(storageKey)
    return null
  }

  try {
    const plaintext = await globalThis.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromHex(record.iv) },
      key,
      fromHex(record.ciphertext),
    )
    const seedStrings = JSON.parse(new TextDecoder().decode(plaintext)) as string[]
    // Rotate: remove the used key so it cannot be replayed.
    await idbDelete(record.keyId)
    sessionStorage.removeItem(storageKey)
    return seedStrings.map((s) => toSeed(s))
  } catch {
    await idbDelete(record.keyId).catch(() => {})
    sessionStorage.removeItem(storageKey)
    return null
  }
}

/**
 * Clears the active session — IDB key and sessionStorage entry both removed.
 */
export async function clearSession(storageKey: string): Promise<void> {
  if (!isSupported()) return

  const raw = sessionStorage.getItem(storageKey)
  if (raw) {
    try {
      const { keyId } = JSON.parse(raw) as SessionRecord
      await idbDelete(keyId)
    } catch {
      // ignore
    }
    sessionStorage.removeItem(storageKey)
  }
}
