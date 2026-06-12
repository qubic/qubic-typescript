---
"@qubic.org/react": major
---

- Replace connector `unknown` types with typed `TransactionRequest` interface
- Type `on()` event callbacks per event
- Close IndexedDB connections in `finally` blocks to prevent leaks
- Add runtime `archiveClient` null guards in query hooks
- Export `TransactionRequest`, `SignTransactionResult`, `SendTransactionResult`, `SignMessageResult`
