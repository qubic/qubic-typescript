import { existsSync, readdirSync } from 'node:fs'
import { findContractByIndex } from '@qubic.ts/registry'
import registry from '@qubic.ts/registry/registry.json'
import { Elysia } from 'elysia'
import { zipSync } from 'fflate'

const REGISTRY_SRC = Bun.resolveSync('@qubic.ts/registry', import.meta.dir)
const DATA_DIR = REGISTRY_SRC.replace(/\/src\/index\.ts$/, '/data/')
const EPOCHS_DIR = `${DATA_DIR}epochs/`

async function readFile(path: string): Promise<Uint8Array> {
  return new Uint8Array(await Bun.file(path).arrayBuffer())
}

function epochDirs(): number[] {
  return readdirSync(EPOCHS_DIR)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)
}

export const downloadRoutes = new Elysia({ prefix: '/download' })
  .get('/registry.json', async ({ set }) => {
    const bytes = await readFile(`${DATA_DIR}registry.json`)
    set.headers['content-type'] = 'application/json'
    set.headers['content-disposition'] = 'attachment; filename="registry.json"'
    return bytes
  })

  .get('/epoch/:epoch/:contract', async ({ params, status, set }) => {
    const { epoch, contract } = params
    const filename = contract.endsWith('.json') ? contract : `${contract}.json`
    const path = `${EPOCHS_DIR}${epoch}/${filename}`
    if (!existsSync(path)) {
      return status(404, {
        error: `No snapshot found for ${contract} at epoch ${epoch}`,
        status: 404,
      })
    }
    const bytes = await readFile(path)
    set.headers['content-type'] = 'application/json'
    set.headers['content-disposition'] = `attachment; filename="${filename}"`
    return bytes
  })

  .get('/epoch/:epoch/all.zip', async ({ params, status, set }) => {
    const epoch = Number(params.epoch)
    if (Number.isNaN(epoch)) return status(400, { error: 'Invalid epoch', status: 400 })
    const dir = `${EPOCHS_DIR}${epoch}/`
    if (!existsSync(dir)) return status(404, { error: `No data for epoch ${epoch}`, status: 404 })

    const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
    if (files.length === 0)
      return status(404, { error: `No contracts at epoch ${epoch}`, status: 404 })

    const entries: Record<string, Uint8Array> = {}
    for (const f of files) {
      entries[f] = await readFile(`${EPOCHS_DIR}${epoch}/${f}`)
    }

    const zip = zipSync(entries)
    set.headers['content-type'] = 'application/zip'
    set.headers['content-disposition'] = `attachment; filename="qubic-registry-epoch-${epoch}.zip"`
    return zip
  })

  .get('/contract/:index/all.zip', async ({ params, status, set }) => {
    const idx = Number(params.index)
    if (Number.isNaN(idx)) return status(400, { error: 'Invalid contract index', status: 400 })

    let name: string
    try {
      name = findContractByIndex(registry as Parameters<typeof findContractByIndex>[0], idx)
    } catch {
      return status(404, { error: `Contract ${idx} not found`, status: 404 })
    }

    const entries: Record<string, Uint8Array> = {}
    for (const epoch of epochDirs()) {
      const path = `${EPOCHS_DIR}${epoch}/${name}.json`
      if (existsSync(path)) {
        entries[`${epoch}/${name}.json`] = await readFile(path)
      }
    }

    if (Object.keys(entries).length === 0) {
      return status(404, { error: `No epoch snapshots found for contract ${idx}`, status: 404 })
    }

    const zip = zipSync(entries)
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    set.headers['content-type'] = 'application/zip'
    set.headers['content-disposition'] =
      `attachment; filename="qubic-registry-contract-${idx}-${slug}-all-epochs.zip"`
    return zip
  })
