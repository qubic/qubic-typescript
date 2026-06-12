# @qubic.org/events

Typed event decoding, filter builder, and subscription helpers for Qubic log events.

## Overview

`@qubic.org/events` sits above the raw log APIs in `@qubic.org/bob`, which return opaque base64 payloads, and provides a fully typed decoding layer over them. It handles all 17 Qubic log types using the exact C++ struct layouts from the core node.

## Installation

```bash
bun add @qubic.org/events
```

## Dependencies

- `@qubic.org/types` — `LOG_TYPE`, `LogType`, `Identity`, `Base64`
- `@qubic.org/crypto` — public key → identity conversion for binary payloads
- `@qubic.org/bob` — only required for the optional subscription helpers

## Decoding a raw event

```ts
import { decodeEvent, LOG_TYPE } from '@qubic.org/events'
import type { RawQubicLogEvent } from '@qubic.org/events'

const rawEvent: RawQubicLogEvent = bobLogEvent
const typed = decodeEvent(rawEvent)

if (typed.logType === LOG_TYPE.QU_TRANSFER) {
  console.log(typed.data.source)       // Identity (60-char string)
  console.log(typed.data.destination)
  console.log(typed.data.amount)       // bigint
}
```

## Subscription helpers

```ts
import { subscribeQuTransfers, subscribeAssetEvents, subscribeContractLogs, subscribeAllEvents } from '@qubic.org/events'
import { createBobSubscriptionClient } from '@qubic.org/bob'

const bob = createBobSubscriptionClient({ wsUrl: 'wss://bob.qubic.org/v1/ws' })

// Typed QU transfers for a specific identity
for await (const event of subscribeQuTransfers(bob, { identity: myId })) {
  const { source, destination, amount } = event.data.data
  console.log(`${source} → ${destination}: ${amount}`)
}

// All asset events (issuance, ownership, possession changes)
for await (const event of subscribeAssetEvents(bob)) {
  console.log(event.data.logType, event.data.data)
}

// SC log messages for a specific contract
for await (const event of subscribeContractLogs(bob, { contractIndex: 9 })) {
  console.log(event.data.data.contractMessageType)
}

// All events, decoded
for await (const event of subscribeAllEvents(bob)) {
  console.log(event.data.logType, event.data.tick)
}
```

## Filter builder

```ts
import { eventFilter, LOG_TYPE } from '@qubic.org/events'

const filter = eventFilter()
  .forIdentity(myIdentity)
  .ofTypes(LOG_TYPE.QU_TRANSFER, LOG_TYPE.BURNING)
  .fromTick(25_000_000)
  .build()

// Convert to BobLogFilter for direct use with bob.subscribeLogs()
const bobFilter = eventFilter()
  .forContract(9)
  .ofTypes(LOG_TYPE.CONTRACT_ERROR_MESSAGE)
  .toBobFilter()
```

## Supported log types

All 17 log types from the Qubic protocol are decoded with fully typed data interfaces:

| Type | Constant | Data interface |
|------|----------|----------------|
| 0 | `QU_TRANSFER` | `QuTransferData` |
| 1 | `ASSET_ISSUANCE` | `AssetIssuanceData` |
| 2 | `ASSET_OWNERSHIP_CHANGE` | `AssetOwnershipChangeData` |
| 3 | `ASSET_POSSESSION_CHANGE` | `AssetPossessionChangeData` |
| 4–7 | `CONTRACT_{ERROR,WARNING,INFORMATION,DEBUG}_MESSAGE` | `SmartContractMessageData` |
| 8 | `BURNING` | `BurningData` |
| 9 | `DUST_BURNING` | `DustBurningData` |
| 10 | `SPECTRUM_STATS` | `SpectrumStatsData` |
| 11 | `ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE` | `AssetOwnershipManagingContractChangeData` |
| 12 | `ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE` | `AssetPossessionManagingContractChangeData` |
| 13 | `CONTRACT_RESERVE_DEDUCTION` | `ContractReserveDeductionData` |
| 14 | `ORACLE_QUERY_STATUS_CHANGE` | `OracleQueryStatusData` |
| 15 | `ORACLE_SUBSCRIBER_LOG_MESSAGE` | `OracleSubscriberLogMessageData` |
| 255 | `CUSTOM_MESSAGE` | `CustomMessageData` (discriminated union) |

### CustomMessage subtypes

`CUSTOM_MESSAGE` (log type 255) is a discriminated union. The `kind` field tells you which subtype was decoded:

| `kind` | Op code | Meaning |
|--------|---------|---------|
| `startEpoch` | `STA_EPOC` | Epoch started — first log of the epoch |
| `endEpoch` | `END_EPOC` | Epoch ended — last log of the epoch |
| `startDistributeDividends` | `STA_DDIV` | Dividend distribution started |
| `endDistributeDividends` | `END_DDIV` | Dividend distribution ended |
| `unknown` | *(any other)* | Unknown subtype — carries `messageType` (bigint) and `payload` (Uint8Array) |

The op codes are defined as `CUSTOM_MESSAGE_OP` in `@qubic.org/types` and re-exported from this package.

```ts
import { decodeEvent, LOG_TYPE, CUSTOM_MESSAGE_OP } from '@qubic.org/events'

const event = decodeEvent(rawEvent)
if (event.logType === LOG_TYPE.CUSTOM_MESSAGE) {
  switch (event.data.kind) {
    case 'startEpoch':
      console.log('Epoch started at tick', event.tick)
      break
    case 'endDistributeDividends':
      console.log('Dividends distributed')
      break
    case 'unknown':
      console.log('Unknown custom message', event.data.messageType)
      console.log('Extra payload bytes', event.data.payload.length)
      break
  }
}
```

## See also

- [`@qubic.org/bob`](../bob) — WebSocket subscription client that produces `BobLogEvent`
- [`@qubic.org/rpc`](../rpc) — archive query client for historical event logs
- [`@qubic.org/types`](../types) — `LOG_TYPE` constants and `LogType` union
