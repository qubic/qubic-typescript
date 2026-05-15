import type { BobLogEvent } from '@qubic.ts/bob'
import { publicKeyToIdentity } from '@qubic.ts/crypto'
import { LOG_TYPE } from '@qubic.ts/types'
import { EventDecodeError } from './errors.js'
import type {
  AssetIssuanceData,
  AssetOwnershipChangeData,
  AssetOwnershipManagingContractChangeData,
  AssetPossessionChangeData,
  AssetPossessionManagingContractChangeData,
  BurningData,
  ContractReserveDeductionData,
  DustBurningData,
  OracleQueryStatusData,
  OracleSubscriberLogMessageData,
  QuTransferData,
  SmartContractMessageData,
  SpectrumStatsData,
  TypedEvent,
} from './types.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i) & 0xff
  }
  return bytes
}

function readPublicKey(view: DataView, offset: number): Uint8Array {
  return new Uint8Array(view.buffer, view.byteOffset + offset, 32)
}

function readIdentity(view: DataView, offset: number) {
  return publicKeyToIdentity(readPublicKey(view, offset))
}

function readAssetName(view: DataView, offset: number): string {
  let name = ''
  for (let i = 0; i < 7; i++) {
    const b = view.getUint8(offset + i)
    if (b === 0) break
    name += String.fromCharCode(b)
  }
  return name
}

function assertMinSize(logType: number, actual: number, expected: number) {
  if (actual < expected)
    throw new EventDecodeError(logType, `payload too short: need ${expected}, got ${actual}`)
}

// ── Per-type decoders ─────────────────────────────────────────────────────────

function decodeQuTransfer(v: DataView, logType: number): QuTransferData {
  assertMinSize(logType, v.byteLength, 72)
  return {
    source: readIdentity(v, 0),
    destination: readIdentity(v, 32),
    amount: v.getBigInt64(64, true),
  }
}

function decodeAssetIssuance(v: DataView, logType: number): AssetIssuanceData {
  assertMinSize(logType, v.byteLength, 63)
  return {
    issuer: readIdentity(v, 0),
    numberOfShares: v.getBigInt64(32, true),
    managingContractIndex: Number(v.getBigInt64(40, true)),
    assetName: readAssetName(v, 48),
    numberOfDecimalPlaces: v.getUint8(55),
    unitOfMeasurement: readAssetName(v, 56),
  }
}

function decodeAssetOwnershipChange(v: DataView, logType: number): AssetOwnershipChangeData {
  assertMinSize(logType, v.byteLength, 127)
  return {
    source: readIdentity(v, 0),
    destination: readIdentity(v, 32),
    issuer: readIdentity(v, 64),
    numberOfShares: v.getBigInt64(96, true),
    managingContractIndex: Number(v.getBigInt64(104, true)),
    assetName: readAssetName(v, 112),
    numberOfDecimalPlaces: v.getUint8(119),
    unitOfMeasurement: readAssetName(v, 120),
  }
}

function decodeAssetPossessionChange(v: DataView, logType: number): AssetPossessionChangeData {
  assertMinSize(logType, v.byteLength, 127)
  return {
    source: readIdentity(v, 0),
    destination: readIdentity(v, 32),
    issuer: readIdentity(v, 64),
    numberOfShares: v.getBigInt64(96, true),
    managingContractIndex: Number(v.getBigInt64(104, true)),
    assetName: readAssetName(v, 112),
    numberOfDecimalPlaces: v.getUint8(119),
    unitOfMeasurement: readAssetName(v, 120),
  }
}

function decodeSmartContractMessage(v: DataView, logType: number): SmartContractMessageData {
  assertMinSize(logType, v.byteLength, 8)
  return {
    contractIndex: v.getUint32(0, true),
    contractMessageType: v.getUint32(4, true),
  }
}

function decodeBurning(v: DataView, logType: number): BurningData {
  assertMinSize(logType, v.byteLength, 44)
  return {
    source: readIdentity(v, 0),
    amount: v.getBigInt64(32, true),
    contractIndex: v.getUint32(40, true),
  }
}

function decodeDustBurning(v: DataView, logType: number): DustBurningData {
  assertMinSize(logType, v.byteLength, 2)
  const count = v.getUint16(0, true)
  assertMinSize(logType, v.byteLength, 2 + count * 40)
  const burns: DustBurningData['burns'] = []
  for (let i = 0; i < count; i++) {
    const base = 2 + i * 40
    burns.push({
      source: readIdentity(v, base),
      amount: v.getBigUint64(base + 32, true),
    })
  }
  return { burns }
}

function decodeSpectrumStats(v: DataView, logType: number): SpectrumStatsData {
  assertMinSize(logType, v.byteLength, 28)
  return {
    totalAmount: v.getBigUint64(0, true),
    dustThresholdBurnAll: v.getBigUint64(8, true),
    dustThresholdBurnHalf: v.getBigUint64(16, true),
    numberOfEntities: v.getUint32(24, true),
  }
}

