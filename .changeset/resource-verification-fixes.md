---
"@qubic.org/types": patch
"@qubic.org/events": patch
---

- Fix `SystemInfo` to include all 128 bytes: add `targetTickVoteSignature`, `computorPacketSignature`, `solutionAdditionalThreshold`, and 3 reserve fields
- Fix `SpectrumStats` decoder to read full 224-byte struct including `entityCategoryPopulations[48]`
- Fix `TickVote` byte count comment (360 -> 352, matching C++ `static_assert`)
