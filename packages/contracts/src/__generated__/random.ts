// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { ContractCall } from '../call-contract.js'

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
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: RANDOM_CONTRACT_INDEX, inputType: RANDOM_REVEAL_AND_COMMIT_INPUT_TYPE, payload: buildPayload(RANDOM_REVEAL_AND_COMMIT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export const random = {
  contractIndex: RANDOM_CONTRACT_INDEX,
  buildRevealAndCommitInput: buildRandomRevealAndCommitInput,
}

