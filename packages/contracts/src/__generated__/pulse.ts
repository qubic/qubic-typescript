// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

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
  Ticket: {
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
  WinnerInfo: {
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
  AutoParticipant: {
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

export const PULSE_BUY_TICKET_INPUT_TYPE = 2
export const PULSE_BUY_TICKET_INPUT_SIZE = 0
export const PULSE_BUY_TICKET_OUTPUT_SIZE = 1

export interface PulseBuyTicketInput {
  digits: number[]
}

export const PULSE_BUY_TICKET_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_BUY_TICKET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseBuyTicketOutput {
  returnCode: number
}

export const PULSE_BUY_TICKET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseBuyTicketOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseBuyTicketOutput {
  return decodePayload(
    data,
    PULSE_BUY_TICKET_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseBuyTicketOutput
}

export const PULSE_BUY_RANDOM_TICKETS_INPUT_TYPE = 7
export const PULSE_BUY_RANDOM_TICKETS_INPUT_SIZE = 2
export const PULSE_BUY_RANDOM_TICKETS_OUTPUT_SIZE = 1

export interface PulseBuyRandomTicketsInput {
  count: number
}

export const PULSE_BUY_RANDOM_TICKETS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'count',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildPulseBuyRandomTicketsInput(
  input: PulseBuyRandomTicketsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_BUY_RANDOM_TICKETS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseBuyRandomTicketsOutput {
  returnCode: number
}

export const PULSE_BUY_RANDOM_TICKETS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseBuyRandomTicketsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseBuyRandomTicketsOutput {
  return decodePayload(
    data,
    PULSE_BUY_RANDOM_TICKETS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseBuyRandomTicketsOutput
}

export const PULSE_DEPOSIT_AUTO_PARTICIPATION_INPUT_TYPE = 11
export const PULSE_DEPOSIT_AUTO_PARTICIPATION_INPUT_SIZE = 10
export const PULSE_DEPOSIT_AUTO_PARTICIPATION_OUTPUT_SIZE = 1

export interface PulseDepositAutoParticipationInput {
  amount: bigint
  desiredTickets: number
}

export const PULSE_DEPOSIT_AUTO_PARTICIPATION_INPUT_FIELDS: BinaryField[] = [
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
]

export function buildPulseDepositAutoParticipationInput(
  input: PulseDepositAutoParticipationInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_DEPOSIT_AUTO_PARTICIPATION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseDepositAutoParticipationOutput {
  returnCode: number
}

export const PULSE_DEPOSIT_AUTO_PARTICIPATION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseDepositAutoParticipationOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseDepositAutoParticipationOutput {
  return decodePayload(
    data,
    PULSE_DEPOSIT_AUTO_PARTICIPATION_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseDepositAutoParticipationOutput
}

export const PULSE_WITHDRAW_AUTO_PARTICIPATION_INPUT_TYPE = 12
export const PULSE_WITHDRAW_AUTO_PARTICIPATION_INPUT_SIZE = 8
export const PULSE_WITHDRAW_AUTO_PARTICIPATION_OUTPUT_SIZE = 1

export interface PulseWithdrawAutoParticipationInput {
  amount: bigint
}

export const PULSE_WITHDRAW_AUTO_PARTICIPATION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildPulseWithdrawAutoParticipationInput(
  input: PulseWithdrawAutoParticipationInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_WITHDRAW_AUTO_PARTICIPATION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseWithdrawAutoParticipationOutput {
  returnCode: number
}

export const PULSE_WITHDRAW_AUTO_PARTICIPATION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseWithdrawAutoParticipationOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseWithdrawAutoParticipationOutput {
  return decodePayload(
    data,
    PULSE_WITHDRAW_AUTO_PARTICIPATION_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseWithdrawAutoParticipationOutput
}

export const PULSE_SET_AUTO_CONFIG_INPUT_TYPE = 13
export const PULSE_SET_AUTO_CONFIG_INPUT_SIZE = 2
export const PULSE_SET_AUTO_CONFIG_OUTPUT_SIZE = 1

export interface PulseSetAutoConfigInput {
  desiredTickets: number
}

export const PULSE_SET_AUTO_CONFIG_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'desiredTickets',
    type: 'sint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildPulseSetAutoConfigInput(
  input: PulseSetAutoConfigInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_SET_AUTO_CONFIG_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseSetAutoConfigOutput {
  returnCode: number
}

export const PULSE_SET_AUTO_CONFIG_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseSetAutoConfigOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseSetAutoConfigOutput {
  return decodePayload(
    data,
    PULSE_SET_AUTO_CONFIG_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseSetAutoConfigOutput
}

export const PULSE_SET_AUTO_LIMITS_INPUT_TYPE = 14
export const PULSE_SET_AUTO_LIMITS_INPUT_SIZE = 2
export const PULSE_SET_AUTO_LIMITS_OUTPUT_SIZE = 1

export interface PulseSetAutoLimitsInput {
  maxTicketsPerUser: number
}

export const PULSE_SET_AUTO_LIMITS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'maxTicketsPerUser',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildPulseSetAutoLimitsInput(
  input: PulseSetAutoLimitsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_SET_AUTO_LIMITS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseSetAutoLimitsOutput {
  returnCode: number
}

export const PULSE_SET_AUTO_LIMITS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseSetAutoLimitsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseSetAutoLimitsOutput {
  return decodePayload(
    data,
    PULSE_SET_AUTO_LIMITS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseSetAutoLimitsOutput
}

export const PULSE_DEPOSIT_MANAGED_Q_HEART_INPUT_TYPE = 15
export const PULSE_DEPOSIT_MANAGED_Q_HEART_INPUT_SIZE = 8
export const PULSE_DEPOSIT_MANAGED_Q_HEART_OUTPUT_SIZE = 1

export interface PulseDepositManagedQHeartInput {
  amount: bigint
}

export const PULSE_DEPOSIT_MANAGED_Q_HEART_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildPulseDepositManagedQHeartInput(
  input: PulseDepositManagedQHeartInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_DEPOSIT_MANAGED_Q_HEART_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseDepositManagedQHeartOutput {
  returnCode: number
}

export const PULSE_DEPOSIT_MANAGED_Q_HEART_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseDepositManagedQHeartOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseDepositManagedQHeartOutput {
  return decodePayload(
    data,
    PULSE_DEPOSIT_MANAGED_Q_HEART_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseDepositManagedQHeartOutput
}

export const PULSE_TRANSFER_TOKEN_TO_QX_INPUT_TYPE = 16
export const PULSE_TRANSFER_TOKEN_TO_QX_INPUT_SIZE = 8
export const PULSE_TRANSFER_TOKEN_TO_QX_OUTPUT_SIZE = 1

export interface PulseTransferTokenToQxInput {
  numberOfShares: bigint
}

export const PULSE_TRANSFER_TOKEN_TO_QX_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildPulseTransferTokenToQxInput(
  input: PulseTransferTokenToQxInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_TRANSFER_TOKEN_TO_QX_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseTransferTokenToQxOutput {
  returnCode: number
}

export const PULSE_TRANSFER_TOKEN_TO_QX_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseTransferTokenToQxOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseTransferTokenToQxOutput {
  return decodePayload(
    data,
    PULSE_TRANSFER_TOKEN_TO_QX_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseTransferTokenToQxOutput
}

export const PULSE_SET_PRICE_INPUT_TYPE = 29
export const PULSE_SET_PRICE_INPUT_SIZE = 8
export const PULSE_SET_PRICE_OUTPUT_SIZE = 1

export interface PulseSetPriceInput {
  newPrice: bigint
}

export const PULSE_SET_PRICE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildPulseSetPriceInput(
  input: PulseSetPriceInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_SET_PRICE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseSetPriceOutput {
  returnCode: number
}

export const PULSE_SET_PRICE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseSetPriceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseSetPriceOutput {
  return decodePayload(
    data,
    PULSE_SET_PRICE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseSetPriceOutput
}

export const PULSE_SET_SCHEDULE_INPUT_TYPE = 30
export const PULSE_SET_SCHEDULE_INPUT_SIZE = 1
export const PULSE_SET_SCHEDULE_OUTPUT_SIZE = 1

export interface PulseSetScheduleInput {
  newSchedule: number
}

export const PULSE_SET_SCHEDULE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newSchedule',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildPulseSetScheduleInput(
  input: PulseSetScheduleInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_SET_SCHEDULE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseSetScheduleOutput {
  returnCode: number
}

export const PULSE_SET_SCHEDULE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseSetScheduleOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseSetScheduleOutput {
  return decodePayload(
    data,
    PULSE_SET_SCHEDULE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseSetScheduleOutput
}

export const PULSE_SET_DRAW_HOUR_INPUT_TYPE = 31
export const PULSE_SET_DRAW_HOUR_INPUT_SIZE = 1
export const PULSE_SET_DRAW_HOUR_OUTPUT_SIZE = 1

export interface PulseSetDrawHourInput {
  newDrawHour: number
}

export const PULSE_SET_DRAW_HOUR_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newDrawHour',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildPulseSetDrawHourInput(
  input: PulseSetDrawHourInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_SET_DRAW_HOUR_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseSetDrawHourOutput {
  returnCode: number
}

export const PULSE_SET_DRAW_HOUR_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseSetDrawHourOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseSetDrawHourOutput {
  return decodePayload(
    data,
    PULSE_SET_DRAW_HOUR_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseSetDrawHourOutput
}

export const PULSE_SET_FEES_INPUT_TYPE = 32
export const PULSE_SET_FEES_INPUT_SIZE = 4
export const PULSE_SET_FEES_OUTPUT_SIZE = 1

export interface PulseSetFeesInput {
  devPercent: number
  burnPercent: number
  shareholdersPercent: number
  rlShareholdersPercent: number
}

export const PULSE_SET_FEES_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_SET_FEES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseSetFeesOutput {
  returnCode: number
}

export const PULSE_SET_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseSetFeesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseSetFeesOutput {
  return decodePayload(
    data,
    PULSE_SET_FEES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseSetFeesOutput
}

export const PULSE_SET_Q_HEART_HOLD_LIMIT_INPUT_TYPE = 33
export const PULSE_SET_Q_HEART_HOLD_LIMIT_INPUT_SIZE = 8
export const PULSE_SET_Q_HEART_HOLD_LIMIT_OUTPUT_SIZE = 1

export interface PulseSetQHeartHoldLimitInput {
  newQHeartHoldLimit: bigint
}

export const PULSE_SET_Q_HEART_HOLD_LIMIT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newQHeartHoldLimit',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildPulseSetQHeartHoldLimitInput(
  input: PulseSetQHeartHoldLimitInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_SET_Q_HEART_HOLD_LIMIT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseSetQHeartHoldLimitOutput {
  returnCode: number
}

export const PULSE_SET_Q_HEART_HOLD_LIMIT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodePulseSetQHeartHoldLimitOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseSetQHeartHoldLimitOutput {
  return decodePayload(
    data,
    PULSE_SET_Q_HEART_HOLD_LIMIT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseSetQHeartHoldLimitOutput
}

export const PULSE_VALIDATE_DIGITS_INPUT_TYPE = 1
export const PULSE_VALIDATE_DIGITS_INPUT_SIZE = 0
export const PULSE_VALIDATE_DIGITS_OUTPUT_SIZE = 0

export interface PulseValidateDigitsInput {
  digits: number[]
}

export const PULSE_VALIDATE_DIGITS_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_VALIDATE_DIGITS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const PULSE_GET_AUTO_PARTICIPATION_INPUT_TYPE = 9
export const PULSE_GET_AUTO_PARTICIPATION_INPUT_SIZE = 32
export const PULSE_GET_AUTO_PARTICIPATION_OUTPUT_SIZE = 11

export interface PulseGetAutoParticipationInput {
  player: string
}

export const PULSE_GET_AUTO_PARTICIPATION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'player',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildPulseGetAutoParticipationInput(
  input: PulseGetAutoParticipationInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_GET_AUTO_PARTICIPATION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseGetAutoParticipationOutput {
  deposit: bigint
  desiredTickets: number
  returnCode: number
}

export const PULSE_GET_AUTO_PARTICIPATION_OUTPUT_FIELDS: BinaryField[] = [
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
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 10,
    byteLength: 1,
  },
]

export function decodePulseGetAutoParticipationOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetAutoParticipationOutput {
  return decodePayload(
    data,
    PULSE_GET_AUTO_PARTICIPATION_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetAutoParticipationOutput
}

export const PULSE_GET_AUTO_STATS_INPUT_TYPE = 10
export const PULSE_GET_AUTO_STATS_INPUT_SIZE = 0
export const PULSE_GET_AUTO_STATS_OUTPUT_SIZE = 7

export interface PulseGetAutoStatsOutput {
  participants: number[]
  maxAutoParticipants: number
  maxAutoTicketsPerUser: number
  roundSlotsLeft: number
  returnCode: number
}

export const PULSE_GET_AUTO_STATS_OUTPUT_FIELDS: BinaryField[] = [
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
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 6,
    byteLength: 1,
  },
]

export function decodePulseGetAutoStatsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetAutoStatsOutput {
  return decodePayload(
    data,
    PULSE_GET_AUTO_STATS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetAutoStatsOutput
}

export const PULSE_GET_TICKET_PRICE_INPUT_TYPE = 17
export const PULSE_GET_TICKET_PRICE_INPUT_SIZE = 0
export const PULSE_GET_TICKET_PRICE_OUTPUT_SIZE = 8

export interface PulseGetTicketPriceOutput {
  ticketPrice: bigint
}

export const PULSE_GET_TICKET_PRICE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'ticketPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodePulseGetTicketPriceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetTicketPriceOutput {
  return decodePayload(
    data,
    PULSE_GET_TICKET_PRICE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetTicketPriceOutput
}

export const PULSE_GET_PLAYER_BALANCE_INPUT_TYPE = 18
export const PULSE_GET_PLAYER_BALANCE_INPUT_SIZE = 32
export const PULSE_GET_PLAYER_BALANCE_OUTPUT_SIZE = 9

export interface PulseGetPlayerBalanceInput {
  player: string
}

export const PULSE_GET_PLAYER_BALANCE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'player',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildPulseGetPlayerBalanceInput(
  input: PulseGetPlayerBalanceInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(PULSE_GET_PLAYER_BALANCE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface PulseGetPlayerBalanceOutput {
  balance: bigint
  returnCode: number
}

export const PULSE_GET_PLAYER_BALANCE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'balance',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 8,
    byteLength: 1,
  },
]

export function decodePulseGetPlayerBalanceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetPlayerBalanceOutput {
  return decodePayload(
    data,
    PULSE_GET_PLAYER_BALANCE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetPlayerBalanceOutput
}

export const PULSE_GET_FEES_INPUT_TYPE = 19
export const PULSE_GET_FEES_INPUT_SIZE = 0
export const PULSE_GET_FEES_OUTPUT_SIZE = 5

export interface PulseGetFeesOutput {
  devPercent: number
  burnPercent: number
  shareholdersPercent: number
  rlShareholdersPercent: number
  returnCode: number
}

export const PULSE_GET_FEES_OUTPUT_FIELDS: BinaryField[] = [
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
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 4,
    byteLength: 1,
  },
]

export function decodePulseGetFeesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetFeesOutput {
  return decodePayload(
    data,
    PULSE_GET_FEES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetFeesOutput
}

export const PULSE_GET_Q_HEART_HOLD_LIMIT_INPUT_TYPE = 20
export const PULSE_GET_Q_HEART_HOLD_LIMIT_INPUT_SIZE = 0
export const PULSE_GET_Q_HEART_HOLD_LIMIT_OUTPUT_SIZE = 8

export interface PulseGetQHeartHoldLimitOutput {
  qheartHoldLimit: bigint
}

export const PULSE_GET_Q_HEART_HOLD_LIMIT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'qheartHoldLimit',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodePulseGetQHeartHoldLimitOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetQHeartHoldLimitOutput {
  return decodePayload(
    data,
    PULSE_GET_Q_HEART_HOLD_LIMIT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetQHeartHoldLimitOutput
}

export const PULSE_GET_Q_HEART_WALLET_INPUT_TYPE = 21
export const PULSE_GET_Q_HEART_WALLET_INPUT_SIZE = 0
export const PULSE_GET_Q_HEART_WALLET_OUTPUT_SIZE = 32

export interface PulseGetQHeartWalletOutput {
  wallet: string
}

export const PULSE_GET_Q_HEART_WALLET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'wallet',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function decodePulseGetQHeartWalletOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetQHeartWalletOutput {
  return decodePayload(
    data,
    PULSE_GET_Q_HEART_WALLET_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetQHeartWalletOutput
}

export const PULSE_GET_WINNING_DIGITS_INPUT_TYPE = 22
export const PULSE_GET_WINNING_DIGITS_INPUT_SIZE = 0
export const PULSE_GET_WINNING_DIGITS_OUTPUT_SIZE = 0

export interface PulseGetWinningDigitsOutput {
  digits: number[]
}

export const PULSE_GET_WINNING_DIGITS_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetWinningDigitsOutput {
  return decodePayload(
    data,
    PULSE_GET_WINNING_DIGITS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetWinningDigitsOutput
}

export const PULSE_GET_BALANCE_INPUT_TYPE = 23
export const PULSE_GET_BALANCE_INPUT_SIZE = 0
export const PULSE_GET_BALANCE_OUTPUT_SIZE = 8

export interface PulseGetBalanceOutput {
  balance: bigint
}

export const PULSE_GET_BALANCE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'balance',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodePulseGetBalanceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetBalanceOutput {
  return decodePayload(
    data,
    PULSE_GET_BALANCE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetBalanceOutput
}

export const PULSE_GET_PLAYERS_INPUT_TYPE = 24
export const PULSE_GET_PLAYERS_INPUT_SIZE = 0
export const PULSE_GET_PLAYERS_OUTPUT_SIZE = 32769

export interface PulseGetPlayersOutput {
  players: number[]
  returnCode: number
}

export const PULSE_GET_PLAYERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'players',
    type: 'array',
    offset: 0,
    byteLength: 32768,
    arrayLength: 1024,
    arrayItemByteLength: 32,
    arrayItemStructRef: 'Ticket',
  },
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 32768,
    byteLength: 1,
  },
]

export function decodePulseGetPlayersOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetPlayersOutput {
  return decodePayload(
    data,
    PULSE_GET_PLAYERS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetPlayersOutput
}

export const PULSE_GET_PRIZE_TABLE_INPUT_TYPE = 25
export const PULSE_GET_PRIZE_TABLE_INPUT_SIZE = 0
export const PULSE_GET_PRIZE_TABLE_OUTPUT_SIZE = 9

export interface PulseGetPrizeTableOutput {
  leftAlignedRewards: bigint[]
  anyPositionRewards: bigint[]
  ticketPrice: bigint
  returnCode: number
}

export const PULSE_GET_PRIZE_TABLE_OUTPUT_FIELDS: BinaryField[] = [
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
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 8,
    byteLength: 1,
  },
]

export function decodePulseGetPrizeTableOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetPrizeTableOutput {
  return decodePayload(
    data,
    PULSE_GET_PRIZE_TABLE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetPrizeTableOutput
}

export const PULSE_GET_ROUND_STATE_INPUT_TYPE = 26
export const PULSE_GET_ROUND_STATE_INPUT_SIZE = 0
export const PULSE_GET_ROUND_STATE_OUTPUT_SIZE = 18

export interface PulseGetRoundStateOutput {
  epoch: number
  lastDrawDateStamp: number
  ticketCounter: number
  maxPlayers: number
  slotsLeft: number
  currentState: number
  drawHour: number
  schedule: number
  returnCode: number
}

export const PULSE_GET_ROUND_STATE_OUTPUT_FIELDS: BinaryField[] = [
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
    name: 'returnCode',
    type: 'uint8',
    offset: 17,
    byteLength: 1,
  },
]

export function decodePulseGetRoundStateOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetRoundStateOutput {
  return decodePayload(
    data,
    PULSE_GET_ROUND_STATE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetRoundStateOutput
}

export const PULSE_GET_WINNERS_INPUT_TYPE = 28
export const PULSE_GET_WINNERS_INPUT_SIZE = 0
export const PULSE_GET_WINNERS_OUTPUT_SIZE = 43017

export interface PulseGetWinnersOutput {
  winners: number[]
  winnersCounter: bigint
  returnCode: number
}

export const PULSE_GET_WINNERS_OUTPUT_FIELDS: BinaryField[] = [
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
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 43016,
    byteLength: 1,
  },
]

export function decodePulseGetWinnersOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): PulseGetWinnersOutput {
  return decodePayload(
    data,
    PULSE_GET_WINNERS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as PulseGetWinnersOutput
}

