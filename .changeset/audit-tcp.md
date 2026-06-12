---
"@qubic.org/tcp": major
---

- Complete `MESSAGE_TYPE` to 100% parity with upstream `network_message_type.h`
- Use crypto-random dejavu instead of deterministic counter
- Replace O(n²) buffer concatenation with chunked list
- Fix `cause` cast in error classes
