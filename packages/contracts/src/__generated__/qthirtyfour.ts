// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '../result.js'

export const Q_THIRTY_FOUR_CONTRACT_INDEX = 22

export interface QThirtyFourNextEpochDataStruct {
  newTicketPrice: bigint
  newTargetJackpot: bigint
  newSchedule: number
  newDrawHour: number
}

export interface QThirtyFourWinnerDataStruct {
  winners: number[]
  winnerValues: number[]
  winnerCounter: bigint
  epoch: number
}

export interface QThirtyFourPoolsSnapshotStruct {
  jackpot: bigint
  reserve: bigint
  targetJackpot: bigint
  frActive: number
  roundsSinceK4: number
}

export interface QThirtyFourPlayerDataStruct {
  player: string
  randomValues: number[]
}

export interface QThirtyFourWinningCombinationStruct {
  values: number[]
}

export interface QThirtyFourWinnerPlayerDataStruct {
  player: string
  randomValues: number[]
  wonAmount: number
}

const STRUCTS: Record<string, NamedStruct> = {
  'NextEpochData': {
  name: 'NextEpochData',
  byteLength: 18,
  fields: [
    {
      name: 'newTicketPrice',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'newTargetJackpot',
      type: 'uint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'newSchedule',
      type: 'uint8',
      offset: 16,
      byteLength: 1,
    },
    {
      name: 'newDrawHour',
      type: 'uint8',
      offset: 17,
      byteLength: 1,
    },
],
},
  'WinnerData': {
  name: 'WinnerData',
  byteLength: 40974,
  fields: [
    {
      name: 'winners',
      type: 'array',
      offset: 0,
      byteLength: 40960,
      arrayLength: 1024,
      arrayItemByteLength: 40,
      arrayItemStructRef: 'WinnerPlayerData',
    },
    {
      name: 'winnerValues',
      type: 'array',
      offset: 40960,
      byteLength: 4,
      arrayLength: 4,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'winnerCounter',
      type: 'uint64',
      offset: 40964,
      byteLength: 8,
    },
    {
      name: 'epoch',
      type: 'uint16',
      offset: 40972,
      byteLength: 2,
    },
],
},
  'PoolsSnapshot': {
  name: 'PoolsSnapshot',
  byteLength: 27,
  fields: [
    {
      name: 'jackpot',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'reserve',
      type: 'uint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'targetJackpot',
      type: 'uint64',
      offset: 16,
      byteLength: 8,
    },
    {
      name: 'frActive',
      type: 'uint8',
      offset: 24,
      byteLength: 1,
    },
    {
      name: 'roundsSinceK4',
      type: 'uint16',
      offset: 25,
      byteLength: 2,
    },
],
},
  'PlayerData': {
  name: 'PlayerData',
  byteLength: 36,
  fields: [
    {
      name: 'player',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'randomValues',
      type: 'array',
      offset: 32,
      byteLength: 4,
      arrayLength: 4,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
],
},
  'WinningCombination': {
  name: 'WinningCombination',
  byteLength: 4,
  fields: [
    {
      name: 'values',
      type: 'array',
      offset: 0,
      byteLength: 4,
      arrayLength: 4,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
],
},
  'WinnerPlayerData': {
  name: 'WinnerPlayerData',
  byteLength: 40,
  fields: [
    {
      name: 'player',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'randomValues',
      type: 'array',
      offset: 32,
      byteLength: 4,
      arrayLength: 4,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'wonAmount',
      type: 'uint32',
      offset: 36,
      byteLength: 4,
    },
],
},
}

export const Q_THIRTY_FOUR_BUY_TICKET_INPUT_TYPE = 6

export interface QThirtyFourBuyTicketInput {
  randomValues: number[]
}

const Q_THIRTY_FOUR_BUY_TICKET_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'randomValues',
    type: 'array',
    offset: 0,
    byteLength: 4,
    arrayLength: 4,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQThirtyFourBuyTicketInput(
  input: QThirtyFourBuyTicketInput,
): ContractCall {
  return { contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX, inputType: Q_THIRTY_FOUR_BUY_TICKET_INPUT_TYPE, payload: buildPayload(Q_THIRTY_FOUR_BUY_TICKET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QThirtyFourBuyTicketOutput {
  returnCode: number
}

const Q_THIRTY_FOUR_BUY_TICKET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourBuyTicketOutput(
  data: Uint8Array,
): QThirtyFourBuyTicketOutput {
  return decodePayload(data, Q_THIRTY_FOUR_BUY_TICKET_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourBuyTicketOutput
}

export const Q_THIRTY_FOUR_BUY_TICKETS_BATCH_INPUT_TYPE = 7

export interface QThirtyFourBuyTicketsBatchInput {
  tickets: number[]
}

const Q_THIRTY_FOUR_BUY_TICKETS_BATCH_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'tickets',
    type: 'array',
    offset: 0,
    byteLength: 0,
    arrayLength: 0,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQThirtyFourBuyTicketsBatchInput(
  input: QThirtyFourBuyTicketsBatchInput,
): ContractCall {
  return { contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX, inputType: Q_THIRTY_FOUR_BUY_TICKETS_BATCH_INPUT_TYPE, payload: buildPayload(Q_THIRTY_FOUR_BUY_TICKETS_BATCH_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QThirtyFourBuyTicketsBatchOutput {
  boughtTicketCount: number
  returnCode: number
}

const Q_THIRTY_FOUR_BUY_TICKETS_BATCH_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'boughtTicketCount',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 2,
    byteLength: 1,
  },
]

export function decodeQThirtyFourBuyTicketsBatchOutput(
  data: Uint8Array,
): QThirtyFourBuyTicketsBatchOutput {
  return decodePayload(data, Q_THIRTY_FOUR_BUY_TICKETS_BATCH_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourBuyTicketsBatchOutput
}

export const Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_INPUT_TYPE = 8

export interface QThirtyFourBuyTicketsBySelectionInput {
  numbers: number[]
}

const Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'numbers',
    type: 'array',
    offset: 0,
    byteLength: 0,
    arrayLength: 0,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQThirtyFourBuyTicketsBySelectionInput(
  input: QThirtyFourBuyTicketsBySelectionInput,
): ContractCall {
  return { contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX, inputType: Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_INPUT_TYPE, payload: buildPayload(Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QThirtyFourBuyTicketsBySelectionOutput {
  requestedTicketCount: number
  boughtTicketCount: number
  returnCode: number
}

const Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'requestedTicketCount',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
  {
    name: 'boughtTicketCount',
    type: 'uint16',
    offset: 2,
    byteLength: 2,
  },
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 4,
    byteLength: 1,
  },
]

export function decodeQThirtyFourBuyTicketsBySelectionOutput(
  data: Uint8Array,
): QThirtyFourBuyTicketsBySelectionOutput {
  return decodePayload(data, Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourBuyTicketsBySelectionOutput
}

export const Q_THIRTY_FOUR_SET_PRICE_INPUT_TYPE = 9

export interface QThirtyFourSetPriceInput {
  newPrice: bigint
}

const Q_THIRTY_FOUR_SET_PRICE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQThirtyFourSetPriceInput(
  input: QThirtyFourSetPriceInput,
): ContractCall {
  return { contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX, inputType: Q_THIRTY_FOUR_SET_PRICE_INPUT_TYPE, payload: buildPayload(Q_THIRTY_FOUR_SET_PRICE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QThirtyFourSetPriceOutput {
  returnCode: number
}

const Q_THIRTY_FOUR_SET_PRICE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourSetPriceOutput(
  data: Uint8Array,
): QThirtyFourSetPriceOutput {
  return decodePayload(data, Q_THIRTY_FOUR_SET_PRICE_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourSetPriceOutput
}

export const Q_THIRTY_FOUR_SET_SCHEDULE_INPUT_TYPE = 10

export interface QThirtyFourSetScheduleInput {
  newSchedule: number
}

const Q_THIRTY_FOUR_SET_SCHEDULE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newSchedule',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildQThirtyFourSetScheduleInput(
  input: QThirtyFourSetScheduleInput,
): ContractCall {
  return { contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX, inputType: Q_THIRTY_FOUR_SET_SCHEDULE_INPUT_TYPE, payload: buildPayload(Q_THIRTY_FOUR_SET_SCHEDULE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QThirtyFourSetScheduleOutput {
  returnCode: number
}

const Q_THIRTY_FOUR_SET_SCHEDULE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourSetScheduleOutput(
  data: Uint8Array,
): QThirtyFourSetScheduleOutput {
  return decodePayload(data, Q_THIRTY_FOUR_SET_SCHEDULE_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourSetScheduleOutput
}

export const Q_THIRTY_FOUR_SET_DRAW_HOUR_INPUT_TYPE = 11

export interface QThirtyFourSetDrawHourInput {
  newDrawHour: number
}

const Q_THIRTY_FOUR_SET_DRAW_HOUR_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newDrawHour',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildQThirtyFourSetDrawHourInput(
  input: QThirtyFourSetDrawHourInput,
): ContractCall {
  return { contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX, inputType: Q_THIRTY_FOUR_SET_DRAW_HOUR_INPUT_TYPE, payload: buildPayload(Q_THIRTY_FOUR_SET_DRAW_HOUR_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QThirtyFourSetDrawHourOutput {
  returnCode: number
}

const Q_THIRTY_FOUR_SET_DRAW_HOUR_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourSetDrawHourOutput(
  data: Uint8Array,
): QThirtyFourSetDrawHourOutput {
  return decodePayload(data, Q_THIRTY_FOUR_SET_DRAW_HOUR_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourSetDrawHourOutput
}

export const Q_THIRTY_FOUR_SET_TARGET_JACKPOT_INPUT_TYPE = 12

export interface QThirtyFourSetTargetJackpotInput {
  newTargetJackpot: bigint
}

const Q_THIRTY_FOUR_SET_TARGET_JACKPOT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newTargetJackpot',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQThirtyFourSetTargetJackpotInput(
  input: QThirtyFourSetTargetJackpotInput,
): ContractCall {
  return { contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX, inputType: Q_THIRTY_FOUR_SET_TARGET_JACKPOT_INPUT_TYPE, payload: buildPayload(Q_THIRTY_FOUR_SET_TARGET_JACKPOT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QThirtyFourSetTargetJackpotOutput {
  returnCode: number
}

const Q_THIRTY_FOUR_SET_TARGET_JACKPOT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourSetTargetJackpotOutput(
  data: Uint8Array,
): QThirtyFourSetTargetJackpotOutput {
  return decodePayload(data, Q_THIRTY_FOUR_SET_TARGET_JACKPOT_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourSetTargetJackpotOutput
}

export const Q_THIRTY_FOUR_SYNC_JACKPOT_INPUT_TYPE = 37

export interface QThirtyFourSyncJackpotOutput {
  returnCode: number
}

const Q_THIRTY_FOUR_SYNC_JACKPOT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourSyncJackpotOutput(
  data: Uint8Array,
): QThirtyFourSyncJackpotOutput {
  return decodePayload(data, Q_THIRTY_FOUR_SYNC_JACKPOT_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourSyncJackpotOutput
}

export const Q_THIRTY_FOUR_GET_TICKET_PRICE_INPUT_TYPE = 22
export const Q_THIRTY_FOUR_GET_TICKET_PRICE_INPUT_SIZE = 0

export interface QThirtyFourGetTicketPriceOutput {
  ticketPrice: bigint
}

const Q_THIRTY_FOUR_GET_TICKET_PRICE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'ticketPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQThirtyFourGetTicketPriceOutput(
  data: Uint8Array,
): QThirtyFourGetTicketPriceOutput {
  return decodePayload(data, Q_THIRTY_FOUR_GET_TICKET_PRICE_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourGetTicketPriceOutput
}

export async function qThirtyFourGetTicketPrice(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QThirtyFourGetTicketPriceOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
    inputType: Q_THIRTY_FOUR_GET_TICKET_PRICE_INPUT_TYPE,
    inputSize: Q_THIRTY_FOUR_GET_TICKET_PRICE_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_THIRTY_FOUR_GET_TICKET_PRICE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_INPUT_TYPE = 23
export const Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_INPUT_SIZE = 0

export interface QThirtyFourGetNextEpochDataOutput {
  nextEpochData: QThirtyFourNextEpochDataStruct
}

const Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'nextEpochData',
    type: 'struct',
    offset: 0,
    byteLength: 18,
    structRef: 'NextEpochData',
  },
]

export function decodeQThirtyFourGetNextEpochDataOutput(
  data: Uint8Array,
): QThirtyFourGetNextEpochDataOutput {
  return decodePayload(data, Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourGetNextEpochDataOutput
}

export async function qThirtyFourGetNextEpochData(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QThirtyFourGetNextEpochDataOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
    inputType: Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_INPUT_TYPE,
    inputSize: Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_THIRTY_FOUR_GET_SCHEDULE_INPUT_TYPE = 24
export const Q_THIRTY_FOUR_GET_SCHEDULE_INPUT_SIZE = 0

export interface QThirtyFourGetScheduleOutput {
  schedule: number
}

const Q_THIRTY_FOUR_GET_SCHEDULE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'schedule',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourGetScheduleOutput(
  data: Uint8Array,
): QThirtyFourGetScheduleOutput {
  return decodePayload(data, Q_THIRTY_FOUR_GET_SCHEDULE_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourGetScheduleOutput
}

export async function qThirtyFourGetSchedule(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QThirtyFourGetScheduleOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
    inputType: Q_THIRTY_FOUR_GET_SCHEDULE_INPUT_TYPE,
    inputSize: Q_THIRTY_FOUR_GET_SCHEDULE_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_THIRTY_FOUR_GET_SCHEDULE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_THIRTY_FOUR_GET_WINNER_DATA_INPUT_TYPE = 25
export const Q_THIRTY_FOUR_GET_WINNER_DATA_INPUT_SIZE = 0

export interface QThirtyFourGetWinnerDataOutput {
  winnerData: QThirtyFourWinnerDataStruct
}

const Q_THIRTY_FOUR_GET_WINNER_DATA_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'winnerData',
    type: 'struct',
    offset: 0,
    byteLength: 40974,
    structRef: 'WinnerData',
  },
]

export function decodeQThirtyFourGetWinnerDataOutput(
  data: Uint8Array,
): QThirtyFourGetWinnerDataOutput {
  return decodePayload(data, Q_THIRTY_FOUR_GET_WINNER_DATA_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourGetWinnerDataOutput
}

export async function qThirtyFourGetWinnerData(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QThirtyFourGetWinnerDataOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
    inputType: Q_THIRTY_FOUR_GET_WINNER_DATA_INPUT_TYPE,
    inputSize: Q_THIRTY_FOUR_GET_WINNER_DATA_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_THIRTY_FOUR_GET_WINNER_DATA_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_THIRTY_FOUR_GET_POOLS_INPUT_TYPE = 26
export const Q_THIRTY_FOUR_GET_POOLS_INPUT_SIZE = 0

export interface QThirtyFourGetPoolsOutput {
  pools: QThirtyFourPoolsSnapshotStruct
}

const Q_THIRTY_FOUR_GET_POOLS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'pools',
    type: 'struct',
    offset: 0,
    byteLength: 27,
    structRef: 'PoolsSnapshot',
  },
]

export function decodeQThirtyFourGetPoolsOutput(
  data: Uint8Array,
): QThirtyFourGetPoolsOutput {
  return decodePayload(data, Q_THIRTY_FOUR_GET_POOLS_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourGetPoolsOutput
}

export async function qThirtyFourGetPools(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QThirtyFourGetPoolsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
    inputType: Q_THIRTY_FOUR_GET_POOLS_INPUT_TYPE,
    inputSize: Q_THIRTY_FOUR_GET_POOLS_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_THIRTY_FOUR_GET_POOLS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_THIRTY_FOUR_GET_DRAW_HOUR_INPUT_TYPE = 27
export const Q_THIRTY_FOUR_GET_DRAW_HOUR_INPUT_SIZE = 0

export interface QThirtyFourGetDrawHourOutput {
  drawHour: number
}

const Q_THIRTY_FOUR_GET_DRAW_HOUR_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'drawHour',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourGetDrawHourOutput(
  data: Uint8Array,
): QThirtyFourGetDrawHourOutput {
  return decodePayload(data, Q_THIRTY_FOUR_GET_DRAW_HOUR_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourGetDrawHourOutput
}

export async function qThirtyFourGetDrawHour(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QThirtyFourGetDrawHourOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
    inputType: Q_THIRTY_FOUR_GET_DRAW_HOUR_INPUT_TYPE,
    inputSize: Q_THIRTY_FOUR_GET_DRAW_HOUR_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_THIRTY_FOUR_GET_DRAW_HOUR_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_THIRTY_FOUR_GET_STATE_INPUT_TYPE = 28
export const Q_THIRTY_FOUR_GET_STATE_INPUT_SIZE = 0

export interface QThirtyFourGetStateOutput {
  currentState: number
}

const Q_THIRTY_FOUR_GET_STATE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'currentState',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourGetStateOutput(
  data: Uint8Array,
): QThirtyFourGetStateOutput {
  return decodePayload(data, Q_THIRTY_FOUR_GET_STATE_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourGetStateOutput
}

export async function qThirtyFourGetState(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QThirtyFourGetStateOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
    inputType: Q_THIRTY_FOUR_GET_STATE_INPUT_TYPE,
    inputSize: Q_THIRTY_FOUR_GET_STATE_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_THIRTY_FOUR_GET_STATE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_THIRTY_FOUR_GET_FEES_INPUT_TYPE = 31
export const Q_THIRTY_FOUR_GET_FEES_INPUT_SIZE = 0

export interface QThirtyFourGetFeesOutput {
  teamFeePercent: number
  distributionFeePercent: number
  winnerFeePercent: number
  burnPercent: number
  returnCode: number
}

const Q_THIRTY_FOUR_GET_FEES_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeQThirtyFourGetFeesOutput(
  data: Uint8Array,
): QThirtyFourGetFeesOutput {
  return decodePayload(data, Q_THIRTY_FOUR_GET_FEES_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourGetFeesOutput
}

export async function qThirtyFourGetFees(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QThirtyFourGetFeesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
    inputType: Q_THIRTY_FOUR_GET_FEES_INPUT_TYPE,
    inputSize: Q_THIRTY_FOUR_GET_FEES_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_THIRTY_FOUR_GET_FEES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_INPUT_TYPE = 34
export const Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_INPUT_SIZE = 16

export interface QThirtyFourEstimatePrizePayoutsInput {
  k2WinnerCount: bigint
  k3WinnerCount: bigint
}

const Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'k2WinnerCount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'k3WinnerCount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildQThirtyFourEstimatePrizePayoutsInput(
  input: QThirtyFourEstimatePrizePayoutsInput,
): Uint8Array {
  return buildPayload(Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QThirtyFourEstimatePrizePayoutsOutput {
  k2PayoutPerWinner: bigint
  k3PayoutPerWinner: bigint
  k2MinFloor: bigint
  k3MinFloor: bigint
  perWinnerCap: bigint
  totalRevenue: bigint
  k2Pool: bigint
  k3Pool: bigint
}

const Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'k2PayoutPerWinner',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'k3PayoutPerWinner',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'k2MinFloor',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'k3MinFloor',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'perWinnerCap',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'totalRevenue',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'k2Pool',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'k3Pool',
    type: 'uint64',
    offset: 56,
    byteLength: 8,
  },
]

export function decodeQThirtyFourEstimatePrizePayoutsOutput(
  data: Uint8Array,
): QThirtyFourEstimatePrizePayoutsOutput {
  return decodePayload(data, Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourEstimatePrizePayoutsOutput
}

export async function qThirtyFourEstimatePrizePayouts(
  live: SmartContractCaller,
  input: QThirtyFourEstimatePrizePayoutsInput,
  options?: ContractCallOptions,
): Promise<Result<QThirtyFourEstimatePrizePayoutsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
    inputType: Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_INPUT_TYPE,
    inputSize: Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_INPUT_SIZE,
    inputFields: Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_INPUT_FIELDS,
    outputFields: Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_THIRTY_FOUR_GET_PLAYERS_INPUT_TYPE = 35
export const Q_THIRTY_FOUR_GET_PLAYERS_INPUT_SIZE = 0

export interface QThirtyFourGetPlayersOutput {
  players: number[]
  returnCode: number
}

const Q_THIRTY_FOUR_GET_PLAYERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'players',
    type: 'array',
    offset: 0,
    byteLength: 36864,
    arrayLength: 1024,
    arrayItemByteLength: 36,
    arrayItemStructRef: 'PlayerData',
  },
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 36864,
    byteLength: 1,
  },
]

export function decodeQThirtyFourGetPlayersOutput(
  data: Uint8Array,
): QThirtyFourGetPlayersOutput {
  return decodePayload(data, Q_THIRTY_FOUR_GET_PLAYERS_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourGetPlayersOutput
}

export async function qThirtyFourGetPlayers(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QThirtyFourGetPlayersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
    inputType: Q_THIRTY_FOUR_GET_PLAYERS_INPUT_TYPE,
    inputSize: Q_THIRTY_FOUR_GET_PLAYERS_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_THIRTY_FOUR_GET_PLAYERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_INPUT_TYPE = 36
export const Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_INPUT_SIZE = 0

export interface QThirtyFourGetWinningCombinationsHistoryOutput {
  history: number[]
  returnCode: number
}

const Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'history',
    type: 'array',
    offset: 0,
    byteLength: 512,
    arrayLength: 128,
    arrayItemByteLength: 4,
    arrayItemStructRef: 'WinningCombination',
  },
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 512,
    byteLength: 1,
  },
]

export function decodeQThirtyFourGetWinningCombinationsHistoryOutput(
  data: Uint8Array,
): QThirtyFourGetWinningCombinationsHistoryOutput {
  return decodePayload(data, Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_OUTPUT_FIELDS, STRUCTS, (_pk: Uint8Array) => 'A'.repeat(60)) as unknown as QThirtyFourGetWinningCombinationsHistoryOutput
}

export async function qThirtyFourGetWinningCombinationsHistory(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QThirtyFourGetWinningCombinationsHistoryOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
    inputType: Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_INPUT_TYPE,
    inputSize: Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const qThirtyFour = {
  contractIndex: Q_THIRTY_FOUR_CONTRACT_INDEX,
  GetTicketPrice: qThirtyFourGetTicketPrice,
  GetNextEpochData: qThirtyFourGetNextEpochData,
  GetSchedule: qThirtyFourGetSchedule,
  GetWinnerData: qThirtyFourGetWinnerData,
  GetPools: qThirtyFourGetPools,
  GetDrawHour: qThirtyFourGetDrawHour,
  GetState: qThirtyFourGetState,
  GetFees: qThirtyFourGetFees,
  EstimatePrizePayouts: qThirtyFourEstimatePrizePayouts,
  GetPlayers: qThirtyFourGetPlayers,
  GetWinningCombinationsHistory: qThirtyFourGetWinningCombinationsHistory,
  buildBuyTicketInput: buildQThirtyFourBuyTicketInput,
  decodeBuyTicketOutput: decodeQThirtyFourBuyTicketOutput,
  buildBuyTicketsBatchInput: buildQThirtyFourBuyTicketsBatchInput,
  decodeBuyTicketsBatchOutput: decodeQThirtyFourBuyTicketsBatchOutput,
  buildBuyTicketsBySelectionInput: buildQThirtyFourBuyTicketsBySelectionInput,
  decodeBuyTicketsBySelectionOutput: decodeQThirtyFourBuyTicketsBySelectionOutput,
  buildSetPriceInput: buildQThirtyFourSetPriceInput,
  decodeSetPriceOutput: decodeQThirtyFourSetPriceOutput,
  buildSetScheduleInput: buildQThirtyFourSetScheduleInput,
  decodeSetScheduleOutput: decodeQThirtyFourSetScheduleOutput,
  buildSetDrawHourInput: buildQThirtyFourSetDrawHourInput,
  decodeSetDrawHourOutput: decodeQThirtyFourSetDrawHourOutput,
  buildSetTargetJackpotInput: buildQThirtyFourSetTargetJackpotInput,
  decodeSetTargetJackpotOutput: decodeQThirtyFourSetTargetJackpotOutput,
  decodeSyncJackpotOutput: decodeQThirtyFourSyncJackpotOutput,
}

