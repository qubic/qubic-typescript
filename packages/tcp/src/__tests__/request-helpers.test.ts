import { describe, expect, test } from 'bun:test'
import { decodeCurrentTickInfo, decodeExchangePublicPeers } from '../request-helpers.js'

describe('decodeCurrentTickInfo', () => {
  test('decodes a known 16-byte payload', () => {
    // tickDuration=1, epoch=100, tick=50000, alignedVotes=600, misalignedVotes=12, initialTick=49000
    const buf = new ArrayBuffer(16)
    const v = new DataView(buf)
    v.setUint16(0, 1, true) // tickDuration
    v.setUint16(2, 100, true) // epoch
    v.setUint32(4, 50000, true) // tick
    v.setUint16(8, 600, true) // numberOfAlignedVotes
    v.setUint16(10, 12, true) // numberOfMisalignedVotes
    v.setUint32(12, 49000, true) // initialTick

    const result = decodeCurrentTickInfo(new Uint8Array(buf))
    expect(result.tickDuration).toBe(1)
    expect(result.epoch).toBe(100)
    expect(result.tick).toBe(50000)
    expect(result.numberOfAlignedVotes).toBe(600)
    expect(result.numberOfMisalignedVotes).toBe(12)
    expect(result.initialTick).toBe(49000)
  })

  test('decodes a payload with all zeros', () => {
    const buf = new Uint8Array(16)
    const result = decodeCurrentTickInfo(buf)
    expect(result.tickDuration).toBe(0)
    expect(result.epoch).toBe(0)
    expect(result.tick).toBe(0)
    expect(result.numberOfAlignedVotes).toBe(0)
    expect(result.numberOfMisalignedVotes).toBe(0)
    expect(result.initialTick).toBe(0)
  })

  test('throws on too-short payload', () => {
    expect(() => decodeCurrentTickInfo(new Uint8Array(15))).toThrow(RangeError)
    expect(() => decodeCurrentTickInfo(new Uint8Array(0))).toThrow(RangeError)
    expect(() => decodeCurrentTickInfo(new Uint8Array(8))).toThrow(RangeError)
  })

  test('throws with descriptive message on too-short payload', () => {
    expect(() => decodeCurrentTickInfo(new Uint8Array(5))).toThrow('too short')
  })
})

describe('decodeExchangePublicPeers', () => {
  test('decodes four IPv4 addresses', () => {
    const buf = new Uint8Array([192, 168, 1, 1, 10, 0, 0, 2, 172, 16, 0, 3, 8, 8, 8, 8])
    const result = decodeExchangePublicPeers(buf)
    expect(result.peers).toEqual(['192.168.1.1', '10.0.0.2', '172.16.0.3', '8.8.8.8'])
  })

  test('decodes all-zeros payload', () => {
    const buf = new Uint8Array(16)
    const result = decodeExchangePublicPeers(buf)
    expect(result.peers).toEqual(['0.0.0.0', '0.0.0.0', '0.0.0.0', '0.0.0.0'])
  })

  test('decodes max-value octets', () => {
    const buf = new Uint8Array(16).fill(255)
    const result = decodeExchangePublicPeers(buf)
    expect(result.peers).toEqual([
      '255.255.255.255',
      '255.255.255.255',
      '255.255.255.255',
      '255.255.255.255',
    ])
  })

  test('throws on too-short payload', () => {
    expect(() => decodeExchangePublicPeers(new Uint8Array(15))).toThrow(RangeError)
    expect(() => decodeExchangePublicPeers(new Uint8Array(0))).toThrow(RangeError)
    expect(() => decodeExchangePublicPeers(new Uint8Array(4))).toThrow(RangeError)
  })

  test('throws with descriptive message on too-short payload', () => {
    expect(() => decodeExchangePublicPeers(new Uint8Array(10))).toThrow('too short')
  })
})
