---
"@qubic.org/types": patch
"@qubic.org/crypto": patch
"@qubic.org/tx": patch
"@qubic.org/rpc": patch
"@qubic.org/bob": patch
"@qubic.org/registry": patch
"@qubic.org/wallet": patch
"@qubic.org/events": patch
"@qubic.org/tcp": patch
"@qubic.org/contracts": patch
"@qubic.org/react": patch
---

Add `main` and `types` fields to all packages. This allows tools using `moduleResolution: "node"` (e.g. Angular 16) to resolve the packages without requiring `paths` overrides in tsconfig.
