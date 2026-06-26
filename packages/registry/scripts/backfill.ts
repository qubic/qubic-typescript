#!/usr/bin/env bun
/**
 * Populates per-epoch ABI snapshots and registry.json for all known contracts.
 *
 * Modes:
 *   --local              Read from resources/core/src/contracts/ (current epoch only, fast)
 *   --from-epoch N       Clone qubic/core once, scan tags since epoch N, write one snapshot
 *                        folder per epoch and a version-range registry.json
 *   --catch-up           Auto-detect current epoch from RPC, backfill from last known epoch
 *   --rebuild-registry   Rebuild registry.json from all existing epoch snapshots on disk
 *   --patch-addresses    Add/refresh contractAddress on every snapshot and registry.json
 *
 * Options:
 *   --use-local-git      Source files from resources/core via git-show instead of cloning
 *   --contracts A,B      Process only these contracts (filename stem or label, comma-separated)
 *   --token GH_TOKEN     GitHub API token for fetching tags (--from-epoch only)
 *   --rpc-url URL        RPC endpoint for --catch-up (default: https://rpc.qubic.org/live/v1)
 *   --force              Overwrite existing snapshots (--from-epoch only)
 *   --dry-run            Print what would be written without writing anything
 *
 * Outputs:
 *   data/epoch-refs.json              — saved epoch→tag map (reused on next run)
 *   data/epochs/{epoch}/{name}.json   — ABI snapshot per epoch per contract
 *   data/registry.json                — version-range index for client.ts
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { contractIndexToIdentity } from '@qubic.org/crypto'
import type { ContractAbiVersion, ContractRegistry, ContractSnapshot } from '../src/types.js'
import { cloneForBackfill, fetchCoreTags } from './_git-utils.js'
import { parseContractHeader } from './_parse-header.js'

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    local: { type: 'boolean', default: false },
    'rebuild-registry': { type: 'boolean', default: false },
    'patch-addresses': { type: 'boolean', default: false },
    'migrate-snapshots': { type: 'boolean', default: false },
    'use-local-git': { type: 'boolean', default: false },
    'from-epoch': { type: 'string' },
    'to-epoch': { type: 'string' },
    'catch-up': { type: 'boolean', default: false },
    'rpc-url': { type: 'string' },
    contracts: { type: 'string' },
    token: { type: 'string' },
    force: { type: 'boolean', default: false },
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

interface GithubContentEntry {
  name: string
  type: string
}

/**
 * Loads the contract list from the local smart_contracts.json file.
 * Falls back to fetching the contract list from the qubic/core GitHub repo
 * when the file doesn't exist (e.g. in CI / GitHub Actions).
 */
