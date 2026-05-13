// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const QUOTTERY_CONTRACT_INDEX = 2

export interface QuotteryQtryEventInfoStruct {
  eid: bigint
  desc: string[]
  option0Desc: string[]
  option1Desc: string[]
}

export interface QuotteryQtryGOVStruct {
  mShareHolderFee: bigint
  mBurnFee: bigint
  mOperationFee: bigint
  mFeePerDay: bigint
  mDepositAmountForDispute: bigint
  mOperationId: string
}

export interface QuotteryDepositInfoStruct {
  pubkey: string
  amount: bigint
}

const STRUCTS: Record<string, NamedStruct> = {
  QtryEventInfo: {
  name: 'QtryEventInfo',
  byteLength: 264,
  fields: [
    {
      name: 'eid',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'desc',
      type: 'array',
      offset: 8,
      byteLength: 128,
      arrayLength: 4,
      arrayItemType: 'id',
      arrayItemByteLength: 32,
    },
    {
      name: 'option0Desc',
      type: 'array',
      offset: 136,
      byteLength: 64,
      arrayLength: 2,
      arrayItemType: 'id',
      arrayItemByteLength: 32,
    },
    {
      name: 'option1Desc',
      type: 'array',
      offset: 200,
      byteLength: 64,
      arrayLength: 2,
      arrayItemType: 'id',
      arrayItemByteLength: 32,
    },
],
},
  QtryGOV: {
  name: 'QtryGOV',
  byteLength: 72,
  fields: [
    {
      name: 'mShareHolderFee',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'mBurnFee',
      type: 'uint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'mOperationFee',
      type: 'uint64',
      offset: 16,
      byteLength: 8,
    },
    {
      name: 'mFeePerDay',
      type: 'sint64',
      offset: 24,
      byteLength: 8,
    },
    {
      name: 'mDepositAmountForDispute',
      type: 'sint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'mOperationId',
      type: 'id',
      offset: 40,
      byteLength: 32,
    },
],
},
  DepositInfo: {
  name: 'DepositInfo',
  byteLength: 40,
  fields: [
    {
      name: 'pubkey',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'amount',
      type: 'sint64',
      offset: 32,
      byteLength: 8,
    },
],
},
}

export const QUOTTERY_CLEAN_MEMORY_INPUT_TYPE = 0
export const QUOTTERY_CLEAN_MEMORY_INPUT_SIZE = 0
export const QUOTTERY_CLEAN_MEMORY_OUTPUT_SIZE = 0

export const QUOTTERY_ADD_TO_ASK_ORDER_INPUT_TYPE = 9
export const QUOTTERY_ADD_TO_ASK_ORDER_INPUT_SIZE = 32
export const QUOTTERY_ADD_TO_ASK_ORDER_OUTPUT_SIZE = 8

export interface QuotteryAddToAskOrderInput {
  eventId: bigint
  option: bigint
  amount: bigint
  price: bigint
}

export const QUOTTERY_ADD_TO_ASK_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'option',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'price',
    type: 'sint64',
    offset: 24,
    byteLength: 8,
  },
]

export function buildQuotteryAddToAskOrderInput(
  input: QuotteryAddToAskOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_ADD_TO_ASK_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QuotteryAddToAskOrderOutput {
  status: bigint
}

export const QUOTTERY_ADD_TO_ASK_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQuotteryAddToAskOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryAddToAskOrderOutput {
  return decodePayload(
    data,
    QUOTTERY_ADD_TO_ASK_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryAddToAskOrderOutput
}

export const QUOTTERY_REMOVE_ASK_ORDER_INPUT_TYPE = 10
export const QUOTTERY_REMOVE_ASK_ORDER_INPUT_SIZE = 32
export const QUOTTERY_REMOVE_ASK_ORDER_OUTPUT_SIZE = 8

export interface QuotteryRemoveAskOrderInput {
  eventId: bigint
  option: bigint
  amount: bigint
  price: bigint
}

export const QUOTTERY_REMOVE_ASK_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'option',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'price',
    type: 'sint64',
    offset: 24,
    byteLength: 8,
  },
]

export function buildQuotteryRemoveAskOrderInput(
  input: QuotteryRemoveAskOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_REMOVE_ASK_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QuotteryRemoveAskOrderOutput {
  status: bigint
}

export const QUOTTERY_REMOVE_ASK_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQuotteryRemoveAskOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryRemoveAskOrderOutput {
  return decodePayload(
    data,
    QUOTTERY_REMOVE_ASK_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryRemoveAskOrderOutput
}

export const QUOTTERY_REMOVE_BID_ORDER_INPUT_TYPE = 11
export const QUOTTERY_REMOVE_BID_ORDER_INPUT_SIZE = 32
export const QUOTTERY_REMOVE_BID_ORDER_OUTPUT_SIZE = 8

export interface QuotteryRemoveBidOrderInput {
  eventId: bigint
  option: bigint
  amount: bigint
  price: bigint
}

export const QUOTTERY_REMOVE_BID_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'option',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'price',
    type: 'sint64',
    offset: 24,
    byteLength: 8,
  },
]

