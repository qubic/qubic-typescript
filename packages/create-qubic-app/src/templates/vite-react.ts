import type { ConnectorId, ScaffoldOptions, TemplateDefinition } from '../options.js'
import { applyToolingToPackage, toolingFiles } from '../tooling.js'

function hasConnector(options: ScaffoldOptions, connector: ConnectorId): boolean {
  return options.connectors.includes(connector)
}

function packageJson(options: ScaffoldOptions): string {
  const scripts: Record<string, string> = {
    dev: 'vite',
    build: 'tsc -b && vite build',
    preview: 'vite preview',
    typecheck: 'tsc --noEmit',
  }
  const dependencies: Record<string, string> = {
    '@qubic.org/contracts': '^1.0.0',
    '@qubic.org/react': '^1.0.0',
    '@qubic.org/rpc': '^1.0.0',
    '@qubic.org/wallet': '^1.0.0',
    '@tanstack/react-query': '^5.100.10',
    react: '^19.0.0',
    'react-dom': '^19.2.7',
  }

  if (hasConnector(options, 'walletconnect')) {
    dependencies['@walletconnect/sign-client'] = '^2.21.0'
  }

  const devDependencies: Record<string, string> = {
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.2.3',
    '@vitejs/plugin-react': '^4.6.0',
    typescript: '^5.7.0',
    vite: '^6.0.0',
  }

  applyToolingToPackage('vite-react', options.tooling, scripts, devDependencies)

  return `${JSON.stringify(
    {
      name: options.projectName,
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts,
      dependencies,
      devDependencies,
    },
    null,
    2,
  )}\n`
}

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
`

const viteConfig = `import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
})
`

const indexHtml = `<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
`

const styleCss = `:root {
  color: #111;
  background: #fff;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  margin: 0;
}

button {
  font: inherit;
}

.app {
  width: min(100%, 760px);
  min-height: 100vh;
  margin: 0 auto;
  padding: 72px 24px;
}

.hero {
  margin-bottom: 40px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 12px;
  color: #666;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 12px;
  font-size: clamp(2.25rem, 8vw, 4.5rem);
  font-weight: 650;
  letter-spacing: -0.06em;
  line-height: 0.95;
}

h2 {
  margin-bottom: 16px;
  font-size: 1rem;
}

.muted {
  color: #666;
}

.stack {
  display: grid;
  gap: 16px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat {
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  padding: 14px;
}

.stat span {
  display: block;
  margin-bottom: 6px;
  color: #666;
  font-size: 0.78rem;
}

button,
.button-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  border: 1px solid #111;
  border-radius: 999px;
  padding: 8px 14px;
  color: #111;
  background: #fff;
  text-decoration: none;
  cursor: pointer;
}

button:hover,
.button-link:hover {
  color: #fff;
  background: #111;
}

button:disabled {
  color: #999;
  border-color: #ddd;
  background: #fff;
  cursor: not-allowed;
}

code,
pre {
  white-space: pre-wrap;
  word-break: break-word;
}

pre {
  max-height: 320px;
  overflow: auto;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  padding: 14px;
  background: #fafafa;
}

@media (max-width: 640px) {
  .app {
    padding: 48px 16px;
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }
}
`

const mainTsx = `import { type ReactNode, StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { QubicProvider, VaultProvider, WalletProvider } from '@qubic.org/react'
import { App } from './App'
import { live } from './qubic/clients'
import { connectors } from './qubic/connectors'
import { loadVaultData } from './qubic/vault'
import './style.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <QubicProviders>
      <App />
    </QubicProviders>
  </StrictMode>,
)

function QubicProviders({ children }: { children: ReactNode }) {
  const vaultData = useMemo(() => loadVaultData(), [])
  const walletTree = <WalletProvider connectors={connectors}>{children}</WalletProvider>

  return (
    <QubicProvider liveClient={live}>
      {vaultData ? (
        <VaultProvider vaultData={vaultData} persistSession autoLockMs={15 * 60_000}>
          {walletTree}
        </VaultProvider>
      ) : (
        walletTree
      )}
    </QubicProvider>
  )
}
`

const clientsTs = `import { createLiveClient } from '@qubic.org/rpc'

export const live = createLiveClient()
`

const vaultTs = `import { importVault, type VaultData } from '@qubic.org/wallet'

export const VAULT_STORAGE_KEY = 'qubic-vault'

export function loadVaultData(storage: Storage = window.localStorage): VaultData | undefined {
  const serialized = storage.getItem(VAULT_STORAGE_KEY)
  if (!serialized) return undefined

  try {
    return importVault(serialized)
  } catch (error) {
    console.warn('Failed to load Qubic vault from localStorage.', error)
    return undefined
  }
}
`

function connectorsTs(options: ScaffoldOptions): string {
  if (hasConnector(options, 'none')) {
    return `import type { WalletConnector } from '@qubic.org/react'

export const connectors: WalletConnector[] = []
`
  }

  const imports = new Set<string>(['type WalletConnector'])
  const lines: string[] = []

  if (hasConnector(options, 'extension')) {
    imports.add('extensionConnector')
    lines.push('  extensionConnector,')
  }

  if (hasConnector(options, 'walletconnect')) {
    imports.add('createWalletConnectConnector')
    lines.push(`  createWalletConnectConnector({
    chainId: 'qubic:mainnet',
    createClient: () =>
      SignClient.init({
        projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
        metadata: {
          name: import.meta.env.VITE_APP_NAME ?? '${options.projectName}',
          description: 'Qubic app built with qubic-typescript',
          url: window.location.origin,
          icons: [],
        },
      }),
  }),`)
  }

  const signClientImport = hasConnector(options, 'walletconnect')
    ? "import SignClient from '@walletconnect/sign-client'\n"
    : ''

  return `import { ${[...imports].join(', ')} } from '@qubic.org/react'
