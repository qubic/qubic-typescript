import { readFileSync, readdirSync } from 'node:fs'
import {
  AbiNotFoundError,
  type ContractAbiVersion,
  type ContractSnapshot,
  getAbi,
  getAbiHistory,
  getCurrentAbi,
} from '@qubic.org/registry'
import registry from '@qubic.org/registry/registry.json'
import { Elysia } from 'elysia'

// Resolve packages/registry root from the workspace-linked source entry
const REGISTRY_SRC = Bun.resolveSync('@qubic.org/registry', import.meta.dir) // .../packages/registry/src/index.ts
const DATA_DIR = REGISTRY_SRC.replace(/\/src\/index\.ts$/, '/data/')
const EPOCHS_DIR = `${DATA_DIR}epochs/`
const epochRefs: Record<string, string> = await Bun.file(`${DATA_DIR}epoch-refs.json`).json()

function epochDirs(): number[] {
  return readdirSync(EPOCHS_DIR)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)
}

// Computed once at startup — registry.json is static for the lifetime of the server process.
const CONTRACT_SUMMARIES = (() => {
  const seen = new Map<number, ContractAbiVersion>()
  for (const v of registry.versions) {
    if (
      !seen.has(v.contractIndex) ||
      v.effectiveFromEpoch > (seen.get(v.contractIndex)?.effectiveFromEpoch ?? 0)
    ) {
      seen.set(v.contractIndex, v as ContractAbiVersion)
    }
  }
  return Array.from(seen.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, current]) => {
      const history = getAbiHistory(
        registry as Parameters<typeof getAbiHistory>[0],
        current.contractIndex,
      )
      return {
        contractIndex: current.contractIndex,
        contractName: current.contractName,
        currentFromEpoch: current.effectiveFromEpoch,
        versionCount: history.length,
        procedureCount: current.procedures.length,
        functionCount: current.functions.length,
        structCount: Object.keys(current.structs ?? {}).length,
      }
    })
})()

function readEpochFromDisk(epoch: number): ContractSnapshot[] | null {
  const dir = `${EPOCHS_DIR}${epoch}/`
  try {
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
    if (files.length === 0) return null
    const snapshots: ContractSnapshot[] = []
    for (const file of files) {
      try {
        snapshots.push(JSON.parse(readFileSync(`${dir}${file}`, 'utf-8')) as ContractSnapshot)
      } catch {}
    }
    return snapshots.sort((a, b) => a.contractIndex - b.contractIndex)
  } catch {
    return null
  }
}

function readContractAtEpochFromDisk(
  contractIndex: number,
  epoch: number,
): ContractSnapshot | null {
  const snapshots = readEpochFromDisk(epoch)
  return snapshots?.find((c) => c.contractIndex === contractIndex) ?? null
}

/** Augments a ContractSnapshot with version-range metadata from registry.json. */
function snapshotToVersion(snap: ContractSnapshot, epoch: number): ContractAbiVersion {
  try {
    const { version } = getAbi(registry as Parameters<typeof getAbi>[0], snap.contractIndex, epoch)
    return {
      ...snap,
      effectiveFromEpoch: version.effectiveFromEpoch,
      effectiveToEpoch: version.effectiveToEpoch,
    }
  } catch {
    // Registry doesn't cover this epoch — use snapshot epoch as both bounds
    return {
      ...snap,
      effectiveFromEpoch: snap.epoch ?? epoch,
      effectiveToEpoch: snap.epoch ?? epoch,
    }
  }
}

function allActiveAtEpoch(epoch: number): ContractAbiVersion[] {
  const fromDisk = readEpochFromDisk(epoch)
  if (fromDisk) return fromDisk.map((snap) => snapshotToVersion(snap, epoch))
  const indices = [...new Set(registry.versions.map((v) => v.contractIndex))]
  const result: ContractAbiVersion[] = []
  for (const idx of indices) {
    try {
      const { version } = getAbi(registry as Parameters<typeof getAbi>[0], idx, epoch)
      result.push(version as ContractAbiVersion)
    } catch (e) {
      if (!(e instanceof AbiNotFoundError)) throw e
    }
  }
  return result.sort((a, b) => a.contractIndex - b.contractIndex)
}

