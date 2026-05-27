---
"@qubic.org/crypto": patch
---

Fix signature malleability: remove weak S < 2^246 bit-mask guard and rely solely on the strict S < curve_order check. Signatures with non-canonical scalars (S in [r, 2^246)) are now correctly rejected, closing the double-spend vector where S' = S + r would verify for the same message.
