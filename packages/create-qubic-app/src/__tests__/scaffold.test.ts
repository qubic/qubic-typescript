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
      })

      expect(written).toContain('package.json')
      expect(written).toContain('src/index.ts')

      const packageJson = JSON.parse(readFileSync(join(targetDir, 'package.json'), 'utf-8')) as {
        name?: string
      }
      expect(packageJson.name).toBe('demo')

      const source = readFileSync(join(targetDir, 'src/index.ts'), 'utf-8')
      expect(source).not.toContain('{{')
      expect(source).toContain('--broadcast')
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
      })

      expect(written).toContain('src/qubic/connectors.ts')
      expect(written).toContain('src/qubic/vault.ts')
      expect(written).toContain('src/App.tsx')

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
      })

      expect(written).toContain('app/providers.tsx')
      expect(written).toContain('qubic/connectors.ts')
      expect(written).toContain('qubic/vault.ts')

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
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
