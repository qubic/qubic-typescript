import { describe, expect, test } from 'bun:test'
import { PayloadBuildError, buildPayload, buildPayloadManual, decodePayload } from '../payload.js'
import type { BinaryField, NamedStruct } from '../types.js'

const NO_STRUCTS: Record<string, NamedStruct> = {}
const identity = (s: string) => new Uint8Array(32).fill(s.charCodeAt(0))
const pkToId = (_pk: Uint8Array): string => { throw new Error('pkToId should not be called') }

const UNLOCK_FIELDS: BinaryField[] = [
  { name: 'amount', type: 'uint64', offset: 0, byteLength: 8 },
  { name: 'lockedEpoch', type: 'uint32', offset: 8, byteLength: 4 },
]

describe('buildPayload', () => {
  test('buildQearnUnlock: total length === 12', () => {
    const payload = buildPayload(
      UNLOCK_FIELDS,
      NO_STRUCTS,
      { amount: 5_000_000n, lockedEpoch: 150 },
      identity,
    )
    expect(payload.byteLength).toBe(12)
  })

  test('buildQearnUnlock: bytes 0-7 correct uint64 LE', () => {
    const payload = buildPayload(
      UNLOCK_FIELDS,
      NO_STRUCTS,
      { amount: 5_000_000n, lockedEpoch: 150 },
      identity,
    )
    const view = new DataView(payload.buffer)
    expect(view.getBigUint64(0, true)).toBe(5_000_000n)
  })

  test('buildQearnUnlock: bytes 8-11 correct uint32 LE', () => {
    const payload = buildPayload(
      UNLOCK_FIELDS,
      NO_STRUCTS,
      { amount: 5_000_000n, lockedEpoch: 150 },
      identity,
    )
    const view = new DataView(payload.buffer)
    expect(view.getUint32(8, true)).toBe(150)
  })

  test('round-trip: encode then decode', () => {
    const input = { amount: 5_000_000n, lockedEpoch: 150 }
    const payload = buildPayload(UNLOCK_FIELDS, NO_STRUCTS, input, identity)
    const decoded = decodePayload(payload, UNLOCK_FIELDS, NO_STRUCTS, pkToId)
    expect(decoded.amount).toBe(5_000_000n)
    expect(decoded.lockedEpoch).toBe(150)
  })

  test('advanced mode: Uint8Array verbatim copy accepted', () => {
    const raw = new Uint8Array(12)
    new DataView(raw.buffer).setBigUint64(0, 9_999n, true)
    new DataView(raw.buffer).setUint32(8, 77, true)
    const fields: BinaryField[] = [{ name: 'raw', type: 'bytes', offset: 0, byteLength: 12 }]
    const payload = buildPayload(fields, NO_STRUCTS, { raw }, identity)
    expect(payload).toEqual(raw)
  })

  test('throws PayloadBuildError on length mismatch for Uint8Array', () => {
    const fields: BinaryField[] = [{ name: 'x', type: 'uint64', offset: 0, byteLength: 8 }]
    const badRaw = new Uint8Array(4)
    expect(() => buildPayload(fields, NO_STRUCTS, { x: badRaw }, identity)).toThrow(
      PayloadBuildError,
    )
  })

  test('throws PayloadBuildError for missing field', () => {
    expect(() =>
      buildPayload(UNLOCK_FIELDS, NO_STRUCTS, { amount: 1n } as Record<string, unknown>, identity),
    ).toThrow(PayloadBuildError)
  })

  test('encodes uint8, uint16, uint32', () => {
    const fields: BinaryField[] = [
      { name: 'a', type: 'uint8', offset: 0, byteLength: 1 },
      { name: 'b', type: 'uint16', offset: 1, byteLength: 2 },
      { name: 'c', type: 'uint32', offset: 3, byteLength: 4 },
    ]
    const payload = buildPayload(fields, NO_STRUCTS, { a: 255, b: 1000, c: 999999 }, identity)
    const view = new DataView(payload.buffer)
    expect(view.getUint8(0)).toBe(255)
    expect(view.getUint16(1, true)).toBe(1000)
    expect(view.getUint32(3, true)).toBe(999999)
  })

  test('encodes sint64', () => {
    const fields: BinaryField[] = [{ name: 'x', type: 'sint64', offset: 0, byteLength: 8 }]
    const payload = buildPayload(fields, NO_STRUCTS, { x: -42n }, identity)
    expect(new DataView(payload.buffer).getBigInt64(0, true)).toBe(-42n)
  })

  test('encodes uint128', () => {
    const fields: BinaryField[] = [{ name: 'x', type: 'uint128', offset: 0, byteLength: 16 }]
    const val = 2n ** 64n + 1n
    const payload = buildPayload(fields, NO_STRUCTS, { x: val }, identity)
    const decoded = decodePayload(payload, fields, NO_STRUCTS, pkToId)
    expect(decoded.x).toBe(val)
  })
})

describe('buildPayloadManual', () => {
  test('encodes fields in order', () => {
    const payload = buildPayloadManual([
      { type: 'uint64', value: 5_000_000n },
      { type: 'uint32', value: 150 },
    ])
    expect(payload.byteLength).toBe(12)
    const view = new DataView(payload.buffer)
    expect(view.getBigUint64(0, true)).toBe(5_000_000n)
    expect(view.getUint32(8, true)).toBe(150)
  })

  test('encodes a Uint8Array field verbatim', () => {
    const raw = new Uint8Array([1, 2, 3, 4])
    const payload = buildPayloadManual([{ type: 'bytes', value: raw }])
    expect(Array.from(payload)).toEqual([1, 2, 3, 4])
  })
})

describe('decodePayload', () => {
  test('decodes id field via publicKeyToIdentity', () => {
    const pk = new Uint8Array(32).fill(65)
    const fields: BinaryField[] = [{ name: 'sender', type: 'id', offset: 0, byteLength: 32 }]
    const ZERO_IDENTITY = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFXIB'
    const decoded = decodePayload(pk, fields, NO_STRUCTS, () => ZERO_IDENTITY)
    expect(decoded.sender).toBe(ZERO_IDENTITY)
  })

  test('decodes bytes field as Uint8Array', () => {
    const data = new Uint8Array([10, 20, 30])
    const fields: BinaryField[] = [{ name: 'raw', type: 'bytes', offset: 0, byteLength: 3 }]
    const decoded = decodePayload(data, fields, NO_STRUCTS, pkToId)
    expect(decoded.raw).toBeInstanceOf(Uint8Array)
    expect(Array.from(decoded.raw as Uint8Array)).toEqual([10, 20, 30])
  })
})
