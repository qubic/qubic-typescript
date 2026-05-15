# `@qubic.org/types`

Shared types, branded primitives, protocol constants, and error classes for the Qubic TypeScript SDK.

This package is the foundation of the monorepo. Every other package imports from it. It provides zero-runtime-cost branded string types that prevent misuse of raw strings across API boundaries, a typed error hierarchy, Qubic protocol constants, and the core protocol data interfaces.

## Installation

```sh
bun add @qubic.org/types
```

No peer dependencies.

## API

### Branded types

Branded types are plain `string` values at runtime, but TypeScript treats them as distinct types. You cannot accidentally pass a seed where an identity is expected.

```ts
type Identity    = Brand<string, 'Identity'>    // 60 uppercase ASCII letters
type Seed        = Brand<string, 'Seed'>        // 55 lowercase ASCII letters
type TxHash      = Brand<string, 'TxHash'>      // 60 lowercase ASCII letters
type Base64      = Brand<string, 'Base64'>      // valid base64 string (length % 4 === 0)
type HexPublicKey = Brand<string, 'HexPublicKey'>
```

### Constructors (validate and brand)

```ts
function toIdentity(s: string): Identity
function toSeed(s: string): Seed
function toTxHash(s: string): TxHash
function toBase64(s: string): Base64
```

Each function validates the string format and returns it as the corresponding branded type. All throw a typed `QubicError` subclass on failure — they never return `null` or `undefined`.

### Type guards

```ts
function isIdentity(s: string): s is Identity
function isSeed(s: string): s is Seed
function isTxHash(s: string): s is TxHash
```

Return `true` if the string satisfies the format constraint. Usable as TypeScript type predicates in `if` branches.

### Errors

```ts
abstract class QubicError extends Error {
  abstract readonly code: string
  readonly context?: Record<string, unknown>
}

class InvalidIdentityError extends QubicError  // code: 'INVALID_IDENTITY'
class InvalidSeedError     extends QubicError  // code: 'INVALID_SEED'
class InvalidTxHashError   extends QubicError  // code: 'INVALID_TX_HASH'
class InvalidBase64Error   extends QubicError  // code: 'INVALID_BASE64'
```

`QubicError` sets `this.name` to the concrete class name and captures the stack trace. The `context` field carries structured metadata (e.g. the bad input value, expected length) for programmatic error handling.

### Protocol constants

```ts
const PROTOCOL = {
  MAX_INPUT_SIZE:  1024,  // max SC payload bytes
  TX_HEADER_SIZE:  80,    // fixed header without payload
  SIGNATURE_SIZE:  64,    // SchnorrQ signature bytes
  PUBLIC_KEY_SIZE: 32,    // compressed FourQ public key bytes
  IDENTITY_LENGTH: 60,    // identity string characters
  SEED_LENGTH:     55,    // seed string characters
  TX_HASH_LENGTH:  60,    // tx hash string characters
  TICKS_TO_EXPIRY: 20,    // recommended target tick offset
} as const
```

### Contract index map

```ts
const CONTRACT_INDEX = {
  QX: 1, QUOTTERY: 2, RANDOM: 3, QUTIL: 4, MY_LAST_MATCH: 5,
  GENERAL_QUORUM_PROPOSAL: 6, SUPPLY_WATCHER: 7,
  COMPUTOR_CONTROLLED_FUND: 8, QEARN: 9, QVAULT: 10,
  MS_VAULT: 11, QBAY: 12, QSWAP: 13, NOSTROMO: 14,
  QDRAW: 15, RANDOM_LOTTERY: 16, QBOND: 17, QIP: 18,
  QRAFFLE: 19, QRWA: 20, QRESERVE_POOL: 21, QTHIRTYFOUR: 22,
  QDUEL: 23, PULSE: 24, VOTTUN_BRIDGE: 25, QUSINO: 26, ESCROW: 27,
} as const
type ContractIndex = (typeof CONTRACT_INDEX)[keyof typeof CONTRACT_INDEX]
```

### Log type map

```ts
const LOG_TYPE = {
  QU_TRANSFER: 0, ASSET_ISSUANCE: 1, ASSET_OWNERSHIP_CHANGE: 2,
  ASSET_POSSESSION_CHANGE: 3, CONTRACT_ERROR_MESSAGE: 4,
  CONTRACT_WARNING_MESSAGE: 5, CONTRACT_INFORMATION_MESSAGE: 6,
  CONTRACT_DEBUG_MESSAGE: 7, BURNING: 8, DUST_BURNING: 9,
  SPECTRUM_STATS: 10, CUSTOM_MESSAGE: 255,
} as const
type LogType = (typeof LOG_TYPE)[keyof typeof LOG_TYPE]
```

### Protocol interfaces

```ts
interface TickInfo {
  tick: number
  duration: number
  epoch: number
  initialTick: number
}

interface Asset {
  issuer: Identity
  name: string            // up to 7 characters
  numberOfShares: bigint
  unitOfMeasurement: bigint
  numberOfDecimalPlaces: number
}

interface AssetOrder {
  entityId: Identity
  price: bigint
  numberOfShares: bigint
}

interface ComputorList {
  epoch: number
  identities: Identity[]
}
```

## Examples

### Validate and brand user input

```ts
import { toIdentity, toSeed, InvalidIdentityError } from '@qubic.org/types'

function parseInput(raw: { identity: string; seed: string }) {
  const identity = toIdentity(raw.identity)  // throws InvalidIdentityError if bad
  const seed = toSeed(raw.seed)              // throws InvalidSeedError if bad
  return { identity, seed }
}
```

### Type guard in a conditional branch

```ts
import { isIdentity, isIdentity as guard } from '@qubic.org/types'
import type { Identity } from '@qubic.org/types'

function display(s: string): string {
  if (isIdentity(s)) {
    // s is narrowed to Identity here
    return `Identity: ${s.slice(0, 8)}...`
  }
  return `Not a valid identity`
}
```

### Structured error handling

```ts
import { toIdentity, QubicError, InvalidIdentityError } from '@qubic.org/types'

try {
  const id = toIdentity('not-valid')
} catch (err) {
  if (err instanceof InvalidIdentityError) {
    console.error(`Bad identity (code: ${err.code}):`, err.message)
    // err.identity contains the raw bad input string
  } else if (err instanceof QubicError) {
    console.error(`Qubic error ${err.code}:`, err.context)
  }
}
```

### Using protocol constants

```ts
import { PROTOCOL, CONTRACT_INDEX } from '@qubic.org/types'

const targetTick = currentTick + PROTOCOL.TICKS_TO_EXPIRY
const contractId = CONTRACT_INDEX.QEARN  // 9
```

## Design notes

**Why branded types instead of classes or wrappers?** Branded types have zero runtime cost — they are erased to plain `string` by TypeScript. Wrapper classes would allocate heap objects and require `.value` accessors everywhere. The brand approach gives full type safety at the call site while serialising/deserialising as ordinary strings.

**Why `toX` functions that throw rather than returning `Result<T>`?** Validation at boundaries (parsing user input, loading config) is inherently exceptional. Throwing makes happy-path code linear and prevents callers from silently ignoring validation failures. Packages higher in the stack (e.g. `@qubic.org/rpc`) catch and re-wrap errors where appropriate.

**Why `QubicError` as an abstract base?** A common base class lets consumers write a single `instanceof QubicError` guard to distinguish SDK errors from unexpected `Error`s thrown by the runtime or third-party code. The `code` discriminant then enables switching on the specific case without string matching on `.message`.