export const apiRoutes = new Elysia({ prefix: '/v1' })
  .get('/contracts', () => CONTRACT_SUMMARIES)

  .get('/contracts/by-name/:name', ({ params, status }) => {
    const name = params.name.toLowerCase()
    const match = registry.versions.find(
      (v) => v.contractName.toLowerCase() === name && v.effectiveToEpoch === null,
    )
    if (!match) return status(404, { error: `Contract '${params.name}' not found`, status: 404 })
    try {
      return getCurrentAbi(registry as Parameters<typeof getCurrentAbi>[0], match.contractIndex)
    } catch (e) {
      if (e instanceof AbiNotFoundError) return status(404, { error: e.message, status: 404 })
      throw e
    }
  })

  .get('/contracts/:index', ({ params, status, set }) => {
    const idx = Number(params.index)
    if (!Number.isInteger(idx) || idx < 0)
      return status(400, { error: 'Invalid contract index', status: 400 })
    try {
      set.headers['cache-control'] = 'public, max-age=3600'
      return getCurrentAbi(registry as Parameters<typeof getCurrentAbi>[0], idx)
    } catch (e) {
      if (e instanceof AbiNotFoundError) return status(404, { error: e.message, status: 404 })
      throw e
    }
  })

  .get('/contracts/:index/history', ({ params, status, set }) => {
    const idx = Number(params.index)
    if (!Number.isInteger(idx) || idx < 0)
      return status(400, { error: 'Invalid contract index', status: 400 })
    const history = getAbiHistory(registry as Parameters<typeof getAbiHistory>[0], idx)
    if (history.length === 0)
      return status(404, { error: `No ABI found for contract ${idx}`, status: 404 })
    set.headers['cache-control'] = 'public, max-age=3600'
    return history
  })

  .get('/contracts/:index/epoch/:epoch', ({ params, status, set }) => {
    const idx = Number(params.index)
    const epoch = Number(params.epoch)
    if (!Number.isInteger(idx) || idx < 0 || !Number.isInteger(epoch) || epoch < 0)
      return status(400, { error: 'Invalid index or epoch', status: 400 })
    const fromDisk = readContractAtEpochFromDisk(idx, epoch)
    if (fromDisk) {
      set.headers['cache-control'] = 'public, max-age=31536000, immutable'
      const version = snapshotToVersion(fromDisk, epoch)
      return {
        version,
        isCurrent: version.effectiveToEpoch === null,
        isRegistryPossiblyStale: false,
      }
    }
    try {
      set.headers['cache-control'] = 'public, max-age=31536000, immutable'
      return getAbi(registry as Parameters<typeof getAbi>[0], idx, epoch)
    } catch (e) {
      if (e instanceof AbiNotFoundError) return status(404, { error: e.message, status: 404 })
      throw e
    }
  })

  .get('/epochs', ({ set }) => {
    set.headers['cache-control'] = 'public, max-age=3600'
    const dirs = epochDirs()
    return dirs.map((epoch) => {
      const dir = `${EPOCHS_DIR}${epoch}/`
      let contractCount = 0
      try {
        contractCount = readdirSync(dir).filter((f) => f.endsWith('.json')).length
      } catch {}
      return {
        epoch,
        contractCount,
        gitTag: (epochRefs as Record<string, string>)[String(epoch)] ?? null,
      }
    })
  })

  .get('/epochs/:epoch', ({ params, status, set }) => {
    const epoch = Number(params.epoch)
    if (!Number.isInteger(epoch) || epoch < 0)
      return status(400, { error: 'Invalid epoch', status: 400 })
    const result = allActiveAtEpoch(epoch)
    if (result.length === 0)
      return status(404, { error: `No contracts found at epoch ${epoch}`, status: 404 })
    set.headers['cache-control'] = 'public, max-age=31536000, immutable'
    return result
  })

  .get('/registry.json', ({ set }) => {
    set.headers['cache-control'] = 'public, max-age=3600'
    set.headers['content-type'] = 'application/json'
    return registry
  })
