# `@qubic.org/tx`

Transaction building, signing, encoding, and verification for the Qubic network.

This package covers the full lifecycle of a Qubic transaction: constructing the binary wire format, computing a K12 digest and attaching a SchnorrQ signature, base64-encoding the result for broadcast, and computing the 60-character transaction hash used by block explorers. It also exposes `buildPayload`, a typed helper for constructing smart contract input payloads.

## Installation

```sh
bun add @qubic.org/tx
```

Dependencies: `@qubic.org/crypto`, `@qubic.org/types`

## API

### Building transactions

```ts
interface TransactionInput {
  sourcePublicKey: Uint8Array       // 32-byte compressed FourQ public key of the sender
  destinationPublicKey: Uint8Array  // 32-byte public key of the recipient; all-zeros for SC calls
  amount: bigint                    // transfer amount in QU; 0n for most SC calls
  targetTick: number                // tick at which this transaction should execute
  inputType: number                 // 0 for QU transfer; procedure index for SC calls
  payload?: Uint8Array              // SC-specific binary data; must be ≤ 1024 bytes
  currentTick?: number              // when set, validates that targetTick > currentTick
}

function buildTransaction(input: TransactionInput): Uint8Array
```

Serialises the transaction header and payload into the Qubic binary wire format:

```
[sourcePublicKey  32B][destinationPublicKey  32B]
[amount int64 LE  8B][targetTick uint32 LE   4B]
[inputType uint16 2B][payloadSize uint16 LE  2B]
[payload          N B]
```

The header is always 80 bytes. Throws `PayloadTooLargeError` if `payload.byteLength > 1024`, and `TickInThePastError` if `currentTick` is supplied and `targetTick <= currentTick`.

### Signing

```ts
function signTransaction(txBytes: Uint8Array, seed: Seed): Promise<Uint8Array>
```

Signs the unsigned transaction bytes produced by `buildTransaction`. The signing process computes `K12(txBytes, 32)` to produce a 32-byte digest, then signs the digest with SchnorrQ using the key derived from `seed`. Returns `txBytes || signature` (header + payload + 64-byte signature).

### Encoding for broadcast

```ts
function encodeTransaction(signedTx: Uint8Array): Base64
```

Base64-encodes a signed transaction buffer into a `Base64`-branded string ready to POST to the `broadcast-transaction` endpoint of `@qubic.org/rpc`.

### Decoding

```ts
interface DecodedTransaction {
  sourcePublicKey: Uint8Array
  destinationPublicKey: Uint8Array
  amount: bigint
  targetTick: number
  inputType: number
  payload: Uint8Array
}

function decodeTransaction(bytes: Uint8Array): DecodedTransaction
```

Parses signed or unsigned transaction bytes back into their constituent fields. Throws `InvalidTransactionError` if the buffer is shorter than the 80-byte header.

### Transaction hash

```ts
function computeTransactionHash(signedTxBytes: Uint8Array): TxHash
```

Computes the 60-character lowercase transaction hash from a signed transaction. The algorithm mirrors identity encoding: `K12(signedTxBytes, 32)` produces 32 bytes which are encoded as four 14-character base-26 fragments (using `a-z` instead of `A-Z`), followed by a 4-character lowercase checksum.

### Signature verification

```ts
function verifyTransactionSignature(signedTxBytes: Uint8Array): boolean
```

Verifies the SchnorrQ signature on a fully signed transaction without a seed. Returns `false` for undersized buffers or invalid signatures; never throws.

### Payload builder

```ts
type PayloadField =
  | { type: 'uint8';  value: number }
  | { type: 'uint16'; value: number }
  | { type: 'uint32'; value: number }
  | { type: 'uint64'; value: bigint }
  | { type: 'sint64'; value: bigint }
  | { type: 'bytes';  value: Uint8Array }
  | { type: 'id';     value: Identity }   // encoded as 32-byte public key

function buildPayload(fields: PayloadField[]): Uint8Array
```

Serialises a list of typed fields into a binary payload buffer using little-endian encoding. The `'id'` type accepts an `Identity` string and automatically converts it to its 32-byte public key representation using `identityToPublicKey` from `@qubic.org/crypto`.

### Low-level utilities

```ts
class BinaryReader  // sequential little-endian reader over a Uint8Array
class BinaryWriter  // sequential little-endian writer into a pre-allocated Uint8Array
```

