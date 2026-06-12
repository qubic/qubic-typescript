---
"@qubic.org/bob": major
---

- Rename `BobTickData` to `BobIndexedTick` with complete fields from upstream OpenAPI
- Complete `BobTransaction` fields
- Centralize default base URL to `DEFAULT_BOB_BASE_URL`
- Validate identity format and bigint-convertibility in RPC responses
- Re-export `Result` type from `@qubic.org/types` instead of local copy
