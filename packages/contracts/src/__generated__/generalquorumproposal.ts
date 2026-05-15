// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '../result.js'

export const GENERAL_QUORUM_PROPOSAL_CONTRACT_INDEX = 6

export interface GeneralQuorumProposalProposalDataTStruct {
  url: Uint8Array
  epoch: number
  type: number
  tick: number
  data: Uint8Array
}

export interface GeneralQuorumProposalProposalSingleVoteDataV1Struct {
  proposalIndex: number
  proposalType: number
  proposalTick: number
  voteValue: bigint
}

export interface GeneralQuorumProposalProposalSummarizedVotingDataV1Struct {
  proposalIndex: number
  optionCount: number
  proposalTick: number
  totalVotesAuthorized: number
  totalVotesCasted: number
  optionVoteCount: number[]
}

export interface GeneralQuorumProposalRevenueDonationEntryStruct {
  destinationPublicKey: string
  millionthAmount: bigint
  firstEpoch: number
}

const STRUCTS: Record<string, NamedStruct> = {
  'ProposalDataT': {
  name: 'ProposalDataT',
  byteLength: 328,
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
      byteLength: 64,
    },
],
},
  'ProposalSingleVoteDataV1': {
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
  'ProposalSummarizedVotingDataV1': {
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
  'RevenueDonationEntry': {
  name: 'RevenueDonationEntry',
  byteLength: 42,
  fields: [
    {
      name: 'destinationPublicKey',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'millionthAmount',
      type: 'sint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'firstEpoch',
      type: 'uint16',
      offset: 40,
      byteLength: 2,
    },
],
},
}

export const GENERAL_QUORUM_PROPOSAL_SET_PROPOSAL_INPUT_TYPE = 3

export interface GeneralQuorumProposalSetProposalInput {
  url: Uint8Array
  epoch: number
  type: number
  tick: number
  data: Uint8Array
}

const GENERAL_QUORUM_PROPOSAL_SET_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
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
    byteLength: 64,
  },
]

