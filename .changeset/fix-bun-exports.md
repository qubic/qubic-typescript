---
"@qubic.org/bob": patch
"@qubic.org/contracts": patch
"@qubic.org/crypto": patch
"@qubic.org/registry": patch
"@qubic.org/rpc": patch
"@qubic.org/tx": patch
"@qubic.org/types": patch
"@qubic.org/wallet": patch
---

Point the `bun` export condition to `dist/index.js` instead of `src/index.ts` so packages resolve correctly when installed from npm.
