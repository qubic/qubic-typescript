// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

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

const STRUCTS: Record<string, NamedStruct> = {
  NextEpochData: {
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
  WinnerData: {
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
  PoolsSnapshot: {
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
  PlayerData: {
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
}

export const Q_THIRTY_FOUR_BUY_TICKET_INPUT_TYPE = 6
export const Q_THIRTY_FOUR_BUY_TICKET_INPUT_SIZE = 4
export const Q_THIRTY_FOUR_BUY_TICKET_OUTPUT_SIZE = 1

export interface QThirtyFourBuyTicketInput {
  randomValues: number[]
}

export const Q_THIRTY_FOUR_BUY_TICKET_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_THIRTY_FOUR_BUY_TICKET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QThirtyFourBuyTicketOutput {
  returnCode: number
}

export const Q_THIRTY_FOUR_BUY_TICKET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourBuyTicketOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourBuyTicketOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_BUY_TICKET_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourBuyTicketOutput
}

export const Q_THIRTY_FOUR_BUY_TICKETS_BATCH_INPUT_TYPE = 7
export const Q_THIRTY_FOUR_BUY_TICKETS_BATCH_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_BUY_TICKETS_BATCH_OUTPUT_SIZE = 3

export interface QThirtyFourBuyTicketsBatchInput {
  tickets: number[]
}

export const Q_THIRTY_FOUR_BUY_TICKETS_BATCH_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_THIRTY_FOUR_BUY_TICKETS_BATCH_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QThirtyFourBuyTicketsBatchOutput {
  boughtTicketCount: number
  returnCode: number
}

export const Q_THIRTY_FOUR_BUY_TICKETS_BATCH_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourBuyTicketsBatchOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_BUY_TICKETS_BATCH_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourBuyTicketsBatchOutput
}

export const Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_INPUT_TYPE = 8
export const Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_OUTPUT_SIZE = 5

export interface QThirtyFourBuyTicketsBySelectionInput {
  numbers: number[]
}

export const Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QThirtyFourBuyTicketsBySelectionOutput {
  requestedTicketCount: number
  boughtTicketCount: number
  returnCode: number
}

export const Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourBuyTicketsBySelectionOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_BUY_TICKETS_BY_SELECTION_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourBuyTicketsBySelectionOutput
}

export const Q_THIRTY_FOUR_SET_PRICE_INPUT_TYPE = 9
export const Q_THIRTY_FOUR_SET_PRICE_INPUT_SIZE = 8
export const Q_THIRTY_FOUR_SET_PRICE_OUTPUT_SIZE = 1

export interface QThirtyFourSetPriceInput {
  newPrice: bigint
}

export const Q_THIRTY_FOUR_SET_PRICE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQThirtyFourSetPriceInput(
  input: QThirtyFourSetPriceInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_THIRTY_FOUR_SET_PRICE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QThirtyFourSetPriceOutput {
  returnCode: number
}

export const Q_THIRTY_FOUR_SET_PRICE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourSetPriceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourSetPriceOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_SET_PRICE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourSetPriceOutput
}

export const Q_THIRTY_FOUR_SET_SCHEDULE_INPUT_TYPE = 10
export const Q_THIRTY_FOUR_SET_SCHEDULE_INPUT_SIZE = 1
export const Q_THIRTY_FOUR_SET_SCHEDULE_OUTPUT_SIZE = 1

export interface QThirtyFourSetScheduleInput {
  newSchedule: number
}

export const Q_THIRTY_FOUR_SET_SCHEDULE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newSchedule',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildQThirtyFourSetScheduleInput(
  input: QThirtyFourSetScheduleInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_THIRTY_FOUR_SET_SCHEDULE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QThirtyFourSetScheduleOutput {
  returnCode: number
}

export const Q_THIRTY_FOUR_SET_SCHEDULE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourSetScheduleOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourSetScheduleOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_SET_SCHEDULE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourSetScheduleOutput
}

