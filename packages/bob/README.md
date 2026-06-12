# `@qubic.org/bob`

Live node client for the Qubic Bob indexer — JSON-RPC 2.0, REST, and WebSocket subscriptions.

The Bob indexer is a Qubic node service that exposes chain state through three complementary transports. This package wraps all three with full TypeScript types, automatic retries, configurable timeouts, and a `Result`-based error model that never conflates network failures with application errors. It is the primary way to query balances, transactions, logs, and contract state from a running Qubic node.

## Installation

```sh
bun add @qubic.org/bob
```

In a monorepo workspace:

```json
{ "dependencies": { "@qubic.org/bob": "workspace:*" } }
```

## API Reference

### `Result<T, E>` type

All client methods return `Result` — a discriminated union that never throws on transport or protocol errors.

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

function ok<T>(value: T): Ok<T>
function err<E>(error: E): Err<E>
```

### Errors

```ts
class BobRpcError extends QubicError {
  readonly code: 'BOB_RPC_ERROR'
  readonly jsonRpcCode: number     // JSON-RPC error code, or HTTP status for REST errors
  readonly message: string
}

class BobConnectionError extends QubicError {
  readonly code: 'BOB_CONNECTION_ERROR'
}

class BobSubscriptionError extends QubicError {
  readonly code: 'BOB_SUBSCRIPTION_ERROR'
}
```

### JSON-RPC client

```ts
import { createBobRpcClient } from '@qubic.org/bob'

interface BobRpcClientOptions {
  endpoint: string         // e.g. 'http://localhost:40420'
  fetch?: typeof globalThis.fetch
  retries?: number         // default: 2
  timeoutMs?: number       // default: 10000
}

function createBobRpcClient(options: BobRpcClientOptions): BobRpcClient
```

All `BobRpcClient` methods accept an optional `{ signal?: AbortSignal }` as their last argument.

| Method | Return type | Description |
|---|---|---|
| `getChainId()` | `Promise<Result<string, BobRpcError>>` | Chain identifier string |
| `getTickNumber()` | `Promise<Result<number, BobRpcError>>` | Current tick number |
| `getLogs(filter)` | `Promise<Result<BobLogEvent[], BobRpcError>>` | Log events matching the filter |
| `getTransfers(filter)` | `Promise<Result<BobTransferEvent[], BobRpcError>>` | Transfer events matching the filter |
| `getBalance(identity)` | `Promise<Result<bigint, BobRpcError>>` | QU balance for an identity |
| `getTransactionByHash(hash)` | `Promise<Result<BobTransaction, BobRpcError>>` | Transaction by hash |
| `querySmartContract(contractIndex, funcNumber, data)` | `Promise<Result<Base64, BobRpcError>>` | Read-only contract function call |
| `broadcastTransaction(signedTxHex)` | `Promise<Result<TxHash, BobRpcError>>` | Broadcast a signed transaction; returns the transaction hash |

Filter and event types:

```ts
interface BobLogFilter {
  contractIndex?: number
  logType?: LogType
  identity?: Identity
  fromTick?: number
  toTick?: number
}

interface BobTransferFilter {
  identity?: Identity
  fromTick?: number
  toTick?: number
}

interface BobLogEvent {
  tick: number
  logId: bigint
  contractIndex: number
  logType: LogType
  data: Base64        // raw payload; decode with @qubic.org/events
  isCatchUp: boolean
}

interface BobTransferEvent {
  tick: number
  logId: bigint
  source: Identity
  destination: Identity
  amount: bigint
  isCatchUp: boolean
}

interface BobTransaction {
  hash: TxHash
  tick: number
  source: Identity
  destination: Identity
  amount: bigint
}
```

### REST client

```ts
import { createBobRestClient } from '@qubic.org/bob'

interface BobRestClientOptions {
  baseUrl?: string    // default: 'http://localhost:40420'
  signal?: AbortSignal
  fetch?: (input: Request) => Promise<Response>
}

function createBobRestClient(options?: BobRestClientOptions): BobRestClient
```

`BobRestClient` methods — all return `Promise<Result<T, BobRpcError>>`:

| Method | Description |
|---|---|
| `getStatus()` | Current node status |
| `getBalance(identity)` | Balance for an identity |
| `getAsset(identity, issuer, assetName, manageSCIndex)` | Asset info |
| `getEpochInfo(epoch)` | Epoch metadata |
| `getTransaction(txHash)` | Transaction by hash |
| `getTick(tickNumber)` | Tick data |
| `querySmartContract(body)` | Read-only contract call via REST |
| `broadcastTransaction(body)` | Broadcast a signed transaction |

### WebSocket subscription client

```ts
import { createBobSubscriptionClient } from '@qubic.org/bob'

interface BobSubscriptionClientOptions {
  wsUrl: string
  autoReconnect?: boolean           // default: true
  maxReconnects?: number            // default: Infinity
  bufferSize?: number               // max queued events; default: 1000
  onBufferOverflow?: 'drop' | 'error'  // default: 'error'
  onReconnect?: (attempt: number, lastLogId: bigint | undefined) => void
}

interface SubscriptionEvent<T> {
  data: T
  isCatchUp: boolean
  logId?: bigint
  tick?: number
}

