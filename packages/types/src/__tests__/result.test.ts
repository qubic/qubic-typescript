import { describe, expect, test } from 'bun:test'
import { err, ok } from '../result.js'
import type { Result } from '../result.js'

describe('ok', () => {
  test('returns object with ok=true and value accessible', () => {
    const result = ok(42)
    expect(result.ok).toBe(true)
    expect(result.value).toBe(42)
  })

  test('works with string values', () => {
    const result = ok('hello')
    expect(result.ok).toBe(true)
    expect(result.value).toBe('hello')
  })

  test('works with object values', () => {
    const obj = { a: 1, b: 'two' }
    const result = ok(obj)
    expect(result.ok).toBe(true)
    expect(result.value).toBe(obj)
  })

  test('works with undefined', () => {
    const result = ok(undefined)
    expect(result.ok).toBe(true)
    expect(result.value).toBeUndefined()
  })

  test('works with null', () => {
    const result = ok(null)
    expect(result.ok).toBe(true)
    expect(result.value).toBeNull()
  })

  test('works with array values', () => {
    const arr = [1, 2, 3]
    const result = ok(arr)
    expect(result.ok).toBe(true)
    expect(result.value).toEqual([1, 2, 3])
  })
})

describe('err', () => {
  test('returns object with ok=false and error accessible', () => {
    const result = err('something went wrong')
    expect(result.ok).toBe(false)
    expect(result.error).toBe('something went wrong')
  })

  test('works with Error objects', () => {
    const error = new Error('fail')
    const result = err(error)
    expect(result.ok).toBe(false)
    expect(result.error).toBe(error)
    expect(result.error.message).toBe('fail')
  })

  test('works with numeric error codes', () => {
    const result = err(404)
    expect(result.ok).toBe(false)
    expect(result.error).toBe(404)
  })

  test('works with object errors', () => {
    const errorObj = { code: 'NOT_FOUND', message: 'not found' }
    const result = err(errorObj)
    expect(result.ok).toBe(false)
    expect(result.error).toEqual({ code: 'NOT_FOUND', message: 'not found' })
  })
})

describe('Result type narrowing', () => {
  test('ok branch narrows to value', () => {
    const result: Result<number, string> = ok(42)
    if (result.ok) {
      // In the ok branch, value should be accessible
      expect(result.value).toBe(42)
    } else {
      // This branch should not execute
      throw new Error('Expected ok branch')
    }
  })

  test('err branch narrows to error', () => {
    const result: Result<number, string> = err('fail')
    if (!result.ok) {
      // In the err branch, error should be accessible
      expect(result.error).toBe('fail')
    } else {
      // This branch should not execute
      throw new Error('Expected err branch')
    }
  })

  test('discriminated union works in switch-like pattern', () => {
    function processResult(r: Result<string, Error>): string {
      if (r.ok) return r.value
      return r.error.message
    }

    expect(processResult(ok('success'))).toBe('success')
    expect(processResult(err(new Error('failure')))).toBe('failure')
  })
})
