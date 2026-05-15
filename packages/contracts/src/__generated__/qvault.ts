// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '../result.js'

export const QVAULT_CONTRACT_INDEX = 10

export interface QVAULTAssetStruct {
  issuer: string
  assetName: bigint
}

export interface QVAULTGPInfoStruct {
  proposer: string
  currentTotalVotingPower: number
  numberOfYes: number
  numberOfNo: number
  proposedEpoch: number
  currentQuorumPercent: number
  url: number[]
  result: number
}

export interface QVAULTQCPInfoStruct {
  proposer: string
  currentTotalVotingPower: number
  numberOfYes: number
  numberOfNo: number
  proposedEpoch: number
  currentQuorumPercent: number
  newQuorumPercent: number
  url: number[]
  result: number
}

export interface QVAULTIPOPInfoStruct {
  proposer: string
  totalWeight: bigint
  assignedFund: bigint
  currentTotalVotingPower: number
  numberOfYes: number
  numberOfNo: number
  proposedEpoch: number
  ipoContractIndex: number
  currentQuorumPercent: number
  url: number[]
  result: number
}

export interface QVAULTQEarnPInfoStruct {
  proposer: string
  amountOfInvestPerEpoch: bigint
  assignedFundPerEpoch: bigint
  currentTotalVotingPower: number
  numberOfYes: number
  numberOfNo: number
  proposedEpoch: number
  currentQuorumPercent: number
  url: number[]
  numberOfEpoch: number
  result: number
}

export interface QVAULTFundPInfoStruct {
  proposer: string
  pricePerOneQcap: bigint
  currentTotalVotingPower: number
  numberOfYes: number
  numberOfNo: number
  amountOfQcap: number
  restSaleAmount: number
  proposedEpoch: number
  currentQuorumPercent: number
  url: number[]
  result: number
}

export interface QVAULTMKTPInfoStruct {
  proposer: string
  amountOfQubic: bigint
  shareName: bigint
  currentTotalVotingPower: number
  numberOfYes: number
  numberOfNo: number
  amountOfQcap: number
  currentQuorumPercent: number
  proposedEpoch: number
  shareIndex: number
  amountOfShare: number
  url: number[]
  result: number
}

export interface QVAULTAlloPInfoStruct {
  proposer: string
  currentTotalVotingPower: number
  numberOfYes: number
  numberOfNo: number
  proposedEpoch: number
  currentQuorumPercent: number
  reinvested: number
  distributed: number
  burnQcap: number
  url: number[]
  result: number
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
  'GPInfo': {
  name: 'GPInfo',
  byteLength: 309,
  fields: [
    {
      name: 'proposer',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'currentTotalVotingPower',
      type: 'uint32',
      offset: 32,
      byteLength: 4,
    },
    {
      name: 'numberOfYes',
      type: 'uint32',
      offset: 36,
      byteLength: 4,
    },
    {
      name: 'numberOfNo',
      type: 'uint32',
      offset: 40,
      byteLength: 4,
    },
    {
      name: 'proposedEpoch',
      type: 'uint32',
      offset: 44,
      byteLength: 4,
    },
    {
      name: 'currentQuorumPercent',
      type: 'uint32',
      offset: 48,
      byteLength: 4,
    },
    {
      name: 'url',
      type: 'array',
      offset: 52,
      byteLength: 256,
      arrayLength: 256,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'result',
      type: 'uint8',
      offset: 308,
      byteLength: 1,
    },
],
},
  'QCPInfo': {
  name: 'QCPInfo',
  byteLength: 313,
  fields: [
    {
      name: 'proposer',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'currentTotalVotingPower',
      type: 'uint32',
      offset: 32,
      byteLength: 4,
    },
    {
      name: 'numberOfYes',
      type: 'uint32',
      offset: 36,
      byteLength: 4,
    },
    {
      name: 'numberOfNo',
      type: 'uint32',
      offset: 40,
      byteLength: 4,
    },
    {
      name: 'proposedEpoch',
      type: 'uint32',
      offset: 44,
      byteLength: 4,
    },
    {
      name: 'currentQuorumPercent',
      type: 'uint32',
      offset: 48,
      byteLength: 4,
    },
    {
      name: 'newQuorumPercent',
      type: 'uint32',
      offset: 52,
      byteLength: 4,
    },
    {
      name: 'url',
      type: 'array',
      offset: 56,
      byteLength: 256,
      arrayLength: 256,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'result',
      type: 'uint8',
      offset: 312,
      byteLength: 1,
    },
],
},
  'IPOPInfo': {
  name: 'IPOPInfo',
  byteLength: 329,
  fields: [
    {
      name: 'proposer',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'totalWeight',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'assignedFund',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'currentTotalVotingPower',
      type: 'uint32',
      offset: 48,
      byteLength: 4,
    },
    {
      name: 'numberOfYes',
      type: 'uint32',
      offset: 52,
      byteLength: 4,
    },
    {
      name: 'numberOfNo',
      type: 'uint32',
      offset: 56,
      byteLength: 4,
    },
    {
      name: 'proposedEpoch',
      type: 'uint32',
      offset: 60,
      byteLength: 4,
    },
    {
      name: 'ipoContractIndex',
      type: 'uint32',
      offset: 64,
      byteLength: 4,
    },
    {
      name: 'currentQuorumPercent',
      type: 'uint32',
      offset: 68,
      byteLength: 4,
    },
    {
      name: 'url',
      type: 'array',
      offset: 72,
      byteLength: 256,
      arrayLength: 256,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'result',
      type: 'uint8',
      offset: 328,
      byteLength: 1,
    },
],
},
  'QEarnPInfo': {
  name: 'QEarnPInfo',
  byteLength: 326,
  fields: [
    {
      name: 'proposer',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'amountOfInvestPerEpoch',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'assignedFundPerEpoch',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'currentTotalVotingPower',
      type: 'uint32',
      offset: 48,
      byteLength: 4,
    },
    {
      name: 'numberOfYes',
      type: 'uint32',
      offset: 52,
      byteLength: 4,
    },
    {
      name: 'numberOfNo',
      type: 'uint32',
      offset: 56,
      byteLength: 4,
    },
    {
      name: 'proposedEpoch',
      type: 'uint32',
      offset: 60,
      byteLength: 4,
    },
    {
      name: 'currentQuorumPercent',
      type: 'uint32',
      offset: 64,
      byteLength: 4,
    },
    {
      name: 'url',
      type: 'array',
      offset: 68,
      byteLength: 256,
      arrayLength: 256,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'numberOfEpoch',
      type: 'uint8',
      offset: 324,
      byteLength: 1,
    },
    {
      name: 'result',
      type: 'uint8',
      offset: 325,
      byteLength: 1,
    },
],
},
  'FundPInfo': {
  name: 'FundPInfo',
  byteLength: 325,
  fields: [
    {
      name: 'proposer',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'pricePerOneQcap',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'currentTotalVotingPower',
      type: 'uint32',
      offset: 40,
      byteLength: 4,
    },
    {
      name: 'numberOfYes',
      type: 'uint32',
      offset: 44,
      byteLength: 4,
    },
    {
      name: 'numberOfNo',
      type: 'uint32',
      offset: 48,
      byteLength: 4,
    },
    {
      name: 'amountOfQcap',
      type: 'uint32',
      offset: 52,
      byteLength: 4,
    },
    {
      name: 'restSaleAmount',
      type: 'uint32',
      offset: 56,
      byteLength: 4,
    },
    {
      name: 'proposedEpoch',
      type: 'uint32',
      offset: 60,
      byteLength: 4,
    },
    {
      name: 'currentQuorumPercent',
      type: 'uint32',
      offset: 64,
      byteLength: 4,
    },
    {
      name: 'url',
      type: 'array',
      offset: 68,
      byteLength: 256,
      arrayLength: 256,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'result',
      type: 'uint8',
      offset: 324,
      byteLength: 1,
    },
],
},
  'MKTPInfo': {
  name: 'MKTPInfo',
  byteLength: 337,
  fields: [
    {
      name: 'proposer',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'amountOfQubic',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'shareName',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'currentTotalVotingPower',
      type: 'uint32',
      offset: 48,
      byteLength: 4,
    },
    {
      name: 'numberOfYes',
      type: 'uint32',
      offset: 52,
      byteLength: 4,
    },
    {
      name: 'numberOfNo',
      type: 'uint32',
      offset: 56,
      byteLength: 4,
    },
    {
      name: 'amountOfQcap',
      type: 'uint32',
      offset: 60,
      byteLength: 4,
    },
    {
      name: 'currentQuorumPercent',
      type: 'uint32',
      offset: 64,
      byteLength: 4,
    },
    {
      name: 'proposedEpoch',
      type: 'uint32',
      offset: 68,
      byteLength: 4,
    },
    {
      name: 'shareIndex',
      type: 'uint32',
      offset: 72,
      byteLength: 4,
    },
    {
      name: 'amountOfShare',
      type: 'uint32',
      offset: 76,
      byteLength: 4,
    },
    {
      name: 'url',
      type: 'array',
      offset: 80,
      byteLength: 256,
      arrayLength: 256,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'result',
      type: 'uint8',
      offset: 336,
      byteLength: 1,
    },
],
},
  'AlloPInfo': {
  name: 'AlloPInfo',
  byteLength: 321,
  fields: [
    {
      name: 'proposer',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'currentTotalVotingPower',
      type: 'uint32',
      offset: 32,
      byteLength: 4,
    },
    {
      name: 'numberOfYes',
      type: 'uint32',
      offset: 36,
      byteLength: 4,
    },
    {
      name: 'numberOfNo',
      type: 'uint32',
      offset: 40,
      byteLength: 4,
    },
    {
      name: 'proposedEpoch',
      type: 'uint32',
      offset: 44,
      byteLength: 4,
    },
    {
      name: 'currentQuorumPercent',
      type: 'uint32',
      offset: 48,
      byteLength: 4,
    },
    {
      name: 'reinvested',
      type: 'uint32',
      offset: 52,
      byteLength: 4,
    },
    {
      name: 'distributed',
      type: 'uint32',
      offset: 56,
      byteLength: 4,
    },
    {
      name: 'burnQcap',
      type: 'uint32',
      offset: 60,
      byteLength: 4,
    },
    {
      name: 'url',
      type: 'array',
      offset: 64,
      byteLength: 256,
      arrayLength: 256,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'result',
      type: 'uint8',
      offset: 320,
      byteLength: 1,
    },
],
},
}

