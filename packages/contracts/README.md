# `@qubic.ts/contracts`

Generated typed TypeScript wrappers for every deployed Qubic smart contract.

This package provides ready-to-use, fully-typed functions for every procedure and function exposed by Qubic's on-chain contracts. It is generated from the latest epoch snapshot in `@qubic.ts/registry` and eliminates the need to manually construct binary payloads or look up ABI field descriptors. The generated files are committed — consumers do not need to run the generator.

## Installation

```sh
bun add @qubic.ts/contracts
```

In a monorepo workspace:

```json
{ "dependencies": { "@qubic.ts/contracts": "workspace:*" } }
```

## Supported contracts

| Contract | Index |
|---|---|
| Random | 3 |
| MyLastMatch | 5 |
| Qx | 1 |
| Quottery | 2 |
| QUtil | 4 |
| SupplyWatcher | 7 |
| ComputorControlledFund | 8 |
| Qearn | 9 |
| QVault | 10 |
| MsVault / MultiSignVault | 11 |
| Qbay | 12 |
| Qswap | 13 |
| Nostromo | 14 |
| Qdraw | 15 |
| RandomLottery | 16 |
| QBond | 17 |
| QIP | 18 |
| QRaffle | 19 |
| qRWA | 20 |
| QReservePool | 21 |
| QThirtyFour | 22 |
| QDuel | 23 |
| Pulse | 24 |
| VottunBridge | 25 |
| Qusino | 26 |
| Escrow | 27 |
| GeneralQuorumProposal | 6 |

## API Reference

### `Result<T, E>` type

All async callers return `Result` — a discriminated union that never throws on contract errors.

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

function ok<T>(value: T): Ok<T>
function err<E>(error: E): Err<E>
```

### `SmartContractCaller` interface

Any live node client that implements `querySmartContract` satisfies this interface, including `createLiveClient()` from `@qubic.ts/rpc`.

```ts
interface SmartContractCaller {
  querySmartContract(req: QuerySmartContractRequest): Promise<QuerySmartContractResponse>
}
```

### `ContractCallOptions`

Optional converters injected into function callers for `id`-typed fields. Both default to no-ops (zero public key / `'AAA...AAA'` identity) if omitted.

```ts
interface ContractCallOptions {
  identityToPublicKey?: (identity: string) => Uint8Array
  publicKeyToIdentity?: (pk: Uint8Array) => string
}
```

### `callContractFunction`

Low-level function used by generated wrappers. Useful when calling a contract not yet in the generated set.

```ts
async function callContractFunction<TInput, TOutput>(
  options: CallContractFunctionOptions<TInput>,
): Promise<Result<TOutput, QubicRpcError>>

interface CallContractFunctionOptions<TInput> {
  live: SmartContractCaller
  contractIndex: number
  inputType: number
  inputSize: number
  inputFields: BinaryField[]
  outputFields: BinaryField[]
  structs: Record<string, NamedStruct>
  input: TInput
  identityToPublicKey?: (identity: string) => Uint8Array
  publicKeyToIdentity?: (pk: Uint8Array) => string
}
```

### Per-contract exports (Qearn example)

Every contract follows the same pattern. Qearn (index 9) exports:

```ts
// Constants
const QEARN_CONTRACT_INDEX: 9
const QEARN_LOCK_INPUT_TYPE: 6
const QEARN_UNLOCK_INPUT_TYPE: 7
const QEARN_GET_STATE_OF_ROUND_INPUT_TYPE: 3
// ... one INPUT_TYPE constant per procedure and function

// Procedure payload builders (for transaction inputs)
function buildQearnUnlockInput(
  input: QearnUnlockInput,
  identityToPublicKey?: (identity: string) => Uint8Array,
): Uint8Array

// Procedure output decoders
function decodeQearnLockOutput(
  data: Uint8Array,
  publicKeyToIdentity?: (pk: Uint8Array) => string,
): QearnLockOutput

function decodeQearnUnlockOutput(
  data: Uint8Array,
  publicKeyToIdentity?: (pk: Uint8Array) => string,
): QearnUnlockOutput

// Function callers (async read-only RPC queries)
function qearnGetStateOfRound(
  live: SmartContractCaller,
  input: QearnGetStateOfRoundInput,
  options?: ContractCallOptions,
): Promise<Result<QearnGetStateOfRoundOutput, QubicRpcError>>

function qearnGetLockInfoPerEpoch(live, input, options?)
function qearnGetUserLockedInfo(live, input, options?)
function qearnGetUserLockStatus(live, input, options?)
function qearnGetEndedStatus(live, input, options?)
function qearnGetStatsPerEpoch(live, input, options?)
function qearnGetBurnedAndBoostedStats(live, options?)
function qearnGetBurnedAndBoostedStatsPerEpoch(live, input, options?)

