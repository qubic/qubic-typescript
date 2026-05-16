#!/usr/bin/env bun
// Uploads all registry data to R2 via CF API (parallel).
// Usage: bun run scripts/seed-r2.ts
// Requires: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID env vars

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const BUCKET = 'registry-data'
const DATA_DIR = join(import.meta.dir, '../../../packages/registry/data')
const CONCURRENCY = 20

const TOKEN = process.env['CLOUDFLARE_API_TOKEN']
const ACCOUNT_ID = process.env['CLOUDFLARE_ACCOUNT_ID']
if (!TOKEN || !ACCOUNT_ID) {
  console.error('CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID must be set')
  process.exit(1)
}

const BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects`

async function upload(key: string, filePath: string, retries = 5): Promise<void> {
  const body = await Bun.file(filePath).arrayBuffer()
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(`${BASE}/${key}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json' },
      body,
    })
    if (res.ok) { console.log(`✓ ${key}`); return }
    const text = await res.text()
    if (attempt < retries && (res.status === 503 || res.status === 429)) {
      const delay = 500 * 2 ** attempt
      console.warn(`⚠ ${key} → ${res.status}, retrying in ${delay}ms...`)
      await Bun.sleep(delay)
      continue
    }
    throw new Error(`Failed to upload ${key}: ${res.status} ${text}`)
  }
}

async function runConcurrent(tasks: (() => Promise<void>)[]): Promise<void> {
  const queue = [...tasks]
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await queue.shift()!()
  })
  await Promise.all(workers)
}

async function main() {
  const tasks: (() => Promise<void>)[] = []

  tasks.push(() => upload('registry.json', join(DATA_DIR, 'registry.json')))
  tasks.push(() => upload('epoch-refs.json', join(DATA_DIR, 'epoch-refs.json')))

  const epochsDir = join(DATA_DIR, 'epochs')
  const epochs = readdirSync(epochsDir)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)

  for (const epoch of epochs) {
    const dir = join(epochsDir, String(epoch))
    if (!statSync(dir).isDirectory()) continue
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      const key = `epochs/${epoch}/${file}`
      const path = join(dir, file)
      tasks.push(() => upload(key, path))
    }
  }

  console.log(`Uploading ${tasks.length} files to R2 (concurrency=${CONCURRENCY})...`)
  await runConcurrent(tasks)
  console.log(`\nDone — seeded ${epochs.length} epochs to bucket "${BUCKET}"`)
}

main().catch((e) => { console.error(e); process.exit(1) })
