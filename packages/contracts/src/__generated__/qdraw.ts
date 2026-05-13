// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'
import type { QubicRpcError } from '@qubic.ts/rpc'
import { type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '../result.js'

export const QDRAW_CONTRACT_INDEX = 15

const STRUCTS: Record<string, NamedStruct> = {}

export const QDRAW_BUY_TICKET_INPUT_TYPE = 1

export interface QdrawBuyTicketInput {
  ticketCount: bigint
}

const QDRAW_BUY_TICKET_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'ticketCount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQdrawBuyTicketInput(
  input: QdrawBuyTicketInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QDRAW_BUY_TICKET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const QDRAW_GET_INFO_INPUT_TYPE = 2
export const QDRAW_GET_INFO_INPUT_SIZE = 0

export interface QdrawGetInfoOutput {
  pot: bigint
  participantCount: bigint
  lastWinner: string
  lastWinAmount: bigint
  lastDrawHour: number
  currentHour: number
  nextDrawHour: number
}

const QDRAW_GET_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'pot',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'participantCount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'lastWinner',
    type: 'id',
    offset: 16,
    byteLength: 32,
  },
  {
    name: 'lastWinAmount',
    type: 'sint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'lastDrawHour',
    type: 'uint8',
    offset: 56,
    byteLength: 1,
  },
  {
    name: 'currentHour',
    type: 'uint8',
    offset: 57,
    byteLength: 1,
  },
  {
    name: 'nextDrawHour',
    type: 'uint8',
    offset: 58,
    byteLength: 1,
  },
]

export function decodeQdrawGetInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QdrawGetInfoOutput {
  return decodePayload(data, QDRAW_GET_INFO_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QdrawGetInfoOutput
}

export async function qdrawGetInfo(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QdrawGetInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QDRAW_CONTRACT_INDEX,
    inputType: QDRAW_GET_INFO_INPUT_TYPE,
    inputSize: QDRAW_GET_INFO_INPUT_SIZE,
    inputFields: [],
    outputFields: QDRAW_GET_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const QDRAW_GET_PARTICIPANTS_INPUT_TYPE = 3
export const QDRAW_GET_PARTICIPANTS_INPUT_SIZE = 0

export interface QdrawGetParticipantsOutput {
  participantCount: bigint
  uniqueParticipantCount: bigint
  participants: string[]
  ticketCounts: bigint[]
}

const QDRAW_GET_PARTICIPANTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'participantCount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'uniqueParticipantCount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'participants',
    type: 'array',
    offset: 16,
    byteLength: 32768,
    arrayLength: 1024,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
  {
    name: 'ticketCounts',
    type: 'array',
    offset: 32784,
    byteLength: 8192,
    arrayLength: 1024,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
]

export function decodeQdrawGetParticipantsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QdrawGetParticipantsOutput {
  return decodePayload(data, QDRAW_GET_PARTICIPANTS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QdrawGetParticipantsOutput
}

export async function qdrawGetParticipants(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QdrawGetParticipantsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QDRAW_CONTRACT_INDEX,
    inputType: QDRAW_GET_PARTICIPANTS_INPUT_TYPE,
    inputSize: QDRAW_GET_PARTICIPANTS_INPUT_SIZE,
    inputFields: [],
    outputFields: QDRAW_GET_PARTICIPANTS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const qdraw = {
  contractIndex: QDRAW_CONTRACT_INDEX,
  getInfo: qdrawGetInfo,
  getParticipants: qdrawGetParticipants,
  buildBuyTicketInput: buildQdrawBuyTicketInput,
}

