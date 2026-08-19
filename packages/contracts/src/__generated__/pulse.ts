// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '@qubic.org/types'

export const PULSE_CONTRACT_INDEX = 24

export interface PulseTicketStruct {
  player: string
  digits: number[]
}

export interface PulseWinnerInfoStruct {
  winnerAddress: string
  revenue: bigint
  epoch: number
}

export interface PulseAutoParticipantStruct {
  player: string
  deposit: bigint
  desiredTickets: number
}

const STRUCTS: Record<string, NamedStruct> = {
  'Ticket': {
  name: 'Ticket',
  byteLength: 32,
  fields: [
    {
      name: 'player',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'digits',
      type: 'array',
      offset: 32,
      byteLength: 0,
      arrayLength: 0,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
],
},
  'WinnerInfo': {
  name: 'WinnerInfo',
  byteLength: 42,
  fields: [
    {
      name: 'winnerAddress',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'revenue',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'epoch',
      type: 'uint16',
      offset: 40,
      byteLength: 2,
    },
],
},
  'AutoParticipant': {
  name: 'AutoParticipant',
  byteLength: 42,
  fields: [
    {
      name: 'player',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'deposit',
      type: 'sint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'desiredTickets',
      type: 'uint16',
      offset: 40,
      byteLength: 2,
    },
],
},
}

export const PULSE_BUY_TICKET_INPUT_TYPE = 1

export interface PulseBuyTicketInput {
  digits: number[]
}

const PULSE_BUY_TICKET_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'digits',
    type: 'array',
    offset: 0,
    byteLength: 0,
    arrayLength: 0,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildPulseBuyTicketInput(
  input: PulseBuyTicketInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_BUY_TICKET_INPUT_TYPE, payload: buildPayload(PULSE_BUY_TICKET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_SET_PRICE_INPUT_TYPE = 2

export interface PulseSetPriceInput {
  newPrice: bigint
}

const PULSE_SET_PRICE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildPulseSetPriceInput(
  input: PulseSetPriceInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_SET_PRICE_INPUT_TYPE, payload: buildPayload(PULSE_SET_PRICE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_SET_SCHEDULE_INPUT_TYPE = 3

export interface PulseSetScheduleInput {
  newSchedule: number
}

const PULSE_SET_SCHEDULE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newSchedule',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildPulseSetScheduleInput(
  input: PulseSetScheduleInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_SET_SCHEDULE_INPUT_TYPE, payload: buildPayload(PULSE_SET_SCHEDULE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_SET_DRAW_HOUR_INPUT_TYPE = 4

export interface PulseSetDrawHourInput {
  newDrawHour: number
}

const PULSE_SET_DRAW_HOUR_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newDrawHour',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildPulseSetDrawHourInput(
  input: PulseSetDrawHourInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_SET_DRAW_HOUR_INPUT_TYPE, payload: buildPayload(PULSE_SET_DRAW_HOUR_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_SET_FEES_INPUT_TYPE = 5

export interface PulseSetFeesInput {
  devPercent: number
  burnPercent: number
  shareholdersPercent: number
  rlShareholdersPercent: number
}

const PULSE_SET_FEES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'devPercent',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'burnPercent',
    type: 'uint8',
    offset: 1,
    byteLength: 1,
  },
  {
    name: 'shareholdersPercent',
    type: 'uint8',
    offset: 2,
    byteLength: 1,
  },
  {
    name: 'rlShareholdersPercent',
    type: 'uint8',
    offset: 3,
    byteLength: 1,
  },
]

export function buildPulseSetFeesInput(
  input: PulseSetFeesInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_SET_FEES_INPUT_TYPE, payload: buildPayload(PULSE_SET_FEES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_SET_Q_HEART_HOLD_LIMIT_INPUT_TYPE = 6

export interface PulseSetQHeartHoldLimitInput {
  newQHeartHoldLimit: bigint
}

const PULSE_SET_Q_HEART_HOLD_LIMIT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newQHeartHoldLimit',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildPulseSetQHeartHoldLimitInput(
  input: PulseSetQHeartHoldLimitInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_SET_Q_HEART_HOLD_LIMIT_INPUT_TYPE, payload: buildPayload(PULSE_SET_Q_HEART_HOLD_LIMIT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_BUY_RANDOM_TICKETS_INPUT_TYPE = 7

export interface PulseBuyRandomTicketsInput {
  count: number
}

const PULSE_BUY_RANDOM_TICKETS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'count',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildPulseBuyRandomTicketsInput(
  input: PulseBuyRandomTicketsInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_BUY_RANDOM_TICKETS_INPUT_TYPE, payload: buildPayload(PULSE_BUY_RANDOM_TICKETS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_DEPOSIT_AUTO_PARTICIPATION_INPUT_TYPE = 8

export interface PulseDepositAutoParticipationInput {
  amount: bigint
  desiredTickets: number
  buyNow: number
}

const PULSE_DEPOSIT_AUTO_PARTICIPATION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'desiredTickets',
    type: 'sint16',
    offset: 8,
    byteLength: 2,
  },
  {
    name: 'buyNow',
    type: 'uint8',
    offset: 10,
    byteLength: 1,
  },
]

export function buildPulseDepositAutoParticipationInput(
  input: PulseDepositAutoParticipationInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_DEPOSIT_AUTO_PARTICIPATION_INPUT_TYPE, payload: buildPayload(PULSE_DEPOSIT_AUTO_PARTICIPATION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_WITHDRAW_AUTO_PARTICIPATION_INPUT_TYPE = 9

export interface PulseWithdrawAutoParticipationInput {
  amount: bigint
}

const PULSE_WITHDRAW_AUTO_PARTICIPATION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildPulseWithdrawAutoParticipationInput(
  input: PulseWithdrawAutoParticipationInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_WITHDRAW_AUTO_PARTICIPATION_INPUT_TYPE, payload: buildPayload(PULSE_WITHDRAW_AUTO_PARTICIPATION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_SET_AUTO_CONFIG_INPUT_TYPE = 10

export interface PulseSetAutoConfigInput {
  desiredTickets: number
}

const PULSE_SET_AUTO_CONFIG_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'desiredTickets',
    type: 'sint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildPulseSetAutoConfigInput(
  input: PulseSetAutoConfigInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_SET_AUTO_CONFIG_INPUT_TYPE, payload: buildPayload(PULSE_SET_AUTO_CONFIG_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_SET_AUTO_LIMITS_INPUT_TYPE = 11

export interface PulseSetAutoLimitsInput {
  maxTicketsPerUser: number
}

const PULSE_SET_AUTO_LIMITS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'maxTicketsPerUser',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildPulseSetAutoLimitsInput(
  input: PulseSetAutoLimitsInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_SET_AUTO_LIMITS_INPUT_TYPE, payload: buildPayload(PULSE_SET_AUTO_LIMITS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 12

export interface PulseTransferShareManagementRightsInput {
  numberOfShares: bigint
  newManagingContractIndex: number
}

const PULSE_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'newManagingContractIndex',
    type: 'uint16',
    offset: 8,
    byteLength: 2,
  },
]

export function buildPulseTransferShareManagementRightsInput(
  input: PulseTransferShareManagementRightsInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE, payload: buildPayload(PULSE_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_DEPOSIT_MANAGED_Q_HEART_INPUT_TYPE = 13

export interface PulseDepositManagedQHeartInput {
  amount: bigint
}

const PULSE_DEPOSIT_MANAGED_Q_HEART_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildPulseDepositManagedQHeartInput(
  input: PulseDepositManagedQHeartInput,
): ContractCall {
  return { contractIndex: PULSE_CONTRACT_INDEX, inputType: PULSE_DEPOSIT_MANAGED_Q_HEART_INPUT_TYPE, payload: buildPayload(PULSE_DEPOSIT_MANAGED_Q_HEART_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const PULSE_GET_TICKET_PRICE_INPUT_TYPE = 1
export const PULSE_GET_TICKET_PRICE_INPUT_SIZE = 0

export interface PulseGetTicketPriceOutput {
  ticketPrice: bigint
}

const PULSE_GET_TICKET_PRICE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'ticketPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodePulseGetTicketPriceOutput(
  data: Uint8Array,
): PulseGetTicketPriceOutput {
  return decodePayload(data, PULSE_GET_TICKET_PRICE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetTicketPriceOutput
}

export async function pulseGetTicketPrice(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<PulseGetTicketPriceOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_TICKET_PRICE_INPUT_TYPE,
    inputSize: PULSE_GET_TICKET_PRICE_INPUT_SIZE,
    inputFields: [],
    outputFields: PULSE_GET_TICKET_PRICE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const PULSE_GET_PLAYER_BALANCE_INPUT_TYPE = 2
export const PULSE_GET_PLAYER_BALANCE_INPUT_SIZE = 32

export interface PulseGetPlayerBalanceInput {
  player: string
}

const PULSE_GET_PLAYER_BALANCE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'player',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildPulseGetPlayerBalanceInput(
  input: PulseGetPlayerBalanceInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(PULSE_GET_PLAYER_BALANCE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseGetPlayerBalanceOutput {
  balance: bigint
}

const PULSE_GET_PLAYER_BALANCE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'balance',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodePulseGetPlayerBalanceOutput(
  data: Uint8Array,
): PulseGetPlayerBalanceOutput {
  return decodePayload(data, PULSE_GET_PLAYER_BALANCE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetPlayerBalanceOutput
}

export async function pulseGetPlayerBalance(
  live: SmartContractCaller,
  input: PulseGetPlayerBalanceInput,
  options?: ContractCallOptions,
): Promise<Result<PulseGetPlayerBalanceOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_PLAYER_BALANCE_INPUT_TYPE,
    inputSize: PULSE_GET_PLAYER_BALANCE_INPUT_SIZE,
    inputFields: PULSE_GET_PLAYER_BALANCE_INPUT_FIELDS,
    outputFields: PULSE_GET_PLAYER_BALANCE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const PULSE_GET_ROUND_STATE_INPUT_TYPE = 3
export const PULSE_GET_ROUND_STATE_INPUT_SIZE = 0

export interface PulseGetRoundStateOutput {
  epoch: number
  lastDrawDateStamp: number
  ticketCounter: number
  maxPlayers: number
  slotsLeft: number
  currentState: number
  drawHour: number
  schedule: number
  sellingOpen: number
}

const PULSE_GET_ROUND_STATE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'lastDrawDateStamp',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
  {
    name: 'ticketCounter',
    type: 'uint16',
    offset: 8,
    byteLength: 2,
  },
  {
    name: 'maxPlayers',
    type: 'uint16',
    offset: 10,
    byteLength: 2,
  },
  {
    name: 'slotsLeft',
    type: 'uint16',
    offset: 12,
    byteLength: 2,
  },
  {
    name: 'currentState',
    type: 'uint8',
    offset: 14,
    byteLength: 1,
  },
  {
    name: 'drawHour',
    type: 'uint8',
    offset: 15,
    byteLength: 1,
  },
  {
    name: 'schedule',
    type: 'uint8',
    offset: 16,
    byteLength: 1,
  },
  {
    name: 'sellingOpen',
    type: 'uint8',
    offset: 17,
    byteLength: 1,
  },
]

export function decodePulseGetRoundStateOutput(
  data: Uint8Array,
): PulseGetRoundStateOutput {
  return decodePayload(data, PULSE_GET_ROUND_STATE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetRoundStateOutput
}

export async function pulseGetRoundState(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<PulseGetRoundStateOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_ROUND_STATE_INPUT_TYPE,
    inputSize: PULSE_GET_ROUND_STATE_INPUT_SIZE,
    inputFields: [],
    outputFields: PULSE_GET_ROUND_STATE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const PULSE_GET_FEES_INPUT_TYPE = 4
export const PULSE_GET_FEES_INPUT_SIZE = 0

export interface PulseGetFeesOutput {
  devPercent: number
  burnPercent: number
  shareholdersPercent: number
  rlShareholdersPercent: number
}

const PULSE_GET_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'devPercent',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'burnPercent',
    type: 'uint8',
    offset: 1,
    byteLength: 1,
  },
  {
    name: 'shareholdersPercent',
    type: 'uint8',
    offset: 2,
    byteLength: 1,
  },
  {
    name: 'rlShareholdersPercent',
    type: 'uint8',
    offset: 3,
    byteLength: 1,
  },
]

export function decodePulseGetFeesOutput(
  data: Uint8Array,
): PulseGetFeesOutput {
  return decodePayload(data, PULSE_GET_FEES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetFeesOutput
}

export async function pulseGetFees(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<PulseGetFeesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_FEES_INPUT_TYPE,
    inputSize: PULSE_GET_FEES_INPUT_SIZE,
    inputFields: [],
    outputFields: PULSE_GET_FEES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const PULSE_GET_Q_HEART_HOLD_LIMIT_INPUT_TYPE = 5
export const PULSE_GET_Q_HEART_HOLD_LIMIT_INPUT_SIZE = 0

export interface PulseGetQHeartHoldLimitOutput {
  qheartHoldLimit: bigint
}

const PULSE_GET_Q_HEART_HOLD_LIMIT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'qheartHoldLimit',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodePulseGetQHeartHoldLimitOutput(
  data: Uint8Array,
): PulseGetQHeartHoldLimitOutput {
  return decodePayload(data, PULSE_GET_Q_HEART_HOLD_LIMIT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetQHeartHoldLimitOutput
}

export async function pulseGetQHeartHoldLimit(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<PulseGetQHeartHoldLimitOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_Q_HEART_HOLD_LIMIT_INPUT_TYPE,
    inputSize: PULSE_GET_Q_HEART_HOLD_LIMIT_INPUT_SIZE,
    inputFields: [],
    outputFields: PULSE_GET_Q_HEART_HOLD_LIMIT_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const PULSE_GET_Q_HEART_WALLET_INPUT_TYPE = 6
export const PULSE_GET_Q_HEART_WALLET_INPUT_SIZE = 0

export interface PulseGetQHeartWalletOutput {
  wallet: string
}

const PULSE_GET_Q_HEART_WALLET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'wallet',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function decodePulseGetQHeartWalletOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): PulseGetQHeartWalletOutput {
  return decodePayload(data, PULSE_GET_Q_HEART_WALLET_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as PulseGetQHeartWalletOutput
}

export async function pulseGetQHeartWallet(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<PulseGetQHeartWalletOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_Q_HEART_WALLET_INPUT_TYPE,
    inputSize: PULSE_GET_Q_HEART_WALLET_INPUT_SIZE,
    inputFields: [],
    outputFields: PULSE_GET_Q_HEART_WALLET_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const PULSE_GET_WINNING_DIGITS_INPUT_TYPE = 7
export const PULSE_GET_WINNING_DIGITS_INPUT_SIZE = 0

export interface PulseGetWinningDigitsOutput {
  digits: number[]
}

const PULSE_GET_WINNING_DIGITS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'digits',
    type: 'array',
    offset: 0,
    byteLength: 0,
    arrayLength: 0,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function decodePulseGetWinningDigitsOutput(
  data: Uint8Array,
): PulseGetWinningDigitsOutput {
  return decodePayload(data, PULSE_GET_WINNING_DIGITS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetWinningDigitsOutput
}

export async function pulseGetWinningDigits(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<PulseGetWinningDigitsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_WINNING_DIGITS_INPUT_TYPE,
    inputSize: PULSE_GET_WINNING_DIGITS_INPUT_SIZE,
    inputFields: [],
    outputFields: PULSE_GET_WINNING_DIGITS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const PULSE_GET_BALANCE_INPUT_TYPE = 8
export const PULSE_GET_BALANCE_INPUT_SIZE = 0

export interface PulseGetBalanceOutput {
  balance: bigint
}

const PULSE_GET_BALANCE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'balance',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodePulseGetBalanceOutput(
  data: Uint8Array,
): PulseGetBalanceOutput {
  return decodePayload(data, PULSE_GET_BALANCE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetBalanceOutput
}

export async function pulseGetBalance(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<PulseGetBalanceOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_BALANCE_INPUT_TYPE,
    inputSize: PULSE_GET_BALANCE_INPUT_SIZE,
    inputFields: [],
    outputFields: PULSE_GET_BALANCE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const PULSE_GET_WINNERS_INPUT_TYPE = 9
export const PULSE_GET_WINNERS_INPUT_SIZE = 0

export interface PulseGetWinnersOutput {
  winners: number[]
  winnersCounter: bigint
}

const PULSE_GET_WINNERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'winners',
    type: 'array',
    offset: 0,
    byteLength: 43008,
    arrayLength: 1024,
    arrayItemByteLength: 42,
    arrayItemStructRef: 'WinnerInfo',
  },
  {
    name: 'winnersCounter',
    type: 'uint64',
    offset: 43008,
    byteLength: 8,
  },
]

export function decodePulseGetWinnersOutput(
  data: Uint8Array,
): PulseGetWinnersOutput {
  return decodePayload(data, PULSE_GET_WINNERS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetWinnersOutput
}

export async function pulseGetWinners(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<PulseGetWinnersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_WINNERS_INPUT_TYPE,
    inputSize: PULSE_GET_WINNERS_INPUT_SIZE,
    inputFields: [],
    outputFields: PULSE_GET_WINNERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const PULSE_GET_AUTO_PARTICIPATION_INPUT_TYPE = 10
export const PULSE_GET_AUTO_PARTICIPATION_INPUT_SIZE = 32

export interface PulseGetAutoParticipationInput {
  player: string
}

const PULSE_GET_AUTO_PARTICIPATION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'player',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildPulseGetAutoParticipationInput(
  input: PulseGetAutoParticipationInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(PULSE_GET_AUTO_PARTICIPATION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseGetAutoParticipationOutput {
  deposit: bigint
  desiredTickets: number
}

const PULSE_GET_AUTO_PARTICIPATION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'deposit',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'desiredTickets',
    type: 'uint16',
    offset: 8,
    byteLength: 2,
  },
]

export function decodePulseGetAutoParticipationOutput(
  data: Uint8Array,
): PulseGetAutoParticipationOutput {
  return decodePayload(data, PULSE_GET_AUTO_PARTICIPATION_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetAutoParticipationOutput
}

export async function pulseGetAutoParticipation(
  live: SmartContractCaller,
  input: PulseGetAutoParticipationInput,
  options?: ContractCallOptions,
): Promise<Result<PulseGetAutoParticipationOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_AUTO_PARTICIPATION_INPUT_TYPE,
    inputSize: PULSE_GET_AUTO_PARTICIPATION_INPUT_SIZE,
    inputFields: PULSE_GET_AUTO_PARTICIPATION_INPUT_FIELDS,
    outputFields: PULSE_GET_AUTO_PARTICIPATION_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const PULSE_GET_AUTO_STATS_INPUT_TYPE = 11
export const PULSE_GET_AUTO_STATS_INPUT_SIZE = 0

export interface PulseGetAutoStatsOutput {
  participants: number[]
  maxAutoParticipants: number
  maxAutoTicketsPerUser: number
  roundSlotsLeft: number
}

const PULSE_GET_AUTO_STATS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'participants',
    type: 'array',
    offset: 0,
    byteLength: 0,
    arrayLength: 0,
    arrayItemByteLength: 42,
    arrayItemStructRef: 'AutoParticipant',
  },
  {
    name: 'maxAutoParticipants',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
  {
    name: 'maxAutoTicketsPerUser',
    type: 'uint16',
    offset: 2,
    byteLength: 2,
  },
  {
    name: 'roundSlotsLeft',
    type: 'uint16',
    offset: 4,
    byteLength: 2,
  },
]

export function decodePulseGetAutoStatsOutput(
  data: Uint8Array,
): PulseGetAutoStatsOutput {
  return decodePayload(data, PULSE_GET_AUTO_STATS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetAutoStatsOutput
}

export async function pulseGetAutoStats(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<PulseGetAutoStatsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_AUTO_STATS_INPUT_TYPE,
    inputSize: PULSE_GET_AUTO_STATS_INPUT_SIZE,
    inputFields: [],
    outputFields: PULSE_GET_AUTO_STATS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const PULSE_VALIDATE_DIGITS_INPUT_TYPE = 12
export const PULSE_VALIDATE_DIGITS_INPUT_SIZE = 0

export interface PulseValidateDigitsInput {
  digits: number[]
}

const PULSE_VALIDATE_DIGITS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'digits',
    type: 'array',
    offset: 0,
    byteLength: 0,
    arrayLength: 0,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildPulseValidateDigitsInput(
  input: PulseValidateDigitsInput,
): Uint8Array {
  return buildPayload(PULSE_VALIDATE_DIGITS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface PulseValidateDigitsOutput {
  isValid: number
}

const PULSE_VALIDATE_DIGITS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'isValid',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseValidateDigitsOutput(
  data: Uint8Array,
): PulseValidateDigitsOutput {
  return decodePayload(data, PULSE_VALIDATE_DIGITS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseValidateDigitsOutput
}

export async function pulseValidateDigits(
  live: SmartContractCaller,
  input: PulseValidateDigitsInput,
  options?: ContractCallOptions,
): Promise<Result<PulseValidateDigitsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_VALIDATE_DIGITS_INPUT_TYPE,
    inputSize: PULSE_VALIDATE_DIGITS_INPUT_SIZE,
    inputFields: PULSE_VALIDATE_DIGITS_INPUT_FIELDS,
    outputFields: PULSE_VALIDATE_DIGITS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const PULSE_GET_PLAYERS_INPUT_TYPE = 13
export const PULSE_GET_PLAYERS_INPUT_SIZE = 0

export interface PulseGetPlayersOutput {
  players: number[]
}

const PULSE_GET_PLAYERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'players',
    type: 'array',
    offset: 0,
    byteLength: 32768,
    arrayLength: 1024,
    arrayItemByteLength: 32,
    arrayItemStructRef: 'Ticket',
  },
]

export function decodePulseGetPlayersOutput(
  data: Uint8Array,
): PulseGetPlayersOutput {
  return decodePayload(data, PULSE_GET_PLAYERS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetPlayersOutput
}

export async function pulseGetPlayers(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<PulseGetPlayersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_PLAYERS_INPUT_TYPE,
    inputSize: PULSE_GET_PLAYERS_INPUT_SIZE,
    inputFields: [],
    outputFields: PULSE_GET_PLAYERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const PULSE_GET_PRIZE_TABLE_INPUT_TYPE = 14
export const PULSE_GET_PRIZE_TABLE_INPUT_SIZE = 0

export interface PulseGetPrizeTableOutput {
  leftAlignedRewards: bigint[]
  anyPositionRewards: bigint[]
  ticketPrice: bigint
}

const PULSE_GET_PRIZE_TABLE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'leftAlignedRewards',
    type: 'array',
    offset: 0,
    byteLength: 0,
    arrayLength: 0,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'anyPositionRewards',
    type: 'array',
    offset: 0,
    byteLength: 0,
    arrayLength: 0,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'ticketPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodePulseGetPrizeTableOutput(
  data: Uint8Array,
): PulseGetPrizeTableOutput {
  return decodePayload(data, PULSE_GET_PRIZE_TABLE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as PulseGetPrizeTableOutput
}

export async function pulseGetPrizeTable(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<PulseGetPrizeTableOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: PULSE_CONTRACT_INDEX,
    inputType: PULSE_GET_PRIZE_TABLE_INPUT_TYPE,
    inputSize: PULSE_GET_PRIZE_TABLE_INPUT_SIZE,
    inputFields: [],
    outputFields: PULSE_GET_PRIZE_TABLE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const pulse = {
  contractIndex: PULSE_CONTRACT_INDEX,
  GetTicketPrice: pulseGetTicketPrice,
  GetPlayerBalance: pulseGetPlayerBalance,
  GetRoundState: pulseGetRoundState,
  GetFees: pulseGetFees,
  GetQHeartHoldLimit: pulseGetQHeartHoldLimit,
  GetQHeartWallet: pulseGetQHeartWallet,
  GetWinningDigits: pulseGetWinningDigits,
  GetBalance: pulseGetBalance,
  GetWinners: pulseGetWinners,
  GetAutoParticipation: pulseGetAutoParticipation,
  GetAutoStats: pulseGetAutoStats,
  ValidateDigits: pulseValidateDigits,
  GetPlayers: pulseGetPlayers,
  GetPrizeTable: pulseGetPrizeTable,
  buildBuyTicketInput: buildPulseBuyTicketInput,
  buildSetPriceInput: buildPulseSetPriceInput,
  buildSetScheduleInput: buildPulseSetScheduleInput,
  buildSetDrawHourInput: buildPulseSetDrawHourInput,
  buildSetFeesInput: buildPulseSetFeesInput,
  buildSetQHeartHoldLimitInput: buildPulseSetQHeartHoldLimitInput,
  buildBuyRandomTicketsInput: buildPulseBuyRandomTicketsInput,
  buildDepositAutoParticipationInput: buildPulseDepositAutoParticipationInput,
  buildWithdrawAutoParticipationInput: buildPulseWithdrawAutoParticipationInput,
  buildSetAutoConfigInput: buildPulseSetAutoConfigInput,
  buildSetAutoLimitsInput: buildPulseSetAutoLimitsInput,
  buildTransferShareManagementRightsInput: buildPulseTransferShareManagementRightsInput,
  buildDepositManagedQHeartInput: buildPulseDepositManagedQHeartInput,
}

