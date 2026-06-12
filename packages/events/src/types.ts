import type { CustomMessageSubtype, Identity, LogType } from '@qubic.org/types'
import { CUSTOM_MESSAGE_OP, LOG_TYPE, customMessageOpLabel } from '@qubic.org/types'

export type {
  CustomMessageSubtype,
  EndDistributeDividendsCustomMessage,
  EndEpochCustomMessage,
  LogType,
  StartDistributeDividendsCustomMessage,
  StartEpochCustomMessage,
  UnknownCustomMessage,
} from '@qubic.org/types'
export { CUSTOM_MESSAGE_OP, LOG_TYPE, customMessageOpLabel }

// ── Event data interfaces ─────────────────────────────────────────────────────

export interface QuTransferData {
  source: Identity
  destination: Identity
  amount: bigint
}

export interface AssetIssuanceData {
  issuer: Identity
  numberOfShares: bigint
  managingContractIndex: number
  assetName: string
  numberOfDecimalPlaces: number
  unitOfMeasurement: string
}

export interface AssetOwnershipChangeData {
  source: Identity
  destination: Identity
  issuer: Identity
  numberOfShares: bigint
  managingContractIndex: number
  assetName: string
  numberOfDecimalPlaces: number
  unitOfMeasurement: string
}

export interface AssetPossessionChangeData {
  source: Identity
  destination: Identity
  issuer: Identity
  numberOfShares: bigint
  managingContractIndex: number
  assetName: string
  numberOfDecimalPlaces: number
  unitOfMeasurement: string
}

export interface SmartContractMessageData {
  contractIndex: number
  contractMessageType: number
}

export interface BurningData {
  source: Identity
  amount: bigint
  contractIndex: number
}

export interface DustBurningData {
  burns: Array<{ source: Identity; amount: bigint }>
}

export interface SpectrumStatsData {
  totalAmount: bigint
  dustThresholdBurnAll: bigint
  dustThresholdBurnHalf: bigint
  numberOfEntities: number
}

export interface AssetOwnershipManagingContractChangeData {
  owner: Identity
  issuer: Identity
  sourceContractIndex: number
  destinationContractIndex: number
  numberOfShares: bigint
  assetName: string
}

export interface AssetPossessionManagingContractChangeData {
  possessor: Identity
  owner: Identity
  issuer: Identity
  sourceContractIndex: number
  destinationContractIndex: number
  numberOfShares: bigint
  assetName: string
}

export interface ContractReserveDeductionData {
  deductedAmount: bigint
  remainingAmount: bigint
  contractIndex: number
}

export interface OracleQueryStatusData {
  queryingEntity: Identity
  queryId: bigint
  interfaceIndex: number
  queryType: number
  queryStatus: number
}

export interface OracleSubscriberLogMessageData {
  subscriptionId: number
  interfaceIndex: number
  contractIndex: number
  periodMillis: number
  firstQueryTimestamp: bigint
}

// ── CustomMessage subtypes ────────────────────────────────────────────────────

/**
 * A decoded custom message event (log type 255).
 *
 * The `kind` discriminant identifies the message subtype. Known protocol
 * messages (epoch transitions, dividend distribution) carry no extra
 * payload. Unknown messages include the raw `messageType` and any
 * trailing `payload` bytes.
 */
export type CustomMessageData = CustomMessageSubtype

export interface RawQubicLogEvent {
  tick: number
  logType: LogType
  data: string
}

// ── EventFilter ───────────────────────────────────────────────────────────────

export interface EventFilter {
  contractIndex?: number
  logTypes?: Array<(typeof LOG_TYPE)[keyof typeof LOG_TYPE]>
  identity?: Identity
  fromTick?: number
  toTick?: number
}

// ── TypedEvent discriminated union ────────────────────────────────────────────

export type TypedEvent =
  | { logType: typeof LOG_TYPE.QU_TRANSFER; tick: number; data: QuTransferData }
  | { logType: typeof LOG_TYPE.ASSET_ISSUANCE; tick: number; data: AssetIssuanceData }
  | {
      logType: typeof LOG_TYPE.ASSET_OWNERSHIP_CHANGE
      tick: number
      data: AssetOwnershipChangeData
    }
  | {
      logType: typeof LOG_TYPE.ASSET_POSSESSION_CHANGE
      tick: number
      data: AssetPossessionChangeData
    }
  | {
      logType: typeof LOG_TYPE.CONTRACT_ERROR_MESSAGE
      tick: number
      data: SmartContractMessageData
    }
  | {
      logType: typeof LOG_TYPE.CONTRACT_WARNING_MESSAGE
      tick: number
      data: SmartContractMessageData
    }
  | {
      logType: typeof LOG_TYPE.CONTRACT_INFORMATION_MESSAGE
      tick: number
      data: SmartContractMessageData
    }
  | {
      logType: typeof LOG_TYPE.CONTRACT_DEBUG_MESSAGE
      tick: number
      data: SmartContractMessageData
    }
  | { logType: typeof LOG_TYPE.BURNING; tick: number; data: BurningData }
  | { logType: typeof LOG_TYPE.DUST_BURNING; tick: number; data: DustBurningData }
  | { logType: typeof LOG_TYPE.SPECTRUM_STATS; tick: number; data: SpectrumStatsData }
  | {
      logType: typeof LOG_TYPE.ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE
      tick: number
      data: AssetOwnershipManagingContractChangeData
    }
  | {
      logType: typeof LOG_TYPE.ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE
      tick: number
      data: AssetPossessionManagingContractChangeData
    }
  | {
      logType: typeof LOG_TYPE.CONTRACT_RESERVE_DEDUCTION
      tick: number
      data: ContractReserveDeductionData
    }
  | {
      logType: typeof LOG_TYPE.ORACLE_QUERY_STATUS_CHANGE
      tick: number
      data: OracleQueryStatusData
    }
  | {
      logType: typeof LOG_TYPE.ORACLE_SUBSCRIBER_LOG_MESSAGE
      tick: number
      data: OracleSubscriberLogMessageData
    }
  | { logType: typeof LOG_TYPE.CUSTOM_MESSAGE; tick: number; data: CustomMessageData }
