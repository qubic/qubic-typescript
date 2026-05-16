---
"@qubic.org/rpc": patch
---

Copy `live-schema.d.ts` and `query-schema.d.ts` to `dist/` during build. These openapi-generated type files were missing from the published package, causing `Cannot find module './live-schema'` errors in consumers using `moduleResolution: "node"`.
