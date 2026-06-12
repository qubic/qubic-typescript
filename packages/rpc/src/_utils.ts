import { err, ok } from '@qubic.org/types'
import type { Result } from '@qubic.org/types'
import { QubicRpcError } from './errors.js'

export async function unwrap<T>(
  promise: Promise<{ data?: T; error?: unknown; response: Response }>,
  endpoint: string,
): Promise<Result<T, QubicRpcError>> {
  try {
    const { data, error, response } = await promise
    if (error !== undefined || !response.ok) {
      let detail = ''
      try {
        detail = await response.text()
      } catch {
        // ignore — body already consumed or unavailable
      }
      return err(new QubicRpcError(response.status, endpoint, detail || undefined))
    }
    return ok(data as T)
  } catch (e) {
    if (e instanceof QubicRpcError) return err(e)
    return err(new QubicRpcError(-1, endpoint, String(e)))
  }
}

/** Spreads `signal` only when defined, avoiding `exactOptionalPropertyTypes` conflict. */
export function sig(
  signal: AbortSignal | undefined,
): { signal: AbortSignal } | Record<never, never> {
  return signal ? { signal } : {}
}
