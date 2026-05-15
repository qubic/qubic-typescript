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

Returns a client object for the live v1 API. All methods return typed promises and throw `QubicRpcError` on non-2xx responses.

#### Live client methods

```ts
getTickInfo(): Promise<LiveTickInfo>
```
Returns the current tick number, epoch, tick duration and initial tick of the epoch.

```ts
getBalance(identity: string): Promise<LiveBalance>
```
Returns the balance and transfer history for the given identity string.

```ts
broadcastTransaction(encodedTransaction: string): Promise<BroadcastTransactionResponse>
```
Broadcasts a base64-encoded signed transaction. Use `encodeTransaction` from `@qubic.org/tx` to produce the encoded string. Returns the peer count that accepted the transaction and the assigned transaction ID.

```ts
querySmartContract(req: QuerySmartContractRequest): Promise<QuerySmartContractResponse>
```
Calls a smart contract read-only function. The request carries the contract index, input type, and base64-encoded input data. The response carries base64-encoded output data.

```ts
getIssuedAssets(identity: string): Promise<IssuedAsset[]>
getOwnedAssets(identity: string): Promise<OwnedAsset[]>
getPossessedAssets(identity: string): Promise<PossessedAsset[]>
```
Return assets issued by, owned by, or possessed by the given identity, respectively.

```ts
getAssetIssuances(filter?: { issuerIdentity?: string; assetName?: string }): Promise<AssetIssuance[]>
getAssetIssuanceByIndex(index: number): Promise<AssetIssuance>

getAssetOwnerships(filter?: {
  issuerIdentity?: string
  assetName?: string
  ownerIdentity?: string
  ownershipManagingContract?: number
}): Promise<AssetOwnership[]>
getAssetOwnershipByIndex(index: number): Promise<AssetOwnership>

getAssetPossessions(filter?: {
  issuerIdentity?: string
  assetName?: string
  ownerIdentity?: string
  possessorIdentity?: string
  ownershipManagingContract?: number
  possessionManagingContract?: number
}): Promise<AssetPossession[]>
getAssetPossessionByIndex(index: number): Promise<AssetPossession>
```
Filtered and index-based asset record lookups across the three ownership tiers (issuance, ownership, possession).

```ts
getActiveIpos(): Promise<Ipo[]>
```
Returns all currently active initial public offerings on the Qubic network.

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
getLastProcessedTick(): Promise<{
  tickNumber: number
  epoch: number
  intervalInitialTick: number
  logTickNumber: number
}>
```
Returns the most recent tick indexed by the archive.

```ts
getProcessedTickIntervals(): Promise<ProcessedTickInterval[]>
```
Returns the contiguous tick intervals that have been processed.

```ts
getComputorListsForEpoch(epoch: number): Promise<QueryComputorList[]>
```
Returns all computor lists for the given epoch.

```ts
getTickData(tickNumber: number): Promise<QueryTickData>
```
Returns full tick data including transaction hashes, computor signature, and spectra root.

```ts
getTransactionByHash(hash: string): Promise<QueryTransaction>
```
Fetches a single transaction by its 60-character lowercase hash.

```ts
getTransactionsForIdentity(req: GetTransactionsForIdentityRequest): Promise<{
  transactions: QueryTransaction[]
  hits: Hits
  validForTick: number
}>
```
Returns paginated transactions for an identity with optional tick range and type filters.

```ts
getTransactionsForTick(tickNumber: number): Promise<QueryTransaction[]>
```
Returns all transactions included in the given tick.

```ts
getEventLogs(req: GetEventLogsRequest): Promise<{
  eventLogs: QueryEvent[]
  hits: Hits
  validForTick: number
}>
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

Thrown by every client method on a non-2xx response. The `status` and `endpoint` fields make it easy to branch on specific failure modes (e.g. `404` identity not found vs. `503` node overload).

### Exported types

```ts
// Live client types
type LiveBalance, LiveTickInfo
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

const tickInfo = await live.getTickInfo()
console.log('Current tick:', tickInfo.tick)

const balance = await live.getBalance('YOURIDENTITYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
console.log('Balance:', balance)
```

### Build and broadcast a transaction

```ts
import { createLiveClient } from '@qubic.org/rpc'
import { buildTransaction, signTransaction, encodeTransaction } from '@qubic.org/tx'
import { publicKeyFromSeed, identityToPublicKey } from '@qubic.org/crypto'
import { toSeed, toIdentity, PROTOCOL } from '@qubic.org/types'

const seed = toSeed('yourseedaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
const live = createLiveClient()

const { tick } = await live.getTickInfo()

const txBytes = buildTransaction({
  sourcePublicKey: publicKeyFromSeed(seed),
  destinationPublicKey: identityToPublicKey(
    toIdentity('RECIPIENTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
  ),
  amount: 1_000_000n,
  targetTick: tick + PROTOCOL.TICKS_TO_EXPIRY,
  inputType: 0,
  currentTick: tick,
})

const signedTx = await signTransaction(txBytes, seed)
const encoded = encodeTransaction(signedTx)
const result = await live.broadcastTransaction(encoded)
console.log('Broadcast result:', result)
```

### Query event logs for QU transfers

```ts
import { createQueryClient } from '@qubic.org/rpc'
import { LOG_TYPE } from '@qubic.org/types'

const query = createQueryClient()

const { eventLogs, hits } = await query.getEventLogs({
  logType: LOG_TYPE.QU_TRANSFER,
  identity: 'YOURIDENTITYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  startTick: 18_490_000,
  endTick: 18_500_000,
  pageSize: 50,
  page: 0,
})

console.log(`Found ${hits.totalCount} transfers, showing ${eventLogs.length}`)
```

## Error handling

All methods throw `QubicRpcError` when the HTTP response is not 2xx. Catch it to distinguish RPC failures from unexpected runtime errors:

```ts
import { createLiveClient, QubicRpcError } from '@qubic.org/rpc'

const live = createLiveClient()

try {
  const balance = await live.getBalance(identity)
} catch (err) {
  if (err instanceof QubicRpcError) {
    console.error(`HTTP ${err.status} on ${err.endpoint}`)
    // err.status === 404: identity not found
    // err.status === 503: node overloaded
  } else {
    throw err  // network failure, abort, etc.
  }
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
