// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const RANDOM_LOTTERY_CONTRACT_INDEX = 16

export interface RandomLotteryWinnerInfoStruct {
  winnerAddress: string
  revenue: bigint
  tick: number
  epoch: number
  dayOfWeek: number
}

export interface RandomLotteryNextEpochDataStruct {
  newPrice: bigint
  schedule: number
}

const STRUCTS: Record<string, NamedStruct> = {
  WinnerInfo: {
  name: 'WinnerInfo',
  byteLength: 47,
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
      name: 'tick',
      type: 'uint32',
      offset: 40,
      byteLength: 4,
    },
    {
      name: 'epoch',
      type: 'uint16',
      offset: 44,
      byteLength: 2,
    },
    {
      name: 'dayOfWeek',
      type: 'uint8',
      offset: 46,
      byteLength: 1,
    },
],
},
  NextEpochData: {
  name: 'NextEpochData',
  byteLength: 9,
  fields: [
    {
      name: 'newPrice',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'schedule',
      type: 'uint8',
      offset: 8,
      byteLength: 1,
    },
],
},
}

export const RANDOM_LOTTERY_BUY_TICKET_INPUT_TYPE = 1
export const RANDOM_LOTTERY_BUY_TICKET_INPUT_SIZE = 0
export const RANDOM_LOTTERY_BUY_TICKET_OUTPUT_SIZE = 1

export interface RandomLotteryBuyTicketOutput {
  returnCode: number
}

export const RANDOM_LOTTERY_BUY_TICKET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeRandomLotteryBuyTicketOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotteryBuyTicketOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_BUY_TICKET_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotteryBuyTicketOutput
}

export const RANDOM_LOTTERY_SET_PRICE_INPUT_TYPE = 11
export const RANDOM_LOTTERY_SET_PRICE_INPUT_SIZE = 8
export const RANDOM_LOTTERY_SET_PRICE_OUTPUT_SIZE = 1

export interface RandomLotterySetPriceInput {
  newPrice: bigint
}

export const RANDOM_LOTTERY_SET_PRICE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildRandomLotterySetPriceInput(
  input: RandomLotterySetPriceInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(RANDOM_LOTTERY_SET_PRICE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface RandomLotterySetPriceOutput {
  returnCode: number
}

export const RANDOM_LOTTERY_SET_PRICE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeRandomLotterySetPriceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotterySetPriceOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_SET_PRICE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotterySetPriceOutput
}

export const RANDOM_LOTTERY_SET_SCHEDULE_INPUT_TYPE = 12
export const RANDOM_LOTTERY_SET_SCHEDULE_INPUT_SIZE = 1
export const RANDOM_LOTTERY_SET_SCHEDULE_OUTPUT_SIZE = 1

export interface RandomLotterySetScheduleInput {
  newSchedule: number
}

export const RANDOM_LOTTERY_SET_SCHEDULE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newSchedule',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildRandomLotterySetScheduleInput(
  input: RandomLotterySetScheduleInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(RANDOM_LOTTERY_SET_SCHEDULE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface RandomLotterySetScheduleOutput {
  returnCode: number
}

export const RANDOM_LOTTERY_SET_SCHEDULE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeRandomLotterySetScheduleOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotterySetScheduleOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_SET_SCHEDULE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotterySetScheduleOutput
}

export const RANDOM_LOTTERY_GET_FEES_INPUT_TYPE = 2
export const RANDOM_LOTTERY_GET_FEES_INPUT_SIZE = 0
export const RANDOM_LOTTERY_GET_FEES_OUTPUT_SIZE = 5

export interface RandomLotteryGetFeesOutput {
  teamFeePercent: number
  distributionFeePercent: number
  winnerFeePercent: number
  burnPercent: number
  returnCode: number
}

export const RANDOM_LOTTERY_GET_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'teamFeePercent',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'distributionFeePercent',
    type: 'uint8',
    offset: 1,
    byteLength: 1,
  },
  {
    name: 'winnerFeePercent',
    type: 'uint8',
    offset: 2,
    byteLength: 1,
  },
  {
    name: 'burnPercent',
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

export function decodeRandomLotteryGetFeesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotteryGetFeesOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_GET_FEES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotteryGetFeesOutput
}

export const RANDOM_LOTTERY_GET_PLAYERS_INPUT_TYPE = 3
export const RANDOM_LOTTERY_GET_PLAYERS_INPUT_SIZE = 0
export const RANDOM_LOTTERY_GET_PLAYERS_OUTPUT_SIZE = 32777

export interface RandomLotteryGetPlayersOutput {
  players: string[]
  playerCounter: bigint
  returnCode: number
}

export const RANDOM_LOTTERY_GET_PLAYERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'players',
    type: 'array',
    offset: 0,
    byteLength: 32768,
    arrayLength: 1024,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
  {
    name: 'playerCounter',
    type: 'uint64',
    offset: 32768,
    byteLength: 8,
  },
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 32776,
    byteLength: 1,
  },
]

export function decodeRandomLotteryGetPlayersOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotteryGetPlayersOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_GET_PLAYERS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotteryGetPlayersOutput
}

export const RANDOM_LOTTERY_GET_WINNERS_INPUT_TYPE = 5
export const RANDOM_LOTTERY_GET_WINNERS_INPUT_SIZE = 0
export const RANDOM_LOTTERY_GET_WINNERS_OUTPUT_SIZE = 48137

