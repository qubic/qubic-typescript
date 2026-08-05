---
"@qubic.org/vault": patch
---

fix v1 vault migration so legacy encrypted seeds are decrypted and preserved during unlock and upgrade, and restore adding seeds to existing vaults. watch-only accounts, which are stored without seed material, no longer fail to unlock.