interface BobSubscriptionClient {
  readonly connectionStatus: ReadableStream<'connected' | 'disconnected' | 'reconnecting'>
  subscribeNewTicks(options?: { signal?: AbortSignal }): AsyncIterable<SubscriptionEvent<BobTickNotification>>
  subscribeLogs(filter?: BobLogFilter, options?: { startLogId?: bigint; startEpoch?: number; signal?: AbortSignal }): AsyncIterable<SubscriptionEvent<BobLogEvent>>
  subscribeTransfers(filter?: BobTransferFilter, options?: { startLogId?: bigint; signal?: AbortSignal }): AsyncIterable<SubscriptionEvent<BobTransferEvent>>
  subscribeTickStream(options?: { signal?: AbortSignal }): AsyncIterable<SubscriptionEvent<BobTickData>>
  close(): void
}

function createBobSubscriptionClient(options: BobSubscriptionClientOptions): BobSubscriptionClient
```

Reconnect uses exponential backoff (1s → 2s → 4s → 8s → 30s). On reconnect the last seen `logId` is sent as `startLogId` so no events are missed.

## Examples

### Check a balance

```ts
import { createBobRpcClient } from '@qubic.org/bob'
import { toIdentity } from '@qubic.org/types'

const bob = createBobRpcClient({ endpoint: 'http://localhost:40420' })
const identity = toIdentity('BZBQFLLBNCXEMGLOBHUVFTLUPLVCPQUASSILFABOFFBCADQSSUPNWLZBQEXK')

const result = await bob.getBalance(identity)
if (result.ok) {
  const balance: bigint = result.value
  console.log('balance:', balance)
}
```

### Query a smart contract function

```ts
import { createBobRpcClient } from '@qubic.org/bob'
import {
  buildQearnGetStateOfRoundInput,
  decodeQearnGetStateOfRoundOutput,
} from '@qubic.org/contracts'
import type { QearnGetStateOfRoundOutput } from '@qubic.org/contracts'

const bob = createBobRpcClient({ endpoint: 'http://localhost:40420' })

const inputPayload = buildQearnGetStateOfRoundInput({ epoch: 212 })
const b64 = Buffer.from(inputPayload).toString('base64')

const result = await bob.querySmartContract(9, 3, b64)
if (result.ok) {
  const output: QearnGetStateOfRoundOutput = decodeQearnGetStateOfRoundOutput(
    Buffer.from(result.value, 'base64'),
  )
  console.log('state:', output.state)
}
```

### Fetch status and epoch info via REST

```ts
import { createBobRestClient } from '@qubic.org/bob'
import type { BobEpochInfo, BobStatus } from '@qubic.org/bob'

const rest = createBobRestClient({ baseUrl: 'http://localhost:40420' })

const [status, epochInfo] = await Promise.all([
  rest.getStatus(),
  rest.getEpochInfo(212),
])

if (status.ok) {
  const value: BobStatus = status.value
  console.log(value)
}
if (epochInfo.ok) {
  const value: BobEpochInfo = epochInfo.value
  console.log(value)
}
```

### Subscribe to live log events

```ts
import { createBobSubscriptionClient } from '@qubic.org/bob'

const sub = createBobSubscriptionClient({ wsUrl: 'ws://localhost:40420' })

const ac = new AbortController()

for await (const event of sub.subscribeLogs({ contractIndex: 9 }, { signal: ac.signal })) {
  console.log('tick:', event.tick, 'logId:', event.logId, 'catchUp:', event.isCatchUp)
  if (shouldStop) ac.abort()
}

sub.close()
```

### Watch connection status

```ts
const sub = createBobSubscriptionClient({
  wsUrl: 'ws://localhost:40420',
  onReconnect: (attempt, lastLogId) => {
    console.log(`reconnect attempt ${attempt}, resuming from logId ${lastLogId}`)
  },
})

const reader = sub.connectionStatus.getReader()
while (true) {
  const { value, done } = await reader.read()
  if (done) break
  console.log('connection:', value)  // 'connected' | 'disconnected' | 'reconnecting'
}
```

## Error handling

```ts
import { createBobRpcClient, BobRpcError } from '@qubic.org/bob'

const bob = createBobRpcClient({ endpoint: 'http://localhost:40420', retries: 0 })

const result = await bob.getTickNumber()

if (!result.ok) {
  const e = result.error  // BobRpcError
  console.error(`JSON-RPC code ${e.jsonRpcCode}: ${e.message}`)
}
```

The subscription client can throw `BobSubscriptionError` when `onBufferOverflow: 'error'` and the consumer is too slow:

```ts
import { BobSubscriptionError } from '@qubic.org/bob'

try {
  for await (const event of sub.subscribeLogs()) {
    await slowProcess(event)
  }
} catch (e) {
  if (e instanceof BobSubscriptionError) {
    console.error('fell behind:', e.message)
  }
}
```

## Design notes

**`Result` instead of throw** — transport errors (timeouts, HTTP 5xx, JSON-RPC error objects) are represented as `Result<T, BobRpcError>`. Callers can handle success and failure in the same `if/else` without try/catch around every call.

**Automatic retries** — the JSON-RPC client retries failed HTTP requests up to `retries` times before returning an error. The WebSocket client reconnects with exponential backoff and resumes from the last `logId`.

**Three transports, one mental model** — RPC, REST, and WebSocket all use the same `Result` type and the same error hierarchy, so switching between them does not change error-handling patterns.

**Backpressure** — the subscription client buffers up to `bufferSize` events in memory. When the consumer is too slow it either drops events or throws, depending on `onBufferOverflow`.
