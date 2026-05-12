import { QubicError } from '@qubic.ts/types'

export { QubicError } from '@qubic.ts/types'

export class QubicRpcError extends QubicError {
  readonly code = 'RPC_ERROR' as const

  constructor(
    readonly status: number,
    readonly endpoint: string,
    message?: string,
  ) {
    super(message ?? `RPC request failed: HTTP ${status} on ${endpoint}`, {
      status,
      endpoint,
    })
  }
}
