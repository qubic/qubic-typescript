#!/usr/bin/env bun
// Resolves merge conflicts in generated files after `git pull origin main`:
//   - package.json: keep ours (dev's newer version)
//   - CHANGELOG.md: prepend ours (new version entry) above theirs (existing entries)

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dir, '..')

function conflictedFiles(): string[] {
  return execSync('git diff --name-only --diff-filter=U', { cwd: root })
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean)
}

const files = conflictedFiles()
if (files.length === 0) {
  console.log('No conflicts to resolve.')
  process.exit(0)
}

for (const rel of files) {
  const abs = join(root, rel)

  if (rel.endsWith('package.json')) {
    execSync(`git checkout --ours -- "${rel}"`, { cwd: root })
    execSync(`git add "${rel}"`, { cwd: root })
    console.log(`package.json  ours  ${rel}`)
    continue
  }

  if (rel.endsWith('CHANGELOG.md')) {
    const raw = readFileSync(abs, 'utf-8')
    // Extract ours (<<<<<<< HEAD … =======) and theirs (======= … >>>>>>>)
    const oursMatch = raw.match(/<<<<<<< HEAD\n([\s\S]*?)=======/)
    const theirsMatch = raw.match(/=======\n([\s\S]*?)>>>>>>>/)
    const ours = oursMatch?.[1] ?? ''
    const theirs = theirsMatch?.[1] ?? ''
    // Find the title line (e.g. "# @qubic.org/react\n\n")
    const titleMatch = raw.match(/^(# .+?\n\n)/)
    const title = titleMatch?.[1] ?? ''
    const oursBody = ours.replace(title, '')
    const resolved = `${title}${oursBody}\n${theirs}`
    writeFileSync(abs, resolved)
    execSync(`git add "${rel}"`, { cwd: root })
    console.log(`CHANGELOG.md  merged  ${rel}`)
    continue
  }

  // Anything else: take ours
  execSync(`git checkout --ours -- "${rel}"`, { cwd: root })
  execSync(`git add "${rel}"`, { cwd: root })
  console.log(`other         ours  ${rel}`)
}

execSync('git add -u', { cwd: root })
console.log('\nConflicts resolved. Run: git commit')
