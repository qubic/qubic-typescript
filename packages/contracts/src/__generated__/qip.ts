// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '@qubic.org/types'

export const QIP_CONTRACT_INDEX = 18

export interface QIPAssetStruct {
  issuer: string
  assetName: bigint
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
}

export const QIP_CREATE_ICO_INPUT_TYPE = 1

export interface QIPCreateICOInput {
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
  burnRemainingTokens: number
  isVested: number
  vestingPeriod: number
}

const QIP_CREATE_ICO_INPUT_FIELDS: BinaryField[] = [
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
  {
    name: 'burnRemainingTokens',
    type: 'uint8',
    offset: 128,
    byteLength: 1,
  },
  {
    name: 'isVested',
    type: 'uint8',
    offset: 129,
    byteLength: 1,
  },
  {
    name: 'vestingPeriod',
    type: 'uint32',
    offset: 130,
    byteLength: 4,
  },
]

export function buildQIPCreateICOInput(
  input: QIPCreateICOInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: QIP_CONTRACT_INDEX, inputType: QIP_CREATE_ICO_INPUT_TYPE, payload: buildPayload(QIP_CREATE_ICO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QIPCreateICOOutput {
  returnCode: number
}

const QIP_CREATE_ICO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQIPCreateICOOutput(
  data: Uint8Array,
): QIPCreateICOOutput {
  return decodePayload(data, QIP_CREATE_ICO_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QIPCreateICOOutput
}

export const QIP_BUY_TOKEN_INPUT_TYPE = 2

export interface QIPBuyTokenInput {
  indexOfICO: number
  amount: bigint
}

const QIP_BUY_TOKEN_INPUT_FIELDS: BinaryField[] = [
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

export function buildQIPBuyTokenInput(
  input: QIPBuyTokenInput,
): ContractCall {
  return { contractIndex: QIP_CONTRACT_INDEX, inputType: QIP_BUY_TOKEN_INPUT_TYPE, payload: buildPayload(QIP_BUY_TOKEN_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QIPBuyTokenOutput {
  returnCode: number
}

const QIP_BUY_TOKEN_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQIPBuyTokenOutput(
  data: Uint8Array,
): QIPBuyTokenOutput {
  return decodePayload(data, QIP_BUY_TOKEN_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QIPBuyTokenOutput
}

export const QIP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 3

export interface QIPTransferShareManagementRightsInput {
  asset: QIPAssetStruct
  numberOfShares: bigint
  newManagingContractIndex: number
}

const QIP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
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

export function buildQIPTransferShareManagementRightsInput(
  input: QIPTransferShareManagementRightsInput,
): ContractCall {
  return { contractIndex: QIP_CONTRACT_INDEX, inputType: QIP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE, payload: buildPayload(QIP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QIPTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
}

const QIP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQIPTransferShareManagementRightsOutput(
  data: Uint8Array,
): QIPTransferShareManagementRightsOutput {
  return decodePayload(data, QIP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QIPTransferShareManagementRightsOutput
}

export const QIP_RETURN_FUNDS_INPUT_TYPE = 4

export interface QIPReturnFundsInput {
  indexOfICO: number
}

const QIP_RETURN_FUNDS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfICO',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQIPReturnFundsInput(
  input: QIPReturnFundsInput,
): ContractCall {
  return { contractIndex: QIP_CONTRACT_INDEX, inputType: QIP_RETURN_FUNDS_INPUT_TYPE, payload: buildPayload(QIP_RETURN_FUNDS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QIPReturnFundsOutput {
  returnCode: number
}

const QIP_RETURN_FUNDS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQIPReturnFundsOutput(
  data: Uint8Array,
): QIPReturnFundsOutput {
  return decodePayload(data, QIP_RETURN_FUNDS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QIPReturnFundsOutput
}

export const QIP_GET_ICO_INFO_INPUT_TYPE = 1
export const QIP_GET_ICO_INFO_INPUT_SIZE = 4

export interface QIPGetICOInfoInput {
  indexOfICO: number
}

const QIP_GET_ICO_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfICO',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQIPGetICOInfoInput(
  input: QIPGetICOInfoInput,
): Uint8Array {
  return buildPayload(QIP_GET_ICO_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QIPGetICOInfoOutput {
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
  burnRemainingTokens: number
  isVested: number
  vestingPeriod: number
}

const QIP_GET_ICO_INFO_OUTPUT_FIELDS: BinaryField[] = [
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
  {
    name: 'burnRemainingTokens',
    type: 'uint8',
    offset: 184,
    byteLength: 1,
  },
  {
    name: 'isVested',
    type: 'uint8',
    offset: 185,
    byteLength: 1,
  },
  {
    name: 'vestingPeriod',
    type: 'uint32',
    offset: 186,
    byteLength: 4,
  },
]

export function decodeQIPGetICOInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QIPGetICOInfoOutput {
  return decodePayload(data, QIP_GET_ICO_INFO_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QIPGetICOInfoOutput
}

export async function qIPGetICOInfo(
  live: SmartContractCaller,
  input: QIPGetICOInfoInput,
  options?: ContractCallOptions,
): Promise<Result<QIPGetICOInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QIP_CONTRACT_INDEX,
    inputType: QIP_GET_ICO_INFO_INPUT_TYPE,
    inputSize: QIP_GET_ICO_INFO_INPUT_SIZE,
    inputFields: QIP_GET_ICO_INFO_INPUT_FIELDS,
    outputFields: QIP_GET_ICO_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const qIP = {
  contractIndex: QIP_CONTRACT_INDEX,
  getICOInfo: qIPGetICOInfo,
  buildCreateICOInput: buildQIPCreateICOInput,
  decodeCreateICOOutput: decodeQIPCreateICOOutput,
  buildBuyTokenInput: buildQIPBuyTokenInput,
  decodeBuyTokenOutput: decodeQIPBuyTokenOutput,
  buildTransferShareManagementRightsInput: buildQIPTransferShareManagementRightsInput,
  decodeTransferShareManagementRightsOutput: decodeQIPTransferShareManagementRightsOutput,
  buildReturnFundsInput: buildQIPReturnFundsInput,
  decodeReturnFundsOutput: decodeQIPReturnFundsOutput,
}

