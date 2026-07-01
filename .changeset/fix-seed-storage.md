---
"@qubic.org/vault": minor
"@qubic.org/wallet": minor
---

Add RSA-OAEP seed encryption in vault

- Generate RSA-OAEP 4096-bit key pair per vault
- Encrypt each seed with RSA public key
- Wrap RSA private key with vault's wrap_key (HKDF derived)
- Seeds are now double-encrypted: RSA-OAEP + AES-256-GCM