export function buildQuotteryRemoveBidOrderInput(
  input: QuotteryRemoveBidOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_REMOVE_BID_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QuotteryRemoveBidOrderOutput {
  status: bigint
}

export const QUOTTERY_REMOVE_BID_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQuotteryRemoveBidOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryRemoveBidOrderOutput {
  return decodePayload(
    data,
    QUOTTERY_REMOVE_BID_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryRemoveBidOrderOutput
}

export const QUOTTERY_ADD_TO_BID_ORDER_INPUT_TYPE = 12
export const QUOTTERY_ADD_TO_BID_ORDER_INPUT_SIZE = 32
export const QUOTTERY_ADD_TO_BID_ORDER_OUTPUT_SIZE = 8

export interface QuotteryAddToBidOrderInput {
  eventId: bigint
  option: bigint
  amount: bigint
  price: bigint
}

export const QUOTTERY_ADD_TO_BID_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'option',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'amount',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'price',
    type: 'sint64',
    offset: 24,
    byteLength: 8,
  },
]

export function buildQuotteryAddToBidOrderInput(
  input: QuotteryAddToBidOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_ADD_TO_BID_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QuotteryAddToBidOrderOutput {
  status: bigint
}

export const QUOTTERY_ADD_TO_BID_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQuotteryAddToBidOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryAddToBidOrderOutput {
  return decodePayload(
    data,
    QUOTTERY_ADD_TO_BID_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryAddToBidOrderOutput
}

export const QUOTTERY_DISPUTE_INPUT_TYPE = 13
export const QUOTTERY_DISPUTE_INPUT_SIZE = 8
export const QUOTTERY_DISPUTE_OUTPUT_SIZE = 0

export interface QuotteryDisputeInput {
  eventId: bigint
}

export const QUOTTERY_DISPUTE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQuotteryDisputeInput(
  input: QuotteryDisputeInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_DISPUTE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QUOTTERY_USER_CLAIM_REWARD_INPUT_TYPE = 14
export const QUOTTERY_USER_CLAIM_REWARD_INPUT_SIZE = 8
export const QUOTTERY_USER_CLAIM_REWARD_OUTPUT_SIZE = 0

export interface QuotteryUserClaimRewardInput {
  eventId: bigint
}

export const QUOTTERY_USER_CLAIM_REWARD_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQuotteryUserClaimRewardInput(
  input: QuotteryUserClaimRewardInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_USER_CLAIM_REWARD_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QUOTTERY_GO_FORCE_CLAIM_REWARD_INPUT_TYPE = 15
export const QUOTTERY_GO_FORCE_CLAIM_REWARD_INPUT_SIZE = 520
export const QUOTTERY_GO_FORCE_CLAIM_REWARD_OUTPUT_SIZE = 0

export interface QuotteryGOForceClaimRewardInput {
  eventId: bigint
  pubkeys: string[]
}

export const QUOTTERY_GO_FORCE_CLAIM_REWARD_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'pubkeys',
    type: 'array',
    offset: 8,
    byteLength: 512,
    arrayLength: 16,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
]

export function buildQuotteryGOForceClaimRewardInput(
  input: QuotteryGOForceClaimRewardInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_GO_FORCE_CLAIM_REWARD_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QUOTTERY_RESOLVE_DISPUTE_INPUT_TYPE = 17
export const QUOTTERY_RESOLVE_DISPUTE_INPUT_SIZE = 16
export const QUOTTERY_RESOLVE_DISPUTE_OUTPUT_SIZE = 0

export interface QuotteryResolveDisputeInput {
  eventId: bigint
  vote: bigint
}

export const QUOTTERY_RESOLVE_DISPUTE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'vote',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildQuotteryResolveDisputeInput(
  input: QuotteryResolveDisputeInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_RESOLVE_DISPUTE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QUOTTERY_TRY_FINALIZE_EVENT_INPUT_TYPE = 18
export const QUOTTERY_TRY_FINALIZE_EVENT_INPUT_SIZE = 8
export const QUOTTERY_TRY_FINALIZE_EVENT_OUTPUT_SIZE = 0

export interface QuotteryTryFinalizeEventInput {
  eventId: bigint
}

export const QUOTTERY_TRY_FINALIZE_EVENT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQuotteryTryFinalizeEventInput(
  input: QuotteryTryFinalizeEventInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_TRY_FINALIZE_EVENT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QUOTTERY_CREATE_EVENT_INPUT_TYPE = 21
export const QUOTTERY_CREATE_EVENT_INPUT_SIZE = 264
export const QUOTTERY_CREATE_EVENT_OUTPUT_SIZE = 0

export interface QuotteryCreateEventInput {
  qei: QuotteryQtryEventInfoStruct
}

export const QUOTTERY_CREATE_EVENT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'qei',
    type: 'struct',
    offset: 0,
    byteLength: 264,
    structRef: 'QtryEventInfo',
  },
]

export function buildQuotteryCreateEventInput(
  input: QuotteryCreateEventInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_CREATE_EVENT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QUOTTERY_PUBLISH_RESULT_INPUT_TYPE = 22
export const QUOTTERY_PUBLISH_RESULT_INPUT_SIZE = 16
export const QUOTTERY_PUBLISH_RESULT_OUTPUT_SIZE = 0

export interface QuotteryPublishResultInput {
  eventId: bigint
  option: bigint
}

export const QUOTTERY_PUBLISH_RESULT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'option',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildQuotteryPublishResultInput(
  input: QuotteryPublishResultInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_PUBLISH_RESULT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QUOTTERY_UPDATE_FEE_DISCOUNT_LIST_INPUT_TYPE = 24
export const QUOTTERY_UPDATE_FEE_DISCOUNT_LIST_INPUT_SIZE = 48
export const QUOTTERY_UPDATE_FEE_DISCOUNT_LIST_OUTPUT_SIZE = 0

export interface QuotteryUpdateFeeDiscountListInput {
  userId: string
  newFeeRate: bigint
  ops: bigint
}

export const QUOTTERY_UPDATE_FEE_DISCOUNT_LIST_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'userId',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'newFeeRate',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'ops',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQuotteryUpdateFeeDiscountListInput(
  input: QuotteryUpdateFeeDiscountListInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_UPDATE_FEE_DISCOUNT_LIST_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QUOTTERY_PROPOSAL_VOTE_INPUT_TYPE = 25
export const QUOTTERY_PROPOSAL_VOTE_INPUT_SIZE = 72
export const QUOTTERY_PROPOSAL_VOTE_OUTPUT_SIZE = 0

export interface QuotteryProposalVoteInput {
  proposed: QuotteryQtryGOVStruct
}

export const QUOTTERY_PROPOSAL_VOTE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposed',
    type: 'struct',
    offset: 0,
    byteLength: 72,
    structRef: 'QtryGOV',
  },
]

export function buildQuotteryProposalVoteInput(
  input: QuotteryProposalVoteInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_PROPOSAL_VOTE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QUOTTERY_TRANSFER_QUSD_INPUT_TYPE = 28
export const QUOTTERY_TRANSFER_QUSD_INPUT_SIZE = 40
export const QUOTTERY_TRANSFER_QUSD_OUTPUT_SIZE = 8

export interface QuotteryTransferQUSDInput {
  receiver: string
  amount: bigint
}

export const QUOTTERY_TRANSFER_QUSD_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'receiver',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'amount',
    type: 'sint64',
    offset: 32,
    byteLength: 8,
  },
]

export function buildQuotteryTransferQUSDInput(
  input: QuotteryTransferQUSDInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_TRANSFER_QUSD_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QuotteryTransferQUSDOutput {
  amount: bigint
}

export const QUOTTERY_TRANSFER_QUSD_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQuotteryTransferQUSDOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryTransferQUSDOutput {
  return decodePayload(
    data,
    QUOTTERY_TRANSFER_QUSD_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryTransferQUSDOutput
}

export const QUOTTERY_TRANSFER_QTRYGOV_INPUT_TYPE = 29
export const QUOTTERY_TRANSFER_QTRYGOV_INPUT_SIZE = 40
export const QUOTTERY_TRANSFER_QTRYGOV_OUTPUT_SIZE = 8

export interface QuotteryTransferQTRYGOVInput {
  receiver: string
  amount: bigint
}

export const QUOTTERY_TRANSFER_QTRYGOV_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'receiver',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'amount',
    type: 'sint64',
    offset: 32,
    byteLength: 8,
  },
]

export function buildQuotteryTransferQTRYGOVInput(
  input: QuotteryTransferQTRYGOVInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_TRANSFER_QTRYGOV_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QuotteryTransferQTRYGOVOutput {
  amount: bigint
}

export const QUOTTERY_TRANSFER_QTRYGOV_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQuotteryTransferQTRYGOVOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryTransferQTRYGOVOutput {
  return decodePayload(
    data,
    QUOTTERY_TRANSFER_QTRYGOV_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryTransferQTRYGOVOutput
}

export const QUOTTERY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 30
export const QUOTTERY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_SIZE = 12
export const QUOTTERY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_SIZE = 8

export interface QuotteryTransferShareManagementRightsInput {
  numberOfShares: bigint
  newManagingContractIndex: number
}

export const QUOTTERY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
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

export function buildQuotteryTransferShareManagementRightsInput(
  input: QuotteryTransferShareManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QuotteryTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
}

export const QUOTTERY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQuotteryTransferShareManagementRightsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryTransferShareManagementRightsOutput {
  return decodePayload(
    data,
    QUOTTERY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryTransferShareManagementRightsOutput
}

export const QUOTTERY_BASIC_INFO_INPUT_TYPE = 1
export const QUOTTERY_BASIC_INFO_INPUT_SIZE = 0
export const QUOTTERY_BASIC_INFO_OUTPUT_SIZE = 112

export interface QuotteryBasicInfoOutput {
  operationFee: bigint
  shareholderFee: bigint
  burnFee: bigint
  nIssuedEvent: bigint
  shareholdersRevenue: bigint
  operationRevenue: bigint
  burnedAmount: bigint
  mFeePerDay: bigint
  antiSpamAmount: bigint
  depositAmountForDispute: bigint
  gameOperator: string
}

export const QUOTTERY_BASIC_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'operationFee',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'shareholderFee',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'burnFee',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'nIssuedEvent',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'shareholdersRevenue',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'operationRevenue',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'burnedAmount',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'mFeePerDay',
    type: 'uint64',
    offset: 56,
    byteLength: 8,
  },
  {
    name: 'antiSpamAmount',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: 'depositAmountForDispute',
    type: 'uint64',
    offset: 72,
    byteLength: 8,
  },
  {
    name: 'gameOperator',
    type: 'id',
    offset: 80,
    byteLength: 32,
  },
]

export function decodeQuotteryBasicInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryBasicInfoOutput {
  return decodePayload(
    data,
    QUOTTERY_BASIC_INFO_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryBasicInfoOutput
}

export const QUOTTERY_GET_EVENT_INFO_INPUT_TYPE = 7
export const QUOTTERY_GET_EVENT_INFO_INPUT_SIZE = 8
export const QUOTTERY_GET_EVENT_INFO_OUTPUT_SIZE = 320

export interface QuotteryGetEventInfoInput {
  eventId: bigint
}

export const QUOTTERY_GET_EVENT_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQuotteryGetEventInfoInput(
  input: QuotteryGetEventInfoInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_GET_EVENT_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QuotteryGetEventInfoOutput {
  qei: QuotteryQtryEventInfoStruct
  resultByGO: number
  publishTickTime: number
  disputerInfo: QuotteryDepositInfoStruct
  computorsVote0: number
  computorsVote1: number
}

export const QUOTTERY_GET_EVENT_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'qei',
    type: 'struct',
    offset: 0,
    byteLength: 264,
    structRef: 'QtryEventInfo',
  },
  {
    name: 'resultByGO',
    type: 'sint32',
    offset: 264,
    byteLength: 4,
  },
  {
    name: 'publishTickTime',
    type: 'uint32',
    offset: 268,
    byteLength: 4,
  },
  {
    name: 'disputerInfo',
    type: 'struct',
    offset: 272,
    byteLength: 40,
    structRef: 'DepositInfo',
  },
  {
    name: 'computorsVote0',
    type: 'uint32',
    offset: 312,
    byteLength: 4,
  },
  {
    name: 'computorsVote1',
    type: 'uint32',
    offset: 316,
    byteLength: 4,
  },
]

export function decodeQuotteryGetEventInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryGetEventInfoOutput {
  return decodePayload(
    data,
    QUOTTERY_GET_EVENT_INFO_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryGetEventInfoOutput
}

export const QUOTTERY_GET_EVENT_INFO_BATCH_INPUT_TYPE = 8
export const QUOTTERY_GET_EVENT_INFO_BATCH_INPUT_SIZE = 512
export const QUOTTERY_GET_EVENT_INFO_BATCH_OUTPUT_SIZE = 16896

export interface QuotteryGetEventInfoBatchInput {
  eventIds: bigint[]
}

export const QUOTTERY_GET_EVENT_INFO_BATCH_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventIds',
    type: 'array',
    offset: 0,
    byteLength: 512,
    arrayLength: 64,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
]

export function buildQuotteryGetEventInfoBatchInput(
  input: QuotteryGetEventInfoBatchInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_GET_EVENT_INFO_BATCH_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QuotteryGetEventInfoBatchOutput {
  aqei: number[]
}

export const QUOTTERY_GET_EVENT_INFO_BATCH_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'aqei',
    type: 'array',
    offset: 0,
    byteLength: 16896,
    arrayLength: 64,
    arrayItemByteLength: 264,
    arrayItemStructRef: 'QtryEventInfo',
  },
]

export function decodeQuotteryGetEventInfoBatchOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryGetEventInfoBatchOutput {
  return decodePayload(
    data,
    QUOTTERY_GET_EVENT_INFO_BATCH_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryGetEventInfoBatchOutput
}

export const QUOTTERY_GET_ACTIVE_EVENT_INPUT_TYPE = 19
export const QUOTTERY_GET_ACTIVE_EVENT_INPUT_SIZE = 0
export const QUOTTERY_GET_ACTIVE_EVENT_OUTPUT_SIZE = 0

export interface QuotteryGetActiveEventOutput {
  recentActiveEvent: bigint[]
}

export const QUOTTERY_GET_ACTIVE_EVENT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'recentActiveEvent',
    type: 'array',
    offset: 0,
    byteLength: 0,
    arrayLength: 0,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
]

export function decodeQuotteryGetActiveEventOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryGetActiveEventOutput {
  return decodePayload(
    data,
    QUOTTERY_GET_ACTIVE_EVENT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryGetActiveEventOutput
}

export const QUOTTERY_GET_USER_POSITION_INPUT_TYPE = 20
export const QUOTTERY_GET_USER_POSITION_INPUT_SIZE = 32
export const QUOTTERY_GET_USER_POSITION_OUTPUT_SIZE = 8

export interface QuotteryGetUserPositionInput {
  uid: string
}

export const QUOTTERY_GET_USER_POSITION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'uid',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQuotteryGetUserPositionInput(
  input: QuotteryGetUserPositionInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_GET_USER_POSITION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QuotteryGetUserPositionOutput {
  count: bigint
}

export const QUOTTERY_GET_USER_POSITION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'count',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQuotteryGetUserPositionOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryGetUserPositionOutput {
  return decodePayload(
    data,
    QUOTTERY_GET_USER_POSITION_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryGetUserPositionOutput
}

export const QUOTTERY_GET_ORDERS_INPUT_TYPE = 23
export const QUOTTERY_GET_ORDERS_INPUT_SIZE = 32
export const QUOTTERY_GET_ORDERS_OUTPUT_SIZE = 0

export interface QuotteryGetOrdersInput {
  eventId: bigint
  option: bigint
  isBid: bigint
  offset: bigint
}

export const QUOTTERY_GET_ORDERS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'eventId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'option',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'isBid',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'offset',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
]

export function buildQuotteryGetOrdersInput(
  input: QuotteryGetOrdersInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_GET_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QUOTTERY_GET_TOP_PROPOSALS_INPUT_TYPE = 26
export const QUOTTERY_GET_TOP_PROPOSALS_INPUT_SIZE = 0
export const QUOTTERY_GET_TOP_PROPOSALS_OUTPUT_SIZE = 4

export interface QuotteryGetTopProposalsOutput {
  uniqueCount: number
}

export const QUOTTERY_GET_TOP_PROPOSALS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'uniqueCount',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQuotteryGetTopProposalsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryGetTopProposalsOutput {
  return decodePayload(
    data,
    QUOTTERY_GET_TOP_PROPOSALS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryGetTopProposalsOutput
}

export const QUOTTERY_GET_APPROVED_AMOUNT_INPUT_TYPE = 27
export const QUOTTERY_GET_APPROVED_AMOUNT_INPUT_SIZE = 32
export const QUOTTERY_GET_APPROVED_AMOUNT_OUTPUT_SIZE = 8

export interface QuotteryGetApprovedAmountInput {
  pk: string
}

export const QUOTTERY_GET_APPROVED_AMOUNT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'pk',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQuotteryGetApprovedAmountInput(
  input: QuotteryGetApprovedAmountInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUOTTERY_GET_APPROVED_AMOUNT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QuotteryGetApprovedAmountOutput {
  amount: bigint
}

export const QUOTTERY_GET_APPROVED_AMOUNT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQuotteryGetApprovedAmountOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QuotteryGetApprovedAmountOutput {
  return decodePayload(
    data,
    QUOTTERY_GET_APPROVED_AMOUNT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QuotteryGetApprovedAmountOutput
}

