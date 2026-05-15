import type {
  AbiLookupResult,
  ContractAbiVersion,
  ContractCallBase,
  ContractRegistry,
} from './types.js'

export class AbiNotFoundError extends Error {
  constructor(
    readonly contractIndex: number,
    readonly epoch: number,
    options?: { cause?: unknown },
  ) {
    super(`No ABI found for contract ${contractIndex} at epoch ${epoch}`, {
      cause: options?.cause,
    })
    this.name = 'AbiNotFoundError'
  }
}

export class EntryNotFoundError extends AbiNotFoundError {
  constructor(
    readonly kind: 'procedure' | 'function',
    readonly contractName: string,
    readonly inputType: number,
  ) {
    super(-1, -1)
    this.message = `${kind} inputType ${inputType} not found in contract ${contractName}`
    this.name = 'EntryNotFoundError'
  }
}

/**
 * Returns the ABI version active at the given epoch for the given contract.
 * @throws {AbiNotFoundError} if no version covers the epoch.
 */
export function getAbi(
  registry: ContractRegistry,
  contractIndex: number,
  epoch: number,
): AbiLookupResult {
  const versions = registry.versions.filter((v) => v.contractIndex === contractIndex)
  const version = versions.find(
    (v) =>
      v.effectiveFromEpoch <= epoch && epoch <= (v.effectiveToEpoch ?? Number.POSITIVE_INFINITY),
  )
  if (!version) throw new AbiNotFoundError(contractIndex, epoch)
  const maxFrom = versions.reduce((m, v) => Math.max(m, v.effectiveFromEpoch), 0)
  const isCurrent = version.effectiveToEpoch === null
  return {
    version,
    isCurrent,
    isRegistryPossiblyStale: isCurrent && epoch > maxFrom,
  }
}

/**
 * Returns all ABI versions for a contract, sorted by effectiveFromEpoch ASC.
 */
export function getAbiHistory(
  registry: ContractRegistry,
  contractIndex: number,
): ContractAbiVersion[] {
  return registry.versions
    .filter((v) => v.contractIndex === contractIndex)
    .sort((a, b) => a.effectiveFromEpoch - b.effectiveFromEpoch)
}

/**
 * Returns the currently-active ABI version (effectiveToEpoch === null).
 * @throws {AbiNotFoundError} if none exists.
 */
export function getCurrentAbi(
  registry: ContractRegistry,
  contractIndex: number,
): ContractAbiVersion {
  const version = registry.versions.find(
    (v) => v.contractIndex === contractIndex && v.effectiveToEpoch === null,
  )
  if (!version) throw new AbiNotFoundError(contractIndex, -1)
  return version
}

/**
 * Finds a procedure by inputType ordinal.
 * @throws if not found.
 */
export function getProcedure(version: ContractAbiVersion, inputType: number): ContractCallBase {
  const proc = version.procedures.find((p) => p.inputType === inputType)
  if (!proc) throw new EntryNotFoundError('procedure', version.contractName, inputType)
  return proc
}

/**
 * Finds a function by inputType ordinal.
 * @throws {EntryNotFoundError} if not found.
 */
export function getFunction(version: ContractAbiVersion, inputType: number): ContractCallBase {
  const fn = version.functions.find((f) => f.inputType === inputType)
  if (!fn) throw new EntryNotFoundError('function', version.contractName, inputType)
  return fn
}

/**
 * Returns the contract name for a given index.
 * @throws if the index is not registered.
 */
export function findContractByIndex(registry: ContractRegistry, contractIndex: number): string {
  const version = registry.versions.find((v) => v.contractIndex === contractIndex)
  if (!version) throw new Error(`Contract index ${contractIndex} not found in registry`)
  return version.contractName
}

/**
 * Returns the contract index for a given name (case-insensitive).
 * @throws if not found.
 */
export function findContractByName(registry: ContractRegistry, name: string): number {
  const lower = name.toLowerCase()
  const version = registry.versions.find((v) => v.contractName.toLowerCase() === lower)
  if (!version) throw new Error(`Contract name "${name}" not found in registry`)
  return version.contractIndex
}

/**
 * Validates the registry for structural correctness.
 * @throws with a descriptive message on any inconsistency.
 */
export function validateRegistry(registry: ContractRegistry): void {
  const byContract = new Map<number, ContractAbiVersion[]>()
  for (const v of registry.versions) {
    const list = byContract.get(v.contractIndex) ?? []
    list.push(v)
    byContract.set(v.contractIndex, list)
  }

  for (const [contractIndex, versions] of byContract) {
    const currentVersions = versions.filter((v) => v.effectiveToEpoch === null)
    if (currentVersions.length > 1) {
      throw new Error(
        `Contract ${contractIndex} has multiple current versions (effectiveToEpoch === null)`,
      )
    }

    const sorted = [...versions].sort((a, b) => a.effectiveFromEpoch - b.effectiveFromEpoch)
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i]
      const b = sorted[i + 1]
      if (a === undefined || b === undefined) continue
      const aEnd = a.effectiveToEpoch ?? Number.POSITIVE_INFINITY
      if (aEnd >= b.effectiveFromEpoch) {
        throw new Error(
          `Contract ${contractIndex} has overlapping epoch ranges: [${a.effectiveFromEpoch}, ${a.effectiveToEpoch}] and [${b.effectiveFromEpoch}, ${b.effectiveToEpoch}]`,
        )
      }
    }

    for (const v of versions) {
      validateVersion(v)
    }
  }
}

function validateVersion(v: ContractAbiVersion): void {
  for (const call of [...v.procedures, ...v.functions]) {
    const inputSum = call.inputFields.reduce((s, f) => s + f.byteLength, 0)
    if (inputSum !== call.inputSize) {
      throw new Error(
        `Contract ${v.contractName} ${call.kind} "${call.name}": inputSize ${call.inputSize} !== sum of inputField byteLengths ${inputSum}`,
      )
    }
    const outputSum = call.outputFields.reduce((s, f) => s + f.byteLength, 0)
    if (outputSum !== call.outputSize) {
      throw new Error(
        `Contract ${v.contractName} ${call.kind} "${call.name}": outputSize ${call.outputSize} !== sum of outputField byteLengths ${outputSum}`,
      )
    }
    for (const field of [...call.inputFields, ...call.outputFields]) {
      validateField(field, v)
    }
  }
}

function validateField(field: import('./types.js').BinaryField, v: ContractAbiVersion): void {
  if (field.type === 'array') {
    const len = field.arrayLength ?? 0
    const itemLen = field.arrayItemByteLength ?? 0
    if (len * itemLen !== field.byteLength) {
      throw new Error(
        `Contract ${v.contractName} field "${field.name}": arrayLength × arrayItemByteLength !== byteLength`,
      )
    }
    if (field.arrayItemStructRef !== undefined && !(field.arrayItemStructRef in v.structs)) {
      throw new Error(
        `Contract ${v.contractName} field "${field.name}": arrayItemStructRef "${field.arrayItemStructRef}" not found in structs`,
      )
    }
  }
  if (field.type === 'struct' && field.structRef !== undefined && !(field.structRef in v.structs)) {
    throw new Error(
      `Contract ${v.contractName} field "${field.name}": structRef "${field.structRef}" not found in structs`,
    )
  }
}
