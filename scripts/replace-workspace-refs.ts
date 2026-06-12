#!/usr/bin/env bun
// Replaces workspace:* / workspace:^ / workspace:~ refs in all packages/*/package.json
// with the actual version from the referenced package. Run after `changeset version`.

import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dir, '..')
const packagesDir = join(root, 'packages')

// Build a name → version map from all workspace packages
const versionMap = new Map<string, string>()
for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const pkgPath = join(packagesDir, entry.name, 'package.json')
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { name?: string; version?: string }
    if (pkg.name && pkg.version) versionMap.set(pkg.name, pkg.version)
  } catch {}
}

const WORKSPACE_RE = /^workspace:([*^~])$/

function replaceDeps(deps: Record<string, string> | undefined): boolean {
  if (!deps) return false
  let changed = false
  for (const [name, range] of Object.entries(deps)) {
    const match = WORKSPACE_RE.exec(range)
    if (match) {
      const version = versionMap.get(name)
      if (version) {
        const prefix = match[1] === '*' ? '^' : match[1]
        deps[name] = `${prefix}${version}`
        changed = true
      }
    }
  }
  return changed
}

let updated = 0
for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const pkgPath = join(packagesDir, entry.name, 'package.json')
  try {
    const raw = readFileSync(pkgPath, 'utf-8')
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
      peerDependencies?: Record<string, string>
    }
    const changed =
      replaceDeps(pkg.dependencies) ||
      replaceDeps(pkg.devDependencies) ||
      replaceDeps(pkg.peerDependencies)
    if (changed) {
      writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
      updated++
    }
  } catch {}
}

console.log(`Replaced workspace: refs in ${updated} package(s).`)
