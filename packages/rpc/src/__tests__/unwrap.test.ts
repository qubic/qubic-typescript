import { describe, expect, test } from 'bun:test'
import { unwrap, sig } from '../_utils.js'
import { QubicRpcError } from '../errors.js'

// Helper to build a fake openapi-fetch response shape
function fakeResponse<T>(data: T, status: number = 200): Promise<{ data?: T; error?: unknown; response: Response }> {
  const response = new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
  return Promise.resolve({
    data: status >= 200 && status < 300 ? data : undefined,
    error: status >= 400 ? data : undefined,
    response,
  })
}

describe('unwrap', () => {
  test('returns ok(data) on successful response (status 200)', async () => {
    const payload = { tick: 42 }
    const result = await unwrap(fakeResponse(payload, 200), '/test')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual({ tick: 42 })
  })

  test('returns ok(data) on status 201', async () => {
    const payload = { created: true }
    const result = await unwrap(fakeResponse(payload, 201), '/create')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual({ created: true })
  })

  test('returns err on HTTP 404 error response', async () => {
    const response = new Response('not found detail', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    })
    const promise = Promise.resolve({
      data: undefined,
      error: { message: 'not found' },
      response,
    })
    const result = await unwrap(promise, '/missing')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
    expect(result.error.status).toBe(404)
    expect(result.error.endpoint).toBe('/missing')
  })

  test('returns err on HTTP 500 error response', async () => {
    const response = new Response('server error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })
    const promise = Promise.resolve({
      data: undefined,
      error: { message: 'internal server error' },
      response,
    })
    const result = await unwrap(promise, '/broken')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
    expect(result.error.status).toBe(500)
    expect(result.error.endpoint).toBe('/broken')
  })

  test('returns err when error field is set even if status is 200', async () => {
    const response = new Response('', { status: 200 })
    // Simulate openapi-fetch setting error even with a 200 (shouldn't normally happen, but defensive)
    // Actually unwrap checks `error !== undefined || !response.ok`
    // If error is set and response.ok, it still triggers the error path
    const promise = Promise.resolve({
      data: undefined,
      error: { code: 'INVALID' },
      response,
    })
    const result = await unwrap(promise, '/edge')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
    expect(result.error.status).toBe(200) // the actual HTTP status
    expect(result.error.endpoint).toBe('/edge')
  })

  test('returns err with status -1 when promise rejects with a generic error', async () => {
    const promise = Promise.reject(new Error('Network failure'))
    const result = await unwrap(promise, '/network')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
    expect(result.error.status).toBe(-1)
    expect(result.error.endpoint).toBe('/network')
    expect(result.error.message).toContain('Network failure')
  })

  test('returns err when promise rejects with a QubicRpcError (passthrough)', async () => {
    const original = new QubicRpcError(503, '/upstream', 'service unavailable')
    const promise = Promise.reject(original)
    const result = await unwrap(promise, '/downstream')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBe(original) // same reference, passthrough
    expect(result.error.status).toBe(503)
    expect(result.error.endpoint).toBe('/upstream') // preserves original endpoint
  })

  test('returns err with status -1 when promise rejects with non-Error', async () => {
    const promise = Promise.reject('string error')
    const result = await unwrap(promise, '/string-err')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(QubicRpcError)
    expect(result.error.status).toBe(-1)
    expect(result.error.message).toContain('string error')
  })

  test('reads body text as error detail when body is available', async () => {
    const response = new Response('detailed error message', {
      status: 422,
      headers: { 'Content-Type': 'text/plain' },
    })
    const promise = Promise.resolve({
      data: undefined,
      error: { message: 'validation error' },
      response,
    })
    const result = await unwrap(promise, '/validate')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.message).toBe('detailed error message')
  })

  test('falls back to generic message when body text is empty', async () => {
    const response = new Response('', {
      status: 502,
      headers: { 'Content-Type': 'text/plain' },
    })
    const promise = Promise.resolve({
      data: undefined,
      error: { message: 'bad gateway' },
      response,
    })
    const result = await unwrap(promise, '/gateway')
    expect(result.ok).toBe(false)
    if (result.ok) return
    // When detail is empty string, it falls back to the default QubicRpcError message
    expect(result.error.message).toContain('HTTP 502')
    expect(result.error.endpoint).toBe('/gateway')
  })
})

describe('sig', () => {
  test('returns object with signal when signal is provided', () => {
    const controller = new AbortController()
    const result = sig(controller.signal)
    expect(result).toEqual({ signal: controller.signal })
  })

  test('returns empty object when signal is undefined', () => {
    const result = sig(undefined)
    expect(result).toEqual({})
  })
})
