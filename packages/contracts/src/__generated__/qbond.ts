// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const Q_BOND_CONTRACT_INDEX = 17

export interface QBondOrderStruct {
  owner: string
  epoch: bigint
  numberOfMBonds: bigint
}

const STRUCTS: Record<string, NamedStruct> = {
  Order: {
  name: 'Order',
  byteLength: 48,
  fields: [
    {
      name: 'owner',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'epoch',
      type: 'sint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'numberOfMBonds',
      type: 'sint64',
      offset: 40,
      byteLength: 8,
    },
],
},
}

export const Q_BOND_STAKE_INPUT_TYPE = 2
export const Q_BOND_STAKE_INPUT_SIZE = 8
export const Q_BOND_STAKE_OUTPUT_SIZE = 0

export interface QBondStakeInput {
  quMillions: bigint
}

export const Q_BOND_STAKE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'quMillions',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQBondStakeInput(
  input: QBondStakeInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_STAKE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_INPUT_TYPE = 3
export const Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_INPUT_SIZE = 48
export const Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_OUTPUT_SIZE = 8

export interface QBondTransferMBondOwnershipAndPossessionInput {
  newOwnerAndPossessor: string
  epoch: bigint
  numberOfMBonds: bigint
}

export const Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newOwnerAndPossessor',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'epoch',
    type: 'sint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'numberOfMBonds',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQBondTransferMBondOwnershipAndPossessionInput(
  input: QBondTransferMBondOwnershipAndPossessionInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondTransferMBondOwnershipAndPossessionOutput {
  transferredMBonds: bigint
}

export const Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredMBonds',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondTransferMBondOwnershipAndPossessionOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondTransferMBondOwnershipAndPossessionOutput {
  return decodePayload(
    data,
    Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondTransferMBondOwnershipAndPossessionOutput
}

export const Q_BOND_ADD_ASK_ORDER_INPUT_TYPE = 4
export const Q_BOND_ADD_ASK_ORDER_INPUT_SIZE = 24
export const Q_BOND_ADD_ASK_ORDER_OUTPUT_SIZE = 8

export interface QBondAddAskOrderInput {
  epoch: bigint
  price: bigint
  numberOfMBonds: bigint
}

export const Q_BOND_ADD_ASK_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'price',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'numberOfMBonds',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
]

export function buildQBondAddAskOrderInput(
  input: QBondAddAskOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_ADD_ASK_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondAddAskOrderOutput {
  addedMBondsAmount: bigint
}

export const Q_BOND_ADD_ASK_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'addedMBondsAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondAddAskOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondAddAskOrderOutput {
  return decodePayload(
    data,
    Q_BOND_ADD_ASK_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondAddAskOrderOutput
}

export const Q_BOND_REMOVE_ASK_ORDER_INPUT_TYPE = 5
export const Q_BOND_REMOVE_ASK_ORDER_INPUT_SIZE = 24
export const Q_BOND_REMOVE_ASK_ORDER_OUTPUT_SIZE = 8

export interface QBondRemoveAskOrderInput {
  epoch: bigint
  price: bigint
  numberOfMBonds: bigint
}

export const Q_BOND_REMOVE_ASK_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'price',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'numberOfMBonds',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
]

export function buildQBondRemoveAskOrderInput(
  input: QBondRemoveAskOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_REMOVE_ASK_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondRemoveAskOrderOutput {
  removedMBondsAmount: bigint
}

export const Q_BOND_REMOVE_ASK_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'removedMBondsAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondRemoveAskOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondRemoveAskOrderOutput {
  return decodePayload(
    data,
    Q_BOND_REMOVE_ASK_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondRemoveAskOrderOutput
}

export const Q_BOND_ADD_BID_ORDER_INPUT_TYPE = 6
export const Q_BOND_ADD_BID_ORDER_INPUT_SIZE = 24
export const Q_BOND_ADD_BID_ORDER_OUTPUT_SIZE = 8

export interface QBondAddBidOrderInput {
  epoch: bigint
  price: bigint
  numberOfMBonds: bigint
}

export const Q_BOND_ADD_BID_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'price',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'numberOfMBonds',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
]

