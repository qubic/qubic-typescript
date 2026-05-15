import { QubicError } from '@qubic.org/types'

export class WalletError extends QubicError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'WalletError'
  }
}

export class VaultDecryptionError extends WalletError {
  constructor(options?: { cause?: unknown }) {
    super('Vault decryption failed: wrong password or corrupt data', options)
    this.name = 'VaultDecryptionError'
  }
}

export class InvalidVaultError extends WalletError {
  constructor(reason: string) {
    super(`Invalid vault: ${reason}`)
    this.name = 'InvalidVaultError'
  }
}
