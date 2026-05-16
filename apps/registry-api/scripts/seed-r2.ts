#!/usr/bin/env bun
// Uploads all registry data to R2.
// Usage: bun run scripts/seed-r2.ts
// Requires: wrangler login (CLOUDFLARE_API_TOKEN or interactive auth)

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const BUCKET = 'registry-data'
const DATA_DIR = join(import.meta.dir, '../../../packages/registry/data')

async function upload(key: string, filePath: string, contentType: string) {
  const proc = Bun.spawn(
    ['bunx', 'wrangler', 'r2', 'object', 'put', `${BUCKET}/${key}`, '--file', filePath, '--content-type', contentType],
    { stdout: 'pipe', stderr: 'pipe' },
  )
  await proc.exited
  if (proc.exitCode !== 0) {
    const err = await new Response(proc.stderr).text()
    throw new Error(`Failed to upload ${key}: ${err}`)
  }
  console.log(`✓ ${key}`)
}

async function main() {
  // Static files
  await upload('registry.json', join(DATA_DIR, 'registry.json'), 'application/json')
  await upload('epoch-refs.json', join(DATA_DIR, 'epoch-refs.json'), 'application/json')

  // Epoch snapshots
  const epochsDir = join(DATA_DIR, 'epochs')
  const epochs = readdirSync(epochsDir)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)

  for (const epoch of epochs) {
    const dir = join(epochsDir, String(epoch))
    if (!statSync(dir).isDirectory()) continue
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
    for (const file of files) {
      await upload(`epochs/${epoch}/${file}`, join(dir, file), 'application/json')
    }
  }

  console.log(`\nDone — uploaded ${epochs.length} epochs to R2 bucket "${BUCKET}"`)
}

main().catch((e) => { console.error(e); process.exit(1) })
