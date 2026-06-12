---
"@qubic.org/types": major
---

- Remove `TICKS_TO_EXPIRY` from `PROTOCOL` (not a protocol constant)
- Remove `SignatureVerificationError` (was unused)
- Add `Result<T,E>`, `ok()`, `err()` shared across bob/rpc/contracts
- Add `CurrentTickInfo`, `EntityRecord`, `RespondEntity`, `ExchangePublicPeers`, `TickData`, `TickVote`, `SystemInfo`, `Computors`, `TransactionHeader`, `RequestResponseHeader`, `ContractIPO`, `RequestedQuorumTick` protocol interfaces
- Add `CUSTOM_MESSAGE_OP` constants and `CustomMessageSubtype` discriminated union for epoch/dividend protocol events
- Add `isValidIdentityChecksum` type guard for full Qubic identity checksum validation
