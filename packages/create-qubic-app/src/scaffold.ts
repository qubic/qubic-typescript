import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { ScaffoldOptions } from './options.js'
import { getTemplate } from './templates/index.js'

export function scaffold(options: ScaffoldOptions): string[] {
  if (existsSync(options.targetDir)) {
    const entries = readdirSync(options.targetDir)
    if (entries.length > 0 && !options.force) {
      throw new Error(`${options.targetDir} is not empty. Re-run with --force to overwrite.`)
    }
  }

  mkdirSync(options.targetDir, { recursive: true })

  const template = getTemplate(options.template)
  const written: string[] = []
  for (const file of template.files(options)) {
    const path = join(options.targetDir, file.path)
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, file.content)
    written.push(file.path)
  }

  return written
}
