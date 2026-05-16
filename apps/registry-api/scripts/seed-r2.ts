#!/usr/bin/env bun
// Uploads all registry data to R2 via wrangler (sequential).
// Usage: bun run scripts/seed-r2.ts
// Requires: wrangler login or CLOUDFLARE_API_TOKEN env var

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const BUCKET = 'registry-data'
const DATA_DIR = join(import.meta.dir, '../../../packages/registry/data')

async function upload(key: string, filePath: string): Promise<void> {
  const proc = Bun.spawn(
    ['bunx', 'wrangler', 'r2', 'object', 'put', `${BUCKET}/${key}`,
     '--file', filePath, '--content-type', 'application/json'],
    { stdout: 'ignore', stderr: 'pipe' },
  )
  await proc.exited
  if (proc.exitCode !== 0) {
    const err = await new Response(proc.stderr).text()
    throw new Error(`Failed to upload ${key}: ${err}`)
  }
  console.log(`✓ ${key}`)
}

async function main() {
  await upload('registry.json', join(DATA_DIR, 'registry.json'))
  await upload('epoch-refs.json', join(DATA_DIR, 'epoch-refs.json'))

  const epochsDir = join(DATA_DIR, 'epochs')
  const epochs = readdirSync(epochsDir)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)

  for (const epoch of epochs) {
    const dir = join(epochsDir, String(epoch))
    if (!statSync(dir).isDirectory()) continue
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      await upload(`epochs/${epoch}/${file}`, join(dir, file))
    }
  }

  console.log(`\nDone — seeded ${epochs.length} epochs to bucket "${BUCKET}"`)
}

main().catch((e) => { console.error(e); process.exit(1) })
