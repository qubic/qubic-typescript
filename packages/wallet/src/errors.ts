import { QubicError } from '@qubic.org/types'

export class WalletError extends QubicError {
  readonly code: string = 'WALLET_ERROR'

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'WalletError'
  }
}

export class VaultDecryptionError extends WalletError {
  override readonly code = 'VAULT_DECRYPTION_FAILED' as const

  constructor(options?: { cause?: unknown }) {
    super('Vault decryption failed: wrong password or corrupt data', options)
    this.name = 'VaultDecryptionError'
  }
}

export class InvalidVaultError extends WalletError {
  override readonly code = 'INVALID_VAULT' as const

  constructor(reason: string) {
    super(`Invalid vault: ${reason}`)
    this.name = 'InvalidVaultError'
  }
}
