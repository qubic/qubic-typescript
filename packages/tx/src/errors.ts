import { PROTOCOL, QubicError } from '@qubic.ts/types'

export { QubicError } from '@qubic.ts/types'

export class PayloadTooLargeError extends QubicError {
  readonly code = 'PAYLOAD_TOO_LARGE' as const

  constructor(readonly byteLength: number) {
    super(`Payload is ${byteLength} bytes; maximum allowed is ${PROTOCOL.MAX_INPUT_SIZE}`, {
      byteLength,
      max: PROTOCOL.MAX_INPUT_SIZE,
    })
  }
}

export class TickInThePastError extends QubicError {
  readonly code = 'TICK_IN_THE_PAST' as const

  constructor(
    readonly targetTick: number,
    readonly currentTick: number,
  ) {
    super(`targetTick ${targetTick} must be greater than currentTick ${currentTick}`, {
      targetTick,
      currentTick,
    })
  }
}

export class InvalidTransactionError extends QubicError {
  readonly code = 'INVALID_TRANSACTION' as const

  constructor(reason: string) {
    super(`Invalid transaction: ${reason}`)
  }
}
