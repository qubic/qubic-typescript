#!/usr/bin/env bun
/**
 * Batch-extracts ABIs for all known contracts from local headers and writes registry.json.
 *
 * Usage:
 *   bun scripts/backfill.ts [--dry-run]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import type { ContractRegistry } from '../src/types.js'
import { parseContractHeader } from './_parse-header.js'

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: { 'dry-run': { type: 'boolean', default: false } },
})

const CONTRACTS_DIR = join(import.meta.dir, '../../../resources/core/src/contracts')
const SMART_CONTRACTS_JSON = join(
  import.meta.dir,
  '../../../resources/static/data/smart_contracts.json',
)
const REGISTRY_PATH = join(import.meta.dir, '../data/registry.json')

interface SmartContractEntry {
  filename: string
  label: string
  contractIndex: number
  firstUseEpoch: number
}

interface SmartContractsFile {
  smart_contracts: SmartContractEntry[]
}

const { smart_contracts } = JSON.parse(
  readFileSync(SMART_CONTRACTS_JSON, 'utf-8'),
) as SmartContractsFile

const versions: ContractRegistry['versions'] = []
let ok = 0
let failed = 0

for (const sc of smart_contracts) {
  const filenameStem = sc.filename.replace(/\.h$/, '')
  const headerPath = join(CONTRACTS_DIR, sc.filename)

  let headerSource: string
  try {
    headerSource = readFileSync(headerPath, 'utf-8')
  } catch {
    console.warn(`  ⚠ [${sc.contractIndex}] ${sc.label}: header not found at ${headerPath}`)
    failed++
    continue
  }

  try {
    const version = parseContractHeader({
      headerSource,
      contractName: filenameStem,
      contractIndex: sc.contractIndex,
      effectiveFromEpoch: sc.firstUseEpoch,
    })
    const procCount = version.procedures.length
    const fnCount = version.functions.length
    console.log(
      `  ✓ [${sc.contractIndex}] ${sc.label} (${filenameStem}.h): ${procCount} proc, ${fnCount} fn`,
    )
    versions.push(version)
    ok++
  } catch (e) {
    console.warn(
      `  ✗ [${sc.contractIndex}] ${sc.label}: ${e instanceof Error ? e.message : String(e)}`,
    )
    failed++
  }
}

versions.sort(
  (a, b) => a.contractIndex - b.contractIndex || a.effectiveFromEpoch - b.effectiveFromEpoch,
)

const registry: ContractRegistry = {
  schemaVersion: 1,
  updatedAt: new Date().toISOString(),
  versions,
}

console.log(`\nExtracted ${ok} contracts, ${failed} failed.`)

if (args['dry-run']) {
  console.log('Dry run — not writing registry.json')
} else {
  writeFileSync(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`)
  console.log(`Wrote ${REGISTRY_PATH}`)
}