export const Q_THIRTY_FOUR_SET_DRAW_HOUR_INPUT_TYPE = 11
export const Q_THIRTY_FOUR_SET_DRAW_HOUR_INPUT_SIZE = 1
export const Q_THIRTY_FOUR_SET_DRAW_HOUR_OUTPUT_SIZE = 1

export interface QThirtyFourSetDrawHourInput {
  newDrawHour: number
}

export const Q_THIRTY_FOUR_SET_DRAW_HOUR_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newDrawHour',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildQThirtyFourSetDrawHourInput(
  input: QThirtyFourSetDrawHourInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_THIRTY_FOUR_SET_DRAW_HOUR_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QThirtyFourSetDrawHourOutput {
  returnCode: number
}

export const Q_THIRTY_FOUR_SET_DRAW_HOUR_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourSetDrawHourOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourSetDrawHourOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_SET_DRAW_HOUR_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourSetDrawHourOutput
}

export const Q_THIRTY_FOUR_SET_TARGET_JACKPOT_INPUT_TYPE = 12
export const Q_THIRTY_FOUR_SET_TARGET_JACKPOT_INPUT_SIZE = 8
export const Q_THIRTY_FOUR_SET_TARGET_JACKPOT_OUTPUT_SIZE = 1

export interface QThirtyFourSetTargetJackpotInput {
  newTargetJackpot: bigint
}

export const Q_THIRTY_FOUR_SET_TARGET_JACKPOT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newTargetJackpot',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQThirtyFourSetTargetJackpotInput(
  input: QThirtyFourSetTargetJackpotInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_THIRTY_FOUR_SET_TARGET_JACKPOT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QThirtyFourSetTargetJackpotOutput {
  returnCode: number
}

export const Q_THIRTY_FOUR_SET_TARGET_JACKPOT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourSetTargetJackpotOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourSetTargetJackpotOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_SET_TARGET_JACKPOT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourSetTargetJackpotOutput
}

export const Q_THIRTY_FOUR_SYNC_JACKPOT_INPUT_TYPE = 37
export const Q_THIRTY_FOUR_SYNC_JACKPOT_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_SYNC_JACKPOT_OUTPUT_SIZE = 1

export interface QThirtyFourSyncJackpotOutput {
  returnCode: number
}

export const Q_THIRTY_FOUR_SYNC_JACKPOT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourSyncJackpotOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourSyncJackpotOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_SYNC_JACKPOT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourSyncJackpotOutput
}

export const Q_THIRTY_FOUR_GET_TICKET_PRICE_INPUT_TYPE = 22
export const Q_THIRTY_FOUR_GET_TICKET_PRICE_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_GET_TICKET_PRICE_OUTPUT_SIZE = 8

export interface QThirtyFourGetTicketPriceOutput {
  ticketPrice: bigint
}

export const Q_THIRTY_FOUR_GET_TICKET_PRICE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'ticketPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQThirtyFourGetTicketPriceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourGetTicketPriceOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_GET_TICKET_PRICE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourGetTicketPriceOutput
}

export const Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_INPUT_TYPE = 23
export const Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_OUTPUT_SIZE = 18

export interface QThirtyFourGetNextEpochDataOutput {
  nextEpochData: QThirtyFourNextEpochDataStruct
}

export const Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourGetNextEpochDataOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_GET_NEXT_EPOCH_DATA_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourGetNextEpochDataOutput
}

export const Q_THIRTY_FOUR_GET_SCHEDULE_INPUT_TYPE = 24
export const Q_THIRTY_FOUR_GET_SCHEDULE_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_GET_SCHEDULE_OUTPUT_SIZE = 1

export interface QThirtyFourGetScheduleOutput {
  schedule: number
}

export const Q_THIRTY_FOUR_GET_SCHEDULE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'schedule',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourGetScheduleOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourGetScheduleOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_GET_SCHEDULE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourGetScheduleOutput
}

