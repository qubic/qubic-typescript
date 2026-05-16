#!/usr/bin/env bun
// Uploads registry data to R2 via wrangler, skipping epochs already present.
// Usage: bun run scripts/seed-r2.ts
// Requires: wrangler login or CLOUDFLARE_API_TOKEN env var

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const BUCKET = 'registry-data'
const DATA_DIR = join(import.meta.dir, '../../../packages/registry/data')

async function listExistingEpochs(): Promise<Set<number>> {
  const existing = new Set<number>()
  let cursor: string | undefined

  while (true) {
    const args = ['bunx', 'wrangler', 'r2', 'object', 'list', BUCKET, '--prefix', 'epochs/']
    if (cursor) args.push('--cursor', cursor)

    const proc = Bun.spawn(args, { stdout: 'pipe', stderr: 'ignore' })
    await proc.exited
    if (proc.exitCode !== 0) break

    const text = (await new Response(proc.stdout).text()).trim()
    if (!text) break

    try {
      const parsed = JSON.parse(text)
      // handle both [{key}] and {objects:[{key}], truncated, cursor} shapes
      const objects: { key: string }[] = Array.isArray(parsed) ? parsed : (parsed.objects ?? [])
      for (const obj of objects) {
        const match = obj.key?.match(/^epochs\/(\d+)\//)
        if (match) existing.add(Number(match[1]))
      }
      if (!parsed.truncated) break
      cursor = parsed.cursor
    } catch {
      console.warn('Could not parse wrangler list output, uploading all epochs\nRaw output:', text.slice(0, 200))
      break
    }
  }

  return existing
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
  await upload('registry.json', join(DATA_DIR, 'registry.json'))
  await upload('epoch-refs.json', join(DATA_DIR, 'epoch-refs.json'))

  const epochsDir = join(DATA_DIR, 'epochs')
  const epochs = readdirSync(epochsDir)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)

  const existing = await listExistingEpochs()
  console.log(`R2 already has ${existing.size} epochs — skipping those`)

  const toUpload = epochs.filter((e) => !existing.has(e))
  console.log(`Uploading ${toUpload.length} new epochs (${toUpload[0] ?? '—'} – ${toUpload.at(-1) ?? '—'})`)

  for (const epoch of toUpload) {
    const dir = join(epochsDir, String(epoch))
    if (!statSync(dir).isDirectory()) continue
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      await upload(`epochs/${epoch}/${file}`, join(dir, file))
    }
  }

  console.log(`\nDone — seeded ${toUpload.length} new epochs to bucket "${BUCKET}"`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
