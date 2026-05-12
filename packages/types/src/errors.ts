export abstract class QubicError extends Error {
  abstract readonly code: string
  readonly context?: Record<string, unknown>

  constructor(message: string, context?: Record<string, unknown>) {
    super(message)
    this.name = this.constructor.name
    if (context !== undefined) this.context = context
    if ('captureStackTrace' in Error) {
      ;(Error as { captureStackTrace: (t: object, c: object) => void }).captureStackTrace(
        this,
        this.constructor,
      )
    }
  }
}

export class InvalidIdentityError extends QubicError {
  readonly code = 'INVALID_IDENTITY' as const

  constructor(readonly identity: string) {
    super(`Invalid identity: expected 60 uppercase letters, got ${identity.length} chars`)
  }
}

export class InvalidSeedError extends QubicError {
  readonly code = 'INVALID_SEED' as const

  constructor(readonly seed: string) {
    super('Invalid seed: expected 55 lowercase letters')
  }
}

export class InvalidTxHashError extends QubicError {
  readonly code = 'INVALID_TX_HASH' as const

  constructor(readonly hash: string) {
    super('Invalid tx hash: expected 60 lowercase letters')
  }
}

export class InvalidBase64Error extends QubicError {
  readonly code = 'INVALID_BASE64' as const

  constructor(readonly value: string) {
    super('Invalid base64 string')
  }
}
