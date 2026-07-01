---
"@qubic.org/vault": minor
"@qubic.org/wallet": minor
---

Simplify vault by removing RSA-OAEP seed encryption

- Seeds stored directly in vault payload (encrypted by AES-256-GCM)
- Remove RSA key pair generation and wrapping
- Faster vault creation, simpler code