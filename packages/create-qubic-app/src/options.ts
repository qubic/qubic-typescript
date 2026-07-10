export type TemplateId = 'node' | 'vite-react' | 'next-react'
export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn'
export type ConnectorId = 'extension' | 'walletconnect' | 'none'
export type ToolingId = 'biome' | 'prettier' | 'eslint' | 'none'

export interface ScaffoldOptions {
  projectName: string
  targetDir: string
  template: TemplateId
  packageManager: PackageManager
  force: boolean
  install: boolean
  connectors: ConnectorId[]
  tooling: ToolingId[]
}

export interface TemplateFile {
  path: string
  content: string
}

export interface TemplateDefinition {
  id: TemplateId
  label: string
  files: (options: ScaffoldOptions) => TemplateFile[]
}

export const templateIds: TemplateId[] = ['node', 'vite-react', 'next-react']
export const packageManagers: PackageManager[] = ['bun', 'npm', 'pnpm', 'yarn']
export const connectorIds: ConnectorId[] = ['extension', 'walletconnect', 'none']
export const toolingIds: ToolingId[] = ['biome', 'prettier', 'eslint', 'none']

export function isTemplateId(value: string): value is TemplateId {
  return (templateIds as string[]).includes(value)
}

export function isPackageManager(value: string): value is PackageManager {
  return (packageManagers as string[]).includes(value)
}

export function isConnectorId(value: string): value is ConnectorId {
  return (connectorIds as string[]).includes(value)
}

export function isToolingId(value: string): value is ToolingId {
  return (toolingIds as string[]).includes(value)
}

export function installCommand(packageManager: PackageManager): string {
  switch (packageManager) {
    case 'bun':
      return 'bun install'
    case 'npm':
      return 'npm install'
    case 'pnpm':
      return 'pnpm install'
    case 'yarn':
      return 'yarn install'
  }
}

export function runCommand(packageManager: PackageManager, script: string): string {
  switch (packageManager) {
    case 'bun':
      return `bun run ${script}`
    case 'npm':
      return `npm run ${script}`
    case 'pnpm':
      return `pnpm ${script}`
    case 'yarn':
      return `yarn ${script}`
  }
}
