---
"@qubic.org/registry": patch
"@qubic.org/contracts": patch
---

Add ABI snapshots and contract wrappers for epoch 214 (v1.292.0). QVAULT ABI changed; all other contracts unchanged. Fix backfill script to pre-seed prior state so single-epoch runs only write snapshots for contracts with ABI changes.
