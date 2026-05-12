// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const QEARN_CONTRACT_INDEX = 9

export const STRUCTS: Record<string, NamedStruct> = {}

export const LOCK_INPUT_TYPE = 1
export const LOCK_INPUT_SIZE = 0
export const LOCK_OUTPUT_SIZE = 4

export interface LockOutput {
  returnCode: number
}

export const LOCK_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeLockOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): LockOutput {
  return decodePayload(
    data,
    LOCK_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as LockOutput
}

export const UNLOCK_INPUT_TYPE = 2
export const UNLOCK_INPUT_SIZE = 12
export const UNLOCK_OUTPUT_SIZE = 4

export interface UnlockInput {
  amount: bigint
  lockedEpoch: number
}

export const UNLOCK_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'lockedEpoch',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function buildUnlockInput(
  input: UnlockInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(UNLOCK_INPUT_FIELDS, STRUCTS, input, identityToPublicKey)
}

export interface UnlockOutput {
  returnCode: number
}

export const UNLOCK_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeUnlockOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): UnlockOutput {
  return decodePayload(
    data,
    UNLOCK_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as UnlockOutput
}

export const GET_STATE_OF_ROUND_INPUT_TYPE = 3
export const GET_STATE_OF_ROUND_INPUT_SIZE = 4
export const GET_STATE_OF_ROUND_OUTPUT_SIZE = 4

export interface GetStateOfRoundInput {
  epoch: number
}

export const GET_STATE_OF_ROUND_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'epoch',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildGetStateOfRoundInput(
  input: GetStateOfRoundInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(GET_STATE_OF_ROUND_INPUT_FIELDS, STRUCTS, input, identityToPublicKey)
}

export interface GetStateOfRoundOutput {
  state: number
}

export const GET_STATE_OF_ROUND_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'state',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGetStateOfRoundOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): GetStateOfRoundOutput {
  return decodePayload(
    data,
    GET_STATE_OF_ROUND_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as GetStateOfRoundOutput
}