export function buildQBondAddBidOrderInput(
  input: QBondAddBidOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_ADD_BID_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondAddBidOrderOutput {
  addedMBondsAmount: bigint
}

export const Q_BOND_ADD_BID_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'addedMBondsAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondAddBidOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondAddBidOrderOutput {
  return decodePayload(
    data,
    Q_BOND_ADD_BID_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondAddBidOrderOutput
}

export const Q_BOND_REMOVE_BID_ORDER_INPUT_TYPE = 7
export const Q_BOND_REMOVE_BID_ORDER_INPUT_SIZE = 24
export const Q_BOND_REMOVE_BID_ORDER_OUTPUT_SIZE = 8

export interface QBondRemoveBidOrderInput {
  epoch: bigint
  price: bigint
  numberOfMBonds: bigint
}

export const Q_BOND_REMOVE_BID_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'price',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'numberOfMBonds',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
]

export function buildQBondRemoveBidOrderInput(
  input: QBondRemoveBidOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_REMOVE_BID_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondRemoveBidOrderOutput {
  removedMBondsAmount: bigint
}

export const Q_BOND_REMOVE_BID_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'removedMBondsAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondRemoveBidOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondRemoveBidOrderOutput {
  return decodePayload(
    data,
    Q_BOND_REMOVE_BID_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondRemoveBidOrderOutput
}

export const Q_BOND_BURN_QU_INPUT_TYPE = 8
export const Q_BOND_BURN_QU_INPUT_SIZE = 8
export const Q_BOND_BURN_QU_OUTPUT_SIZE = 8

export interface QBondBurnQUInput {
  amount: bigint
}

export const Q_BOND_BURN_QU_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQBondBurnQUInput(
  input: QBondBurnQUInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_BURN_QU_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondBurnQUOutput {
  amount: bigint
}

export const Q_BOND_BURN_QU_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondBurnQUOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondBurnQUOutput {
  return decodePayload(
    data,
    Q_BOND_BURN_QU_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondBurnQUOutput
}

export const Q_BOND_UPDATE_CFA_INPUT_TYPE = 9
export const Q_BOND_UPDATE_CFA_INPUT_SIZE = 32
export const Q_BOND_UPDATE_CFA_OUTPUT_SIZE = 0

export interface QBondUpdateCFAInput {
  user: string
}

export const Q_BOND_UPDATE_CFA_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'user',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQBondUpdateCFAInput(
  input: QBondUpdateCFAInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_UPDATE_CFA_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const Q_BOND_GET_FEES_INPUT_TYPE = 10
export const Q_BOND_GET_FEES_INPUT_SIZE = 0
export const Q_BOND_GET_FEES_OUTPUT_SIZE = 24

export interface QBondGetFeesOutput {
  stakeFeePercent: bigint
  tradeFeePercent: bigint
  transferFee: bigint
}

export const Q_BOND_GET_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'stakeFeePercent',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'tradeFeePercent',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'transferFee',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
]

export function decodeQBondGetFeesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondGetFeesOutput {
  return decodePayload(
    data,
    Q_BOND_GET_FEES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondGetFeesOutput
}

export const Q_BOND_GET_EARNED_FEES_INPUT_TYPE = 11
export const Q_BOND_GET_EARNED_FEES_INPUT_SIZE = 0
export const Q_BOND_GET_EARNED_FEES_OUTPUT_SIZE = 16

export interface QBondGetEarnedFeesOutput {
  stakeFees: bigint
  tradeFees: bigint
}

export const Q_BOND_GET_EARNED_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'stakeFees',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'tradeFees',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function decodeQBondGetEarnedFeesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondGetEarnedFeesOutput {
  return decodePayload(
    data,
    Q_BOND_GET_EARNED_FEES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondGetEarnedFeesOutput
}

export const Q_BOND_GET_INFO_PER_EPOCH_INPUT_TYPE = 12
export const Q_BOND_GET_INFO_PER_EPOCH_INPUT_SIZE = 8
export const Q_BOND_GET_INFO_PER_EPOCH_OUTPUT_SIZE = 24

export interface QBondGetInfoPerEpochInput {
  epoch: bigint
}

export const Q_BOND_GET_INFO_PER_EPOCH_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQBondGetInfoPerEpochInput(
  input: QBondGetInfoPerEpochInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_GET_INFO_PER_EPOCH_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondGetInfoPerEpochOutput {
  stakersAmount: bigint
  totalStaked: bigint
  apy: bigint
}

export const Q_BOND_GET_INFO_PER_EPOCH_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'stakersAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'totalStaked',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'apy',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
]

export function decodeQBondGetInfoPerEpochOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondGetInfoPerEpochOutput {
  return decodePayload(
    data,
    Q_BOND_GET_INFO_PER_EPOCH_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondGetInfoPerEpochOutput
}

export const Q_BOND_GET_ORDERS_INPUT_TYPE = 13
export const Q_BOND_GET_ORDERS_INPUT_SIZE = 24
export const Q_BOND_GET_ORDERS_OUTPUT_SIZE = 24576

export interface QBondGetOrdersInput {
  epoch: bigint
  askOrdersOffset: bigint
  bidOrdersOffset: bigint
}

export const Q_BOND_GET_ORDERS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'askOrdersOffset',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'bidOrdersOffset',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
]

export function buildQBondGetOrdersInput(
  input: QBondGetOrdersInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_GET_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondGetOrdersOutput {
  askOrders: number[]
  bidOrders: number[]
}

export const Q_BOND_GET_ORDERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'askOrders',
    type: 'array',
    offset: 0,
    byteLength: 12288,
    arrayLength: 256,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'Order',
  },
  {
    name: 'bidOrders',
    type: 'array',
    offset: 12288,
    byteLength: 12288,
    arrayLength: 256,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'Order',
  },
]

export function decodeQBondGetOrdersOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondGetOrdersOutput {
  return decodePayload(
    data,
    Q_BOND_GET_ORDERS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondGetOrdersOutput
}

export const Q_BOND_GET_USER_ORDERS_INPUT_TYPE = 14
export const Q_BOND_GET_USER_ORDERS_INPUT_SIZE = 48
export const Q_BOND_GET_USER_ORDERS_OUTPUT_SIZE = 24576

export interface QBondGetUserOrdersInput {
  owner: string
  askOrdersOffset: bigint
  bidOrdersOffset: bigint
}

export const Q_BOND_GET_USER_ORDERS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'owner',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'askOrdersOffset',
    type: 'sint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'bidOrdersOffset',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQBondGetUserOrdersInput(
  input: QBondGetUserOrdersInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_GET_USER_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondGetUserOrdersOutput {
  askOrders: number[]
  bidOrders: number[]
}

export const Q_BOND_GET_USER_ORDERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'askOrders',
    type: 'array',
    offset: 0,
    byteLength: 12288,
    arrayLength: 256,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'Order',
  },
  {
    name: 'bidOrders',
    type: 'array',
    offset: 12288,
    byteLength: 12288,
    arrayLength: 256,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'Order',
  },
]

export function decodeQBondGetUserOrdersOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondGetUserOrdersOutput {
  return decodePayload(
    data,
    Q_BOND_GET_USER_ORDERS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondGetUserOrdersOutput
}

export const Q_BOND_GET_M_BONDS_TABLE_INPUT_TYPE = 15
export const Q_BOND_GET_M_BONDS_TABLE_INPUT_SIZE = 0
export const Q_BOND_GET_M_BONDS_TABLE_OUTPUT_SIZE = 0

export const Q_BOND_GET_USER_M_BONDS_INPUT_TYPE = 16
export const Q_BOND_GET_USER_M_BONDS_INPUT_SIZE = 32
export const Q_BOND_GET_USER_M_BONDS_OUTPUT_SIZE = 8

export interface QBondGetUserMBondsInput {
  owner: string
}

export const Q_BOND_GET_USER_M_BONDS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'owner',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQBondGetUserMBondsInput(
  input: QBondGetUserMBondsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_BOND_GET_USER_M_BONDS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondGetUserMBondsOutput {
  totalMBondsAmount: bigint
}

export const Q_BOND_GET_USER_M_BONDS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'totalMBondsAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondGetUserMBondsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondGetUserMBondsOutput {
  return decodePayload(
    data,
    Q_BOND_GET_USER_M_BONDS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondGetUserMBondsOutput
}

export const Q_BOND_GET_CFA_INPUT_TYPE = 17
export const Q_BOND_GET_CFA_INPUT_SIZE = 0
export const Q_BOND_GET_CFA_OUTPUT_SIZE = 32768

export interface QBondGetCFAOutput {
  commissionFreeAddresses: string[]
}

export const Q_BOND_GET_CFA_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'commissionFreeAddresses',
    type: 'array',
    offset: 0,
    byteLength: 32768,
    arrayLength: 1024,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
]

export function decodeQBondGetCFAOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QBondGetCFAOutput {
  return decodePayload(
    data,
    Q_BOND_GET_CFA_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QBondGetCFAOutput
}

