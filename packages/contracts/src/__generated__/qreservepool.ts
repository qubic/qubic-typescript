// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const Q_RESERVE_POOL_CONTRACT_INDEX = 21

const STRUCTS: Record<string, NamedStruct> = {}

export const Q_RESERVE_POOL_WITHDRAW_RESERVE_INPUT_TYPE = 1
export const Q_RESERVE_POOL_WITHDRAW_RESERVE_INPUT_SIZE = 8
export const Q_RESERVE_POOL_WITHDRAW_RESERVE_OUTPUT_SIZE = 9

export interface QReservePoolWithdrawReserveInput {
  revenue: bigint
}

export const Q_RESERVE_POOL_WITHDRAW_RESERVE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'revenue',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQReservePoolWithdrawReserveInput(
  input: QReservePoolWithdrawReserveInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RESERVE_POOL_WITHDRAW_RESERVE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QReservePoolWithdrawReserveOutput {
  allocatedRevenue: bigint
  returnCode: number
}

export const Q_RESERVE_POOL_WITHDRAW_RESERVE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'allocatedRevenue',
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

export function decodeQReservePoolWithdrawReserveOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QReservePoolWithdrawReserveOutput {
  return decodePayload(
    data,
    Q_RESERVE_POOL_WITHDRAW_RESERVE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QReservePoolWithdrawReserveOutput
}

export const Q_RESERVE_POOL_ADD_ALLOWED_SC_INPUT_TYPE = 2
export const Q_RESERVE_POOL_ADD_ALLOWED_SC_INPUT_SIZE = 8
export const Q_RESERVE_POOL_ADD_ALLOWED_SC_OUTPUT_SIZE = 1

export interface QReservePoolAddAllowedSCInput {
  scIndex: bigint
}

export const Q_RESERVE_POOL_ADD_ALLOWED_SC_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'scIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQReservePoolAddAllowedSCInput(
  input: QReservePoolAddAllowedSCInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RESERVE_POOL_ADD_ALLOWED_SC_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QReservePoolAddAllowedSCOutput {
  returnCode: number
}

export const Q_RESERVE_POOL_ADD_ALLOWED_SC_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQReservePoolAddAllowedSCOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QReservePoolAddAllowedSCOutput {
  return decodePayload(
    data,
    Q_RESERVE_POOL_ADD_ALLOWED_SC_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QReservePoolAddAllowedSCOutput
}

export const Q_RESERVE_POOL_REMOVE_ALLOWED_SC_INPUT_TYPE = 3
export const Q_RESERVE_POOL_REMOVE_ALLOWED_SC_INPUT_SIZE = 8
export const Q_RESERVE_POOL_REMOVE_ALLOWED_SC_OUTPUT_SIZE = 1

export interface QReservePoolRemoveAllowedSCInput {
  scIndex: bigint
}

export const Q_RESERVE_POOL_REMOVE_ALLOWED_SC_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'scIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQReservePoolRemoveAllowedSCInput(
  input: QReservePoolRemoveAllowedSCInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RESERVE_POOL_REMOVE_ALLOWED_SC_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QReservePoolRemoveAllowedSCOutput {
  returnCode: number
}

export const Q_RESERVE_POOL_REMOVE_ALLOWED_SC_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQReservePoolRemoveAllowedSCOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QReservePoolRemoveAllowedSCOutput {
  return decodePayload(
    data,
    Q_RESERVE_POOL_REMOVE_ALLOWED_SC_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QReservePoolRemoveAllowedSCOutput
}

export const Q_RESERVE_POOL_SEND_RESERVE_INPUT_TYPE = 6
export const Q_RESERVE_POOL_SEND_RESERVE_INPUT_SIZE = 16
export const Q_RESERVE_POOL_SEND_RESERVE_OUTPUT_SIZE = 1

export interface QReservePoolSendReserveInput {
  scIndex: bigint
  amount: bigint
}

export const Q_RESERVE_POOL_SEND_RESERVE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'scIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildQReservePoolSendReserveInput(
  input: QReservePoolSendReserveInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RESERVE_POOL_SEND_RESERVE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QReservePoolSendReserveOutput {
  returnCode: number
}

export const Q_RESERVE_POOL_SEND_RESERVE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQReservePoolSendReserveOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QReservePoolSendReserveOutput {
  return decodePayload(
    data,
    Q_RESERVE_POOL_SEND_RESERVE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QReservePoolSendReserveOutput
}

export const Q_RESERVE_POOL_GET_AVAILABLE_RESERVE_INPUT_TYPE = 4
export const Q_RESERVE_POOL_GET_AVAILABLE_RESERVE_INPUT_SIZE = 0
export const Q_RESERVE_POOL_GET_AVAILABLE_RESERVE_OUTPUT_SIZE = 8

export interface QReservePoolGetAvailableReserveOutput {
  availableReserve: bigint
}

export const Q_RESERVE_POOL_GET_AVAILABLE_RESERVE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'availableReserve',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQReservePoolGetAvailableReserveOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QReservePoolGetAvailableReserveOutput {
  return decodePayload(
    data,
    Q_RESERVE_POOL_GET_AVAILABLE_RESERVE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QReservePoolGetAvailableReserveOutput
}

export const Q_RESERVE_POOL_GET_ALLOWED_SC_INPUT_TYPE = 5
export const Q_RESERVE_POOL_GET_ALLOWED_SC_INPUT_SIZE = 0
export const Q_RESERVE_POOL_GET_ALLOWED_SC_OUTPUT_SIZE = 4096

export interface QReservePoolGetAllowedSCOutput {
  allowedSC: string[]
}

export const Q_RESERVE_POOL_GET_ALLOWED_SC_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'allowedSC',
    type: 'array',
    offset: 0,
    byteLength: 4096,
    arrayLength: 128,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
]

export function decodeQReservePoolGetAllowedSCOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QReservePoolGetAllowedSCOutput {
  return decodePayload(
    data,
    Q_RESERVE_POOL_GET_ALLOWED_SC_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QReservePoolGetAllowedSCOutput
}

