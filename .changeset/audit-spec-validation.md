---
'@qubic.org/rpc': patch
'@qubic.org/bob': patch
'@qubic.org/crypto': patch
---

Fix package implementations against network specs and reference resource files.

- **rpc**: Add missing `getContractIpoBids` endpoint (`GET /ipos/{contractIndex}/bids`) with `IpoBid`/`IpoBidData` types
- **bob**: Fix `querySmartContract` params (add missing nonce, correct arg shape), add `getTransactionReceipt` method, rename `contractIndex` to `scIndex` in `BobLogFilter`/`BobFindLogFilter` to match core spec
- **crypto**: Rename `bytesToBigIntBE` to `bytesToBigIntLE` to reflect correct little-endian semantics
