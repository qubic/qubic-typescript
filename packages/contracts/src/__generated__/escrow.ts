// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import type { Result } from '@qubic.org/types'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'

export const ESCROW_CONTRACT_INDEX = 27

export interface EscrowAssetWithAmountStruct {
  issuer: string
  name: bigint
  amount: bigint
}

export interface EscrowAssetStruct {
  issuer: string
  assetName: bigint
}

export interface EscrowDealStruct {
  index: bigint
  acceptorId: string
  offeredQU: bigint
  offeredAssetsNumber: bigint
  offeredAssets: number[]
  requestedQU: bigint
  requestedAssetsNumber: bigint
  requestedAssets: number[]
  creationEpoch: number
}

const STRUCTS: Record<string, NamedStruct> = {
  'AssetWithAmount': {
  name: 'AssetWithAmount',
  byteLength: 48,
  fields: [
    {
      name: 'issuer',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'name',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'amount',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
],
},
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
  'Deal': {
  name: 'Deal',
  byteLength: 458,
  fields: [
    {
      name: 'index',
      type: 'sint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'acceptorId',
      type: 'id',
      offset: 8,
      byteLength: 32,
    },
    {
      name: 'offeredQU',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'offeredAssetsNumber',
      type: 'uint64',
      offset: 48,
      byteLength: 8,
    },
    {
      name: 'offeredAssets',
      type: 'array',
      offset: 56,
      byteLength: 192,
      arrayLength: 4,
      arrayItemByteLength: 48,
      arrayItemStructRef: 'AssetWithAmount',
    },
    {
      name: 'requestedQU',
      type: 'uint64',
      offset: 248,
      byteLength: 8,
    },
    {
      name: 'requestedAssetsNumber',
      type: 'uint64',
      offset: 256,
      byteLength: 8,
    },
    {
      name: 'requestedAssets',
      type: 'array',
      offset: 264,
      byteLength: 192,
      arrayLength: 4,
      arrayItemByteLength: 48,
      arrayItemStructRef: 'AssetWithAmount',
    },
    {
      name: 'creationEpoch',
      type: 'uint16',
      offset: 456,
      byteLength: 2,
    },
],
},
}

export const ESCROW_CREATE_DEAL_INPUT_TYPE = 1

export interface EscrowCreateDealInput {
  acceptorId: string
  offeredQU: bigint
  offeredAssetsNumber: bigint
  offeredAssets: number[]
  requestedQU: bigint
  requestedAssetsNumber: bigint
  requestedAssets: number[]
}

const ESCROW_CREATE_DEAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'acceptorId',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'offeredQU',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'offeredAssetsNumber',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'offeredAssets',
    type: 'array',
    offset: 48,
    byteLength: 192,
    arrayLength: 4,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'AssetWithAmount',
  },
  {
    name: 'requestedQU',
    type: 'uint64',
    offset: 240,
    byteLength: 8,
  },
  {
    name: 'requestedAssetsNumber',
    type: 'uint64',
    offset: 248,
    byteLength: 8,
  },
  {
    name: 'requestedAssets',
    type: 'array',
    offset: 256,
    byteLength: 192,
    arrayLength: 4,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'AssetWithAmount',
  },
]

