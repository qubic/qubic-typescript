// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '@qubic.org/types'

export const Q_DUEL_CONTRACT_INDEX = 23

export interface QDuelRoomInfoStruct {
  roomId: string
  owner: string
  allowedPlayer: string
  amount: bigint
  closeTimer: bigint
  lastUpdate: QDuelDateAndTimeStruct
}

export interface QDuelWinnerDataStruct {
  player1: string
  player2: string
  winner: string
  revenue: bigint
}

export interface QDuelDateAndTimeStruct {
  value: bigint
}

const STRUCTS: Record<string, NamedStruct> = {
  'RoomInfo': {
  name: 'RoomInfo',
  byteLength: 120,
  fields: [
    {
      name: 'roomId',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'owner',
      type: 'id',
      offset: 32,
      byteLength: 32,
    },
    {
      name: 'allowedPlayer',
      type: 'id',
      offset: 64,
      byteLength: 32,
    },
    {
      name: 'amount',
      type: 'sint64',
      offset: 96,
      byteLength: 8,
    },
    {
      name: 'closeTimer',
      type: 'uint64',
      offset: 104,
      byteLength: 8,
    },
    {
      name: 'lastUpdate',
      type: 'struct',
      offset: 112,
      byteLength: 8,
      structRef: 'DateAndTime',
    },
],
},
  'WinnerData': {
  name: 'WinnerData',
  byteLength: 104,
  fields: [
    {
      name: 'player1',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'player2',
      type: 'id',
      offset: 32,
      byteLength: 32,
    },
    {
      name: 'winner',
      type: 'id',
      offset: 64,
      byteLength: 32,
    },
    {
      name: 'revenue',
      type: 'uint64',
      offset: 96,
      byteLength: 8,
    },
],
},
  'DateAndTime': {
  name: 'DateAndTime',
  byteLength: 8,
  fields: [
    {
      name: 'value',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
],
},
}

export const Q_DUEL_CREATE_ROOM_INPUT_TYPE = 1

export interface QDuelCreateRoomInput {
  allowedPlayer: string
  stake: bigint
  raiseStep: bigint
  maxStake: bigint
}

const Q_DUEL_CREATE_ROOM_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'allowedPlayer',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'stake',
    type: 'sint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'raiseStep',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'maxStake',
    type: 'sint64',
    offset: 48,
    byteLength: 8,
  },
]

