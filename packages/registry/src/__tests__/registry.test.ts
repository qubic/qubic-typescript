import { describe, expect, test } from 'bun:test'
import {
  AbiNotFoundError,
  findContractByIndex,
  findContractByName,
  getAbi,
  getAbiHistory,
  getCurrentAbi,
  getFunction,
  getProcedure,
  validateRegistry,
} from '../registry.js'
import type { ContractRegistry } from '../types.js'

const registry: ContractRegistry = {
  schemaVersion: 1,
  updatedAt: '2026-01-01T00:00:00Z',
  versions: [
    {
      contractIndex: 9,
      contractName: 'Qearn',
      effectiveFromEpoch: 137,
      effectiveToEpoch: null,
      coreVersion: 'v1.234.0',
      registeredAt: '2026-01-01T00:00:00Z',
      structs: {},
      procedures: [
        {
          kind: 'procedure',
          inputType: 1,
          name: 'lock',
          inputFields: [],
          outputFields: [{ name: 'returnCode', type: 'uint32', offset: 0, byteLength: 4 }],
          inputSize: 0,
          outputSize: 4,
        },
        {
          kind: 'procedure',
          inputType: 2,
          name: 'unlock',
          inputFields: [
            { name: 'amount', type: 'uint64', offset: 0, byteLength: 8 },
            { name: 'lockedEpoch', type: 'uint32', offset: 8, byteLength: 4 },
          ],
          outputFields: [{ name: 'returnCode', type: 'uint32', offset: 0, byteLength: 4 }],
          inputSize: 12,
          outputSize: 4,
        },
      ],
      functions: [
        {
          kind: 'function',
          inputType: 3,
          name: 'getStateOfRound',
          inputFields: [{ name: 'epoch', type: 'uint32', offset: 0, byteLength: 4 }],
          outputFields: [{ name: 'state', type: 'uint32', offset: 0, byteLength: 4 }],
          inputSize: 4,
          outputSize: 4,
        },
      ],
    },
  ],
}

describe('getAbi', () => {
  test('returns version at epoch within range', () => {
    const result = getAbi(registry, 9, 150)
    expect(result.version.contractName).toBe('Qearn')
    expect(result.isCurrent).toBe(true)
  })

  test('isCurrent true for effectiveToEpoch null', () => {
    const result = getAbi(registry, 9, 200)
    expect(result.isCurrent).toBe(true)
  })

  test('isRegistryPossiblyStale false when epoch equals effectiveFromEpoch', () => {
    const result = getAbi(registry, 9, 137)
    expect(result.isRegistryPossiblyStale).toBe(false)
  })

  test('isRegistryPossiblyStale true for isCurrent version past known epoch', () => {
    const result = getAbi(registry, 9, 999)
    expect(result.isRegistryPossiblyStale).toBe(true)
  })

  test('throws AbiNotFoundError for unknown contract', () => {
    expect(() => getAbi(registry, 99, 150)).toThrow(AbiNotFoundError)
  })

  test('throws AbiNotFoundError for epoch before effectiveFromEpoch', () => {
    expect(() => getAbi(registry, 9, 100)).toThrow(AbiNotFoundError)
  })
})

describe('getAbiHistory', () => {
  test('returns all versions sorted', () => {
    const history = getAbiHistory(registry, 9)
    expect(history).toHaveLength(1)
    expect(history[0]?.contractName).toBe('Qearn')
  })

  test('returns empty for unknown contract', () => {
    expect(getAbiHistory(registry, 99)).toHaveLength(0)
  })
})

describe('getCurrentAbi', () => {
  test('returns current version', () => {
    const v = getCurrentAbi(registry, 9)
    expect(v.effectiveToEpoch).toBeNull()
  })

  test('throws for unknown contract', () => {
    expect(() => getCurrentAbi(registry, 99)).toThrow(AbiNotFoundError)
  })
})

describe('getProcedure / getFunction', () => {
  test('getProcedure returns correct procedure', () => {
    const v = getCurrentAbi(registry, 9)
    const proc = getProcedure(v, 2)
    expect(proc.name).toBe('unlock')
  })

  test('getProcedure throws for unknown inputType', () => {
    const v = getCurrentAbi(registry, 9)
    expect(() => getProcedure(v, 99)).toThrow()
  })

  test('getFunction returns correct function', () => {
    const v = getCurrentAbi(registry, 9)
    const fn = getFunction(v, 3)
    expect(fn.name).toBe('getStateOfRound')
  })
})

describe('findContractByIndex / findContractByName', () => {
  test('findContractByIndex returns name', () => {
    expect(findContractByIndex(registry, 9)).toBe('Qearn')
  })

  test('findContractByIndex throws for unknown', () => {
    expect(() => findContractByIndex(registry, 99)).toThrow()
  })

  test('findContractByName returns index', () => {
    expect(findContractByName(registry, 'qearn')).toBe(9)
    expect(findContractByName(registry, 'Qearn')).toBe(9)
  })

  test('findContractByName throws for unknown', () => {
    expect(() => findContractByName(registry, 'Unknown')).toThrow()
  })
})

describe('validateRegistry', () => {
  test('passes for valid registry', () => {
    expect(() => validateRegistry(registry)).not.toThrow()
  })

  test('throws for multiple current versions', () => {
    const invalid: ContractRegistry = {
      ...registry,
      versions: [...registry.versions, { ...registry.versions[0]!, effectiveFromEpoch: 200 }],
    }
    expect(() => validateRegistry(invalid)).toThrow('multiple current versions')
  })

  test('throws for inputSize mismatch', () => {
    const invalid: ContractRegistry = {
      schemaVersion: 1,
      updatedAt: '2026-01-01T00:00:00Z',
      versions: [
        {
          contractIndex: 1,
          contractName: 'Test',
          effectiveFromEpoch: 1,
          effectiveToEpoch: null,
          registeredAt: '2026-01-01T00:00:00Z',
          structs: {},
          procedures: [
            {
              kind: 'procedure',
              inputType: 1,
              name: 'test',
              inputFields: [{ name: 'x', type: 'uint32', offset: 0, byteLength: 4 }],
              outputFields: [],
              inputSize: 999,
              outputSize: 0,
            },
          ],
          functions: [],
        },
      ],
    }
    expect(() => validateRegistry(invalid)).toThrow('inputSize')
  })
})
