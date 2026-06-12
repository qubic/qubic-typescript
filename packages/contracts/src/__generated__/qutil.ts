// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import type { Result } from '@qubic.org/types'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'

export const Q_UTIL_CONTRACT_INDEX = 4

export interface QUtilAssetStruct {
  issuer: string
  assetName: bigint
}

export interface QUtilOIPriceOracleQueryStruct {
  oracle: string
  timestamp: QUtilDateAndTimeStruct
  currency1: string
  currency2: string
}

export interface QUtilPollStruct {
  poll_name: string
  poll_type: bigint
  min_amount: bigint
  is_active: bigint
  creator: string
  allowed_assets: number[]
  num_assets: bigint
}

export interface QUtilDateAndTimeStruct {
  value: bigint
}

const STRUCTS: Record<string, NamedStruct> = {
  'Asset': {
  name: 'Asset',
  byteLength: 40,
  fields: [
    {
      name: 'issuer',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'assetName',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
],
},
  'OI::Price::OracleQuery': {
  name: 'OI::Price::OracleQuery',
  byteLength: 104,
  fields: [
    {
      name: 'oracle',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'timestamp',
      type: 'struct',
      offset: 32,
      byteLength: 8,
      structRef: 'DateAndTime',
    },
    {
      name: 'currency1',
      type: 'id',
      offset: 40,
      byteLength: 32,
    },
    {
      name: 'currency2',
      type: 'id',
      offset: 72,
      byteLength: 32,
    },
],
},
  'Poll': {
  name: 'Poll',
  byteLength: 736,
  fields: [
    {
      name: 'poll_name',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'poll_type',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'min_amount',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'is_active',
      type: 'uint64',
      offset: 48,
      byteLength: 8,
    },
    {
      name: 'creator',
      type: 'id',
      offset: 56,
      byteLength: 32,
    },
    {
      name: 'allowed_assets',
      type: 'array',
      offset: 88,
      byteLength: 640,
      arrayLength: 16,
      arrayItemByteLength: 40,
      arrayItemStructRef: 'Asset',
    },
    {
      name: 'num_assets',
      type: 'uint64',
      offset: 728,
      byteLength: 8,
    },
],
},
  'DateAndTime': {
  name: 'DateAndTime',
  byteLength: 8,
  fields: [
    {
      name: 'value',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
],
},
}

export const Q_UTIL_SEND_TO_MANY_V1_INPUT_TYPE = 1

export interface QUtilSendToManyV1Input {
  dst0: string
  amt0: bigint
}

const Q_UTIL_SEND_TO_MANY_V1_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'dst0',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'amt0',
    type: 'sint64',
    offset: 32,
    byteLength: 8,
  },
]

