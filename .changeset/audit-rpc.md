---
"@qubic.org/rpc": major
---

- Add nullish checks before casting API response fields
- `waitForTick` retries on transient errors instead of failing immediately
- Add `getBlockHeight()` (deprecated, wraps `getTickInfo()`)
- Re-export `Result` type from `@qubic.org/types` instead of local copy
