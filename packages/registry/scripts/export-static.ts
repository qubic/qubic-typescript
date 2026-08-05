#!/usr/bin/env bun
/**
 * Exports registry artifacts into the static contract data layout.
 *
 * This is intentionally a copy-only bridge: the registry backfill still owns ABI
 * extraction, while static can receive registry.json, epoch refs, epoch snapshots,
 * and a manifest with hashes for validation and deployment.
 */
import { createHash } from 'node:crypto'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { parseArgs } from 'node:util'

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    'data-dir': { type: 'string' },
    'out-dir': { type: 'string' },
  },
})

const DATA_DIR = args['data-dir'] ?? join(import.meta.dir, '../data')
const OUT_DIR = args['out-dir']

if (!OUT_DIR) {
  console.error('Usage:\n' + '  bun scripts/export-static.ts --out-dir DIR [--data-dir DIR]')
  process.exit(1)
}

const PACKAGE_JSON = join(import.meta.dir, '../package.json')
const REGISTRY_PATH = join(DATA_DIR, 'registry.json')
const EPOCH_REFS_PATH = join(DATA_DIR, 'epoch-refs.json')
const EPOCHS_DIR = join(DATA_DIR, 'epochs')

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8')) as T
}

function sha256(path: string): string {
  return `sha256:${createHash('sha256').update(readFileSync(path)).digest('hex')}`
}

function filesUnder(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...filesUnder(path))
    else if (entry.isFile()) files.push(path)
  }
  return files
}

function copyFile(name: string) {
  const src = join(DATA_DIR, name)
  const dest = join(OUT_DIR, name)
  if (!existsSync(src)) throw new Error(`${src} does not exist`)
  mkdirSync(dirname(dest), { recursive: true })
  cpSync(src, dest)
}

function schemaForFile(path: string): string {
  if (path === 'registry.json') return 'contract_registry.schema.json'
  if (path === 'epoch-refs.json') return 'epoch_refs.schema.json'
  if (path.startsWith('epochs/')) return 'contract_snapshot.schema.json'
  throw new Error(`No static contract schema mapping for ${path}`)
}

function cleanGeneratedOutput() {
  for (const name of ['registry.json', 'epoch-refs.json', 'manifest.json']) {
    rmSync(join(OUT_DIR, name), { force: true })
  }
  rmSync(join(OUT_DIR, 'epochs'), { recursive: true, force: true })
}

if (!existsSync(REGISTRY_PATH)) throw new Error(`${REGISTRY_PATH} does not exist`)
if (!existsSync(EPOCH_REFS_PATH)) throw new Error(`${EPOCH_REFS_PATH} does not exist`)
if (!existsSync(EPOCHS_DIR)) throw new Error(`${EPOCHS_DIR} does not exist`)

cleanGeneratedOutput()
mkdirSync(OUT_DIR, { recursive: true })

copyFile('registry.json')
copyFile('epoch-refs.json')
cpSync(EPOCHS_DIR, join(OUT_DIR, 'epochs'), { recursive: true })

const packageJson = readJson<{ name: string; version: string }>(PACKAGE_JSON)
const epochRefs = readJson<Record<string, string>>(EPOCH_REFS_PATH)
const epochNumbers = Object.keys(epochRefs)
  .map(Number)
  .filter((epoch) => !Number.isNaN(epoch))
  .sort((a, b) => a - b)
const latestEpoch = epochNumbers[epochNumbers.length - 1] ?? 0
const latestCoreTag = latestEpoch > 0 ? epochRefs[String(latestEpoch)] : undefined

const copiedFiles = filesUnder(OUT_DIR)
  .filter((path) => !path.endsWith('/manifest.json'))
  .filter((path) => !relative(OUT_DIR, path).replaceAll('\\', '/').startsWith('schemas/'))
  .sort()
const files: Record<string, { hash: string; schema: string; size: number }> = {}
for (const path of copiedFiles) {
  const rel = relative(OUT_DIR, path).replaceAll('\\', '/')
  files[rel] = {
    hash: sha256(path),
    schema: schemaForFile(rel),
    size: statSync(path).size,
  }
}

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  generator: {
    name: packageJson.name,
    version: packageJson.version,
  },
  sources: {
    coreRepo: 'https://github.com/qubic/core',
    latestEpoch,
    ...(latestCoreTag ? { latestCoreTag } : {}),
    epochRefsHash: sha256(join(OUT_DIR, 'epoch-refs.json')),
  },
  files,
}

writeFileSync(join(OUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Exported contract registry data to ${OUT_DIR}`)
