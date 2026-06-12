---
'@qubic.org/registry': patch
---

Improve the backfill script with a `--catch-up` mode that queries the live RPC for the current epoch, refreshes stale cached epoch refs when needed, and records epoch/tag mappings through epoch 217.
