// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import type { Result } from '@qubic.org/types'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'

export const RANDOM_CONTRACT_INDEX = 3

const STRUCTS: Record<string, NamedStruct> = {}

export const RANDOM_REVEAL_AND_COMMIT_INPUT_TYPE = 1

export interface RandomRevealAndCommitInput {
  reveal: Uint8Array
  commit: string
}

const RANDOM_REVEAL_AND_COMMIT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'reveal',
    type: 'bytes',
    offset: 0,
    byteLength: 512,
  },
  {
    name: 'commit',
    type: 'id',
    offset: 512,
    byteLength: 32,
  },
]

export function buildRandomRevealAndCommitInput(
  input: RandomRevealAndCommitInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: RANDOM_CONTRACT_INDEX, inputType: RANDOM_REVEAL_AND_COMMIT_INPUT_TYPE, payload: buildPayload(RANDOM_REVEAL_AND_COMMIT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export const RANDOM_BUY_ENTROPY_INPUT_TYPE = 2

export interface RandomBuyEntropyInput {
  collateralTier: number
  numberOfBits: number
  trustee: string
}

const RANDOM_BUY_ENTROPY_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'collateralTier',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'numberOfBits',
    type: 'uint16',
    offset: 1,
    byteLength: 2,
  },
  {
    name: 'trustee',
    type: 'id',
    offset: 3,
    byteLength: 32,
  },
]

export function buildRandomBuyEntropyInput(
  input: RandomBuyEntropyInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: RANDOM_CONTRACT_INDEX, inputType: RANDOM_BUY_ENTROPY_INPUT_TYPE, payload: buildPayload(RANDOM_BUY_ENTROPY_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface RandomBuyEntropyOutput {
  entropy: Uint8Array
}

const RANDOM_BUY_ENTROPY_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'entropy',
    type: 'bytes',
    offset: 0,
    byteLength: 512,
  },
]

export function decodeRandomBuyEntropyOutput(
  data: Uint8Array,
): RandomBuyEntropyOutput {
  return decodePayload(data, RANDOM_BUY_ENTROPY_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as RandomBuyEntropyOutput
}

export const RANDOM_FEES_INPUT_TYPE = 1
export const RANDOM_FEES_INPUT_SIZE = 0

export interface RandomFeesOutput {
  fees: number[]
}

const RANDOM_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'fees',
    type: 'array',
    offset: 0,
    byteLength: 64,
    arrayLength: 16,
    arrayItemType: 'uint32',
    arrayItemByteLength: 4,
  },
]

export function decodeRandomFeesOutput(
  data: Uint8Array,
): RandomFeesOutput {
  return decodePayload(data, RANDOM_FEES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as RandomFeesOutput
}

export async function randomFees(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<RandomFeesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: RANDOM_CONTRACT_INDEX,
    inputType: RANDOM_FEES_INPUT_TYPE,
    inputSize: RANDOM_FEES_INPUT_SIZE,
    inputFields: [],
    outputFields: RANDOM_FEES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const random = {
  contractIndex: RANDOM_CONTRACT_INDEX,
  Fees: randomFees,
  buildRevealAndCommitInput: buildRandomRevealAndCommitInput,
  buildBuyEntropyInput: buildRandomBuyEntropyInput,
  decodeBuyEntropyOutput: decodeRandomBuyEntropyOutput,
}