export function buildQDuelCreateRoomInput(
  input: QDuelCreateRoomInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: Q_DUEL_CONTRACT_INDEX, inputType: Q_DUEL_CREATE_ROOM_INPUT_TYPE, payload: buildPayload(Q_DUEL_CREATE_ROOM_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export const Q_DUEL_CONNECT_TO_ROOM_INPUT_TYPE = 2

export interface QDuelConnectToRoomInput {
  roomId: string
}

const Q_DUEL_CONNECT_TO_ROOM_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'roomId',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQDuelConnectToRoomInput(
  input: QDuelConnectToRoomInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: Q_DUEL_CONTRACT_INDEX, inputType: Q_DUEL_CONNECT_TO_ROOM_INPUT_TYPE, payload: buildPayload(Q_DUEL_CONNECT_TO_ROOM_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QDuelConnectToRoomOutput {
  winner: string
}

const Q_DUEL_CONNECT_TO_ROOM_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'winner',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function decodeQDuelConnectToRoomOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QDuelConnectToRoomOutput {
  return decodePayload(data, Q_DUEL_CONNECT_TO_ROOM_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QDuelConnectToRoomOutput
}

export const Q_DUEL_SET_PERCENT_FEES_INPUT_TYPE = 3

export interface QDuelSetPercentFeesInput {
  devFeePercentBps: number
  burnFeePercentBps: number
  shareholdersFeePercentBps: number
  percentScale: number
}

const Q_DUEL_SET_PERCENT_FEES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'devFeePercentBps',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'burnFeePercentBps',
    type: 'uint8',
    offset: 1,
    byteLength: 1,
  },
  {
    name: 'shareholdersFeePercentBps',
    type: 'uint8',
    offset: 2,
    byteLength: 1,
  },
  {
    name: 'percentScale',
    type: 'uint16',
    offset: 3,
    byteLength: 2,
  },
]

export function buildQDuelSetPercentFeesInput(
  input: QDuelSetPercentFeesInput,
): ContractCall {
  return { contractIndex: Q_DUEL_CONTRACT_INDEX, inputType: Q_DUEL_SET_PERCENT_FEES_INPUT_TYPE, payload: buildPayload(Q_DUEL_SET_PERCENT_FEES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const Q_DUEL_SET_TTL_HOURS_INPUT_TYPE = 4

export interface QDuelSetTTLHoursInput {
  ttlHours: number
}

const Q_DUEL_SET_TTL_HOURS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'ttlHours',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildQDuelSetTTLHoursInput(
  input: QDuelSetTTLHoursInput,
): ContractCall {
  return { contractIndex: Q_DUEL_CONTRACT_INDEX, inputType: Q_DUEL_SET_TTL_HOURS_INPUT_TYPE, payload: buildPayload(Q_DUEL_SET_TTL_HOURS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const Q_DUEL_DEPOSIT_INPUT_TYPE = 5

export const Q_DUEL_WITHDRAW_INPUT_TYPE = 6

export interface QDuelWithdrawInput {
  amount: bigint
}

const Q_DUEL_WITHDRAW_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQDuelWithdrawInput(
  input: QDuelWithdrawInput,
): ContractCall {
  return { contractIndex: Q_DUEL_CONTRACT_INDEX, inputType: Q_DUEL_WITHDRAW_INPUT_TYPE, payload: buildPayload(Q_DUEL_WITHDRAW_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const Q_DUEL_CLOSE_ROOM_INPUT_TYPE = 7

export const Q_DUEL_GET_PERCENT_FEES_INPUT_TYPE = 1
export const Q_DUEL_GET_PERCENT_FEES_INPUT_SIZE = 0

export interface QDuelGetPercentFeesOutput {
  devFeePercentBps: number
  burnFeePercentBps: number
  shareholdersFeePercentBps: number
  percentScale: number
}

const Q_DUEL_GET_PERCENT_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'devFeePercentBps',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'burnFeePercentBps',
    type: 'uint8',
    offset: 1,
    byteLength: 1,
  },
  {
    name: 'shareholdersFeePercentBps',
    type: 'uint8',
    offset: 2,
    byteLength: 1,
  },
  {
    name: 'percentScale',
    type: 'uint16',
    offset: 3,
    byteLength: 2,
  },
]

export function decodeQDuelGetPercentFeesOutput(
  data: Uint8Array,
): QDuelGetPercentFeesOutput {
  return decodePayload(data, Q_DUEL_GET_PERCENT_FEES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QDuelGetPercentFeesOutput
}

export async function qDuelGetPercentFees(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QDuelGetPercentFeesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_DUEL_CONTRACT_INDEX,
    inputType: Q_DUEL_GET_PERCENT_FEES_INPUT_TYPE,
    inputSize: Q_DUEL_GET_PERCENT_FEES_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_DUEL_GET_PERCENT_FEES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_DUEL_GET_ROOMS_INPUT_TYPE = 2
export const Q_DUEL_GET_ROOMS_INPUT_SIZE = 0

export interface QDuelGetRoomsOutput {
  rooms: number[]
}

const Q_DUEL_GET_ROOMS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'rooms',
    type: 'array',
    offset: 0,
    byteLength: 61440,
    arrayLength: 512,
    arrayItemByteLength: 120,
    arrayItemStructRef: 'RoomInfo',
  },
]

export function decodeQDuelGetRoomsOutput(
  data: Uint8Array,
): QDuelGetRoomsOutput {
  return decodePayload(data, Q_DUEL_GET_ROOMS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QDuelGetRoomsOutput
}

export async function qDuelGetRooms(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QDuelGetRoomsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_DUEL_CONTRACT_INDEX,
    inputType: Q_DUEL_GET_ROOMS_INPUT_TYPE,
    inputSize: Q_DUEL_GET_ROOMS_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_DUEL_GET_ROOMS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_DUEL_GET_TTL_HOURS_INPUT_TYPE = 3
export const Q_DUEL_GET_TTL_HOURS_INPUT_SIZE = 0

export interface QDuelGetTTLHoursOutput {
  ttlHours: number
}

const Q_DUEL_GET_TTL_HOURS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'ttlHours',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQDuelGetTTLHoursOutput(
  data: Uint8Array,
): QDuelGetTTLHoursOutput {
  return decodePayload(data, Q_DUEL_GET_TTL_HOURS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QDuelGetTTLHoursOutput
}

export async function qDuelGetTTLHours(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QDuelGetTTLHoursOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_DUEL_CONTRACT_INDEX,
    inputType: Q_DUEL_GET_TTL_HOURS_INPUT_TYPE,
    inputSize: Q_DUEL_GET_TTL_HOURS_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_DUEL_GET_TTL_HOURS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_DUEL_GET_USER_PROFILE_INPUT_TYPE = 4
export const Q_DUEL_GET_USER_PROFILE_INPUT_SIZE = 32

export interface QDuelGetUserProfileInput {
  userId: string
}

const Q_DUEL_GET_USER_PROFILE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'userId',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQDuelGetUserProfileInput(
  input: QDuelGetUserProfileInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(Q_DUEL_GET_USER_PROFILE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QDuelGetUserProfileOutput {
  roomId: string
  depositedAmount: bigint
  locked: bigint
  stake: bigint
  raiseStep: bigint
  maxStake: bigint
}

const Q_DUEL_GET_USER_PROFILE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'roomId',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'depositedAmount',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'locked',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'stake',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'raiseStep',
    type: 'uint64',
    offset: 56,
    byteLength: 8,
  },
  {
    name: 'maxStake',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
]

export function decodeQDuelGetUserProfileOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QDuelGetUserProfileOutput {
  return decodePayload(data, Q_DUEL_GET_USER_PROFILE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QDuelGetUserProfileOutput
}

export async function qDuelGetUserProfile(
  live: SmartContractCaller,
  input: QDuelGetUserProfileInput,
  options?: ContractCallOptions,
): Promise<Result<QDuelGetUserProfileOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_DUEL_CONTRACT_INDEX,
    inputType: Q_DUEL_GET_USER_PROFILE_INPUT_TYPE,
    inputSize: Q_DUEL_GET_USER_PROFILE_INPUT_SIZE,
    inputFields: Q_DUEL_GET_USER_PROFILE_INPUT_FIELDS,
    outputFields: Q_DUEL_GET_USER_PROFILE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_DUEL_CALCULATE_REVENUE_INPUT_TYPE = 5
export const Q_DUEL_CALCULATE_REVENUE_INPUT_SIZE = 8

export interface QDuelCalculateRevenueInput {
  amount: bigint
}

const Q_DUEL_CALCULATE_REVENUE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQDuelCalculateRevenueInput(
  input: QDuelCalculateRevenueInput,
): Uint8Array {
  return buildPayload(Q_DUEL_CALCULATE_REVENUE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QDuelCalculateRevenueOutput {
  devFee: bigint
  burnFee: bigint
  shareholdersFee: bigint
  winner: bigint
}

const Q_DUEL_CALCULATE_REVENUE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'devFee',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'burnFee',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'shareholdersFee',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'winner',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
]

export function decodeQDuelCalculateRevenueOutput(
  data: Uint8Array,
): QDuelCalculateRevenueOutput {
  return decodePayload(data, Q_DUEL_CALCULATE_REVENUE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QDuelCalculateRevenueOutput
}

export async function qDuelCalculateRevenue(
  live: SmartContractCaller,
  input: QDuelCalculateRevenueInput,
  options?: ContractCallOptions,
): Promise<Result<QDuelCalculateRevenueOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_DUEL_CONTRACT_INDEX,
    inputType: Q_DUEL_CALCULATE_REVENUE_INPUT_TYPE,
    inputSize: Q_DUEL_CALCULATE_REVENUE_INPUT_SIZE,
    inputFields: Q_DUEL_CALCULATE_REVENUE_INPUT_FIELDS,
    outputFields: Q_DUEL_CALCULATE_REVENUE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_DUEL_GET_LAST_WINNERS_INPUT_TYPE = 6
export const Q_DUEL_GET_LAST_WINNERS_INPUT_SIZE = 0

export interface QDuelGetLastWinnersOutput {
  winners: number[]
}

const Q_DUEL_GET_LAST_WINNERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'winners',
    type: 'array',
    offset: 0,
    byteLength: 13312,
    arrayLength: 128,
    arrayItemByteLength: 104,
    arrayItemStructRef: 'WinnerData',
  },
]

export function decodeQDuelGetLastWinnersOutput(
  data: Uint8Array,
): QDuelGetLastWinnersOutput {
  return decodePayload(data, Q_DUEL_GET_LAST_WINNERS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QDuelGetLastWinnersOutput
}

export async function qDuelGetLastWinners(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QDuelGetLastWinnersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_DUEL_CONTRACT_INDEX,
    inputType: Q_DUEL_GET_LAST_WINNERS_INPUT_TYPE,
    inputSize: Q_DUEL_GET_LAST_WINNERS_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_DUEL_GET_LAST_WINNERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const qDuel = {
  contractIndex: Q_DUEL_CONTRACT_INDEX,
  GetPercentFees: qDuelGetPercentFees,
  GetRooms: qDuelGetRooms,
  GetTTLHours: qDuelGetTTLHours,
  GetUserProfile: qDuelGetUserProfile,
  CalculateRevenue: qDuelCalculateRevenue,
  GetLastWinners: qDuelGetLastWinners,
  buildCreateRoomInput: buildQDuelCreateRoomInput,
  buildConnectToRoomInput: buildQDuelConnectToRoomInput,
  decodeConnectToRoomOutput: decodeQDuelConnectToRoomOutput,
  buildSetPercentFeesInput: buildQDuelSetPercentFeesInput,
  buildSetTTLHoursInput: buildQDuelSetTTLHoursInput,
  buildWithdrawInput: buildQDuelWithdrawInput,
}