export interface RandomLotteryGetWinnersOutput {
  winners: number[]
  winnersCounter: bigint
  returnCode: number
}

export const RANDOM_LOTTERY_GET_WINNERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'winners',
    type: 'array',
    offset: 0,
    byteLength: 48128,
    arrayLength: 1024,
    arrayItemByteLength: 47,
    arrayItemStructRef: 'WinnerInfo',
  },
  {
    name: 'winnersCounter',
    type: 'uint64',
    offset: 48128,
    byteLength: 8,
  },
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 48136,
    byteLength: 1,
  },
]

export function decodeRandomLotteryGetWinnersOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotteryGetWinnersOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_GET_WINNERS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotteryGetWinnersOutput
}

export const RANDOM_LOTTERY_GET_TICKET_PRICE_INPUT_TYPE = 6
export const RANDOM_LOTTERY_GET_TICKET_PRICE_INPUT_SIZE = 0
export const RANDOM_LOTTERY_GET_TICKET_PRICE_OUTPUT_SIZE = 8

export interface RandomLotteryGetTicketPriceOutput {
  ticketPrice: bigint
}

export const RANDOM_LOTTERY_GET_TICKET_PRICE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'ticketPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeRandomLotteryGetTicketPriceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotteryGetTicketPriceOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_GET_TICKET_PRICE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotteryGetTicketPriceOutput
}

export const RANDOM_LOTTERY_GET_MAX_NUMBER_OF_PLAYERS_INPUT_TYPE = 7
export const RANDOM_LOTTERY_GET_MAX_NUMBER_OF_PLAYERS_INPUT_SIZE = 0
export const RANDOM_LOTTERY_GET_MAX_NUMBER_OF_PLAYERS_OUTPUT_SIZE = 8

export interface RandomLotteryGetMaxNumberOfPlayersOutput {
  numberOfPlayers: bigint
}

export const RANDOM_LOTTERY_GET_MAX_NUMBER_OF_PLAYERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfPlayers',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeRandomLotteryGetMaxNumberOfPlayersOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotteryGetMaxNumberOfPlayersOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_GET_MAX_NUMBER_OF_PLAYERS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotteryGetMaxNumberOfPlayersOutput
}

export const RANDOM_LOTTERY_GET_STATE_INPUT_TYPE = 8
export const RANDOM_LOTTERY_GET_STATE_INPUT_SIZE = 0
export const RANDOM_LOTTERY_GET_STATE_OUTPUT_SIZE = 1

export interface RandomLotteryGetStateOutput {
  currentState: number
}

export const RANDOM_LOTTERY_GET_STATE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'currentState',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeRandomLotteryGetStateOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotteryGetStateOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_GET_STATE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotteryGetStateOutput
}

export const RANDOM_LOTTERY_GET_BALANCE_INPUT_TYPE = 9
export const RANDOM_LOTTERY_GET_BALANCE_INPUT_SIZE = 0
export const RANDOM_LOTTERY_GET_BALANCE_OUTPUT_SIZE = 8

export interface RandomLotteryGetBalanceOutput {
  balance: bigint
}

export const RANDOM_LOTTERY_GET_BALANCE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'balance',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeRandomLotteryGetBalanceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotteryGetBalanceOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_GET_BALANCE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotteryGetBalanceOutput
}

export const RANDOM_LOTTERY_GET_NEXT_EPOCH_DATA_INPUT_TYPE = 13
export const RANDOM_LOTTERY_GET_NEXT_EPOCH_DATA_INPUT_SIZE = 0
export const RANDOM_LOTTERY_GET_NEXT_EPOCH_DATA_OUTPUT_SIZE = 9

export interface RandomLotteryGetNextEpochDataOutput {
  nextEpochData: RandomLotteryNextEpochDataStruct
}

export const RANDOM_LOTTERY_GET_NEXT_EPOCH_DATA_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'nextEpochData',
    type: 'struct',
    offset: 0,
    byteLength: 9,
    structRef: 'NextEpochData',
  },
]

export function decodeRandomLotteryGetNextEpochDataOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotteryGetNextEpochDataOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_GET_NEXT_EPOCH_DATA_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotteryGetNextEpochDataOutput
}

export const RANDOM_LOTTERY_GET_DRAW_HOUR_INPUT_TYPE = 14
export const RANDOM_LOTTERY_GET_DRAW_HOUR_INPUT_SIZE = 0
export const RANDOM_LOTTERY_GET_DRAW_HOUR_OUTPUT_SIZE = 1

export interface RandomLotteryGetDrawHourOutput {
  drawHour: number
}

export const RANDOM_LOTTERY_GET_DRAW_HOUR_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'drawHour',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeRandomLotteryGetDrawHourOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotteryGetDrawHourOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_GET_DRAW_HOUR_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotteryGetDrawHourOutput
}

export const RANDOM_LOTTERY_GET_SCHEDULE_INPUT_TYPE = 15
export const RANDOM_LOTTERY_GET_SCHEDULE_INPUT_SIZE = 0
export const RANDOM_LOTTERY_GET_SCHEDULE_OUTPUT_SIZE = 1

export interface RandomLotteryGetScheduleOutput {
  schedule: number
}

export const RANDOM_LOTTERY_GET_SCHEDULE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'schedule',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeRandomLotteryGetScheduleOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): RandomLotteryGetScheduleOutput {
  return decodePayload(
    data,
    RANDOM_LOTTERY_GET_SCHEDULE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as RandomLotteryGetScheduleOutput
}

