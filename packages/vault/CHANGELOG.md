# @qubic.org/vault

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
