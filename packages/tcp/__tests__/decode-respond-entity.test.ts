import { describe, expect, test } from 'bun:test'
import { decodeRespondEntity } from '../src/request-helpers.js'

describe('decodeRespondEntity', () => {
  /** Build a minimal 72-byte payload (EntityRecord 64 + tick 4 + spectrumIndex 4). */
  function buildMinimalPayload(opts?: {
    publicKey?: Uint8Array
    incomingAmount?: bigint
    outgoingAmount?: bigint
    numberOfIncomingTransfers?: number
    numberOfOutgoingTransfers?: number
    latestIncomingTransferTick?: number
    latestOutgoingTransferTick?: number
    tick?: number
    spectrumIndex?: number
  }): Uint8Array {
    const buf = new Uint8Array(72)
    const v = new DataView(buf.buffer)

    // publicKey: bytes 0–31
    if (opts?.publicKey) buf.set(opts.publicKey.subarray(0, 32), 0)

    // amounts: bytes 32–47
    v.setBigInt64(32, opts?.incomingAmount ?? 0n, true)
    v.setBigInt64(40, opts?.outgoingAmount ?? 0n, true)

    // transfer counts: bytes 48–55
    v.setUint32(48, opts?.numberOfIncomingTransfers ?? 0, true)
    v.setUint32(52, opts?.numberOfOutgoingTransfers ?? 0, true)

    // transfer ticks: bytes 56–63
    v.setUint32(56, opts?.latestIncomingTransferTick ?? 0, true)
    v.setUint32(60, opts?.latestOutgoingTransferTick ?? 0, true)

    // tick + spectrumIndex: bytes 64–71
    v.setUint32(64, opts?.tick ?? 0, true)
    v.setInt32(68, opts?.spectrumIndex ?? 0, true)

    return buf
  }

  test('decodes a minimal 72-byte all-zeros payload', () => {
    const result = decodeRespondEntity(new Uint8Array(72))
    expect(result.entity.publicKey).toEqual(new Uint8Array(32))
    expect(result.entity.incomingAmount).toBe(0n)
    expect(result.entity.outgoingAmount).toBe(0n)
    expect(result.entity.numberOfIncomingTransfers).toBe(0)
    expect(result.entity.numberOfOutgoingTransfers).toBe(0)
    expect(result.entity.latestIncomingTransferTick).toBe(0)
    expect(result.entity.latestOutgoingTransferTick).toBe(0)
    expect(result.tick).toBe(0)
    expect(result.spectrumIndex).toBe(0)
  })

  test('decodes a payload with populated fields', () => {
    const pk = new Uint8Array(32)
    for (let i = 0; i < 32; i++) pk[i] = i + 1

    const buf = buildMinimalPayload({
      publicKey: pk,
      incomingAmount: 1_000_000_000n,
      outgoingAmount: 500_000_000n,
      numberOfIncomingTransfers: 42,
      numberOfOutgoingTransfers: 17,
      latestIncomingTransferTick: 100_000,
      latestOutgoingTransferTick: 99_500,
      tick: 100_500,
      spectrumIndex: 12345,
    })

    const result = decodeRespondEntity(buf)

    // publicKey should be a copy
    expect(result.entity.publicKey).toEqual(pk)
    expect(result.entity.publicKey).not.toBe(pk) // must be a slice, not ref

    expect(result.entity.incomingAmount).toBe(1_000_000_000n)
    expect(result.entity.outgoingAmount).toBe(500_000_000n)
    expect(result.entity.numberOfIncomingTransfers).toBe(42)
    expect(result.entity.numberOfOutgoingTransfers).toBe(17)
    expect(result.entity.latestIncomingTransferTick).toBe(100_000)
    expect(result.entity.latestOutgoingTransferTick).toBe(99_500)
    expect(result.tick).toBe(100_500)
    expect(result.spectrumIndex).toBe(12345)
  })

  test('decodes large bigint amounts', () => {
    const buf = buildMinimalPayload({
      incomingAmount: BigInt('10000000000000000'), // 10 quadrillion
      outgoingAmount: BigInt('-1'), // max uint64 via two's complement
    })
    const result = decodeRespondEntity(buf)
    expect(result.entity.incomingAmount).toBe(BigInt('10000000000000000'))
    // getBigInt64 returns signed; -1n as signed int64 is all 1s
    expect(result.entity.outgoingAmount).toBe(-1n)
  })

  test('decodes negative spectrumIndex', () => {
    const buf = buildMinimalPayload({ spectrumIndex: -1 })
    const result = decodeRespondEntity(buf)
    expect(result.spectrumIndex).toBe(-1)
  })

  test('publicKey slice is 32 bytes', () => {
    const pk = new Uint8Array(32).fill(0xab)
    const buf = buildMinimalPayload({ publicKey: pk })
    const result = decodeRespondEntity(buf)
    expect(result.entity.publicKey.length).toBe(32)
    expect(result.entity.publicKey[0]).toBe(0xab)
    expect(result.entity.publicKey[31]).toBe(0xab)
  })

  test('ignores trailing bytes beyond 72 (e.g., siblings)', () => {
    // Full respond entity is 840 bytes; extra bytes should be ignored by the decoder
    const buf = new Uint8Array(840)
    const v = new DataView(buf.buffer)
    v.setUint32(64, 99999, true) // tick
    v.setInt32(68, 42, true) // spectrumIndex

    const result = decodeRespondEntity(buf)
    expect(result.tick).toBe(99999)
    expect(result.spectrumIndex).toBe(42)
  })

  test('throws RangeError on payload shorter than 72 bytes', () => {
    expect(() => decodeRespondEntity(new Uint8Array(71))).toThrow(RangeError)
    expect(() => decodeRespondEntity(new Uint8Array(0))).toThrow(RangeError)
    expect(() => decodeRespondEntity(new Uint8Array(32))).toThrow(RangeError)
    expect(() => decodeRespondEntity(new Uint8Array(64))).toThrow(RangeError)
  })

  test('throws with descriptive message on too-short payload', () => {
    expect(() => decodeRespondEntity(new Uint8Array(10))).toThrow('too short')
    expect(() => decodeRespondEntity(new Uint8Array(10))).toThrow('10')
  })

  test('accepts exactly 72 bytes (minimum valid)', () => {
    expect(() => decodeRespondEntity(new Uint8Array(72))).not.toThrow()
  })
})
