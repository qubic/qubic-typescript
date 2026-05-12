import { QubicError } from '@qubic.ts/types'

export { InvalidIdentityError, InvalidSeedError, QubicError } from '@qubic.ts/types'

export class SignatureVerificationError extends QubicError {
  readonly code = 'SIGNATURE_VERIFICATION_FAILED' as const

  constructor() {
    super('Signature verification failed')
  }
}
