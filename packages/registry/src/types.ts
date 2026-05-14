export type FieldType =
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'sint8'
  | 'sint16'
  | 'sint32'
  | 'sint64'
  | 'uint128'
  | 'id'
  | 'bytes'
  | 'array'
  | 'struct'

export interface BinaryField {
  name: string
  type: FieldType
  /** Byte offset from start of enclosing struct. */
  offset: number
  /** Total byte footprint — always authoritative. For arrays: arrayLength × arrayItemByteLength. */
  byteLength: number
  description?: string
  // For type='array'
  arrayLength?: number
  arrayItemType?: FieldType
  arrayItemByteLength?: number
  arrayItemStructRef?: string
  // For type='struct' or array of structs
  structRef?: string
}

export interface NamedStruct {
  name: string
  fields: BinaryField[]
  /** Sum of all field byteLengths; pre-computed. */
  byteLength: number
}

export interface ContractCallBase {
  kind: 'procedure' | 'function'
  /** Declaration-order ordinal, starts at 1. */
  inputType: number
  name: string
  description?: string
  inputFields: BinaryField[]
  outputFields: BinaryField[]
  /** Sum of inputField byteLengths; 0 if no input. */
  inputSize: number
  outputSize: number
  /** tx.amount used as invocationReward. */
  requiresAmount?: boolean
  sourceRef?: string
}

export interface ContractAbiVersion {
  contractIndex: number
  contractName: string
  effectiveFromEpoch: number
  /** null = currently active */
  effectiveToEpoch: number | null
  coreVersion?: string
  coreCommit?: string
  structs: Record<string, NamedStruct>
  procedures: ContractCallBase[]
  functions: ContractCallBase[]
  changelog?: string
}

export interface ContractRegistry {
  schemaVersion: 1
  updatedAt: string
  /** Sorted: contractIndex ASC, effectiveFromEpoch ASC. */
  versions: ContractAbiVersion[]
}

export interface AbiLookupResult {
  version: ContractAbiVersion
  isCurrent: boolean
  /** epoch > latest known for this contract AND isCurrent=true */
  isRegistryPossiblyStale: boolean
}
