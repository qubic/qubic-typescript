#!/usr/bin/env bun
import { readFileSync } from 'node:fs'
import { glob } from 'node:fs/promises'

const files: string[] = []
for (const pattern of ['README.md', 'packages/*/README.md', 'apps/docs/content/docs/**/*.mdx']) {
  for await (const path of glob(pattern)) {
    files.push(path)
  }
}

const forbidden: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /buildTransfer\s*\(/g,
    message: 'Use wallet.buildTransaction(), not wallet.buildTransfer().',
  },
  {
    pattern: /buildScTransaction\s*\(/g,
    message: 'Use wallet.buildContractCall(), not wallet.buildScTransaction().',
  },
  {
    pattern: /peersBroadcasted\b/g,
    message: 'Use peersBroadcastedTo, the current RPC response field.',
  },
  {
    pattern: /const\s*\{\s*tick(?:\s*,\s*epoch)?\s*}\s*=\s*await\s+live\.getTickInfo\(\)/g,
    message: 'live.getTickInfo() returns Result<T,E>; handle result.ok before destructuring.',
  },
  {
    pattern: /const\s*\{\s*tickInfo\s*}\s*=\s*await\s+live\.getTickInfo\(\)/g,
    message: 'live.getTickInfo() returns Result<T,E>; handle result.ok before destructuring.',
  },
  {
    pattern: /const\s*\{\s*balance\s*}\s*=\s*await\s+live\.getBalance\(/g,
    message: 'live.getBalance() returns Result<T,E>; handle result.ok before reading balance.',
  },
  {
    pattern: /await\s+archive\.getTransaction\(/g,
    message: 'Use archive.getTransactionByHash() or the actual current query API.',
  },
  {
    pattern: /YOUR_WC_PROJECT_ID/g,
    message: 'Avoid non-runnable placeholders in primary examples.',
  },
  {
    pattern: /metadata:\s*\{\s*\.\.\.\s*}/g,
    message: 'Do not leave ellipsis placeholders in runnable examples.',
  },
]

const failures: string[] = []
for (const file of files.sort()) {
  const text = readFileSync(file, 'utf8')
  for (const { pattern, message } of forbidden) {
    const match = pattern.exec(text)
    pattern.lastIndex = 0
    if (match) failures.push(`${file}: ${message}`)
  }
}

if (failures.length > 0) {
  console.error('Docs example sanity check failed:\n')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Docs example sanity check passed for ${files.length} files.`)
