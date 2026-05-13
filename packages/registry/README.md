# `@qubic.ts/registry`

ABI registry and binary payload codec for Qubic smart contracts.

This package is the foundation of the Qubic TypeScript SDK's contract interaction layer. It stores per-epoch snapshots of every deployed smart contract's interface, so any call — historical or current — can be correctly encoded and decoded using the exact ABI that was active at that epoch. It also provides the binary codec that translates between typed TypeScript values and the little-endian binary format the Qubic network speaks.

## Installation

```sh
bun add @qubic.ts/registry
```

In a monorepo workspace, reference it as:

```json
{ "dependencies": { "@qubic.ts/registry": "workspace:*" } }
```

## API Reference

### Types

```ts
type FieldType =
  | 'uint8' | 'uint16' | 'uint32' | 'uint64'
  | 'sint8' | 'sint16' | 'sint32' | 'sint64'
  | 'uint128' | 'id' | 'bytes' | 'array' | 'struct'

interface BinaryField {
  name: string
  type: FieldType
  offset: number        // byte offset from start of enclosing struct
  byteLength: number    // total byte footprint, always authoritative
  description?: string
  arrayLength?: number
  arrayItemType?: FieldType
  arrayItemByteLength?: number
  arrayItemStructRef?: string
  structRef?: string
}

interface NamedStruct {
  name: string
  fields: BinaryField[]
  byteLength: number
}

interface ContractCallBase {
  kind: 'procedure' | 'function'
  inputType: number       // declaration-order ordinal, starts at 1
  name: string
  description?: string
  inputFields: BinaryField[]
  outputFields: BinaryField[]
  inputSize: number
  outputSize: number
  requiresAmount?: boolean
  sourceRef?: string
}

interface ContractAbiVersion {
  contractIndex: number
  contractName: string
  effectiveFromEpoch: number
  effectiveToEpoch: number | null   // null = currently active
  coreVersion?: string
  coreCommit?: string
  structs: Record<string, NamedStruct>
  procedures: ContractCallBase[]
  functions: ContractCallBase[]
  changelog?: string
  registeredAt: string
  registeredBy?: string
}

interface ContractRegistry {
  schemaVersion: 1
  updatedAt: string
  versions: ContractAbiVersion[]    // sorted contractIndex ASC, effectiveFromEpoch ASC
}

interface AbiLookupResult {
  version: ContractAbiVersion
  isCurrent: boolean
  isRegistryPossiblyStale: boolean  // true when epoch > latest known and isCurrent=true
}
```

### Registry functions

```ts
import {
  getAbi,
  getCurrentAbi,
  getAbiHistory,
  getProcedure,
  getFunction,
  findContractByIndex,
  findContractByName,
  validateRegistry,
  AbiNotFoundError,
} from '@qubic.ts/registry'
```

| Function | Signature | Description |
|---|---|---|
| `getAbi` | `(registry, contractIndex, epoch) => AbiLookupResult` | Returns the ABI version active at the given epoch. Throws `AbiNotFoundError` if none covers it. |
| `getCurrentAbi` | `(registry, contractIndex) => ContractAbiVersion` | Returns the version with `effectiveToEpoch === null`. Throws if none. |
| `getAbiHistory` | `(registry, contractIndex) => ContractAbiVersion[]` | All versions sorted by `effectiveFromEpoch` ascending. |
| `getProcedure` | `(version, inputType) => ContractCallBase` | Finds a procedure by its ordinal. Throws if not found. |
| `getFunction` | `(version, inputType) => ContractCallBase` | Finds a function by its ordinal. Throws if not found. |
| `findContractByIndex` | `(registry, contractIndex) => string` | Returns the contract name for an index. Throws if not registered. |
| `findContractByName` | `(registry, name) => number` | Case-insensitive lookup of a contract index by name. Throws if not found. |
| `validateRegistry` | `(registry) => void` | Checks for overlapping epoch ranges and field/size consistency. Throws with a descriptive message on any inconsistency. |

### Payload codec

```ts
import {
  buildPayload,
  decodePayload,
  buildPayloadManual,
  PayloadBuildError,
} from '@qubic.ts/registry'

type FieldValue = number | bigint | string | Uint8Array | FieldValue[] | DecodedStruct
type DecodedStruct = Record<string, unknown>
```

**`buildPayload`**

```ts
function buildPayload(
  fields: BinaryField[],
  structs: Record<string, NamedStruct>,
  input: Record<string, FieldValue | Uint8Array>,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array
```

Encodes a record of named field values to binary. Encoding rules:

- `uint8/16/32`, `sint8/16/32` — little-endian via `DataView`
- `uint64` / `sint64` — `BigUint64` / `BigInt64` little-endian
- `uint128` — two consecutive `uint64` LE (lo word first, hi second)
- `id` — 32-byte public key via the injected `identityToPublicKey`
- `bytes` — `Uint8Array` copied verbatim, zero-padded to `byteLength` if shorter
- `struct` — recursive encoding using `structs[field.structRef].fields`
- `array` — N items encoded sequentially

Advanced: pass a `Uint8Array` whose length equals `field.byteLength` to bypass type coercion entirely.

Throws `PayloadBuildError` on type mismatch, missing field, or length mismatch.

**`decodePayload`**

