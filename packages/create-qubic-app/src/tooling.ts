import type { TemplateFile, TemplateId, ToolingId } from './options.js'

const TOOLING_IGNORES: Record<TemplateId, string[]> = {
  node: ['dist', 'node_modules'],
  'vite-react': ['dist', 'node_modules'],
  'next-react': ['.next', 'out', 'node_modules'],
}

export function defaultTooling(): ToolingId[] {
  return ['biome']
}

export function hasTooling(tooling: ToolingId[], id: ToolingId): boolean {
  return tooling.includes(id)
}

export function applyToolingToPackage(
  template: TemplateId,
  tooling: ToolingId[],
  scripts: Record<string, string>,
  devDependencies: Record<string, string>,
): void {
  const active = tooling.filter((tool) => tool !== 'none')
  const lintCommands: string[] = []
  const formatCommands: string[] = []

  if (active.includes('biome')) {
    devDependencies['@biomejs/biome'] = '^1.9.4'
    lintCommands.push('biome check .')
    formatCommands.push('biome format --write .')
  }

  if (active.includes('eslint')) {
    Object.assign(devDependencies, { eslint: '^9.18.0' })
    lintCommands.push('eslint .')

    if (template === 'next-react') {
      devDependencies['@eslint/eslintrc'] = '^3.2.0'
      devDependencies['eslint-config-next'] = '^15.0.0'
    } else {
      devDependencies['@eslint/js'] = '^9.18.0'
      Object.assign(devDependencies, { globals: '^15.14.0' })
      devDependencies['typescript-eslint'] = '^8.20.0'
    }

    if (template === 'vite-react') {
      devDependencies['eslint-plugin-react-hooks'] = '^5.1.0'
      devDependencies['eslint-plugin-react-refresh'] = '^0.4.16'
    }
  }

  if (active.includes('prettier')) {
    Object.assign(devDependencies, { prettier: '^3.4.2' })
    formatCommands.push('prettier --write .')
    scripts['format:check'] = 'prettier --check .'
  }

  Object.assign(scripts, {
    ...(lintCommands.length > 0 ? { lint: lintCommands.join(' && ') } : {}),
    ...(formatCommands.length > 0 ? { format: formatCommands.join(' && ') } : {}),
  })
}

export function toolingFiles(template: TemplateId, tooling: ToolingId[]): TemplateFile[] {
  if (hasTooling(tooling, 'none')) return []

  const files: TemplateFile[] = []
  if (hasTooling(tooling, 'biome')) {
    files.push({ path: 'biome.json', content: biomeJson(template) })
  }

  if (hasTooling(tooling, 'prettier')) {
    files.push(
      { path: '.prettierrc.json', content: `${JSON.stringify(prettierConfig, null, 2)}\n` },
      { path: '.prettierignore', content: `${TOOLING_IGNORES[template].join('\n')}\n` },
    )
  }

  if (hasTooling(tooling, 'eslint')) {
    files.push({ path: 'eslint.config.mjs', content: eslintConfig(template) })
  }

  return files
}

function biomeJson(template: TemplateId): string {
  return `${JSON.stringify(
    {
      $schema: 'https://biomejs.dev/schemas/1.9.4/schema.json',
      vcs: {
        enabled: true,
        clientKind: 'git',
        useIgnoreFile: true,
      },
      files: {
        ignoreUnknown: false,
        ignore: TOOLING_IGNORES[template],
      },
      formatter: {
        enabled: true,
        indentStyle: 'space',
        indentWidth: 2,
      },
      linter: {
        enabled: true,
        rules: {
          recommended: true,
        },
      },
    },
    null,
    2,
  )}\n`
}

const prettierConfig = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
}

function eslintConfig(template: TemplateId): string {
  switch (template) {
    case 'node':
      return nodeEslintConfig
    case 'vite-react':
      return viteReactEslintConfig
    case 'next-react':
      return nextReactEslintConfig
  }
}

const nodeEslintConfig = `import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
)
`

const viteReactEslintConfig = `import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
)
`

const nextReactEslintConfig = `import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [...compat.extends('next/core-web-vitals', 'next/typescript')]
`