${signClientImport}

export const connectors: WalletConnector[] = [
${lines.join('\n')}
]
`
}

const appTsx = `import { useMemo, useState } from 'react'
import { qearnGetStateOfRound } from '@qubic.org/contracts'
import { useBalance, useContractQuery, useTickInfo, useWallet } from '@qubic.org/react'

export function App() {
  const tickInfo = useTickInfo()
  const roundInput = useMemo(
    () => (tickInfo.data ? { epoch: tickInfo.data.epoch } : null),
    [tickInfo.data],
  )
  const qearnState = useContractQuery(qearnGetStateOfRound, roundInput)

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">Qubic starter</p>
        <h1>Build with Qubic.</h1>
        <p className="muted">A minimal Vite + React app with wallet actions and live network data.</p>
      </header>

      <div className="stack">
        <WalletCard />

        <section className="card">
          <h2>Network</h2>
          <div className="stat-grid">
            <p className="stat">
              <span>Epoch</span>
              {tickInfo.data?.epoch ?? 'loading...'}
            </p>
            <p className="stat">
              <span>Tick</span>
              {tickInfo.data?.tick ?? 'loading...'}
            </p>
          </div>
        </section>

        <section className="card">
          <h2>Qearn contract query</h2>
          {qearnState.isLoading ? <p className="muted">Loading contract state...</p> : null}
          {qearnState.error ? <p>Error: {String(qearnState.error)}</p> : null}
          {qearnState.data ? <pre>{JSON.stringify(qearnState.data, null, 2)}</pre> : null}
        </section>

        <section className="card">
          <h2>Next actions</h2>
          <div className="row">
            <a className="button-link" href="https://github.com/1jehuang/qubic-typescript" target="_blank" rel="noreferrer">
              View SDK
            </a>
            <a className="button-link" href="https://docs.qubic.org" target="_blank" rel="noreferrer">
              Qubic docs
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}

function WalletCard() {
  const [walletConnectUri, setWalletConnectUri] = useState<string | null>(null)
  const { account, connectors, connect, disconnect, error, isConnecting } = useWallet()
  const balance = useBalance(account?.identity)

  return (
    <section className="card">
      <h2>Wallet</h2>

      {account ? (
        <>
          <p className="muted">Connected identity</p>
          <code>{account.identity}</code>
          <p>Balance: {balance.data?.balance?.toString() ?? 'loading...'}</p>
          <button type="button" onClick={() => void disconnect()}>
            Disconnect
          </button>
        </>
      ) : (
        <>
          <p className="muted">Choose a connector to start signing with a wallet.</p>
          <div className="row">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                type="button"
                disabled={isConnecting || !connector.isAvailable()}
                onClick={() =>
                  void connect(
                    connector.id,
                    connector.id === 'walletconnect' ? { onUri: setWalletConnectUri } : undefined,
                  )
                }
              >
                Connect {connector.id}
              </button>
            ))}
            {connectors.length === 0 ? <p>No connectors configured.</p> : null}
          </div>
        </>
      )}

      {walletConnectUri ? (
        <p>
          WalletConnect URI: <code>{walletConnectUri}</code>
        </p>
      ) : null}

      {error ? <p>Error: {error.message}</p> : null}
    </section>
  )
}
`

function envExample(options: ScaffoldOptions): string {
  const lines = [`VITE_APP_NAME=${options.projectName}`]
  if (hasConnector(options, 'walletconnect')) {
    lines.push('VITE_WALLETCONNECT_PROJECT_ID=')
  }
  return `${lines.join('\n')}\n`
}

function readme(options: ScaffoldOptions): string {
  const connectorList = options.connectors.join(', ')
  return `# ${options.projectName}

Vite React starter generated with \`create-qubic-app\`.

## Getting started

\`\`\`bash
${options.packageManager} install
cp .env.example .env
${options.packageManager === 'npm' ? 'npm run dev' : `${options.packageManager} dev`}
\`\`\`

## Included

- \`QubicProvider\` and \`WalletProvider\` from \`@qubic.org/react\`
- optional \`VaultProvider\` wiring for encrypted seed vaults saved as \`qubic-vault\` in localStorage
- wallet connectors: ${connectorList}
- tooling: ${options.tooling.join(', ')}
- live tick info query
- wallet balance query
- typed Qearn contract query

## Connector notes

- Qubic extension uses \`window.qubic\`.
- Vault signing uses encrypted vault data from \`@qubic.org/wallet\`.
- WalletConnect requires \`VITE_WALLETCONNECT_PROJECT_ID\`.

Never put secrets or real seeds in frontend environment variables.
`
}

export const viteReactTemplate: TemplateDefinition = {
  id: 'vite-react',
  label: 'Vite React dApp',
  files: (options) => [
    { path: 'package.json', content: packageJson(options) },
    { path: 'tsconfig.json', content: tsconfig },
    { path: 'vite.config.ts', content: viteConfig },
    { path: 'index.html', content: indexHtml },
    { path: '.env.example', content: envExample(options) },
    { path: '.gitignore', content: 'node_modules\n.env\ndist\n' },
    { path: 'src/vite-env.d.ts', content: '/// <reference types="vite/client" />\n' },
    { path: 'src/main.tsx', content: mainTsx },
    { path: 'src/App.tsx', content: appTsx },
    { path: 'src/style.css', content: styleCss },
    { path: 'src/qubic/clients.ts', content: clientsTs },
    { path: 'src/qubic/connectors.ts', content: connectorsTs(options) },
    { path: 'src/qubic/vault.ts', content: vaultTs },
    { path: 'README.md', content: readme(options) },
    ...toolingFiles('vite-react', options.tooling),
  ],
}
