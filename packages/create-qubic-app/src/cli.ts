import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import {
  type PackageManager,
  type TemplateId,
  installCommand,
  isPackageManager,
  isTemplateId,
  packageManagers,
  runCommand,
  templateIds,
} from './options.js'
import { scaffold } from './scaffold.js'

interface CliOptions {
  projectName: string
  template: TemplateId
  packageManager: PackageManager
  outDir: string
  force: boolean
  install: boolean
}

export async function run(argv: string[]): Promise<void> {
  try {
    const options = parseCli(argv)
    const targetDir = resolve(options.outDir, options.projectName)
    mkdirSync(options.outDir, { recursive: true })

    const written = scaffold({
      projectName: options.projectName,
      targetDir,
      template: options.template,
      packageManager: options.packageManager,
      force: options.force,
      install: options.install,
    })

    printSuccess(options, targetDir, written)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    process.stderr.write(`${message}\n\n${usage()}`)
    process.exit(1)
  }
}

export function parseCli(argv: string[]): CliOptions {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      template: { type: 'string', short: 't' },
      pm: { type: 'string' },
      out: { type: 'string' },
      force: { type: 'boolean', default: false },
      install: { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  })

  if (values.help) {
    process.stdout.write(usage())
    process.exit(0)
  }

  const projectName = positionals[0]
  if (!projectName) throw new Error('Missing project name.')

  const templateValue = values.template ?? 'node'
  if (!isTemplateId(templateValue)) {
    throw new Error(`Unknown template "${templateValue}". Choose one of: ${templateIds.join(', ')}`)
  }

  const packageManagerValue = values.pm ?? 'bun'
  if (!isPackageManager(packageManagerValue)) {
    throw new Error(
      `Unknown package manager "${packageManagerValue}". Choose one of: ${packageManagers.join(', ')}`,
    )
  }

  return {
    projectName,
    template: templateValue,
    packageManager: packageManagerValue,
    outDir: values.out ?? process.cwd(),
    force: values.force ?? false,
    install: values.install ?? false,
  }
}

function printSuccess(options: CliOptions, targetDir: string, written: string[]) {
  const lines = [
    `Created ${options.projectName} in ${targetDir}`,
    '',
    `Files: ${written.length}`,
    '',
    'Next steps:',
    `  cd ${options.projectName}`,
    `  ${installCommand(options.packageManager)}`,
    `  ${runCommand(options.packageManager, 'dev')}`,
    '',
  ]

  if (!options.install) {
    lines.splice(4, 0, 'Dependencies were not installed automatically.', '')
  }

  process.stdout.write(`${lines.join('\n')}\n`)
}

function usage(): string {
  return `Usage:
  create-qubic-app <project-name> [options]

Options:
  -t, --template <name>   Template to use: ${templateIds.join(', ')}
      --pm <name>         Package manager: ${packageManagers.join(', ')}
      --out <dir>         Directory to create the project in
      --force             Overwrite a non-empty target directory
      --install           Reserved for future automatic install support
  -h, --help              Show help

Examples:
  create-qubic-app my-app --template node --pm bun
  create-qubic-app my-app --template node --pm npm --out ./examples
`
}
