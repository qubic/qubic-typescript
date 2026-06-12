#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const hookContents = `#!/bin/sh
bunx --bun commitlint --edit "$1"
`

function getHooksPath() {
  try {
    return execSync('git rev-parse --git-path hooks', {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return undefined
  }
}

const hooksPath = getHooksPath()

if (!hooksPath) {
  console.info('[INFO] No git repository found, skipping hook install')
  process.exit(0)
}

const hookPath = resolve(process.cwd(), hooksPath, 'commit-msg')
mkdirSync(dirname(hookPath), { recursive: true })

try {
  if (readFileSync(hookPath, 'utf-8') === hookContents) {
    chmodSync(hookPath, 0o755)
    process.exit(0)
  }
} catch {
  // Hook does not exist yet.
}

writeFileSync(hookPath, hookContents)
chmodSync(hookPath, 0o755)
console.info('[INFO] Installed commit-msg hook')
