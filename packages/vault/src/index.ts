export { VaultManager } from './vault-manager.js'
export { VaultError, VaultDecryptionError, InvalidVaultError } from './errors.js'
export type {
  VaultPayload,
  SeedEntry,
  VaultMetadata,
} from './models/vault-payload.js'
export type { TaintStatus, AlgorithmParams, AddressBookEntry } from './models/types.js'
export { TaintStatus as TaintStatusEnum } from './models/types.js'
export { DEFAULT_ARGON2_PARAMS, VERSION_BYTE_V3, MIN_VAULT_LENGTH } from './models/types.js'
