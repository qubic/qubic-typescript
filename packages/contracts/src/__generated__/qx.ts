// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const QX_CONTRACT_INDEX = 1

const STRUCTS: Record<string, NamedStruct> = {}

export const QX_ISSUE_ASSET_INPUT_TYPE = 7
export const QX_ISSUE_ASSET_INPUT_SIZE = 25
export const QX_ISSUE_ASSET_OUTPUT_SIZE = 8

export interface QxIssueAssetInput {
  assetName: bigint
  numberOfShares: bigint
  unitOfMeasurement: bigint
  numberOfDecimalPlaces: number
}

export const QX_ISSUE_ASSET_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QX_ISSUE_ASSET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QxIssueAssetOutput {
  issuedNumberOfShares: bigint
}

export const QX_ISSUE_ASSET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'issuedNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxIssueAssetOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QxIssueAssetOutput {
  return decodePayload(
    data,
    QX_ISSUE_ASSET_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QxIssueAssetOutput
}

export const QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_TYPE = 8
export const QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_SIZE = 80
export const QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_OUTPUT_SIZE = 8

export interface QxTransferShareOwnershipAndPossessionInput {
  issuer: string
  newOwnerAndPossessor: string
  assetName: bigint
  numberOfShares: bigint
}

export const QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QxTransferShareOwnershipAndPossessionOutput {
  transferredNumberOfShares: bigint
}

export const QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxTransferShareOwnershipAndPossessionOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QxTransferShareOwnershipAndPossessionOutput {
  return decodePayload(
    data,
    QX_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QxTransferShareOwnershipAndPossessionOutput
}

export const QX_ADD_TO_ASK_ORDER_INPUT_TYPE = 9
export const QX_ADD_TO_ASK_ORDER_INPUT_SIZE = 56
export const QX_ADD_TO_ASK_ORDER_OUTPUT_SIZE = 8

export interface QxAddToAskOrderInput {
  issuer: string
  assetName: bigint
  price: bigint
  numberOfShares: bigint
}

export const QX_ADD_TO_ASK_ORDER_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QX_ADD_TO_ASK_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QxAddToAskOrderOutput {
  addedNumberOfShares: bigint
}

export const QX_ADD_TO_ASK_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'addedNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxAddToAskOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QxAddToAskOrderOutput {
  return decodePayload(
    data,
    QX_ADD_TO_ASK_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QxAddToAskOrderOutput
}

export const QX_ADD_TO_BID_ORDER_INPUT_TYPE = 10
export const QX_ADD_TO_BID_ORDER_INPUT_SIZE = 56
export const QX_ADD_TO_BID_ORDER_OUTPUT_SIZE = 8

export interface QxAddToBidOrderInput {
  issuer: string
  assetName: bigint
  price: bigint
  numberOfShares: bigint
}

export const QX_ADD_TO_BID_ORDER_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QX_ADD_TO_BID_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QxAddToBidOrderOutput {
  addedNumberOfShares: bigint
}

export const QX_ADD_TO_BID_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'addedNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxAddToBidOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QxAddToBidOrderOutput {
  return decodePayload(
    data,
    QX_ADD_TO_BID_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QxAddToBidOrderOutput
}

export const QX_REMOVE_FROM_ASK_ORDER_INPUT_TYPE = 11
export const QX_REMOVE_FROM_ASK_ORDER_INPUT_SIZE = 56
export const QX_REMOVE_FROM_ASK_ORDER_OUTPUT_SIZE = 8

export interface QxRemoveFromAskOrderInput {
  issuer: string
  assetName: bigint
  price: bigint
  numberOfShares: bigint
}

export const QX_REMOVE_FROM_ASK_ORDER_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QX_REMOVE_FROM_ASK_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QxRemoveFromAskOrderOutput {
  removedNumberOfShares: bigint
}

export const QX_REMOVE_FROM_ASK_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'removedNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxRemoveFromAskOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QxRemoveFromAskOrderOutput {
  return decodePayload(
    data,
    QX_REMOVE_FROM_ASK_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QxRemoveFromAskOrderOutput
}

export const QX_REMOVE_FROM_BID_ORDER_INPUT_TYPE = 12
export const QX_REMOVE_FROM_BID_ORDER_INPUT_SIZE = 56
export const QX_REMOVE_FROM_BID_ORDER_OUTPUT_SIZE = 8

export interface QxRemoveFromBidOrderInput {
  issuer: string
  assetName: bigint
  price: bigint
  numberOfShares: bigint
}

export const QX_REMOVE_FROM_BID_ORDER_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QX_REMOVE_FROM_BID_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QxRemoveFromBidOrderOutput {
  removedNumberOfShares: bigint
}

export const QX_REMOVE_FROM_BID_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'removedNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxRemoveFromBidOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QxRemoveFromBidOrderOutput {
  return decodePayload(
    data,
    QX_REMOVE_FROM_BID_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QxRemoveFromBidOrderOutput
}

export const QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 13
export const QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_SIZE = 12
export const QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_SIZE = 8

export interface QxTransferShareManagementRightsInput {
  numberOfShares: bigint
  newManagingContractIndex: number
}

export const QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
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

export function buildQxTransferShareManagementRightsInput(
  input: QxTransferShareManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QxTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
}

export const QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQxTransferShareManagementRightsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QxTransferShareManagementRightsOutput {
  return decodePayload(
    data,
    QX_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QxTransferShareManagementRightsOutput
}

export const QX_FEES_INPUT_TYPE = 2
export const QX_FEES_INPUT_SIZE = 0
export const QX_FEES_OUTPUT_SIZE = 12

export interface QxFeesOutput {
  assetIssuanceFee: number
  transferFee: number
  tradeFee: number
}

export const QX_FEES_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QxFeesOutput {
  return decodePayload(
    data,
    QX_FEES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QxFeesOutput
}

export const QX_ASSET_ASK_ORDERS_INPUT_TYPE = 3
export const QX_ASSET_ASK_ORDERS_INPUT_SIZE = 48
export const QX_ASSET_ASK_ORDERS_OUTPUT_SIZE = 0

export interface QxAssetAskOrdersInput {
  issuer: string
  assetName: bigint
  offset: bigint
}

export const QX_ASSET_ASK_ORDERS_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QX_ASSET_ASK_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QX_ASSET_BID_ORDERS_INPUT_TYPE = 4
export const QX_ASSET_BID_ORDERS_INPUT_SIZE = 48
export const QX_ASSET_BID_ORDERS_OUTPUT_SIZE = 0

export interface QxAssetBidOrdersInput {
  issuer: string
  assetName: bigint
  offset: bigint
}

export const QX_ASSET_BID_ORDERS_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QX_ASSET_BID_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QX_ENTITY_ASK_ORDERS_INPUT_TYPE = 5
export const QX_ENTITY_ASK_ORDERS_INPUT_SIZE = 40
export const QX_ENTITY_ASK_ORDERS_OUTPUT_SIZE = 0

export interface QxEntityAskOrdersInput {
  entity: string
  offset: bigint
}

export const QX_ENTITY_ASK_ORDERS_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QX_ENTITY_ASK_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QX_ENTITY_BID_ORDERS_INPUT_TYPE = 6
export const QX_ENTITY_BID_ORDERS_INPUT_SIZE = 40
export const QX_ENTITY_BID_ORDERS_OUTPUT_SIZE = 0

export interface QxEntityBidOrdersInput {
  entity: string
  offset: bigint
}

export const QX_ENTITY_BID_ORDERS_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QX_ENTITY_BID_ORDERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

