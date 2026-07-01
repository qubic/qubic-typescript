export { generateSeed, validateSeed, toSeed } from './seed-utils.js'
export { createWallet } from './wallet.js'
export type { SignedTransaction, TransactionParams, ContractCallParams, Wallet } from './wallet.js'
export {
  createVault,
  unlockVault,
  addToVault,
  exportVault,
  importVault,
  upgradeVault,
  getVaultVersion,
} from './vault.js'
export type { VaultData } from './vault.js'
export { WalletError, VaultDecryptionError, InvalidVaultError } from './errors.js'
