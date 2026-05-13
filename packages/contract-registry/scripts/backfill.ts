#!/usr/bin/env bun
/**
 * Populates registry.json with ABIs for all known contracts.
 *
 * Two modes:
 *   --local        Read from resources/core/src/contracts/ (current headers only, fast)
 *   --from-epoch N Fetch git tags, extract ABI at each epoch ≥ N, track per-epoch changes
 *
 * Usage:
 *   bun scripts/backfill.ts --local [--dry-run]
 *   bun scripts/backfill.ts --from-epoch 104 [--to-epoch 220] [--contracts Qearn,Qx] [--token GH_TOKEN] [--dry-run]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import type { ContractAbiVersion, ContractRegistry } from '../src/types.js'
import { cloneAtRef, fetchCoreTags } from './_git-utils.js'
import { parseContractHeader } from './_parse-header.js'

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    local: { type: 'boolean', default: false },
    'from-epoch': { type: 'string' },
    'to-epoch': { type: 'string' },
    contracts: { type: 'string' },
    token: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
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

const { smart_contracts: allContracts } = JSON.parse(
  readFileSync(SMART_CONTRACTS_JSON, 'utf-8'),
) as SmartContractsFile

const filterNames = args.contracts?.split(',').map((s) => s.trim().toLowerCase())
const contracts = filterNames
  ? allContracts.filter(
      (sc) =>
        filterNames.includes(sc.filename.replace(/\.h$/, '').toLowerCase()) ||
        filterNames.includes(sc.label.toLowerCase()),
    )
  : allContracts

// ── Helpers ───────────────────────────────────────────────────────────────────

function abiFingerprint(v: ContractAbiVersion): string {
  return JSON.stringify({ procedures: v.procedures, functions: v.functions, structs: v.structs })
}

// ── Mode: --local ─────────────────────────────────────────────────────────────

async function runLocal() {
  const versions: ContractAbiVersion[] = []
  let ok = 0
  let failed = 0

  for (const sc of contracts) {
    const filenameStem = sc.filename.replace(/\.h$/, '')
    let headerSource: string
    try {
      headerSource = readFileSync(join(CONTRACTS_DIR, sc.filename), 'utf-8')
    } catch {
      console.warn(`  ⚠ [${sc.contractIndex}] ${sc.label}: header not found`)
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
      console.log(
        `  ✓ [${sc.contractIndex}] ${sc.label}: ${version.procedures.length} proc, ${version.functions.length} fn`,
      )
      versions.push(version)
      ok++
    } catch (e) {
      console.warn(`  ✗ [${sc.contractIndex}] ${sc.label}: ${e instanceof Error ? e.message : e}`)
      failed++
    }
  }

  versions.sort(
    (a, b) => a.contractIndex - b.contractIndex || a.effectiveFromEpoch - b.effectiveFromEpoch,
  )

  console.log(`\nExtracted ${ok} contracts, ${failed} failed.`)
  writeRegistry({ schemaVersion: 1, updatedAt: new Date().toISOString(), versions })
}

// ── Mode: --from-epoch ────────────────────────────────────────────────────────

function readEpochFromDir(dir: string): number | null {
  try {
    const settings = readFileSync(join(dir, 'src/public_settings.h'), 'utf-8')
    const m = settings.match(/^#define\s+EPOCH\s+(\d+)/m)
    return m ? Number(m[1]) : null
  } catch {
    return null
  }
}

async function runFromEpoch(fromEpoch: number, toEpoch: number) {
  console.log('Fetching qubic/core tags…')
  const allTags = await fetchCoreTags(args.token !== undefined ? { token: args.token } : undefined)
  console.log(`Found ${allTags.length} tags. Scanning for epoch range ${fromEpoch}–${toEpoch}…`)

  // Registry accumulation: start from existing registry or fresh
  let existing: ContractRegistry = {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    versions: [],
  }
  try {
    existing = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8')) as ContractRegistry
    // Remove any open versions for contracts we're processing (will regenerate)
    const contractIndicesToProcess = new Set(contracts.map((sc) => sc.contractIndex))
    existing.versions = existing.versions.filter(
      (v) => !contractIndicesToProcess.has(v.contractIndex),
    )
  } catch {
    // Fresh registry
  }

  // Track current ABI per contract: contractIndex → { fingerprint, version }
  const current = new Map<number, { fingerprint: string; version: ContractAbiVersion }>()
  const newVersions: ContractAbiVersion[] = []

  // Track the last seen epoch so we can skip duplicate-epoch tags efficiently.
  // Tags are in semver order; multiple tags can map to the same epoch (patch releases).
  // We process each tag, read the actual epoch from public_settings.h, and deduplicate.
  const processedEpochs = new Set<number>()

  for (const tag of allTags) {
    let dir: string | null = null
    let cleanup: (() => Promise<void>) | null = null

    try {
      ;({ dir, cleanup } = await cloneAtRef({
        ref: tag,
        paths: ['src/public_settings.h', 'src/contracts'],
      }))
    } catch (e) {
      console.warn(`  ${tag}: clone failed: ${e instanceof Error ? e.message : e}`)
      continue
    }

    try {
      const epoch = readEpochFromDir(dir)
      if (epoch === null || epoch < fromEpoch || epoch > toEpoch) continue

      // Filter to contracts active at this epoch
      const activeContracts = contracts.filter((sc) => sc.firstUseEpoch <= epoch)
      if (activeContracts.length === 0) continue

      process.stdout.write(`  Epoch ${epoch} (${tag}): `)

      let changes = 0
      for (const sc of activeContracts) {
        let headerSource: string
        try {
          headerSource = readFileSync(join(dir, `src/contracts/${sc.filename}`), 'utf-8')
        } catch {
          continue // Contract header not yet present in this tag
        }
        const filenameStem = sc.filename.replace(/\.h$/, '')
        let version: ContractAbiVersion
        try {
          version = parseContractHeader({
            headerSource,
            contractName: filenameStem,
            contractIndex: sc.contractIndex,
            effectiveFromEpoch: epoch,
          })
        } catch {
          continue
        }

        const fp = abiFingerprint(version)
        const prev = current.get(sc.contractIndex)

        if (prev === undefined) {
          current.set(sc.contractIndex, { fingerprint: fp, version })
          newVersions.push(version)
          changes++
        } else if (fp !== prev.fingerprint) {
          // ABI changed — close previous version, open new
          prev.version.effectiveToEpoch = epoch - 1
          current.set(sc.contractIndex, { fingerprint: fp, version })
          newVersions.push(version)
          changes++
        }
      }

      processedEpochs.add(epoch)
      console.log(`${changes} change(s)`)
    } finally {
      await cleanup?.()
    }
  }

  // Merge new versions with existing
  const allVersions = [...existing.versions, ...newVersions].sort(
    (a, b) => a.contractIndex - b.contractIndex || a.effectiveFromEpoch - b.effectiveFromEpoch,
  )

  console.log(
    `\nProcessed ${processedEpochs.size} unique epochs. New version entries: ${newVersions.length}`,
  )
  writeRegistry({ schemaVersion: 1, updatedAt: new Date().toISOString(), versions: allVersions })
}

// ── Output ────────────────────────────────────────────────────────────────────

function writeRegistry(registry: ContractRegistry) {
  if (args['dry-run']) {
    console.log(`Dry run — would write ${registry.versions.length} version entries.`)
  } else {
    writeFileSync(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`)
    console.log(`Wrote ${registry.versions.length} version(s) to ${REGISTRY_PATH}`)
  }
}

// ── Dispatch ──────────────────────────────────────────────────────────────────

if (args.local) {
  await runLocal()
} else if (args['from-epoch'] !== undefined) {
  const fromEpoch = Number(args['from-epoch'])
  const toEpoch = args['to-epoch'] !== undefined ? Number(args['to-epoch']) : 9999
  await runFromEpoch(fromEpoch, toEpoch)
} else {
  console.error(
    'Usage:\n' +
      '  bun scripts/backfill.ts --local [--dry-run]\n' +
      '  bun scripts/backfill.ts --from-epoch <N> [--to-epoch <M>] [--contracts A,B] [--token GH_TOKEN] [--dry-run]',
  )
  process.exit(1)
}
