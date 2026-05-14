import { Elysia } from 'elysia'
import { readdirSync } from 'node:fs'
import {
  AbiNotFoundError,
  type ContractAbiVersion,
  getAbi,
  getAbiHistory,
  getCurrentAbi,
} from '@qubic.ts/registry'
import registry from '@qubic.ts/registry/registry.json'

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

function contractSummaries() {
  const seen = new Map<number, ContractAbiVersion>()
  for (const v of registry.versions) {
    if (!seen.has(v.contractIndex) || v.effectiveFromEpoch > (seen.get(v.contractIndex)?.effectiveFromEpoch ?? 0)) {
      seen.set(v.contractIndex, v as ContractAbiVersion)
    }
  }
  return Array.from(seen.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, current]) => {
      const history = getAbiHistory(registry as Parameters<typeof getAbiHistory>[0], current.contractIndex)
      return {
        contractIndex: current.contractIndex,
        contractName: current.contractName,
        currentFromEpoch: current.effectiveFromEpoch,
        versionCount: history.length,
        procedureCount: current.procedures.length,
        functionCount: current.functions.length,
      }
    })
}

function allActiveAtEpoch(epoch: number): ContractAbiVersion[] {
  const indices = [...new Set(registry.versions.map((v) => v.contractIndex))]
  const result: ContractAbiVersion[] = []
  for (const idx of indices) {
    try {
      const { version } = getAbi(registry as Parameters<typeof getAbi>[0], idx, epoch)
      result.push(version as ContractAbiVersion)
    } catch {
      // contract not active at this epoch
    }
  }
  return result.sort((a, b) => a.contractIndex - b.contractIndex)
}

export const apiRoutes = new Elysia({ prefix: '/v1' })
  .get('/contracts', () => contractSummaries())

  .get('/contracts/by-name/:name', ({ params, error }) => {
    const name = params.name.toLowerCase()
    const match = registry.versions.find(
      (v) => v.contractName.toLowerCase() === name && v.effectiveToEpoch === null,
    )
    if (!match) return error(404, { error: `Contract '${params.name}' not found`, status: 404 })
    try {
      return getCurrentAbi(registry as Parameters<typeof getCurrentAbi>[0], match.contractIndex).version
    } catch (e) {
      if (e instanceof AbiNotFoundError) return error(404, { error: e.message, status: 404 })
      throw e
    }
  })

  .get('/contracts/:index', ({ params, error }) => {
    const idx = Number(params.index)
    if (Number.isNaN(idx)) return error(400, { error: 'Invalid contract index', status: 400 })
    try {
      return getCurrentAbi(registry as Parameters<typeof getCurrentAbi>[0], idx).version
    } catch (e) {
      if (e instanceof AbiNotFoundError) return error(404, { error: e.message, status: 404 })
      throw e
    }
  })

  .get('/contracts/:index/history', ({ params, error }) => {
    const idx = Number(params.index)
    if (Number.isNaN(idx)) return error(400, { error: 'Invalid contract index', status: 400 })
    const history = getAbiHistory(registry as Parameters<typeof getAbiHistory>[0], idx)
    if (history.length === 0) return error(404, { error: `No ABI found for contract ${idx}`, status: 404 })
    return history
  })

  .get('/contracts/:index/epoch/:epoch', ({ params, error }) => {
    const idx = Number(params.index)
    const epoch = Number(params.epoch)
    if (Number.isNaN(idx) || Number.isNaN(epoch))
      return error(400, { error: 'Invalid index or epoch', status: 400 })
    try {
      return getAbi(registry as Parameters<typeof getAbi>[0], idx, epoch)
    } catch (e) {
      if (e instanceof AbiNotFoundError) return error(404, { error: e.message, status: 404 })
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

  .get('/epochs/:epoch', ({ params, error }) => {
    const epoch = Number(params.epoch)
    if (Number.isNaN(epoch)) return error(400, { error: 'Invalid epoch', status: 400 })
    const result = allActiveAtEpoch(epoch)
    if (result.length === 0) return error(404, { error: `No contracts found at epoch ${epoch}`, status: 404 })
    return result
  })

  .get('/registry.json', ({ set }) => {
    set.headers['cache-control'] = 'public, max-age=3600'
    set.headers['content-type'] = 'application/json'
    return registry
  })