export const QVAULT_STAKE_INPUT_TYPE = 2

export interface QVAULTStakeInput {
  amount: number
}

const QVAULT_STAKE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTStakeInput(
  input: QVAULTStakeInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_STAKE_INPUT_TYPE, payload: buildPayload(QVAULT_STAKE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTStakeOutput {
  returnCode: number
}

const QVAULT_STAKE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTStakeOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTStakeOutput {
  return decodePayload(data, QVAULT_STAKE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTStakeOutput
}

export const QVAULT_UN_STAKE_INPUT_TYPE = 3

export interface QVAULTUnStakeInput {
  amount: number
}

const QVAULT_UN_STAKE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTUnStakeInput(
  input: QVAULTUnStakeInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_UN_STAKE_INPUT_TYPE, payload: buildPayload(QVAULT_UN_STAKE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTUnStakeOutput {
  returnCode: number
}

const QVAULT_UN_STAKE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTUnStakeOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTUnStakeOutput {
  return decodePayload(data, QVAULT_UN_STAKE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTUnStakeOutput
}

export const QVAULT_SUBMIT_GP_INPUT_TYPE = 4

export interface QVAULTSubmitGPInput {
  url: number[]
}

const QVAULT_SUBMIT_GP_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'url',
    type: 'array',
    offset: 0,
    byteLength: 256,
    arrayLength: 256,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQVAULTSubmitGPInput(
  input: QVAULTSubmitGPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_SUBMIT_GP_INPUT_TYPE, payload: buildPayload(QVAULT_SUBMIT_GP_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTSubmitGPOutput {
  returnCode: number
}

const QVAULT_SUBMIT_GP_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTSubmitGPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTSubmitGPOutput {
  return decodePayload(data, QVAULT_SUBMIT_GP_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTSubmitGPOutput
}

export const QVAULT_SUBMIT_QCP_INPUT_TYPE = 5

export interface QVAULTSubmitQCPInput {
  newQuorumPercent: number
  url: number[]
}

const QVAULT_SUBMIT_QCP_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newQuorumPercent',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'url',
    type: 'array',
    offset: 4,
    byteLength: 256,
    arrayLength: 256,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQVAULTSubmitQCPInput(
  input: QVAULTSubmitQCPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_SUBMIT_QCP_INPUT_TYPE, payload: buildPayload(QVAULT_SUBMIT_QCP_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTSubmitQCPOutput {
  returnCode: number
}

const QVAULT_SUBMIT_QCP_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTSubmitQCPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTSubmitQCPOutput {
  return decodePayload(data, QVAULT_SUBMIT_QCP_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTSubmitQCPOutput
}

export const QVAULT_SUBMIT_IPOP_INPUT_TYPE = 6

export interface QVAULTSubmitIPOPInput {
  ipoContractIndex: number
  url: number[]
}

const QVAULT_SUBMIT_IPOP_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'ipoContractIndex',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'url',
    type: 'array',
    offset: 4,
    byteLength: 256,
    arrayLength: 256,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQVAULTSubmitIPOPInput(
  input: QVAULTSubmitIPOPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_SUBMIT_IPOP_INPUT_TYPE, payload: buildPayload(QVAULT_SUBMIT_IPOP_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTSubmitIPOPOutput {
  returnCode: number
}

const QVAULT_SUBMIT_IPOP_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTSubmitIPOPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTSubmitIPOPOutput {
  return decodePayload(data, QVAULT_SUBMIT_IPOP_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTSubmitIPOPOutput
}

export const QVAULT_SUBMIT_Q_EARN_P_INPUT_TYPE = 7

export interface QVAULTSubmitQEarnPInput {
  amountPerEpoch: bigint
  numberOfEpoch: number
  url: number[]
}

const QVAULT_SUBMIT_Q_EARN_P_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amountPerEpoch',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numberOfEpoch',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
  {
    name: 'url',
    type: 'array',
    offset: 12,
    byteLength: 256,
    arrayLength: 256,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQVAULTSubmitQEarnPInput(
  input: QVAULTSubmitQEarnPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_SUBMIT_Q_EARN_P_INPUT_TYPE, payload: buildPayload(QVAULT_SUBMIT_Q_EARN_P_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTSubmitQEarnPOutput {
  returnCode: number
}

const QVAULT_SUBMIT_Q_EARN_P_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTSubmitQEarnPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTSubmitQEarnPOutput {
  return decodePayload(data, QVAULT_SUBMIT_Q_EARN_P_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTSubmitQEarnPOutput
}

export const QVAULT_SUBMIT_FUND_P_INPUT_TYPE = 8

export interface QVAULTSubmitFundPInput {
  priceOfOneQcap: bigint
  amountOfQcap: number
  url: number[]
}

const QVAULT_SUBMIT_FUND_P_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'priceOfOneQcap',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'amountOfQcap',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
  {
    name: 'url',
    type: 'array',
    offset: 12,
    byteLength: 256,
    arrayLength: 256,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQVAULTSubmitFundPInput(
  input: QVAULTSubmitFundPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_SUBMIT_FUND_P_INPUT_TYPE, payload: buildPayload(QVAULT_SUBMIT_FUND_P_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTSubmitFundPOutput {
  returnCode: number
}

const QVAULT_SUBMIT_FUND_P_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTSubmitFundPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTSubmitFundPOutput {
  return decodePayload(data, QVAULT_SUBMIT_FUND_P_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTSubmitFundPOutput
}

export const QVAULT_SUBMIT_MKTP_INPUT_TYPE = 9

export interface QVAULTSubmitMKTPInput {
  amountOfQubic: bigint
  shareName: bigint
  amountOfQcap: number
  indexOfShare: number
  amountOfShare: number
  url: number[]
}

const QVAULT_SUBMIT_MKTP_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amountOfQubic',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'shareName',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'amountOfQcap',
    type: 'uint32',
    offset: 16,
    byteLength: 4,
  },
  {
    name: 'indexOfShare',
    type: 'uint32',
    offset: 20,
    byteLength: 4,
  },
  {
    name: 'amountOfShare',
    type: 'uint32',
    offset: 24,
    byteLength: 4,
  },
  {
    name: 'url',
    type: 'array',
    offset: 28,
    byteLength: 256,
    arrayLength: 256,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQVAULTSubmitMKTPInput(
  input: QVAULTSubmitMKTPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_SUBMIT_MKTP_INPUT_TYPE, payload: buildPayload(QVAULT_SUBMIT_MKTP_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTSubmitMKTPOutput {
  returnCode: number
}

const QVAULT_SUBMIT_MKTP_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTSubmitMKTPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTSubmitMKTPOutput {
  return decodePayload(data, QVAULT_SUBMIT_MKTP_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTSubmitMKTPOutput
}

export const QVAULT_SUBMIT_ALLO_P_INPUT_TYPE = 10

export interface QVAULTSubmitAlloPInput {
  reinvested: number
  burn: number
  distribute: number
  url: number[]
}

const QVAULT_SUBMIT_ALLO_P_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'reinvested',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'burn',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
  {
    name: 'distribute',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
  {
    name: 'url',
    type: 'array',
    offset: 12,
    byteLength: 256,
    arrayLength: 256,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQVAULTSubmitAlloPInput(
  input: QVAULTSubmitAlloPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_SUBMIT_ALLO_P_INPUT_TYPE, payload: buildPayload(QVAULT_SUBMIT_ALLO_P_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTSubmitAlloPOutput {
  returnCode: number
}

const QVAULT_SUBMIT_ALLO_P_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTSubmitAlloPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTSubmitAlloPOutput {
  return decodePayload(data, QVAULT_SUBMIT_ALLO_P_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTSubmitAlloPOutput
}

export const QVAULT_VOTE_IN_PROPOSAL_INPUT_TYPE = 11

export interface QVAULTVoteInProposalInput {
  priceOfIPO: bigint
  proposalType: number
  proposalId: number
  yes: number
}

const QVAULT_VOTE_IN_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'priceOfIPO',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'proposalType',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
  {
    name: 'proposalId',
    type: 'uint32',
    offset: 12,
    byteLength: 4,
  },
  {
    name: 'yes',
    type: 'uint8',
    offset: 16,
    byteLength: 1,
  },
]

export function buildQVAULTVoteInProposalInput(
  input: QVAULTVoteInProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_VOTE_IN_PROPOSAL_INPUT_TYPE, payload: buildPayload(QVAULT_VOTE_IN_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTVoteInProposalOutput {
  returnCode: number
}

const QVAULT_VOTE_IN_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTVoteInProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTVoteInProposalOutput {
  return decodePayload(data, QVAULT_VOTE_IN_PROPOSAL_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTVoteInProposalOutput
}

export const QVAULT_BUY_QCAP_INPUT_TYPE = 12

export interface QVAULTBuyQcapInput {
  amount: number
}

const QVAULT_BUY_QCAP_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTBuyQcapInput(
  input: QVAULTBuyQcapInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_BUY_QCAP_INPUT_TYPE, payload: buildPayload(QVAULT_BUY_QCAP_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTBuyQcapOutput {
  returnCode: number
}

const QVAULT_BUY_QCAP_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTBuyQcapOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTBuyQcapOutput {
  return decodePayload(data, QVAULT_BUY_QCAP_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTBuyQcapOutput
}

export const QVAULT_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 13

export interface QVAULTTransferShareManagementRightsInput {
  asset: QVAULTAssetStruct
  numberOfShares: bigint
  newManagingContractIndex: number
}

const QVAULT_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
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

export function buildQVAULTTransferShareManagementRightsInput(
  input: QVAULTTransferShareManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QVAULT_CONTRACT_INDEX, inputType: QVAULT_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE, payload: buildPayload(QVAULT_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QVAULTTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
  returnCode: number
}

const QVAULT_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
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
]

export function decodeQVAULTTransferShareManagementRightsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTTransferShareManagementRightsOutput {
  return decodePayload(data, QVAULT_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTTransferShareManagementRightsOutput
}

export const QVAULT_GET_DATA_INPUT_TYPE = 1
export const QVAULT_GET_DATA_INPUT_SIZE = 0

export interface QVAULTGetDataOutput {
  returnCode: number
  totalVotingPower: bigint
  proposalCreateFund: bigint
  reinvestingFund: bigint
  totalEpochRevenue: bigint
  fundForBurn: bigint
  totalStakedQcapAmount: bigint
  qcapMarketCap: bigint
  raisedFundByQcap: bigint
  lastRoundPriceOfQcap: bigint
  revenueByQearn: bigint
  qcapSoldAmount: number
  shareholderDividend: number
  QCAPHolderPermille: number
  reinvestingPermille: number
  burnPermille: number
  qcapBurnPermille: number
  numberOfStaker: number
  numberOfVotingPower: number
  numberOfGP: number
  numberOfQCP: number
  numberOfIPOP: number
  numberOfQEarnP: number
  numberOfFundP: number
  numberOfMKTP: number
  numberOfAlloP: number
  transferRightsFee: number
  minQuorumRq: number
  maxQuorumRq: number
  totalQcapBurntAmount: number
  circulatingSupply: number
  quorumPercent: number
}

const QVAULT_GET_DATA_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'totalVotingPower',
    type: 'uint64',
    offset: 4,
    byteLength: 8,
  },
  {
    name: 'proposalCreateFund',
    type: 'uint64',
    offset: 12,
    byteLength: 8,
  },
  {
    name: 'reinvestingFund',
    type: 'uint64',
    offset: 20,
    byteLength: 8,
  },
  {
    name: 'totalEpochRevenue',
    type: 'uint64',
    offset: 28,
    byteLength: 8,
  },
  {
    name: 'fundForBurn',
    type: 'uint64',
    offset: 36,
    byteLength: 8,
  },
  {
    name: 'totalStakedQcapAmount',
    type: 'uint64',
    offset: 44,
    byteLength: 8,
  },
  {
    name: 'qcapMarketCap',
    type: 'uint64',
    offset: 52,
    byteLength: 8,
  },
  {
    name: 'raisedFundByQcap',
    type: 'uint64',
    offset: 60,
    byteLength: 8,
  },
  {
    name: 'lastRoundPriceOfQcap',
    type: 'uint64',
    offset: 68,
    byteLength: 8,
  },
  {
    name: 'revenueByQearn',
    type: 'uint64',
    offset: 76,
    byteLength: 8,
  },
  {
    name: 'qcapSoldAmount',
    type: 'uint32',
    offset: 84,
    byteLength: 4,
  },
  {
    name: 'shareholderDividend',
    type: 'uint32',
    offset: 88,
    byteLength: 4,
  },
  {
    name: 'QCAPHolderPermille',
    type: 'uint32',
    offset: 92,
    byteLength: 4,
  },
  {
    name: 'reinvestingPermille',
    type: 'uint32',
    offset: 96,
    byteLength: 4,
  },
  {
    name: 'burnPermille',
    type: 'uint32',
    offset: 100,
    byteLength: 4,
  },
  {
    name: 'qcapBurnPermille',
    type: 'uint32',
    offset: 104,
    byteLength: 4,
  },
  {
    name: 'numberOfStaker',
    type: 'uint32',
    offset: 108,
    byteLength: 4,
  },
  {
    name: 'numberOfVotingPower',
    type: 'uint32',
    offset: 112,
    byteLength: 4,
  },
  {
    name: 'numberOfGP',
    type: 'uint32',
    offset: 116,
    byteLength: 4,
  },
  {
    name: 'numberOfQCP',
    type: 'uint32',
    offset: 120,
    byteLength: 4,
  },
  {
    name: 'numberOfIPOP',
    type: 'uint32',
    offset: 124,
    byteLength: 4,
  },
  {
    name: 'numberOfQEarnP',
    type: 'uint32',
    offset: 128,
    byteLength: 4,
  },
  {
    name: 'numberOfFundP',
    type: 'uint32',
    offset: 132,
    byteLength: 4,
  },
  {
    name: 'numberOfMKTP',
    type: 'uint32',
    offset: 136,
    byteLength: 4,
  },
  {
    name: 'numberOfAlloP',
    type: 'uint32',
    offset: 140,
    byteLength: 4,
  },
  {
    name: 'transferRightsFee',
    type: 'uint32',
    offset: 144,
    byteLength: 4,
  },
  {
    name: 'minQuorumRq',
    type: 'uint32',
    offset: 148,
    byteLength: 4,
  },
  {
    name: 'maxQuorumRq',
    type: 'uint32',
    offset: 152,
    byteLength: 4,
  },
  {
    name: 'totalQcapBurntAmount',
    type: 'uint32',
    offset: 156,
    byteLength: 4,
  },
  {
    name: 'circulatingSupply',
    type: 'uint32',
    offset: 160,
    byteLength: 4,
  },
  {
    name: 'quorumPercent',
    type: 'uint32',
    offset: 164,
    byteLength: 4,
  },
]

export function decodeQVAULTGetDataOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetDataOutput {
  return decodePayload(data, QVAULT_GET_DATA_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetDataOutput
}

export async function qVAULTGetData(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetDataOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_DATA_INPUT_TYPE,
    inputSize: QVAULT_GET_DATA_INPUT_SIZE,
    inputFields: [],
    outputFields: QVAULT_GET_DATA_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const QVAULT_GET_STAKED_AMOUNT_AND_VOTING_POWER_INPUT_TYPE = 14
export const QVAULT_GET_STAKED_AMOUNT_AND_VOTING_POWER_INPUT_SIZE = 32

export interface QVAULTGetStakedAmountAndVotingPowerInput {
  address: string
}

const QVAULT_GET_STAKED_AMOUNT_AND_VOTING_POWER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'address',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQVAULTGetStakedAmountAndVotingPowerInput(
  input: QVAULTGetStakedAmountAndVotingPowerInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_STAKED_AMOUNT_AND_VOTING_POWER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetStakedAmountAndVotingPowerOutput {
  returnCode: number
  stakedAmount: number
  votingPower: number
}

const QVAULT_GET_STAKED_AMOUNT_AND_VOTING_POWER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'stakedAmount',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
  {
    name: 'votingPower',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function decodeQVAULTGetStakedAmountAndVotingPowerOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetStakedAmountAndVotingPowerOutput {
  return decodePayload(data, QVAULT_GET_STAKED_AMOUNT_AND_VOTING_POWER_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetStakedAmountAndVotingPowerOutput
}

export async function qVAULTGetStakedAmountAndVotingPower(
  live: SmartContractCaller,
  input: QVAULTGetStakedAmountAndVotingPowerInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetStakedAmountAndVotingPowerOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_STAKED_AMOUNT_AND_VOTING_POWER_INPUT_TYPE,
    inputSize: QVAULT_GET_STAKED_AMOUNT_AND_VOTING_POWER_INPUT_SIZE,
    inputFields: QVAULT_GET_STAKED_AMOUNT_AND_VOTING_POWER_INPUT_FIELDS,
    outputFields: QVAULT_GET_STAKED_AMOUNT_AND_VOTING_POWER_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_GP_INPUT_TYPE = 15
export const QVAULT_GET_GP_INPUT_SIZE = 4

export interface QVAULTGetGPInput {
  proposalId: number
}

const QVAULT_GET_GP_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetGPInput(
  input: QVAULTGetGPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_GP_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetGPOutput {
  returnCode: number
  proposal: QVAULTGPInfoStruct
}

const QVAULT_GET_GP_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'proposal',
    type: 'struct',
    offset: 4,
    byteLength: 309,
    structRef: 'GPInfo',
  },
]

export function decodeQVAULTGetGPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetGPOutput {
  return decodePayload(data, QVAULT_GET_GP_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetGPOutput
}

export async function qVAULTGetGP(
  live: SmartContractCaller,
  input: QVAULTGetGPInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetGPOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_GP_INPUT_TYPE,
    inputSize: QVAULT_GET_GP_INPUT_SIZE,
    inputFields: QVAULT_GET_GP_INPUT_FIELDS,
    outputFields: QVAULT_GET_GP_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_QCP_INPUT_TYPE = 16
export const QVAULT_GET_QCP_INPUT_SIZE = 4

export interface QVAULTGetQCPInput {
  proposalId: number
}

const QVAULT_GET_QCP_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetQCPInput(
  input: QVAULTGetQCPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_QCP_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetQCPOutput {
  returnCode: number
  proposal: QVAULTQCPInfoStruct
}

const QVAULT_GET_QCP_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'proposal',
    type: 'struct',
    offset: 4,
    byteLength: 313,
    structRef: 'QCPInfo',
  },
]

export function decodeQVAULTGetQCPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetQCPOutput {
  return decodePayload(data, QVAULT_GET_QCP_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetQCPOutput
}

export async function qVAULTGetQCP(
  live: SmartContractCaller,
  input: QVAULTGetQCPInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetQCPOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_QCP_INPUT_TYPE,
    inputSize: QVAULT_GET_QCP_INPUT_SIZE,
    inputFields: QVAULT_GET_QCP_INPUT_FIELDS,
    outputFields: QVAULT_GET_QCP_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_IPOP_INPUT_TYPE = 17
export const QVAULT_GET_IPOP_INPUT_SIZE = 4

export interface QVAULTGetIPOPInput {
  proposalId: number
}

const QVAULT_GET_IPOP_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetIPOPInput(
  input: QVAULTGetIPOPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_IPOP_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetIPOPOutput {
  returnCode: number
  proposal: QVAULTIPOPInfoStruct
}

const QVAULT_GET_IPOP_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'proposal',
    type: 'struct',
    offset: 4,
    byteLength: 329,
    structRef: 'IPOPInfo',
  },
]

export function decodeQVAULTGetIPOPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetIPOPOutput {
  return decodePayload(data, QVAULT_GET_IPOP_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetIPOPOutput
}

export async function qVAULTGetIPOP(
  live: SmartContractCaller,
  input: QVAULTGetIPOPInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetIPOPOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_IPOP_INPUT_TYPE,
    inputSize: QVAULT_GET_IPOP_INPUT_SIZE,
    inputFields: QVAULT_GET_IPOP_INPUT_FIELDS,
    outputFields: QVAULT_GET_IPOP_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_Q_EARN_P_INPUT_TYPE = 18
export const QVAULT_GET_Q_EARN_P_INPUT_SIZE = 4

export interface QVAULTGetQEarnPInput {
  proposalId: number
}

const QVAULT_GET_Q_EARN_P_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetQEarnPInput(
  input: QVAULTGetQEarnPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_Q_EARN_P_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetQEarnPOutput {
  returnCode: number
  proposal: QVAULTQEarnPInfoStruct
}

const QVAULT_GET_Q_EARN_P_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'proposal',
    type: 'struct',
    offset: 4,
    byteLength: 326,
    structRef: 'QEarnPInfo',
  },
]

export function decodeQVAULTGetQEarnPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetQEarnPOutput {
  return decodePayload(data, QVAULT_GET_Q_EARN_P_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetQEarnPOutput
}

export async function qVAULTGetQEarnP(
  live: SmartContractCaller,
  input: QVAULTGetQEarnPInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetQEarnPOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_Q_EARN_P_INPUT_TYPE,
    inputSize: QVAULT_GET_Q_EARN_P_INPUT_SIZE,
    inputFields: QVAULT_GET_Q_EARN_P_INPUT_FIELDS,
    outputFields: QVAULT_GET_Q_EARN_P_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_FUND_P_INPUT_TYPE = 19
export const QVAULT_GET_FUND_P_INPUT_SIZE = 4

export interface QVAULTGetFundPInput {
  proposalId: number
}

const QVAULT_GET_FUND_P_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetFundPInput(
  input: QVAULTGetFundPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_FUND_P_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetFundPOutput {
  returnCode: number
  proposal: QVAULTFundPInfoStruct
}

const QVAULT_GET_FUND_P_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'proposal',
    type: 'struct',
    offset: 4,
    byteLength: 325,
    structRef: 'FundPInfo',
  },
]

export function decodeQVAULTGetFundPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetFundPOutput {
  return decodePayload(data, QVAULT_GET_FUND_P_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetFundPOutput
}

export async function qVAULTGetFundP(
  live: SmartContractCaller,
  input: QVAULTGetFundPInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetFundPOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_FUND_P_INPUT_TYPE,
    inputSize: QVAULT_GET_FUND_P_INPUT_SIZE,
    inputFields: QVAULT_GET_FUND_P_INPUT_FIELDS,
    outputFields: QVAULT_GET_FUND_P_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_MKTP_INPUT_TYPE = 20
export const QVAULT_GET_MKTP_INPUT_SIZE = 4

export interface QVAULTGetMKTPInput {
  proposalId: number
}

const QVAULT_GET_MKTP_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetMKTPInput(
  input: QVAULTGetMKTPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_MKTP_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetMKTPOutput {
  returnCode: number
  proposal: QVAULTMKTPInfoStruct
}

const QVAULT_GET_MKTP_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'proposal',
    type: 'struct',
    offset: 4,
    byteLength: 337,
    structRef: 'MKTPInfo',
  },
]

export function decodeQVAULTGetMKTPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetMKTPOutput {
  return decodePayload(data, QVAULT_GET_MKTP_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetMKTPOutput
}

export async function qVAULTGetMKTP(
  live: SmartContractCaller,
  input: QVAULTGetMKTPInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetMKTPOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_MKTP_INPUT_TYPE,
    inputSize: QVAULT_GET_MKTP_INPUT_SIZE,
    inputFields: QVAULT_GET_MKTP_INPUT_FIELDS,
    outputFields: QVAULT_GET_MKTP_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_ALLO_P_INPUT_TYPE = 21
export const QVAULT_GET_ALLO_P_INPUT_SIZE = 4

export interface QVAULTGetAlloPInput {
  proposalId: number
}

const QVAULT_GET_ALLO_P_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetAlloPInput(
  input: QVAULTGetAlloPInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_ALLO_P_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetAlloPOutput {
  returnCode: number
  proposal: QVAULTAlloPInfoStruct
}

const QVAULT_GET_ALLO_P_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'proposal',
    type: 'struct',
    offset: 4,
    byteLength: 321,
    structRef: 'AlloPInfo',
  },
]

export function decodeQVAULTGetAlloPOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetAlloPOutput {
  return decodePayload(data, QVAULT_GET_ALLO_P_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetAlloPOutput
}

export async function qVAULTGetAlloP(
  live: SmartContractCaller,
  input: QVAULTGetAlloPInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetAlloPOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_ALLO_P_INPUT_TYPE,
    inputSize: QVAULT_GET_ALLO_P_INPUT_SIZE,
    inputFields: QVAULT_GET_ALLO_P_INPUT_FIELDS,
    outputFields: QVAULT_GET_ALLO_P_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_IDENTITIES_HV_VT_PW_INPUT_TYPE = 22
export const QVAULT_GET_IDENTITIES_HV_VT_PW_INPUT_SIZE = 8

export interface QVAULTGetIdentitiesHvVtPwInput {
  offset: number
  count: number
}

const QVAULT_GET_IDENTITIES_HV_VT_PW_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'offset',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'count',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
]

export function buildQVAULTGetIdentitiesHvVtPwInput(
  input: QVAULTGetIdentitiesHvVtPwInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_IDENTITIES_HV_VT_PW_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetIdentitiesHvVtPwOutput {
  returnCode: number
  idList: string[]
  amountList: number[]
}

const QVAULT_GET_IDENTITIES_HV_VT_PW_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'idList',
    type: 'array',
    offset: 4,
    byteLength: 8192,
    arrayLength: 256,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
  {
    name: 'amountList',
    type: 'array',
    offset: 8196,
    byteLength: 1024,
    arrayLength: 256,
    arrayItemType: 'uint32',
    arrayItemByteLength: 4,
  },
]

export function decodeQVAULTGetIdentitiesHvVtPwOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetIdentitiesHvVtPwOutput {
  return decodePayload(data, QVAULT_GET_IDENTITIES_HV_VT_PW_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetIdentitiesHvVtPwOutput
}

export async function qVAULTGetIdentitiesHvVtPw(
  live: SmartContractCaller,
  input: QVAULTGetIdentitiesHvVtPwInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetIdentitiesHvVtPwOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_IDENTITIES_HV_VT_PW_INPUT_TYPE,
    inputSize: QVAULT_GET_IDENTITIES_HV_VT_PW_INPUT_SIZE,
    inputFields: QVAULT_GET_IDENTITIES_HV_VT_PW_INPUT_FIELDS,
    outputFields: QVAULT_GET_IDENTITIES_HV_VT_PW_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_PP_CREATION_POWER_INPUT_TYPE = 23
export const QVAULT_PP_CREATION_POWER_INPUT_SIZE = 32

export interface QVAULTPpCreationPowerInput {
  address: string
}

const QVAULT_PP_CREATION_POWER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'address',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQVAULTPpCreationPowerInput(
  input: QVAULTPpCreationPowerInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_PP_CREATION_POWER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTPpCreationPowerOutput {
  returnCode: number
  status: number
}

const QVAULT_PP_CREATION_POWER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'status',
    type: 'uint8',
    offset: 4,
    byteLength: 1,
  },
]

export function decodeQVAULTPpCreationPowerOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTPpCreationPowerOutput {
  return decodePayload(data, QVAULT_PP_CREATION_POWER_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTPpCreationPowerOutput
}

export async function qVAULTPpCreationPower(
  live: SmartContractCaller,
  input: QVAULTPpCreationPowerInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTPpCreationPowerOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_PP_CREATION_POWER_INPUT_TYPE,
    inputSize: QVAULT_PP_CREATION_POWER_INPUT_SIZE,
    inputFields: QVAULT_PP_CREATION_POWER_INPUT_FIELDS,
    outputFields: QVAULT_PP_CREATION_POWER_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_QCAP_BURNT_AMOUNT_IN_LAST_EPOCHES_INPUT_TYPE = 24
export const QVAULT_GET_QCAP_BURNT_AMOUNT_IN_LAST_EPOCHES_INPUT_SIZE = 4

export interface QVAULTGetQcapBurntAmountInLastEpochesInput {
  numberOfLastEpoches: number
}

const QVAULT_GET_QCAP_BURNT_AMOUNT_IN_LAST_EPOCHES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfLastEpoches',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetQcapBurntAmountInLastEpochesInput(
  input: QVAULTGetQcapBurntAmountInLastEpochesInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_QCAP_BURNT_AMOUNT_IN_LAST_EPOCHES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetQcapBurntAmountInLastEpochesOutput {
  returnCode: number
  burntAmount: number
}

const QVAULT_GET_QCAP_BURNT_AMOUNT_IN_LAST_EPOCHES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'burntAmount',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
]

export function decodeQVAULTGetQcapBurntAmountInLastEpochesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetQcapBurntAmountInLastEpochesOutput {
  return decodePayload(data, QVAULT_GET_QCAP_BURNT_AMOUNT_IN_LAST_EPOCHES_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetQcapBurntAmountInLastEpochesOutput
}

export async function qVAULTGetQcapBurntAmountInLastEpoches(
  live: SmartContractCaller,
  input: QVAULTGetQcapBurntAmountInLastEpochesInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetQcapBurntAmountInLastEpochesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_QCAP_BURNT_AMOUNT_IN_LAST_EPOCHES_INPUT_TYPE,
    inputSize: QVAULT_GET_QCAP_BURNT_AMOUNT_IN_LAST_EPOCHES_INPUT_SIZE,
    inputFields: QVAULT_GET_QCAP_BURNT_AMOUNT_IN_LAST_EPOCHES_INPUT_FIELDS,
    outputFields: QVAULT_GET_QCAP_BURNT_AMOUNT_IN_LAST_EPOCHES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_AMOUNT_TO_BE_SOLD_PER_YEAR_INPUT_TYPE = 25
export const QVAULT_GET_AMOUNT_TO_BE_SOLD_PER_YEAR_INPUT_SIZE = 4

export interface QVAULTGetAmountToBeSoldPerYearInput {
  year: number
}

const QVAULT_GET_AMOUNT_TO_BE_SOLD_PER_YEAR_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'year',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetAmountToBeSoldPerYearInput(
  input: QVAULTGetAmountToBeSoldPerYearInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_AMOUNT_TO_BE_SOLD_PER_YEAR_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetAmountToBeSoldPerYearOutput {
  amount: number
}

const QVAULT_GET_AMOUNT_TO_BE_SOLD_PER_YEAR_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTGetAmountToBeSoldPerYearOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetAmountToBeSoldPerYearOutput {
  return decodePayload(data, QVAULT_GET_AMOUNT_TO_BE_SOLD_PER_YEAR_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetAmountToBeSoldPerYearOutput
}

export async function qVAULTGetAmountToBeSoldPerYear(
  live: SmartContractCaller,
  input: QVAULTGetAmountToBeSoldPerYearInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetAmountToBeSoldPerYearOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_AMOUNT_TO_BE_SOLD_PER_YEAR_INPUT_TYPE,
    inputSize: QVAULT_GET_AMOUNT_TO_BE_SOLD_PER_YEAR_INPUT_SIZE,
    inputFields: QVAULT_GET_AMOUNT_TO_BE_SOLD_PER_YEAR_INPUT_FIELDS,
    outputFields: QVAULT_GET_AMOUNT_TO_BE_SOLD_PER_YEAR_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_TOTAL_REVENUE_IN_QCAP_INPUT_TYPE = 26
export const QVAULT_GET_TOTAL_REVENUE_IN_QCAP_INPUT_SIZE = 0

export interface QVAULTGetTotalRevenueInQcapOutput {
  revenue: bigint
}

const QVAULT_GET_TOTAL_REVENUE_IN_QCAP_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'revenue',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQVAULTGetTotalRevenueInQcapOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetTotalRevenueInQcapOutput {
  return decodePayload(data, QVAULT_GET_TOTAL_REVENUE_IN_QCAP_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetTotalRevenueInQcapOutput
}

export async function qVAULTGetTotalRevenueInQcap(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetTotalRevenueInQcapOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_TOTAL_REVENUE_IN_QCAP_INPUT_TYPE,
    inputSize: QVAULT_GET_TOTAL_REVENUE_IN_QCAP_INPUT_SIZE,
    inputFields: [],
    outputFields: QVAULT_GET_TOTAL_REVENUE_IN_QCAP_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const QVAULT_GET_REVENUE_IN_QCAP_PER_EPOCH_INPUT_TYPE = 27
export const QVAULT_GET_REVENUE_IN_QCAP_PER_EPOCH_INPUT_SIZE = 4

export interface QVAULTGetRevenueInQcapPerEpochInput {
  epoch: number
}

const QVAULT_GET_REVENUE_IN_QCAP_PER_EPOCH_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetRevenueInQcapPerEpochInput(
  input: QVAULTGetRevenueInQcapPerEpochInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_REVENUE_IN_QCAP_PER_EPOCH_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetRevenueInQcapPerEpochOutput {
  epochTotalRevenue: bigint
  epochOneQcapRevenue: bigint
  epochOneQvaultRevenue: bigint
  epochReinvestAmount: bigint
}

const QVAULT_GET_REVENUE_IN_QCAP_PER_EPOCH_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'epochTotalRevenue',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'epochOneQcapRevenue',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'epochOneQvaultRevenue',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'epochReinvestAmount',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
]

export function decodeQVAULTGetRevenueInQcapPerEpochOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetRevenueInQcapPerEpochOutput {
  return decodePayload(data, QVAULT_GET_REVENUE_IN_QCAP_PER_EPOCH_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetRevenueInQcapPerEpochOutput
}

export async function qVAULTGetRevenueInQcapPerEpoch(
  live: SmartContractCaller,
  input: QVAULTGetRevenueInQcapPerEpochInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetRevenueInQcapPerEpochOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_REVENUE_IN_QCAP_PER_EPOCH_INPUT_TYPE,
    inputSize: QVAULT_GET_REVENUE_IN_QCAP_PER_EPOCH_INPUT_SIZE,
    inputFields: QVAULT_GET_REVENUE_IN_QCAP_PER_EPOCH_INPUT_FIELDS,
    outputFields: QVAULT_GET_REVENUE_IN_QCAP_PER_EPOCH_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_REVENUE_PER_SHARE_INPUT_TYPE = 28
export const QVAULT_GET_REVENUE_PER_SHARE_INPUT_SIZE = 4

export interface QVAULTGetRevenuePerShareInput {
  contractIndex: number
}

const QVAULT_GET_REVENUE_PER_SHARE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'contractIndex',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetRevenuePerShareInput(
  input: QVAULTGetRevenuePerShareInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_REVENUE_PER_SHARE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetRevenuePerShareOutput {
  revenue: bigint
}

const QVAULT_GET_REVENUE_PER_SHARE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'revenue',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQVAULTGetRevenuePerShareOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetRevenuePerShareOutput {
  return decodePayload(data, QVAULT_GET_REVENUE_PER_SHARE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetRevenuePerShareOutput
}

export async function qVAULTGetRevenuePerShare(
  live: SmartContractCaller,
  input: QVAULTGetRevenuePerShareInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetRevenuePerShareOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_REVENUE_PER_SHARE_INPUT_TYPE,
    inputSize: QVAULT_GET_REVENUE_PER_SHARE_INPUT_SIZE,
    inputFields: QVAULT_GET_REVENUE_PER_SHARE_INPUT_FIELDS,
    outputFields: QVAULT_GET_REVENUE_PER_SHARE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_AMOUNT_OF_SHARE_QVAULT_HOLD_INPUT_TYPE = 29
export const QVAULT_GET_AMOUNT_OF_SHARE_QVAULT_HOLD_INPUT_SIZE = 40

export interface QVAULTGetAmountOfShareQvaultHoldInput {
  assetInfo: QVAULTAssetStruct
}

const QVAULT_GET_AMOUNT_OF_SHARE_QVAULT_HOLD_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetInfo',
    type: 'struct',
    offset: 0,
    byteLength: 40,
    structRef: 'Asset',
  },
]

export function buildQVAULTGetAmountOfShareQvaultHoldInput(
  input: QVAULTGetAmountOfShareQvaultHoldInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_AMOUNT_OF_SHARE_QVAULT_HOLD_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetAmountOfShareQvaultHoldOutput {
  amount: number
}

const QVAULT_GET_AMOUNT_OF_SHARE_QVAULT_HOLD_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQVAULTGetAmountOfShareQvaultHoldOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetAmountOfShareQvaultHoldOutput {
  return decodePayload(data, QVAULT_GET_AMOUNT_OF_SHARE_QVAULT_HOLD_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetAmountOfShareQvaultHoldOutput
}

export async function qVAULTGetAmountOfShareQvaultHold(
  live: SmartContractCaller,
  input: QVAULTGetAmountOfShareQvaultHoldInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetAmountOfShareQvaultHoldOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_AMOUNT_OF_SHARE_QVAULT_HOLD_INPUT_TYPE,
    inputSize: QVAULT_GET_AMOUNT_OF_SHARE_QVAULT_HOLD_INPUT_SIZE,
    inputFields: QVAULT_GET_AMOUNT_OF_SHARE_QVAULT_HOLD_INPUT_FIELDS,
    outputFields: QVAULT_GET_AMOUNT_OF_SHARE_QVAULT_HOLD_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_NUMBER_OF_HOLDER_AND_AVG_AM_INPUT_TYPE = 30
export const QVAULT_GET_NUMBER_OF_HOLDER_AND_AVG_AM_INPUT_SIZE = 0

export interface QVAULTGetNumberOfHolderAndAvgAmOutput {
  returnCode: number
  numberOfQcapHolder: number
  avgAmount: number
}

const QVAULT_GET_NUMBER_OF_HOLDER_AND_AVG_AM_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'numberOfQcapHolder',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
  {
    name: 'avgAmount',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function decodeQVAULTGetNumberOfHolderAndAvgAmOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetNumberOfHolderAndAvgAmOutput {
  return decodePayload(data, QVAULT_GET_NUMBER_OF_HOLDER_AND_AVG_AM_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetNumberOfHolderAndAvgAmOutput
}

export async function qVAULTGetNumberOfHolderAndAvgAm(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetNumberOfHolderAndAvgAmOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_NUMBER_OF_HOLDER_AND_AVG_AM_INPUT_TYPE,
    inputSize: QVAULT_GET_NUMBER_OF_HOLDER_AND_AVG_AM_INPUT_SIZE,
    inputFields: [],
    outputFields: QVAULT_GET_NUMBER_OF_HOLDER_AND_AVG_AM_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const QVAULT_GET_AMOUNT_FOR_QEARN_IN_UPCOMING_EPOCH_INPUT_TYPE = 31
export const QVAULT_GET_AMOUNT_FOR_QEARN_IN_UPCOMING_EPOCH_INPUT_SIZE = 4

export interface QVAULTGetAmountForQearnInUpcomingEpochInput {
  epoch: number
}

const QVAULT_GET_AMOUNT_FOR_QEARN_IN_UPCOMING_EPOCH_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQVAULTGetAmountForQearnInUpcomingEpochInput(
  input: QVAULTGetAmountForQearnInUpcomingEpochInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_AMOUNT_FOR_QEARN_IN_UPCOMING_EPOCH_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetAmountForQearnInUpcomingEpochOutput {
  returnCode: number
  amount: bigint
}

const QVAULT_GET_AMOUNT_FOR_QEARN_IN_UPCOMING_EPOCH_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
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

export function decodeQVAULTGetAmountForQearnInUpcomingEpochOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetAmountForQearnInUpcomingEpochOutput {
  return decodePayload(data, QVAULT_GET_AMOUNT_FOR_QEARN_IN_UPCOMING_EPOCH_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetAmountForQearnInUpcomingEpochOutput
}

export async function qVAULTGetAmountForQearnInUpcomingEpoch(
  live: SmartContractCaller,
  input: QVAULTGetAmountForQearnInUpcomingEpochInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetAmountForQearnInUpcomingEpochOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_AMOUNT_FOR_QEARN_IN_UPCOMING_EPOCH_INPUT_TYPE,
    inputSize: QVAULT_GET_AMOUNT_FOR_QEARN_IN_UPCOMING_EPOCH_INPUT_SIZE,
    inputFields: QVAULT_GET_AMOUNT_FOR_QEARN_IN_UPCOMING_EPOCH_INPUT_FIELDS,
    outputFields: QVAULT_GET_AMOUNT_FOR_QEARN_IN_UPCOMING_EPOCH_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QVAULT_GET_VOTE_IN_PROPOSAL_INPUT_TYPE = 32
export const QVAULT_GET_VOTE_IN_PROPOSAL_INPUT_SIZE = 48

export interface QVAULTGetVoteInProposalInput {
  userID: string
  proposalType: bigint
  proposalId: bigint
}

const QVAULT_GET_VOTE_IN_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'userID',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'proposalType',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'proposalId',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQVAULTGetVoteInProposalInput(
  input: QVAULTGetVoteInProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QVAULT_GET_VOTE_IN_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QVAULTGetVoteInProposalOutput {
  returnCode: bigint
  isVoted: bigint
  votingDecision: bigint
}

const QVAULT_GET_VOTE_IN_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'isVoted',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'votingDecision',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
]

export function decodeQVAULTGetVoteInProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QVAULTGetVoteInProposalOutput {
  return decodePayload(data, QVAULT_GET_VOTE_IN_PROPOSAL_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QVAULTGetVoteInProposalOutput
}

export async function qVAULTGetVoteInProposal(
  live: SmartContractCaller,
  input: QVAULTGetVoteInProposalInput,
  options?: ContractCallOptions,
): Promise<Result<QVAULTGetVoteInProposalOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QVAULT_CONTRACT_INDEX,
    inputType: QVAULT_GET_VOTE_IN_PROPOSAL_INPUT_TYPE,
    inputSize: QVAULT_GET_VOTE_IN_PROPOSAL_INPUT_SIZE,
    inputFields: QVAULT_GET_VOTE_IN_PROPOSAL_INPUT_FIELDS,
    outputFields: QVAULT_GET_VOTE_IN_PROPOSAL_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const qVAULT = {
  contractIndex: QVAULT_CONTRACT_INDEX,
  getData: qVAULTGetData,
  getStakedAmountAndVotingPower: qVAULTGetStakedAmountAndVotingPower,
  getGP: qVAULTGetGP,
  getQCP: qVAULTGetQCP,
  getIPOP: qVAULTGetIPOP,
  getQEarnP: qVAULTGetQEarnP,
  getFundP: qVAULTGetFundP,
  getMKTP: qVAULTGetMKTP,
  getAlloP: qVAULTGetAlloP,
  getIdentitiesHvVtPw: qVAULTGetIdentitiesHvVtPw,
  ppCreationPower: qVAULTPpCreationPower,
  getQcapBurntAmountInLastEpoches: qVAULTGetQcapBurntAmountInLastEpoches,
  getAmountToBeSoldPerYear: qVAULTGetAmountToBeSoldPerYear,
  getTotalRevenueInQcap: qVAULTGetTotalRevenueInQcap,
  getRevenueInQcapPerEpoch: qVAULTGetRevenueInQcapPerEpoch,
  getRevenuePerShare: qVAULTGetRevenuePerShare,
  getAmountOfShareQvaultHold: qVAULTGetAmountOfShareQvaultHold,
  getNumberOfHolderAndAvgAm: qVAULTGetNumberOfHolderAndAvgAm,
  getAmountForQearnInUpcomingEpoch: qVAULTGetAmountForQearnInUpcomingEpoch,
  getVoteInProposal: qVAULTGetVoteInProposal,
  buildStakeInput: buildQVAULTStakeInput,
  decodeStakeOutput: decodeQVAULTStakeOutput,
  buildUnStakeInput: buildQVAULTUnStakeInput,
  decodeUnStakeOutput: decodeQVAULTUnStakeOutput,
  buildSubmitGPInput: buildQVAULTSubmitGPInput,
  decodeSubmitGPOutput: decodeQVAULTSubmitGPOutput,
  buildSubmitQCPInput: buildQVAULTSubmitQCPInput,
  decodeSubmitQCPOutput: decodeQVAULTSubmitQCPOutput,
  buildSubmitIPOPInput: buildQVAULTSubmitIPOPInput,
  decodeSubmitIPOPOutput: decodeQVAULTSubmitIPOPOutput,
  buildSubmitQEarnPInput: buildQVAULTSubmitQEarnPInput,
  decodeSubmitQEarnPOutput: decodeQVAULTSubmitQEarnPOutput,
  buildSubmitFundPInput: buildQVAULTSubmitFundPInput,
  decodeSubmitFundPOutput: decodeQVAULTSubmitFundPOutput,
  buildSubmitMKTPInput: buildQVAULTSubmitMKTPInput,
  decodeSubmitMKTPOutput: decodeQVAULTSubmitMKTPOutput,
  buildSubmitAlloPInput: buildQVAULTSubmitAlloPInput,
  decodeSubmitAlloPOutput: decodeQVAULTSubmitAlloPOutput,
  buildVoteInProposalInput: buildQVAULTVoteInProposalInput,
  decodeVoteInProposalOutput: decodeQVAULTVoteInProposalOutput,
  buildBuyQcapInput: buildQVAULTBuyQcapInput,
  decodeBuyQcapOutput: decodeQVAULTBuyQcapOutput,
  buildTransferShareManagementRightsInput: buildQVAULTTransferShareManagementRightsInput,
  decodeTransferShareManagementRightsOutput: decodeQVAULTTransferShareManagementRightsOutput,
}

