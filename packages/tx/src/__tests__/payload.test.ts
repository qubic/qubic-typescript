import { describe, expect, test } from 'bun:test'
import { identityToPublicKey, publicKeyToIdentity } from '@qubic.org/crypto'
import { toIdentity } from '@qubic.org/types'
import { buildPayload } from '../payload.js'

describe('buildPayload', () => {
  test('encodes uint8', () => {
    const buf = buildPayload([{ type: 'uint8', value: 0xff }])
    expect(buf).toEqual(new Uint8Array([0xff]))
  })

  test('encodes uint16 little-endian', () => {
    const buf = buildPayload([{ type: 'uint16', value: 0x0102 }])
    expect(buf).toEqual(new Uint8Array([0x02, 0x01]))
  })

  test('encodes uint32 little-endian', () => {
    const buf = buildPayload([{ type: 'uint32', value: 0x01020304 }])
    expect(buf).toEqual(new Uint8Array([0x04, 0x03, 0x02, 0x01]))
  })

  test('encodes uint64 little-endian', () => {
    const buf = buildPayload([{ type: 'uint64', value: 1n }])
    expect(buf.byteLength).toBe(8)
    expect(new DataView(buf.buffer).getBigUint64(0, true)).toBe(1n)
  })

  test('encodes sint64 for negative value', () => {
    const buf = buildPayload([{ type: 'sint64', value: -1n }])
    expect(buf.byteLength).toBe(8)
    expect(new DataView(buf.buffer).getBigInt64(0, true)).toBe(-1n)
  })

  test('encodes raw bytes passthrough', () => {
    const data = new Uint8Array([1, 2, 3, 4])
    const buf = buildPayload([{ type: 'bytes', value: data }])
    expect(buf).toEqual(data)
  })

  test('encodes Identity as 32-byte public key', () => {
    const pk = new Uint8Array(32).fill(9)
    // derive a valid identity from known pk bytes via identity encoding
    const identity = toIdentity(publicKeyToIdentity(pk))
    const buf = buildPayload([{ type: 'id', value: identity }])
    expect(buf.byteLength).toBe(32)
    expect(buf).toEqual(identityToPublicKey(identity))
  })

  test('concatenates multiple fields', () => {
    const buf = buildPayload([
      { type: 'uint8', value: 1 },
      { type: 'uint16', value: 2 },
      { type: 'uint32', value: 3 },
    ])
    expect(buf.byteLength).toBe(1 + 2 + 4)
    const view = new DataView(buf.buffer)
    expect(view.getUint8(0)).toBe(1)
    expect(view.getUint16(1, true)).toBe(2)
    expect(view.getUint32(3, true)).toBe(3)
  })

  test('empty fields list produces empty buffer', () => {
    expect(buildPayload([]).byteLength).toBe(0)
  })
})
