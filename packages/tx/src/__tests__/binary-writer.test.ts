import { describe, expect, test } from 'bun:test'
import { BinaryReader } from '../binary-reader.js'
import { BinaryWriter } from '../binary-writer.js'

describe('BinaryWriter', () => {
  test('writeUint8 writes a single byte', () => {
    const writer = new BinaryWriter(1)
    writer.writeUint8(0xab)
    expect(writer.bytesWritten).toBe(1)
    expect(writer.getBytes()).toEqual(new Uint8Array([0xab]))
  })

  test('writeUint16 writes little-endian 16-bit value', () => {
    const writer = new BinaryWriter(2)
    writer.writeUint16(0x1234)
    expect(writer.getBytes()).toEqual(new Uint8Array([0x34, 0x12]))
  })

  test('writeUint32 writes little-endian 32-bit value', () => {
    const writer = new BinaryWriter(4)
    writer.writeUint32(0x12345678)
    expect(writer.getBytes()).toEqual(new Uint8Array([0x78, 0x56, 0x34, 0x12]))
  })

  test('writeInt64 writes signed 64-bit little-endian value', () => {
    const writer = new BinaryWriter(8)
    writer.writeInt64(-1n)
    expect(writer.getBytes()).toEqual(
      new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]),
    )
  })

  test('writeInt64 writes positive bigint', () => {
    const writer = new BinaryWriter(8)
    writer.writeInt64(42n)
    const reader = new BinaryReader(writer.getBytes())
    expect(reader.readInt64()).toBe(42n)
  })

  test('writeUint64 writes unsigned 64-bit little-endian value', () => {
    const writer = new BinaryWriter(8)
    writer.writeUint64(2n ** 63n)
    const reader = new BinaryReader(writer.getBytes())
    expect(reader.readUint64()).toBe(2n ** 63n)
  })

  test('writeUint64 writes max value', () => {
    const writer = new BinaryWriter(8)
    writer.writeUint64(0xffffffffffffffffn)
    const reader = new BinaryReader(writer.getBytes())
    expect(reader.readUint64()).toBe(0xffffffffffffffffn)
  })

  test('writeBytes writes raw bytes', () => {
    const data = new Uint8Array([1, 2, 3, 4, 5])
    const writer = new BinaryWriter(5)
    writer.writeBytes(data)
    expect(writer.bytesWritten).toBe(5)
    expect(writer.getBytes()).toEqual(data)
  })

  test('writeBytes with empty array writes nothing', () => {
    const writer = new BinaryWriter(5)
    writer.writeBytes(new Uint8Array(0))
    expect(writer.bytesWritten).toBe(0)
    expect(writer.getBytes().byteLength).toBe(0)
  })

  test('sequential writes advance offset correctly', () => {
    const writer = new BinaryWriter(7)
    writer.writeUint8(0xaa)
    writer.writeUint16(0xbbcc)
    writer.writeUint32(0xddeeff00)
    expect(writer.bytesWritten).toBe(7)
    expect(writer.getBytes()).toEqual(new Uint8Array([0xaa, 0xcc, 0xbb, 0x00, 0xff, 0xee, 0xdd]))
  })

  test('getBytes returns only written portion', () => {
    const writer = new BinaryWriter(100)
    writer.writeUint32(42)
    const bytes = writer.getBytes()
    expect(bytes.byteLength).toBe(4)
    expect(bytes).toEqual(new Uint8Array([42, 0, 0, 0]))
  })

  test('bytesWritten starts at 0', () => {
    const writer = new BinaryWriter(10)
    expect(writer.bytesWritten).toBe(0)
  })

  test('throws RangeError when writing past end of buffer (uint8)', () => {
    const writer = new BinaryWriter(0)
    expect(() => writer.writeUint8(1)).toThrow(RangeError)
  })

  test('throws RangeError when writing uint16 with only 1 byte remaining', () => {
    const writer = new BinaryWriter(1)
    writer.writeUint8(0)
    expect(() => writer.writeUint16(1)).toThrow(RangeError)
  })

  test('throws RangeError when writing uint32 with only 2 bytes remaining', () => {
    const writer = new BinaryWriter(2)
    expect(() => writer.writeUint32(1)).toThrow(RangeError)
  })

  test('throws RangeError when writing int64 with only 4 bytes', () => {
    const writer = new BinaryWriter(4)
    expect(() => writer.writeInt64(1n)).toThrow(RangeError)
  })

  test('throws RangeError when writing uint64 with only 7 bytes', () => {
    const writer = new BinaryWriter(7)
    expect(() => writer.writeUint64(1n)).toThrow(RangeError)
  })

  test('throws RangeError when writeBytes exceeds remaining', () => {
    const writer = new BinaryWriter(2)
    expect(() => writer.writeBytes(new Uint8Array(3))).toThrow(RangeError)
  })

  test('error message includes byte count and offset', () => {
    const writer = new BinaryWriter(2)
    writer.writeUint8(0)
    try {
      writer.writeUint32(0)
      expect.unreachable()
    } catch (e) {
      expect(e).toBeInstanceOf(RangeError)
      expect((e as RangeError).message).toContain('4 byte(s)')
      expect((e as RangeError).message).toContain('offset 1')
      expect((e as RangeError).message).toContain('1 remaining')
    }
  })

  test('round-trip: write then read produces same values', () => {
    const writer = new BinaryWriter(25)
    writer.writeUint8(0x42)
    writer.writeUint16(0x1234)
    writer.writeUint32(0xdeadbeef)
    writer.writeInt64(-100n)
    writer.writeUint64(999999999999n)
    writer.writeBytes(new Uint8Array([0xca, 0xfe]))

    const reader = new BinaryReader(writer.getBytes())
    expect(reader.readUint8()).toBe(0x42)
    expect(reader.readUint16()).toBe(0x1234)
    expect(reader.readUint32()).toBe(0xdeadbeef)
    expect(reader.readInt64()).toBe(-100n)
    expect(reader.readUint64()).toBe(999999999999n)
    expect(reader.readBytes(2)).toEqual(new Uint8Array([0xca, 0xfe]))
    expect(reader.remaining).toBe(0)
  })
})
