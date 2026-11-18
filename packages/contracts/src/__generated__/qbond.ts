// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '@qubic.org/types'

export const Q_BOND_CONTRACT_INDEX = 17

export interface QBondOrderStruct {
  owner: string
  epoch: bigint
  numberOfMBonds: bigint
  feeDebt: bigint
}

export interface QBondTableEntryStruct {
  epoch: bigint
  totalStakedQBond: bigint
  totalStakedQEarn: bigint
  apy: bigint
}

export interface QBondMBondEntityStruct {
  epoch: bigint
  amount: bigint
  apy: bigint
}

const STRUCTS: Record<string, NamedStruct> = {
  'Order': {
  name: 'Order',
  byteLength: 56,
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
    {
      name: 'feeDebt',
      type: 'sint64',
      offset: 48,
      byteLength: 8,
    },
],
},
  'TableEntry': {
  name: 'TableEntry',
  byteLength: 32,
  fields: [
    {
      name: 'epoch',
      type: 'sint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'totalStakedQBond',
      type: 'sint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'totalStakedQEarn',
      type: 'sint64',
      offset: 16,
      byteLength: 8,
    },
    {
      name: 'apy',
      type: 'uint64',
      offset: 24,
      byteLength: 8,
    },
],
},
  'MBondEntity': {
  name: 'MBondEntity',
  byteLength: 24,
  fields: [
    {
      name: 'epoch',
      type: 'sint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'amount',
      type: 'sint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'apy',
      type: 'uint64',
      offset: 16,
      byteLength: 8,
    },
],
},
}

export const Q_BOND_STAKE_INPUT_TYPE = 1

export interface QBondStakeInput {
  quMillions: bigint
}

