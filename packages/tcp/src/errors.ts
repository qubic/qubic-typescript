import { QubicError } from '@qubic.ts/types'

export class QubicTcpError extends QubicError {
  override readonly code: string = 'TCP_ERROR'
}

export class QubicTcpConnectionError extends QubicTcpError {
  override readonly code = 'TCP_CONNECTION_ERROR' as const

  constructor(
    readonly hostname: string,
    message: string,
    cause?: unknown,
  ) {
    super(`TCP connection to ${hostname} failed: ${message}`, {
      cause: cause as Record<string, unknown>,
    })
  }
}

export class QubicTcpTimeoutError extends QubicTcpError {
  override readonly code: string = 'TCP_TIMEOUT'

  constructor(
    readonly hostname: string,
    readonly timeoutMs: number,
  ) {
    super(`TCP request to ${hostname} timed out after ${timeoutMs}ms`)
  }
}