Exported for consumers that need to implement custom binary serialisation compatible with the Qubic wire format.

## Error handling

```ts
class PayloadTooLargeError   extends QubicError  // code: 'PAYLOAD_TOO_LARGE'
class TickInThePastError     extends QubicError  // code: 'TICK_IN_THE_PAST'
class InvalidTransactionError extends QubicError  // code: 'INVALID_TRANSACTION'
```

All three errors carry structured context:
- `PayloadTooLargeError`: `{ byteLength, max }` — actual vs. allowed size.
- `TickInThePastError`: `{ targetTick, currentTick }` — the two tick values.
- `InvalidTransactionError`: the reason string from the constructor.

## Examples

### Plain QU transfer

```ts
import { buildTransaction, signTransaction, encodeTransaction } from '@qubic.org/tx'
import { publicKeyFromSeed, identityToPublicKey } from '@qubic.org/crypto'
import { toSeed, toIdentity } from '@qubic.org/types'

const seed = toSeed('mysecrettwentyfivecharacterseeeed...')
const sourcePublicKey = publicKeyFromSeed(seed)
const destinationPublicKey = identityToPublicKey(
  toIdentity('DESTIDENTITYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
)

// currentTick obtained from live.getTickInfo()
const currentTick = 18_500_000
const targetTick = currentTick + 5

const txBytes = buildTransaction({
  sourcePublicKey,
  destinationPublicKey,
  amount: 1_000_000n,  // 1 QU = 1,000,000 base units
  targetTick,
  inputType: 0,
  currentTick,
})

const signedTx = await signTransaction(txBytes, seed)
const encoded = encodeTransaction(signedTx)
// encoded is ready to pass to live.broadcastTransaction(encoded)
```

### Smart contract call with payload

```ts
import { buildTransaction, signTransaction, encodeTransaction, buildPayload } from '@qubic.org/tx'
import { publicKeyFromSeed } from '@qubic.org/crypto'
import { toSeed, CONTRACT_INDEX, PROTOCOL } from '@qubic.org/types'

const seed = toSeed('myseedaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
const sourcePublicKey = publicKeyFromSeed(seed)

// Contract destination is all-zeros for SC calls
const destinationPublicKey = new Uint8Array(PROTOCOL.PUBLIC_KEY_SIZE)

const payload = buildPayload([
  { type: 'uint64', value: 500_000n },  // amount to lock
])

const txBytes = buildTransaction({
  sourcePublicKey,
  destinationPublicKey,
  amount: 0n,
  targetTick: 18_500_005,
  inputType: 1,  // procedure 1 of the target contract
  payload,
})

const signedTx = await signTransaction(txBytes, seed)
const encoded = encodeTransaction(signedTx)
```

### Compute and verify a transaction hash

```ts
import { signTransaction, computeTransactionHash, verifyTransactionSignature } from '@qubic.org/tx'

const signedTx = await signTransaction(txBytes, seed)

const hash = computeTransactionHash(signedTx)
console.log('TxHash:', hash)  // 60 lowercase chars

const valid = verifyTransactionSignature(signedTx)
console.log('Signature valid:', valid)  // true
```

### Decode a raw transaction for inspection

```ts
import { decodeTransaction } from '@qubic.org/tx'
import { publicKeyToIdentity } from '@qubic.org/crypto'

const decoded = decodeTransaction(rawBytes)
console.log('From:    ', publicKeyToIdentity(decoded.sourcePublicKey))
console.log('To:      ', publicKeyToIdentity(decoded.destinationPublicKey))
console.log('Amount:  ', decoded.amount)
console.log('Tick:    ', decoded.targetTick)
```

## Design notes

**Two-step sign: digest then sign.** `signTransaction` hashes `txBytes` with K12 to a 32-byte digest before passing it to SchnorrQ. This matches the reference implementation and is required for on-chain verification. Do not pre-hash the transaction yourself before calling `signTransaction`.

**`buildPayload` vs. manual `Uint8Array`.** `buildPayload` handles little-endian encoding and identity-to-public-key conversion automatically. Prefer it over hand-crafting payload buffers; it is easier to audit and matches the C++ SC ABI conventions.

**`currentTick` is optional but recommended.** Omitting it means `buildTransaction` skips the expiry guard. In production code, pass the tick from `live.getTickInfo()` so that expired transactions are rejected client-side before consuming a broadcast slot.
