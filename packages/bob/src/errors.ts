import { QubicError } from '@qubic.ts/types'

function causedBy(options?: { cause?: unknown }) {
  return options?.cause !== undefined ? { cause: options.cause } : {}
}

export class BobRpcError extends QubicError {
  readonly code = 'BOB_RPC_ERROR' as const
  constructor(
    readonly jsonRpcCode: number,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, { jsonRpcCode, ...causedBy(options) })
  }
}

export class BobConnectionError extends QubicError {
  readonly code = 'BOB_CONNECTION_ERROR' as const
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, causedBy(options))
  }
}

export class BobSubscriptionError extends QubicError {
  readonly code = 'BOB_SUBSCRIPTION_ERROR' as const
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, causedBy(options))
  }
}
