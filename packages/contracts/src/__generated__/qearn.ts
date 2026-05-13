// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/registry'
import { buildPayload, decodePayload } from '@qubic.ts/registry'
import type { QubicRpcError } from '@qubic.ts/rpc'
import { type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '../result.js'

export const QEARN_CONTRACT_INDEX = 9

const STRUCTS: Record<string, NamedStruct> = {}

export const QEARN_LOCK_INPUT_TYPE = 6

export interface QearnLockOutput {
  returnCode: number
}

const QEARN_LOCK_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQearnLockOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QearnLockOutput {
  return decodePayload(data, QEARN_LOCK_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QearnLockOutput
}

export const QEARN_UNLOCK_INPUT_TYPE = 7

export interface QearnUnlockInput {
  amount: bigint
  lockedEpoch: number
}

const QEARN_UNLOCK_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'lockedEpoch',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function buildQearnUnlockInput(
  input: QearnUnlockInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QEARN_UNLOCK_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QearnUnlockOutput {
  returnCode: number
}

const QEARN_UNLOCK_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQearnUnlockOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QearnUnlockOutput {
  return decodePayload(data, QEARN_UNLOCK_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QearnUnlockOutput
}

export const QEARN_GET_LOCK_INFO_PER_EPOCH_INPUT_TYPE = 1
export const QEARN_GET_LOCK_INFO_PER_EPOCH_INPUT_SIZE = 4

export interface QearnGetLockInfoPerEpochInput {
  Epoch: number
}

const QEARN_GET_LOCK_INFO_PER_EPOCH_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'Epoch',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQearnGetLockInfoPerEpochInput(
  input: QearnGetLockInfoPerEpochInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QEARN_GET_LOCK_INFO_PER_EPOCH_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QearnGetLockInfoPerEpochOutput {
  lockedAmount: bigint
  bonusAmount: bigint
  currentLockedAmount: bigint
  currentBonusAmount: bigint
  yield: bigint
}

const QEARN_GET_LOCK_INFO_PER_EPOCH_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'lockedAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'bonusAmount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'currentLockedAmount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'currentBonusAmount',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'yield',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
]

export function decodeQearnGetLockInfoPerEpochOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QearnGetLockInfoPerEpochOutput {
  return decodePayload(data, QEARN_GET_LOCK_INFO_PER_EPOCH_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QearnGetLockInfoPerEpochOutput
}

export async function qearnGetLockInfoPerEpoch(
  live: SmartContractCaller,
  input: QearnGetLockInfoPerEpochInput,
  options?: ContractCallOptions,
): Promise<Result<QearnGetLockInfoPerEpochOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QEARN_CONTRACT_INDEX,
    inputType: QEARN_GET_LOCK_INFO_PER_EPOCH_INPUT_TYPE,
    inputSize: QEARN_GET_LOCK_INFO_PER_EPOCH_INPUT_SIZE,
    inputFields: QEARN_GET_LOCK_INFO_PER_EPOCH_INPUT_FIELDS,
    outputFields: QEARN_GET_LOCK_INFO_PER_EPOCH_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QEARN_GET_USER_LOCKED_INFO_INPUT_TYPE = 2
export const QEARN_GET_USER_LOCKED_INFO_INPUT_SIZE = 36

export interface QearnGetUserLockedInfoInput {
  user: string
  epoch: number
}

const QEARN_GET_USER_LOCKED_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'user',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'epoch',
    type: 'uint32',
    offset: 32,
    byteLength: 4,
  },
]

export function buildQearnGetUserLockedInfoInput(
  input: QearnGetUserLockedInfoInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QEARN_GET_USER_LOCKED_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QearnGetUserLockedInfoOutput {
  lockedAmount: bigint
}

const QEARN_GET_USER_LOCKED_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'lockedAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQearnGetUserLockedInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QearnGetUserLockedInfoOutput {
  return decodePayload(data, QEARN_GET_USER_LOCKED_INFO_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QearnGetUserLockedInfoOutput
}

export async function qearnGetUserLockedInfo(
  live: SmartContractCaller,
  input: QearnGetUserLockedInfoInput,
  options?: ContractCallOptions,
): Promise<Result<QearnGetUserLockedInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QEARN_CONTRACT_INDEX,
    inputType: QEARN_GET_USER_LOCKED_INFO_INPUT_TYPE,
    inputSize: QEARN_GET_USER_LOCKED_INFO_INPUT_SIZE,
    inputFields: QEARN_GET_USER_LOCKED_INFO_INPUT_FIELDS,
    outputFields: QEARN_GET_USER_LOCKED_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QEARN_GET_STATE_OF_ROUND_INPUT_TYPE = 3
export const QEARN_GET_STATE_OF_ROUND_INPUT_SIZE = 4

export interface QearnGetStateOfRoundInput {
  epoch: number
}

const QEARN_GET_STATE_OF_ROUND_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQearnGetStateOfRoundInput(
  input: QearnGetStateOfRoundInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QEARN_GET_STATE_OF_ROUND_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QearnGetStateOfRoundOutput {
  state: number
}

const QEARN_GET_STATE_OF_ROUND_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'state',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQearnGetStateOfRoundOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QearnGetStateOfRoundOutput {
  return decodePayload(data, QEARN_GET_STATE_OF_ROUND_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QearnGetStateOfRoundOutput
}

export async function qearnGetStateOfRound(
  live: SmartContractCaller,
  input: QearnGetStateOfRoundInput,
  options?: ContractCallOptions,
): Promise<Result<QearnGetStateOfRoundOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QEARN_CONTRACT_INDEX,
    inputType: QEARN_GET_STATE_OF_ROUND_INPUT_TYPE,
    inputSize: QEARN_GET_STATE_OF_ROUND_INPUT_SIZE,
    inputFields: QEARN_GET_STATE_OF_ROUND_INPUT_FIELDS,
    outputFields: QEARN_GET_STATE_OF_ROUND_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QEARN_GET_USER_LOCK_STATUS_INPUT_TYPE = 4
export const QEARN_GET_USER_LOCK_STATUS_INPUT_SIZE = 32

export interface QearnGetUserLockStatusInput {
  user: string
}

const QEARN_GET_USER_LOCK_STATUS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'user',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQearnGetUserLockStatusInput(
  input: QearnGetUserLockStatusInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QEARN_GET_USER_LOCK_STATUS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QearnGetUserLockStatusOutput {
  status: bigint
}

const QEARN_GET_USER_LOCK_STATUS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQearnGetUserLockStatusOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QearnGetUserLockStatusOutput {
  return decodePayload(data, QEARN_GET_USER_LOCK_STATUS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QearnGetUserLockStatusOutput
}

export async function qearnGetUserLockStatus(
  live: SmartContractCaller,
  input: QearnGetUserLockStatusInput,
  options?: ContractCallOptions,
): Promise<Result<QearnGetUserLockStatusOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QEARN_CONTRACT_INDEX,
    inputType: QEARN_GET_USER_LOCK_STATUS_INPUT_TYPE,
    inputSize: QEARN_GET_USER_LOCK_STATUS_INPUT_SIZE,
    inputFields: QEARN_GET_USER_LOCK_STATUS_INPUT_FIELDS,
    outputFields: QEARN_GET_USER_LOCK_STATUS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QEARN_GET_ENDED_STATUS_INPUT_TYPE = 5
export const QEARN_GET_ENDED_STATUS_INPUT_SIZE = 32

export interface QearnGetEndedStatusInput {
  user: string
}

const QEARN_GET_ENDED_STATUS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'user',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQearnGetEndedStatusInput(
  input: QearnGetEndedStatusInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QEARN_GET_ENDED_STATUS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QearnGetEndedStatusOutput {
  fullyUnlockedAmount: bigint
  fullyRewardedAmount: bigint
  earlyUnlockedAmount: bigint
  earlyRewardedAmount: bigint
}

const QEARN_GET_ENDED_STATUS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'fullyUnlockedAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'fullyRewardedAmount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'earlyUnlockedAmount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'earlyRewardedAmount',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
]

export function decodeQearnGetEndedStatusOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QearnGetEndedStatusOutput {
  return decodePayload(data, QEARN_GET_ENDED_STATUS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QearnGetEndedStatusOutput
}

export async function qearnGetEndedStatus(
  live: SmartContractCaller,
  input: QearnGetEndedStatusInput,
  options?: ContractCallOptions,
): Promise<Result<QearnGetEndedStatusOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QEARN_CONTRACT_INDEX,
    inputType: QEARN_GET_ENDED_STATUS_INPUT_TYPE,
    inputSize: QEARN_GET_ENDED_STATUS_INPUT_SIZE,
    inputFields: QEARN_GET_ENDED_STATUS_INPUT_FIELDS,
    outputFields: QEARN_GET_ENDED_STATUS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QEARN_GET_STATS_PER_EPOCH_INPUT_TYPE = 8
export const QEARN_GET_STATS_PER_EPOCH_INPUT_SIZE = 4

export interface QearnGetStatsPerEpochInput {
  epoch: number
}

const QEARN_GET_STATS_PER_EPOCH_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQearnGetStatsPerEpochInput(
  input: QearnGetStatsPerEpochInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QEARN_GET_STATS_PER_EPOCH_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QearnGetStatsPerEpochOutput {
  earlyUnlockedAmount: bigint
  earlyUnlockedPercent: bigint
  totalLockedAmount: bigint
  averageAPY: bigint
}

const QEARN_GET_STATS_PER_EPOCH_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'earlyUnlockedAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'earlyUnlockedPercent',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'totalLockedAmount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'averageAPY',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
]

export function decodeQearnGetStatsPerEpochOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QearnGetStatsPerEpochOutput {
  return decodePayload(data, QEARN_GET_STATS_PER_EPOCH_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QearnGetStatsPerEpochOutput
}

export async function qearnGetStatsPerEpoch(
  live: SmartContractCaller,
  input: QearnGetStatsPerEpochInput,
  options?: ContractCallOptions,
): Promise<Result<QearnGetStatsPerEpochOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QEARN_CONTRACT_INDEX,
    inputType: QEARN_GET_STATS_PER_EPOCH_INPUT_TYPE,
    inputSize: QEARN_GET_STATS_PER_EPOCH_INPUT_SIZE,
    inputFields: QEARN_GET_STATS_PER_EPOCH_INPUT_FIELDS,
    outputFields: QEARN_GET_STATS_PER_EPOCH_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QEARN_GET_BURNED_AND_BOOSTED_STATS_INPUT_TYPE = 9
export const QEARN_GET_BURNED_AND_BOOSTED_STATS_INPUT_SIZE = 0

export interface QearnGetBurnedAndBoostedStatsOutput {
  burnedAmount: bigint
  averageBurnedPercent: bigint
  boostedAmount: bigint
  averageBoostedPercent: bigint
  rewardedAmount: bigint
  averageRewardedPercent: bigint
}

const QEARN_GET_BURNED_AND_BOOSTED_STATS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'burnedAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'averageBurnedPercent',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'boostedAmount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'averageBoostedPercent',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'rewardedAmount',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'averageRewardedPercent',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function decodeQearnGetBurnedAndBoostedStatsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QearnGetBurnedAndBoostedStatsOutput {
  return decodePayload(data, QEARN_GET_BURNED_AND_BOOSTED_STATS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QearnGetBurnedAndBoostedStatsOutput
}

export async function qearnGetBurnedAndBoostedStats(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QearnGetBurnedAndBoostedStatsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QEARN_CONTRACT_INDEX,
    inputType: QEARN_GET_BURNED_AND_BOOSTED_STATS_INPUT_TYPE,
    inputSize: QEARN_GET_BURNED_AND_BOOSTED_STATS_INPUT_SIZE,
    inputFields: [],
    outputFields: QEARN_GET_BURNED_AND_BOOSTED_STATS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const QEARN_GET_BURNED_AND_BOOSTED_STATS_PER_EPOCH_INPUT_TYPE = 10
export const QEARN_GET_BURNED_AND_BOOSTED_STATS_PER_EPOCH_INPUT_SIZE = 4

export interface QearnGetBurnedAndBoostedStatsPerEpochInput {
  epoch: number
}

const QEARN_GET_BURNED_AND_BOOSTED_STATS_PER_EPOCH_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQearnGetBurnedAndBoostedStatsPerEpochInput(
  input: QearnGetBurnedAndBoostedStatsPerEpochInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QEARN_GET_BURNED_AND_BOOSTED_STATS_PER_EPOCH_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QearnGetBurnedAndBoostedStatsPerEpochOutput {
  burnedAmount: bigint
  burnedPercent: bigint
  boostedAmount: bigint
  boostedPercent: bigint
  rewardedAmount: bigint
  rewardedPercent: bigint
}

const QEARN_GET_BURNED_AND_BOOSTED_STATS_PER_EPOCH_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'burnedAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'burnedPercent',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'boostedAmount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'boostedPercent',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'rewardedAmount',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'rewardedPercent',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function decodeQearnGetBurnedAndBoostedStatsPerEpochOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QearnGetBurnedAndBoostedStatsPerEpochOutput {
  return decodePayload(data, QEARN_GET_BURNED_AND_BOOSTED_STATS_PER_EPOCH_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QearnGetBurnedAndBoostedStatsPerEpochOutput
}

export async function qearnGetBurnedAndBoostedStatsPerEpoch(
  live: SmartContractCaller,
  input: QearnGetBurnedAndBoostedStatsPerEpochInput,
  options?: ContractCallOptions,
): Promise<Result<QearnGetBurnedAndBoostedStatsPerEpochOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QEARN_CONTRACT_INDEX,
    inputType: QEARN_GET_BURNED_AND_BOOSTED_STATS_PER_EPOCH_INPUT_TYPE,
    inputSize: QEARN_GET_BURNED_AND_BOOSTED_STATS_PER_EPOCH_INPUT_SIZE,
    inputFields: QEARN_GET_BURNED_AND_BOOSTED_STATS_PER_EPOCH_INPUT_FIELDS,
    outputFields: QEARN_GET_BURNED_AND_BOOSTED_STATS_PER_EPOCH_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const qearn = {
  contractIndex: QEARN_CONTRACT_INDEX,
  getLockInfoPerEpoch: qearnGetLockInfoPerEpoch,
  getUserLockedInfo: qearnGetUserLockedInfo,
  getStateOfRound: qearnGetStateOfRound,
  getUserLockStatus: qearnGetUserLockStatus,
  getEndedStatus: qearnGetEndedStatus,
  getStatsPerEpoch: qearnGetStatsPerEpoch,
  getBurnedAndBoostedStats: qearnGetBurnedAndBoostedStats,
  getBurnedAndBoostedStatsPerEpoch: qearnGetBurnedAndBoostedStatsPerEpoch,
  decodeLockOutput: decodeQearnLockOutput,
  buildUnlockInput: buildQearnUnlockInput,
  decodeUnlockOutput: decodeQearnUnlockOutput,
}

