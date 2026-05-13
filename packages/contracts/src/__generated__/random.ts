// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const RANDOM_CONTRACT_INDEX = 3

const STRUCTS: Record<string, NamedStruct> = {}

export const RANDOM_REVEAL_AND_COMMIT_INPUT_TYPE = 1
export const RANDOM_REVEAL_AND_COMMIT_INPUT_SIZE = 32
export const RANDOM_REVEAL_AND_COMMIT_OUTPUT_SIZE = 0

export interface RandomRevealAndCommitInput {
  commit: string
}

export const RANDOM_REVEAL_AND_COMMIT_INPUT_FIELDS: BinaryField[] = [
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

