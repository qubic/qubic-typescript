#!/usr/bin/env bun
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { validateRegistry } from '../src/registry.js'
import type { ContractRegistry } from '../src/types.js'

const arg = process.argv[2]
const registryPath = arg ?? join(import.meta.dir, '../data/registry.json')

let registry: ContractRegistry
try {
  registry = JSON.parse(readFileSync(registryPath, 'utf-8')) as ContractRegistry
} catch (e) {
  console.error(`Failed to load registry from ${registryPath}:`, e)
  process.exit(1)
}

try {
  validateRegistry(registry)
  console.log(`✓ Registry at ${registryPath} is valid (${registry.versions.length} version(s))`)
} catch (e) {
  console.error(`✗ Validation failed:`, e instanceof Error ? e.message : e)
  process.exit(1)
}
