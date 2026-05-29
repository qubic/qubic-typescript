---
"@qubic.org/registry": patch
"@qubic.org/contracts": patch
---

Add ABI snapshots and contract wrappers for epochs 214–215. QVAULT changed in epoch 214 (v1.292.0), Qswap changed in epoch 215 (v1.293.1). Fix backfill script to pre-seed prior state so single-epoch runs only write snapshots for contracts with ABI changes.
