# @qubic.org/wallet

Wallet and key management for the Qubic network — seed generation, identity derivation, transaction signing, and AES-GCM encrypted vault storage.

## Installation

```bash
bun add @qubic.org/wallet
```

## Wallet

### `createWallet(seed)`

Creates a wallet from a 55-character seed. Identity and public key are derived eagerly; signing is async.

```ts
import { createWallet, generateSeed } from '@qubic.org/wallet'

const seed = generateSeed()
const wallet = createWallet(seed)

console.log(wallet.identity)   // 60-char uppercase Qubic identity
console.log(wallet.publicKey)  // 32-byte Uint8Array
```

### `wallet.buildTransfer(params)`

Builds and signs a plain QU transfer.

```ts
import { toSeed } from '@qubic.org/wallet'
import type { Identity } from '@qubic.org/types'

const wallet = createWallet(toSeed('your55charlowercaseseed...'))
const { encoded, hash, bytes } = await wallet.buildTransfer({
  destination: 'ABCDEF...' as Identity,
  amount: 1_000_000n,       // in QU
  targetTick: tick + 5,
  currentTick: tick,        // optional — throws TickInThePastError if targetTick ≤ currentTick
})

// encoded: Base64 string ready for POST /live/v1/broadcast-transaction
// hash: 60-char lowercase transaction hash
// bytes: raw signed Uint8Array
```

### `wallet.buildScTransaction(params)`

Builds and signs a smart contract procedure call.

```ts
import { qearn } from '@qubic.org/contracts'

const payload = qearn.buildLockInput({ amount: 10_000_000n })

const { encoded } = await wallet.buildScTransaction({
  destination: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' as Identity,
  amount: 10_000_000n,
  targetTick: tick + 5,
  inputType: 6,   // procedure input type
  payload,
})
```

## Seed utilities

```ts
import { generateSeed, validateSeed, toSeed } from '@qubic.org/wallet'

const seed = generateSeed()         // cryptographically secure random seed
validateSeed('abc')                 // false
validateSeed(seed)                  // true
toSeed('abc')                       // throws InvalidSeedError
toSeed(seed)                        // returns branded Seed
```

## Vault

Encrypted storage for seeds using AES-256-GCM with PBKDF2-SHA256 key derivation (600k iterations).

```ts
import { createVault, unlockVault, addToVault, exportVault, importVault } from '@qubic.org/wallet'

// Create a vault with one or more seeds
const vault = await createVault('strong-password', [seed])

// Decrypt and retrieve seeds
const seeds = await unlockVault(vault, 'strong-password')

// Add a seed to an existing vault
const updated = await addToVault(vault, 'strong-password', anotherSeed)

// Persist to disk / localStorage
const json = exportVault(vault)       // JSON string
const loaded = importVault(json)      // parses and validates structure
const seeds2 = await unlockVault(loaded, 'strong-password')
```

### Vault security

| Property | Value |
|---|---|
| Cipher | AES-256-GCM |
| Key derivation | PBKDF2-SHA256 |
| Iterations | 600,000 |
| Salt | 16 bytes (random per vault) |
| IV | 12 bytes (random per encryption) |

A wrong password or corrupted ciphertext throws `VaultDecryptionError`. A structurally malformed vault throws `InvalidVaultError`.

## Errors

```ts
import { WalletError, VaultDecryptionError, InvalidVaultError } from '@qubic.org/wallet'
```

| Error | Thrown when |
|---|---|
| `WalletError` | Base class for all wallet errors |
| `VaultDecryptionError` | Wrong password or corrupt ciphertext |
| `InvalidVaultError` | Malformed vault structure or unsupported version |

## Dependencies

- [`@qubic.org/crypto`](../crypto) — key derivation and signing
- [`@qubic.org/tx`](../tx) — transaction building
- [`@qubic.org/types`](../types) — branded types and validators
