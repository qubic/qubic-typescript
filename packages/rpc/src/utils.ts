import { QubicRpcError } from './errors.js'
import type { LiveClient, LiveClientOptions } from './live-client.js'
import { createLiveClient } from './live-client.js'
import { createQueryClient } from './query-client.js'
import type { QueryClient, QueryClientOptions } from './query-client.js'
import { err } from './result.js'
import type { Result } from './result.js'

export interface QubicClient {
  live: LiveClient
  archive: QueryClient
}

export interface QubicClientOptions {
  liveBaseUrl?: string
  archiveBaseUrl?: string
  signal?: AbortSignal
  fetch?: (input: Request) => Promise<Response>
}

/** Creates both a live and archive client in a single call. */
export function createQubicClient(options: QubicClientOptions = {}): QubicClient {
  const shared: Pick<LiveClientOptions & QueryClientOptions, 'signal' | 'fetch'> = {
    ...(options.signal !== undefined ? { signal: options.signal } : {}),
    ...(options.fetch !== undefined ? { fetch: options.fetch } : {}),
  }
  return {
    live: createLiveClient({
      ...shared,
      ...(options.liveBaseUrl !== undefined ? { baseUrl: options.liveBaseUrl } : {}),
    }),
    archive: createQueryClient({
      ...shared,
      ...(options.archiveBaseUrl !== undefined ? { baseUrl: options.archiveBaseUrl } : {}),
    }),
  }
}

export interface PollOptions {
  /** How often to check tick in milliseconds. Default: 1000 */
  intervalMs?: number
  /** Maximum wait in milliseconds before returning a timeout error. Default: 60000 */
  timeoutMs?: number
  signal?: AbortSignal
}

/**
 * Waits until the live node tick reaches or exceeds `targetTick`.
 * Returns `ok(targetTick)` when confirmed or `err` on timeout / cancellation.
 */
export async function waitForTick(
  live: LiveClient,
  targetTick: number,
  options: PollOptions = {},
): Promise<Result<number, QubicRpcError>> {
  const { intervalMs = 1_000, timeoutMs = 60_000, signal } = options
  const deadline = Date.now() + timeoutMs

  while (true) {
    if (signal?.aborted) return err(new QubicRpcError(-1, 'waitForTick', 'Aborted'))
    if (Date.now() >= deadline) return err(new QubicRpcError(-1, 'waitForTick', 'Timed out'))

    const r = await live.getTickInfo(signal !== undefined ? { signal } : undefined)
    if (!r.ok) return r
    if ((r.value.tick ?? 0) >= targetTick) return { ok: true, value: targetTick }

    await delay(intervalMs, signal)
  }
}

/**
 * Waits until the live node tick passes `targetTick`, confirming transaction inclusion.
 * Returns `ok(targetTick)` when confirmed or `err` on timeout / cancellation.
 */
export async function pollUntilConfirmed(
  live: LiveClient,
  targetTick: number,
  options: PollOptions = {},
): Promise<Result<number, QubicRpcError>> {
  return waitForTick(live, targetTick + 1, options)
}

/**
 * Returns `currentTick + offsetTicks` as the recommended target tick for a transaction.
 * @param currentTick - The current tick from `getTickInfo`.
 * @param offsetTicks - Ticks ahead to target. Default: 5.
 */
export function estimateTargetTick(currentTick: number, offsetTicks = 5): number {
  return currentTick + offsetTicks
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(id)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}