export function buildQUtilSendToManyV1Input(
  input: QUtilSendToManyV1Input,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_SEND_TO_MANY_V1_INPUT_TYPE, payload: buildPayload(Q_UTIL_SEND_TO_MANY_V1_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QUtilSendToManyV1Output {
  returnCode: number
}

const Q_UTIL_SEND_TO_MANY_V1_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQUtilSendToManyV1Output(
  data: Uint8Array,
): QUtilSendToManyV1Output {
  return decodePayload(data, Q_UTIL_SEND_TO_MANY_V1_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilSendToManyV1Output
}

export const Q_UTIL_BURN_QUBIC_INPUT_TYPE = 2

export interface QUtilBurnQubicInput {
  amount: bigint
}

const Q_UTIL_BURN_QUBIC_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQUtilBurnQubicInput(
  input: QUtilBurnQubicInput,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_BURN_QUBIC_INPUT_TYPE, payload: buildPayload(Q_UTIL_BURN_QUBIC_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QUtilBurnQubicOutput {
  amount: bigint
}

const Q_UTIL_BURN_QUBIC_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilBurnQubicOutput(
  data: Uint8Array,
): QUtilBurnQubicOutput {
  return decodePayload(data, Q_UTIL_BURN_QUBIC_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilBurnQubicOutput
}

export const Q_UTIL_SEND_TO_MANY_BENCHMARK_INPUT_TYPE = 3

export interface QUtilSendToManyBenchmarkInput {
  dstCount: bigint
  numTransfersEach: bigint
}

const Q_UTIL_SEND_TO_MANY_BENCHMARK_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'dstCount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numTransfersEach',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildQUtilSendToManyBenchmarkInput(
  input: QUtilSendToManyBenchmarkInput,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_SEND_TO_MANY_BENCHMARK_INPUT_TYPE, payload: buildPayload(Q_UTIL_SEND_TO_MANY_BENCHMARK_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QUtilSendToManyBenchmarkOutput {
  dstCount: bigint
  returnCode: number
  total: bigint
}

const Q_UTIL_SEND_TO_MANY_BENCHMARK_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'dstCount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 8,
    byteLength: 4,
  },
  {
    name: 'total',
    type: 'sint64',
    offset: 12,
    byteLength: 8,
  },
]

export function decodeQUtilSendToManyBenchmarkOutput(
  data: Uint8Array,
): QUtilSendToManyBenchmarkOutput {
  return decodePayload(data, Q_UTIL_SEND_TO_MANY_BENCHMARK_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilSendToManyBenchmarkOutput
}

export const Q_UTIL_CREATE_POLL_INPUT_TYPE = 4

export interface QUtilCreatePollInput {
  poll_name: string
  poll_type: bigint
  min_amount: bigint
  github_link: number[]
  allowed_assets: number[]
  num_assets: bigint
}

const Q_UTIL_CREATE_POLL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'poll_name',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'poll_type',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'min_amount',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'github_link',
    type: 'array',
    offset: 48,
    byteLength: 256,
    arrayLength: 256,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'allowed_assets',
    type: 'array',
    offset: 304,
    byteLength: 640,
    arrayLength: 16,
    arrayItemByteLength: 40,
    arrayItemStructRef: 'Asset',
  },
  {
    name: 'num_assets',
    type: 'uint64',
    offset: 944,
    byteLength: 8,
  },
]

export function buildQUtilCreatePollInput(
  input: QUtilCreatePollInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_CREATE_POLL_INPUT_TYPE, payload: buildPayload(Q_UTIL_CREATE_POLL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QUtilCreatePollOutput {
  poll_id: bigint
}

const Q_UTIL_CREATE_POLL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'poll_id',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilCreatePollOutput(
  data: Uint8Array,
): QUtilCreatePollOutput {
  return decodePayload(data, Q_UTIL_CREATE_POLL_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilCreatePollOutput
}

export const Q_UTIL_VOTE_INPUT_TYPE = 5

export interface QUtilVoteInput {
  poll_id: bigint
  address: string
  amount: bigint
  chosen_option: bigint
}

const Q_UTIL_VOTE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'poll_id',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'address',
    type: 'id',
    offset: 8,
    byteLength: 32,
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'chosen_option',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
]

export function buildQUtilVoteInput(
  input: QUtilVoteInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_VOTE_INPUT_TYPE, payload: buildPayload(Q_UTIL_VOTE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QUtilVoteOutput {
  success: number
}

const Q_UTIL_VOTE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'success',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQUtilVoteOutput(
  data: Uint8Array,
): QUtilVoteOutput {
  return decodePayload(data, Q_UTIL_VOTE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilVoteOutput
}

export const Q_UTIL_CANCEL_POLL_INPUT_TYPE = 6

export interface QUtilCancelPollInput {
  poll_id: bigint
}

const Q_UTIL_CANCEL_POLL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'poll_id',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQUtilCancelPollInput(
  input: QUtilCancelPollInput,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_CANCEL_POLL_INPUT_TYPE, payload: buildPayload(Q_UTIL_CANCEL_POLL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QUtilCancelPollOutput {
  success: number
}

const Q_UTIL_CANCEL_POLL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'success',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQUtilCancelPollOutput(
  data: Uint8Array,
): QUtilCancelPollOutput {
  return decodePayload(data, Q_UTIL_CANCEL_POLL_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilCancelPollOutput
}

export const Q_UTIL_DISTRIBUTE_QU_TO_SHAREHOLDERS_INPUT_TYPE = 7

export interface QUtilDistributeQuToShareholdersInput {
  asset: QUtilAssetStruct
}

const Q_UTIL_DISTRIBUTE_QU_TO_SHAREHOLDERS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'asset',
    type: 'struct',
    offset: 0,
    byteLength: 40,
    structRef: 'Asset',
  },
]

export function buildQUtilDistributeQuToShareholdersInput(
  input: QUtilDistributeQuToShareholdersInput,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_DISTRIBUTE_QU_TO_SHAREHOLDERS_INPUT_TYPE, payload: buildPayload(Q_UTIL_DISTRIBUTE_QU_TO_SHAREHOLDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QUtilDistributeQuToShareholdersOutput {
  shareholders: bigint
  totalShares: bigint
  amountPerShare: bigint
  fees: bigint
}

const Q_UTIL_DISTRIBUTE_QU_TO_SHAREHOLDERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'shareholders',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'totalShares',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'amountPerShare',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'fees',
    type: 'sint64',
    offset: 24,
    byteLength: 8,
  },
]

export function decodeQUtilDistributeQuToShareholdersOutput(
  data: Uint8Array,
): QUtilDistributeQuToShareholdersOutput {
  return decodePayload(data, Q_UTIL_DISTRIBUTE_QU_TO_SHAREHOLDERS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilDistributeQuToShareholdersOutput
}

export const Q_UTIL_BURN_QUBIC_FOR_CONTRACT_INPUT_TYPE = 8

export interface QUtilBurnQubicForContractInput {
  contractIndexBurnedFor: number
}

const Q_UTIL_BURN_QUBIC_FOR_CONTRACT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'contractIndexBurnedFor',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQUtilBurnQubicForContractInput(
  input: QUtilBurnQubicForContractInput,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_BURN_QUBIC_FOR_CONTRACT_INPUT_TYPE, payload: buildPayload(Q_UTIL_BURN_QUBIC_FOR_CONTRACT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QUtilBurnQubicForContractOutput {
  amount: bigint
}

const Q_UTIL_BURN_QUBIC_FOR_CONTRACT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilBurnQubicForContractOutput(
  data: Uint8Array,
): QUtilBurnQubicForContractOutput {
  return decodePayload(data, Q_UTIL_BURN_QUBIC_FOR_CONTRACT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilBurnQubicForContractOutput
}

export const Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_INPUT_TYPE = 9

export interface QUtilTransferSharesToManyV1Input {
  issuer: string
  assetName: bigint
  dst0: string
  amt0: bigint
}

const Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'issuer',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'assetName',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'dst0',
    type: 'id',
    offset: 40,
    byteLength: 32,
  },
  {
    name: 'amt0',
    type: 'sint64',
    offset: 72,
    byteLength: 8,
  },
]

export function buildQUtilTransferSharesToManyV1Input(
  input: QUtilTransferSharesToManyV1Input,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_INPUT_TYPE, payload: buildPayload(Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QUtilTransferSharesToManyV1Output {
  returnCode: number
}

const Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQUtilTransferSharesToManyV1Output(
  data: Uint8Array,
): QUtilTransferSharesToManyV1Output {
  return decodePayload(data, Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilTransferSharesToManyV1Output
}

export const Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_INPUT_TYPE = 10

export interface QUtilTransferSharesManagementRightsInput {
  asset: QUtilAssetStruct
  numberOfShares: bigint
  newManagingContractIndex: number
}

const Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'asset',
    type: 'struct',
    offset: 0,
    byteLength: 40,
    structRef: 'Asset',
  },
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'newManagingContractIndex',
    type: 'uint32',
    offset: 48,
    byteLength: 4,
  },
]

export function buildQUtilTransferSharesManagementRightsInput(
  input: QUtilTransferSharesManagementRightsInput,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_INPUT_TYPE, payload: buildPayload(Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QUtilTransferSharesManagementRightsOutput {
  transferredNumberOfShares: bigint
}

const Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilTransferSharesManagementRightsOutput(
  data: Uint8Array,
): QUtilTransferSharesManagementRightsOutput {
  return decodePayload(data, Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilTransferSharesManagementRightsOutput
}

export const Q_UTIL_QUERY_PRICE_ORACLE_INPUT_TYPE = 100

export interface QUtilQueryPriceOracleInput {
  priceOracleQuery: QUtilOIPriceOracleQueryStruct
  timeoutMilliseconds: number
}

const Q_UTIL_QUERY_PRICE_ORACLE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'priceOracleQuery',
    type: 'struct',
    offset: 0,
    byteLength: 104,
    structRef: 'OI::Price::OracleQuery',
  },
  {
    name: 'timeoutMilliseconds',
    type: 'uint32',
    offset: 104,
    byteLength: 4,
  },
]

export function buildQUtilQueryPriceOracleInput(
  input: QUtilQueryPriceOracleInput,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_QUERY_PRICE_ORACLE_INPUT_TYPE, payload: buildPayload(Q_UTIL_QUERY_PRICE_ORACLE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QUtilQueryPriceOracleOutput {
  oracleQueryId: bigint
}

const Q_UTIL_QUERY_PRICE_ORACLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'oracleQueryId',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilQueryPriceOracleOutput(
  data: Uint8Array,
): QUtilQueryPriceOracleOutput {
  return decodePayload(data, Q_UTIL_QUERY_PRICE_ORACLE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilQueryPriceOracleOutput
}

export const Q_UTIL_SUBSCRIBE_PRICE_ORACLE_INPUT_TYPE = 101

export interface QUtilSubscribePriceOracleInput {
  priceOracleQuery: QUtilOIPriceOracleQueryStruct
  subscriptionPeriodMilliseconds: number
  notifyPreviousValue: number
}

const Q_UTIL_SUBSCRIBE_PRICE_ORACLE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'priceOracleQuery',
    type: 'struct',
    offset: 0,
    byteLength: 104,
    structRef: 'OI::Price::OracleQuery',
  },
  {
    name: 'subscriptionPeriodMilliseconds',
    type: 'uint32',
    offset: 104,
    byteLength: 4,
  },
  {
    name: 'notifyPreviousValue',
    type: 'uint8',
    offset: 108,
    byteLength: 1,
  },
]

export function buildQUtilSubscribePriceOracleInput(
  input: QUtilSubscribePriceOracleInput,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_SUBSCRIBE_PRICE_ORACLE_INPUT_TYPE, payload: buildPayload(Q_UTIL_SUBSCRIBE_PRICE_ORACLE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QUtilSubscribePriceOracleOutput {
  oracleSubscriptionId: number
}

const Q_UTIL_SUBSCRIBE_PRICE_ORACLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'oracleSubscriptionId',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQUtilSubscribePriceOracleOutput(
  data: Uint8Array,
): QUtilSubscribePriceOracleOutput {
  return decodePayload(data, Q_UTIL_SUBSCRIBE_PRICE_ORACLE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilSubscribePriceOracleOutput
}

export const Q_UTIL_UNSUBSCRIBE_ORACLE_INPUT_TYPE = 102

export interface QUtilUnsubscribeOracleInput {
  subscriptionId: number
}

const Q_UTIL_UNSUBSCRIBE_ORACLE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'subscriptionId',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQUtilUnsubscribeOracleInput(
  input: QUtilUnsubscribeOracleInput,
): ContractCall {
  return { contractIndex: Q_UTIL_CONTRACT_INDEX, inputType: Q_UTIL_UNSUBSCRIBE_ORACLE_INPUT_TYPE, payload: buildPayload(Q_UTIL_UNSUBSCRIBE_ORACLE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QUtilUnsubscribeOracleOutput {
  success: number
}

const Q_UTIL_UNSUBSCRIBE_ORACLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'success',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQUtilUnsubscribeOracleOutput(
  data: Uint8Array,
): QUtilUnsubscribeOracleOutput {
  return decodePayload(data, Q_UTIL_UNSUBSCRIBE_ORACLE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilUnsubscribeOracleOutput
}

export const Q_UTIL_GET_SEND_TO_MANY_V1FEE_INPUT_TYPE = 1
export const Q_UTIL_GET_SEND_TO_MANY_V1FEE_INPUT_SIZE = 0

export interface QUtilGetSendToManyV1FeeOutput {
  fee: bigint
}

const Q_UTIL_GET_SEND_TO_MANY_V1FEE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'fee',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilGetSendToManyV1FeeOutput(
  data: Uint8Array,
): QUtilGetSendToManyV1FeeOutput {
  return decodePayload(data, Q_UTIL_GET_SEND_TO_MANY_V1FEE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilGetSendToManyV1FeeOutput
}

export async function qUtilGetSendToManyV1Fee(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QUtilGetSendToManyV1FeeOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_UTIL_CONTRACT_INDEX,
    inputType: Q_UTIL_GET_SEND_TO_MANY_V1FEE_INPUT_TYPE,
    inputSize: Q_UTIL_GET_SEND_TO_MANY_V1FEE_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_UTIL_GET_SEND_TO_MANY_V1FEE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_INPUT_TYPE = 2
export const Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_INPUT_SIZE = 40

export interface QUtilGetTotalNumberOfAssetSharesInput {
  issuer: string
  assetName: bigint
}

const Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'issuer',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'assetName',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
]

export function buildQUtilGetTotalNumberOfAssetSharesInput(
  input: QUtilGetTotalNumberOfAssetSharesInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilGetTotalNumberOfAssetSharesOutput {
  value: bigint
}

const Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'value',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilGetTotalNumberOfAssetSharesOutput(
  data: Uint8Array,
): QUtilGetTotalNumberOfAssetSharesOutput {
  return decodePayload(data, Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilGetTotalNumberOfAssetSharesOutput
}

export async function qUtilGetTotalNumberOfAssetShares(
  live: SmartContractCaller,
  input: QUtilGetTotalNumberOfAssetSharesInput,
  options?: ContractCallOptions,
): Promise<Result<QUtilGetTotalNumberOfAssetSharesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_UTIL_CONTRACT_INDEX,
    inputType: Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_INPUT_TYPE,
    inputSize: Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_INPUT_SIZE,
    inputFields: Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_INPUT_FIELDS,
    outputFields: Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_UTIL_GET_CURRENT_RESULT_INPUT_TYPE = 3
export const Q_UTIL_GET_CURRENT_RESULT_INPUT_SIZE = 8

export interface QUtilGetCurrentResultInput {
  poll_id: bigint
}

const Q_UTIL_GET_CURRENT_RESULT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'poll_id',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQUtilGetCurrentResultInput(
  input: QUtilGetCurrentResultInput,
): Uint8Array {
  return buildPayload(Q_UTIL_GET_CURRENT_RESULT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QUtilGetCurrentResultOutput {
  result: bigint[]
  voter_count: bigint[]
  is_active: bigint
}

const Q_UTIL_GET_CURRENT_RESULT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'result',
    type: 'array',
    offset: 0,
    byteLength: 512,
    arrayLength: 64,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'voter_count',
    type: 'array',
    offset: 512,
    byteLength: 512,
    arrayLength: 64,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'is_active',
    type: 'uint64',
    offset: 1024,
    byteLength: 8,
  },
]

export function decodeQUtilGetCurrentResultOutput(
  data: Uint8Array,
): QUtilGetCurrentResultOutput {
  return decodePayload(data, Q_UTIL_GET_CURRENT_RESULT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilGetCurrentResultOutput
}

export async function qUtilGetCurrentResult(
  live: SmartContractCaller,
  input: QUtilGetCurrentResultInput,
  options?: ContractCallOptions,
): Promise<Result<QUtilGetCurrentResultOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_UTIL_CONTRACT_INDEX,
    inputType: Q_UTIL_GET_CURRENT_RESULT_INPUT_TYPE,
    inputSize: Q_UTIL_GET_CURRENT_RESULT_INPUT_SIZE,
    inputFields: Q_UTIL_GET_CURRENT_RESULT_INPUT_FIELDS,
    outputFields: Q_UTIL_GET_CURRENT_RESULT_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_UTIL_GET_POLLS_BY_CREATOR_INPUT_TYPE = 4
export const Q_UTIL_GET_POLLS_BY_CREATOR_INPUT_SIZE = 32

export interface QUtilGetPollsByCreatorInput {
  creator: string
}

const Q_UTIL_GET_POLLS_BY_CREATOR_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'creator',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQUtilGetPollsByCreatorInput(
  input: QUtilGetPollsByCreatorInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(Q_UTIL_GET_POLLS_BY_CREATOR_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilGetPollsByCreatorOutput {
  poll_ids: bigint[]
  count: bigint
}

const Q_UTIL_GET_POLLS_BY_CREATOR_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'poll_ids',
    type: 'array',
    offset: 0,
    byteLength: 512,
    arrayLength: 64,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'count',
    type: 'uint64',
    offset: 512,
    byteLength: 8,
  },
]

export function decodeQUtilGetPollsByCreatorOutput(
  data: Uint8Array,
): QUtilGetPollsByCreatorOutput {
  return decodePayload(data, Q_UTIL_GET_POLLS_BY_CREATOR_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilGetPollsByCreatorOutput
}

export async function qUtilGetPollsByCreator(
  live: SmartContractCaller,
  input: QUtilGetPollsByCreatorInput,
  options?: ContractCallOptions,
): Promise<Result<QUtilGetPollsByCreatorOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_UTIL_CONTRACT_INDEX,
    inputType: Q_UTIL_GET_POLLS_BY_CREATOR_INPUT_TYPE,
    inputSize: Q_UTIL_GET_POLLS_BY_CREATOR_INPUT_SIZE,
    inputFields: Q_UTIL_GET_POLLS_BY_CREATOR_INPUT_FIELDS,
    outputFields: Q_UTIL_GET_POLLS_BY_CREATOR_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_UTIL_GET_CURRENT_POLL_ID_INPUT_TYPE = 5
export const Q_UTIL_GET_CURRENT_POLL_ID_INPUT_SIZE = 0

export interface QUtilGetCurrentPollIdOutput {
  current_poll_id: bigint
  active_poll_ids: bigint[]
  active_count: bigint
}

const Q_UTIL_GET_CURRENT_POLL_ID_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'current_poll_id',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'active_poll_ids',
    type: 'array',
    offset: 8,
    byteLength: 512,
    arrayLength: 64,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'active_count',
    type: 'uint64',
    offset: 520,
    byteLength: 8,
  },
]

export function decodeQUtilGetCurrentPollIdOutput(
  data: Uint8Array,
): QUtilGetCurrentPollIdOutput {
  return decodePayload(data, Q_UTIL_GET_CURRENT_POLL_ID_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilGetCurrentPollIdOutput
}

export async function qUtilGetCurrentPollId(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QUtilGetCurrentPollIdOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_UTIL_CONTRACT_INDEX,
    inputType: Q_UTIL_GET_CURRENT_POLL_ID_INPUT_TYPE,
    inputSize: Q_UTIL_GET_CURRENT_POLL_ID_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_UTIL_GET_CURRENT_POLL_ID_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_UTIL_GET_POLL_INFO_INPUT_TYPE = 6
export const Q_UTIL_GET_POLL_INFO_INPUT_SIZE = 8

export interface QUtilGetPollInfoInput {
  poll_id: bigint
}

const Q_UTIL_GET_POLL_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'poll_id',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQUtilGetPollInfoInput(
  input: QUtilGetPollInfoInput,
): Uint8Array {
  return buildPayload(Q_UTIL_GET_POLL_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QUtilGetPollInfoOutput {
  found: bigint
  poll_info: QUtilPollStruct
  poll_link: number[]
}

const Q_UTIL_GET_POLL_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'found',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'poll_info',
    type: 'struct',
    offset: 8,
    byteLength: 736,
    structRef: 'Poll',
  },
  {
    name: 'poll_link',
    type: 'array',
    offset: 744,
    byteLength: 256,
    arrayLength: 256,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function decodeQUtilGetPollInfoOutput(
  data: Uint8Array,
): QUtilGetPollInfoOutput {
  return decodePayload(data, Q_UTIL_GET_POLL_INFO_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilGetPollInfoOutput
}

export async function qUtilGetPollInfo(
  live: SmartContractCaller,
  input: QUtilGetPollInfoInput,
  options?: ContractCallOptions,
): Promise<Result<QUtilGetPollInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_UTIL_CONTRACT_INDEX,
    inputType: Q_UTIL_GET_POLL_INFO_INPUT_TYPE,
    inputSize: Q_UTIL_GET_POLL_INFO_INPUT_SIZE,
    inputFields: Q_UTIL_GET_POLL_INFO_INPUT_FIELDS,
    outputFields: Q_UTIL_GET_POLL_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_UTIL_GET_FEES_INPUT_TYPE = 7
export const Q_UTIL_GET_FEES_INPUT_SIZE = 0

export interface QUtilGetFeesOutput {
  smt1InvocationFee: bigint
  pollCreationFee: bigint
  pollVoteFee: bigint
  distributeQuToShareholderFeePerShareholder: bigint
  shareholderProposalFee: bigint
  _futureFeePlaceholder0: bigint
  _futureFeePlaceholder1: bigint
  _futureFeePlaceholder2: bigint
  _futureFeePlaceholder3: bigint
  _futureFeePlaceholder4: bigint
  _futureFeePlaceholder5: bigint
}

const Q_UTIL_GET_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'smt1InvocationFee',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'pollCreationFee',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'pollVoteFee',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'distributeQuToShareholderFeePerShareholder',
    type: 'sint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'shareholderProposalFee',
    type: 'sint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: '_futureFeePlaceholder0',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: '_futureFeePlaceholder1',
    type: 'sint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: '_futureFeePlaceholder2',
    type: 'sint64',
    offset: 56,
    byteLength: 8,
  },
  {
    name: '_futureFeePlaceholder3',
    type: 'sint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: '_futureFeePlaceholder4',
    type: 'sint64',
    offset: 72,
    byteLength: 8,
  },
  {
    name: '_futureFeePlaceholder5',
    type: 'sint64',
    offset: 80,
    byteLength: 8,
  },
]

export function decodeQUtilGetFeesOutput(
  data: Uint8Array,
): QUtilGetFeesOutput {
  return decodePayload(data, Q_UTIL_GET_FEES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilGetFeesOutput
}

export async function qUtilGetFees(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QUtilGetFeesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_UTIL_CONTRACT_INDEX,
    inputType: Q_UTIL_GET_FEES_INPUT_TYPE,
    inputSize: Q_UTIL_GET_FEES_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_UTIL_GET_FEES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_UTIL_QUERY_FEE_RESERVE_INPUT_TYPE = 8
export const Q_UTIL_QUERY_FEE_RESERVE_INPUT_SIZE = 4

export interface QUtilQueryFeeReserveInput {
  contractIndex: number
}

const Q_UTIL_QUERY_FEE_RESERVE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'contractIndex',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQUtilQueryFeeReserveInput(
  input: QUtilQueryFeeReserveInput,
): Uint8Array {
  return buildPayload(Q_UTIL_QUERY_FEE_RESERVE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QUtilQueryFeeReserveOutput {
  reserveAmount: bigint
}

const Q_UTIL_QUERY_FEE_RESERVE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'reserveAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilQueryFeeReserveOutput(
  data: Uint8Array,
): QUtilQueryFeeReserveOutput {
  return decodePayload(data, Q_UTIL_QUERY_FEE_RESERVE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilQueryFeeReserveOutput
}

export async function qUtilQueryFeeReserve(
  live: SmartContractCaller,
  input: QUtilQueryFeeReserveInput,
  options?: ContractCallOptions,
): Promise<Result<QUtilQueryFeeReserveOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_UTIL_CONTRACT_INDEX,
    inputType: Q_UTIL_QUERY_FEE_RESERVE_INPUT_TYPE,
    inputSize: Q_UTIL_QUERY_FEE_RESERVE_INPUT_SIZE,
    inputFields: Q_UTIL_QUERY_FEE_RESERVE_INPUT_FIELDS,
    outputFields: Q_UTIL_QUERY_FEE_RESERVE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_UTIL_GET_BALANCES16_INPUT_TYPE = 9
export const Q_UTIL_GET_BALANCES16_INPUT_SIZE = 512

export interface QUtilGetBalances16Input {
  publicKeys: string[]
}

const Q_UTIL_GET_BALANCES16_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'publicKeys',
    type: 'array',
    offset: 0,
    byteLength: 512,
    arrayLength: 16,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
]

export function buildQUtilGetBalances16Input(
  input: QUtilGetBalances16Input,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(Q_UTIL_GET_BALANCES16_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilGetBalances16Output {
  balances: bigint[]
}

const Q_UTIL_GET_BALANCES16_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'balances',
    type: 'array',
    offset: 0,
    byteLength: 128,
    arrayLength: 16,
    arrayItemType: 'sint64',
    arrayItemByteLength: 8,
  },
]

export function decodeQUtilGetBalances16Output(
  data: Uint8Array,
): QUtilGetBalances16Output {
  return decodePayload(data, Q_UTIL_GET_BALANCES16_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QUtilGetBalances16Output
}

export async function qUtilGetBalances16(
  live: SmartContractCaller,
  input: QUtilGetBalances16Input,
  options?: ContractCallOptions,
): Promise<Result<QUtilGetBalances16Output, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_UTIL_CONTRACT_INDEX,
    inputType: Q_UTIL_GET_BALANCES16_INPUT_TYPE,
    inputSize: Q_UTIL_GET_BALANCES16_INPUT_SIZE,
    inputFields: Q_UTIL_GET_BALANCES16_INPUT_FIELDS,
    outputFields: Q_UTIL_GET_BALANCES16_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const qUtil = {
  contractIndex: Q_UTIL_CONTRACT_INDEX,
  GetSendToManyV1Fee: qUtilGetSendToManyV1Fee,
  GetTotalNumberOfAssetShares: qUtilGetTotalNumberOfAssetShares,
  GetCurrentResult: qUtilGetCurrentResult,
  GetPollsByCreator: qUtilGetPollsByCreator,
  GetCurrentPollId: qUtilGetCurrentPollId,
  GetPollInfo: qUtilGetPollInfo,
  GetFees: qUtilGetFees,
  QueryFeeReserve: qUtilQueryFeeReserve,
  GetBalances16: qUtilGetBalances16,
  buildSendToManyV1Input: buildQUtilSendToManyV1Input,
  decodeSendToManyV1Output: decodeQUtilSendToManyV1Output,
  buildBurnQubicInput: buildQUtilBurnQubicInput,
  decodeBurnQubicOutput: decodeQUtilBurnQubicOutput,
  buildSendToManyBenchmarkInput: buildQUtilSendToManyBenchmarkInput,
  decodeSendToManyBenchmarkOutput: decodeQUtilSendToManyBenchmarkOutput,
  buildCreatePollInput: buildQUtilCreatePollInput,
  decodeCreatePollOutput: decodeQUtilCreatePollOutput,
  buildVoteInput: buildQUtilVoteInput,
  decodeVoteOutput: decodeQUtilVoteOutput,
  buildCancelPollInput: buildQUtilCancelPollInput,
  decodeCancelPollOutput: decodeQUtilCancelPollOutput,
  buildDistributeQuToShareholdersInput: buildQUtilDistributeQuToShareholdersInput,
  decodeDistributeQuToShareholdersOutput: decodeQUtilDistributeQuToShareholdersOutput,
  buildBurnQubicForContractInput: buildQUtilBurnQubicForContractInput,
  decodeBurnQubicForContractOutput: decodeQUtilBurnQubicForContractOutput,
  buildTransferSharesToManyV1Input: buildQUtilTransferSharesToManyV1Input,
  decodeTransferSharesToManyV1Output: decodeQUtilTransferSharesToManyV1Output,
  buildTransferSharesManagementRightsInput: buildQUtilTransferSharesManagementRightsInput,
  decodeTransferSharesManagementRightsOutput: decodeQUtilTransferSharesManagementRightsOutput,
  buildQueryPriceOracleInput: buildQUtilQueryPriceOracleInput,
  decodeQueryPriceOracleOutput: decodeQUtilQueryPriceOracleOutput,
  buildSubscribePriceOracleInput: buildQUtilSubscribePriceOracleInput,
  decodeSubscribePriceOracleOutput: decodeQUtilSubscribePriceOracleOutput,
  buildUnsubscribeOracleInput: buildQUtilUnsubscribeOracleInput,
  decodeUnsubscribeOracleOutput: decodeQUtilUnsubscribeOracleOutput,
}

