export enum TaintStatus {
  UNTAINTED = 0,
  TAINTED = 1,
}

export interface AlgorithmParams {
  memory: number
  iterations: number
  parallelism: number
}

export interface AddressBookEntry {
  identity: string
  label: string
  createdAt: string
}

export const DEFAULT_ARGON2_PARAMS: AlgorithmParams = {
  memory: 65536, // 64 MB
  iterations: 3,
  parallelism: 4,
}

export const VERSION_BYTE_V3 = 0x03
export const MIN_VAULT_LENGTH = 61 // 1 + 32 + 12 + 16 + 0 (empty ciphertext)