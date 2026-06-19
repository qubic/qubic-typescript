import type { Base64, Identity, LogType, TxHash } from '@qubic.org/types'

export interface BobLogFilter {
  scIndex?: number
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

/** Full transaction object returned inside a tick when `includeTransactions=true`. */
export interface BobTickTransaction {
  hash: TxHash
  from: Identity
  to: Identity
  amount: bigint
  inputType: number
  inputSize: number
  inputData: string
}

/**
 * Tick metadata as indexed by the Bob indexer.
 * Not to be confused with the core protocol TickData.
 *
 * When fetched with `includeTransactions=false`, `transactions` is `TxHash[]`.
 * When fetched with `includeTransactions=true`, `transactions` is `BobTickTransaction[]`.
 */
export interface BobIndexedTick {
  tickNumber: number
  epoch: number
  computorIndex: number
  signature: string
  tickHash: string
  timestamp: number
  timestampISO: string
  millisecond: number
  timelock: string
  transactionCount: number
  transactions: TxHash[] | BobTickTransaction[]
  previousTickHash: string
}

/** Transaction as returned by `qubic_getTransactionByHash`. */
export interface BobTransaction {
  hash: TxHash
  from: Identity
  to: Identity
  amount: bigint
  tick: number
  inputType: number
  inputSize: number
  inputData: string
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

/** Transaction receipt as returned by qubic_getTransactionReceipt. */
export interface BobTransactionReceipt {
  hash: TxHash
  from: Identity
  to: Identity
  amount: bigint
  tick: number
  inputType: number
  inputSize: number
  inputData: string
  /** Logs emitted by the transaction (present when the server returns them). */
  logs?: BobRestLogEvent[]
}

/** Filter for qubic_findLogIds. */
export interface BobFindLogFilter {
  scIndex: number
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

/** Sync status returned by qubic_syncing. `false` when fully synced. */
export type BobSyncStatus =
  | false
  | {
      epoch: number
      initialTick: number
      targetTickVoteSignature: number
      computorListSignature: number
      currentFetchingTick: number
      currentFetchingLogTick: number
      currentVerifyLoggingTick: number
      currentIndexingTick: number
      lastSeenNetworkTick?: number
      syncing: true
      progress: number
    }

/** Node status returned by qubic_status (RPC variant). */
export interface BobRpcStatus {
  currentTick: number
  currentEpoch: number
  verifiedTick: number
  bmConnections: number
  [key: string]: unknown
}
