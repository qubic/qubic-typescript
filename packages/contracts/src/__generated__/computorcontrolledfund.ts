// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const COMPUTOR_CONTROLLED_FUND_CONTRACT_INDEX = 8

export interface ComputorControlledFundSubscriptionDataStruct {
  destination: string
  url: number[]
  weeksPerPeriod: number
  numberOfPeriods: number
  amountPerPeriod: bigint
  startEpoch: number
  currentPeriod: number
}

export interface ComputorControlledFundSubscriptionProposalDataStruct {
  proposerId: string
  destination: string
  url: number[]
  weeksPerPeriod: number
  numberOfPeriods: number
  amountPerPeriod: bigint
  startEpoch: number
}

const STRUCTS: Record<string, NamedStruct> = {
  SubscriptionData: {
  name: 'SubscriptionData',
  byteLength: 309,
  fields: [
    {
      name: 'destination',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'url',
      type: 'array',
      offset: 32,
      byteLength: 256,
      arrayLength: 256,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'weeksPerPeriod',
      type: 'uint8',
      offset: 288,
      byteLength: 1,
    },
    {
      name: 'numberOfPeriods',
      type: 'uint32',
      offset: 289,
      byteLength: 4,
    },
    {
      name: 'amountPerPeriod',
      type: 'uint64',
      offset: 293,
      byteLength: 8,
    },
    {
      name: 'startEpoch',
      type: 'uint32',
      offset: 301,
      byteLength: 4,
    },
    {
      name: 'currentPeriod',
      type: 'sint32',
      offset: 305,
      byteLength: 4,
    },
],
},
  SubscriptionProposalData: {
  name: 'SubscriptionProposalData',
  byteLength: 337,
  fields: [
    {
      name: 'proposerId',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'destination',
      type: 'id',
      offset: 32,
      byteLength: 32,
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
      name: 'weeksPerPeriod',
      type: 'uint8',
      offset: 320,
      byteLength: 1,
    },
    {
      name: 'numberOfPeriods',
      type: 'uint32',
      offset: 321,
      byteLength: 4,
    },
    {
      name: 'amountPerPeriod',
      type: 'uint64',
      offset: 325,
      byteLength: 8,
    },
    {
      name: 'startEpoch',
      type: 'uint32',
      offset: 333,
      byteLength: 4,
    },
],
},
}

export const COMPUTOR_CONTROLLED_FUND_VOTE_INPUT_TYPE = 0
export const COMPUTOR_CONTROLLED_FUND_VOTE_INPUT_SIZE = 0
export const COMPUTOR_CONTROLLED_FUND_VOTE_OUTPUT_SIZE = 0

export const COMPUTOR_CONTROLLED_FUND_SET_PROPOSAL_INPUT_TYPE = 1
export const COMPUTOR_CONTROLLED_FUND_SET_PROPOSAL_INPUT_SIZE = 17
export const COMPUTOR_CONTROLLED_FUND_SET_PROPOSAL_OUTPUT_SIZE = 2

export interface ComputorControlledFundSetProposalInput {
  weeksPerPeriod: number
  startEpoch: number
  amountPerPeriod: bigint
  numberOfPeriods: number
}

export const COMPUTOR_CONTROLLED_FUND_SET_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'weeksPerPeriod',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'startEpoch',
    type: 'uint32',
    offset: 1,
    byteLength: 4,
  },
  {
    name: 'amountPerPeriod',
    type: 'uint64',
    offset: 5,
    byteLength: 8,
  },
  {
    name: 'numberOfPeriods',
    type: 'uint32',
    offset: 13,
    byteLength: 4,
  },
]

