import { describe, expect, test } from 'bun:test'
import type { BobLogEvent } from '@qubic.org/bob'
import type { Identity } from '@qubic.org/types'
import { LOG_TYPE } from '@qubic.org/types'
import { decodeEvent } from '../src/decode-event.js'
import { EventDecodeError } from '../src/errors.js'
import { eventFilter } from '../src/event-filter-builder.js'

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
    writeIdentity(buf, 0, 0x01) // source public key
    writeIdentity(buf, 32, 0x02) // destination public key
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

  test('SPECTRUM_STATS decodes totals, entity count, and category populations', () => {
    const buf = new Uint8Array(224)
    writeUint64LE(buf, 0, 1_000_000_000n)
    writeUint64LE(buf, 8, 1000n)
    writeUint64LE(buf, 16, 500n)
    writeUint32LE(buf, 24, 12345)
    // Set first and last category population
    writeUint32LE(buf, 28, 100)
    writeUint32LE(buf, 28 + 47 * 4, 200)

    const event = decodeEvent(makeEvent(LOG_TYPE.SPECTRUM_STATS, buf))
    if (event.logType === LOG_TYPE.SPECTRUM_STATS) {
      expect(event.data.totalAmount).toBe(1_000_000_000n)
      expect(event.data.numberOfEntities).toBe(12345)
      expect(event.data.entityCategoryPopulations).toHaveLength(48)
      expect(event.data.entityCategoryPopulations[0]).toBe(100)
      expect(event.data.entityCategoryPopulations[47]).toBe(200)
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

  test('CUSTOM_MESSAGE START_EPOCH decodes to startEpoch kind', () => {
    const buf = new Uint8Array(8)
    const view = new DataView(buf.buffer)
    view.setBigUint64(0, 4850183582582395987n, true) // START_EPOCH

    const event = decodeEvent(makeEvent(LOG_TYPE.CUSTOM_MESSAGE, buf))
    if (event.logType === LOG_TYPE.CUSTOM_MESSAGE) {
      expect(event.data.kind).toBe('startEpoch')
    }
  })

  test('CUSTOM_MESSAGE END_EPOCH decodes to endEpoch kind', () => {
    const buf = new Uint8Array(8)
    const view = new DataView(buf.buffer)
    view.setBigUint64(0, 4850183582582591045n, true) // END_EPOCH

    const event = decodeEvent(makeEvent(LOG_TYPE.CUSTOM_MESSAGE, buf))
    if (event.logType === LOG_TYPE.CUSTOM_MESSAGE) {
      expect(event.data.kind).toBe('endEpoch')
    }
  })

  test('CUSTOM_MESSAGE START_DISTRIBUTE_DIVIDENDS decodes correctly', () => {
    const buf = new Uint8Array(8)
    const view = new DataView(buf.buffer)
    view.setBigUint64(0, 6217575821008262227n, true) // START_DISTRIBUTE_DIVIDENDS

    const event = decodeEvent(makeEvent(LOG_TYPE.CUSTOM_MESSAGE, buf))
    if (event.logType === LOG_TYPE.CUSTOM_MESSAGE) {
      expect(event.data.kind).toBe('startDistributeDividends')
    }
  })

  test('CUSTOM_MESSAGE END_DISTRIBUTE_DIVIDENDS decodes correctly', () => {
    const buf = new Uint8Array(8)
    const view = new DataView(buf.buffer)
    view.setBigUint64(0, 6217575821008457285n, true) // END_DISTRIBUTE_DIVIDENDS

    const event = decodeEvent(makeEvent(LOG_TYPE.CUSTOM_MESSAGE, buf))
    if (event.logType === LOG_TYPE.CUSTOM_MESSAGE) {
      expect(event.data.kind).toBe('endDistributeDividends')
    }
  })

  test('CUSTOM_MESSAGE with unknown type falls back to unknown kind', () => {
    const buf = new Uint8Array(16)
    const view = new DataView(buf.buffer)
    view.setBigUint64(0, 9999999999999n, true) // unknown op code
    buf[8] = 0xaa
    buf[9] = 0xbb

    const event = decodeEvent(makeEvent(LOG_TYPE.CUSTOM_MESSAGE, buf))
    if (event.logType === LOG_TYPE.CUSTOM_MESSAGE) {
      expect(event.data.kind).toBe('unknown')
      if (event.data.kind === 'unknown') {
        expect(event.data.messageType).toBe(9999999999999n)
        expect(event.data.payload).toBeInstanceOf(Uint8Array)
        expect(event.data.payload).toHaveLength(8)
        expect(event.data.payload[0]).toBe(0xaa)
      }
    }
  })

  test('CUSTOM_MESSAGE with no extra payload and unknown type', () => {
    const buf = new Uint8Array(8)
    const view = new DataView(buf.buffer)
    view.setBigUint64(0, 12345n, true) // unknown op code

    const event = decodeEvent(makeEvent(LOG_TYPE.CUSTOM_MESSAGE, buf))
    if (event.logType === LOG_TYPE.CUSTOM_MESSAGE) {
      expect(event.data.kind).toBe('unknown')
      if (event.data.kind === 'unknown') {
        expect(event.data.messageType).toBe(12345n)
        expect(event.data.payload).toHaveLength(0)
      }
    }
  })

  test('CUSTOM_MESSAGE throws on short payload (< 8 bytes)', () => {
    expect(() => decodeEvent(makeEvent(LOG_TYPE.CUSTOM_MESSAGE, new Uint8Array(4)))).toThrow(
      EventDecodeError,
    )
  })

  // ── unknown type ──────────────────────────────────────────────────────────

  test('unknown logType throws EventDecodeError', () => {
    expect(() => decodeEvent(makeEvent(99, new Uint8Array(32)))).toThrow(EventDecodeError)
  })

  // ── non-string event.data ────────────────────────────────────────────────

  test('throws when event.data is not a string', () => {
    const event = {
      tick: 1000,
      logId: 1n,
      contractIndex: 0,
      logType: LOG_TYPE.QU_TRANSFER,
      data: new Uint8Array(72) as unknown as string,
      isCatchUp: false,
    }
    expect(() => decodeEvent(event)).toThrow(EventDecodeError)
  })

  // ── ASSET_ISSUANCE ──────────────────────────────────────────────────────

  test('ASSET_ISSUANCE decodes issuer, numberOfShares, managingContractIndex, assetName, numberOfDecimalPlaces, unitOfMeasurement', () => {
    const buf = new Uint8Array(63)
    writeIdentity(buf, 0, 0x10) // issuer
    writeInt64LE(buf, 32, 5000n) // numberOfShares
    writeInt64LE(buf, 40, 3n) // managingContractIndex
    // assetName at offset 48: "QX\0\0\0\0\0"
    buf[48] = 0x51 // 'Q'
    buf[49] = 0x58 // 'X'
    buf[55] = 2 // numberOfDecimalPlaces
    // unitOfMeasurement at offset 56: "token\0\0"
    buf[56] = 0x74 // 't'
    buf[57] = 0x6f // 'o'
    buf[58] = 0x6b // 'k'
    buf[59] = 0x65 // 'e'
    buf[60] = 0x6e // 'n'

    const event = decodeEvent(makeEvent(LOG_TYPE.ASSET_ISSUANCE, buf))
    expect(event.logType).toBe(LOG_TYPE.ASSET_ISSUANCE)
    expect(event.tick).toBe(1000)
    if (event.logType === LOG_TYPE.ASSET_ISSUANCE) {
      expect(typeof event.data.issuer).toBe('string')
      expect(event.data.issuer).toHaveLength(60)
      expect(event.data.numberOfShares).toBe(5000n)
      expect(event.data.managingContractIndex).toBe(3)
      expect(event.data.assetName).toBe('QX')
      expect(event.data.numberOfDecimalPlaces).toBe(2)
      expect(event.data.unitOfMeasurement).toBe('token')
    }
  })

  test('ASSET_ISSUANCE throws on short payload', () => {
    expect(() => decodeEvent(makeEvent(LOG_TYPE.ASSET_ISSUANCE, new Uint8Array(10)))).toThrow(
      EventDecodeError,
    )
  })

  // ── ASSET_OWNERSHIP_CHANGE ──────────────────────────────────────────────

  test('ASSET_OWNERSHIP_CHANGE decodes source, destination, issuer, numberOfShares, asset details', () => {
    const buf = new Uint8Array(127)
    writeIdentity(buf, 0, 0x11) // source
    writeIdentity(buf, 32, 0x22) // destination
    writeIdentity(buf, 64, 0x33) // issuer
    writeInt64LE(buf, 96, 2500n) // numberOfShares
    writeInt64LE(buf, 104, 5n) // managingContractIndex
    // assetName at offset 112: "QUTIL\0\0"
    buf[112] = 0x51 // 'Q'
    buf[113] = 0x55 // 'U'
    buf[114] = 0x54 // 'T'
    buf[115] = 0x49 // 'I'
    buf[116] = 0x4c // 'L'
    buf[119] = 8 // numberOfDecimalPlaces
    // unitOfMeasurement at offset 120: "USD\0\0\0\0"
    buf[120] = 0x55 // 'U'
    buf[121] = 0x53 // 'S'
    buf[122] = 0x44 // 'D'

    const event = decodeEvent(makeEvent(LOG_TYPE.ASSET_OWNERSHIP_CHANGE, buf))
    expect(event.logType).toBe(LOG_TYPE.ASSET_OWNERSHIP_CHANGE)
    if (event.logType === LOG_TYPE.ASSET_OWNERSHIP_CHANGE) {
      expect(typeof event.data.source).toBe('string')
      expect(event.data.source).toHaveLength(60)
      expect(typeof event.data.destination).toBe('string')
      expect(event.data.destination).toHaveLength(60)
      expect(typeof event.data.issuer).toBe('string')
      expect(event.data.issuer).toHaveLength(60)
      expect(event.data.numberOfShares).toBe(2500n)
      expect(event.data.managingContractIndex).toBe(5)
      expect(event.data.assetName).toBe('QUTIL')
      expect(event.data.numberOfDecimalPlaces).toBe(8)
      expect(event.data.unitOfMeasurement).toBe('USD')
    }
  })

  test('ASSET_OWNERSHIP_CHANGE throws on short payload', () => {
    expect(() =>
      decodeEvent(makeEvent(LOG_TYPE.ASSET_OWNERSHIP_CHANGE, new Uint8Array(50))),
    ).toThrow(EventDecodeError)
  })

  // ── ASSET_POSSESSION_CHANGE ─────────────────────────────────────────────

  test('ASSET_POSSESSION_CHANGE decodes with same layout as ownership change', () => {
    const buf = new Uint8Array(127)
    writeIdentity(buf, 0, 0x44) // source
    writeIdentity(buf, 32, 0x55) // destination
    writeIdentity(buf, 64, 0x66) // issuer
    writeInt64LE(buf, 96, 100n) // numberOfShares
    writeInt64LE(buf, 104, 1n) // managingContractIndex
    buf[112] = 0x41 // 'A'
    buf[119] = 0 // numberOfDecimalPlaces
    buf[120] = 0x42 // 'B'

    const event = decodeEvent(makeEvent(LOG_TYPE.ASSET_POSSESSION_CHANGE, buf))
    expect(event.logType).toBe(LOG_TYPE.ASSET_POSSESSION_CHANGE)
    if (event.logType === LOG_TYPE.ASSET_POSSESSION_CHANGE) {
      expect(event.data.numberOfShares).toBe(100n)
      expect(event.data.managingContractIndex).toBe(1)
      expect(event.data.assetName).toBe('A')
      expect(event.data.numberOfDecimalPlaces).toBe(0)
      expect(event.data.unitOfMeasurement).toBe('B')
    }
  })

  test('ASSET_POSSESSION_CHANGE throws on short payload', () => {
    expect(() =>
      decodeEvent(makeEvent(LOG_TYPE.ASSET_POSSESSION_CHANGE, new Uint8Array(50))),
    ).toThrow(EventDecodeError)
  })

  // ── CONTRACT_WARNING_MESSAGE ────────────────────────────────────────────

  test('CONTRACT_WARNING_MESSAGE decodes contractIndex and messageType', () => {
    const buf = new Uint8Array(8)
    writeUint32LE(buf, 0, 10)
    writeUint32LE(buf, 4, 99)

    const event = decodeEvent(makeEvent(LOG_TYPE.CONTRACT_WARNING_MESSAGE, buf))
    expect(event.logType).toBe(LOG_TYPE.CONTRACT_WARNING_MESSAGE)
    if (event.logType === LOG_TYPE.CONTRACT_WARNING_MESSAGE) {
      expect(event.data.contractIndex).toBe(10)
      expect(event.data.contractMessageType).toBe(99)
    }
  })

  test('CONTRACT_WARNING_MESSAGE throws on short payload', () => {
    expect(() =>
      decodeEvent(makeEvent(LOG_TYPE.CONTRACT_WARNING_MESSAGE, new Uint8Array(4))),
    ).toThrow(EventDecodeError)
  })

  // ── CONTRACT_INFORMATION_MESSAGE ────────────────────────────────────────

  test('CONTRACT_INFORMATION_MESSAGE decodes contractIndex and messageType', () => {
    const buf = new Uint8Array(8)
    writeUint32LE(buf, 0, 20)
    writeUint32LE(buf, 4, 77)

    const event = decodeEvent(makeEvent(LOG_TYPE.CONTRACT_INFORMATION_MESSAGE, buf))
    expect(event.logType).toBe(LOG_TYPE.CONTRACT_INFORMATION_MESSAGE)
    if (event.logType === LOG_TYPE.CONTRACT_INFORMATION_MESSAGE) {
      expect(event.data.contractIndex).toBe(20)
      expect(event.data.contractMessageType).toBe(77)
    }
  })

  test('CONTRACT_INFORMATION_MESSAGE throws on short payload', () => {
    expect(() =>
      decodeEvent(makeEvent(LOG_TYPE.CONTRACT_INFORMATION_MESSAGE, new Uint8Array(2))),
    ).toThrow(EventDecodeError)
  })

  // ── CONTRACT_DEBUG_MESSAGE ──────────────────────────────────────────────

  test('CONTRACT_DEBUG_MESSAGE decodes contractIndex and messageType', () => {
    const buf = new Uint8Array(8)
    writeUint32LE(buf, 0, 30)
    writeUint32LE(buf, 4, 55)

    const event = decodeEvent(makeEvent(LOG_TYPE.CONTRACT_DEBUG_MESSAGE, buf))
    expect(event.logType).toBe(LOG_TYPE.CONTRACT_DEBUG_MESSAGE)
    if (event.logType === LOG_TYPE.CONTRACT_DEBUG_MESSAGE) {
      expect(event.data.contractIndex).toBe(30)
      expect(event.data.contractMessageType).toBe(55)
    }
  })

  test('CONTRACT_DEBUG_MESSAGE throws on short payload', () => {
    expect(() =>
      decodeEvent(makeEvent(LOG_TYPE.CONTRACT_DEBUG_MESSAGE, new Uint8Array(1))),
    ).toThrow(EventDecodeError)
  })

  // ── ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE ───────────────────────────

  test('ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE decodes all fields', () => {
    const buf = new Uint8Array(87)
    writeIdentity(buf, 0, 0x70) // owner
    writeIdentity(buf, 32, 0x80) // issuer
    writeUint32LE(buf, 64, 2) // sourceContractIndex
    writeUint32LE(buf, 68, 5) // destinationContractIndex
    writeInt64LE(buf, 72, 10000n) // numberOfShares
    // assetName at offset 80: "TEST\0\0\0"
    buf[80] = 0x54 // 'T'
    buf[81] = 0x45 // 'E'
    buf[82] = 0x53 // 'S'
    buf[83] = 0x54 // 'T'

    const event = decodeEvent(makeEvent(LOG_TYPE.ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE, buf))
    expect(event.logType).toBe(LOG_TYPE.ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE)
    if (event.logType === LOG_TYPE.ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE) {
      expect(typeof event.data.owner).toBe('string')
      expect(event.data.owner).toHaveLength(60)
      expect(typeof event.data.issuer).toBe('string')
      expect(event.data.issuer).toHaveLength(60)
      expect(event.data.sourceContractIndex).toBe(2)
      expect(event.data.destinationContractIndex).toBe(5)
      expect(event.data.numberOfShares).toBe(10000n)
      expect(event.data.assetName).toBe('TEST')
    }
  })

  test('ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE throws on short payload', () => {
    expect(() =>
      decodeEvent(makeEvent(LOG_TYPE.ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE, new Uint8Array(10))),
    ).toThrow(EventDecodeError)
  })

  // ── ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE ──────────────────────────

  test('ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE decodes all fields', () => {
    const buf = new Uint8Array(119)
    writeIdentity(buf, 0, 0x71) // possessor
    writeIdentity(buf, 32, 0x72) // owner
    writeIdentity(buf, 64, 0x73) // issuer
    writeUint32LE(buf, 96, 3) // sourceContractIndex
    writeUint32LE(buf, 100, 7) // destinationContractIndex
    writeInt64LE(buf, 104, 7777n) // numberOfShares
    // assetName at offset 112: "GOLD\0\0\0"
    buf[112] = 0x47 // 'G'
    buf[113] = 0x4f // 'O'
    buf[114] = 0x4c // 'L'
    buf[115] = 0x44 // 'D'

    const event = decodeEvent(makeEvent(LOG_TYPE.ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE, buf))
    expect(event.logType).toBe(LOG_TYPE.ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE)
    if (event.logType === LOG_TYPE.ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE) {
      expect(typeof event.data.possessor).toBe('string')
      expect(event.data.possessor).toHaveLength(60)
      expect(typeof event.data.owner).toBe('string')
      expect(event.data.owner).toHaveLength(60)
      expect(typeof event.data.issuer).toBe('string')
      expect(event.data.issuer).toHaveLength(60)
      expect(event.data.sourceContractIndex).toBe(3)
      expect(event.data.destinationContractIndex).toBe(7)
      expect(event.data.numberOfShares).toBe(7777n)
      expect(event.data.assetName).toBe('GOLD')
    }
  })

  test('ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE throws on short payload', () => {
    expect(() =>
      decodeEvent(
        makeEvent(LOG_TYPE.ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE, new Uint8Array(20)),
      ),
    ).toThrow(EventDecodeError)
  })

  // ── ORACLE_QUERY_STATUS_CHANGE ─────────────────────────────────────────

  test('ORACLE_QUERY_STATUS_CHANGE decodes queryingEntity, queryId, interfaceIndex, queryType, queryStatus', () => {
    const buf = new Uint8Array(46)
    writeIdentity(buf, 0, 0x90) // queryingEntity
    writeInt64LE(buf, 32, 42n) // queryId
    writeUint32LE(buf, 40, 5) // interfaceIndex
    buf[44] = 2 // queryType
    buf[45] = 1 // queryStatus

    const event = decodeEvent(makeEvent(LOG_TYPE.ORACLE_QUERY_STATUS_CHANGE, buf))
    expect(event.logType).toBe(LOG_TYPE.ORACLE_QUERY_STATUS_CHANGE)
    if (event.logType === LOG_TYPE.ORACLE_QUERY_STATUS_CHANGE) {
      expect(typeof event.data.queryingEntity).toBe('string')
      expect(event.data.queryingEntity).toHaveLength(60)
      expect(event.data.queryId).toBe(42n)
      expect(event.data.interfaceIndex).toBe(5)
      expect(event.data.queryType).toBe(2)
      expect(event.data.queryStatus).toBe(1)
    }
  })

  test('ORACLE_QUERY_STATUS_CHANGE throws on short payload', () => {
    expect(() =>
      decodeEvent(makeEvent(LOG_TYPE.ORACLE_QUERY_STATUS_CHANGE, new Uint8Array(10))),
    ).toThrow(EventDecodeError)
  })

  // ── ORACLE_SUBSCRIBER_LOG_MESSAGE ──────────────────────────────────────

  test('ORACLE_SUBSCRIBER_LOG_MESSAGE decodes subscriptionId, interfaceIndex, contractIndex, periodMillis, firstQueryTimestamp', () => {
    const buf = new Uint8Array(24)
    new DataView(buf.buffer).setInt32(0, 7, true) // subscriptionId
    writeUint32LE(buf, 4, 3) // interfaceIndex
    writeUint32LE(buf, 8, 12) // contractIndex
    writeUint32LE(buf, 12, 5000) // periodMillis
    writeUint64LE(buf, 16, 100000n) // firstQueryTimestamp

    const event = decodeEvent(makeEvent(LOG_TYPE.ORACLE_SUBSCRIBER_LOG_MESSAGE, buf))
    expect(event.logType).toBe(LOG_TYPE.ORACLE_SUBSCRIBER_LOG_MESSAGE)
    if (event.logType === LOG_TYPE.ORACLE_SUBSCRIBER_LOG_MESSAGE) {
      expect(event.data.subscriptionId).toBe(7)
      expect(event.data.interfaceIndex).toBe(3)
      expect(event.data.contractIndex).toBe(12)
      expect(event.data.periodMillis).toBe(5000)
      expect(event.data.firstQueryTimestamp).toBe(100000n)
    }
  })

  test('ORACLE_SUBSCRIBER_LOG_MESSAGE throws on short payload', () => {
    expect(() =>
      decodeEvent(makeEvent(LOG_TYPE.ORACLE_SUBSCRIBER_LOG_MESSAGE, new Uint8Array(8))),
    ).toThrow(EventDecodeError)
  })

  // ── Additional short-payload coverage ──────────────────────────────────

  test('BURNING throws on short payload', () => {
    expect(() => decodeEvent(makeEvent(LOG_TYPE.BURNING, new Uint8Array(10)))).toThrow(
      EventDecodeError,
    )
  })

  test('SPECTRUM_STATS throws on short payload', () => {
    expect(() => decodeEvent(makeEvent(LOG_TYPE.SPECTRUM_STATS, new Uint8Array(100)))).toThrow(
      EventDecodeError,
    )
  })

  test('CONTRACT_RESERVE_DEDUCTION throws on short payload', () => {
    expect(() =>
      decodeEvent(makeEvent(LOG_TYPE.CONTRACT_RESERVE_DEDUCTION, new Uint8Array(8))),
    ).toThrow(EventDecodeError)
  })

  test('DUST_BURNING with zero burns decodes to empty array', () => {
    const buf = new Uint8Array(2)
    writeUint16LE(buf, 0, 0)

    const event = decodeEvent(makeEvent(LOG_TYPE.DUST_BURNING, buf))
    if (event.logType === LOG_TYPE.DUST_BURNING) {
      expect(event.data.burns).toHaveLength(0)
    }
  })

  test('DUST_BURNING throws when declared count exceeds payload', () => {
    const buf = new Uint8Array(2)
    writeUint16LE(buf, 0, 5) // claims 5 burns but no data follows
    expect(() => decodeEvent(makeEvent(LOG_TYPE.DUST_BURNING, buf))).toThrow(EventDecodeError)
  })
})

// ── eventFilter builder ───────────────────────────────────────────────────

describe('eventFilter', () => {
  test('build() returns empty filter when no methods called', () => {
    const filter = eventFilter().build()
    expect(filter).toEqual({})
  })

  test('forIdentity sets identity', () => {
    const id = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' as Identity
    const filter = eventFilter().forIdentity(id).build()
    expect(filter.identity).toBe(id)
    expect(filter.logTypes).toBeUndefined()
    expect(filter.contractIndex).toBeUndefined()
  })

  test('ofTypes sets logTypes array', () => {
    const filter = eventFilter().ofTypes(LOG_TYPE.QU_TRANSFER, LOG_TYPE.BURNING).build()
    expect(filter.logTypes).toEqual([LOG_TYPE.QU_TRANSFER, LOG_TYPE.BURNING])
  })

  test('forContract sets contractIndex', () => {
    const filter = eventFilter().forContract(42).build()
    expect(filter.contractIndex).toBe(42)
  })

  test('fromTick and toTick set tick range', () => {
    const filter = eventFilter().fromTick(100).toTick(200).build()
    expect(filter.fromTick).toBe(100)
    expect(filter.toTick).toBe(200)
  })

  test('chaining all methods produces complete filter', () => {
    const id = 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB' as Identity
    const filter = eventFilter()
      .forIdentity(id)
      .ofTypes(LOG_TYPE.ASSET_ISSUANCE, LOG_TYPE.ASSET_OWNERSHIP_CHANGE)
      .forContract(3)
      .fromTick(500)
      .toTick(1000)
      .build()

    expect(filter.identity).toBe(id)
    expect(filter.logTypes).toEqual([LOG_TYPE.ASSET_ISSUANCE, LOG_TYPE.ASSET_OWNERSHIP_CHANGE])
    expect(filter.contractIndex).toBe(3)
    expect(filter.fromTick).toBe(500)
    expect(filter.toTick).toBe(1000)
  })

  test('build() returns a copy, not a reference', () => {
    const builder = eventFilter().forContract(10).fromTick(1)
    const a = builder.build()
    const b = builder.build()
    expect(a).toEqual(b)
    expect(a).not.toBe(b)
  })

  test('toBobFilter includes identity, scIndex, fromTick, toTick', () => {
    const id = 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC' as Identity
    const bobFilter = eventFilter()
      .forIdentity(id)
      .forContract(5)
      .fromTick(100)
      .toTick(200)
      .toBobFilter()

    expect(bobFilter.identity).toBe(id)
    expect(bobFilter.scIndex).toBe(5)
    expect(bobFilter.fromTick).toBe(100)
    expect(bobFilter.toTick).toBe(200)
  })

  test('toBobFilter maps only the first logType (Bob API limitation)', () => {
    const bobFilter = eventFilter()
      .ofTypes(LOG_TYPE.QU_TRANSFER, LOG_TYPE.BURNING, LOG_TYPE.DUST_BURNING)
      .toBobFilter()

    expect(bobFilter.logType).toBe(LOG_TYPE.QU_TRANSFER)
  })

  test('toBobFilter omits fields when not set', () => {
    const f = eventFilter().toBobFilter()
    expect(f.identity).toBeUndefined()
    expect(f.contractIndex).toBeUndefined()
    expect(f.logType).toBeUndefined()
    expect(f.fromTick).toBeUndefined()
    expect(f.toTick).toBeUndefined()
  })

  test('toBobFilter with single logType', () => {
    const bobFilter = eventFilter().ofTypes(LOG_TYPE.SPECTRUM_STATS).toBobFilter()

    expect(bobFilter.logType).toBe(LOG_TYPE.SPECTRUM_STATS)
  })
})
