// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '@qubic.org/types'

export const Q_RAFFLE_CONTRACT_INDEX = 19

const STRUCTS: Record<string, NamedStruct> = {}

export const Q_RAFFLE_REGISTER_IN_SYSTEM_INPUT_TYPE = 1

export interface QRaffleRegisterInSystemInput {
  useQXMR: number
}

const Q_RAFFLE_REGISTER_IN_SYSTEM_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'useQXMR',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildQRaffleRegisterInSystemInput(
  input: QRaffleRegisterInSystemInput,
): ContractCall {
  return { contractIndex: Q_RAFFLE_CONTRACT_INDEX, inputType: Q_RAFFLE_REGISTER_IN_SYSTEM_INPUT_TYPE, payload: buildPayload(Q_RAFFLE_REGISTER_IN_SYSTEM_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QRaffleRegisterInSystemOutput {
  returnCode: number
}

const Q_RAFFLE_REGISTER_IN_SYSTEM_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQRaffleRegisterInSystemOutput(
  data: Uint8Array,
): QRaffleRegisterInSystemOutput {
  return decodePayload(data, Q_RAFFLE_REGISTER_IN_SYSTEM_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleRegisterInSystemOutput
}

export const Q_RAFFLE_LOGOUT_IN_SYSTEM_INPUT_TYPE = 2

export interface QRaffleLogoutInSystemOutput {
  returnCode: number
}

const Q_RAFFLE_LOGOUT_IN_SYSTEM_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQRaffleLogoutInSystemOutput(
  data: Uint8Array,
): QRaffleLogoutInSystemOutput {
  return decodePayload(data, Q_RAFFLE_LOGOUT_IN_SYSTEM_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleLogoutInSystemOutput
}

export const Q_RAFFLE_SUBMIT_ENTRY_AMOUNT_INPUT_TYPE = 3

export interface QRaffleSubmitEntryAmountInput {
  amount: bigint
}

const Q_RAFFLE_SUBMIT_ENTRY_AMOUNT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQRaffleSubmitEntryAmountInput(
  input: QRaffleSubmitEntryAmountInput,
): ContractCall {
  return { contractIndex: Q_RAFFLE_CONTRACT_INDEX, inputType: Q_RAFFLE_SUBMIT_ENTRY_AMOUNT_INPUT_TYPE, payload: buildPayload(Q_RAFFLE_SUBMIT_ENTRY_AMOUNT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QRaffleSubmitEntryAmountOutput {
  returnCode: number
}

const Q_RAFFLE_SUBMIT_ENTRY_AMOUNT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQRaffleSubmitEntryAmountOutput(
  data: Uint8Array,
): QRaffleSubmitEntryAmountOutput {
  return decodePayload(data, Q_RAFFLE_SUBMIT_ENTRY_AMOUNT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleSubmitEntryAmountOutput
}

export const Q_RAFFLE_SUBMIT_PROPOSAL_INPUT_TYPE = 4

export interface QRaffleSubmitProposalInput {
  tokenIssuer: string
  tokenName: bigint
  entryAmount: bigint
}

const Q_RAFFLE_SUBMIT_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'tokenIssuer',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'tokenName',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'entryAmount',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQRaffleSubmitProposalInput(
  input: QRaffleSubmitProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: Q_RAFFLE_CONTRACT_INDEX, inputType: Q_RAFFLE_SUBMIT_PROPOSAL_INPUT_TYPE, payload: buildPayload(Q_RAFFLE_SUBMIT_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QRaffleSubmitProposalOutput {
  returnCode: number
}

const Q_RAFFLE_SUBMIT_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQRaffleSubmitProposalOutput(
  data: Uint8Array,
): QRaffleSubmitProposalOutput {
  return decodePayload(data, Q_RAFFLE_SUBMIT_PROPOSAL_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleSubmitProposalOutput
}

export const Q_RAFFLE_VOTE_IN_PROPOSAL_INPUT_TYPE = 5

export interface QRaffleVoteInProposalInput {
  indexOfProposal: number
  yes: number
}

const Q_RAFFLE_VOTE_IN_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfProposal',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'yes',
    type: 'uint8',
    offset: 4,
    byteLength: 1,
  },
]

export function buildQRaffleVoteInProposalInput(
  input: QRaffleVoteInProposalInput,
): ContractCall {
  return { contractIndex: Q_RAFFLE_CONTRACT_INDEX, inputType: Q_RAFFLE_VOTE_IN_PROPOSAL_INPUT_TYPE, payload: buildPayload(Q_RAFFLE_VOTE_IN_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QRaffleVoteInProposalOutput {
  returnCode: number
}

const Q_RAFFLE_VOTE_IN_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQRaffleVoteInProposalOutput(
  data: Uint8Array,
): QRaffleVoteInProposalOutput {
  return decodePayload(data, Q_RAFFLE_VOTE_IN_PROPOSAL_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleVoteInProposalOutput
}

export const Q_RAFFLE_DEPOSIT_IN_QU_RAFFLE_INPUT_TYPE = 6

export interface QRaffleDepositInQuRaffleOutput {
  returnCode: number
}

const Q_RAFFLE_DEPOSIT_IN_QU_RAFFLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQRaffleDepositInQuRaffleOutput(
  data: Uint8Array,
): QRaffleDepositInQuRaffleOutput {
  return decodePayload(data, Q_RAFFLE_DEPOSIT_IN_QU_RAFFLE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleDepositInQuRaffleOutput
}

export const Q_RAFFLE_DEPOSIT_IN_TOKEN_RAFFLE_INPUT_TYPE = 7

export interface QRaffleDepositInTokenRaffleInput {
  indexOfTokenRaffle: number
}

const Q_RAFFLE_DEPOSIT_IN_TOKEN_RAFFLE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfTokenRaffle',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQRaffleDepositInTokenRaffleInput(
  input: QRaffleDepositInTokenRaffleInput,
): ContractCall {
  return { contractIndex: Q_RAFFLE_CONTRACT_INDEX, inputType: Q_RAFFLE_DEPOSIT_IN_TOKEN_RAFFLE_INPUT_TYPE, payload: buildPayload(Q_RAFFLE_DEPOSIT_IN_TOKEN_RAFFLE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QRaffleDepositInTokenRaffleOutput {
  returnCode: number
}

const Q_RAFFLE_DEPOSIT_IN_TOKEN_RAFFLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQRaffleDepositInTokenRaffleOutput(
  data: Uint8Array,
): QRaffleDepositInTokenRaffleOutput {
  return decodePayload(data, Q_RAFFLE_DEPOSIT_IN_TOKEN_RAFFLE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleDepositInTokenRaffleOutput
}

export const Q_RAFFLE_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 8

export interface QRaffleTransferShareManagementRightsInput {
  tokenIssuer: string
  tokenName: bigint
  numberOfShares: bigint
  newManagingContractIndex: number
}

const Q_RAFFLE_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'tokenIssuer',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'tokenName',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
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

export function buildQRaffleTransferShareManagementRightsInput(
  input: QRaffleTransferShareManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: Q_RAFFLE_CONTRACT_INDEX, inputType: Q_RAFFLE_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE, payload: buildPayload(Q_RAFFLE_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QRaffleTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
}

const Q_RAFFLE_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQRaffleTransferShareManagementRightsOutput(
  data: Uint8Array,
): QRaffleTransferShareManagementRightsOutput {
  return decodePayload(data, Q_RAFFLE_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleTransferShareManagementRightsOutput
}

export const Q_RAFFLE_GET_REGISTERS_INPUT_TYPE = 1
export const Q_RAFFLE_GET_REGISTERS_INPUT_SIZE = 8

export interface QRaffleGetRegistersInput {
  offset: number
  limit: number
}

const Q_RAFFLE_GET_REGISTERS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'offset',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'limit',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
]

export function buildQRaffleGetRegistersInput(
  input: QRaffleGetRegistersInput,
): Uint8Array {
  return buildPayload(Q_RAFFLE_GET_REGISTERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QRaffleGetRegistersOutput {
  register1: string
  returnCode: number
}

const Q_RAFFLE_GET_REGISTERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'register1',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 32,
    byteLength: 4,
  },
]

export function decodeQRaffleGetRegistersOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QRaffleGetRegistersOutput {
  return decodePayload(data, Q_RAFFLE_GET_REGISTERS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRaffleGetRegistersOutput
}

export async function qRaffleGetRegisters(
  live: SmartContractCaller,
  input: QRaffleGetRegistersInput,
  options?: ContractCallOptions,
): Promise<Result<QRaffleGetRegistersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RAFFLE_CONTRACT_INDEX,
    inputType: Q_RAFFLE_GET_REGISTERS_INPUT_TYPE,
    inputSize: Q_RAFFLE_GET_REGISTERS_INPUT_SIZE,
    inputFields: Q_RAFFLE_GET_REGISTERS_INPUT_FIELDS,
    outputFields: Q_RAFFLE_GET_REGISTERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RAFFLE_GET_ANALYTICS_INPUT_TYPE = 2
export const Q_RAFFLE_GET_ANALYTICS_INPUT_SIZE = 0

export interface QRaffleGetAnalyticsOutput {
  currentQuRaffleAmount: bigint
  totalBurnAmount: bigint
  totalCharityAmount: bigint
  totalShareholderAmount: bigint
  totalRegisterAmount: bigint
  totalFeeAmount: bigint
  totalWinnerAmount: bigint
  largestWinnerAmount: bigint
  numberOfRegisters: number
  numberOfProposals: number
  numberOfQuRaffleMembers: number
  numberOfActiveTokenRaffle: number
  numberOfEndedTokenRaffle: number
  numberOfEntryAmountSubmitted: number
  returnCode: number
}

const Q_RAFFLE_GET_ANALYTICS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'currentQuRaffleAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'totalBurnAmount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'totalCharityAmount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'totalShareholderAmount',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'totalRegisterAmount',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'totalFeeAmount',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'totalWinnerAmount',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'largestWinnerAmount',
    type: 'uint64',
    offset: 56,
    byteLength: 8,
  },
  {
    name: 'numberOfRegisters',
    type: 'uint32',
    offset: 64,
    byteLength: 4,
  },
  {
    name: 'numberOfProposals',
    type: 'uint32',
    offset: 68,
    byteLength: 4,
  },
  {
    name: 'numberOfQuRaffleMembers',
    type: 'uint32',
    offset: 72,
    byteLength: 4,
  },
  {
    name: 'numberOfActiveTokenRaffle',
    type: 'uint32',
    offset: 76,
    byteLength: 4,
  },
  {
    name: 'numberOfEndedTokenRaffle',
    type: 'uint32',
    offset: 80,
    byteLength: 4,
  },
  {
    name: 'numberOfEntryAmountSubmitted',
    type: 'uint32',
    offset: 84,
    byteLength: 4,
  },
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 88,
    byteLength: 4,
  },
]

export function decodeQRaffleGetAnalyticsOutput(
  data: Uint8Array,
): QRaffleGetAnalyticsOutput {
  return decodePayload(data, Q_RAFFLE_GET_ANALYTICS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleGetAnalyticsOutput
}

export async function qRaffleGetAnalytics(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QRaffleGetAnalyticsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RAFFLE_CONTRACT_INDEX,
    inputType: Q_RAFFLE_GET_ANALYTICS_INPUT_TYPE,
    inputSize: Q_RAFFLE_GET_ANALYTICS_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_RAFFLE_GET_ANALYTICS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_RAFFLE_GET_ACTIVE_PROPOSAL_INPUT_TYPE = 3
export const Q_RAFFLE_GET_ACTIVE_PROPOSAL_INPUT_SIZE = 4

export interface QRaffleGetActiveProposalInput {
  indexOfProposal: number
}

const Q_RAFFLE_GET_ACTIVE_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfProposal',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQRaffleGetActiveProposalInput(
  input: QRaffleGetActiveProposalInput,
): Uint8Array {
  return buildPayload(Q_RAFFLE_GET_ACTIVE_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QRaffleGetActiveProposalOutput {
  tokenIssuer: string
  proposer: string
  tokenName: bigint
  entryAmount: bigint
  nYes: number
  nNo: number
  returnCode: number
}

const Q_RAFFLE_GET_ACTIVE_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'tokenIssuer',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'proposer',
    type: 'id',
    offset: 32,
    byteLength: 32,
  },
  {
    name: 'tokenName',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: 'entryAmount',
    type: 'uint64',
    offset: 72,
    byteLength: 8,
  },
  {
    name: 'nYes',
    type: 'uint32',
    offset: 80,
    byteLength: 4,
  },
  {
    name: 'nNo',
    type: 'uint32',
    offset: 84,
    byteLength: 4,
  },
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 88,
    byteLength: 4,
  },
]

export function decodeQRaffleGetActiveProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QRaffleGetActiveProposalOutput {
  return decodePayload(data, Q_RAFFLE_GET_ACTIVE_PROPOSAL_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRaffleGetActiveProposalOutput
}

export async function qRaffleGetActiveProposal(
  live: SmartContractCaller,
  input: QRaffleGetActiveProposalInput,
  options?: ContractCallOptions,
): Promise<Result<QRaffleGetActiveProposalOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RAFFLE_CONTRACT_INDEX,
    inputType: Q_RAFFLE_GET_ACTIVE_PROPOSAL_INPUT_TYPE,
    inputSize: Q_RAFFLE_GET_ACTIVE_PROPOSAL_INPUT_SIZE,
    inputFields: Q_RAFFLE_GET_ACTIVE_PROPOSAL_INPUT_FIELDS,
    outputFields: Q_RAFFLE_GET_ACTIVE_PROPOSAL_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RAFFLE_GET_ENDED_TOKEN_RAFFLE_INPUT_TYPE = 4
export const Q_RAFFLE_GET_ENDED_TOKEN_RAFFLE_INPUT_SIZE = 4

export interface QRaffleGetEndedTokenRaffleInput {
  indexOfRaffle: number
}

const Q_RAFFLE_GET_ENDED_TOKEN_RAFFLE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfRaffle',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQRaffleGetEndedTokenRaffleInput(
  input: QRaffleGetEndedTokenRaffleInput,
): Uint8Array {
  return buildPayload(Q_RAFFLE_GET_ENDED_TOKEN_RAFFLE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QRaffleGetEndedTokenRaffleOutput {
  epochWinner: string
  tokenIssuer: string
  tokenName: bigint
  entryAmount: bigint
  numberOfMembers: number
  winnerIndex: number
  epoch: number
  returnCode: number
}

const Q_RAFFLE_GET_ENDED_TOKEN_RAFFLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'epochWinner',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'tokenIssuer',
    type: 'id',
    offset: 32,
    byteLength: 32,
  },
  {
    name: 'tokenName',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: 'entryAmount',
    type: 'uint64',
    offset: 72,
    byteLength: 8,
  },
  {
    name: 'numberOfMembers',
    type: 'uint32',
    offset: 80,
    byteLength: 4,
  },
  {
    name: 'winnerIndex',
    type: 'uint32',
    offset: 84,
    byteLength: 4,
  },
  {
    name: 'epoch',
    type: 'uint32',
    offset: 88,
    byteLength: 4,
  },
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 92,
    byteLength: 4,
  },
]

export function decodeQRaffleGetEndedTokenRaffleOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QRaffleGetEndedTokenRaffleOutput {
  return decodePayload(data, Q_RAFFLE_GET_ENDED_TOKEN_RAFFLE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRaffleGetEndedTokenRaffleOutput
}

export async function qRaffleGetEndedTokenRaffle(
  live: SmartContractCaller,
  input: QRaffleGetEndedTokenRaffleInput,
  options?: ContractCallOptions,
): Promise<Result<QRaffleGetEndedTokenRaffleOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RAFFLE_CONTRACT_INDEX,
    inputType: Q_RAFFLE_GET_ENDED_TOKEN_RAFFLE_INPUT_TYPE,
    inputSize: Q_RAFFLE_GET_ENDED_TOKEN_RAFFLE_INPUT_SIZE,
    inputFields: Q_RAFFLE_GET_ENDED_TOKEN_RAFFLE_INPUT_FIELDS,
    outputFields: Q_RAFFLE_GET_ENDED_TOKEN_RAFFLE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RAFFLE_GET_ENDED_QU_RAFFLE_INPUT_TYPE = 5
export const Q_RAFFLE_GET_ENDED_QU_RAFFLE_INPUT_SIZE = 4

export interface QRaffleGetEndedQuRaffleInput {
  epoch: number
}

const Q_RAFFLE_GET_ENDED_QU_RAFFLE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQRaffleGetEndedQuRaffleInput(
  input: QRaffleGetEndedQuRaffleInput,
): Uint8Array {
  return buildPayload(Q_RAFFLE_GET_ENDED_QU_RAFFLE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QRaffleGetEndedQuRaffleOutput {
  epochWinner: string
  receivedAmount: bigint
  entryAmount: bigint
  numberOfMembers: number
  winnerIndex: number
  numberOfDaoMembers: number
  returnCode: number
}

const Q_RAFFLE_GET_ENDED_QU_RAFFLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'epochWinner',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'receivedAmount',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'entryAmount',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'numberOfMembers',
    type: 'uint32',
    offset: 48,
    byteLength: 4,
  },
  {
    name: 'winnerIndex',
    type: 'uint32',
    offset: 52,
    byteLength: 4,
  },
  {
    name: 'numberOfDaoMembers',
    type: 'uint32',
    offset: 56,
    byteLength: 4,
  },
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 60,
    byteLength: 4,
  },
]

export function decodeQRaffleGetEndedQuRaffleOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QRaffleGetEndedQuRaffleOutput {
  return decodePayload(data, Q_RAFFLE_GET_ENDED_QU_RAFFLE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRaffleGetEndedQuRaffleOutput
}

export async function qRaffleGetEndedQuRaffle(
  live: SmartContractCaller,
  input: QRaffleGetEndedQuRaffleInput,
  options?: ContractCallOptions,
): Promise<Result<QRaffleGetEndedQuRaffleOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RAFFLE_CONTRACT_INDEX,
    inputType: Q_RAFFLE_GET_ENDED_QU_RAFFLE_INPUT_TYPE,
    inputSize: Q_RAFFLE_GET_ENDED_QU_RAFFLE_INPUT_SIZE,
    inputFields: Q_RAFFLE_GET_ENDED_QU_RAFFLE_INPUT_FIELDS,
    outputFields: Q_RAFFLE_GET_ENDED_QU_RAFFLE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RAFFLE_GET_ACTIVE_TOKEN_RAFFLE_INPUT_TYPE = 6
export const Q_RAFFLE_GET_ACTIVE_TOKEN_RAFFLE_INPUT_SIZE = 4

export interface QRaffleGetActiveTokenRaffleInput {
  indexOfTokenRaffle: number
}

const Q_RAFFLE_GET_ACTIVE_TOKEN_RAFFLE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfTokenRaffle',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQRaffleGetActiveTokenRaffleInput(
  input: QRaffleGetActiveTokenRaffleInput,
): Uint8Array {
  return buildPayload(Q_RAFFLE_GET_ACTIVE_TOKEN_RAFFLE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QRaffleGetActiveTokenRaffleOutput {
  tokenIssuer: string
  tokenName: bigint
  entryAmount: bigint
  numberOfMembers: number
  returnCode: number
}

const Q_RAFFLE_GET_ACTIVE_TOKEN_RAFFLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'tokenIssuer',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'tokenName',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'entryAmount',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'numberOfMembers',
    type: 'uint32',
    offset: 48,
    byteLength: 4,
  },
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 52,
    byteLength: 4,
  },
]

export function decodeQRaffleGetActiveTokenRaffleOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QRaffleGetActiveTokenRaffleOutput {
  return decodePayload(data, Q_RAFFLE_GET_ACTIVE_TOKEN_RAFFLE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRaffleGetActiveTokenRaffleOutput
}

export async function qRaffleGetActiveTokenRaffle(
  live: SmartContractCaller,
  input: QRaffleGetActiveTokenRaffleInput,
  options?: ContractCallOptions,
): Promise<Result<QRaffleGetActiveTokenRaffleOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RAFFLE_CONTRACT_INDEX,
    inputType: Q_RAFFLE_GET_ACTIVE_TOKEN_RAFFLE_INPUT_TYPE,
    inputSize: Q_RAFFLE_GET_ACTIVE_TOKEN_RAFFLE_INPUT_SIZE,
    inputFields: Q_RAFFLE_GET_ACTIVE_TOKEN_RAFFLE_INPUT_FIELDS,
    outputFields: Q_RAFFLE_GET_ACTIVE_TOKEN_RAFFLE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RAFFLE_GET_EPOCH_RAFFLE_INDEXES_INPUT_TYPE = 7
export const Q_RAFFLE_GET_EPOCH_RAFFLE_INDEXES_INPUT_SIZE = 4

export interface QRaffleGetEpochRaffleIndexesInput {
  epoch: number
}

const Q_RAFFLE_GET_EPOCH_RAFFLE_INDEXES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQRaffleGetEpochRaffleIndexesInput(
  input: QRaffleGetEpochRaffleIndexesInput,
): Uint8Array {
  return buildPayload(Q_RAFFLE_GET_EPOCH_RAFFLE_INDEXES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QRaffleGetEpochRaffleIndexesOutput {
  StartIndex: number
  EndIndex: number
  returnCode: number
}

const Q_RAFFLE_GET_EPOCH_RAFFLE_INDEXES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'StartIndex',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'EndIndex',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 8,
    byteLength: 4,
  },
]

export function decodeQRaffleGetEpochRaffleIndexesOutput(
  data: Uint8Array,
): QRaffleGetEpochRaffleIndexesOutput {
  return decodePayload(data, Q_RAFFLE_GET_EPOCH_RAFFLE_INDEXES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleGetEpochRaffleIndexesOutput
}

export async function qRaffleGetEpochRaffleIndexes(
  live: SmartContractCaller,
  input: QRaffleGetEpochRaffleIndexesInput,
  options?: ContractCallOptions,
): Promise<Result<QRaffleGetEpochRaffleIndexesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RAFFLE_CONTRACT_INDEX,
    inputType: Q_RAFFLE_GET_EPOCH_RAFFLE_INDEXES_INPUT_TYPE,
    inputSize: Q_RAFFLE_GET_EPOCH_RAFFLE_INDEXES_INPUT_SIZE,
    inputFields: Q_RAFFLE_GET_EPOCH_RAFFLE_INDEXES_INPUT_FIELDS,
    outputFields: Q_RAFFLE_GET_EPOCH_RAFFLE_INDEXES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AMOUNT_PER_USER_INPUT_TYPE = 8
export const Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AMOUNT_PER_USER_INPUT_SIZE = 32

export interface QRaffleGetQuRaffleEntryAmountPerUserInput {
  user: string
}

const Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AMOUNT_PER_USER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'user',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQRaffleGetQuRaffleEntryAmountPerUserInput(
  input: QRaffleGetQuRaffleEntryAmountPerUserInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AMOUNT_PER_USER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRaffleGetQuRaffleEntryAmountPerUserOutput {
  entryAmount: bigint
  returnCode: number
}

const Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AMOUNT_PER_USER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'entryAmount',
    type: 'uint64',
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

export function decodeQRaffleGetQuRaffleEntryAmountPerUserOutput(
  data: Uint8Array,
): QRaffleGetQuRaffleEntryAmountPerUserOutput {
  return decodePayload(data, Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AMOUNT_PER_USER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleGetQuRaffleEntryAmountPerUserOutput
}

export async function qRaffleGetQuRaffleEntryAmountPerUser(
  live: SmartContractCaller,
  input: QRaffleGetQuRaffleEntryAmountPerUserInput,
  options?: ContractCallOptions,
): Promise<Result<QRaffleGetQuRaffleEntryAmountPerUserOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RAFFLE_CONTRACT_INDEX,
    inputType: Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AMOUNT_PER_USER_INPUT_TYPE,
    inputSize: Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AMOUNT_PER_USER_INPUT_SIZE,
    inputFields: Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AMOUNT_PER_USER_INPUT_FIELDS,
    outputFields: Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AMOUNT_PER_USER_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AVERAGE_AMOUNT_INPUT_TYPE = 9
export const Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AVERAGE_AMOUNT_INPUT_SIZE = 0

export interface QRaffleGetQuRaffleEntryAverageAmountOutput {
  entryAverageAmount: bigint
  returnCode: number
}

const Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AVERAGE_AMOUNT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'entryAverageAmount',
    type: 'uint64',
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

export function decodeQRaffleGetQuRaffleEntryAverageAmountOutput(
  data: Uint8Array,
): QRaffleGetQuRaffleEntryAverageAmountOutput {
  return decodePayload(data, Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AVERAGE_AMOUNT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QRaffleGetQuRaffleEntryAverageAmountOutput
}

export async function qRaffleGetQuRaffleEntryAverageAmount(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QRaffleGetQuRaffleEntryAverageAmountOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RAFFLE_CONTRACT_INDEX,
    inputType: Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AVERAGE_AMOUNT_INPUT_TYPE,
    inputSize: Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AVERAGE_AMOUNT_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_RAFFLE_GET_QU_RAFFLE_ENTRY_AVERAGE_AMOUNT_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const qRaffle = {
  contractIndex: Q_RAFFLE_CONTRACT_INDEX,
  getRegisters: qRaffleGetRegisters,
  getAnalytics: qRaffleGetAnalytics,
  getActiveProposal: qRaffleGetActiveProposal,
  getEndedTokenRaffle: qRaffleGetEndedTokenRaffle,
  getEndedQuRaffle: qRaffleGetEndedQuRaffle,
  getActiveTokenRaffle: qRaffleGetActiveTokenRaffle,
  getEpochRaffleIndexes: qRaffleGetEpochRaffleIndexes,
  getQuRaffleEntryAmountPerUser: qRaffleGetQuRaffleEntryAmountPerUser,
  getQuRaffleEntryAverageAmount: qRaffleGetQuRaffleEntryAverageAmount,
  buildRegisterInSystemInput: buildQRaffleRegisterInSystemInput,
  decodeRegisterInSystemOutput: decodeQRaffleRegisterInSystemOutput,
  decodeLogoutInSystemOutput: decodeQRaffleLogoutInSystemOutput,
  buildSubmitEntryAmountInput: buildQRaffleSubmitEntryAmountInput,
  decodeSubmitEntryAmountOutput: decodeQRaffleSubmitEntryAmountOutput,
  buildSubmitProposalInput: buildQRaffleSubmitProposalInput,
  decodeSubmitProposalOutput: decodeQRaffleSubmitProposalOutput,
  buildVoteInProposalInput: buildQRaffleVoteInProposalInput,
  decodeVoteInProposalOutput: decodeQRaffleVoteInProposalOutput,
  decodeDepositInQuRaffleOutput: decodeQRaffleDepositInQuRaffleOutput,
  buildDepositInTokenRaffleInput: buildQRaffleDepositInTokenRaffleInput,
  decodeDepositInTokenRaffleOutput: decodeQRaffleDepositInTokenRaffleOutput,
  buildTransferShareManagementRightsInput: buildQRaffleTransferShareManagementRightsInput,
  decodeTransferShareManagementRightsOutput: decodeQRaffleTransferShareManagementRightsOutput,
}