async function loadContractList(): Promise<SmartContractEntry[]> {
  // 1. Try local file first
  if (existsSync(SMART_CONTRACTS_JSON)) {
    const { smart_contracts } = JSON.parse(
      readFileSync(SMART_CONTRACTS_JSON, 'utf-8'),
    ) as SmartContractsFile
    return smart_contracts
  }

  console.log(
    'smart_contracts.json not found locally — fetching contract list from qubic/core…',
  )

  // 2. Fetch the src/contracts/ directory listing from qubic/core on GitHub
  const headers: Record<string, string> = args.token
    ? { Authorization: `Bearer ${args.token}` }
    : {}
  const res = await fetch(
    'https://api.github.com/repos/qubic/core/contents/src/contracts?ref=main',
    { headers },
  )
  if (!res.ok)
    throw new Error(
      `Failed to fetch contract list from GitHub: ${res.status} ${res.statusText}`,
    )
  const entries = (await res.json()) as GithubContentEntry[]
  const contractFiles = entries
    .filter((e) => e.type === 'file' && e.name.endsWith('.h'))
    .map((e) => e.name)
    .filter(
      (n) =>
        n !== 'qpi.h' &&
        n !== 'math_lib.h' &&
        !n.endsWith('_old.h') &&
        n !== 'EmptyTemplate.h' &&
        !n.startsWith('TestExample'),
    )
    .sort()

  // Map contract filenames to CONTRACT_INDEX values.
  // Must stay in sync with @qubic.org/types CONTRACT_INDEX.
  const FILENAME_TO_INDEX: Record<string, number> = {
    Qx: 1,
    Quottery: 2,
    Random: 3,
    QUtil: 4,
    MyLastMatch: 5,
    GeneralQuorumProposal: 6,
    SupplyWatcher: 7,
    ComputorControlledFund: 8,
    Qearn: 9,
    QVAULT: 10,
    MsVault: 11,
    Qbay: 12,
    Qswap: 13,
    Nostromo: 14,
    Qdraw: 15,
    RandomLottery: 16,
    QBond: 17,
    QIP: 18,
    QRaffle: 19,
    qRWA: 20,
    QReservePool: 21,
    QThirtyFour: 22,
    QDuel: 23,
    Pulse: 24,
    VottunBridge: 25,
    Qusino: 26,
    Escrow: 27,
    GGWP: 28,
  }

  // 3. Derive firstUseEpoch from existing epoch snapshots on disk
  const firstUseEpochByIndex = new Map<number, number>()
  if (existsSync(EPOCHS_DIR)) {
    for (const d of readdirSync(EPOCHS_DIR, { withFileTypes: true })) {
      if (!d.isDirectory()) continue
      const epoch = Number(d.name)
      if (Number.isNaN(epoch)) continue
      for (const file of readdirSync(join(EPOCHS_DIR, d.name)).filter((f) =>
        f.endsWith('.json'),
      )) {
        try {
          const snap = JSON.parse(
            readFileSync(join(EPOCHS_DIR, d.name, file), 'utf-8'),
          ) as { contractIndex?: number }
          if (snap.contractIndex !== undefined) {
            const prev = firstUseEpochByIndex.get(snap.contractIndex)
            if (prev === undefined || epoch < prev)
              firstUseEpochByIndex.set(snap.contractIndex, epoch)
          }
        } catch {
          /* skip unreadable snapshot */
        }
      }
    }
  }

  // 4. Build the contract list
  const list: SmartContractEntry[] = []
  for (const filename of contractFiles) {
    const stem = filename.replace(/\.h$/, '')
    const index = FILENAME_TO_INDEX[stem]
    if (index === undefined) continue // skip unknown contracts
    list.push({
      filename,
      label: stem,
      contractIndex: index,
      firstUseEpoch: firstUseEpochByIndex.get(index) ?? 0,
    })
  }

  if (list.length === 0)
    throw new Error(
      'Could not build contract list — no known contracts found in qubic/core.',
    )

  console.log(`Built contract list with ${list.length} contracts from qubic/core.`)
  return list
}

let allContracts: SmartContractEntry[]
let contracts: SmartContractEntry[]

