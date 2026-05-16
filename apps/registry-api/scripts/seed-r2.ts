#!/usr/bin/env bun
// Uploads registry data to R2 via Cloudflare REST API with parallel uploads.
// State is tracked in .seed-state.json next to this script.
//
// Usage:
//   bun run scripts/seed-r2.ts            # uploads missing epochs
//   bun run scripts/seed-r2.ts --from 200 # upload epochs >= 200 (ignores state file)
//
// Requires: CLOUDFLARE_API_TOKEN env var
// Optional: CLOUDFLARE_ACCOUNT_ID env var (auto-fetched if not set)

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BUCKET = 'registry-data'
const DATA_DIR = join(import.meta.dir, '../../../packages/registry/data')
const STATE_FILE = join(import.meta.dir, '.seed-state.json')
const CONCURRENCY = 20

const TOKEN = process.env.CLOUDFLARE_API_TOKEN
if (!TOKEN) throw new Error('CLOUDFLARE_API_TOKEN is not set')

async function getAccountId(): Promise<string> {
  if (process.env.CLOUDFLARE_ACCOUNT_ID) return process.env.CLOUDFLARE_ACCOUNT_ID
  const res = await fetch('https://api.cloudflare.com/client/v4/accounts', {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  const json = (await res.json()) as { result: { id: string; name: string }[] }
  if (!json.result?.length) throw new Error('No Cloudflare accounts found for this token')
  if (json.result.length === 1) return json.result[0].id
  throw new Error(
    `Multiple accounts found — set CLOUDFLARE_ACCOUNT_ID to one of:\n${json.result.map((a) => `  ${a.id}  ${a.name}`).join('\n')}`,
  )
}

async function upload(accountId: string, key: string, content: Uint8Array): Promise<void> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${BUCKET}/objects/${key}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: content,
  })
  if (!res.ok) throw new Error(`Failed to upload ${key}: ${res.status} ${await res.text()}`)
  console.log(`✓ ${key}`)
}

async function withConcurrency(tasks: (() => Promise<void>)[]): Promise<void> {
  const queue = [...tasks]
  const workers = Array.from({ length: Math.min(CONCURRENCY, tasks.length) }, async () => {
    while (queue.length > 0) await queue.shift()?.()
  })
  await Promise.all(workers)
}

function readState(): Set<number> {
  try {
    const { epochs } = JSON.parse(readFileSync(STATE_FILE, 'utf8'))
    return new Set<number>(epochs)
  } catch {
    return new Set()
  }
}

function saveState(seeded: Set<number>) {
  writeFileSync(STATE_FILE, JSON.stringify({ epochs: [...seeded].sort((a, b) => a - b) }, null, 2))
}

async function main() {
  const accountId = await getAccountId()

  const fromArg = process.argv.indexOf('--from')
  const fromEpoch = fromArg !== -1 ? Number(process.argv[fromArg + 1]) : undefined

  // Upload root files
  for (const file of ['registry.json', 'epoch-refs.json']) {
    const content = await Bun.file(join(DATA_DIR, file)).bytes()
    await upload(accountId, file, content)
  }

  const epochsDir = join(DATA_DIR, 'epochs')
  const allEpochs = readdirSync(epochsDir)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)

  const seeded = readState()
  const toUpload =
    fromEpoch !== undefined
      ? allEpochs.filter((e) => e >= fromEpoch)
      : allEpochs.filter((e) => !seeded.has(e))

  if (toUpload.length === 0) {
    console.log('Nothing to upload — all epochs already seeded.')
    return
  }

  console.log(
    `Uploading ${toUpload.length} epochs (${toUpload[0]} – ${toUpload.at(-1)})${fromEpoch !== undefined ? ` [--from ${fromEpoch}]` : ` [${seeded.size} already seeded]`}`,
  )

  // Build all upload tasks across all epochs
  const tasks: (() => Promise<void>)[] = []
  const epochFiles = new Map<number, string[]>()

  for (const epoch of toUpload) {
    const dir = join(epochsDir, String(epoch))
    if (!statSync(dir).isDirectory()) continue
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
    epochFiles.set(epoch, files)
    for (const file of files) {
      tasks.push(async () => {
        const content = await Bun.file(join(dir, file)).bytes()
        await upload(accountId, `epochs/${epoch}/${file}`, content)
      })
    }
  }

  await withConcurrency(tasks)

  // Mark all epochs as seeded
  for (const epoch of toUpload) seeded.add(epoch)
  saveState(seeded)

  console.log(`\nDone — seeded ${toUpload.length} epochs (${tasks.length} files) to "${BUCKET}"`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
