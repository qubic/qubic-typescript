import { QubicError } from '@qubic.org/types'

export { InvalidIdentityError, InvalidSeedError, QubicError } from '@qubic.org/types'

export class SignatureVerificationError extends QubicError {
  readonly code = 'SIGNATURE_VERIFICATION_FAILED' as const

  constructor() {
    super('Signature verification failed')
  }
}
