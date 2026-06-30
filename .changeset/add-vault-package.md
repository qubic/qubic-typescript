---
"@qubic.org/vault": minor
"@qubic.org/wallet": minor
---

Add @qubic.org/vault package with Argon2id key derivation and binary envelope format.

- New vault library with v3 format (Argon2id + AES-256-GCM)
- Backward compatibility with v1 vaults (PBKDF2)
- Automatic version detection and upgrade path
- Wallet package now delegates vault operations to @qubic.org/vault
- Added upgradeVault() and getVaultVersion() to wallet exports