function decodeAssetOwnershipManagingContractChange(
  v: DataView,
  logType: number,
): AssetOwnershipManagingContractChangeData {
  assertMinSize(logType, v.byteLength, 87)
  return {
    owner: readIdentity(v, 0),
    issuer: readIdentity(v, 32),
    sourceContractIndex: v.getUint32(64, true),
    destinationContractIndex: v.getUint32(68, true),
    numberOfShares: v.getBigInt64(72, true),
    assetName: readAssetName(v, 80),
  }
}

function decodeAssetPossessionManagingContractChange(
  v: DataView,
  logType: number,
): AssetPossessionManagingContractChangeData {
  assertMinSize(logType, v.byteLength, 119)
  return {
    possessor: readIdentity(v, 0),
    owner: readIdentity(v, 32),
    issuer: readIdentity(v, 64),
    sourceContractIndex: v.getUint32(96, true),
    destinationContractIndex: v.getUint32(100, true),
    numberOfShares: v.getBigInt64(104, true),
    assetName: readAssetName(v, 112),
  }
}

function decodeContractReserveDeduction(
  v: DataView,
  logType: number,
): ContractReserveDeductionData {
  assertMinSize(logType, v.byteLength, 20)
  return {
    deductedAmount: v.getBigUint64(0, true),
    remainingAmount: v.getBigInt64(8, true),
    contractIndex: v.getUint32(16, true),
  }
}

function decodeOracleQueryStatusChange(v: DataView, logType: number): OracleQueryStatusData {
  assertMinSize(logType, v.byteLength, 46)
  return {
    queryingEntity: readIdentity(v, 0),
    queryId: v.getBigInt64(32, true),
    interfaceIndex: v.getUint32(40, true),
    queryType: v.getUint8(44),
    queryStatus: v.getUint8(45),
  }
}

function decodeOracleSubscriberLogMessage(
  v: DataView,
  logType: number,
): OracleSubscriberLogMessageData {
  assertMinSize(logType, v.byteLength, 24)
  return {
    subscriptionId: v.getInt32(0, true),
    interfaceIndex: v.getUint32(4, true),
    contractIndex: v.getUint32(8, true),
    periodMillis: v.getUint32(12, true),
    firstQueryTimestamp: v.getBigUint64(16, true),
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Decodes a BobLogEvent's raw binary payload into a fully typed TypedEvent.
 * @throws {EventDecodeError} if the payload is too short or the logType is unknown.
 */
export function decodeEvent(event: BobLogEvent): TypedEvent {
  const bytes = base64ToBytes(event.data as string)
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const { tick, logType } = event

  switch (logType) {
    case LOG_TYPE.QU_TRANSFER:
      return { logType, tick, data: decodeQuTransfer(v, logType) }
    case LOG_TYPE.ASSET_ISSUANCE:
      return { logType, tick, data: decodeAssetIssuance(v, logType) }
    case LOG_TYPE.ASSET_OWNERSHIP_CHANGE:
      return { logType, tick, data: decodeAssetOwnershipChange(v, logType) }
    case LOG_TYPE.ASSET_POSSESSION_CHANGE:
      return { logType, tick, data: decodeAssetPossessionChange(v, logType) }
    case LOG_TYPE.CONTRACT_ERROR_MESSAGE:
    case LOG_TYPE.CONTRACT_WARNING_MESSAGE:
    case LOG_TYPE.CONTRACT_INFORMATION_MESSAGE:
    case LOG_TYPE.CONTRACT_DEBUG_MESSAGE:
      return { logType, tick, data: decodeSmartContractMessage(v, logType) }
    case LOG_TYPE.BURNING:
      return { logType, tick, data: decodeBurning(v, logType) }
    case LOG_TYPE.DUST_BURNING:
      return { logType, tick, data: decodeDustBurning(v, logType) }
    case LOG_TYPE.SPECTRUM_STATS:
      return { logType, tick, data: decodeSpectrumStats(v, logType) }
    case LOG_TYPE.ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE:
      return { logType, tick, data: decodeAssetOwnershipManagingContractChange(v, logType) }
    case LOG_TYPE.ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE:
      return { logType, tick, data: decodeAssetPossessionManagingContractChange(v, logType) }
    case LOG_TYPE.CONTRACT_RESERVE_DEDUCTION:
      return { logType, tick, data: decodeContractReserveDeduction(v, logType) }
    case LOG_TYPE.ORACLE_QUERY_STATUS_CHANGE:
      return { logType, tick, data: decodeOracleQueryStatusChange(v, logType) }
    case LOG_TYPE.ORACLE_SUBSCRIBER_LOG_MESSAGE:
      return { logType, tick, data: decodeOracleSubscriberLogMessage(v, logType) }
    case LOG_TYPE.CUSTOM_MESSAGE:
      return { logType, tick, data: bytes }
    default:
      throw new EventDecodeError(logType, 'unknown log type')
  }
}
