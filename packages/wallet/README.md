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
import { qearn } from '@qubic.org/contracts'

const wallet = createWallet(generateSeed())
const currentTick = 20_000_000

const payload = qearn.buildLockInput({ amount: 10_000_000n })

const result: SignedTransaction = await wallet.buildContractCall({
  destination: contractIndexToIdentity(qearn.contractIndex),
  amount: 10_000_000n,
  targetTick: currentTick + 5,
  currentTick,
  inputType: qearn.LOCK_INPUT_TYPE,
  payload,
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

Encrypted storage for seeds using AES-256-GCM with PBKDF2-SHA256 key derivation (600k iterations).

```ts
import {
  generateSeed,
  createVault,
  unlockVault,
  addToVault,
  exportVault,
  importVault,
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
const json: string = exportVault(vault)
const loaded: VaultData = importVault(json)
const seeds2: Seed[] = await unlockVault(loaded, 'strong-password')
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
| `InvalidVaultError` | Malformed vault structure, unsupported version, or weak crypto parameters |

## Dependencies

- [`@qubic.org/crypto`](../crypto) -- key derivation and signing
- [`@qubic.org/tx`](../tx) -- transaction building
- [`@qubic.org/types`](../types) -- branded types and validators
