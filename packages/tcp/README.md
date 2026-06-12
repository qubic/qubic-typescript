# @qubic.org/tcp

Raw TCP transport for direct Qubic peer connections.

## Overview

`@qubic.org/tcp` implements the binary framing protocol used to communicate directly with Qubic nodes over TCP. It manages connection lifecycle, request serialization, and response parsing — returning typed results without requiring the HTTP gateway.

**Use this when you need:**
- Direct peer access (custom indexers, validators, CLI tools)
- Lower latency than HTTP round-trips
- Environments where the RPC gateway is unavailable

## Installation

```bash
bun add @qubic.org/tcp
```

## Dependencies

- `@qubic.org/types` — shared primitives and branded types
- `@qubic.org/crypto` — public key → identity conversion

## API

### Single connection

```ts
import { createNodeConnection, requestCurrentTickInfo, requestEntity } from '@qubic.org/tcp'
import { identityToPublicKey } from '@qubic.org/crypto'

const conn = await createNodeConnection('node1.qubic.org')

// Current tick
const tick = await requestCurrentTickInfo(conn)
console.log(tick.epoch, tick.tick, tick.initialTick)

// Entity balance
const pk = identityToPublicKey('BZBQFLLBNCXEMGLOBHUVFTLUPLVCPQUASSILFABOFFBCADQSSUPNWLZBQEXK')
const { entity, identity } = await requestEntity(conn, pk)
console.log(identity, entity.incomingAmount - entity.outgoingAmount)

conn.close()
```

### Connection pool

```ts
import { createNodePool, requestCurrentTickInfo } from '@qubic.org/tcp'

const pool = createNodePool([
  'node1.qubic.org',
  'node2.qubic.org',
  'node3.qubic.org',
])

// Automatically retries on other peers if one fails
const tick = await requestCurrentTickInfo(pool)

pool.close()
```

### Broadcast a transaction

```ts
import { createNodeConnection, broadcastTransaction } from '@qubic.org/tcp'

const conn = await createNodeConnection('node1.qubic.org')
await broadcastTransaction(conn, signedTxBytes)
conn.close()
```

### AbortSignal support

```ts
const ac = new AbortController()
setTimeout(() => ac.abort(), 3000)

const tick = await requestCurrentTickInfo(conn, { signal: ac.signal })
```

## Protocol

Qubic TCP uses 8-byte length-prefixed frames:

```
[size: 3 bytes LE] [type: 1 byte] [dejavu: 4 bytes LE] [payload: size-8 bytes]
```

- **dejavu** — a cryptographically random non-zero `uint32` generated per request. Pass `0` explicitly for broadcast semantics (forwarded to peers). When omitted, `encodeHeader` auto-generates a random value via `crypto.randomBytes`.
- Requests are serialised per connection — only one is in flight at a time.
- The node responds with zero or more typed packets followed by an `END_RESPONSE` (type 35).
- A `TRY_AGAIN` (type 54) response causes an automatic 1-second retry.

`MESSAGE_TYPE` covers all entries from the upstream `network_message_type.h`, including log queries, asset queries, oracle data, custom mining, tx status (addon), and special commands.

## Low-level access

```ts
import { createNodeConnection, MESSAGE_TYPE } from '@qubic.org/tcp'

const conn = await createNodeConnection('node1.qubic.org')
const packets = await conn.request(MESSAGE_TYPE.REQUEST_CURRENT_TICK_INFO)
// packets: Uint8Array[] — raw response payloads before END_RESPONSE
```

## Options

```ts
createNodeConnection('node1.qubic.org', {
  port: 21841,      // default
  timeoutMs: 10000, // default
})

createNodePool(['node1.qubic.org', 'node2.qubic.org'], {
  port: 21841,
  timeoutMs: 10000,
  maxRetries: 3,    // default: peers.length
})
```

## See also

- [`@qubic.org/rpc`](../rpc) — REST gateway client (higher-level, no raw TCP)
- [`@qubic.org/tx`](../tx) — transaction builder and signer
- [`@qubic.org/crypto`](../crypto) — key derivation and identity conversion