async function initContracts(): Promise<void> {
  allContracts = await loadContractList()

  const filterNames = args.contracts
    ?.split(',')
    .map((s) => s.trim().toLowerCase())
  contracts = filterNames
    ? allContracts.filter(
        (sc) =>
          filterNames.includes(
            sc.filename.replace(/\.h$/, '').toLowerCase(),
          ) || filterNames.includes(sc.label.toLowerCase()),
      )
    : allContracts
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function abiFingerprint(v: ContractAbiVersion): string {
  return JSON.stringify({ procedures: v.procedures, functions: v.functions, structs: v.structs })
}

function readEpochFromSource(source: string): number | null {
  const m = source.match(/^#define\s+EPOCH\s+(\d+)/m)
  return m ? Number(m[1]) : null
}

function versionToSnapshot(
  epoch: number,
  version: ContractAbiVersion,
  coreVersion?: string,
): ContractSnapshot {
  const {
    contractIndex,
    contractName,
    contractAddress,
    structs,
    procedures,
    functions,
    changelog,
  } = version
  const snap: ContractSnapshot = { contractIndex, contractName }
  if (contractAddress !== undefined) snap.contractAddress = contractAddress
  snap.epoch = epoch
  if (coreVersion) snap.coreVersion = coreVersion
  else if (version.coreVersion) snap.coreVersion = version.coreVersion
  if (version.coreCommit) snap.coreCommit = version.coreCommit
  snap.structs = structs
  snap.procedures = procedures
  snap.functions = functions
  if (changelog) snap.changelog = changelog
  return snap
}

function writeEpochSnapshot(epoch: number, version: ContractAbiVersion, coreVersion?: string) {
  if (args['dry-run']) return
  const epochDir = join(EPOCHS_DIR, String(epoch))
  const snapshotPath = join(epochDir, `${version.contractName}.json`)
  if (!args.force && existsSync(snapshotPath)) return
  mkdirSync(epochDir, { recursive: true })
  writeFileSync(
    snapshotPath,
    `${JSON.stringify(versionToSnapshot(epoch, version, coreVersion), null, 2)}\n`,
  )
}

// ── Mode: --local ─────────────────────────────────────────────────────────────

async function runLocal() {
  const settingsSource = readFileSync(LOCAL_SETTINGS, 'utf-8')
  const epoch = readEpochFromSource(settingsSource)
  if (epoch === null) throw new Error('Could not read EPOCH from local public_settings.h')

  console.log(`Local mode — epoch ${epoch}`)

  // Load existing registry first so we can skip writing snapshots for unchanged ABIs
  let existing: ContractRegistry = {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    versions: [],
  }
  try {
    existing = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8')) as ContractRegistry
  } catch {
    /* fresh start */
  }

  const currentVersions = new Map<number, ContractAbiVersion>()
  for (const v of existing.versions) {
    if (v.effectiveToEpoch === null) currentVersions.set(v.contractIndex, v)
  }

  const toAdd: ContractAbiVersion[] = []
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
      const prev = currentVersions.get(version.contractIndex)
      if (prev === undefined) {
        writeEpochSnapshot(epoch, version)
        toAdd.push(version)
        console.log(`  + [${sc.contractIndex}] ${sc.label}: new contract`)
      } else if (abiFingerprint(version) !== abiFingerprint(prev)) {
        writeEpochSnapshot(epoch, version)
        prev.effectiveToEpoch = epoch - 1
        toAdd.push(version)
        console.log(`  ~ [${sc.contractIndex}] ${sc.label}: ABI changed`)
      } else {
        console.log(`  = [${sc.contractIndex}] ${sc.label}: unchanged`)
      }
      ok++
    } catch (e) {
      console.warn(`  ✗ [${sc.contractIndex}] ${sc.label}: ${e instanceof Error ? e.message : e}`)
      failed++
    }
  }

  console.log(`\nExtracted ${ok} contracts (${toAdd.length} changed), ${failed} failed.`)

  const allVersions = [...existing.versions, ...toAdd].sort(
    (a, b) => a.contractIndex - b.contractIndex || a.effectiveFromEpoch - b.effectiveFromEpoch,
  )
  writeRegistry({ schemaVersion: 1, updatedAt: new Date().toISOString(), versions: allVersions })
}

// ── Mode: --from-epoch ────────────────────────────────────────────────────────

