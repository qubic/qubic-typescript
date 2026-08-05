# @qubic.org/vault

## 1.2.1

### Patch Changes

- d97c418: fix v1 vault migration so legacy encrypted seeds are decrypted and preserved during unlock and upgrade, and restore adding seeds to existing vaults. watch-only accounts, which are stored without seed material, no longer fail to unlock.

## 1.2.0

### Minor Changes

- 3fda5de: Add addSeed method and expand README

  - Add addSeed method to VaultManager for adding seeds to existing vaults
  - Add addSeed example to README
  - Add multiple seeds with aliases example
  - Add error handling section
  - Add full API reference

## 1.1.0

### Minor Changes

- d051086: Simplify vault by removing RSA-OAEP seed encryption

  - Seeds stored directly in vault payload (encrypted by AES-256-GCM)
  - Remove RSA key pair generation and wrapping
  - Faster vault creation, simpler code

## 1.0.1

### Patch Changes

- 77508c0: Add @qubic.org/vault package with Argon2id key derivation and binary envelope format.

  - New vault library with v3 format (Argon2id + AES-256-GCM)
  - Backward compatibility with v1 vaults (PBKDF2)
  - Automatic version detection and upgrade path