export function buildGeneralQuorumProposalSetProposalInput(
  input: GeneralQuorumProposalSetProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(GENERAL_QUORUM_PROPOSAL_SET_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GeneralQuorumProposalSetProposalOutput {
  proposalIndex: number
  okay: number
}

const GENERAL_QUORUM_PROPOSAL_SET_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalIndex',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
  {
    name: 'okay',
    type: 'uint8',
    offset: 2,
    byteLength: 1,
  },
]

export function decodeGeneralQuorumProposalSetProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): GeneralQuorumProposalSetProposalOutput {
  return decodePayload(data, GENERAL_QUORUM_PROPOSAL_SET_PROPOSAL_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as GeneralQuorumProposalSetProposalOutput
}

export const GENERAL_QUORUM_PROPOSAL_VOTE_INPUT_TYPE = 6

export interface GeneralQuorumProposalVoteInput {
  proposalIndex: number
  proposalType: number
  proposalTick: number
  voteValue: bigint
}

const GENERAL_QUORUM_PROPOSAL_VOTE_INPUT_FIELDS: BinaryField[] = [
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
]

export function buildGeneralQuorumProposalVoteInput(
  input: GeneralQuorumProposalVoteInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(GENERAL_QUORUM_PROPOSAL_VOTE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GeneralQuorumProposalVoteOutput {
  okay: number
}

const GENERAL_QUORUM_PROPOSAL_VOTE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'okay',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeGeneralQuorumProposalVoteOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): GeneralQuorumProposalVoteOutput {
  return decodePayload(data, GENERAL_QUORUM_PROPOSAL_VOTE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as GeneralQuorumProposalVoteOutput
}

export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_INPUT_TYPE = 4
export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_INPUT_SIZE = 5

export interface GeneralQuorumProposalGetProposalIndicesInput {
  activeProposals: number
  prevProposalIndex: number
}

const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_INPUT_FIELDS: BinaryField[] = [
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

export function buildGeneralQuorumProposalGetProposalIndicesInput(
  input: GeneralQuorumProposalGetProposalIndicesInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GeneralQuorumProposalGetProposalIndicesOutput {
  numOfIndices: number
  indices: number[]
}

const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeGeneralQuorumProposalGetProposalIndicesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): GeneralQuorumProposalGetProposalIndicesOutput {
  return decodePayload(data, GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as GeneralQuorumProposalGetProposalIndicesOutput
}

export async function generalQuorumProposalGetProposalIndices(
  live: SmartContractCaller,
  input: GeneralQuorumProposalGetProposalIndicesInput,
  options?: ContractCallOptions,
): Promise<Result<GeneralQuorumProposalGetProposalIndicesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GENERAL_QUORUM_PROPOSAL_CONTRACT_INDEX,
    inputType: GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_INPUT_TYPE,
    inputSize: GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_INPUT_SIZE,
    inputFields: GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_INPUT_FIELDS,
    outputFields: GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INPUT_TYPE = 5
export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INPUT_SIZE = 2

export interface GeneralQuorumProposalGetProposalInput {
  proposalIndex: number
}

const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalIndex',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildGeneralQuorumProposalGetProposalInput(
  input: GeneralQuorumProposalGetProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GeneralQuorumProposalGetProposalOutput {
  okay: number
  _padding0: number[]
  _padding1: number[]
  _padding2: number[]
  proposerPubicKey: string
  proposal: GeneralQuorumProposalProposalDataTStruct
}

const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'okay',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: '_padding0',
    type: 'array',
    offset: 1,
    byteLength: 4,
    arrayLength: 4,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: '_padding1',
    type: 'array',
    offset: 5,
    byteLength: 2,
    arrayLength: 2,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: '_padding2',
    type: 'array',
    offset: 7,
    byteLength: 1,
    arrayLength: 1,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'proposerPubicKey',
    type: 'id',
    offset: 8,
    byteLength: 32,
  },
  {
    name: 'proposal',
    type: 'struct',
    offset: 40,
    byteLength: 328,
    structRef: 'ProposalDataT',
  },
]

export function decodeGeneralQuorumProposalGetProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): GeneralQuorumProposalGetProposalOutput {
  return decodePayload(data, GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as GeneralQuorumProposalGetProposalOutput
}

export async function generalQuorumProposalGetProposal(
  live: SmartContractCaller,
  input: GeneralQuorumProposalGetProposalInput,
  options?: ContractCallOptions,
): Promise<Result<GeneralQuorumProposalGetProposalOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GENERAL_QUORUM_PROPOSAL_CONTRACT_INDEX,
    inputType: GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INPUT_TYPE,
    inputSize: GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INPUT_SIZE,
    inputFields: GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INPUT_FIELDS,
    outputFields: GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const GENERAL_QUORUM_PROPOSAL_GET_VOTE_INPUT_TYPE = 7
export const GENERAL_QUORUM_PROPOSAL_GET_VOTE_INPUT_SIZE = 34

export interface GeneralQuorumProposalGetVoteInput {
  voter: string
  proposalIndex: number
}

const GENERAL_QUORUM_PROPOSAL_GET_VOTE_INPUT_FIELDS: BinaryField[] = [
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

export function buildGeneralQuorumProposalGetVoteInput(
  input: GeneralQuorumProposalGetVoteInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(GENERAL_QUORUM_PROPOSAL_GET_VOTE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GeneralQuorumProposalGetVoteOutput {
  okay: number
  vote: GeneralQuorumProposalProposalSingleVoteDataV1Struct
}

const GENERAL_QUORUM_PROPOSAL_GET_VOTE_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeGeneralQuorumProposalGetVoteOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): GeneralQuorumProposalGetVoteOutput {
  return decodePayload(data, GENERAL_QUORUM_PROPOSAL_GET_VOTE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as GeneralQuorumProposalGetVoteOutput
}

export async function generalQuorumProposalGetVote(
  live: SmartContractCaller,
  input: GeneralQuorumProposalGetVoteInput,
  options?: ContractCallOptions,
): Promise<Result<GeneralQuorumProposalGetVoteOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GENERAL_QUORUM_PROPOSAL_CONTRACT_INDEX,
    inputType: GENERAL_QUORUM_PROPOSAL_GET_VOTE_INPUT_TYPE,
    inputSize: GENERAL_QUORUM_PROPOSAL_GET_VOTE_INPUT_SIZE,
    inputFields: GENERAL_QUORUM_PROPOSAL_GET_VOTE_INPUT_FIELDS,
    outputFields: GENERAL_QUORUM_PROPOSAL_GET_VOTE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_INPUT_TYPE = 8
export const GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_INPUT_SIZE = 2

export interface GeneralQuorumProposalGetVotingResultsInput {
  proposalIndex: number
}

const GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalIndex',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildGeneralQuorumProposalGetVotingResultsInput(
  input: GeneralQuorumProposalGetVotingResultsInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GeneralQuorumProposalGetVotingResultsOutput {
  okay: number
  results: GeneralQuorumProposalProposalSummarizedVotingDataV1Struct
}

const GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeGeneralQuorumProposalGetVotingResultsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): GeneralQuorumProposalGetVotingResultsOutput {
  return decodePayload(data, GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as GeneralQuorumProposalGetVotingResultsOutput
}

export async function generalQuorumProposalGetVotingResults(
  live: SmartContractCaller,
  input: GeneralQuorumProposalGetVotingResultsInput,
  options?: ContractCallOptions,
): Promise<Result<GeneralQuorumProposalGetVotingResultsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GENERAL_QUORUM_PROPOSAL_CONTRACT_INDEX,
    inputType: GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_INPUT_TYPE,
    inputSize: GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_INPUT_SIZE,
    inputFields: GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_INPUT_FIELDS,
    outputFields: GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const GENERAL_QUORUM_PROPOSAL_GET_REVENUE_DONATION_INPUT_TYPE = 9
export const GENERAL_QUORUM_PROPOSAL_GET_REVENUE_DONATION_INPUT_SIZE = 0

export interface GeneralQuorumProposalGetRevenueDonationOutput {
  data: number[]
}

const GENERAL_QUORUM_PROPOSAL_GET_REVENUE_DONATION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'data',
    type: 'array',
    offset: 0,
    byteLength: 5376,
    arrayLength: 128,
    arrayItemByteLength: 42,
    arrayItemStructRef: 'RevenueDonationEntry',
  },
]

export function decodeGeneralQuorumProposalGetRevenueDonationOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): GeneralQuorumProposalGetRevenueDonationOutput {
  return decodePayload(data, GENERAL_QUORUM_PROPOSAL_GET_REVENUE_DONATION_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as GeneralQuorumProposalGetRevenueDonationOutput
}

export async function generalQuorumProposalGetRevenueDonation(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<GeneralQuorumProposalGetRevenueDonationOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GENERAL_QUORUM_PROPOSAL_CONTRACT_INDEX,
    inputType: GENERAL_QUORUM_PROPOSAL_GET_REVENUE_DONATION_INPUT_TYPE,
    inputSize: GENERAL_QUORUM_PROPOSAL_GET_REVENUE_DONATION_INPUT_SIZE,
    inputFields: [],
    outputFields: GENERAL_QUORUM_PROPOSAL_GET_REVENUE_DONATION_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const generalQuorumProposal = {
  contractIndex: GENERAL_QUORUM_PROPOSAL_CONTRACT_INDEX,
  GetProposalIndices: generalQuorumProposalGetProposalIndices,
  GetProposal: generalQuorumProposalGetProposal,
  GetVote: generalQuorumProposalGetVote,
  GetVotingResults: generalQuorumProposalGetVotingResults,
  GetRevenueDonation: generalQuorumProposalGetRevenueDonation,
  buildSetProposalInput: buildGeneralQuorumProposalSetProposalInput,
  decodeSetProposalOutput: decodeGeneralQuorumProposalSetProposalOutput,
  buildVoteInput: buildGeneralQuorumProposalVoteInput,
  decodeVoteOutput: decodeGeneralQuorumProposalVoteOutput,
}

