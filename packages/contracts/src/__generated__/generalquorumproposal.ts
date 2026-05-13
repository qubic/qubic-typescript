// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const GENERAL_QUORUM_PROPOSAL_CONTRACT_INDEX = 6

const STRUCTS: Record<string, NamedStruct> = {}

export const GENERAL_QUORUM_PROPOSAL_SET_PROPOSAL_INPUT_TYPE = 0
export const GENERAL_QUORUM_PROPOSAL_SET_PROPOSAL_INPUT_SIZE = 0
export const GENERAL_QUORUM_PROPOSAL_SET_PROPOSAL_OUTPUT_SIZE = 3

export interface GeneralQuorumProposalSetProposalOutput {
  proposalIndex: number
  okay: number
}

export const GENERAL_QUORUM_PROPOSAL_SET_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): GeneralQuorumProposalSetProposalOutput {
  return decodePayload(
    data,
    GENERAL_QUORUM_PROPOSAL_SET_PROPOSAL_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as GeneralQuorumProposalSetProposalOutput
}

export const GENERAL_QUORUM_PROPOSAL_VOTE_INPUT_TYPE = 0
export const GENERAL_QUORUM_PROPOSAL_VOTE_INPUT_SIZE = 0
export const GENERAL_QUORUM_PROPOSAL_VOTE_OUTPUT_SIZE = 0

export const GENERAL_QUORUM_PROPOSAL_GET_REVENUE_DONATION_INPUT_TYPE = 0
export const GENERAL_QUORUM_PROPOSAL_GET_REVENUE_DONATION_INPUT_SIZE = 0
export const GENERAL_QUORUM_PROPOSAL_GET_REVENUE_DONATION_OUTPUT_SIZE = 0

export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_INPUT_TYPE = 1
export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_INPUT_SIZE = 4
export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_OUTPUT_SIZE = 130

export interface GeneralQuorumProposalGetProposalIndicesInput {
  prevProposalIndex: number
}

export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'prevProposalIndex',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildGeneralQuorumProposalGetProposalIndicesInput(
  input: GeneralQuorumProposalGetProposalIndicesInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GeneralQuorumProposalGetProposalIndicesOutput {
  numOfIndices: number
  indices: number[]
}

export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): GeneralQuorumProposalGetProposalIndicesOutput {
  return decodePayload(
    data,
    GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INDICES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as GeneralQuorumProposalGetProposalIndicesOutput
}

export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INPUT_TYPE = 2
export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INPUT_SIZE = 2
export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_OUTPUT_SIZE = 32

export interface GeneralQuorumProposalGetProposalInput {
  proposalIndex: number
}

export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalIndex',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildGeneralQuorumProposalGetProposalInput(
  input: GeneralQuorumProposalGetProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GeneralQuorumProposalGetProposalOutput {
  proposerPubicKey: string
}

export const GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposerPubicKey',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function decodeGeneralQuorumProposalGetProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): GeneralQuorumProposalGetProposalOutput {
  return decodePayload(
    data,
    GENERAL_QUORUM_PROPOSAL_GET_PROPOSAL_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as GeneralQuorumProposalGetProposalOutput
}

export const GENERAL_QUORUM_PROPOSAL_GET_VOTE_INPUT_TYPE = 3
export const GENERAL_QUORUM_PROPOSAL_GET_VOTE_INPUT_SIZE = 34
export const GENERAL_QUORUM_PROPOSAL_GET_VOTE_OUTPUT_SIZE = 0

export interface GeneralQuorumProposalGetVoteInput {
  voter: string
  proposalIndex: number
}

export const GENERAL_QUORUM_PROPOSAL_GET_VOTE_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(GENERAL_QUORUM_PROPOSAL_GET_VOTE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_INPUT_TYPE = 4
export const GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_INPUT_SIZE = 2
export const GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_OUTPUT_SIZE = 0

export interface GeneralQuorumProposalGetVotingResultsInput {
  proposalIndex: number
}

export const GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalIndex',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildGeneralQuorumProposalGetVotingResultsInput(
  input: GeneralQuorumProposalGetVotingResultsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(GENERAL_QUORUM_PROPOSAL_GET_VOTING_RESULTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

