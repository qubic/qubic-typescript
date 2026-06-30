export class VaultError extends Error {
  readonly code: string = 'VAULT_ERROR'

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'VaultError'
  }
}

export class VaultDecryptionError extends VaultError {
  override readonly code = 'VAULT_DECRYPTION_FAILED' as const

  constructor(options?: { cause?: unknown }) {
    super('Vault decryption failed: wrong password or corrupt data', options)
    this.name = 'VaultDecryptionError'
  }
}

export class InvalidVaultError extends VaultError {
  override readonly code = 'INVALID_VAULT' as const

  constructor(reason: string) {
    super(`Invalid vault: ${reason}`)
    this.name = 'InvalidVaultError'
  }
}
