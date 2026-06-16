---
'@qubic.org/registry': patch
---

Fix payload encoding for signed integer types: `sint8` now uses `setInt8`, `sint16` uses `setInt16`, `sint32` uses `setInt32` instead of their unsigned counterparts. While two's complement makes the bit patterns identical for current JS engines, the signed setters are semantically correct and future-proof.
