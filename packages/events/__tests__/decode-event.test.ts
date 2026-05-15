import { describe, expect, test } from 'bun:test'
import { LOG_TYPE } from '@qubic.ts/types'
import { EventDecodeError } from '../src/errors.js'
import { decodeEvent } from '../src/decode-event.js'
import type { BobLogEvent } from '@qubic.ts/bob'

// ── helpers ───────────────────────────────────────────────────────────────────

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

function makeEvent(logType: number, bytes: Uint8Array): BobLogEvent {
  return {
    tick: 1000,
    logId: 1n,
    contractIndex: 0,
    logType: logType as BobLogEvent['logType'],
    data: toBase64(bytes) as BobLogEvent['data'],
    isCatchUp: false,
  }
}

function writeIdentity(buf: Uint8Array, offset: number, fill: number) {
  buf.fill(fill, offset, offset + 32)
}

function writeInt64LE(buf: Uint8Array, offset: number, value: bigint) {
  const view = new DataView(buf.buffer)
  view.setBigInt64(offset, value, true)
}

function writeUint64LE(buf: Uint8Array, offset: number, value: bigint) {
  const view = new DataView(buf.buffer)
  view.setBigUint64(offset, value, true)
}

function writeUint32LE(buf: Uint8Array, offset: number, value: number) {
  new DataView(buf.buffer).setUint32(offset, value, true)
}

function writeUint16LE(buf: Uint8Array, offset: number, value: number) {
  new DataView(buf.buffer).setUint16(offset, value, true)
}

// ── QU_TRANSFER ───────────────────────────────────────────────────────────────

describe('decodeEvent', () => {
  test('QU_TRANSFER decodes source, destination, amount', () => {
    const buf = new Uint8Array(72)
    writeIdentity(buf, 0, 0x01)   // source public key
    writeIdentity(buf, 32, 0x02)  // destination public key
    writeInt64LE(buf, 64, 1_000_000n)

    const event = decodeEvent(makeEvent(LOG_TYPE.QU_TRANSFER, buf))
    expect(event.logType).toBe(LOG_TYPE.QU_TRANSFER)
    expect(event.tick).toBe(1000)
    if (event.logType === LOG_TYPE.QU_TRANSFER) {
      expect(event.data.amount).toBe(1_000_000n)
      expect(typeof event.data.source).toBe('string')
      expect(event.data.source).toHaveLength(60)
    }
  })

  test('QU_TRANSFER throws on short payload', () => {
    expect(() => decodeEvent(makeEvent(LOG_TYPE.QU_TRANSFER, new Uint8Array(10)))).toThrow(
      EventDecodeError,
    )
  })

  // ── BURNING ────────────────────────────────────────────────────────────────

  test('BURNING decodes source, amount, contractIndex', () => {
    const buf = new Uint8Array(44)
    writeIdentity(buf, 0, 0x03)
    writeInt64LE(buf, 32, 500n)
    writeUint32LE(buf, 40, 9)

    const event = decodeEvent(makeEvent(LOG_TYPE.BURNING, buf))
    if (event.logType === LOG_TYPE.BURNING) {
      expect(event.data.amount).toBe(500n)
      expect(event.data.contractIndex).toBe(9)
    }
  })

  // ── DUST_BURNING ──────────────────────────────────────────────────────────

  test('DUST_BURNING decodes variable number of burns', () => {
    const count = 2
    const buf = new Uint8Array(2 + count * 40)
    writeUint16LE(buf, 0, count)
    writeIdentity(buf, 2, 0x04)
    writeUint64LE(buf, 2 + 32, 100n)
    writeIdentity(buf, 2 + 40, 0x05)
    writeUint64LE(buf, 2 + 40 + 32, 200n)

    const event = decodeEvent(makeEvent(LOG_TYPE.DUST_BURNING, buf))
    if (event.logType === LOG_TYPE.DUST_BURNING) {
      expect(event.data.burns).toHaveLength(2)
      expect(event.data.burns[0]?.amount).toBe(100n)
      expect(event.data.burns[1]?.amount).toBe(200n)
    }
  })

  // ── SPECTRUM_STATS ────────────────────────────────────────────────────────

  test('SPECTRUM_STATS decodes totals and entity count', () => {
    const buf = new Uint8Array(224)
    writeUint64LE(buf, 0, 1_000_000_000n)
    writeUint64LE(buf, 8, 1000n)
    writeUint64LE(buf, 16, 500n)
    writeUint32LE(buf, 24, 12345)

    const event = decodeEvent(makeEvent(LOG_TYPE.SPECTRUM_STATS, buf))
    if (event.logType === LOG_TYPE.SPECTRUM_STATS) {
      expect(event.data.totalAmount).toBe(1_000_000_000n)
      expect(event.data.numberOfEntities).toBe(12345)
    }
  })

  // ── CONTRACT_RESERVE_DEDUCTION ────────────────────────────────────────────

  test('CONTRACT_RESERVE_DEDUCTION decodes amounts and contractIndex', () => {
    const buf = new Uint8Array(24)
    writeUint64LE(buf, 0, 50n)
    writeInt64LE(buf, 8, 950n)
    writeUint32LE(buf, 16, 7)

    const event = decodeEvent(makeEvent(LOG_TYPE.CONTRACT_RESERVE_DEDUCTION, buf))
    if (event.logType === LOG_TYPE.CONTRACT_RESERVE_DEDUCTION) {
      expect(event.data.deductedAmount).toBe(50n)
      expect(event.data.remainingAmount).toBe(950n)
      expect(event.data.contractIndex).toBe(7)
    }
  })

  // ── SC messages ───────────────────────────────────────────────────────────

  test('CONTRACT_ERROR_MESSAGE decodes contractIndex and messageType', () => {
    const buf = new Uint8Array(8)
    writeUint32LE(buf, 0, 3)
    writeUint32LE(buf, 4, 42)

    const event = decodeEvent(makeEvent(LOG_TYPE.CONTRACT_ERROR_MESSAGE, buf))
    if (event.logType === LOG_TYPE.CONTRACT_ERROR_MESSAGE) {
      expect(event.data.contractIndex).toBe(3)
      expect(event.data.contractMessageType).toBe(42)
    }
  })

  // ── CUSTOM_MESSAGE ────────────────────────────────────────────────────────

  test('CUSTOM_MESSAGE returns raw bytes', () => {
    const buf = new Uint8Array(8).fill(0xab)
    const event = decodeEvent(makeEvent(LOG_TYPE.CUSTOM_MESSAGE, buf))
    if (event.logType === LOG_TYPE.CUSTOM_MESSAGE) {
      expect(event.data).toBeInstanceOf(Uint8Array)
      expect(event.data[0]).toBe(0xab)
    }
  })

  // ── unknown type ──────────────────────────────────────────────────────────

  test('unknown logType throws EventDecodeError', () => {
    expect(() => decodeEvent(makeEvent(99, new Uint8Array(32)))).toThrow(EventDecodeError)
  })
})
