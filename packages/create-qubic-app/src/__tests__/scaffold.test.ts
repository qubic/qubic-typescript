import { describe, expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { connectorsFromPreset, parseCli, shouldRunInteractive } from '../cli.js'
import { scaffold } from '../scaffold.js'

describe('create-qubic-app', () => {
  test('detects no-args interactive mode', () => {
    expect(shouldRunInteractive([])).toBe(true)
    expect(shouldRunInteractive(['demo'])).toBe(false)
    expect(shouldRunInteractive(['--help'])).toBe(false)
  })

  test('maps interactive connector presets', () => {
    expect(connectorsFromPreset('extension')).toEqual(['extension'])
    expect(connectorsFromPreset('extension-walletconnect')).toEqual(['extension', 'walletconnect'])
    expect(connectorsFromPreset('walletconnect')).toEqual(['walletconnect'])
    expect(connectorsFromPreset('none')).toEqual(['none'])
  })

  test('parses node scaffold options', () => {
    const options = parseCli(['demo', '--template', 'node', '--pm', 'npm', '--out', '/tmp'])
    expect(options.projectName).toBe('demo')
    expect(options.template).toBe('node')
    expect(options.packageManager).toBe('npm')
    expect(options.outDir).toBe('/tmp')
    expect(options.connectors).toEqual(['extension'])
    expect(options.tooling).toEqual(['biome'])
    expect(options.styling).toBe('css')
    expect(options.animation).toBe('none')
  })

  test('parses web styling and animation options', () => {
    const options = parseCli([
      'demo',
      '--template',
      'vite-react',
      '--styling',
      'tailwind',
      '--animation',
      'motion',
    ])

    expect(options.styling).toBe('tailwind')
    expect(options.animation).toBe('motion')
    expect(() => parseCli(['demo', '--styling', 'sass'])).toThrow('Unknown styling "sass"')
    expect(() => parseCli(['demo', '--animation', 'spring'])).toThrow('Unknown animation "spring"')
  })

  test('parses exactly one tooling option', () => {
    const options = parseCli(['demo', '--template', 'vite-react', '--tooling', 'eslint'])

    expect(options.tooling).toEqual(['eslint'])
    expect(() => parseCli(['demo', '--tooling', 'biome,eslint'])).toThrow(
      'Choose exactly one tooling option',
    )
  })

  test('rejects removed MetaMask Snap connector option', () => {
    expect(() => parseCli(['demo', '--template', 'vite-react', '--connectors', 'snap'])).toThrow(
      'Unknown connector "snap"',
    )
  })

  test('writes the node template', () => {
    const root = mkdtempSync(join(tmpdir(), 'create-qubic-app-'))
    const targetDir = join(root, 'demo')

    try {
      const written = scaffold({
        projectName: 'demo',
        targetDir,
        template: 'node',
        packageManager: 'bun',
        force: false,
        install: false,
        connectors: ['extension'],
        tooling: ['biome'],
        styling: 'css',
        animation: 'none',
      })

      expect(written).toContain('package.json')
      expect(written).toContain('src/index.ts')
      expect(written).toContain('biome.json')

      const packageJson = JSON.parse(readFileSync(join(targetDir, 'package.json'), 'utf-8')) as {
        name?: string
      }
      expect(packageJson.name).toBe('demo')

      const source = readFileSync(join(targetDir, 'src/index.ts'), 'utf-8')
      expect(source).not.toContain('{{')
      expect(source).toContain('--broadcast')

      const packageJsonFull = JSON.parse(
        readFileSync(join(targetDir, 'package.json'), 'utf-8'),
      ) as {
        scripts?: Record<string, string>
        devDependencies?: Record<string, string>
      }
      expect(packageJsonFull.scripts?.lint).toBe('biome check .')
      expect(packageJsonFull.devDependencies?.['@biomejs/biome']).toBeTruthy()
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('writes the vite react template with selected connectors', () => {
    const root = mkdtempSync(join(tmpdir(), 'create-qubic-app-'))
    const targetDir = join(root, 'demo-web')

    try {
      const written = scaffold({
        projectName: 'demo-web',
        targetDir,
        template: 'vite-react',
        packageManager: 'bun',
        force: false,
        install: false,
        connectors: ['extension', 'walletconnect'],
        tooling: ['eslint'],
        styling: 'tailwind',
        animation: 'motion',
      })

      expect(written).toContain('src/qubic/connectors.ts')
      expect(written).toContain('src/qubic/vault.ts')
      expect(written).toContain('src/qubic/icons.tsx')
      expect(written).toContain('src/App.tsx')
      expect(written).toContain('eslint.config.mjs')
      expect(written).not.toContain('tailwind.config.ts')
      expect(written).toContain('postcss.config.mjs')

      const connectors = readFileSync(join(targetDir, 'src/qubic/connectors.ts'), 'utf-8')
      expect(connectors).toContain('extensionConnector')
      expect(connectors).toContain('createWalletConnectConnector')
      expect(connectors).toContain('@walletconnect/sign-client')
      expect(connectors).not.toContain('{{')

      const env = readFileSync(join(targetDir, '.env.example'), 'utf-8')
      expect(env).toContain('VITE_WALLETCONNECT_PROJECT_ID')
      expect(env).not.toContain('SNAP')

      const vault = readFileSync(join(targetDir, 'src/qubic/vault.ts'), 'utf-8')
      expect(vault).toContain('qubic-vault')

      const app = readFileSync(join(targetDir, 'src/App.tsx'), 'utf-8')
      const style = readFileSync(join(targetDir, 'src/style.css'), 'utf-8')
      expect(app).toContain('Build with Qubic.')
      expect(app).toContain('Next actions')
      expect(app).toContain('motion/react')
      expect(app).toContain('<motion.main')
      expect(app).toContain('SolarIcon')
      expect(app).toContain('spinner')
      expect(style).toContain('background: #fff')
      expect(style).toContain('@import "tailwindcss"')
      expect(style).not.toContain('@tailwind base')
      expect(style).not.toContain('#080a12')

      const icons = readFileSync(join(targetDir, 'src/qubic/icons.tsx'), 'utf-8')
      expect(icons).toContain('@solar-icons/react')

      const postcssConfig = readFileSync(join(targetDir, 'postcss.config.mjs'), 'utf-8')
      expect(postcssConfig).toContain('@tailwindcss/postcss')

      const eslintConfig = readFileSync(join(targetDir, 'eslint.config.mjs'), 'utf-8')
      expect(eslintConfig).toContain('eslint-plugin-react-hooks')

      const packageJson = JSON.parse(readFileSync(join(targetDir, 'package.json'), 'utf-8')) as {
        scripts?: Record<string, string>
        dependencies?: Record<string, string>
        devDependencies?: Record<string, string>
      }
      expect(packageJson.scripts?.lint).toBe('eslint .')
      expect(packageJson.scripts?.format).toBeUndefined()
      expect(packageJson.dependencies?.['@solar-icons/react']).toBeTruthy()
      expect(packageJson.dependencies?.motion).toBeTruthy()
      expect(packageJson.devDependencies?.tailwindcss).toBeTruthy()
      expect(packageJson.devDependencies?.['@tailwindcss/postcss']).toBeTruthy()
      expect(packageJson.devDependencies?.autoprefixer).toBeUndefined()
      expect(packageJson.devDependencies?.['eslint-plugin-react-refresh']).toBeTruthy()
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('writes the next react template with client connectors', () => {
    const root = mkdtempSync(join(tmpdir(), 'create-qubic-app-'))
    const targetDir = join(root, 'demo-next')

    try {
      const written = scaffold({
        projectName: 'demo-next',
        targetDir,
        template: 'next-react',
        packageManager: 'pnpm',
        force: false,
        install: false,
        connectors: ['extension', 'walletconnect'],
        tooling: ['eslint'],
        styling: 'css',
        animation: 'none',
      })

      expect(written).toContain('app/providers.tsx')
      expect(written).toContain('qubic/connectors.ts')
      expect(written).toContain('qubic/icons.tsx')
      expect(written).toContain('qubic/vault.ts')
      expect(written).toContain('eslint.config.mjs')
      expect(written).not.toContain('biome.json')

      const connectors = readFileSync(join(targetDir, 'qubic/connectors.ts'), 'utf-8')
      expect(connectors).toContain("'use client'")
      expect(connectors).toContain('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')
      expect(connectors).toContain('extensionConnector')
      expect(connectors).not.toContain('{{')

      const providers = readFileSync(join(targetDir, 'app/providers.tsx'), 'utf-8')
      expect(providers).toContain("'use client'")
      expect(providers).toContain('VaultProvider')
      expect(connectors).not.toContain('SNAP')
      expect(connectors).not.toContain('MetaMask')

      const page = readFileSync(join(targetDir, 'app/page.tsx'), 'utf-8')
      const globals = readFileSync(join(targetDir, 'app/globals.css'), 'utf-8')
      expect(page).toContain("'use client'")
      expect(page).toContain('Build with Qubic.')
      expect(page).toContain('Next actions')
      expect(page).toContain('SolarIcon')
      expect(page).toContain('skeleton')
      expect(globals).toContain('background: #fff')
      expect(globals).not.toContain('#080a12')

      const icons = readFileSync(join(targetDir, 'qubic/icons.tsx'), 'utf-8')
      expect(icons).toContain('@solar-icons/react')

      const packageJson = JSON.parse(readFileSync(join(targetDir, 'package.json'), 'utf-8')) as {
        dependencies?: Record<string, string>
      }
      expect(packageJson.dependencies?.['@solar-icons/react']).toBeTruthy()

      const eslintConfig = readFileSync(join(targetDir, 'eslint.config.mjs'), 'utf-8')
      expect(eslintConfig).toContain('next/core-web-vitals')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