export const Q_THIRTY_FOUR_GET_WINNER_DATA_INPUT_TYPE = 25
export const Q_THIRTY_FOUR_GET_WINNER_DATA_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_GET_WINNER_DATA_OUTPUT_SIZE = 40974

export interface QThirtyFourGetWinnerDataOutput {
  winnerData: QThirtyFourWinnerDataStruct
}

export const Q_THIRTY_FOUR_GET_WINNER_DATA_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourGetWinnerDataOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_GET_WINNER_DATA_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourGetWinnerDataOutput
}

export const Q_THIRTY_FOUR_GET_POOLS_INPUT_TYPE = 26
export const Q_THIRTY_FOUR_GET_POOLS_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_GET_POOLS_OUTPUT_SIZE = 27

export interface QThirtyFourGetPoolsOutput {
  pools: QThirtyFourPoolsSnapshotStruct
}

export const Q_THIRTY_FOUR_GET_POOLS_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourGetPoolsOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_GET_POOLS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourGetPoolsOutput
}

export const Q_THIRTY_FOUR_GET_DRAW_HOUR_INPUT_TYPE = 27
export const Q_THIRTY_FOUR_GET_DRAW_HOUR_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_GET_DRAW_HOUR_OUTPUT_SIZE = 1

export interface QThirtyFourGetDrawHourOutput {
  drawHour: number
}

export const Q_THIRTY_FOUR_GET_DRAW_HOUR_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'drawHour',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourGetDrawHourOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourGetDrawHourOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_GET_DRAW_HOUR_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourGetDrawHourOutput
}

export const Q_THIRTY_FOUR_GET_STATE_INPUT_TYPE = 28
export const Q_THIRTY_FOUR_GET_STATE_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_GET_STATE_OUTPUT_SIZE = 1

export interface QThirtyFourGetStateOutput {
  currentState: number
}

export const Q_THIRTY_FOUR_GET_STATE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'currentState',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourGetStateOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourGetStateOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_GET_STATE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourGetStateOutput
}

export const Q_THIRTY_FOUR_GET_FEES_INPUT_TYPE = 31
export const Q_THIRTY_FOUR_GET_FEES_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_GET_FEES_OUTPUT_SIZE = 5

export interface QThirtyFourGetFeesOutput {
  teamFeePercent: number
  distributionFeePercent: number
  winnerFeePercent: number
  burnPercent: number
  returnCode: number
}

export const Q_THIRTY_FOUR_GET_FEES_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourGetFeesOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_GET_FEES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourGetFeesOutput
}

export const Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_INPUT_TYPE = 34
export const Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_INPUT_SIZE = 16
export const Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_OUTPUT_SIZE = 64

export interface QThirtyFourEstimatePrizePayoutsInput {
  k2WinnerCount: bigint
  k3WinnerCount: bigint
}

export const Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
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

export const Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourEstimatePrizePayoutsOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_ESTIMATE_PRIZE_PAYOUTS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourEstimatePrizePayoutsOutput
}

export const Q_THIRTY_FOUR_GET_PLAYERS_INPUT_TYPE = 35
export const Q_THIRTY_FOUR_GET_PLAYERS_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_GET_PLAYERS_OUTPUT_SIZE = 36865

export interface QThirtyFourGetPlayersOutput {
  players: number[]
  returnCode: number
}

export const Q_THIRTY_FOUR_GET_PLAYERS_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourGetPlayersOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_GET_PLAYERS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourGetPlayersOutput
}

export const Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_INPUT_TYPE = 36
export const Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_INPUT_SIZE = 0
export const Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_OUTPUT_SIZE = 1

export interface QThirtyFourGetWinningCombinationsHistoryOutput {
  returnCode: number
}

export const Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQThirtyFourGetWinningCombinationsHistoryOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QThirtyFourGetWinningCombinationsHistoryOutput {
  return decodePayload(
    data,
    Q_THIRTY_FOUR_GET_WINNING_COMBINATIONS_HISTORY_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QThirtyFourGetWinningCombinationsHistoryOutput
}

