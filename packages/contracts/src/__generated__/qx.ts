// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '../result.js'

export const QX_CONTRACT_INDEX = 1

export interface QxAssetStruct {
  issuer: string
  assetName: bigint
}

export interface QxOrderStruct {
  entity: string
  price: bigint
  numberOfShares: bigint
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
  'Order': {
  name: 'Order',
  byteLength: 48,
  fields: [
    {
      name: 'entity',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'price',
      type: 'sint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'numberOfShares',
      type: 'sint64',
      offset: 40,
      byteLength: 8,
    },
],
},
}

export const QX_ISSUE_ASSET_INPUT_TYPE = 1

export interface QxIssueAssetInput {
  assetName: bigint
  numberOfShares: bigint
  unitOfMeasurement: bigint
  numberOfDecimalPlaces: number
}

const QX_ISSUE_ASSET_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetName',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'unitOfMeasurement',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'numberOfDecimalPlaces',
    type: 'sint8',
    offset: 24,
    byteLength: 1,
  },
]

export function buildQxIssueAssetInput(
  input: QxIssueAssetInput,
): ContractCall {
  return { contractIndex: QX_CONTRACT_INDEX, inputType: QX_ISSUE_ASSET_INPUT_TYPE, payload: buildPayload(QX_ISSUE_ASSET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QxIssueAssetOutput {
  issuedNumberOfShares: bigint
}

const QX_ISSUE_ASSET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'issuedNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxIssueAssetOutput(
  data: Uint8Array,
): QxIssueAssetOutput {
  return decodePayload(data, QX_ISSUE_ASSET_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxIssueAssetOutput
}

export const QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_TYPE = 2

export interface QxTransferShareOwnershipAndPossessionInput {
  issuer: string
  newOwnerAndPossessor: string
  assetName: bigint
  numberOfShares: bigint
}

const QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'issuer',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'newOwnerAndPossessor',
    type: 'id',
    offset: 32,
    byteLength: 32,
  },
  {
    name: 'assetName',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 72,
    byteLength: 8,
  },
]

export function buildQxTransferShareOwnershipAndPossessionInput(
  input: QxTransferShareOwnershipAndPossessionInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: QX_CONTRACT_INDEX, inputType: QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_TYPE, payload: buildPayload(QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QxTransferShareOwnershipAndPossessionOutput {
  transferredNumberOfShares: bigint
}

const QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxTransferShareOwnershipAndPossessionOutput(
  data: Uint8Array,
): QxTransferShareOwnershipAndPossessionOutput {
  return decodePayload(data, QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxTransferShareOwnershipAndPossessionOutput
}

export const QX_ADD_TO_ASK_ORDER_INPUT_TYPE = 5

export interface QxAddToAskOrderInput {
  issuer: string
  assetName: bigint
  price: bigint
  numberOfShares: bigint
}

const QX_ADD_TO_ASK_ORDER_INPUT_FIELDS: BinaryField[] = [
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
    name: 'price',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 48,
    byteLength: 8,
  },
]

export function buildQxAddToAskOrderInput(
  input: QxAddToAskOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: QX_CONTRACT_INDEX, inputType: QX_ADD_TO_ASK_ORDER_INPUT_TYPE, payload: buildPayload(QX_ADD_TO_ASK_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QxAddToAskOrderOutput {
  addedNumberOfShares: bigint
}

const QX_ADD_TO_ASK_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'addedNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxAddToAskOrderOutput(
  data: Uint8Array,
): QxAddToAskOrderOutput {
  return decodePayload(data, QX_ADD_TO_ASK_ORDER_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxAddToAskOrderOutput
}

export const QX_ADD_TO_BID_ORDER_INPUT_TYPE = 6

export interface QxAddToBidOrderInput {
  issuer: string
  assetName: bigint
  price: bigint
  numberOfShares: bigint
}

const QX_ADD_TO_BID_ORDER_INPUT_FIELDS: BinaryField[] = [
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
    name: 'price',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 48,
    byteLength: 8,
  },
]

export function buildQxAddToBidOrderInput(
  input: QxAddToBidOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: QX_CONTRACT_INDEX, inputType: QX_ADD_TO_BID_ORDER_INPUT_TYPE, payload: buildPayload(QX_ADD_TO_BID_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QxAddToBidOrderOutput {
  addedNumberOfShares: bigint
}

const QX_ADD_TO_BID_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'addedNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxAddToBidOrderOutput(
  data: Uint8Array,
): QxAddToBidOrderOutput {
  return decodePayload(data, QX_ADD_TO_BID_ORDER_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxAddToBidOrderOutput
}

export const QX_REMOVE_FROM_ASK_ORDER_INPUT_TYPE = 7

export interface QxRemoveFromAskOrderInput {
  issuer: string
  assetName: bigint
  price: bigint
  numberOfShares: bigint
}

const QX_REMOVE_FROM_ASK_ORDER_INPUT_FIELDS: BinaryField[] = [
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
    name: 'price',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 48,
    byteLength: 8,
  },
]

export function buildQxRemoveFromAskOrderInput(
  input: QxRemoveFromAskOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: QX_CONTRACT_INDEX, inputType: QX_REMOVE_FROM_ASK_ORDER_INPUT_TYPE, payload: buildPayload(QX_REMOVE_FROM_ASK_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QxRemoveFromAskOrderOutput {
  removedNumberOfShares: bigint
}

const QX_REMOVE_FROM_ASK_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'removedNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxRemoveFromAskOrderOutput(
  data: Uint8Array,
): QxRemoveFromAskOrderOutput {
  return decodePayload(data, QX_REMOVE_FROM_ASK_ORDER_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxRemoveFromAskOrderOutput
}

export const QX_REMOVE_FROM_BID_ORDER_INPUT_TYPE = 8

export interface QxRemoveFromBidOrderInput {
  issuer: string
  assetName: bigint
  price: bigint
  numberOfShares: bigint
}

const QX_REMOVE_FROM_BID_ORDER_INPUT_FIELDS: BinaryField[] = [
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
    name: 'price',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 48,
    byteLength: 8,
  },
]

export function buildQxRemoveFromBidOrderInput(
  input: QxRemoveFromBidOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: QX_CONTRACT_INDEX, inputType: QX_REMOVE_FROM_BID_ORDER_INPUT_TYPE, payload: buildPayload(QX_REMOVE_FROM_BID_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QxRemoveFromBidOrderOutput {
  removedNumberOfShares: bigint
}

const QX_REMOVE_FROM_BID_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'removedNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxRemoveFromBidOrderOutput(
  data: Uint8Array,
): QxRemoveFromBidOrderOutput {
  return decodePayload(data, QX_REMOVE_FROM_BID_ORDER_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxRemoveFromBidOrderOutput
}

export const QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 9

export interface QxTransferShareManagementRightsInput {
  asset: QxAssetStruct
  numberOfShares: bigint
  newManagingContractIndex: number
}

const QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
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

export function buildQxTransferShareManagementRightsInput(
  input: QxTransferShareManagementRightsInput,
): ContractCall {
  return { contractIndex: QX_CONTRACT_INDEX, inputType: QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE, payload: buildPayload(QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QxTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
}

const QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxTransferShareManagementRightsOutput(
  data: Uint8Array,
): QxTransferShareManagementRightsOutput {
  return decodePayload(data, QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxTransferShareManagementRightsOutput
}

export const QX_FEES_INPUT_TYPE = 1
export const QX_FEES_INPUT_SIZE = 0

export interface QxFeesOutput {
  assetIssuanceFee: number
  transferFee: number
  tradeFee: number
}

const QX_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuanceFee',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'transferFee',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
  {
    name: 'tradeFee',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function decodeQxFeesOutput(
  data: Uint8Array,
): QxFeesOutput {
  return decodePayload(data, QX_FEES_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxFeesOutput
}

export async function qxFees(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QxFeesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QX_CONTRACT_INDEX,
    inputType: QX_FEES_INPUT_TYPE,
    inputSize: QX_FEES_INPUT_SIZE,
    inputFields: [],
    outputFields: QX_FEES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const QX_ASSET_ASK_ORDERS_INPUT_TYPE = 2
export const QX_ASSET_ASK_ORDERS_INPUT_SIZE = 48

export interface QxAssetAskOrdersInput {
  issuer: string
  assetName: bigint
  offset: bigint
}

const QX_ASSET_ASK_ORDERS_INPUT_FIELDS: BinaryField[] = [
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
    name: 'offset',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQxAssetAskOrdersInput(
  input: QxAssetAskOrdersInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(QX_ASSET_ASK_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QxAssetAskOrdersOutput {
  orders: number[]
}

const QX_ASSET_ASK_ORDERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'orders',
    type: 'array',
    offset: 0,
    byteLength: 12288,
    arrayLength: 256,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'Order',
  },
]

export function decodeQxAssetAskOrdersOutput(
  data: Uint8Array,
): QxAssetAskOrdersOutput {
  return decodePayload(data, QX_ASSET_ASK_ORDERS_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxAssetAskOrdersOutput
}

export async function qxAssetAskOrders(
  live: SmartContractCaller,
  input: QxAssetAskOrdersInput,
  options?: ContractCallOptions,
): Promise<Result<QxAssetAskOrdersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QX_CONTRACT_INDEX,
    inputType: QX_ASSET_ASK_ORDERS_INPUT_TYPE,
    inputSize: QX_ASSET_ASK_ORDERS_INPUT_SIZE,
    inputFields: QX_ASSET_ASK_ORDERS_INPUT_FIELDS,
    outputFields: QX_ASSET_ASK_ORDERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QX_ASSET_BID_ORDERS_INPUT_TYPE = 3
export const QX_ASSET_BID_ORDERS_INPUT_SIZE = 48

export interface QxAssetBidOrdersInput {
  issuer: string
  assetName: bigint
  offset: bigint
}

const QX_ASSET_BID_ORDERS_INPUT_FIELDS: BinaryField[] = [
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
    name: 'offset',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQxAssetBidOrdersInput(
  input: QxAssetBidOrdersInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(QX_ASSET_BID_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QxAssetBidOrdersOutput {
  orders: number[]
}

const QX_ASSET_BID_ORDERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'orders',
    type: 'array',
    offset: 0,
    byteLength: 12288,
    arrayLength: 256,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'Order',
  },
]

export function decodeQxAssetBidOrdersOutput(
  data: Uint8Array,
): QxAssetBidOrdersOutput {
  return decodePayload(data, QX_ASSET_BID_ORDERS_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxAssetBidOrdersOutput
}

export async function qxAssetBidOrders(
  live: SmartContractCaller,
  input: QxAssetBidOrdersInput,
  options?: ContractCallOptions,
): Promise<Result<QxAssetBidOrdersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QX_CONTRACT_INDEX,
    inputType: QX_ASSET_BID_ORDERS_INPUT_TYPE,
    inputSize: QX_ASSET_BID_ORDERS_INPUT_SIZE,
    inputFields: QX_ASSET_BID_ORDERS_INPUT_FIELDS,
    outputFields: QX_ASSET_BID_ORDERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QX_ENTITY_ASK_ORDERS_INPUT_TYPE = 4
export const QX_ENTITY_ASK_ORDERS_INPUT_SIZE = 40

export interface QxEntityAskOrdersInput {
  entity: string
  offset: bigint
}

const QX_ENTITY_ASK_ORDERS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'entity',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'offset',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
]

export function buildQxEntityAskOrdersInput(
  input: QxEntityAskOrdersInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(QX_ENTITY_ASK_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QxEntityAskOrdersOutput {
  orders: number[]
}

const QX_ENTITY_ASK_ORDERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'orders',
    type: 'array',
    offset: 0,
    byteLength: 12288,
    arrayLength: 256,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'Order',
  },
]

export function decodeQxEntityAskOrdersOutput(
  data: Uint8Array,
): QxEntityAskOrdersOutput {
  return decodePayload(data, QX_ENTITY_ASK_ORDERS_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxEntityAskOrdersOutput
}

export async function qxEntityAskOrders(
  live: SmartContractCaller,
  input: QxEntityAskOrdersInput,
  options?: ContractCallOptions,
): Promise<Result<QxEntityAskOrdersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QX_CONTRACT_INDEX,
    inputType: QX_ENTITY_ASK_ORDERS_INPUT_TYPE,
    inputSize: QX_ENTITY_ASK_ORDERS_INPUT_SIZE,
    inputFields: QX_ENTITY_ASK_ORDERS_INPUT_FIELDS,
    outputFields: QX_ENTITY_ASK_ORDERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QX_ENTITY_BID_ORDERS_INPUT_TYPE = 5
export const QX_ENTITY_BID_ORDERS_INPUT_SIZE = 40

export interface QxEntityBidOrdersInput {
  entity: string
  offset: bigint
}

const QX_ENTITY_BID_ORDERS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'entity',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'offset',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
]

export function buildQxEntityBidOrdersInput(
  input: QxEntityBidOrdersInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(QX_ENTITY_BID_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QxEntityBidOrdersOutput {
  orders: number[]
}

const QX_ENTITY_BID_ORDERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'orders',
    type: 'array',
    offset: 0,
    byteLength: 12288,
    arrayLength: 256,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'Order',
  },
]

export function decodeQxEntityBidOrdersOutput(
  data: Uint8Array,
): QxEntityBidOrdersOutput {
  return decodePayload(data, QX_ENTITY_BID_ORDERS_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QxEntityBidOrdersOutput
}

export async function qxEntityBidOrders(
  live: SmartContractCaller,
  input: QxEntityBidOrdersInput,
  options?: ContractCallOptions,
): Promise<Result<QxEntityBidOrdersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QX_CONTRACT_INDEX,
    inputType: QX_ENTITY_BID_ORDERS_INPUT_TYPE,
    inputSize: QX_ENTITY_BID_ORDERS_INPUT_SIZE,
    inputFields: QX_ENTITY_BID_ORDERS_INPUT_FIELDS,
    outputFields: QX_ENTITY_BID_ORDERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const qx = {
  contractIndex: QX_CONTRACT_INDEX,
  Fees: qxFees,
  AssetAskOrders: qxAssetAskOrders,
  AssetBidOrders: qxAssetBidOrders,
  EntityAskOrders: qxEntityAskOrders,
  EntityBidOrders: qxEntityBidOrders,
  buildIssueAssetInput: buildQxIssueAssetInput,
  decodeIssueAssetOutput: decodeQxIssueAssetOutput,
  buildTransferShareOwnershipAndPossessionInput: buildQxTransferShareOwnershipAndPossessionInput,
  decodeTransferShareOwnershipAndPossessionOutput: decodeQxTransferShareOwnershipAndPossessionOutput,
  buildAddToAskOrderInput: buildQxAddToAskOrderInput,
  decodeAddToAskOrderOutput: decodeQxAddToAskOrderOutput,
  buildAddToBidOrderInput: buildQxAddToBidOrderInput,
  decodeAddToBidOrderOutput: decodeQxAddToBidOrderOutput,
  buildRemoveFromAskOrderInput: buildQxRemoveFromAskOrderInput,
  decodeRemoveFromAskOrderOutput: decodeQxRemoveFromAskOrderOutput,
  buildRemoveFromBidOrderInput: buildQxRemoveFromBidOrderInput,
  decodeRemoveFromBidOrderOutput: decodeQxRemoveFromBidOrderOutput,
  buildTransferShareManagementRightsInput: buildQxTransferShareManagementRightsInput,
  decodeTransferShareManagementRightsOutput: decodeQxTransferShareManagementRightsOutput,
}

