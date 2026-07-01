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
    publicId: 'MZTVEQPHKLNDSYXBWUFAJGORCEIMVWHTFDCQNZALKBXSPJYUIDMVGOEXYZAB', // 60-char identity
    encryptedSeed: new TextEncoder().encode('your-seed-here'), // raw seed bytes
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

## Upgrade legacy vaults

```ts
import { VaultManager } from '@qubic.org/vault'

const vault = new VaultManager()

// Unlock a v1 vault and re-encrypt as v3 with Argon2id
const upgraded = await vault.upgrade(v1VaultData, 'old-password')

// Optionally change password during upgrade
const upgraded = await vault.upgrade(v1VaultData, 'old-password', 'new-password')
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
  keyPair?: WrappedKeyPair
  metadata: VaultMetadata
  extensions?: Record<string, unknown>
}

interface WrappedKeyPair {
  publicKey: JsonWebKey           // RSA-OAEP public key
  wrappedPrivateKey: Uint8Array   // AES-256-GCM wrapped with wrap_key
}

interface SeedEntry {
  publicId: string              // 60-char Qubic identity
  encryptedSeed?: Uint8Array    // RSA-OAEP encrypted with publicKey
  alias?: string
  taintStatus: TaintStatus      // 0 = untainted, 1 = tainted
  isOnlyWatch?: boolean
  createdAt?: string            // ISO 8601
}
```

### Seed encryption flow

When creating a vault:
1. Generate RSA-OAEP 4096-bit key pair
2. Encrypt each seed with RSA public key
3. Wrap RSA private key with vault's `wrap_key` (derived from HKDF)
4. Store wrapped private key and public key in `keyPair`

When unlocking:
1. Derive `wrap_key` from password
2. Unwrap RSA private key
3. Decrypt each seed with RSA private key

## Dependencies

- [`hash-wasm`](https://github.com/nicolo-ribaudo/hash-wasm) -- Argon2id via WASM (~3-4x faster than pure JS)
- [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) -- HKDF, PBKDF2
- [`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers) -- AES-256-GCM