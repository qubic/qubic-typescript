# `@qubic.org/rpc`

Type-safe HTTP clients for the Qubic RPC API — live node data and archive query endpoints.

This package wraps the public Qubic RPC service (`rpc.qubic.org`) with two factory functions: `createLiveClient` for real-time node state (balances, tick info, broadcasting) and `createQueryClient` for the archive indexer (historical transactions, event logs, computor lists). All types are generated from OpenAPI schemas via `openapi-typescript`, so the TypeScript types stay in sync with the actual API automatically.

## Installation

```sh
bun add @qubic.org/rpc
```

Dependencies: `openapi-fetch`, `@qubic.org/types`

## API

### `createLiveClient`

```ts
type LiveClientOptions = {
  baseUrl?: string                               // default: 'https://rpc.qubic.org/live/v1'
  signal?: AbortSignal                           // applied to every request
  fetch?: (input: Request) => Promise<Response>  // custom fetch implementation
}

function createLiveClient(options?: LiveClientOptions): LiveClient
```

Returns a client object for the live v1 API. All methods return `Promise<Result<T, QubicRpcError>>` — check `result.ok` before accessing `result.value`.

#### Live client methods

```ts
getTickInfo(): Promise<Result<LiveTickInfo, QubicRpcError>>
```
Returns the current tick number, epoch, tick duration and initial tick of the epoch.

```ts
getBalance(identity: string): Promise<Result<QubicBalance, QubicRpcError>>
```
Returns the balance and transfer history for the given identity string. Numeric amounts are converted to `bigint`.

```ts
broadcastTransaction(encodedTransaction: string): Promise<Result<BroadcastTransactionResponse, QubicRpcError>>
```
Broadcasts a base64-encoded signed transaction. Use `encodeTransaction` from `@qubic.org/tx` to produce the encoded string. Returns the peer count that accepted the transaction and the assigned transaction ID.

```ts
querySmartContract(req: QuerySmartContractRequest): Promise<Result<QuerySmartContractResponse, QubicRpcError>>
```
Calls a smart contract read-only function. The request carries the contract index, input type, and base64-encoded input data. The response carries base64-encoded output data.

```ts
getIssuedAssets(identity: string): Promise<Result<IssuedAsset[], QubicRpcError>>
getOwnedAssets(identity: string): Promise<Result<OwnedAsset[], QubicRpcError>>
getPossessedAssets(identity: string): Promise<Result<PossessedAsset[], QubicRpcError>>
```
Return assets issued by, owned by, or possessed by the given identity, respectively.

```ts
getAssetIssuances(filter?: { issuerIdentity?: string; assetName?: string }): Promise<Result<AssetIssuance[], QubicRpcError>>
getAssetIssuanceByIndex(index: number): Promise<Result<AssetIssuance, QubicRpcError>>

getAssetOwnerships(filter?: {
  issuerIdentity?: string
  assetName?: string
  ownerIdentity?: string
  ownershipManagingContract?: number
}): Promise<Result<AssetOwnership[], QubicRpcError>>
getAssetOwnershipByIndex(index: number): Promise<Result<AssetOwnership, QubicRpcError>>

getAssetPossessions(filter?: {
  issuerIdentity?: string
  assetName?: string
  ownerIdentity?: string
  possessorIdentity?: string
  ownershipManagingContract?: number
  possessionManagingContract?: number
}): Promise<Result<AssetPossession[], QubicRpcError>>
getAssetPossessionByIndex(index: number): Promise<Result<AssetPossession, QubicRpcError>>
```
Filtered and index-based asset record lookups across the three ownership tiers (issuance, ownership, possession).

```ts
getActiveIpos(): Promise<Result<Ipo[], QubicRpcError>>
```
Returns all currently active initial public offerings on the Qubic network.

```ts
/** @deprecated Use getTickInfo() instead. */
getBlockHeight(): Promise<Result<LiveTickInfo, QubicRpcError>>
```
Returns tick info via the deprecated `/block-height` endpoint. Prefer `getTickInfo()`.

### `createQueryClient`

```ts
type QueryClientOptions = {
  baseUrl?: string   // default: 'https://rpc.qubic.org/query/v1'
  signal?: AbortSignal
  fetch?: (input: Request) => Promise<Response>
}

function createQueryClient(options?: QueryClientOptions): QueryClient
```

Returns a client object for the archive query v1 API.

#### Query client methods

```ts
getLastProcessedTick(): Promise<Result<{
  tickNumber: number
  epoch: number
  intervalInitialTick: number
  logTickNumber: number
}, QubicRpcError>>
```
Returns the most recent tick indexed by the archive.

```ts
getProcessedTickIntervals(): Promise<Result<ProcessedTickInterval[], QubicRpcError>>
```
Returns the contiguous tick intervals that have been processed.

```ts
getComputorListsForEpoch(epoch: number): Promise<Result<QueryComputorList[], QubicRpcError>>
```
Returns all computor lists for the given epoch.

```ts
getTickData(tickNumber: number): Promise<Result<QueryTickData, QubicRpcError>>
```
Returns full tick data including transaction hashes, computor signature, and spectra root.

```ts
getTransactionByHash(hash: string): Promise<Result<QueryTransaction, QubicRpcError>>
```
Fetches a single transaction by its 60-character lowercase hash.

```ts
getTransactionsForIdentity(req: GetTransactionsForIdentityRequest): Promise<Result<{
  transactions: QueryTransaction[]
  hits: Hits
  validForTick: number
}, QubicRpcError>>
```
Returns paginated transactions for an identity with optional tick range and type filters.

```ts
getTransactionsForTick(tickNumber: number): Promise<Result<QueryTransaction[], QubicRpcError>>
```
Returns all transactions included in the given tick.