```ts
function decodePayload(
  data: Uint8Array,
  fields: BinaryField[],
  structs: Record<string, NamedStruct>,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): DecodedStruct
```

Reverses `buildPayload`. All field types decode symmetrically.

**`buildPayloadManual`**

```ts
function buildPayloadManual(
  fields: ReadonlyArray<{ type: FieldType; value: FieldValue }>,
): Uint8Array
```

Encodes ordered fields without field names. For unknown or custom contracts where you know the layout but have no registry entry.

### Registry client

```ts
import { createRegistryClient } from '@qubic.ts/registry'

interface RegistryClientOptions {
  url?: string                              // default: 'https://registry.qubic.ts/registry.json'
  cache?: 'none' | 'session' | 'persistent' // default: 'session'
  ttlMs?: number                            // default: 3_600_000 (1 hour)
  fetch?: typeof globalThis.fetch
}

interface RegistryClient {
  getAbi(contractIndex: number, epoch: number): Promise<AbiLookupResult>
  getCurrentAbi(contractIndex: number): Promise<ContractAbiVersion>
  getAbiHistory(contractIndex: number): Promise<ContractAbiVersion[]>
  getRegistry(): Promise<ContractRegistry>
}

function createRegistryClient(options?: RegistryClientOptions): RegistryClient
```

Cache modes: `session` uses a module-level variable (server) or `sessionStorage` (browser); `persistent` uses `localStorage`; `none` fetches on every call.

## Examples

### Look up a contract ABI at a specific epoch

```ts
import { createRegistryClient, AbiNotFoundError } from '@qubic.ts/registry'

const client = createRegistryClient()

const result = await client.getAbi(9, 212)
console.log(result.version.contractName)       // 'Qearn'
console.log(result.isCurrent)                  // false if epoch 212 is historical
console.log(result.isRegistryPossiblyStale)    // true if epoch is ahead of the latest snapshot
```

### Encode a contract call input

```ts
import { createRegistryClient, buildPayload } from '@qubic.ts/registry'
import { identityToPublicKey } from '@qubic.ts/crypto'

const client = createRegistryClient()
const abi = await client.getCurrentAbi(9)

const lockProc = abi.procedures.find((p) => p.name === 'lock')!

const payload = buildPayload(
  lockProc.inputFields,
  abi.structs,
  { amount: 5_000_000n },
  identityToPublicKey,
)
```

### Decode a contract response

```ts
import { decodePayload } from '@qubic.ts/registry'
import { publicKeyToIdentity } from '@qubic.ts/crypto'

const decoded = decodePayload(responseBytes, fn.outputFields, abi.structs, publicKeyToIdentity)
console.log(decoded.returnCode) // number
```

### Build a payload without a registry (manual mode)

```ts
import { buildPayloadManual } from '@qubic.ts/registry'

const payload = buildPayloadManual([
  { type: 'uint64', value: 5_000_000n },
  { type: 'uint32', value: 150 },
])
```

### Walk a contract's version history

```ts
const history = await client.getAbiHistory(9)
for (const v of history) {
  console.log(`epoch ${v.effectiveFromEpoch}–${v.effectiveToEpoch ?? 'now'}: ${v.changelog}`)
}
```

## Error handling

```ts
import { AbiNotFoundError, PayloadBuildError } from '@qubic.ts/registry'

try {
  const result = await client.getAbi(9, 1)
} catch (e) {
  if (e instanceof AbiNotFoundError) {
    console.error(`No ABI for contract ${e.contractIndex} at epoch ${e.epoch}`)
  }
}

try {
  buildPayload(fields, structs, { wrongField: 0 }, idToPk)
} catch (e) {
  if (e instanceof PayloadBuildError) {
    console.error(e.message) // 'Missing field "amount"'
  }
}
```

## Data layout

The compiled registry lives under `data/`:

```
data/
  epochs/{epoch}/{ContractName}.json   # one ContractAbiVersion per file
  epoch-refs.json                      # maps epoch numbers to git tags
  registry.json                        # compiled ContractRegistry (version-range index)
  schema.json                          # JSON Schema for validation
```

## Backfill scripts

These scripts are not exported but maintain the data above.

```sh
# Parse a single contract ABI from local resources/core/
bun scripts/extract-abi.ts

# Backfill historical snapshots by scanning qubic/core git tags
bun scripts/backfill.ts --from-epoch 104 [--to-epoch 220] [--contracts Qearn,Qx] [--token GH_TOKEN] [--dry-run]

# Validate all epoch snapshot files against the JSON Schema
bun scripts/validate.ts
```

## Design notes

**Per-epoch snapshots** — Qubic contract ABIs change between epochs. Storing one `ContractAbiVersion` per epoch range means historical transactions from any epoch can be decoded against the correct struct layout, not the current one.

**Injected identity converters** — `buildPayload` and `decodePayload` accept `identityToPublicKey` and `publicKeyToIdentity` as parameters rather than importing from `@qubic.ts/crypto` directly. This keeps the codec tree-shakeable and testable without cryptographic dependencies, and lets server and browser environments supply different implementations.

**`effectiveToEpoch: null`** — a sentinel value meaning "currently active." This avoids storing an arbitrary large epoch ceiling that would need updating with every new epoch.
