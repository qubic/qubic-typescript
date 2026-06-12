---
"@qubic.org/events": major
---

- `decodeEvent` now accepts transport-agnostic `RawQubicLogEvent` instead of `BobLogEvent`
- Add `CustomMessageData` discriminated union with protocol subtypes (epoch start/end, dividend distribution)
- Subscription helpers now pass log types to Bob filter for server-side filtering
- Document `toBobFilter()` single-logType limitation
