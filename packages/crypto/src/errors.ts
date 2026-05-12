export abstract class QubicCryptoError extends Error {
  abstract readonly code: string

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = this.constructor.name
    if ('captureStackTrace' in Error) {
      ;(Error as { captureStackTrace: (t: object, c: object) => void }).captureStackTrace(
        this,
        this.constructor,
      )
    }
  }
}

export class InvalidSeedError extends QubicCryptoError {
  readonly code = 'INVALID_SEED' as const

  constructor(
    readonly seed: string,
    options?: { cause?: unknown },
  ) {
    super(`Invalid seed: expected 55 lowercase letters, got "${seed}"`, options)
  }
}

export class InvalidIdentityError extends QubicCryptoError {
  readonly code = 'INVALID_IDENTITY' as const

  constructor(
    readonly identity: string,
    options?: { cause?: unknown },
  ) {
    super(`Invalid identity: expected 60 uppercase letters, got ${identity.length} chars`, options)
  }
}

export class SignatureVerificationError extends QubicCryptoError {
  readonly code = 'SIGNATURE_VERIFICATION_FAILED' as const

  constructor(options?: { cause?: unknown }) {
    super('Signature verification failed', options)
  }
}
