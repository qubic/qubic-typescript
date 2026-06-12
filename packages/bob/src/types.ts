import type { Base64, Identity, LogType, TxHash } from '@qubic.org/types'

export interface BobLogFilter {
  contractIndex?: number
  logType?: LogType
  identity?: Identity
  fromTick?: number
  toTick?: number
}

export interface BobTransferFilter {
  identity?: Identity
  fromTick?: number
  toTick?: number
}

export interface BobLogEvent {
  tick: number
  logId: bigint
  contractIndex: number
  logType: LogType
  /** Raw payload; decoded by @qubic.org/events */
  data: Base64
  isCatchUp: boolean
}

export interface BobTransferEvent {
  tick: number
  logId: bigint
  source: Identity
  destination: Identity
  amount: bigint
  isCatchUp: boolean
}

export interface BobTickNotification {
  tick: number
  epoch: number
}

/** Tick metadata as indexed by the Bob indexer. Not to be confused with the core protocol TickData. */
export interface BobIndexedTick {
  tick: number
  epoch: number
  transactions: TxHash[]
}

export interface BobTransaction {
  hash: TxHash
  tick: number
  source: Identity
  destination: Identity
  amount: bigint
}

/** Epoch info as returned by qubic_getEpochInfo (RPC, with bigint log IDs). */
export interface BobRpcEpochInfo {
  epoch: number
  initialTick: number
  endTick: number
  endTickStartLogId: bigint
  endTickEndLogId: bigint
  lastIndexedTick: number
  latestLogId: bigint
}

/** Log event as returned by REST endpoints (getLogsByIdRange, findLogIds, transfer history). */
export interface BobRestLogEvent {
  logId: bigint
  tick: number
  epoch: number
  scIndex: number
  logType: number
  /** Parsed message payload — shape varies by logType. */
  message: unknown
}

/** Filter for qubic_findLogIds. */
export interface BobFindLogFilter {
  contractIndex: number
  logType: number
  fromTick: number
  toTick: number
  topic1?: Identity
  topic2?: Identity
  topic3?: Identity
}

/** Filter for qubic_getQuTransfers. */
export interface BobQuTransferFilter {
  identity: Identity
  fromTick: number
  toTick: number
}

/** Filter for qubic_getAssetTransfers. */
export interface BobAssetTransferFilter {
  identity: Identity
  issuer: Identity
  assetName: string
  fromTick: number
  toTick: number
}

/** Filter for qubic_getAllAssetTransfers. */
export interface BobAllAssetTransferFilter {
  issuer: Identity
  assetName: string
  fromTick: number
  toTick: number
}

/** Entry from qubic_getTickLogRanges. */
export interface BobTickLogRange {
  tick: number
  fromLogId: bigint | null
  length: bigint | null
}

/** Computor list as returned by qubic_getComputors. */
export interface BobComputorList {
  epoch: number
  identities: Identity[]
}
