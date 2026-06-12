---
"@qubic.org/tx": major
---

- Rename `TransactionInput.sourcePublicKey`/`destinationPublicKey` to `source`/`destination`, now accept `Identity | Uint8Array`
- Throw `InvalidIdentityError` when source/destination is a non-identity string instead of silent miscast
- Remove `PK_SIZE`/`SIG_SIZE`/`HEADER_SIZE` aliases; use `PROTOCOL.*` constants directly
