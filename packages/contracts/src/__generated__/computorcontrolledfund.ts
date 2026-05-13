// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/registry'
import { buildPayload, decodePayload } from '@qubic.ts/registry'
import type { QubicRpcError } from '@qubic.ts/rpc'
import { type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '../result.js'

export const COMPUTOR_CONTROLLED_FUND_CONTRACT_INDEX = 8

export interface ComputorControlledFundProposalDataTStruct {
  url: Uint8Array
  epoch: number
  type: number
  tick: number
  data: Uint8Array
}

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

export interface ComputorControlledFundProposalSingleVoteDataV1Struct {
  proposalIndex: number
  proposalType: number
  proposalTick: number
  voteValue: bigint
}

export interface ComputorControlledFundProposalSummarizedVotingDataV1Struct {
  proposalIndex: number
  optionCount: number
  proposalTick: number
  totalVotesAuthorized: number
  totalVotesCasted: number
  optionVoteCount: number[]
}

const STRUCTS: Record<string, NamedStruct> = {
  ProposalDataT: {
  name: 'ProposalDataT',
  byteLength: 304,
  fields: [
    {
      name: 'url',
      type: 'bytes',
      offset: 0,
      byteLength: 256,
    },
    {
      name: 'epoch',
      type: 'uint16',
      offset: 256,
      byteLength: 2,
    },
    {
      name: 'type',
      type: 'uint16',
      offset: 258,
      byteLength: 2,
    },
    {
      name: 'tick',
      type: 'uint32',
      offset: 260,
      byteLength: 4,
    },
    {
      name: 'data',
      type: 'bytes',
      offset: 264,
      byteLength: 40,
    },
],
},
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
  ProposalSingleVoteDataV1: {
  name: 'ProposalSingleVoteDataV1',
  byteLength: 16,
  fields: [
    {
      name: 'proposalIndex',
      type: 'uint16',
      offset: 0,
      byteLength: 2,
    },
    {
      name: 'proposalType',
      type: 'uint16',
      offset: 2,
      byteLength: 2,
    },
    {
      name: 'proposalTick',
      type: 'uint32',
      offset: 4,
      byteLength: 4,
    },
    {
      name: 'voteValue',
      type: 'sint64',
      offset: 8,
      byteLength: 8,
    },
],
},
  ProposalSummarizedVotingDataV1: {
  name: 'ProposalSummarizedVotingDataV1',
  byteLength: 48,
  fields: [
    {
      name: 'proposalIndex',
      type: 'uint16',
      offset: 0,
      byteLength: 2,
    },
    {
      name: 'optionCount',
      type: 'uint16',
      offset: 2,
      byteLength: 2,
    },
    {
      name: 'proposalTick',
      type: 'uint32',
      offset: 4,
      byteLength: 4,
    },
    {
      name: 'totalVotesAuthorized',
      type: 'uint32',
      offset: 8,
      byteLength: 4,
    },
    {
      name: 'totalVotesCasted',
      type: 'uint32',
      offset: 12,
      byteLength: 4,
    },
    {
      name: 'optionVoteCount',
      type: 'array',
      offset: 16,
      byteLength: 32,
      arrayLength: 8,
      arrayItemType: 'uint32',
      arrayItemByteLength: 4,
    },
],
},
}

export const COMPUTOR_CONTROLLED_FUND_VOTE_INPUT_TYPE = 0

export const COMPUTOR_CONTROLLED_FUND_SET_PROPOSAL_INPUT_TYPE = 1

export interface ComputorControlledFundSetProposalInput {
  proposal: ComputorControlledFundProposalDataTStruct
  isSubscription: number
  weeksPerPeriod: number
  startEpoch: number
  amountPerPeriod: bigint
  numberOfPeriods: number
}

const COMPUTOR_CONTROLLED_FUND_SET_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposal',
    type: 'struct',
    offset: 0,
    byteLength: 304,
    structRef: 'ProposalDataT',
  },
  {
    name: 'isSubscription',
    type: 'uint8',
    offset: 304,
    byteLength: 1,
  },
  {
    name: 'weeksPerPeriod',
    type: 'uint8',
    offset: 305,
    byteLength: 1,
  },
  {
    name: 'startEpoch',
    type: 'uint32',
    offset: 306,
    byteLength: 4,
  },
  {
    name: 'amountPerPeriod',
    type: 'uint64',
    offset: 310,
    byteLength: 8,
  },
  {
    name: 'numberOfPeriods',
    type: 'uint32',
    offset: 318,
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

const COMPUTOR_CONTROLLED_FUND_SET_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
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
  return decodePayload(data, COMPUTOR_CONTROLLED_FUND_SET_PROPOSAL_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as ComputorControlledFundSetProposalOutput
}

export const COMPUTOR_CONTROLLED_FUND_GET_LATEST_TRANSFERS_INPUT_TYPE = 0
export const COMPUTOR_CONTROLLED_FUND_GET_LATEST_TRANSFERS_INPUT_SIZE = 0

export const COMPUTOR_CONTROLLED_FUND_GET_REGULAR_PAYMENTS_INPUT_TYPE = 0
export const COMPUTOR_CONTROLLED_FUND_GET_REGULAR_PAYMENTS_INPUT_SIZE = 0

export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_INPUT_TYPE = 0
export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_INPUT_SIZE = 0

export interface ComputorControlledFundGetProposalFeeOutput {
  proposalFee: number
}

const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_OUTPUT_FIELDS: BinaryField[] = [
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
  return decodePayload(data, COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as ComputorControlledFundGetProposalFeeOutput
}

export async function computorControlledFundGetProposalFee(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<ComputorControlledFundGetProposalFeeOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: COMPUTOR_CONTROLLED_FUND_CONTRACT_INDEX,
    inputType: COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_INPUT_TYPE,
    inputSize: COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_INPUT_SIZE,
    inputFields: [],
    outputFields: COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_FEE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_INPUT_TYPE = 2
export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_INPUT_SIZE = 5

export interface ComputorControlledFundGetProposalIndicesInput {
  activeProposals: number
  prevProposalIndex: number
}

const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'activeProposals',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'prevProposalIndex',
    type: 'sint32',
    offset: 1,
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

const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_OUTPUT_FIELDS: BinaryField[] = [
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
  return decodePayload(data, COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as ComputorControlledFundGetProposalIndicesOutput
}

export async function computorControlledFundGetProposalIndices(
  live: SmartContractCaller,
  input: ComputorControlledFundGetProposalIndicesInput,
  options?: ContractCallOptions,
): Promise<Result<ComputorControlledFundGetProposalIndicesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: COMPUTOR_CONTROLLED_FUND_CONTRACT_INDEX,
    inputType: COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_INPUT_TYPE,
    inputSize: COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_INPUT_SIZE,
    inputFields: COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_INPUT_FIELDS,
    outputFields: COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INDICES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INPUT_TYPE = 3
export const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INPUT_SIZE = 34

export interface ComputorControlledFundGetProposalInput {
  subscriptionDestination: string
  proposalIndex: number
}

const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
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
  okay: number
  hasSubscriptionProposal: number
  hasActiveSubscription: number
  proposerPublicKey: string
  proposal: ComputorControlledFundProposalDataTStruct
  subscription: ComputorControlledFundSubscriptionDataStruct
  subscriptionProposal: ComputorControlledFundSubscriptionProposalDataStruct
}

const COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'okay',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'hasSubscriptionProposal',
    type: 'uint8',
    offset: 1,
    byteLength: 1,
  },
  {
    name: 'hasActiveSubscription',
    type: 'uint8',
    offset: 2,
    byteLength: 1,
  },
  {
    name: 'proposerPublicKey',
    type: 'id',
    offset: 3,
    byteLength: 32,
  },
  {
    name: 'proposal',
    type: 'struct',
    offset: 35,
    byteLength: 304,
    structRef: 'ProposalDataT',
  },
  {
    name: 'subscription',
    type: 'struct',
    offset: 339,
    byteLength: 309,
    structRef: 'SubscriptionData',
  },
  {
    name: 'subscriptionProposal',
    type: 'struct',
    offset: 648,
    byteLength: 337,
    structRef: 'SubscriptionProposalData',
  },
]

export function decodeComputorControlledFundGetProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): ComputorControlledFundGetProposalOutput {
  return decodePayload(data, COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as ComputorControlledFundGetProposalOutput
}

export async function computorControlledFundGetProposal(
  live: SmartContractCaller,
  input: ComputorControlledFundGetProposalInput,
  options?: ContractCallOptions,
): Promise<Result<ComputorControlledFundGetProposalOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: COMPUTOR_CONTROLLED_FUND_CONTRACT_INDEX,
    inputType: COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INPUT_TYPE,
    inputSize: COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INPUT_SIZE,
    inputFields: COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_INPUT_FIELDS,
    outputFields: COMPUTOR_CONTROLLED_FUND_GET_PROPOSAL_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const COMPUTOR_CONTROLLED_FUND_GET_VOTE_INPUT_TYPE = 4
export const COMPUTOR_CONTROLLED_FUND_GET_VOTE_INPUT_SIZE = 34

export interface ComputorControlledFundGetVoteInput {
  voter: string
  proposalIndex: number
}

const COMPUTOR_CONTROLLED_FUND_GET_VOTE_INPUT_FIELDS: BinaryField[] = [
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

export interface ComputorControlledFundGetVoteOutput {
  okay: number
  vote: ComputorControlledFundProposalSingleVoteDataV1Struct
}

const COMPUTOR_CONTROLLED_FUND_GET_VOTE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'okay',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'vote',
    type: 'struct',
    offset: 1,
    byteLength: 16,
    structRef: 'ProposalSingleVoteDataV1',
  },
]

export function decodeComputorControlledFundGetVoteOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): ComputorControlledFundGetVoteOutput {
  return decodePayload(data, COMPUTOR_CONTROLLED_FUND_GET_VOTE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as ComputorControlledFundGetVoteOutput
}

export async function computorControlledFundGetVote(
  live: SmartContractCaller,
  input: ComputorControlledFundGetVoteInput,
  options?: ContractCallOptions,
): Promise<Result<ComputorControlledFundGetVoteOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: COMPUTOR_CONTROLLED_FUND_CONTRACT_INDEX,
    inputType: COMPUTOR_CONTROLLED_FUND_GET_VOTE_INPUT_TYPE,
    inputSize: COMPUTOR_CONTROLLED_FUND_GET_VOTE_INPUT_SIZE,
    inputFields: COMPUTOR_CONTROLLED_FUND_GET_VOTE_INPUT_FIELDS,
    outputFields: COMPUTOR_CONTROLLED_FUND_GET_VOTE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_INPUT_TYPE = 5
export const COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_INPUT_SIZE = 2

export interface ComputorControlledFundGetVotingResultsInput {
  proposalIndex: number
}

const COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_INPUT_FIELDS: BinaryField[] = [
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

export interface ComputorControlledFundGetVotingResultsOutput {
  okay: number
  results: ComputorControlledFundProposalSummarizedVotingDataV1Struct
}

const COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'okay',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'results',
    type: 'struct',
    offset: 1,
    byteLength: 48,
    structRef: 'ProposalSummarizedVotingDataV1',
  },
]

export function decodeComputorControlledFundGetVotingResultsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): ComputorControlledFundGetVotingResultsOutput {
  return decodePayload(data, COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as ComputorControlledFundGetVotingResultsOutput
}

export async function computorControlledFundGetVotingResults(
  live: SmartContractCaller,
  input: ComputorControlledFundGetVotingResultsInput,
  options?: ContractCallOptions,
): Promise<Result<ComputorControlledFundGetVotingResultsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: COMPUTOR_CONTROLLED_FUND_CONTRACT_INDEX,
    inputType: COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_INPUT_TYPE,
    inputSize: COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_INPUT_SIZE,
    inputFields: COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_INPUT_FIELDS,
    outputFields: COMPUTOR_CONTROLLED_FUND_GET_VOTING_RESULTS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const computorControlledFund = {
  contractIndex: COMPUTOR_CONTROLLED_FUND_CONTRACT_INDEX,
  GetProposalFee: computorControlledFundGetProposalFee,
  GetProposalIndices: computorControlledFundGetProposalIndices,
  GetProposal: computorControlledFundGetProposal,
  GetVote: computorControlledFundGetVote,
  GetVotingResults: computorControlledFundGetVotingResults,
  buildSetProposalInput: buildComputorControlledFundSetProposalInput,
  decodeSetProposalOutput: decodeComputorControlledFundSetProposalOutput,
}

