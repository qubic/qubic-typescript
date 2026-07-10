import { spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import {
  type ConnectorId,
  type PackageManager,
  type TemplateId,
  connectorIds,
  installCommand,
  isConnectorId,
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
  connectors: ConnectorId[]
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
      connectors: options.connectors,
    })

    if (options.install) runInstall(options.packageManager, targetDir)

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
      connectors: { type: 'string' },
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

  const connectors = parseConnectors(values.connectors)

  return {
    projectName,
    template: templateValue,
    packageManager: packageManagerValue,
    outDir: values.out ?? process.cwd(),
    force: values.force ?? false,
    install: values.install ?? false,
    connectors,
  }
}

function parseConnectors(value: string | undefined): ConnectorId[] {
  if (!value || value.trim().length === 0) return ['extension']

  const parsed = value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

  if (parsed.length === 0) return ['extension']
  if (parsed.includes('none') && parsed.length > 1) {
    throw new Error('Connector "none" cannot be combined with other connectors.')
  }

  for (const connector of parsed) {
    if (!isConnectorId(connector)) {
      throw new Error(`Unknown connector "${connector}". Choose one of: ${connectorIds.join(', ')}`)
    }
  }

  return parsed as ConnectorId[]
}

function runInstall(packageManager: PackageManager, cwd: string) {
  const command = packageManager
  const args = packageManager === 'yarn' ? ['install'] : ['install']
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`${installCommand(packageManager)} failed`)
}

function printSuccess(options: CliOptions, targetDir: string, written: string[]) {
  const lines = [
    `Created ${options.projectName} in ${targetDir}`,
    '',
    `Files: ${written.length}`,
    '',
  ]

  if (options.install) {
    lines.push('Dependencies installed.', '')
  } else {
    lines.push('Dependencies were not installed automatically.', '')
  }

  lines.push(
    'Next steps:',
    `  cd ${options.projectName}`,
    ...(options.install ? [] : [`  ${installCommand(options.packageManager)}`]),
    `  ${runCommand(options.packageManager, 'dev')}`,
    '',
  )

  process.stdout.write(`${lines.join('\n')}\n`)
}

function usage(): string {
  return `Usage:
  create-qubic-app <project-name> [options]

Options:
  -t, --template <name>   Template to use: ${templateIds.join(', ')}
      --pm <name>         Package manager: ${packageManagers.join(', ')}
      --out <dir>         Directory to create the project in
      --connectors <list> Connector list for web templates: ${connectorIds.join(', ')}
      --force             Overwrite a non-empty target directory
      --install           Install dependencies after scaffolding
  -h, --help              Show help

Examples:
  create-qubic-app my-app --template node --pm bun
  create-qubic-app my-app --template node --pm npm --out ./examples
  create-qubic-app my-dapp --template vite-react --connectors extension,walletconnect
`
}
