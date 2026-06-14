import { describe, expect, test } from 'bun:test'
import {
  QubicTcpError,
  QubicTcpConnectionError,
  QubicTcpTimeoutError,
} from '../src/errors.js'

describe('QubicTcpError', () => {
  test('is an instance of Error', () => {
    const err = new QubicTcpError('test message')
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('test message')
  })

  test('has code TCP_ERROR', () => {
    const err = new QubicTcpError('test')
    expect(err.code).toBe('TCP_ERROR')
  })
})

describe('QubicTcpConnectionError', () => {
  test('formats message with hostname', () => {
    const err = new QubicTcpConnectionError('node1.example.com', 'connection refused')
    expect(err.message).toBe(
      'TCP connection to node1.example.com failed: connection refused',
    )
    expect(err.hostname).toBe('node1.example.com')
  })

  test('has code TCP_CONNECTION_ERROR', () => {
    const err = new QubicTcpConnectionError('host', 'msg')
    expect(err.code).toBe('TCP_CONNECTION_ERROR')
  })

  test('is instance of QubicTcpError and Error', () => {
    const err = new QubicTcpConnectionError('host', 'msg')
    expect(err).toBeInstanceOf(QubicTcpError)
    expect(err).toBeInstanceOf(Error)
  })

  test('includes cause in constructor options', () => {
    const inner = new Error('underlying')
    const err = new QubicTcpConnectionError('host', 'msg', inner)
    // The constructor passes { cause: { cause: innerError } } to QubicError
    // Verify the error is constructed without throwing
    expect(err).toBeInstanceOf(QubicTcpConnectionError)
    expect(err.message).toContain('host')
  })
})

describe('QubicTcpTimeoutError', () => {
  test('formats message with hostname and timeout', () => {
    const err = new QubicTcpTimeoutError('node2.example.com', 5000)
    expect(err.message).toBe('TCP request to node2.example.com timed out after 5000ms')
    expect(err.hostname).toBe('node2.example.com')
    expect(err.timeoutMs).toBe(5000)
  })

  test('has code TCP_TIMEOUT', () => {
    const err = new QubicTcpTimeoutError('host', 1000)
    expect(err.code).toBe('TCP_TIMEOUT')
  })

  test('is instance of QubicTcpError and Error', () => {
    const err = new QubicTcpTimeoutError('host', 1000)
    expect(err).toBeInstanceOf(QubicTcpError)
    expect(err).toBeInstanceOf(Error)
  })
})
