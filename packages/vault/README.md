# @qubic.org/vault

Versioned, cryptographically secure vault library for the Qubic TypeScript ecosystem. Replaces legacy vault implementations with a single unified package using Argon2id key derivation and a binary envelope format.

## Installation

```bash
bun add @qubic.org/vault
```

## Quick start

```ts
import { VaultManager, TaintStatusEnum } from '@qubic.org/vault'

const vault = new VaultManager()

// Create a new v3 vault
const encrypted = await vault.create({
  seeds: [{
    publicId: 'MZTVEQPHKLNDSYXBWUFAJGORCEIMVWHTFDCQNZALKBXSPJYUIDMVGOEXYZAB',
    encryptedSeed: new TextEncoder().encode('your-seed-here'),
    taintStatus: TaintStatusEnum.UNTAINTED,
  }],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    appVersion: '1.0.0',
    schemaVersion: 3,
  },
}, 'strong-password')

// Unlock any version (auto-detected)
const payload = await vault.unlock(encrypted, 'strong-password')

// Access stored seeds
for (const entry of payload.seeds) {
  console.log(entry.publicId) // 60-char identity
  if (entry.encryptedSeed) {
    const seed = new TextDecoder().decode(entry.encryptedSeed)
    console.log(seed) // original seed
  }
}

// Check format version without decryption
const version = vault.getVersion(encrypted) // 1 or 3
```

## Add seeds to existing vault

```ts
import { VaultManager, TaintStatusEnum } from '@qubic.org/vault'

const vault = new VaultManager()

// Create vault with initial seed
const encrypted = await vault.create({
  seeds: [{
    publicId: 'MZTVEQPHKLNDSYXBWUFAJGORCEIMVWHTFDCQNZALKBXSPJYUIDMVGOEXYZAB',
    encryptedSeed: new TextEncoder().encode('first-seed'),
    taintStatus: TaintStatusEnum.UNTAINTED,
  }],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    appVersion: '1.0.0',
    schemaVersion: 3,
  },
}, 'password')

// Add another seed
const updated = await vault.addSeed(encrypted, 'password', {
  publicId: 'QRGDSNMYHKVPXJEFBWZLOUAHTCEIMKRNVYCDSFBGXWPJZNITQVDALOXQXYZW',
  encryptedSeed: new TextEncoder().encode('second-seed'),
  alias: 'Secondary account',
})

// Unlock and verify both seeds exist
const payload = await vault.unlock(updated, 'password')
console.log(payload.seeds.length) // 2
```

## Upgrade legacy vaults

```ts
import { VaultManager } from '@qubic.org/vault'

const vault = new VaultManager()

// Unlock a v1 vault and re-encrypt as v3 with Argon2id
const upgraded = await vault.upgrade(v1VaultData, 'old-password')

// Optionally change password during upgrade
const upgraded = await vault.upgrade(v1VaultData, 'old-password', 'new-password')
```

## Multiple seeds with aliases

```ts
import { VaultManager, TaintStatusEnum } from '@qubic.org/vault'

const vault = new VaultManager()

const encrypted = await vault.create({
  seeds: [
    {
      publicId: 'MZTVEQPHKLNDSYXBWUFAJGORCEIMVWHTFDCQNZALKBXSPJYUIDMVGOEXYZAB',
      encryptedSeed: new TextEncoder().encode('main-seed'),
      alias: 'Main account',
      taintStatus: TaintStatusEnum.UNTAINTED,
    },
    {
      publicId: 'QRGDSNMYHKVPXJEFBWZLOUAHTCEIMKRNVYCDSFBGXWPJZNITQVDALOXQXYZW',
      encryptedSeed: new TextEncoder().encode('secondary-seed'),
      alias: 'Secondary account',
      taintStatus: TaintStatusEnum.UNTAINTED,
      isOnlyWatch: true,
    },
  ],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    appVersion: '1.0.0',
    schemaVersion: 3,
  },
}, 'password')

// Access seeds by alias
const payload = await vault.unlock(encrypted, 'password')
const mainSeed = payload.seeds.find(s => s.alias === 'Main account')
```

## Custom Argon2 parameters

```ts
const vault = new VaultManager({
  argon2: {
    memory: 131072,    // 128 MB (default: 64 MB)
    iterations: 4,     // default: 3
    parallelism: 8,    // default: 4
  },
})
```

