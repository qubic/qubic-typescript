import { QubicRpcError } from './errors.js'

export async function unwrap<T>(
  promise: Promise<{ data?: T; error?: unknown; response: Response }>,
  endpoint: string,
): Promise<T> {
  const { data, error, response } = await promise
  if (error !== undefined || !response.ok) {
    let detail = ''
    try {
      detail = await response.text()
    } catch {
      // ignore — body already consumed or unavailable
    }
    throw new QubicRpcError(response.status, endpoint, detail || undefined)
  }
  return data as T
}

/** Spreads `signal` only when defined, avoiding `exactOptionalPropertyTypes` conflict. */
export function sig(
  signal: AbortSignal | undefined,
): { signal: AbortSignal } | Record<never, never> {
  return signal ? { signal } : {}
}