async function buildEpochRefs(
  allTags: string[],
  showFile: (ref: string, path: string) => Promise<string | null>,
  requiredMaxEpoch?: number,
): Promise<Map<number, string>> {
  // Load cached epoch-refs if available and covers the required range
  try {
    const cached = JSON.parse(readFileSync(EPOCH_REFS_PATH, 'utf-8')) as Record<string, string>
    const map = new Map<number, string>()
    for (const [epoch, tag] of Object.entries(cached)) map.set(Number(epoch), tag)
    const maxCachedEpoch = Math.max(...map.keys())
    if (requiredMaxEpoch === undefined || maxCachedEpoch >= requiredMaxEpoch) {
      console.log(`Loaded ${map.size} epoch→tag refs from ${EPOCH_REFS_PATH}`)
      return map
    }
    console.log(
      `Cached epoch-refs only go to ${maxCachedEpoch}, need ${requiredMaxEpoch} — refreshing…`,
    )
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
    const epochToTag = await buildEpochRefs(allTags, showFile, toEpoch)

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
    } catch {
      // Fresh
    }

    // Track current ABI per contract for version-range index.
    // Pre-seed from existing epoch snapshots before fromEpoch so single-epoch runs
    // don't treat every contract as new.
    const current = new Map<number, { fingerprint: string; version: ContractAbiVersion }>()
    const priorEpochDirs = existsSync(EPOCHS_DIR)
      ? readdirSync(EPOCHS_DIR, { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .map((d) => Number(d.name))
          .filter((n) => !Number.isNaN(n) && n < fromEpoch)
          .sort((a, b) => a - b)
      : []
    for (const priorEpoch of priorEpochDirs) {
      const epochDir = join(EPOCHS_DIR, String(priorEpoch))
      for (const file of readdirSync(epochDir).filter((f) => f.endsWith('.json'))) {
        const snap = JSON.parse(readFileSync(join(epochDir, file), 'utf-8')) as ContractSnapshot
        const version: ContractAbiVersion = {
          ...snap,
          effectiveFromEpoch: snap.epoch ?? priorEpoch,
          effectiveToEpoch: null,
        }
        current.set(version.contractIndex, { fingerprint: abiFingerprint(version), version })
      }
    }

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

        const fp = abiFingerprint(version)
        const prev = current.get(sc.contractIndex)

        if (prev === undefined) {
          writeEpochSnapshot(epoch, version, tag)
          current.set(sc.contractIndex, { fingerprint: fp, version })
          newVersions.push(version)
          snapshots++
          changes++
        } else if (fp !== prev.fingerprint) {
          writeEpochSnapshot(epoch, version, tag)
          prev.version.effectiveToEpoch = epoch - 1
          current.set(sc.contractIndex, { fingerprint: fp, version })
          newVersions.push(version)
          snapshots++
          changes++
        }
      }

      console.log(`${snapshots} contracts, ${changes} ABI change(s)`)
    }

    // Close the open registry entry for every contract that got a new version
    const changedIndices = new Set(newVersions.map((v) => v.contractIndex))
    for (const v of existing.versions) {
      if (changedIndices.has(v.contractIndex) && v.effectiveToEpoch === null) {
        const firstNew = newVersions
          .filter((nv) => nv.contractIndex === v.contractIndex)
          .sort((a, b) => a.effectiveFromEpoch - b.effectiveFromEpoch)[0]
        v.effectiveToEpoch = firstNew.effectiveFromEpoch - 1
      }
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

// ── Output ────────────────────────────────────────────────────────────────────

function rebuildRegistryFromSnapshots() {
  console.log('\nRebuilding registry.json from epoch snapshots…')

  const contractFilter = args.contracts
    ? new Set(args.contracts.split(',').map((s) => s.trim().toLowerCase()))
    : null

  const epochDirs = existsSync(EPOCHS_DIR)
    ? readdirSync(EPOCHS_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => Number(d.name))
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b)
    : []

  // Track current ABI per contract index for version-range assignment
  const current = new Map<number, { fingerprint: string; version: ContractAbiVersion }>()
  const versions: ContractAbiVersion[] = []

  for (const epoch of epochDirs) {
    const epochDir = join(EPOCHS_DIR, String(epoch))
    const files = readdirSync(epochDir).filter((f) => f.endsWith('.json'))

    for (const file of files) {
      const contractName = file.replace(/\.json$/, '')
      if (contractFilter) {
        const stem = contractName.toLowerCase()
        const sc = allContracts.find(
          (c) =>
            c.filename.replace(/\.h$/, '').toLowerCase() === stem || c.label.toLowerCase() === stem,
        )
        if (!sc || (!contractFilter.has(stem) && !contractFilter.has(sc.label.toLowerCase())))
          continue
      }

      let snap: ContractSnapshot
      try {
        snap = JSON.parse(readFileSync(join(epochDir, file), 'utf-8')) as ContractSnapshot
      } catch {
        console.warn(`  ⚠ Failed to parse ${epochDir}/${file}`)
        continue
      }

      // Use the folder epoch as authoritative effectiveFromEpoch (snapshot.epoch matches folder)
      const snapEpoch = snap.epoch ?? epoch
      const version: ContractAbiVersion = {
        ...snap,
        effectiveFromEpoch: snapEpoch,
        effectiveToEpoch: null,
      }

      const fp = abiFingerprint(version)
      const prev = current.get(version.contractIndex)

      if (prev === undefined) {
        current.set(version.contractIndex, { fingerprint: fp, version })
        versions.push(version)
      } else if (fp !== prev.fingerprint) {
        prev.version.effectiveToEpoch = epoch - 1
        current.set(version.contractIndex, { fingerprint: fp, version })
        versions.push(version)
      }
      // else: same ABI, extend range silently
    }
  }

  versions.sort(
    (a, b) => a.contractIndex - b.contractIndex || a.effectiveFromEpoch - b.effectiveFromEpoch,
  )

  // If we're only rebuilding for specific contracts, merge with the existing registry
  if (contractFilter) {
    const indicesToProcess = new Set(versions.map((v) => v.contractIndex))
    let existing: ContractAbiVersion[] = []
    try {
      const reg = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8')) as ContractRegistry
      existing = reg.versions.filter((v) => !indicesToProcess.has(v.contractIndex))
    } catch {
      // Fresh
    }
    const merged = [...existing, ...versions].sort(
      (a, b) => a.contractIndex - b.contractIndex || a.effectiveFromEpoch - b.effectiveFromEpoch,
    )
    writeRegistry({ schemaVersion: 1, updatedAt: new Date().toISOString(), versions: merged })
  } else {
    writeRegistry({ schemaVersion: 1, updatedAt: new Date().toISOString(), versions })
  }
}

function writeRegistry(registry: ContractRegistry) {
  if (args['dry-run']) {
    console.log(`Dry run — would write ${registry.versions.length} version entries.`)
  } else {
    writeFileSync(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`)
    console.log(`Wrote ${registry.versions.length} version(s) to ${REGISTRY_PATH}`)
  }
}

// ── Mode: --migrate-snapshots ─────────────────────────────────────────────────

function migrateSnapshots() {
  console.log('Migrating snapshots to ContractSnapshot format (epoch key, no range fields)…')

  const epochDirEntries = existsSync(EPOCHS_DIR)
    ? readdirSync(EPOCHS_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => Number(d.name))
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b)
    : []

  let migrated = 0
  let skipped = 0

  for (const epoch of epochDirEntries) {
    const epochDir = join(EPOCHS_DIR, String(epoch))
    for (const file of readdirSync(epochDir).filter((f) => f.endsWith('.json'))) {
      const filePath = join(epochDir, file)
      let raw: Record<string, unknown>
      try {
        raw = JSON.parse(readFileSync(filePath, 'utf-8')) as Record<string, unknown>
      } catch {
        console.warn(`  ⚠ Failed to parse ${filePath}`)
        continue
      }

      // Already in new format
      if ('epoch' in raw && !('effectiveFromEpoch' in raw)) {
        skipped++
        continue
      }

      const contractIndex = raw.contractIndex as number
      const contractName = raw.contractName as string
      const contractAddress = raw.contractAddress as string | undefined
      const coreVersion = raw.coreVersion as string | undefined
      const coreCommit = raw.coreCommit as string | undefined
      const changelog = raw.changelog as string | undefined

      const snap: ContractSnapshot = { contractIndex, contractName }
      if (contractAddress !== undefined) snap.contractAddress = contractAddress
      snap.epoch = epoch
      if (coreVersion) snap.coreVersion = coreVersion
      if (coreCommit) snap.coreCommit = coreCommit
      snap.structs = raw.structs as ContractSnapshot['structs']
      snap.procedures = raw.procedures as ContractSnapshot['procedures']
      snap.functions = raw.functions as ContractSnapshot['functions']
      if (changelog) snap.changelog = changelog

      if (!args['dry-run']) writeFileSync(filePath, `${JSON.stringify(snap, null, 2)}\n`)
      migrated++
    }
  }

  console.log(`Migrated ${migrated} snapshots, ${skipped} already up-to-date.`)
}

// ── Mode: --patch-addresses ───────────────────────────────────────────────────

function patchAddresses() {
  const epochDirs = existsSync(EPOCHS_DIR)
    ? readdirSync(EPOCHS_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => Number(d.name))
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b)
    : []

  let patched = 0
  let skipped = 0

  for (const epoch of epochDirs) {
    const epochDir = join(EPOCHS_DIR, String(epoch))
    for (const file of readdirSync(epochDir).filter((f) => f.endsWith('.json'))) {
      const filePath = join(epochDir, file)
      let snap: ContractSnapshot
      try {
        snap = JSON.parse(readFileSync(filePath, 'utf-8')) as ContractSnapshot
      } catch {
        console.warn(`  ⚠ Failed to parse ${filePath}`)
        continue
      }
      const expected = contractIndexToIdentity(snap.contractIndex)
      const alreadyCorrect =
        snap.contractAddress === expected &&
        Object.keys(snap).indexOf('contractAddress') ===
          Object.keys(snap).indexOf('contractName') + 1
      if (alreadyCorrect) {
        skipped++
        continue
      }
      const { contractIndex, contractName, contractAddress: _old, ...rest } = snap
      const ordered = { contractIndex, contractName, contractAddress: expected, ...rest }
      if (!args['dry-run']) writeFileSync(filePath, `${JSON.stringify(ordered, null, 2)}\n`)
      patched++
    }
  }

  console.log(`Patched ${patched} snapshots, ${skipped} already up-to-date.`)

  // Patch registry.json in-place too
  try {
    const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8')) as ContractRegistry
    registry.versions = registry.versions.map((v) => {
      const { contractIndex, contractName, contractAddress: _old, ...rest } = v
      return {
        contractIndex,
        contractName,
        contractAddress: contractIndexToIdentity(contractIndex),
        ...rest,
      }
    })
    if (!args['dry-run']) writeFileSync(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`)
    console.log(`Patched ${registry.versions.length} registry.json version entries.`)
  } catch {
    console.warn('registry.json not found — run --rebuild-registry after.')
  }
}

// ── Mode: --catch-up ────────────────────────────────────────────────────────

async function getLastKnownEpoch(): Promise<number> {
  // 1. Check epoch-refs.json
  try {
    const refs = JSON.parse(readFileSync(EPOCH_REFS_PATH, 'utf-8')) as Record<string, string>
    const maxRef = Math.max(...Object.keys(refs).map(Number))
    if (!Number.isNaN(maxRef)) return maxRef
  } catch {
    /* no refs */
  }

  // 2. Fall back to highest epoch snapshot dir
  const dirs = existsSync(EPOCHS_DIR)
    ? readdirSync(EPOCHS_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => Number(d.name))
        .filter((n) => !Number.isNaN(n))
    : []
  return dirs.length > 0 ? Math.max(...dirs) : 0
}

async function fetchCurrentEpoch(rpcUrl: string): Promise<number> {
  const res = await fetch(`${rpcUrl}/tick-info`)
  if (!res.ok) throw new Error(`RPC error: ${res.status} ${res.statusText}`)
  const data = (await res.json()) as { tickInfo?: { epoch?: number } }
  const epoch = data.tickInfo?.epoch
  if (epoch === undefined || epoch === null)
    throw new Error('Could not read epoch from RPC response')
  return epoch
}

async function runCatchUp() {
  const rpcUrl = args['rpc-url'] ?? 'https://rpc.qubic.org/live/v1'

  console.log(`Querying current epoch from ${rpcUrl}…`)
  const currentEpoch = await fetchCurrentEpoch(rpcUrl)
  console.log(`Current epoch: ${currentEpoch}`)

  const lastKnown = await getLastKnownEpoch()
  console.log(`Last known epoch: ${lastKnown}`)

  if (currentEpoch <= lastKnown) {
    console.log('Already up to date — nothing to backfill.')
    return
  }

  const fromEpoch = lastKnown + 1
  console.log(`Backfilling epochs ${fromEpoch}–${currentEpoch}…`)
  await runFromEpoch(fromEpoch, currentEpoch)
}

// ── Dispatch ──────────────────────────────────────────────────────────────────

await initContracts()

if (args.local) {
  await runLocal()
} else if (args['rebuild-registry']) {
  rebuildRegistryFromSnapshots()
} else if (args['patch-addresses']) {
  patchAddresses()
} else if (args['migrate-snapshots']) {
  migrateSnapshots()
} else if (args['catch-up']) {
  await runCatchUp()
} else if (args['from-epoch'] !== undefined) {
  const fromEpoch = Number(args['from-epoch'])
  const toEpoch = args['to-epoch'] !== undefined ? Number(args['to-epoch']) : 9999
  await runFromEpoch(fromEpoch, toEpoch)
} else {
  console.error(
    'Usage:\n' +
      '  bun scripts/backfill.ts --local [--dry-run]\n' +
      '  bun scripts/backfill.ts --catch-up [--rpc-url URL] [--contracts A,B] [--token GH_TOKEN] [--dry-run]\n' +
      '  bun scripts/backfill.ts --rebuild-registry [--contracts A,B] [--dry-run]\n' +
      '  bun scripts/backfill.ts --patch-addresses [--dry-run]\n' +
      '  bun scripts/backfill.ts --migrate-snapshots [--dry-run]\n' +
      '  bun scripts/backfill.ts --from-epoch <N> [--to-epoch <M>] [--contracts A,B] [--token GH_TOKEN] [--dry-run]',
  )
  process.exit(1)
}
