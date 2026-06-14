import { describe, expect, test } from 'bun:test'
import { BinaryReader } from '../binary-reader.js'

describe('BinaryReader', () => {
  test('readUint8 reads a single byte', () => {
    const reader = new BinaryReader(new Uint8Array([0xab]))
    expect(reader.readUint8()).toBe(0xab)
    expect(reader.bytesRead).toBe(1)
    expect(reader.remaining).toBe(0)
  })

  test('readUint16 reads little-endian 16-bit value', () => {
    const reader = new BinaryReader(new Uint8Array([0x34, 0x12]))
    expect(reader.readUint16()).toBe(0x1234)
    expect(reader.bytesRead).toBe(2)
  })

  test('readUint32 reads little-endian 32-bit value', () => {
    const reader = new BinaryReader(new Uint8Array([0x78, 0x56, 0x34, 0x12]))
    expect(reader.readUint32()).toBe(0x12345678)
    expect(reader.bytesRead).toBe(4)
  })

  test('readInt64 reads signed 64-bit little-endian value', () => {
    // -1 as signed 64-bit LE
    const bytes = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
    const reader = new BinaryReader(bytes)
    expect(reader.readInt64()).toBe(-1n)
    expect(reader.bytesRead).toBe(8)
  })

  test('readInt64 reads positive bigint', () => {
    const view = new DataView(new ArrayBuffer(8))
    view.setBigInt64(0, 42n, true)
    const reader = new BinaryReader(new Uint8Array(view.buffer))
    expect(reader.readInt64()).toBe(42n)
  })

  test('readUint64 reads unsigned 64-bit little-endian value', () => {
    const view = new DataView(new ArrayBuffer(8))
    view.setBigUint64(0, 2n ** 63n, true) // large unsigned value
    const reader = new BinaryReader(new Uint8Array(view.buffer))
    expect(reader.readUint64()).toBe(2n ** 63n)
  })

  test('readUint64 reads max value', () => {
    const view = new DataView(new ArrayBuffer(8))
    view.setBigUint64(0, 0xffffffffffffffffn, true)
    const reader = new BinaryReader(new Uint8Array(view.buffer))
    expect(reader.readUint64()).toBe(0xffffffffffffffffn)
  })

  test('readBytes returns a slice of the requested length', () => {
    const data = new Uint8Array([1, 2, 3, 4, 5])
    const reader = new BinaryReader(data)
    const slice = reader.readBytes(3)
    expect(slice).toEqual(new Uint8Array([1, 2, 3]))
    expect(reader.bytesRead).toBe(3)
    expect(reader.remaining).toBe(2)
  })

  test('readBytes(0) returns empty array', () => {
    const reader = new BinaryReader(new Uint8Array([1, 2, 3]))
    const slice = reader.readBytes(0)
    expect(slice.byteLength).toBe(0)
    expect(reader.bytesRead).toBe(0)
  })

  test('sequential reads advance the offset correctly', () => {
    // uint8(0xAA) + uint16(0xBBCC) + uint32(0xDDEEFF00) = 7 bytes
    const data = new Uint8Array([0xaa, 0xcc, 0xbb, 0x00, 0xff, 0xee, 0xdd])
    const reader = new BinaryReader(data)
    expect(reader.readUint8()).toBe(0xaa)
    expect(reader.readUint16()).toBe(0xbbcc)
    expect(reader.readUint32()).toBe(0xddeeff00)
    expect(reader.bytesRead).toBe(7)
    expect(reader.remaining).toBe(0)
  })

  test('throws RangeError when reading past end of buffer (uint8)', () => {
    const reader = new BinaryReader(new Uint8Array(0))
    expect(() => reader.readUint8()).toThrow(RangeError)
  })

  test('throws RangeError when reading uint16 with only 1 byte', () => {
    const reader = new BinaryReader(new Uint8Array([0xff]))
    expect(() => reader.readUint16()).toThrow(RangeError)
  })

  test('throws RangeError when reading uint32 with only 2 bytes', () => {
    const reader = new BinaryReader(new Uint8Array([0xff, 0xff]))
    expect(() => reader.readUint32()).toThrow(RangeError)
  })

  test('throws RangeError when reading int64 with only 7 bytes', () => {
    const reader = new BinaryReader(new Uint8Array(7))
    expect(() => reader.readInt64()).toThrow(RangeError)
  })

  test('throws RangeError when reading uint64 with only 4 bytes', () => {
    const reader = new BinaryReader(new Uint8Array(4))
    expect(() => reader.readUint64()).toThrow(RangeError)
  })

  test('throws RangeError when readBytes requests more than remaining', () => {
    const reader = new BinaryReader(new Uint8Array([1, 2, 3]))
    reader.readBytes(2)
    expect(() => reader.readBytes(2)).toThrow(RangeError)
  })

  test('error message includes byte count and offset', () => {
    const reader = new BinaryReader(new Uint8Array([1, 2]))
    reader.readUint8()
    try {
      reader.readUint32()
      expect.unreachable()
    } catch (e) {
      expect(e).toBeInstanceOf(RangeError)
      expect((e as RangeError).message).toContain('4 byte(s)')
      expect((e as RangeError).message).toContain('offset 1')
      expect((e as RangeError).message).toContain('1 remaining')
    }
  })

  test('bytesRead starts at 0', () => {
    const reader = new BinaryReader(new Uint8Array(10))
    expect(reader.bytesRead).toBe(0)
  })

  test('remaining equals total length initially', () => {
    const reader = new BinaryReader(new Uint8Array(10))
    expect(reader.remaining).toBe(10)
  })

  test('works with a Uint8Array that has a non-zero byteOffset', () => {
    const underlying = new ArrayBuffer(10)
    const view = new Uint8Array(underlying, 3, 4)
    view.set([0x01, 0x02, 0x03, 0x04])
    const reader = new BinaryReader(view)
    expect(reader.readUint32()).toBe(0x04030201)
    expect(reader.bytesRead).toBe(4)
    expect(reader.remaining).toBe(0)
  })
})
