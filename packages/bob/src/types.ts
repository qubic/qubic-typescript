import type { Base64, Identity, LogType, TxHash } from '@qubic.ts/types'

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
  /** Raw payload; decoded by @qubic.ts/events */
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

export interface BobTickData {
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
