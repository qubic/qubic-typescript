---
"@qubic.org/contracts": patch
"@qubic.org/registry": patch
---

Fix inputType values for all contract procedures and functions. The ABI parser was deriving inputType by counting `_input` struct declarations in source order, which produced wrong values (e.g. `GetFees` was 31 instead of 8) because internal and state structs shifted the ordinals. The parser now reads the registered number directly from `REGISTER_USER_FUNCTION` / `REGISTER_USER_PROCEDURE` macros, which are the authoritative source in the contract headers.
