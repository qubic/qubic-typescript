import { describe, expect, test } from 'bun:test'
import { QubicRpcError } from '../errors.js'
import { createLiveClient } from '../live-client.js'
import { createQubicClient, estimateTargetTick, pollUntilConfirmed, waitForTick } from '../utils.js'

function mockFetch(body: unknown, status = 200): (input: Request) => Promise<Response> {
  return async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
}

describe('createQubicClient', () => {
  test('returns an object with live and archive clients', () => {
    const client = createQubicClient({ fetch: mockFetch({}) })
    expect(client).toHaveProperty('live')
    expect(client).toHaveProperty('archive')
  })

  test('forwards custom fetch to both clients', async () => {
    const tickInfo = { tick: 100, epoch: 1, duration: 1, initialTick: 1 }
    const client = createQubicClient({
      fetch: mockFetch({ tickInfo }),
    })
    const result = await client.live.getTickInfo()
    expect(result.ok).toBe(true)
  })

  test('forwards liveBaseUrl option', () => {
    // Should not throw; we just verify construction works with custom URLs
    const client = createQubicClient({
      liveBaseUrl: 'https://custom-live.example.com/v1',
      fetch: mockFetch({}),
    })
    expect(client.live).toBeDefined()
  })

  test('forwards archiveBaseUrl option', () => {
    const client = createQubicClient({
      archiveBaseUrl: 'https://custom-archive.example.com/v1',
      fetch: mockFetch({}),
    })
    expect(client.archive).toBeDefined()
  })

  test('works with no options (defaults)', () => {
    const client = createQubicClient()
    expect(client.live).toBeDefined()
    expect(client.archive).toBeDefined()
  })

  test('forwards signal option', () => {
    const controller = new AbortController()
    const client = createQubicClient({
      signal: controller.signal,
      fetch: mockFetch({}),
    })
    expect(client.live).toBeDefined()
    expect(client.archive).toBeDefined()
  })
})

describe('estimateTargetTick', () => {
  test('adds default offset of 5', () => {
    expect(estimateTargetTick(1000)).toBe(1005)
  })

  test('adds custom offset', () => {
    expect(estimateTargetTick(1000, 10)).toBe(1010)
  })

  test('works with zero offset', () => {
    expect(estimateTargetTick(500, 0)).toBe(500)
  })

  test('works with zero currentTick', () => {
    expect(estimateTargetTick(0)).toBe(5)
  })
})

describe('waitForTick', () => {
  test('resolves immediately when current tick >= target', async () => {
    const tickInfo = { tick: 100, epoch: 1, duration: 1, initialTick: 1 }
    const live = createLiveClient({ fetch: mockFetch({ tickInfo }) })
    const result = await waitForTick(live, 100, { timeoutMs: 5000 })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toBe(100)
  })

  test('resolves immediately when current tick > target', async () => {
    const tickInfo = { tick: 150, epoch: 1, duration: 1, initialTick: 1 }
    const live = createLiveClient({ fetch: mockFetch({ tickInfo }) })
    const result = await waitForTick(live, 100, { timeoutMs: 5000 })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toBe(100)
  })

  test('polls until tick is reached', async () => {
    let callCount = 0
    const live = createLiveClient({
      fetch: async () => {
        callCount++
        const tick = callCount >= 3 ? 200 : 100
        return new Response(
          JSON.stringify({ tickInfo: { tick, epoch: 1, duration: 1, initialTick: 1 } }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      },
    })
    const result = await waitForTick(live, 200, { intervalMs: 10, timeoutMs: 5000 })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toBe(200)
    expect(callCount).toBeGreaterThanOrEqual(3)
  })

  test('returns err on timeout', async () => {
    const tickInfo = { tick: 50, epoch: 1, duration: 1, initialTick: 1 }
    const live = createLiveClient({ fetch: mockFetch({ tickInfo }) })
    const result = await waitForTick(live, 1000, { intervalMs: 10, timeoutMs: 50 })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
    expect(result.error.message).toContain('Timed out')
  })

  test('returns err when aborted', async () => {
    const controller = new AbortController()
    const tickInfo = { tick: 50, epoch: 1, duration: 1, initialTick: 1 }
    const live = createLiveClient({ fetch: mockFetch({ tickInfo }) })

    // Abort before starting
    controller.abort()
    const result = await waitForTick(live, 1000, {
      intervalMs: 10,
      timeoutMs: 5000,
      signal: controller.signal,
    })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
    expect(result.error.message).toContain('Aborted')
  })

  test('retries on getTickInfo error', async () => {
    let callCount = 0
    const live = createLiveClient({
      fetch: async () => {
        callCount++
        if (callCount <= 2) {
          return new Response('error', { status: 500 })
        }
        return new Response(
          JSON.stringify({ tickInfo: { tick: 200, epoch: 1, duration: 1, initialTick: 1 } }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      },
    })
    const result = await waitForTick(live, 200, { intervalMs: 10, timeoutMs: 5000 })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toBe(200)
    expect(callCount).toBeGreaterThanOrEqual(3)
  })
})

describe('pollUntilConfirmed', () => {
  test('waits for targetTick + 1', async () => {
    const tickInfo = { tick: 101, epoch: 1, duration: 1, initialTick: 1 }
    const live = createLiveClient({ fetch: mockFetch({ tickInfo }) })
    const result = await pollUntilConfirmed(live, 100, { timeoutMs: 5000 })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    // pollUntilConfirmed delegates to waitForTick(live, targetTick + 1)
    expect(result.value).toBe(101)
  })

  test('returns err when tick does not advance past target', async () => {
    // Tick stays at exactly targetTick (100), needs targetTick+1 (101)
    const tickInfo = { tick: 100, epoch: 1, duration: 1, initialTick: 1 }
    const live = createLiveClient({ fetch: mockFetch({ tickInfo }) })
    const result = await pollUntilConfirmed(live, 100, { intervalMs: 10, timeoutMs: 50 })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.message).toContain('Timed out')
  })

  test('resolves immediately if already confirmed (tick > target + 1)', async () => {
    const tickInfo = { tick: 200, epoch: 1, duration: 1, initialTick: 1 }
    const live = createLiveClient({ fetch: mockFetch({ tickInfo }) })
    const result = await pollUntilConfirmed(live, 100, { timeoutMs: 5000 })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toBe(101)
  })
})
