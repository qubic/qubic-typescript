---
"@qubic.org/rpc": patch
---

Remove `.d.ts` extension from openapi-schema imports in live-client and query-client. The extension caused `Cannot find module` errors when consuming the package in projects using `moduleResolution: "bundler"` (required for Angular 17+ and other modern bundler setups).
