---
"@qubic.org/types": major
"@qubic.org/crypto": major
"@qubic.org/tx": major
"@qubic.org/bob": major
"@qubic.org/events": major
"@qubic.org/wallet": major
"@qubic.org/tcp": major
"@qubic.org/rpc": major
"@qubic.org/registry": major
"@qubic.org/contracts": major
"@qubic.org/react": major
---

Full audit: breaking changes across all packages.

**@qubic.org/tx**
- `TransactionInput.sourcePublicKey` / `destinationPublicKey` renamed to `source` / `destination`, now accept `Identity | Uint8Array`
- Invalid identity strings now throw `InvalidIdentityError` instead of silent miscast
- Removed `PK_SIZE`/`SIG_SIZE`/`HEADER_SIZE` aliases; uses `PROTOCOL.*` constants directly

**@qubic.org/bob**
- `BobTickData` renamed to `BobIndexedTick` with complete fields from upstream OpenAPI
- `BobTransaction` fields completed
- Default base URL centralized to `DEFAULT_BOB_BASE_URL`
- RPC responses now validate identity format and bigint-convertibility

**@qubic.org/wallet**
- `TransferParams` renamed to `TransactionParams`
- `ScTransactionParams` renamed to `ContractCallParams`
- Vault JSON parse now validates seeds are strings

**@qubic.org/events**
- `decodeEvent` now accepts transport-agnostic `RawQubicLogEvent` instead of `BobLogEvent`
- Added `CustomMessageData` discriminated union with protocol subtypes (epoch start/end, dividend distribution)
- Subscription helpers now pass log types to Bob filter for server-side filtering

**@qubic.org/tcp**
- `MESSAGE_TYPE` completed to 100% parity with upstream `network_message_type.h`
- Dejavu field now uses crypto-random values instead of deterministic counter
- Buffer concatenation changed from O(n²) to chunked list

**@qubic.org/types**
- `TICKS_TO_EXPIRY` removed from `PROTOCOL` (not a protocol constant)
- `SignatureVerificationError` removed (was unused)
- Added `Result<T,E>` type (shared across bob/rpc/contracts)
- Added `CurrentTickInfo`, `EntityRecord`, `RespondEntity`, `ExchangePublicPeers`, `TickData`, `TickVote`, `SystemInfo`, `Computors`, `TransactionHeader`, `RequestResponseHeader`, `ContractIPO`, `RequestedQuorumTick`
- Added `CUSTOM_MESSAGE_OP` constants and `CustomMessageSubtype` discriminated union

**@qubic.org/crypto**
- Added `isValidIdentityChecksum()` for full checksum validation
- Renamed internal `bytesToBigInt` to `bytesToBigIntLE`/`bytesToBigIntBE` for endianness clarity

**@qubic.org/rpc**
- API responses now validated with nullish checks before casting
- `waitForTick` retries on transient errors instead of failing immediately
- Added `getBlockHeight()` (deprecated, wraps `getTickInfo()`)

**@qubic.org/react**
- Connector `unknown` types replaced with typed `TransactionRequest` interface
- `on()` event callbacks now typed per event
- IndexedDB connections closed in `finally` blocks to prevent leaks
- Runtime `archiveClient` null guards in query hooks
- Added `TransactionRequest`, `SignTransactionResult`, `SendTransactionResult`, `SignMessageResult` exports

**@qubic.org/registry**
- Fetched registry JSON now validated with `validateRegistry()`
- `buildPayloadManual` throws explicit error for `id` type fields

**@qubic.org/contracts**
- Decoded output validated before casting to `TOutput`
- `Result` type now imported from `@qubic.org/types` (shared)
- GGWP contract ABI added