// Namespace object — all of the above collected
const qearn: {
  contractIndex: 9
  getLockInfoPerEpoch: typeof qearnGetLockInfoPerEpoch
  getUserLockedInfo: typeof qearnGetUserLockedInfo
  getStateOfRound: typeof qearnGetStateOfRound
  getUserLockStatus: typeof qearnGetUserLockStatus
  getEndedStatus: typeof qearnGetEndedStatus
  getStatsPerEpoch: typeof qearnGetStatsPerEpoch
  getBurnedAndBoostedStats: typeof qearnGetBurnedAndBoostedStats
  getBurnedAndBoostedStatsPerEpoch: typeof qearnGetBurnedAndBoostedStatsPerEpoch
  decodeLockOutput: typeof decodeQearnLockOutput
  buildUnlockInput: typeof buildQearnUnlockInput
  decodeUnlockOutput: typeof decodeQearnUnlockOutput
}
```

All other contracts export the same structure with names derived from their contract name.

## Examples

### Query a contract function

```ts
import { createLiveClient } from '@qubic.ts/rpc'
import { qearnGetStateOfRound } from '@qubic.ts/contracts'

const live = createLiveClient({ baseUrl: 'https://rpc.qubic.org' })

const result = await qearnGetStateOfRound(live, { epoch: 212 })

if (result.ok) {
  console.log('round state:', result.value.state)
} else {
  console.error('RPC error:', result.error.message)
}
```

### Use the namespace object

```ts
import { createLiveClient } from '@qubic.ts/rpc'
import { qearn } from '@qubic.ts/contracts'

const live = createLiveClient({ baseUrl: 'https://rpc.qubic.org' })

const result = await qearn.getStatsPerEpoch(live, { epoch: 212 })
if (result.ok) {
  console.log('total locked:', result.value.totalLockedAmount)
}
```

### Build a procedure input for a transaction

```ts
import { buildQearnUnlockInput } from '@qubic.ts/contracts'
import { identityToPublicKey } from '@qubic.ts/crypto'

const payload = buildQearnUnlockInput(
  { amount: 5_000_000n, lockedEpoch: 210 },
  identityToPublicKey,
)
// payload is a Uint8Array ready to embed in a transaction
```

### Decode a procedure output returned from a node

```ts
import { decodeQearnLockOutput } from '@qubic.ts/contracts'

const output = decodeQearnLockOutput(responseBytes)
console.log('returnCode:', output.returnCode)
```

### Pass identity converters for id-typed fields

```ts
import { identityToPublicKey, publicKeyToIdentity } from '@qubic.ts/crypto'
import { qearnGetUserLockedInfo } from '@qubic.ts/contracts'

const result = await qearnGetUserLockedInfo(
  live,
  { user: 'BZBQFLLBNCXEMGLOBHUVGPKHZALRYIZMDRCU...', epoch: 212 },
  { identityToPublicKey, publicKeyToIdentity },
)
```

## Error handling

Function callers never throw on network or RPC errors — they wrap them in `Result`:

```ts
import { QubicRpcError } from '@qubic.ts/rpc'

const result = await qearnGetStateOfRound(live, { epoch: 212 })

if (!result.ok) {
  const e = result.error  // QubicRpcError
  console.error(e.message)
}
```

`PayloadBuildError` can still be thrown synchronously by procedure builders if the input object is malformed:

```ts
import { PayloadBuildError } from '@qubic.ts/registry'

try {
  buildQearnUnlockInput({ amount: 'wrong' as any, lockedEpoch: 210 })
} catch (e) {
  if (e instanceof PayloadBuildError) {
    console.error(e.message)  // 'Field "amount": expected bigint'
  }
}
```

## Code generation

Generated files live in `src/__generated__/` and are committed to the repository.

```sh
# Regenerate from the latest epoch snapshot in @qubic.ts/registry/data/epochs/
bun run generate
```

The generator reads the highest-numbered epoch folder, produces one `*.ts` file per contract, and writes `src/__generated__/index.ts`. Run it after updating the registry with new epoch data.

## Design notes

**Generated and committed** — consumers get typed completions and never need to run the generator or have access to the registry data files.

**`Result` instead of throw** — network failures and RPC errors are expected and recoverable. Returning `Result<T, QubicRpcError>` makes error paths explicit in the caller without requiring try/catch around every async call.

**Optional identity converters** — `id`-typed fields (Qubic 60-character identity strings) need cryptographic conversion. Passing converters as optional parameters keeps the generated code free of crypto dependencies; callers only pay for it when their contract actually has `id` fields.
