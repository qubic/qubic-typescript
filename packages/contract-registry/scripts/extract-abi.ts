#!/usr/bin/env bun
/**
 * Extracts a ContractAbiVersion from a Qubic C++ contract header.
 *
 * Usage:
 *   bun scripts/extract-abi.ts --contract Qearn --index 9 --effective-from 137 --local
 *   bun scripts/extract-abi.ts --contract Qx --index 1 --effective-from 66 --ref v1.234.0 [--write]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import type { ContractRegistry } from '../src/types.js'
import { parseContractHeader } from './_parse-header.js'

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    contract: { type: 'string' },
    'struct-name': { type: 'string' },
    index: { type: 'string' },
    ref: { type: 'string' },
    'effective-from': { type: 'string' },
    local: { type: 'boolean', default: false },
    write: { type: 'boolean', default: false },
  },
})

const contractName = args.contract
const contractIndex = args.index !== undefined ? Number(args.index) : undefined
const effectiveFrom =
  args['effective-from'] !== undefined ? Number(args['effective-from']) : undefined

if (!contractName || contractIndex === undefined || effectiveFrom === undefined) {
  console.error(
    'Usage: extract-abi.ts --contract <Name> --index <N> --effective-from <epoch> [--local] [--ref <tag>] [--struct-name <CppName>] [--write]',
  )
  process.exit(1)
}

let headerSource: string

if (args.local) {
  headerSource = readFileSync(
    join(import.meta.dir, `../../../resources/core/src/contracts/${contractName}.h`),
    'utf-8',
  )
} else {
  if (!args.ref) {
    console.error('--ref <tag> is required when not using --local')
    process.exit(1)
  }
  const { cloneAtRef } = await import('./_git-utils.js')
  const { dir, cleanup } = await cloneAtRef({ ref: args.ref, paths: ['src/contracts'] })
  try {
    headerSource = readFileSync(join(dir, `src/contracts/${contractName}.h`), 'utf-8')
  } finally {
    await cleanup()
  }
}

const version = parseContractHeader({
  headerSource,
  contractName,
  contractIndex,
  effectiveFromEpoch: effectiveFrom,
  ...(args['struct-name'] !== undefined ? { explicitStructName: args['struct-name'] } : {}),
})

const jsonOut = JSON.stringify(version, null, 2)

if (!args.write) {
  console.log(jsonOut)
} else {
  const registryPath = join(import.meta.dir, '../data/registry.json')
  const registry = JSON.parse(readFileSync(registryPath, 'utf-8')) as ContractRegistry

  for (const v of registry.versions) {
    if (v.contractIndex === contractIndex && v.effectiveToEpoch === null) {
      v.effectiveToEpoch = effectiveFrom - 1
    }
  }

  registry.versions.push(version)
  registry.versions.sort(
    (a, b) => a.contractIndex - b.contractIndex || a.effectiveFromEpoch - b.effectiveFromEpoch,
  )
  registry.updatedAt = new Date().toISOString()

  writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`)
  console.log(
    `✓ Wrote ${contractName} (index ${contractIndex}) effectiveFrom=${effectiveFrom} to registry.json`,
  )
}
