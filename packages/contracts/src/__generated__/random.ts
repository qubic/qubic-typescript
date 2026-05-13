// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const RANDOM_CONTRACT_INDEX = 3

const STRUCTS: Record<string, NamedStruct> = {}

export const RANDOM_REVEAL_AND_COMMIT_INPUT_TYPE = 1

export interface RandomRevealAndCommitInput {
  commit: string
}

const RANDOM_REVEAL_AND_COMMIT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'commit',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildRandomRevealAndCommitInput(
  input: RandomRevealAndCommitInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(RANDOM_REVEAL_AND_COMMIT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const random = {
  contractIndex: RANDOM_CONTRACT_INDEX,
  buildRevealAndCommitInput: buildRandomRevealAndCommitInput,
}

