import { type ContractRegistry, findContractByIndex } from '@qubic.org/registry'
import _registry from '@qubic.org/registry/registry.json'

const registry = _registry as ContractRegistry
import { zipSync } from 'fflate'
import { Hono } from 'hono'
import type { Storage } from '../storage'

function binary(body: Uint8Array, headers: Record<string, string>): Response {
  return new Response(body, { headers })
}

export function buildDownloadRoutes(storage: Storage): Hono {
  return new Hono()
    .get('/registry.json', async (c) => {
      const bytes = await storage.readFile('registry.json')
      if (!bytes) return c.json({ error: 'registry.json not found', status: 404 }, 404)
      return binary(bytes, {
        'content-type': 'application/json',
        'content-disposition': 'attachment; filename="registry.json"',
      })
    })

    .get('/epoch/:epoch/:contract', async (c) => {
      const epoch = Number(c.req.param('epoch'))
      if (!Number.isInteger(epoch) || epoch < 0)
        return c.json({ error: 'Invalid epoch', status: 400 }, 400)
      const contract = c.req.param('contract').replace(/\.json$/, '')
      if (!/^[a-zA-Z0-9_-]+$/.test(contract))
        return c.json({ error: 'Invalid contract name', status: 400 }, 400)
      const filename = `${contract}.json`
      const bytes = await storage.readFile(`epochs/${epoch}/${filename}`)
      if (!bytes)
        return c.json(
          { error: `No snapshot found for ${contract} at epoch ${epoch}`, status: 404 },
          404,
        )
      return binary(bytes, {
        'cache-control': 'public, max-age=31536000, immutable',
        'content-type': 'application/json',
        'content-disposition': `attachment; filename="${filename}"`,
      })
    })

    .get('/epoch/:epoch/all.zip', async (c) => {
      const epoch = Number(c.req.param('epoch'))
      if (!Number.isInteger(epoch) || epoch < 0)
        return c.json({ error: 'Invalid epoch', status: 400 }, 400)
      const snapshots = await storage.getEpochSnapshots(epoch)
      if (!snapshots || snapshots.length === 0)
        return c.json({ error: `No contracts at epoch ${epoch}`, status: 404 }, 404)
      const entries: Record<string, Uint8Array> = {}
      await Promise.all(
        snapshots.map(async (snap) => {
          const name = snap.contractName ?? String(snap.contractIndex)
          const bytes = await storage.readFile(`epochs/${epoch}/${name}.json`)
          if (bytes) entries[`${name}.json`] = bytes
        }),
      )
      return binary(zipSync(entries), {
        'cache-control': 'public, max-age=31536000, immutable',
        'content-type': 'application/zip',
        'content-disposition': `attachment; filename="qubic-registry-epoch-${epoch}.zip"`,
      })
    })

    .get('/contract/:index/all.zip', async (c) => {
      const idx = Number(c.req.param('index'))
      if (!Number.isInteger(idx) || idx < 0)
        return c.json({ error: 'Invalid contract index', status: 400 }, 400)
      let name: string
      try {
        name = findContractByIndex(registry, idx)
      } catch {
        return c.json({ error: `Contract ${idx} not found`, status: 404 }, 404)
      }
      const epochs = await storage.listEpochs()
      const entries: Record<string, Uint8Array> = {}
      await Promise.all(
        epochs.map(async (epoch) => {
          const bytes = await storage.readFile(`epochs/${epoch}/${name}.json`)
          if (bytes) entries[`${epoch}/${name}.json`] = bytes
        }),
      )
      if (Object.keys(entries).length === 0)
        return c.json({ error: `No epoch snapshots found for contract ${idx}`, status: 404 }, 404)
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
      return binary(zipSync(entries), {
        'cache-control': 'public, max-age=3600',
        'content-type': 'application/zip',
        'content-disposition': `attachment; filename="qubic-registry-contract-${idx}-${slug}-all-epochs.zip"`,
      })
    })
}
