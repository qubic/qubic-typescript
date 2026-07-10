import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { cancel, confirm, intro, isCancel, multiselect, select, text } from '@clack/prompts'
import {
  type ConnectorId,
  type PackageManager,
  type TemplateId,
  type ToolingId,
  connectorIds,
  installCommand,
  isConnectorId,
  isPackageManager,
  isTemplateId,
  isToolingId,
  packageManagers,
  runCommand,
  templateIds,
  toolingIds,
} from './options.js'
import { scaffold } from './scaffold.js'
import { defaultTooling } from './tooling.js'

export interface CliOptions {
  projectName: string
  template: TemplateId
  packageManager: PackageManager
  outDir: string
  force: boolean
  install: boolean
  connectors: ConnectorId[]
  tooling: ToolingId[]
}

export type ConnectorPreset = 'extension' | 'extension-walletconnect' | 'walletconnect' | 'none'

export async function run(argv: string[]): Promise<void> {
  try {
    const options =
      shouldRunInteractive(argv) && isInteractiveShell() ? await promptCli() : parseCli(argv)
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
      tooling: options.tooling,
    })

    if (options.install) runInstall(options.packageManager, targetDir)

    printSuccess(options, targetDir, written)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    process.stderr.write(`${message}\n\n${usage()}`)
    process.exit(1)
  }
}

export function shouldRunInteractive(argv: string[]): boolean {
  return argv.length === 0
}

export function connectorsFromPreset(preset: ConnectorPreset): ConnectorId[] {
  switch (preset) {
    case 'extension':
      return ['extension']
    case 'extension-walletconnect':
      return ['extension', 'walletconnect']
    case 'walletconnect':
      return ['walletconnect']
    case 'none':
      return ['none']
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
      tooling: { type: 'string' },
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
  const tooling = parseTooling(values.tooling)

  return {
    projectName,
    template: templateValue,
    packageManager: packageManagerValue,
    outDir: values.out ?? process.cwd(),
    force: values.force ?? false,
    install: values.install ?? false,
    connectors,
    tooling,
  }
}

async function promptCli(): Promise<CliOptions> {
  intro('create-qubic-app')

  const projectName = unwrapPrompt(
    await text({
      message: 'Project name',
      placeholder: 'my-qubic-app',
      validate(value) {
        const name = value?.trim() ?? ''
        if (name.length === 0) return 'Project name is required.'
        if (hasInvalidPathCharacter(name)) return 'Project name contains invalid path characters.'
        return undefined
      },
    }),
  ).trim()

  const template = unwrapPrompt(
    await select<TemplateId>({
      message: 'Template',
      initialValue: 'vite-react',
      options: [
        { value: 'node', label: 'Node/Bun script', hint: 'RPC, wallet, transfer, contracts' },
        { value: 'vite-react', label: 'Vite React dApp', hint: 'Fast browser starter' },
        { value: 'next-react', label: 'Next.js React dApp', hint: 'App router starter' },
      ],
    }),
  )

  const packageManager = unwrapPrompt(
    await select<PackageManager>({
      message: 'Package manager',
      initialValue: 'bun',
      options: packageManagers.map((value) => ({ value, label: value })),
    }),
  )

  const connectors: ConnectorId[] =
    template === 'node'
      ? ['extension']
      : connectorsFromPreset(
          unwrapPrompt(
            await select<ConnectorPreset>({
              message: 'Wallet connectors',
              initialValue: 'extension-walletconnect',
              options: [
                { value: 'extension', label: 'Wallet extension' },
                { value: 'extension-walletconnect', label: 'Wallet extension + WalletConnect' },
                { value: 'walletconnect', label: 'WalletConnect only' },
                { value: 'none', label: 'No wallet connectors' },
              ],
            }),
          ),
        )

  const tooling = unwrapPrompt(
    await multiselect<ToolingId>({
      message: 'Code quality tooling',
      initialValues: defaultTooling(),
      required: true,
      options: [
        { value: 'biome', label: 'Biome', hint: 'fast formatter + linter' },
        { value: 'prettier', label: 'Prettier', hint: 'formatter' },
        {
          value: 'eslint',
          label: eslintToolingLabel(template),
          hint: 'template-aware lint config',
        },
        { value: 'none', label: 'No lint or format tooling' },
      ],
    }),
  )

  const normalizedTooling: ToolingId[] = tooling.includes('none') ? ['none'] : tooling

  const outDir = unwrapPrompt(
    await text({
      message: 'Create inside directory',
      defaultValue: process.cwd(),
      placeholder: process.cwd(),
      validate(value) {
        if ((value?.trim() ?? '').length === 0) return 'Directory is required.'
        return undefined
      },
    }),
  ).trim()

  const targetDir = resolve(outDir, projectName)
  const force =
    existsSync(targetDir) && readdirSync(targetDir).length > 0
      ? unwrapPrompt(
          await confirm({
            message: `${targetDir} is not empty. Overwrite it?`,
            initialValue: false,
          }),
        )
      : false

  if (!force && existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  const install = unwrapPrompt(
    await confirm({
      message: 'Install dependencies now?',
      initialValue: false,
    }),
  )

  return {
    projectName,
    template,
    packageManager,
    outDir,
    force,
    install,
    connectors,
    tooling: normalizedTooling,
  }
}

function unwrapPrompt<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }
  return value as T
}

function isInteractiveShell(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY)
}

function hasInvalidPathCharacter(value: string): boolean {
  return [...value].some((char) => char.charCodeAt(0) < 32 || '<>:"|?*'.includes(char))
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

function parseTooling(value: string | undefined): ToolingId[] {
  if (!value || value.trim().length === 0) return defaultTooling()

  const parsed = value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

  if (parsed.length === 0) return defaultTooling()
  if (parsed.includes('none') && parsed.length > 1) {
    throw new Error('Tooling "none" cannot be combined with other tooling options.')
  }

  for (const tool of parsed) {
    if (!isToolingId(tool)) {
      throw new Error(`Unknown tooling "${tool}". Choose one of: ${toolingIds.join(', ')}`)
    }
  }

  return parsed as ToolingId[]
}

function eslintToolingLabel(template: TemplateId): string {
  switch (template) {
    case 'node':
      return 'ESLint for Node/TypeScript'
    case 'vite-react':
      return 'ESLint for Vite React'
    case 'next-react':
      return 'ESLint for Next.js'
  }
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
  create-qubic-app [project-name] [options]
  create-qubic-app

Options:
  -t, --template <name>   Template to use: ${templateIds.join(', ')}
      --pm <name>         Package manager: ${packageManagers.join(', ')}
      --out <dir>         Directory to create the project in
      --connectors <list> Connector list for web templates: ${connectorIds.join(', ')}
      --tooling <list>    Tooling list: ${toolingIds.join(', ')}
      --force             Overwrite a non-empty target directory
      --install           Install dependencies after scaffolding
  -h, --help              Show help

Examples:
  create-qubic-app
  create-qubic-app my-app --template node --pm bun
  create-qubic-app my-app --template node --pm npm --out ./examples
  create-qubic-app my-dapp --template vite-react --connectors extension,walletconnect
  create-qubic-app my-next-app --template next-react --tooling biome,eslint
`
}