export function buildEscrowCreateDealInput(
  input: EscrowCreateDealInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: ESCROW_CONTRACT_INDEX, inputType: ESCROW_CREATE_DEAL_INPUT_TYPE, payload: buildPayload(ESCROW_CREATE_DEAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export const ESCROW_ACCEPT_DEAL_INPUT_TYPE = 2

export interface EscrowAcceptDealInput {
  index: bigint
}

const ESCROW_ACCEPT_DEAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'index',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildEscrowAcceptDealInput(
  input: EscrowAcceptDealInput,
): ContractCall {
  return { contractIndex: ESCROW_CONTRACT_INDEX, inputType: ESCROW_ACCEPT_DEAL_INPUT_TYPE, payload: buildPayload(ESCROW_ACCEPT_DEAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const ESCROW_MAKE_DEAL_PUBLIC_INPUT_TYPE = 3

export interface EscrowMakeDealPublicInput {
  index: bigint
}

const ESCROW_MAKE_DEAL_PUBLIC_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'index',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildEscrowMakeDealPublicInput(
  input: EscrowMakeDealPublicInput,
): ContractCall {
  return { contractIndex: ESCROW_CONTRACT_INDEX, inputType: ESCROW_MAKE_DEAL_PUBLIC_INPUT_TYPE, payload: buildPayload(ESCROW_MAKE_DEAL_PUBLIC_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const ESCROW_CANCEL_DEAL_INPUT_TYPE = 4

export interface EscrowCancelDealInput {
  index: bigint
}

const ESCROW_CANCEL_DEAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'index',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildEscrowCancelDealInput(
  input: EscrowCancelDealInput,
): ContractCall {
  return { contractIndex: ESCROW_CONTRACT_INDEX, inputType: ESCROW_CANCEL_DEAL_INPUT_TYPE, payload: buildPayload(ESCROW_CANCEL_DEAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const ESCROW_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 5

export interface EscrowTransferShareManagementRightsInput {
  asset: EscrowAssetStruct
  amount: bigint
  newContractIndex: number
}

const ESCROW_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'asset',
    type: 'struct',
    offset: 0,
    byteLength: 40,
    structRef: 'Asset',
  },
  {
    name: 'amount',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'newContractIndex',
    type: 'uint32',
    offset: 48,
    byteLength: 4,
  },
]

export function buildEscrowTransferShareManagementRightsInput(
  input: EscrowTransferShareManagementRightsInput,
): ContractCall {
  return { contractIndex: ESCROW_CONTRACT_INDEX, inputType: ESCROW_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE, payload: buildPayload(ESCROW_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface EscrowTransferShareManagementRightsOutput {
  transferredShares: bigint
}

const ESCROW_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeEscrowTransferShareManagementRightsOutput(
  data: Uint8Array,
): EscrowTransferShareManagementRightsOutput {
  return decodePayload(data, ESCROW_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as EscrowTransferShareManagementRightsOutput
}

export const ESCROW_GET_DEALS_INPUT_TYPE = 1
export const ESCROW_GET_DEALS_INPUT_SIZE = 48

export interface EscrowGetDealsInput {
  owner: string
  proposedDealsOffset: bigint
  publicDealsOffset: bigint
}

const ESCROW_GET_DEALS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'owner',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'proposedDealsOffset',
    type: 'sint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'publicDealsOffset',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildEscrowGetDealsInput(
  input: EscrowGetDealsInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(ESCROW_GET_DEALS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface EscrowGetDealsOutput {
  ownedDealsAmount: bigint
  proposedDealsAmount: bigint
  publicDealsAmount: bigint
  ownedDeals: number[]
  proposedDeals: number[]
  publicDeals: number[]
}

const ESCROW_GET_DEALS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'ownedDealsAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'proposedDealsAmount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'publicDealsAmount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'ownedDeals',
    type: 'array',
    offset: 24,
    byteLength: 3664,
    arrayLength: 8,
    arrayItemByteLength: 458,
    arrayItemStructRef: 'Deal',
  },
  {
    name: 'proposedDeals',
    type: 'array',
    offset: 3688,
    byteLength: 14656,
    arrayLength: 32,
    arrayItemByteLength: 458,
    arrayItemStructRef: 'Deal',
  },
  {
    name: 'publicDeals',
    type: 'array',
    offset: 18344,
    byteLength: 29312,
    arrayLength: 64,
    arrayItemByteLength: 458,
    arrayItemStructRef: 'Deal',
  },
]

export function decodeEscrowGetDealsOutput(
  data: Uint8Array,
): EscrowGetDealsOutput {
  return decodePayload(data, ESCROW_GET_DEALS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as EscrowGetDealsOutput
}

export async function escrowGetDeals(
  live: SmartContractCaller,
  input: EscrowGetDealsInput,
  options?: ContractCallOptions,
): Promise<Result<EscrowGetDealsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: ESCROW_CONTRACT_INDEX,
    inputType: ESCROW_GET_DEALS_INPUT_TYPE,
    inputSize: ESCROW_GET_DEALS_INPUT_SIZE,
    inputFields: ESCROW_GET_DEALS_INPUT_FIELDS,
    outputFields: ESCROW_GET_DEALS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const ESCROW_GET_FREE_ASSET_AMOUNT_INPUT_TYPE = 2
export const ESCROW_GET_FREE_ASSET_AMOUNT_INPUT_SIZE = 72

export interface EscrowGetFreeAssetAmountInput {
  owner: string
  asset: EscrowAssetStruct
}

const ESCROW_GET_FREE_ASSET_AMOUNT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'owner',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'asset',
    type: 'struct',
    offset: 32,
    byteLength: 40,
    structRef: 'Asset',
  },
]

export function buildEscrowGetFreeAssetAmountInput(
  input: EscrowGetFreeAssetAmountInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(ESCROW_GET_FREE_ASSET_AMOUNT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface EscrowGetFreeAssetAmountOutput {
  freeAmount: bigint
}

const ESCROW_GET_FREE_ASSET_AMOUNT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'freeAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeEscrowGetFreeAssetAmountOutput(
  data: Uint8Array,
): EscrowGetFreeAssetAmountOutput {
  return decodePayload(data, ESCROW_GET_FREE_ASSET_AMOUNT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as EscrowGetFreeAssetAmountOutput
}

export async function escrowGetFreeAssetAmount(
  live: SmartContractCaller,
  input: EscrowGetFreeAssetAmountInput,
  options?: ContractCallOptions,
): Promise<Result<EscrowGetFreeAssetAmountOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: ESCROW_CONTRACT_INDEX,
    inputType: ESCROW_GET_FREE_ASSET_AMOUNT_INPUT_TYPE,
    inputSize: ESCROW_GET_FREE_ASSET_AMOUNT_INPUT_SIZE,
    inputFields: ESCROW_GET_FREE_ASSET_AMOUNT_INPUT_FIELDS,
    outputFields: ESCROW_GET_FREE_ASSET_AMOUNT_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const escrow = {
  contractIndex: ESCROW_CONTRACT_INDEX,
  GetDeals: escrowGetDeals,
  GetFreeAssetAmount: escrowGetFreeAssetAmount,
  buildCreateDealInput: buildEscrowCreateDealInput,
  buildAcceptDealInput: buildEscrowAcceptDealInput,
  buildMakeDealPublicInput: buildEscrowMakeDealPublicInput,
  buildCancelDealInput: buildEscrowCancelDealInput,
  buildTransferShareManagementRightsInput: buildEscrowTransferShareManagementRightsInput,
  decodeTransferShareManagementRightsOutput: decodeEscrowTransferShareManagementRightsOutput,
}

