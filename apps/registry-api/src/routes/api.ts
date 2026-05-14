import { readFileSync, readdirSync } from 'node:fs'
import {
  AbiNotFoundError,
  type ContractAbiVersion,
  getAbi,
  getAbiHistory,
  getCurrentAbi,
} from '@qubic.ts/registry'
import registry from '@qubic.ts/registry/registry.json'
import { Elysia } from 'elysia'

// Resolve packages/registry root from the workspace-linked source entry
const REGISTRY_SRC = Bun.resolveSync('@qubic.ts/registry', import.meta.dir) // .../packages/registry/src/index.ts
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

function readEpochFromDisk(epoch: number): ContractAbiVersion[] | null {
  const dir = `${EPOCHS_DIR}${epoch}/`
  try {
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
    if (files.length === 0) return null
    const versions: ContractAbiVersion[] = []
    for (const file of files) {
      try {
        versions.push(JSON.parse(readFileSync(`${dir}${file}`, 'utf-8')) as ContractAbiVersion)
      } catch {}
    }
    return versions.sort((a, b) => a.contractIndex - b.contractIndex)
  } catch {
    return null
  }
}

function readContractAtEpochFromDisk(
  contractIndex: number,
  epoch: number,
): ContractAbiVersion | null {
  const contracts = readEpochFromDisk(epoch)
  return contracts?.find((c) => c.contractIndex === contractIndex) ?? null
}

function allActiveAtEpoch(epoch: number): ContractAbiVersion[] {
  const fromDisk = readEpochFromDisk(epoch)
  if (fromDisk) return fromDisk
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

  .get('/contracts/:index', ({ params, status }) => {
    const idx = Number(params.index)
    if (Number.isNaN(idx)) return status(400, { error: 'Invalid contract index', status: 400 })
    try {
      return getCurrentAbi(registry as Parameters<typeof getCurrentAbi>[0], idx)
    } catch (e) {
      if (e instanceof AbiNotFoundError) return status(404, { error: e.message, status: 404 })
      throw e
    }
  })

  .get('/contracts/:index/history', ({ params, status }) => {
    const idx = Number(params.index)
    if (Number.isNaN(idx)) return status(400, { error: 'Invalid contract index', status: 400 })
    const history = getAbiHistory(registry as Parameters<typeof getAbiHistory>[0], idx)
    if (history.length === 0)
      return status(404, { error: `No ABI found for contract ${idx}`, status: 404 })
    return history
  })

  .get('/contracts/:index/epoch/:epoch', ({ params, status }) => {
    const idx = Number(params.index)
    const epoch = Number(params.epoch)
    if (Number.isNaN(idx) || Number.isNaN(epoch))
      return status(400, { error: 'Invalid index or epoch', status: 400 })
    const fromDisk = readContractAtEpochFromDisk(idx, epoch)
    if (fromDisk)
      return {
        version: fromDisk,
        isCurrent: fromDisk.effectiveToEpoch === null,
        isRegistryPossiblyStale: false,
      }
    try {
      return getAbi(registry as Parameters<typeof getAbi>[0], idx, epoch)
    } catch (e) {
      if (e instanceof AbiNotFoundError) return status(404, { error: e.message, status: 404 })
      throw e
    }
  })

  .get('/epochs', () => {
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

  .get('/epochs/:epoch', ({ params, status }) => {
    const epoch = Number(params.epoch)
    if (Number.isNaN(epoch)) return status(400, { error: 'Invalid epoch', status: 400 })
    const result = allActiveAtEpoch(epoch)
    if (result.length === 0)
      return status(404, { error: `No contracts found at epoch ${epoch}`, status: 404 })
    return result
  })

  .get('/registry.json', ({ set }) => {
    set.headers['cache-control'] = 'public, max-age=3600'
    set.headers['content-type'] = 'application/json'
    return registry
  })