const Q_BOND_STAKE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'quMillions',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQBondStakeInput(
  input: QBondStakeInput,
): ContractCall {
  return { contractIndex: Q_BOND_CONTRACT_INDEX, inputType: Q_BOND_STAKE_INPUT_TYPE, payload: buildPayload(Q_BOND_STAKE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_INPUT_TYPE = 2

export interface QBondTransferMBondOwnershipAndPossessionInput {
  newOwnerAndPossessor: string
  epoch: bigint
  numberOfMBonds: bigint
}

const Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: Q_BOND_CONTRACT_INDEX, inputType: Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_INPUT_TYPE, payload: buildPayload(Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QBondTransferMBondOwnershipAndPossessionOutput {
  transferredMBonds: bigint
}

const Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredMBonds',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondTransferMBondOwnershipAndPossessionOutput(
  data: Uint8Array,
): QBondTransferMBondOwnershipAndPossessionOutput {
  return decodePayload(data, Q_BOND_TRANSFER_M_BOND_OWNERSHIP_AND_POSSESSION_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondTransferMBondOwnershipAndPossessionOutput
}

export const Q_BOND_ADD_ASK_ORDER_INPUT_TYPE = 3

export interface QBondAddAskOrderInput {
  epoch: bigint
  price: bigint
  numberOfMBonds: bigint
}

const Q_BOND_ADD_ASK_ORDER_INPUT_FIELDS: BinaryField[] = [
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
): ContractCall {
  return { contractIndex: Q_BOND_CONTRACT_INDEX, inputType: Q_BOND_ADD_ASK_ORDER_INPUT_TYPE, payload: buildPayload(Q_BOND_ADD_ASK_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QBondAddAskOrderOutput {
  addedMBondsAmount: bigint
}

const Q_BOND_ADD_ASK_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'addedMBondsAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondAddAskOrderOutput(
  data: Uint8Array,
): QBondAddAskOrderOutput {
  return decodePayload(data, Q_BOND_ADD_ASK_ORDER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondAddAskOrderOutput
}

export const Q_BOND_REMOVE_ASK_ORDER_INPUT_TYPE = 4

export interface QBondRemoveAskOrderInput {
  epoch: bigint
  price: bigint
  numberOfMBonds: bigint
}

const Q_BOND_REMOVE_ASK_ORDER_INPUT_FIELDS: BinaryField[] = [
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
): ContractCall {
  return { contractIndex: Q_BOND_CONTRACT_INDEX, inputType: Q_BOND_REMOVE_ASK_ORDER_INPUT_TYPE, payload: buildPayload(Q_BOND_REMOVE_ASK_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QBondRemoveAskOrderOutput {
  removedMBondsAmount: bigint
}

const Q_BOND_REMOVE_ASK_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'removedMBondsAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondRemoveAskOrderOutput(
  data: Uint8Array,
): QBondRemoveAskOrderOutput {
  return decodePayload(data, Q_BOND_REMOVE_ASK_ORDER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondRemoveAskOrderOutput
}

export const Q_BOND_ADD_BID_ORDER_INPUT_TYPE = 5

export interface QBondAddBidOrderInput {
  epoch: bigint
  price: bigint
  numberOfMBonds: bigint
}

const Q_BOND_ADD_BID_ORDER_INPUT_FIELDS: BinaryField[] = [
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
): ContractCall {
  return { contractIndex: Q_BOND_CONTRACT_INDEX, inputType: Q_BOND_ADD_BID_ORDER_INPUT_TYPE, payload: buildPayload(Q_BOND_ADD_BID_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QBondAddBidOrderOutput {
  addedMBondsAmount: bigint
}

const Q_BOND_ADD_BID_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'addedMBondsAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondAddBidOrderOutput(
  data: Uint8Array,
): QBondAddBidOrderOutput {
  return decodePayload(data, Q_BOND_ADD_BID_ORDER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondAddBidOrderOutput
}

export const Q_BOND_REMOVE_BID_ORDER_INPUT_TYPE = 6

export interface QBondRemoveBidOrderInput {
  epoch: bigint
  price: bigint
  numberOfMBonds: bigint
}

const Q_BOND_REMOVE_BID_ORDER_INPUT_FIELDS: BinaryField[] = [
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
): ContractCall {
  return { contractIndex: Q_BOND_CONTRACT_INDEX, inputType: Q_BOND_REMOVE_BID_ORDER_INPUT_TYPE, payload: buildPayload(Q_BOND_REMOVE_BID_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QBondRemoveBidOrderOutput {
  removedMBondsAmount: bigint
}

const Q_BOND_REMOVE_BID_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'removedMBondsAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondRemoveBidOrderOutput(
  data: Uint8Array,
): QBondRemoveBidOrderOutput {
  return decodePayload(data, Q_BOND_REMOVE_BID_ORDER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondRemoveBidOrderOutput
}

export const Q_BOND_BURN_QU_INPUT_TYPE = 7

export interface QBondBurnQUInput {
  amount: bigint
}

const Q_BOND_BURN_QU_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQBondBurnQUInput(
  input: QBondBurnQUInput,
): ContractCall {
  return { contractIndex: Q_BOND_CONTRACT_INDEX, inputType: Q_BOND_BURN_QU_INPUT_TYPE, payload: buildPayload(Q_BOND_BURN_QU_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QBondBurnQUOutput {
  amount: bigint
}

const Q_BOND_BURN_QU_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQBondBurnQUOutput(
  data: Uint8Array,
): QBondBurnQUOutput {
  return decodePayload(data, Q_BOND_BURN_QU_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondBurnQUOutput
}

export const Q_BOND_UPDATE_CFA_INPUT_TYPE = 8

export interface QBondUpdateCFAInput {
  user: string
  operation: number
}

const Q_BOND_UPDATE_CFA_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'user',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'operation',
    type: 'uint8',
    offset: 32,
    byteLength: 1,
  },
]

export function buildQBondUpdateCFAInput(
  input: QBondUpdateCFAInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: Q_BOND_CONTRACT_INDEX, inputType: Q_BOND_UPDATE_CFA_INPUT_TYPE, payload: buildPayload(Q_BOND_UPDATE_CFA_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QBondUpdateCFAOutput {
  result: number
}

const Q_BOND_UPDATE_CFA_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'result',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQBondUpdateCFAOutput(
  data: Uint8Array,
): QBondUpdateCFAOutput {
  return decodePayload(data, Q_BOND_UPDATE_CFA_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondUpdateCFAOutput
}

export const Q_BOND_GET_FEES_INPUT_TYPE = 1
export const Q_BOND_GET_FEES_INPUT_SIZE = 0

export interface QBondGetFeesOutput {
  stakeFeePercent: bigint
  tradeFeePercent: bigint
  transferFee: bigint
}

const Q_BOND_GET_FEES_OUTPUT_FIELDS: BinaryField[] = [
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
): QBondGetFeesOutput {
  return decodePayload(data, Q_BOND_GET_FEES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondGetFeesOutput
}

export async function qBondGetFees(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QBondGetFeesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_BOND_CONTRACT_INDEX,
    inputType: Q_BOND_GET_FEES_INPUT_TYPE,
    inputSize: Q_BOND_GET_FEES_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_BOND_GET_FEES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_BOND_GET_EARNED_FEES_INPUT_TYPE = 2
export const Q_BOND_GET_EARNED_FEES_INPUT_SIZE = 0

export interface QBondGetEarnedFeesOutput {
  stakeFees: bigint
  tradeFees: bigint
}

const Q_BOND_GET_EARNED_FEES_OUTPUT_FIELDS: BinaryField[] = [
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
): QBondGetEarnedFeesOutput {
  return decodePayload(data, Q_BOND_GET_EARNED_FEES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondGetEarnedFeesOutput
}

export async function qBondGetEarnedFees(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QBondGetEarnedFeesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_BOND_CONTRACT_INDEX,
    inputType: Q_BOND_GET_EARNED_FEES_INPUT_TYPE,
    inputSize: Q_BOND_GET_EARNED_FEES_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_BOND_GET_EARNED_FEES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_BOND_GET_INFO_PER_EPOCH_INPUT_TYPE = 3
export const Q_BOND_GET_INFO_PER_EPOCH_INPUT_SIZE = 8

export interface QBondGetInfoPerEpochInput {
  epoch: bigint
}

const Q_BOND_GET_INFO_PER_EPOCH_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQBondGetInfoPerEpochInput(
  input: QBondGetInfoPerEpochInput,
): Uint8Array {
  return buildPayload(Q_BOND_GET_INFO_PER_EPOCH_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QBondGetInfoPerEpochOutput {
  stakersAmount: bigint
  totalStaked: bigint
  apy: bigint
}

const Q_BOND_GET_INFO_PER_EPOCH_OUTPUT_FIELDS: BinaryField[] = [
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
): QBondGetInfoPerEpochOutput {
  return decodePayload(data, Q_BOND_GET_INFO_PER_EPOCH_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondGetInfoPerEpochOutput
}

export async function qBondGetInfoPerEpoch(
  live: SmartContractCaller,
  input: QBondGetInfoPerEpochInput,
  options?: ContractCallOptions,
): Promise<Result<QBondGetInfoPerEpochOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_BOND_CONTRACT_INDEX,
    inputType: Q_BOND_GET_INFO_PER_EPOCH_INPUT_TYPE,
    inputSize: Q_BOND_GET_INFO_PER_EPOCH_INPUT_SIZE,
    inputFields: Q_BOND_GET_INFO_PER_EPOCH_INPUT_FIELDS,
    outputFields: Q_BOND_GET_INFO_PER_EPOCH_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_BOND_GET_ORDERS_INPUT_TYPE = 4
export const Q_BOND_GET_ORDERS_INPUT_SIZE = 24

export interface QBondGetOrdersInput {
  epoch: bigint
  askOrdersOffset: bigint
  bidOrdersOffset: bigint
}

const Q_BOND_GET_ORDERS_INPUT_FIELDS: BinaryField[] = [
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
): Uint8Array {
  return buildPayload(Q_BOND_GET_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QBondGetOrdersOutput {
  askOrders: number[]
  bidOrders: number[]
}

const Q_BOND_GET_ORDERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'askOrders',
    type: 'array',
    offset: 0,
    byteLength: 14336,
    arrayLength: 256,
    arrayItemByteLength: 56,
    arrayItemStructRef: 'Order',
  },
  {
    name: 'bidOrders',
    type: 'array',
    offset: 14336,
    byteLength: 14336,
    arrayLength: 256,
    arrayItemByteLength: 56,
    arrayItemStructRef: 'Order',
  },
]

export function decodeQBondGetOrdersOutput(
  data: Uint8Array,
): QBondGetOrdersOutput {
  return decodePayload(data, Q_BOND_GET_ORDERS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondGetOrdersOutput
}

export async function qBondGetOrders(
  live: SmartContractCaller,
  input: QBondGetOrdersInput,
  options?: ContractCallOptions,
): Promise<Result<QBondGetOrdersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_BOND_CONTRACT_INDEX,
    inputType: Q_BOND_GET_ORDERS_INPUT_TYPE,
    inputSize: Q_BOND_GET_ORDERS_INPUT_SIZE,
    inputFields: Q_BOND_GET_ORDERS_INPUT_FIELDS,
    outputFields: Q_BOND_GET_ORDERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_BOND_GET_USER_ORDERS_INPUT_TYPE = 5
export const Q_BOND_GET_USER_ORDERS_INPUT_SIZE = 48

export interface QBondGetUserOrdersInput {
  owner: string
  askOrdersOffset: bigint
  bidOrdersOffset: bigint
}

const Q_BOND_GET_USER_ORDERS_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(Q_BOND_GET_USER_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondGetUserOrdersOutput {
  askOrders: number[]
  bidOrders: number[]
}

const Q_BOND_GET_USER_ORDERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'askOrders',
    type: 'array',
    offset: 0,
    byteLength: 14336,
    arrayLength: 256,
    arrayItemByteLength: 56,
    arrayItemStructRef: 'Order',
  },
  {
    name: 'bidOrders',
    type: 'array',
    offset: 14336,
    byteLength: 14336,
    arrayLength: 256,
    arrayItemByteLength: 56,
    arrayItemStructRef: 'Order',
  },
]

export function decodeQBondGetUserOrdersOutput(
  data: Uint8Array,
): QBondGetUserOrdersOutput {
  return decodePayload(data, Q_BOND_GET_USER_ORDERS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondGetUserOrdersOutput
}

export async function qBondGetUserOrders(
  live: SmartContractCaller,
  input: QBondGetUserOrdersInput,
  options?: ContractCallOptions,
): Promise<Result<QBondGetUserOrdersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_BOND_CONTRACT_INDEX,
    inputType: Q_BOND_GET_USER_ORDERS_INPUT_TYPE,
    inputSize: Q_BOND_GET_USER_ORDERS_INPUT_SIZE,
    inputFields: Q_BOND_GET_USER_ORDERS_INPUT_FIELDS,
    outputFields: Q_BOND_GET_USER_ORDERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_BOND_GET_M_BONDS_TABLE_INPUT_TYPE = 6
export const Q_BOND_GET_M_BONDS_TABLE_INPUT_SIZE = 0

export interface QBondGetMBondsTableOutput {
  info: number[]
}

const Q_BOND_GET_M_BONDS_TABLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'info',
    type: 'array',
    offset: 0,
    byteLength: 16384,
    arrayLength: 512,
    arrayItemByteLength: 32,
    arrayItemStructRef: 'TableEntry',
  },
]

export function decodeQBondGetMBondsTableOutput(
  data: Uint8Array,
): QBondGetMBondsTableOutput {
  return decodePayload(data, Q_BOND_GET_M_BONDS_TABLE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondGetMBondsTableOutput
}

export async function qBondGetMBondsTable(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QBondGetMBondsTableOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_BOND_CONTRACT_INDEX,
    inputType: Q_BOND_GET_M_BONDS_TABLE_INPUT_TYPE,
    inputSize: Q_BOND_GET_M_BONDS_TABLE_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_BOND_GET_M_BONDS_TABLE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_BOND_GET_USER_M_BONDS_INPUT_TYPE = 7
export const Q_BOND_GET_USER_M_BONDS_INPUT_SIZE = 32

export interface QBondGetUserMBondsInput {
  owner: string
}

const Q_BOND_GET_USER_M_BONDS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'owner',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQBondGetUserMBondsInput(
  input: QBondGetUserMBondsInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(Q_BOND_GET_USER_M_BONDS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QBondGetUserMBondsOutput {
  totalMBondsAmount: bigint
  mbonds: number[]
}

const Q_BOND_GET_USER_M_BONDS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'totalMBondsAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'mbonds',
    type: 'array',
    offset: 8,
    byteLength: 6144,
    arrayLength: 256,
    arrayItemByteLength: 24,
    arrayItemStructRef: 'MBondEntity',
  },
]

export function decodeQBondGetUserMBondsOutput(
  data: Uint8Array,
): QBondGetUserMBondsOutput {
  return decodePayload(data, Q_BOND_GET_USER_M_BONDS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QBondGetUserMBondsOutput
}

export async function qBondGetUserMBonds(
  live: SmartContractCaller,
  input: QBondGetUserMBondsInput,
  options?: ContractCallOptions,
): Promise<Result<QBondGetUserMBondsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_BOND_CONTRACT_INDEX,
    inputType: Q_BOND_GET_USER_M_BONDS_INPUT_TYPE,
    inputSize: Q_BOND_GET_USER_M_BONDS_INPUT_SIZE,
    inputFields: Q_BOND_GET_USER_M_BONDS_INPUT_FIELDS,
    outputFields: Q_BOND_GET_USER_M_BONDS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_BOND_GET_CFA_INPUT_TYPE = 8
export const Q_BOND_GET_CFA_INPUT_SIZE = 0

export interface QBondGetCFAOutput {
  commissionFreeAddresses: string[]
}

const Q_BOND_GET_CFA_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QBondGetCFAOutput {
  return decodePayload(data, Q_BOND_GET_CFA_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QBondGetCFAOutput
}

export async function qBondGetCFA(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QBondGetCFAOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_BOND_CONTRACT_INDEX,
    inputType: Q_BOND_GET_CFA_INPUT_TYPE,
    inputSize: Q_BOND_GET_CFA_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_BOND_GET_CFA_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const qBond = {
  contractIndex: Q_BOND_CONTRACT_INDEX,
  GetFees: qBondGetFees,
  GetEarnedFees: qBondGetEarnedFees,
  GetInfoPerEpoch: qBondGetInfoPerEpoch,
  GetOrders: qBondGetOrders,
  GetUserOrders: qBondGetUserOrders,
  GetMBondsTable: qBondGetMBondsTable,
  GetUserMBonds: qBondGetUserMBonds,
  GetCFA: qBondGetCFA,
  buildStakeInput: buildQBondStakeInput,
  buildTransferMBondOwnershipAndPossessionInput: buildQBondTransferMBondOwnershipAndPossessionInput,
  decodeTransferMBondOwnershipAndPossessionOutput: decodeQBondTransferMBondOwnershipAndPossessionOutput,
  buildAddAskOrderInput: buildQBondAddAskOrderInput,
  decodeAddAskOrderOutput: decodeQBondAddAskOrderOutput,
  buildRemoveAskOrderInput: buildQBondRemoveAskOrderInput,
  decodeRemoveAskOrderOutput: decodeQBondRemoveAskOrderOutput,
  buildAddBidOrderInput: buildQBondAddBidOrderInput,
  decodeAddBidOrderOutput: decodeQBondAddBidOrderOutput,
  buildRemoveBidOrderInput: buildQBondRemoveBidOrderInput,
  decodeRemoveBidOrderOutput: decodeQBondRemoveBidOrderOutput,
  buildBurnQUInput: buildQBondBurnQUInput,
  decodeBurnQUOutput: decodeQBondBurnQUOutput,
  buildUpdateCFAInput: buildQBondUpdateCFAInput,
  decodeUpdateCFAOutput: decodeQBondUpdateCFAOutput,
}

