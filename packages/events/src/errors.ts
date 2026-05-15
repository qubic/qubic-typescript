import { QubicError } from '@qubic.ts/types'

export class EventDecodeError extends QubicError {
  override readonly code: string = 'EVENT_DECODE_ERROR'

  constructor(
    readonly logType: number,
    message: string,
    cause?: unknown,
  ) {
    super(`Failed to decode event (logType=${logType}): ${message}`, { cause })
  }
}
