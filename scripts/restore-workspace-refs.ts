#!/usr/bin/env bun
// Restores workspace:* refs in packages/*/package.json and sets version to the given base.
// Usage: bun scripts/restore-workspace-refs.ts [--version <ver>]
// Example: bun scripts/restore-workspace-refs.ts --version 0.2.0

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dir, '..')
const packagesDir = join(root, 'packages')

const versionArg = process.argv.indexOf('--version')
const targetVersion = versionArg >= 0 ? process.argv[versionArg + 1] : undefined

// Collect all workspace package names
const workspaceNames = new Set<string>()
for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  try {
    const pkg = JSON.parse(
      readFileSync(join(packagesDir, entry.name, 'package.json'), 'utf-8'),
    ) as { name?: string }
    if (pkg.name) workspaceNames.add(pkg.name)
  } catch {}
}

const SEMVER_RE = /^\^?\d+\.\d+\.\d+$/

function restoreDeps(deps: Record<string, string> | undefined): boolean {
  if (!deps) return false
  let changed = false
  for (const [name, range] of Object.entries(deps)) {
    if (workspaceNames.has(name) && SEMVER_RE.test(range)) {
      deps[name] = 'workspace:*'
      changed = true
    }
  }
  return changed
}

let updated = 0
for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const pkgPath = join(packagesDir, entry.name, 'package.json')
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
      version?: string
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
      peerDependencies?: Record<string, string>
    }
    let changed = false
    if (targetVersion && pkg.version !== undefined) {
      pkg.version = targetVersion
      changed = true
    }
    changed = restoreDeps(pkg.dependencies) || changed
    changed = restoreDeps(pkg.devDependencies) || changed
    changed = restoreDeps(pkg.peerDependencies) || changed
    if (changed) {
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
      updated++
    }
  } catch {}
}

console.log(
  `Restored ${updated} package(s) to workspace:* refs${targetVersion ? ` at v${targetVersion}` : ''}.`,
)
