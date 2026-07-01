# @qubic.org/vault

## 1.0.1

### Patch Changes

- 77508c0: Add @qubic.org/vault package with Argon2id key derivation and binary envelope format.

  - New vault library with v3 format (Argon2id + AES-256-GCM)
  - Backward compatibility with v1 vaults (PBKDF2)
  - Automatic version detection and upgrade path
