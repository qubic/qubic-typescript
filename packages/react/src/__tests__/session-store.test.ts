import { describe, test, expect, beforeEach } from 'bun:test'

// ── Minimal IndexedDB / sessionStorage mocks ─────────────────────────────────

class MemoryObjectStore {
  private data = new Map<string, unknown>()

  put(value: unknown, key: string) {
    this.data.set(key, value)
    return { onsuccess: null as (() => void) | null, onerror: null as (() => void) | null }
  }

  get(key: string) {
    const result = {
      result: this.data.get(key),
      onsuccess: null as (() => void) | null,
      onerror: null as (() => void) | null,
    }
    setTimeout(() => result.onsuccess?.(), 0)
    return result
  }

  delete(key: string) {
    this.data.delete(key)
  }
}

class MemoryTransaction {
  private store: MemoryObjectStore
  oncomplete: (() => void) | null = null
  onerror: (() => void) | null = null

  constructor(store: MemoryObjectStore) {
    this.store = store
    setTimeout(() => this.oncomplete?.(), 0)
  }

  objectStore(_name: string) {
    return this.store
  }
}

class MemoryDatabase {
  private stores = new Map<string, MemoryObjectStore>()

  createObjectStore(name: string) {
    if (!this.stores.has(name)) {
      this.stores.set(name, new MemoryObjectStore())
    }
    return this.stores.get(name)!
  }

  transaction(_name: string, _mode: string) {
    const store = this.stores.get(_name)
    if (!store) throw new Error(`Object store ${_name} not found`)
    return new MemoryTransaction(store)
  }

  close() {}
}

class MemorySessionStorage {
  private data = new Map<string, string>()

  getItem(key: string) {
    return this.data.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.data.set(key, value)
  }

  removeItem(key: string) {
    this.data.delete(key)
  }

  clear() {
    this.data.clear()
  }
}

function mockIndexedDB() {
  const dbs = new Map<string, MemoryDatabase>()
  return {
    open(name: string, _version: number) {
      if (!dbs.has(name)) dbs.set(name, new MemoryDatabase())
      const db = dbs.get(name)!
      const req = {
        result: db,
        onupgradeneeded: null as (() => void) | null,
        onsuccess: null as (() => void) | null,
        onerror: null as (() => void) | null,
      }
      setTimeout(() => {
        req.onupgradeneeded?.()
        req.onsuccess?.()
      }, 0)
      return req
    },
  }
}

// Set up globals before importing the module under test.
const mockStorage = new MemorySessionStorage()
;(globalThis as any).indexedDB = mockIndexedDB()
;(globalThis as any).sessionStorage = mockStorage

const { saveSession, restoreSession, clearSession } = await import('../vault/session-store.js')
const { toSeed } = await import('@qubic.org/types')

// Valid seeds: exactly 55 lowercase letters
const SEED_A = toSeed('a'.repeat(55))
const SEED_B = toSeed('b'.repeat(55))

describe('vault/session-store', () => {
  beforeEach(() => {
    mockStorage.clear()
  })

  test('saveSession + restoreSession round-trip', async () => {
    const seeds = [SEED_A]
    await saveSession(seeds, 'test-key')
    const restored = await restoreSession('test-key')

    expect(restored).not.toBeNull()
    expect(restored).toHaveLength(1)
    expect(String(restored![0])).toBe(String(SEED_A))
  })

  test('round-trip with multiple seeds', async () => {
    const seeds = [SEED_A, SEED_B]
    await saveSession(seeds, 'multi-key')
    const restored = await restoreSession('multi-key')

    expect(restored).toHaveLength(2)
    expect(String(restored![0])).toBe(String(SEED_A))
    expect(String(restored![1])).toBe(String(SEED_B))
  })

  test('restoreSession returns null when no session exists', async () => {
    const result = await restoreSession('nonexistent')
    expect(result).toBeNull()
  })

  test('restoreSession returns null on corrupted sessionStorage data', async () => {
    mockStorage.setItem('corrupt-key', '{not valid json!!!')
    const result = await restoreSession('corrupt-key')
    expect(result).toBeNull()
    expect(mockStorage.getItem('corrupt-key')).toBeNull()
  })

  test('restoreSession returns null when IDB key is missing', async () => {
    await saveSession([SEED_A], 'missing-key')

    // Tamper: swap the keyId to one that doesn't exist in IDB
    const raw = mockStorage.getItem('missing-key')!
    const record = JSON.parse(raw)
    record.keyId = 'non-existent-key-id'
    mockStorage.setItem('missing-key', JSON.stringify(record))

    const result = await restoreSession('missing-key')
    expect(result).toBeNull()
    expect(mockStorage.getItem('missing-key')).toBeNull()
  })

  test('restoreSession returns null on corrupted ciphertext', async () => {
    await saveSession([SEED_A], 'bad-cipher-key')

    const raw = mockStorage.getItem('bad-cipher-key')!
    const record = JSON.parse(raw)
    record.ciphertext = 'ff' + record.ciphertext.slice(2)
    mockStorage.setItem('bad-cipher-key', JSON.stringify(record))

    const result = await restoreSession('bad-cipher-key')
    expect(result).toBeNull()
  })

  test('restoreSession rotates the key (forward secrecy)', async () => {
    await saveSession([SEED_A], 'rotate-key')

    const first = await restoreSession('rotate-key')
    expect(first).not.toBeNull()

    // Second restore should fail — key was deleted and sessionStorage cleared
    const second = await restoreSession('rotate-key')
    expect(second).toBeNull()
  })

  test('clearSession removes session data', async () => {
    await saveSession([SEED_A], 'clear-key')
    expect(mockStorage.getItem('clear-key')).not.toBeNull()

    await clearSession('clear-key')

    expect(mockStorage.getItem('clear-key')).toBeNull()
    const restored = await restoreSession('clear-key')
    expect(restored).toBeNull()
  })

  test('clearSession is a no-op when no session exists', async () => {
    await clearSession('nothing-here')
  })
})
