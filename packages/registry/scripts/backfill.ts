#!/usr/bin/env bun
/**
 * Populates per-epoch ABI snapshots and registry.json for all known contracts.
 *
 * Modes:
 *   --local             Read from resources/core/src/contracts/ (current epoch only, fast)
 *   --from-epoch N      Clone qubic/core once, scan tags since epoch N, write one snapshot
 *                       folder per epoch and a version-range registry.json
 *   --fill-gaps         Re-scan all epoch/contract combinations that have no snapshot yet,
 *                       using resources/core git (requires tags to be present locally)
 *
 * Options:
 *   --use-local-git     Source files from resources/core via git-show instead of cloning
 *   --contracts A,B     Process only these contracts (filename stem or label, comma-separated)
 *   --token GH_TOKEN    GitHub API token for fetching tags (--from-epoch only)
 *   --dry-run           Print what would be written without writing anything
 *
 * Outputs:
 *   data/epoch-refs.json              — saved epoch→tag map (reused on next run)
 *   data/epochs/{epoch}/{name}.json   — ABI snapshot per epoch per contract
 *   data/registry.json                — version-range index for client.ts
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import type { ContractAbiVersion, ContractRegistry } from '../src/types.js'
import { cloneForBackfill, fetchCoreTags } from './_git-utils.js'
import { parseContractHeader } from './_parse-header.js'

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    local: { type: 'boolean', default: false },
    'fill-gaps': { type: 'boolean', default: false },
    'use-local-git': { type: 'boolean', default: false },
    'from-epoch': { type: 'string' },
    'to-epoch': { type: 'string' },
    contracts: { type: 'string' },
    token: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
})

const CORE_DIR = join(import.meta.dir, '../../../resources/core')
const CONTRACTS_DIR = join(CORE_DIR, 'src/contracts')
const LOCAL_SETTINGS = join(CORE_DIR, 'src/public_settings.h')
const SMART_CONTRACTS_JSON = join(
  import.meta.dir,
  '../../../resources/static/data/smart_contracts.json',
)
const DATA_DIR = join(import.meta.dir, '../data')
const EPOCHS_DIR = join(DATA_DIR, 'epochs')
const REGISTRY_PATH = join(DATA_DIR, 'registry.json')
const EPOCH_REFS_PATH = join(DATA_DIR, 'epoch-refs.json')

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

function readEpochFromSource(source: string): number | null {
  const m = source.match(/^#define\s+EPOCH\s+(\d+)/m)
  return m ? Number(m[1]) : null
}

function writeEpochSnapshot(epoch: number, version: ContractAbiVersion) {
  if (args['dry-run']) return
  const epochDir = join(EPOCHS_DIR, String(epoch))
  mkdirSync(epochDir, { recursive: true })
  writeFileSync(
    join(epochDir, `${version.contractName}.json`),
    `${JSON.stringify(version, null, 2)}\n`,
  )
}

async function showFileFromLocalGit(ref: string, path: string): Promise<string | null> {
  const proc = Bun.spawn(['git', '-C', CORE_DIR, 'show', `${ref}:${path}`], {
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const exit = await proc.exited
  if (exit !== 0) return null
  return new Response(proc.stdout).text()
}

// ── Mode: --local ─────────────────────────────────────────────────────────────

async function runLocal() {
  const settingsSource = readFileSync(LOCAL_SETTINGS, 'utf-8')
  const epoch = readEpochFromSource(settingsSource)
  if (epoch === null) throw new Error('Could not read EPOCH from local public_settings.h')

  console.log(`Local mode — epoch ${epoch}`)

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
        effectiveFromEpoch: epoch,
      })
      console.log(
        `  ✓ [${sc.contractIndex}] ${sc.label}: ${version.procedures.length} proc, ${version.functions.length} fn`,
      )
      versions.push(version)
      writeEpochSnapshot(epoch, version)
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

async function buildEpochRefs(
  allTags: string[],
  showFile: (ref: string, path: string) => Promise<string | null>,
): Promise<Map<number, string>> {
  // Load cached epoch-refs if available
  try {
    const cached = JSON.parse(readFileSync(EPOCH_REFS_PATH, 'utf-8')) as Record<string, string>
    const map = new Map<number, string>()
    for (const [epoch, tag] of Object.entries(cached)) map.set(Number(epoch), tag)
    console.log(`Loaded ${map.size} epoch→tag refs from ${EPOCH_REFS_PATH}`)
    return map
  } catch {
    // Build fresh
  }

  console.log(`Scanning ${allTags.length} tags to build epoch→tag map…`)
  const epochToTag = new Map<number, string>()

  for (const tag of allTags) {
    const source = await showFile(tag, 'src/public_settings.h')
    if (!source) continue
    const epoch = readEpochFromSource(source)
    if (epoch !== null) {
      // Later (higher semver) tags for the same epoch overwrite earlier ones
      epochToTag.set(epoch, tag)
    }
    process.stdout.write('.')
  }
  console.log()

  // Persist for future runs
  if (!args['dry-run']) {
    const obj: Record<string, string> = {}
    for (const [epoch, tag] of [...epochToTag.entries()].sort((a, b) => a[0] - b[0]))
      obj[String(epoch)] = tag
    writeFileSync(EPOCH_REFS_PATH, `${JSON.stringify(obj, null, 2)}\n`)
    console.log(`Saved epoch→tag refs to ${EPOCH_REFS_PATH}`)
  }

  return epochToTag
}

async function runFromEpoch(fromEpoch: number, toEpoch: number) {
  console.log('Fetching qubic/core tags from GitHub API…')
  const allTags = await fetchCoreTags(args.token !== undefined ? { token: args.token } : undefined)
  console.log(`Found ${allTags.length} tags.`)

  console.log('Cloning qubic/core (treeless, sparse — blobs fetched on demand)…')
  const { showFile, cleanup } = await cloneForBackfill()

  try {
    // Phase 1: build epoch→tag map (cached in data/epoch-refs.json)
    const epochToTag = await buildEpochRefs(allTags, showFile)

    const epochs = [...epochToTag.keys()]
      .filter((e) => e >= fromEpoch && e <= toEpoch)
      .sort((a, b) => a - b)

    if (epochs.length === 0) {
      console.warn(`No epochs found in range ${fromEpoch}–${toEpoch}`)
      return
    }

    console.log(`Processing ${epochs.length} epochs (${epochs[0]}–${epochs[epochs.length - 1]})…`)

    // Registry accumulation
    let existing: ContractRegistry = {
      schemaVersion: 1,
      updatedAt: new Date().toISOString(),
      versions: [],
    }
    try {
      existing = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8')) as ContractRegistry
      const indicesToProcess = new Set(contracts.map((sc) => sc.contractIndex))
      existing.versions = existing.versions.filter((v) => !indicesToProcess.has(v.contractIndex))
    } catch {
      // Fresh
    }

    // Track current ABI per contract for version-range index
    const current = new Map<number, { fingerprint: string; version: ContractAbiVersion }>()
    const newVersions: ContractAbiVersion[] = []

    // Phase 2: for each epoch, read each active contract via git-show
    for (const epoch of epochs) {
      const tag = epochToTag.get(epoch)
      if (!tag) continue

      const activeContracts = contracts.filter((sc) => sc.firstUseEpoch <= epoch)
      if (activeContracts.length === 0) continue

      process.stdout.write(`  Epoch ${epoch} (${tag}): `)

      let changes = 0
      let snapshots = 0

      for (const sc of activeContracts) {
        const headerSource = await showFile(tag, `src/contracts/${sc.filename}`)
        if (!headerSource) continue

        const filenameStem = sc.filename.replace(/\.h$/, '')
        let version: ContractAbiVersion
        try {
          version = parseContractHeader({
            headerSource,
            contractName: filenameStem,
            contractIndex: sc.contractIndex,
            effectiveFromEpoch: epoch,
          })
        } catch (e) {
          console.warn(
            `  ✗ [${sc.contractIndex}] ${sc.label} @epoch ${epoch}: ${e instanceof Error ? e.message : e}`,
          )
          continue
        }

        writeEpochSnapshot(epoch, version)
        snapshots++

        const fp = abiFingerprint(version)
        const prev = current.get(sc.contractIndex)

        if (prev === undefined) {
          current.set(sc.contractIndex, { fingerprint: fp, version })
          newVersions.push(version)
          changes++
        } else if (fp !== prev.fingerprint) {
          prev.version.effectiveToEpoch = epoch - 1
          current.set(sc.contractIndex, { fingerprint: fp, version })
          newVersions.push(version)
          changes++
        }
      }

      console.log(`${snapshots} contracts, ${changes} ABI change(s)`)
    }

    const allVersions = [...existing.versions, ...newVersions].sort(
      (a, b) => a.contractIndex - b.contractIndex || a.effectiveFromEpoch - b.effectiveFromEpoch,
    )

    console.log(`\nNew version range entries: ${newVersions.length}`)
    writeRegistry({ schemaVersion: 1, updatedAt: new Date().toISOString(), versions: allVersions })
  } finally {
    await cleanup()
  }
}

// ── Mode: --fill-gaps ─────────────────────────────────────────────────────────

async function runFillGaps(showFile: (ref: string, path: string) => Promise<string | null>) {
  const epochRefs = JSON.parse(readFileSync(EPOCH_REFS_PATH, 'utf-8')) as Record<string, string>
  const epochs = Object.keys(epochRefs)
    .map(Number)
    .sort((a, b) => a - b)

  let filled = 0
  let skipped = 0
  let failed = 0

  for (const epoch of epochs) {
    const tag = epochRefs[String(epoch)]
    if (!tag) continue
    const activeContracts = contracts.filter((sc) => sc.firstUseEpoch <= epoch)

    for (const sc of activeContracts) {
      const snapshotPath = join(EPOCHS_DIR, String(epoch), `${sc.label}.json`)
      if (existsSync(snapshotPath)) {
        skipped++
        continue
      }

      const headerSource = await showFile(tag, `src/contracts/${sc.filename}`)
      if (!headerSource) {
        console.warn(`  ⚠ [${sc.contractIndex}] ${sc.label} @epoch ${epoch}: file not found in ${tag}`)
        failed++
        continue
      }

      const filenameStem = sc.filename.replace(/\.h$/, '')
      try {
        const version = parseContractHeader({
          headerSource,
          contractName: filenameStem,
          contractIndex: sc.contractIndex,
          effectiveFromEpoch: epoch,
        })
        writeEpochSnapshot(epoch, version)
        console.log(`  ✓ [${sc.contractIndex}] ${sc.label} @epoch ${epoch}`)
        filled++
      } catch (e) {
        console.warn(
          `  ✗ [${sc.contractIndex}] ${sc.label} @epoch ${epoch}: ${e instanceof Error ? e.message : e}`,
        )
        failed++
      }
    }
  }

  console.log(`\nFilled ${filled}, skipped ${skipped} existing, ${failed} failed.`)
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
} else if (args['fill-gaps']) {
  if (args['use-local-git']) {
    await runFillGaps(showFileFromLocalGit)
  } else {
    console.log('Cloning qubic/core (treeless, sparse — blobs fetched on demand)…')
    const { showFile, cleanup } = await cloneForBackfill()
    try {
      await runFillGaps(showFile)
    } finally {
      await cleanup()
    }
  }
} else if (args['from-epoch'] !== undefined) {
  const fromEpoch = Number(args['from-epoch'])
  const toEpoch = args['to-epoch'] !== undefined ? Number(args['to-epoch']) : 9999
  await runFromEpoch(fromEpoch, toEpoch)
} else {
  console.error(
    'Usage:\n' +
      '  bun scripts/backfill.ts --local [--dry-run]\n' +
      '  bun scripts/backfill.ts --fill-gaps [--use-local-git] [--contracts A,B] [--dry-run]\n' +
      '  bun scripts/backfill.ts --from-epoch <N> [--to-epoch <M>] [--contracts A,B] [--token GH_TOKEN] [--dry-run]',
  )
  process.exit(1)
}