export function buildComputorControlledFundSetProposalInput(
  input: ComputorControlledFundSetProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(COMPUTOR_CONTROLLED_FUND_SET_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface ComputorControlledFundSetProposalOutput {
  proposalIndex: number
}

export const COMPUTOR_CONTROLLED_FUND_SET_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalIndex',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function decodeComputorControlledFundSetProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): ComputorControlledFundSetProposalOutput {
  return decodePayload(
    data,
    COMPUTOR_CONTROLLED_FUND_SET_PROPOSAL_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as ComputorControlledFundSetProposalOutput
}

export const COMPUTOR_CONTROLLED_FUND_GET_LATEST_TRANSFERS_INPUT_TYPE = 0
export const COMPUTOR_CONTROLLED_FUND_GET_LATEST_TRANSFERS_INPUT_SIZE = 0
export const COMPUTOR_CONTROLLED_FUND_GET_LATEST_TRANSFERS_OUTPUT_SIZE = 0

export const COMPUTOR_CONTROLLED_FUND_GET_REGULAR_PAYMENTS_INPUT_TYPE = 0
export const COMPUTOR_CONTROLLED_FUND_GET_REGULAR_PAYMENTS_INPUT_SIZE = 0
export const COMPUTOR_CONTROLLED_FUND_GET_REGULAR_PAYMENTS_OUTPUT_SIZE = 0

export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_INPUT_TYPE = 0
export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_INPUT_SIZE = 0
export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_OUTPUT_SIZE = 4

export interface ComputorControlledFundGetProposalFeeOutput {
  proposalFee: number
}

export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalFee',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeComputorControlledFundGetProposalFeeOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): ComputorControlledFundGetProposalFeeOutput {
  return decodePayload(
    data,
    COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as ComputorControlledFundGetProposalFeeOutput
}

export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_INPUT_TYPE = 2
export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_INPUT_SIZE = 4
export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_OUTPUT_SIZE = 130

export interface ComputorControlledFundGetProposalIndicesInput {
  prevProposalIndex: number
}

export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'prevProposalIndex',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildComputorControlledFundGetProposalIndicesInput(
  input: ComputorControlledFundGetProposalIndicesInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface ComputorControlledFundGetProposalIndicesOutput {
  numOfIndices: number
  indices: number[]
}

export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'numOfIndices',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
  {
    name: 'indices',
    type: 'array',
    offset: 2,
    byteLength: 128,
    arrayLength: 64,
    arrayItemType: 'uint16',
    arrayItemByteLength: 2,
  },
]

export function decodeComputorControlledFundGetProposalIndicesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): ComputorControlledFundGetProposalIndicesOutput {
  return decodePayload(
    data,
    COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as ComputorControlledFundGetProposalIndicesOutput
}

export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INPUT_TYPE = 3
export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INPUT_SIZE = 34
export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_OUTPUT_SIZE = 678

export interface ComputorControlledFundGetProposalInput {
  subscriptionDestination: string
  proposalIndex: number
}

export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'subscriptionDestination',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'proposalIndex',
    type: 'uint16',
    offset: 32,
    byteLength: 2,
  },
]

export function buildComputorControlledFundGetProposalInput(
  input: ComputorControlledFundGetProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface ComputorControlledFundGetProposalOutput {
  proposerPublicKey: string
  subscription: ComputorControlledFundSubscriptionDataStruct
  subscriptionProposal: ComputorControlledFundSubscriptionProposalDataStruct
}

export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposerPublicKey',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'subscription',
    type: 'struct',
    offset: 32,
    byteLength: 309,
    structRef: 'SubscriptionData',
  },
  {
    name: 'subscriptionProposal',
    type: 'struct',
    offset: 341,
    byteLength: 337,
    structRef: 'SubscriptionProposalData',
  },
]

export function decodeComputorControlledFundGetProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): ComputorControlledFundGetProposalOutput {
  return decodePayload(
    data,
    COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as ComputorControlledFundGetProposalOutput
}

export const COMPUTOR_CONTROLLED_FUND_GET_VOTE_INPUT_TYPE = 4
export const COMPUTOR_CONTROLLED_FUND_GET_VOTE_INPUT_SIZE = 34
export const COMPUTOR_CONTROLLED_FUND_GET_VOTE_OUTPUT_SIZE = 0

export interface ComputorControlledFundGetVoteInput {
  voter: string
  proposalIndex: number
}

export const COMPUTOR_CONTROLLED_FUND_GET_VOTE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'voter',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'proposalIndex',
    type: 'uint16',
    offset: 32,
    byteLength: 2,
  },
]

export function buildComputorControlledFundGetVoteInput(
  input: ComputorControlledFundGetVoteInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(COMPUTOR_CONTROLLED_FUND_GET_VOTE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_INPUT_TYPE = 5
export const COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_INPUT_SIZE = 2
export const COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_OUTPUT_SIZE = 0

export interface ComputorControlledFundGetVotingResultsInput {
  proposalIndex: number
}

export const COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalIndex',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildComputorControlledFundGetVotingResultsInput(
  input: ComputorControlledFundGetVotingResultsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

