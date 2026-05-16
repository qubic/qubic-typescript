import {
  AbiNotFoundError,
  type ContractAbiVersion,
  type ContractSnapshot,
  getAbi,
  getAbiHistory,
  getCurrentAbi,
} from '@qubic.org/registry'
import registry from '@qubic.org/registry/registry.json'
import { Hono } from 'hono'
import type { Storage } from '../storage'

// Computed once at startup — registry.json is static for the lifetime of the worker.
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

function snapshotToVersion(snap: ContractSnapshot, epoch: number): ContractAbiVersion {
  try {
    const { version } = getAbi(registry as Parameters<typeof getAbi>[0], snap.contractIndex, epoch)
    return {
      ...snap,
      effectiveFromEpoch: version.effectiveFromEpoch,
      effectiveToEpoch: version.effectiveToEpoch,
    }
  } catch {
    return {
      ...snap,
      effectiveFromEpoch: snap.epoch ?? epoch,
      effectiveToEpoch: snap.epoch ?? epoch,
    }
  }
}

async function allActiveAtEpoch(
  storage: Storage,
  epoch: number,
): Promise<ContractAbiVersion[]> {
  const fromStorage = await storage.getEpochSnapshots(epoch)
  if (fromStorage) return fromStorage.map((snap) => snapshotToVersion(snap, epoch))
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

export function buildApiRoutes(storage: Storage) {
  return new Hono()
    .get('/contracts', (c) => c.json(CONTRACT_SUMMARIES))

    .get('/contracts/by-name/:name', (c) => {
      const name = c.req.param('name').toLowerCase()
      const match = registry.versions.find(
        (v) => v.contractName.toLowerCase() === name && v.effectiveToEpoch === null,
      )
      if (!match) return c.json({ error: `Contract '${c.req.param('name')}' not found`, status: 404 }, 404)
      try {
        return c.json(getCurrentAbi(registry as Parameters<typeof getCurrentAbi>[0], match.contractIndex))
      } catch (e) {
        if (e instanceof AbiNotFoundError) return c.json({ error: e.message, status: 404 }, 404)
        throw e
      }
    })

    .get('/contracts/:index', (c) => {
      const idx = Number(c.req.param('index'))
      if (!Number.isInteger(idx) || idx < 0)
        return c.json({ error: 'Invalid contract index', status: 400 }, 400)
      try {
        c.header('cache-control', 'public, max-age=3600')
        return c.json(getCurrentAbi(registry as Parameters<typeof getCurrentAbi>[0], idx))
      } catch (e) {
        if (e instanceof AbiNotFoundError) return c.json({ error: e.message, status: 404 }, 404)
        throw e
      }
    })

    .get('/contracts/:index/history', (c) => {
      const idx = Number(c.req.param('index'))
      if (!Number.isInteger(idx) || idx < 0)
        return c.json({ error: 'Invalid contract index', status: 400 }, 400)
      const history = getAbiHistory(registry as Parameters<typeof getAbiHistory>[0], idx)
      if (history.length === 0)
        return c.json({ error: `No ABI found for contract ${idx}`, status: 404 }, 404)
      c.header('cache-control', 'public, max-age=3600')
      return c.json(history)
    })

    .get('/contracts/:index/epoch/:epoch', async (c) => {
      const idx = Number(c.req.param('index'))
      const epoch = Number(c.req.param('epoch'))
      if (!Number.isInteger(idx) || idx < 0 || !Number.isInteger(epoch) || epoch < 0)
        return c.json({ error: 'Invalid index or epoch', status: 400 }, 400)
      const fromStorage = await storage.getContractSnapshot(idx, epoch)
      if (fromStorage) {
        c.header('cache-control', 'public, max-age=31536000, immutable')
        const version = snapshotToVersion(fromStorage, epoch)
        return c.json({ version, isCurrent: version.effectiveToEpoch === null, isRegistryPossiblyStale: false })
      }
      try {
        c.header('cache-control', 'public, max-age=31536000, immutable')
        return c.json(getAbi(registry as Parameters<typeof getAbi>[0], idx, epoch))
      } catch (e) {
        if (e instanceof AbiNotFoundError) return c.json({ error: e.message, status: 404 }, 404)
        throw e
      }
    })

    .get('/epochs', async (c) => {
      c.header('cache-control', 'public, max-age=3600')
      const epochs = await storage.listEpochs()
      const epochRefs = await storage.getEpochRefs()
      const counts = await Promise.all(
        epochs.map((e) => storage.getEpochSnapshots(e).then((s) => s?.length ?? 0)),
      )
      return c.json(epochs.map((epoch, i) => ({
        epoch,
        contractCount: counts[i],
        gitTag: epochRefs[String(epoch)] ?? null,
      })))
    })

    .get('/epochs/:epoch', async (c) => {
      const epoch = Number(c.req.param('epoch'))
      if (!Number.isInteger(epoch) || epoch < 0)
        return c.json({ error: 'Invalid epoch', status: 400 }, 400)
      const result = await allActiveAtEpoch(storage, epoch)
      if (result.length === 0)
        return c.json({ error: `No contracts found at epoch ${epoch}`, status: 404 }, 404)
      c.header('cache-control', 'public, max-age=31536000, immutable')
      return c.json(result)
    })

    .get('/registry.json', (c) => {
      c.header('cache-control', 'public, max-age=3600')
      c.header('content-type', 'application/json')
      return c.json(registry)
    })
}

// Re-export type for use in server.ts
export type { Storage }
