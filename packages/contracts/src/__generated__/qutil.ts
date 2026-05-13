// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const Q_UTIL_CONTRACT_INDEX = 4

export interface QUtilPollStruct {
  poll_name: string
  poll_type: bigint
  min_amount: bigint
  is_active: bigint
  creator: string
  num_assets: bigint
}

const STRUCTS: Record<string, NamedStruct> = {
  Poll: {
  name: 'Poll',
  byteLength: 96,
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
      name: 'num_assets',
      type: 'uint64',
      offset: 88,
      byteLength: 8,
    },
],
},
}

export const Q_UTIL_SEND_TO_MANY_V1_INPUT_TYPE = 5
export const Q_UTIL_SEND_TO_MANY_V1_INPUT_SIZE = 40
export const Q_UTIL_SEND_TO_MANY_V1_OUTPUT_SIZE = 4

export interface QUtilSendToManyV1Input {
  dst0: string
  amt0: bigint
}

export const Q_UTIL_SEND_TO_MANY_V1_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_SEND_TO_MANY_V1_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilSendToManyV1Output {
  returnCode: number
}

export const Q_UTIL_SEND_TO_MANY_V1_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQUtilSendToManyV1Output(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilSendToManyV1Output {
  return decodePayload(
    data,
    Q_UTIL_SEND_TO_MANY_V1_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilSendToManyV1Output
}

export const Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_INPUT_TYPE = 7
export const Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_INPUT_SIZE = 80
export const Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_OUTPUT_SIZE = 4

export interface QUtilTransferSharesToManyV1Input {
  issuer: string
  assetName: bigint
  dst0: string
  amt0: bigint
}

export const Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilTransferSharesToManyV1Output {
  returnCode: number
}

export const Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQUtilTransferSharesToManyV1Output(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilTransferSharesToManyV1Output {
  return decodePayload(
    data,
    Q_UTIL_TRANSFER_SHARES_TO_MANY_V1_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilTransferSharesToManyV1Output
}

export const Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_INPUT_TYPE = 8
export const Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_INPUT_SIZE = 12
export const Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_OUTPUT_SIZE = 8

export interface QUtilTransferSharesManagementRightsInput {
  numberOfShares: bigint
  newManagingContractIndex: number
}

export const Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'newManagingContractIndex',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function buildQUtilTransferSharesManagementRightsInput(
  input: QUtilTransferSharesManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilTransferSharesManagementRightsOutput {
  transferredNumberOfShares: bigint
}

export const Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilTransferSharesManagementRightsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilTransferSharesManagementRightsOutput {
  return decodePayload(
    data,
    Q_UTIL_TRANSFER_SHARES_MANAGEMENT_RIGHTS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilTransferSharesManagementRightsOutput
}

export const Q_UTIL_SEND_TO_MANY_BENCHMARK_INPUT_TYPE = 9
export const Q_UTIL_SEND_TO_MANY_BENCHMARK_INPUT_SIZE = 16
export const Q_UTIL_SEND_TO_MANY_BENCHMARK_OUTPUT_SIZE = 20

export interface QUtilSendToManyBenchmarkInput {
  dstCount: bigint
  numTransfersEach: bigint
}

export const Q_UTIL_SEND_TO_MANY_BENCHMARK_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_SEND_TO_MANY_BENCHMARK_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilSendToManyBenchmarkOutput {
  dstCount: bigint
  returnCode: number
  total: bigint
}

export const Q_UTIL_SEND_TO_MANY_BENCHMARK_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilSendToManyBenchmarkOutput {
  return decodePayload(
    data,
    Q_UTIL_SEND_TO_MANY_BENCHMARK_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilSendToManyBenchmarkOutput
}

export const Q_UTIL_BURN_QUBIC_INPUT_TYPE = 10
export const Q_UTIL_BURN_QUBIC_INPUT_SIZE = 8
export const Q_UTIL_BURN_QUBIC_OUTPUT_SIZE = 8

export interface QUtilBurnQubicInput {
  amount: bigint
}

export const Q_UTIL_BURN_QUBIC_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQUtilBurnQubicInput(
  input: QUtilBurnQubicInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_BURN_QUBIC_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilBurnQubicOutput {
  amount: bigint
}

export const Q_UTIL_BURN_QUBIC_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilBurnQubicOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilBurnQubicOutput {
  return decodePayload(
    data,
    Q_UTIL_BURN_QUBIC_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilBurnQubicOutput
}

export const Q_UTIL_BURN_QUBIC_FOR_CONTRACT_INPUT_TYPE = 11
export const Q_UTIL_BURN_QUBIC_FOR_CONTRACT_INPUT_SIZE = 4
export const Q_UTIL_BURN_QUBIC_FOR_CONTRACT_OUTPUT_SIZE = 8

export interface QUtilBurnQubicForContractInput {
  contractIndexBurnedFor: number
}

export const Q_UTIL_BURN_QUBIC_FOR_CONTRACT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'contractIndexBurnedFor',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQUtilBurnQubicForContractInput(
  input: QUtilBurnQubicForContractInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_BURN_QUBIC_FOR_CONTRACT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilBurnQubicForContractOutput {
  amount: bigint
}

export const Q_UTIL_BURN_QUBIC_FOR_CONTRACT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilBurnQubicForContractOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilBurnQubicForContractOutput {
  return decodePayload(
    data,
    Q_UTIL_BURN_QUBIC_FOR_CONTRACT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilBurnQubicForContractOutput
}

export const Q_UTIL_CREATE_POLL_INPUT_TYPE = 13
export const Q_UTIL_CREATE_POLL_INPUT_SIZE = 312
export const Q_UTIL_CREATE_POLL_OUTPUT_SIZE = 8

export interface QUtilCreatePollInput {
  poll_name: string
  poll_type: bigint
  min_amount: bigint
  github_link: number[]
  num_assets: bigint
}

export const Q_UTIL_CREATE_POLL_INPUT_FIELDS: BinaryField[] = [
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
    name: 'num_assets',
    type: 'uint64',
    offset: 304,
    byteLength: 8,
  },
]

export function buildQUtilCreatePollInput(
  input: QUtilCreatePollInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_CREATE_POLL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilCreatePollOutput {
  poll_id: bigint
}

export const Q_UTIL_CREATE_POLL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'poll_id',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilCreatePollOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilCreatePollOutput {
  return decodePayload(
    data,
    Q_UTIL_CREATE_POLL_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilCreatePollOutput
}

export const Q_UTIL_VOTE_INPUT_TYPE = 14
export const Q_UTIL_VOTE_INPUT_SIZE = 56
export const Q_UTIL_VOTE_OUTPUT_SIZE = 0

export interface QUtilVoteInput {
  poll_id: bigint
  address: string
  amount: bigint
  chosen_option: bigint
}

export const Q_UTIL_VOTE_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_VOTE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const Q_UTIL_CANCEL_POLL_INPUT_TYPE = 15
export const Q_UTIL_CANCEL_POLL_INPUT_SIZE = 8
export const Q_UTIL_CANCEL_POLL_OUTPUT_SIZE = 0

export interface QUtilCancelPollInput {
  poll_id: bigint
}

export const Q_UTIL_CANCEL_POLL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'poll_id',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQUtilCancelPollInput(
  input: QUtilCancelPollInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_CANCEL_POLL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const Q_UTIL_DISTRIBUTE_QU_TO_SHAREHOLDERS_INPUT_TYPE = 20
export const Q_UTIL_DISTRIBUTE_QU_TO_SHAREHOLDERS_INPUT_SIZE = 0
export const Q_UTIL_DISTRIBUTE_QU_TO_SHAREHOLDERS_OUTPUT_SIZE = 32

export interface QUtilDistributeQuToShareholdersOutput {
  shareholders: bigint
  totalShares: bigint
  amountPerShare: bigint
  fees: bigint
}

export const Q_UTIL_DISTRIBUTE_QU_TO_SHAREHOLDERS_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilDistributeQuToShareholdersOutput {
  return decodePayload(
    data,
    Q_UTIL_DISTRIBUTE_QU_TO_SHAREHOLDERS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilDistributeQuToShareholdersOutput
}

export const Q_UTIL_QUERY_PRICE_ORACLE_INPUT_TYPE = 21
export const Q_UTIL_QUERY_PRICE_ORACLE_INPUT_SIZE = 4
export const Q_UTIL_QUERY_PRICE_ORACLE_OUTPUT_SIZE = 8

export interface QUtilQueryPriceOracleInput {
  timeoutMilliseconds: number
}

export const Q_UTIL_QUERY_PRICE_ORACLE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'timeoutMilliseconds',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQUtilQueryPriceOracleInput(
  input: QUtilQueryPriceOracleInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_QUERY_PRICE_ORACLE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilQueryPriceOracleOutput {
  oracleQueryId: bigint
}

export const Q_UTIL_QUERY_PRICE_ORACLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'oracleQueryId',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilQueryPriceOracleOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilQueryPriceOracleOutput {
  return decodePayload(
    data,
    Q_UTIL_QUERY_PRICE_ORACLE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilQueryPriceOracleOutput
}

export const Q_UTIL_SUBSCRIBE_PRICE_ORACLE_INPUT_TYPE = 22
export const Q_UTIL_SUBSCRIBE_PRICE_ORACLE_INPUT_SIZE = 4
export const Q_UTIL_SUBSCRIBE_PRICE_ORACLE_OUTPUT_SIZE = 4

export interface QUtilSubscribePriceOracleInput {
  subscriptionPeriodMilliseconds: number
}

export const Q_UTIL_SUBSCRIBE_PRICE_ORACLE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'subscriptionPeriodMilliseconds',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQUtilSubscribePriceOracleInput(
  input: QUtilSubscribePriceOracleInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_SUBSCRIBE_PRICE_ORACLE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilSubscribePriceOracleOutput {
  oracleSubscriptionId: number
}

export const Q_UTIL_SUBSCRIBE_PRICE_ORACLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'oracleSubscriptionId',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQUtilSubscribePriceOracleOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilSubscribePriceOracleOutput {
  return decodePayload(
    data,
    Q_UTIL_SUBSCRIBE_PRICE_ORACLE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilSubscribePriceOracleOutput
}

export const Q_UTIL_UNSUBSCRIBE_ORACLE_INPUT_TYPE = 23
export const Q_UTIL_UNSUBSCRIBE_ORACLE_INPUT_SIZE = 4
export const Q_UTIL_UNSUBSCRIBE_ORACLE_OUTPUT_SIZE = 0

export interface QUtilUnsubscribeOracleInput {
  subscriptionId: number
}

export const Q_UTIL_UNSUBSCRIBE_ORACLE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'subscriptionId',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQUtilUnsubscribeOracleInput(
  input: QUtilUnsubscribeOracleInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_UNSUBSCRIBE_ORACLE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const Q_UTIL_GET_FEES_INPUT_TYPE = 0
export const Q_UTIL_GET_FEES_INPUT_SIZE = 0
export const Q_UTIL_GET_FEES_OUTPUT_SIZE = 40

export interface QUtilGetFeesOutput {
  smt1InvocationFee: bigint
  pollCreationFee: bigint
  pollVoteFee: bigint
  distributeQuToShareholderFeePerShareholder: bigint
  shareholderProposalFee: bigint
}

export const Q_UTIL_GET_FEES_OUTPUT_FIELDS: BinaryField[] = [
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
]

export function decodeQUtilGetFeesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilGetFeesOutput {
  return decodePayload(
    data,
    Q_UTIL_GET_FEES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilGetFeesOutput
}

export const Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_INPUT_TYPE = 0
export const Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_INPUT_SIZE = 0
export const Q_UTIL_GET_TOTAL_NUMBER_OF_ASSET_SHARES_OUTPUT_SIZE = 0

export const Q_UTIL_GET_SEND_TO_MANY_V1FEE_INPUT_TYPE = 6
export const Q_UTIL_GET_SEND_TO_MANY_V1FEE_INPUT_SIZE = 0
export const Q_UTIL_GET_SEND_TO_MANY_V1FEE_OUTPUT_SIZE = 8

export interface QUtilGetSendToManyV1FeeOutput {
  fee: bigint
}

export const Q_UTIL_GET_SEND_TO_MANY_V1FEE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'fee',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilGetSendToManyV1FeeOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilGetSendToManyV1FeeOutput {
  return decodePayload(
    data,
    Q_UTIL_GET_SEND_TO_MANY_V1FEE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilGetSendToManyV1FeeOutput
}

export const Q_UTIL_QUERY_FEE_RESERVE_INPUT_TYPE = 12
export const Q_UTIL_QUERY_FEE_RESERVE_INPUT_SIZE = 4
export const Q_UTIL_QUERY_FEE_RESERVE_OUTPUT_SIZE = 8

export interface QUtilQueryFeeReserveInput {
  contractIndex: number
}

export const Q_UTIL_QUERY_FEE_RESERVE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'contractIndex',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQUtilQueryFeeReserveInput(
  input: QUtilQueryFeeReserveInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_QUERY_FEE_RESERVE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilQueryFeeReserveOutput {
  reserveAmount: bigint
}

export const Q_UTIL_QUERY_FEE_RESERVE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'reserveAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQUtilQueryFeeReserveOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilQueryFeeReserveOutput {
  return decodePayload(
    data,
    Q_UTIL_QUERY_FEE_RESERVE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilQueryFeeReserveOutput
}

export const Q_UTIL_GET_CURRENT_RESULT_INPUT_TYPE = 16
export const Q_UTIL_GET_CURRENT_RESULT_INPUT_SIZE = 8
export const Q_UTIL_GET_CURRENT_RESULT_OUTPUT_SIZE = 1032

export interface QUtilGetCurrentResultInput {
  poll_id: bigint
}

export const Q_UTIL_GET_CURRENT_RESULT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'poll_id',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQUtilGetCurrentResultInput(
  input: QUtilGetCurrentResultInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_GET_CURRENT_RESULT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilGetCurrentResultOutput {
  result: bigint[]
  voter_count: bigint[]
  is_active: bigint
}

export const Q_UTIL_GET_CURRENT_RESULT_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilGetCurrentResultOutput {
  return decodePayload(
    data,
    Q_UTIL_GET_CURRENT_RESULT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilGetCurrentResultOutput
}

export const Q_UTIL_GET_POLLS_BY_CREATOR_INPUT_TYPE = 17
export const Q_UTIL_GET_POLLS_BY_CREATOR_INPUT_SIZE = 32
export const Q_UTIL_GET_POLLS_BY_CREATOR_OUTPUT_SIZE = 520

export interface QUtilGetPollsByCreatorInput {
  creator: string
}

export const Q_UTIL_GET_POLLS_BY_CREATOR_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'creator',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQUtilGetPollsByCreatorInput(
  input: QUtilGetPollsByCreatorInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_GET_POLLS_BY_CREATOR_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilGetPollsByCreatorOutput {
  poll_ids: bigint[]
  count: bigint
}

export const Q_UTIL_GET_POLLS_BY_CREATOR_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilGetPollsByCreatorOutput {
  return decodePayload(
    data,
    Q_UTIL_GET_POLLS_BY_CREATOR_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilGetPollsByCreatorOutput
}

export const Q_UTIL_GET_CURRENT_POLL_ID_INPUT_TYPE = 18
export const Q_UTIL_GET_CURRENT_POLL_ID_INPUT_SIZE = 0
export const Q_UTIL_GET_CURRENT_POLL_ID_OUTPUT_SIZE = 528

export interface QUtilGetCurrentPollIdOutput {
  current_poll_id: bigint
  active_poll_ids: bigint[]
  active_count: bigint
}

export const Q_UTIL_GET_CURRENT_POLL_ID_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilGetCurrentPollIdOutput {
  return decodePayload(
    data,
    Q_UTIL_GET_CURRENT_POLL_ID_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilGetCurrentPollIdOutput
}

export const Q_UTIL_GET_POLL_INFO_INPUT_TYPE = 19
export const Q_UTIL_GET_POLL_INFO_INPUT_SIZE = 8
export const Q_UTIL_GET_POLL_INFO_OUTPUT_SIZE = 360

export interface QUtilGetPollInfoInput {
  poll_id: bigint
}

export const Q_UTIL_GET_POLL_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'poll_id',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQUtilGetPollInfoInput(
  input: QUtilGetPollInfoInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_GET_POLL_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilGetPollInfoOutput {
  found: bigint
  poll_info: QUtilPollStruct
  poll_link: number[]
}

export const Q_UTIL_GET_POLL_INFO_OUTPUT_FIELDS: BinaryField[] = [
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
    byteLength: 96,
    structRef: 'Poll',
  },
  {
    name: 'poll_link',
    type: 'array',
    offset: 104,
    byteLength: 256,
    arrayLength: 256,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function decodeQUtilGetPollInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilGetPollInfoOutput {
  return decodePayload(
    data,
    Q_UTIL_GET_POLL_INFO_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilGetPollInfoOutput
}

export const Q_UTIL_GET_BALANCES16_INPUT_TYPE = 24
export const Q_UTIL_GET_BALANCES16_INPUT_SIZE = 512
export const Q_UTIL_GET_BALANCES16_OUTPUT_SIZE = 128

export interface QUtilGetBalances16Input {
  publicKeys: string[]
}

export const Q_UTIL_GET_BALANCES16_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_UTIL_GET_BALANCES16_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QUtilGetBalances16Output {
  balances: bigint[]
}

export const Q_UTIL_GET_BALANCES16_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QUtilGetBalances16Output {
  return decodePayload(
    data,
    Q_UTIL_GET_BALANCES16_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QUtilGetBalances16Output
}

