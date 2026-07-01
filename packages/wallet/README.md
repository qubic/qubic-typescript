# @qubic.org/wallet

Wallet and key management for the Qubic network -- seed generation, identity derivation, transaction signing, and AES-GCM encrypted vault storage.

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

### `wallet.buildTransaction(params: TransactionParams): Promise<SignedTransaction>`

Builds and signs a plain QU transfer. Returns `{ encoded, hash, bytes }`.

```ts
import { createWallet, generateSeed } from '@qubic.org/wallet'
import type { TransactionParams, SignedTransaction } from '@qubic.org/wallet'

const wallet = createWallet(generateSeed())
const currentTick = 20_000_000

const result: SignedTransaction = await wallet.buildTransaction({
  destination: 'BZBQFLLBNCXEMGLOBHUVFTLUPLVCPQUASSILFABOFFBCADQSSUPNWLZBQEXK',
  amount: 1_000_000n,
  targetTick: currentTick + 5,
  currentTick,        // optional -- throws if targetTick <= currentTick
})

console.log(result.encoded) // Base64 string ready for broadcast
console.log(result.hash)    // 60-char lowercase transaction hash
console.log(result.bytes)   // raw signed Uint8Array
```

### `wallet.buildContractCall(params: ContractCallParams): Promise<SignedTransaction>`

Builds and signs a smart contract procedure call.

```ts
import { createWallet, generateSeed } from '@qubic.org/wallet'
import type { SignedTransaction } from '@qubic.org/wallet'
import { contractIndexToIdentity } from '@qubic.org/crypto'
import { buildQearnUnlockInput } from '@qubic.org/contracts'

const wallet = createWallet(generateSeed())
const currentTick = 20_000_000

const call = buildQearnUnlockInput({ amount: 10_000_000n, lockedEpoch: 212 })

const result: SignedTransaction = await wallet.buildContractCall({
  destination: contractIndexToIdentity(call.contractIndex),
  amount: 10_000_000n,
  targetTick: currentTick + 5,
  currentTick,
  inputType: call.inputType,
  payload: call.payload,
})

console.log(result.encoded) // Base64 string for broadcast
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

Encrypted storage for seeds using Argon2id + AES-256-GCM (v3 format) with automatic support for legacy v1 vaults.

```ts
import {
  generateSeed,
  createVault,
  unlockVault,
  addToVault,
  exportVault,
  importVault,
  upgradeVault,
  getVaultVersion,
} from '@qubic.org/wallet'
import type { VaultData } from '@qubic.org/wallet'
import type { Seed } from '@qubic.org/types'

const seed = generateSeed()
const anotherSeed = generateSeed()

// Create a vault with one or more seeds
const vault: VaultData = await createVault('strong-password', [seed])

// Decrypt and retrieve seeds
const seeds: Seed[] = await unlockVault(vault, 'strong-password')

// Add a seed to an existing vault (re-encrypts with fresh salt/IV)
const updated: VaultData = await addToVault(vault, 'strong-password', anotherSeed)

// Persist to disk / localStorage
const exported: Uint8Array = exportVault(vault)
const loaded: VaultData = importVault(exported)
const seeds2: Seed[] = await unlockVault(loaded, 'strong-password')

// Check vault version without decrypting
const version: number = getVaultVersion(vault) // 3

// Upgrade legacy v1 vault to v3
const upgraded: VaultData = await upgradeVault(v1Vault, 'old-password')
const upgradedWithNewPw: VaultData = await upgradeVault(v1Vault, 'old-password', 'new-password')
```

### Vault security

| Property | v3 (current) | v1 (legacy) |
|---|---|---|
| Cipher | AES-256-GCM | AES-256-GCM |
| Key derivation | Argon2id | PBKDF2-SHA256 |
| Memory cost | 64 MB | — |
| Iterations | 3 | 600,000 |
| Salt | 32 bytes | 16 bytes |

Under the hood, `@qubic.org/wallet` delegates all vault operations to [`@qubic.org/vault`](../vault).

## Errors

```ts
import { WalletError, VaultDecryptionError, InvalidVaultError } from '@qubic.org/wallet'
```

| Error | Thrown when |
|---|---|
| `WalletError` | Base class for all wallet errors |
| `VaultDecryptionError` | Wrong password or corrupt ciphertext |
| `InvalidVaultError` | Malformed vault structure, unsupported version, or weak crypto parameters |

## Dependencies

- [`@qubic.org/crypto`](../crypto) -- key derivation and signing
- [`@qubic.org/tx`](../tx) -- transaction building
- [`@qubic.org/types`](../types) -- branded types and validators
- [`@qubic.org/vault`](../vault) -- encrypted vault storage
