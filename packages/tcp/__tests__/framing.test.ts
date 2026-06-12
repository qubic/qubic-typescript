import { describe, expect, test } from 'bun:test'
import { HEADER_SIZE, decodeHeader, encodeHeader } from '../src/framing.js'
import { MESSAGE_TYPE } from '../src/message-types.js'

describe('framing', () => {
  test('HEADER_SIZE is 8', () => {
    expect(HEADER_SIZE).toBe(8)
  })

  test('encodeHeader with no payload', () => {
    const h = encodeHeader(MESSAGE_TYPE.REQUEST_CURRENT_TICK_INFO, 0)
    expect(h.length).toBe(8)
    // size = 8 (header only), little-endian 3-byte
    expect(h[0]).toBe(8)
    expect(h[1]).toBe(0)
    expect(h[2]).toBe(0)
    // type
    expect(h[3]).toBe(MESSAGE_TYPE.REQUEST_CURRENT_TICK_INFO)
  })

  test('encodeHeader encodes size as LE uint24 including header', () => {
    const payload = new Uint8Array(100)
    const h = encodeHeader(MESSAGE_TYPE.REQUEST_ENTITY, payload.length)
    expect(h[0]).toBe(108) // 100 + 8 = 108
    expect(h[1]).toBe(0)
    expect(h[2]).toBe(0)
    expect(h[3]).toBe(MESSAGE_TYPE.REQUEST_ENTITY)
  })

  test('encodeHeader respects explicit dejavu', () => {
    const h = encodeHeader(0, 0, 0xdeadbeef)
    const view = new DataView(h.buffer)
    expect(view.getUint32(4, true)).toBe(0xdeadbeef)
  })

  test('encodeHeader generates random non-zero dejavu', () => {
    const values = new Set<number>()
    for (let i = 0; i < 10; i++) {
      const h = encodeHeader(0, 0)
      const dv = new DataView(h.buffer).getUint32(4, true)
      expect(dv).toBeGreaterThan(0)
      values.add(dv)
    }
    // 10 crypto-random u32 values should all be distinct
    expect(values.size).toBe(10)
  })

  test('encodeHeader throws for oversized payload', () => {
    expect(() => encodeHeader(0, 0xffffff)).toThrow(RangeError)
  })

  test('decodeHeader round-trips encode', () => {
    const h = encodeHeader(MESSAGE_TYPE.RESPOND_CURRENT_TICK_INFO, 16, 42)
    const decoded = decodeHeader(h)
    expect(decoded.size).toBe(24) // 8 + 16
    expect(decoded.type).toBe(MESSAGE_TYPE.RESPOND_CURRENT_TICK_INFO)
    expect(decoded.dejavu).toBe(42)
  })

  test('decodeHeader throws for short buffer', () => {
    expect(() => decodeHeader(new Uint8Array(7))).toThrow(RangeError)
  })

  test('decodeHeader reads 3-byte LE size correctly for large message', () => {
    // Manually craft a header with size = 0x010203 = 66051
    const buf = new Uint8Array(8)
    buf[0] = 0x03
    buf[1] = 0x02
    buf[2] = 0x01
    buf[3] = 35 // END_RESPONSE
    const decoded = decodeHeader(buf)
    expect(decoded.size).toBe(0x010203)
    expect(decoded.type).toBe(35)
  })
})
