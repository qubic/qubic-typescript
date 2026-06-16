---
'@qubic.org/events': patch
'@qubic.org/crypto': patch
---

- **events**: Fix `decodeSpectrumStats` minimum payload size from 224 to 220 bytes (u64+u64+u64+u32+48×u32 = 220)
- **crypto**: Export `deriveKeys` and `DerivedKeys` type from package index
