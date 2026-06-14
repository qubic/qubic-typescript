import { describe, expect, test } from 'bun:test'
import { BobConnectionError, BobRpcError, BobSubscriptionError } from '../errors.js'

describe('BobRpcError', () => {
  test('has code BOB_RPC_ERROR', () => {
    const err = new BobRpcError(-32601, 'Method not found')
    expect(err.code).toBe('BOB_RPC_ERROR')
  })

  test('stores jsonRpcCode and message', () => {
    const err = new BobRpcError(-32600, 'Invalid request')
    expect(err.jsonRpcCode).toBe(-32600)
    expect(err.message).toBe('Invalid request')
  })

  test('accepts cause option without throwing', () => {
    const cause = new Error('underlying')
    const err = new BobRpcError(-1, 'wrapper', { cause })
    expect(err.message).toBe('wrapper')
    expect(err.jsonRpcCode).toBe(-1)
  })

  test('accepts no cause option without throwing', () => {
    const err = new BobRpcError(-1, 'no cause')
    expect(err.message).toBe('no cause')
  })

  test('is an instance of Error', () => {
    const err = new BobRpcError(-1, 'test')
    expect(err).toBeInstanceOf(Error)
  })
})

describe('BobConnectionError', () => {
  test('has code BOB_CONNECTION_ERROR', () => {
    const err = new BobConnectionError('Connection refused')
    expect(err.code).toBe('BOB_CONNECTION_ERROR')
    expect(err.message).toBe('Connection refused')
  })

  test('accepts cause option without throwing', () => {
    const cause = new TypeError('fetch failed')
    const err = new BobConnectionError('ws failed', { cause })
    expect(err.message).toBe('ws failed')
  })

  test('accepts no cause option without throwing', () => {
    const err = new BobConnectionError('ws failed')
    expect(err.message).toBe('ws failed')
  })

  test('is an instance of Error', () => {
    const err = new BobConnectionError('test')
    expect(err).toBeInstanceOf(Error)
  })
})

describe('BobSubscriptionError', () => {
  test('has code BOB_SUBSCRIPTION_ERROR', () => {
    const err = new BobSubscriptionError('Buffer overflow')
    expect(err.code).toBe('BOB_SUBSCRIPTION_ERROR')
    expect(err.message).toBe('Buffer overflow')
  })

  test('accepts cause option without throwing', () => {
    const cause = new Error('underlying')
    const err = new BobSubscriptionError('overflow', { cause })
    expect(err.message).toBe('overflow')
  })

  test('accepts no cause option without throwing', () => {
    const err = new BobSubscriptionError('overflow')
    expect(err.message).toBe('overflow')
  })

  test('is an instance of Error', () => {
    const err = new BobSubscriptionError('test')
    expect(err).toBeInstanceOf(Error)
  })
})
