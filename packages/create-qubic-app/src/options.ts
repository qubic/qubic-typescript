export type TemplateId = 'node'
export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn'

export interface ScaffoldOptions {
  projectName: string
  targetDir: string
  template: TemplateId
  packageManager: PackageManager
  force: boolean
  install: boolean
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

export const templateIds: TemplateId[] = ['node']
export const packageManagers: PackageManager[] = ['bun', 'npm', 'pnpm', 'yarn']

export function isTemplateId(value: string): value is TemplateId {
  return (templateIds as string[]).includes(value)
}

export function isPackageManager(value: string): value is PackageManager {
  return (packageManagers as string[]).includes(value)
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