## Secure memory handling

```ts
const payload = await vault.unlock(encrypted, password)
try {
  // use payload.seeds
} finally {
  vault.zeroize(payload) // overwrite sensitive fields with zeros
}
```

## Error handling

```ts
import { VaultManager, VaultDecryptionError, InvalidVaultError } from '@qubic.org/vault'

const vault = new VaultManager()

try {
  const payload = await vault.unlock(encrypted, password)
} catch (e) {
  if (e instanceof VaultDecryptionError) {
    console.error('Wrong password or corrupted data')
  } else if (e instanceof InvalidVaultError) {
    console.error('Invalid vault format:', e.message)
  }
}
```

## Vault format versions

| Version | Description | Status |
|---|---|---|
| v1 | PBKDF2-SHA256 + AES-256-GCM (JSON envelope) | Legacy (read-only) |
| v3 | Argon2id + AES-256-GCM (binary envelope) | **Current** |

### v3 binary envelope layout

| Offset | Size | Field |
|---|---|---|
| 0 | 1 byte | version (0x03) |
| 1 | 32 bytes | salt (Argon2id salt) |
| 33 | 12 bytes | iv (AES-256-GCM nonce) |
| 45 | 16 bytes | tag (GCM authentication tag) |
| 61 | variable | ciphertext |

### Security comparison

| Property | v1 (legacy) | v3 (current) |
|---|---|---|
| KDF | PBKDF2-SHA256 | Argon2id |
| Iterations | 100k | 3 passes + 64 MB memory |
| Salt entropy | 128-bit (16B) | 256-bit (32B) |
| Key separation | None | HKDF-SHA256 |
| Format | JSON | Binary |

## Vault payload structure

```ts
interface VaultPayload {
  version: 3
  seeds: SeedEntry[]
  metadata: VaultMetadata
  extensions?: Record<string, unknown>
}

interface SeedEntry {
  publicId: string              // 60-char Qubic identity
  encryptedSeed?: Uint8Array    // raw seed bytes (encrypted by vault)
  alias?: string
  taintStatus: TaintStatus      // 0 = untainted, 1 = tainted
  isOnlyWatch?: boolean
  createdAt?: string            // ISO 8601
}

interface VaultMetadata {
  createdAt: string
  updatedAt: string
  appVersion: string
  schemaVersion: 3
}
```

## API reference

### `VaultManager`

#### `new VaultManager(options?)`

Creates a new vault manager instance.

- `options.argon2` — Custom Argon2 parameters (`memory`, `iterations`, `parallelism`)

#### `vault.create(payload, password): Promise<Uint8Array>`

Creates a new v3 vault encrypted with the given password.

- `payload.seeds` — Array of seed entries to store
- `payload.metadata` — Vault metadata (createdAt, updatedAt, appVersion, schemaVersion)
- `password` — Encryption password

Returns encrypted vault as `Uint8Array`.

#### `vault.unlock(data, password): Promise<VaultPayload>`

Decrypts a vault (auto-detects version v1 or v3).

- `data` — Encrypted vault data
- `password` — Decryption password

Returns decrypted vault payload.

#### `vault.addSeed(data, password, seed): Promise<Uint8Array>`

Adds a seed to an existing vault.

- `data` — Encrypted vault data
- `password` — Decryption password
- `seed` — Seed entry to add (`publicId`, `encryptedSeed?`, `alias?`, `taintStatus?`)

Returns re-encrypted vault with the new seed.

#### `vault.upgrade(data, oldPassword, newPassword?): Promise<Uint8Array>`

Upgrades a v1 vault to v3 format.

- `data` — v1 vault data
- `oldPassword` — Current password
- `newPassword` — Optional new password

Returns upgraded v3 vault.

#### `vault.getVersion(data): number`

Returns the vault format version (1 or 3) without decrypting.

#### `vault.zeroize(payload): void`

Overwrites sensitive fields in the payload with zeros.

## Dependencies

- [`hash-wasm`](https://github.com/nicolo-ribaudo/hash-wasm) -- Argon2id via WASM (~3-4x faster than pure JS)
- [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) -- HKDF, PBKDF2
- [`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers) -- AES-256-GCM