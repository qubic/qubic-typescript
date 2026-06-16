---
'@qubic.org/types': patch
'@qubic.org/bob': patch
---

- **types**: Add `GGWP` (index 28) to `CONTRACT_INDEX` constant to match `smart_contracts.json`
- **bob**: Add missing JSON-RPC methods: `getClientVersion`, `getSyncing`, `getStatus`, `sendRawTransaction`, `getTickByHash` with `BobSyncStatus` and `BobRpcStatus` types