```ts
getEventLogs(req: GetEventLogsRequest): Promise<Result<{
  eventLogs: QueryEvent[]
  hits: Hits
  validForTick: number
}, QubicRpcError>>
```
Queries event logs (QU transfers, asset events, contract messages, etc.) with rich filtering by log type, identity, tick range, and pagination.

### Errors

```ts
class QubicRpcError extends QubicError {
  readonly code = 'RPC_ERROR'
  readonly status: number    // HTTP status code
  readonly endpoint: string  // the path that failed
}
```

Returned (inside `Result.error`) on any non-2xx response. The `status` and `endpoint` fields make it easy to branch on specific failure modes (e.g. `404` identity not found vs. `503` node overload).

### Exported types

```ts
// Result type (returned by all methods)
type Result<T, E> = Ok<T> | Err<E>
type Ok<T> = { readonly ok: true; readonly value: T }
type Err<E> = { readonly ok: false; readonly error: E }

// Live client types
type LiveBalance, LiveTickInfo, QubicBalance
type BroadcastTransactionRequest, BroadcastTransactionResponse
type QuerySmartContractRequest, QuerySmartContractResponse
type IssuedAsset, OwnedAsset, PossessedAsset
type AssetIssuance, AssetOwnership, AssetPossession
type Ipo
type LiveClient, LiveClientOptions

// Query client types
type QueryTransaction, QueryTickData, QueryEvent, QueryComputorList
type ProcessedTickInterval
type GetEventLogsRequest, GetTransactionsForIdentityRequest
type Hits
type QueryClient, QueryClientOptions
```

## Examples

### Fetch current tick and account balance

```ts
import { createLiveClient } from '@qubic.org/rpc'

const live = createLiveClient()

const tickResult = await live.getTickInfo()
if (tickResult.ok) {
  console.log('Current tick:', tickResult.value.tick)
}

const balanceResult = await live.getBalance('BZBQFLLBNCXEMGLOBHUVFTLUPLVCPQUASSILFABOFFBCADQSSUPNWLZBQEXK')
if (balanceResult.ok) {
  console.log('Balance:', balanceResult.value.balance) // bigint
}
```

### Build and broadcast a transaction

```ts
import { createLiveClient } from '@qubic.org/rpc'
import { buildTransaction, signTransaction, encodeTransaction } from '@qubic.org/tx'
import { deriveIdentityFromSeed } from '@qubic.org/crypto'
import { toSeed } from '@qubic.org/types'

const seed = toSeed('a'.repeat(55))
const source = deriveIdentityFromSeed(seed)
const live = createLiveClient()

const tickResult = await live.getTickInfo()
if (!tickResult.ok) throw tickResult.error
const tick = tickResult.value.tick!

const txBytes = buildTransaction({
  source,
  destination: 'BZBQFLLBNCXEMGLOBHUVFTLUPLVCPQUASSILFABOFFBCADQSSUPNWLZBQEXK',
  amount: 1_000_000n,
  targetTick: tick + 5,
  inputType: 0,
  currentTick: tick,
})

const signedTx = await signTransaction(txBytes, seed)
const encoded = encodeTransaction(signedTx)
const broadcastResult = await live.broadcastTransaction(encoded)
if (broadcastResult.ok) {
  console.log('Broadcast to', broadcastResult.value.peersBroadcasted, 'peers')
}
```

### Query event logs for QU transfers

```ts
import { createQueryClient } from '@qubic.org/rpc'

const query = createQueryClient()

const result = await query.getEventLogs({
  filters: {
    source: 'BZBQFLLBNCXEMGLOBHUVFTLUPLVCPQUASSILFABOFFBCADQSSUPNWLZBQEXK',
    logType: '0',
  },
  ranges: {
    tickNumber: { min: '18490000', max: '18500000' },
  },
  pagination: { offset: 0, size: 50 },
})

if (result.ok) {
  console.log(`Found ${result.value.hits.total} transfers, showing ${result.value.eventLogs.length}`)
}
```

## Error handling

All methods return `Result<T, QubicRpcError>` instead of throwing. Check `.ok` before accessing `.value`:

```ts
import { createLiveClient } from '@qubic.org/rpc'

const live = createLiveClient()

const result = await live.getBalance(identity)
if (!result.ok) {
  console.error(`HTTP ${result.error.status} on ${result.error.endpoint}`)
  // result.error.status === 404: identity not found
  // result.error.status === 503: node overloaded
} else {
  console.log('Balance:', result.value.balance)
}
```

Abort long-running requests with a standard `AbortController`:

```ts
const controller = new AbortController()
setTimeout(() => controller.abort(), 3000)

const live = createLiveClient({ signal: controller.signal })
const tickInfo = await live.getTickInfo()
```

## Design notes

**OpenAPI-generated types.** The type definitions for request/response bodies come from `openapi-typescript` processing the official Qubic API schemas stored at `resources/live-api.json` and `resources/query-api.json`. Run `bun run generate` inside `packages/rpc/` to regenerate after schema updates. This keeps parameter names, optional fields, and response shapes accurate without manual maintenance.

**`openapi-fetch` under the hood.** Rather than wrapping `fetch` directly, the clients use `openapi-fetch` which maps OpenAPI path templates to typed method calls. This eliminates string-interpolation bugs in URL construction and gives each method a typed request body.

**Two clients, two base URLs.** The live API (`/live/v1`) reflects current node state and is appropriate for real-time operations (broadcasting, tick info, balances). The query API (`/query/v1`) is backed by an archive indexer and is appropriate for historical lookups. Keeping them separate prevents callers from accidentally hitting an archive endpoint expecting live data.

**Custom `fetch` for testing.** Pass a `fetch` option to inject a mock or intercept HTTP calls in tests without patching globals. The default omits the option so the runtime's native `fetch` is used in production.
