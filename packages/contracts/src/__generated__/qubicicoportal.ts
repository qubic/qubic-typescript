// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const QUBIC_ICO_PORTAL_CONTRACT_INDEX = 18

const STRUCTS: Record<string, NamedStruct> = {}

export const QUBIC_ICO_PORTAL_CREATE_ICO_INPUT_TYPE = 1
export const QUBIC_ICO_PORTAL_CREATE_ICO_INPUT_SIZE = 128
export const QUBIC_ICO_PORTAL_CREATE_ICO_OUTPUT_SIZE = 4

export interface QubicICOPortalCreateICOInput {
  issuer: string
  address1: string
  assetName: bigint
  price1: bigint
  price2: bigint
  price3: bigint
  saleAmountForPhase1: bigint
  saleAmountForPhase2: bigint
  saleAmountForPhase3: bigint
  percent1: number
  startEpoch: number
}

export const QUBIC_ICO_PORTAL_CREATE_ICO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'issuer',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'address1',
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
    name: 'price1',
    type: 'uint64',
    offset: 72,
    byteLength: 8,
  },
  {
    name: 'price2',
    type: 'uint64',
    offset: 80,
    byteLength: 8,
  },
  {
    name: 'price3',
    type: 'uint64',
    offset: 88,
    byteLength: 8,
  },
  {
    name: 'saleAmountForPhase1',
    type: 'uint64',
    offset: 96,
    byteLength: 8,
  },
  {
    name: 'saleAmountForPhase2',
    type: 'uint64',
    offset: 104,
    byteLength: 8,
  },
  {
    name: 'saleAmountForPhase3',
    type: 'uint64',
    offset: 112,
    byteLength: 8,
  },
  {
    name: 'percent1',
    type: 'uint32',
    offset: 120,
    byteLength: 4,
  },
  {
    name: 'startEpoch',
    type: 'uint32',
    offset: 124,
    byteLength: 4,
  },
]

export function buildQubicICOPortalCreateICOInput(
  input: QubicICOPortalCreateICOInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUBIC_ICO_PORTAL_CREATE_ICO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QubicICOPortalCreateICOOutput {
  returnCode: number
}

export const QUBIC_ICO_PORTAL_CREATE_ICO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQubicICOPortalCreateICOOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QubicICOPortalCreateICOOutput {
  return decodePayload(
    data,
    QUBIC_ICO_PORTAL_CREATE_ICO_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QubicICOPortalCreateICOOutput
}

export const QUBIC_ICO_PORTAL_BUY_TOKEN_INPUT_TYPE = 2
export const QUBIC_ICO_PORTAL_BUY_TOKEN_INPUT_SIZE = 12
export const QUBIC_ICO_PORTAL_BUY_TOKEN_OUTPUT_SIZE = 4

export interface QubicICOPortalBuyTokenInput {
  indexOfICO: number
  amount: bigint
}

export const QUBIC_ICO_PORTAL_BUY_TOKEN_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfICO',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 4,
    byteLength: 8,
  },
]

export function buildQubicICOPortalBuyTokenInput(
  input: QubicICOPortalBuyTokenInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUBIC_ICO_PORTAL_BUY_TOKEN_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QubicICOPortalBuyTokenOutput {
  returnCode: number
}

export const QUBIC_ICO_PORTAL_BUY_TOKEN_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQubicICOPortalBuyTokenOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QubicICOPortalBuyTokenOutput {
  return decodePayload(
    data,
    QUBIC_ICO_PORTAL_BUY_TOKEN_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QubicICOPortalBuyTokenOutput
}

export const QUBIC_ICO_PORTAL_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 3
export const QUBIC_ICO_PORTAL_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_SIZE = 12
export const QUBIC_ICO_PORTAL_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_SIZE = 8

export interface QubicICOPortalTransferShareManagementRightsInput {
  numberOfShares: bigint
  newManagingContractIndex: number
}

export const QUBIC_ICO_PORTAL_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
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

export function buildQubicICOPortalTransferShareManagementRightsInput(
  input: QubicICOPortalTransferShareManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUBIC_ICO_PORTAL_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QubicICOPortalTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
}

export const QUBIC_ICO_PORTAL_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQubicICOPortalTransferShareManagementRightsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QubicICOPortalTransferShareManagementRightsOutput {
  return decodePayload(
    data,
    QUBIC_ICO_PORTAL_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QubicICOPortalTransferShareManagementRightsOutput
}

export const QUBIC_ICO_PORTAL_GET_ICO_INFO_INPUT_TYPE = 4
export const QUBIC_ICO_PORTAL_GET_ICO_INFO_INPUT_SIZE = 4
export const QUBIC_ICO_PORTAL_GET_ICO_INFO_OUTPUT_SIZE = 184

export interface QubicICOPortalGetICOInfoInput {
  indexOfICO: number
}

export const QUBIC_ICO_PORTAL_GET_ICO_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfICO',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQubicICOPortalGetICOInfoInput(
  input: QubicICOPortalGetICOInfoInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUBIC_ICO_PORTAL_GET_ICO_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QubicICOPortalGetICOInfoOutput {
  creatorOfICO: string
  issuer: string
  address1: string
  assetName: bigint
  price1: bigint
  price2: bigint
  price3: bigint
  saleAmountForPhase1: bigint
  saleAmountForPhase2: bigint
  saleAmountForPhase3: bigint
  remainingAmountForPhase1: bigint
  remainingAmountForPhase2: bigint
  remainingAmountForPhase3: bigint
  percent1: number
  startEpoch: number
}

export const QUBIC_ICO_PORTAL_GET_ICO_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'creatorOfICO',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'issuer',
    type: 'id',
    offset: 32,
    byteLength: 32,
  },
  {
    name: 'address1',
    type: 'id',
    offset: 64,
    byteLength: 32,
  },
  {
    name: 'assetName',
    type: 'uint64',
    offset: 96,
    byteLength: 8,
  },
  {
    name: 'price1',
    type: 'uint64',
    offset: 104,
    byteLength: 8,
  },
  {
    name: 'price2',
    type: 'uint64',
    offset: 112,
    byteLength: 8,
  },
  {
    name: 'price3',
    type: 'uint64',
    offset: 120,
    byteLength: 8,
  },
  {
    name: 'saleAmountForPhase1',
    type: 'uint64',
    offset: 128,
    byteLength: 8,
  },
  {
    name: 'saleAmountForPhase2',
    type: 'uint64',
    offset: 136,
    byteLength: 8,
  },
  {
    name: 'saleAmountForPhase3',
    type: 'uint64',
    offset: 144,
    byteLength: 8,
  },
  {
    name: 'remainingAmountForPhase1',
    type: 'uint64',
    offset: 152,
    byteLength: 8,
  },
  {
    name: 'remainingAmountForPhase2',
    type: 'uint64',
    offset: 160,
    byteLength: 8,
  },
  {
    name: 'remainingAmountForPhase3',
    type: 'uint64',
    offset: 168,
    byteLength: 8,
  },
  {
    name: 'percent1',
    type: 'uint32',
    offset: 176,
    byteLength: 4,
  },
  {
    name: 'startEpoch',
    type: 'uint32',
    offset: 180,
    byteLength: 4,
  },
]

export function decodeQubicICOPortalGetICOInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QubicICOPortalGetICOInfoOutput {
  return decodePayload(
    data,
    QUBIC_ICO_PORTAL_GET_ICO_INFO_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QubicICOPortalGetICOInfoOutput
}

