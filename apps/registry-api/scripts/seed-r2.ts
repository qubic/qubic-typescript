#!/usr/bin/env bun
// Uploads registry data to R2 via wrangler, skipping already-seeded epochs.
// State is tracked in .seed-state.json next to this script.
//
// Usage:
//   bun run scripts/seed-r2.ts            # uploads missing epochs
//   bun run scripts/seed-r2.ts --from 200 # upload epochs >= 200 (ignores state file)
//
// Requires: wrangler login or CLOUDFLARE_API_TOKEN env var

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BUCKET = 'registry-data'
const DATA_DIR = join(import.meta.dir, '../../../packages/registry/data')
const STATE_FILE = join(import.meta.dir, '.seed-state.json')

function readState(): Set<number> {
  try {
    const { epochs } = JSON.parse(readFileSync(STATE_FILE, 'utf8'))
    return new Set<number>(epochs)
  } catch {
    return new Set()
  }
}

function saveState(seeded: Set<number>) {
  writeFileSync(
    STATE_FILE,
    JSON.stringify({ epochs: [...seeded].sort((a, b) => a - b) }, null, 2),
  )
}

async function upload(key: string, filePath: string): Promise<void> {
  const proc = Bun.spawn(
    [
      'bunx',
      'wrangler',
      'r2',
      'object',
      'put',
      `${BUCKET}/${key}`,
      '--file',
      filePath,
      '--content-type',
      'application/json',
    ],
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
  const fromArg = process.argv.indexOf('--from')
  const fromEpoch = fromArg !== -1 ? Number(process.argv[fromArg + 1]) : undefined

  await upload('registry.json', join(DATA_DIR, 'registry.json'))
  await upload('epoch-refs.json', join(DATA_DIR, 'epoch-refs.json'))

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
    `Uploading ${toUpload.length} epochs (${toUpload[0]} – ${toUpload.at(-1)})` +
      (fromEpoch !== undefined ? ` [--from ${fromEpoch}]` : ` [${seeded.size} already seeded]`),
  )

  for (const epoch of toUpload) {
    const dir = join(epochsDir, String(epoch))
    if (!statSync(dir).isDirectory()) continue
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      await upload(`epochs/${epoch}/${file}`, join(dir, file))
    }
    seeded.add(epoch)
    saveState(seeded)
  }

  console.log(`\nDone — seeded ${toUpload.length} epochs to bucket "${BUCKET}"`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
