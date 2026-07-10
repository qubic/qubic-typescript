import type { ConnectorId, ScaffoldOptions, TemplateDefinition } from '../options.js'
import { applyToolingToPackage, toolingFiles } from '../tooling.js'
import { applyWebAddonsToPackage, webAddonFiles } from '../web-addons.js'

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

  applyWebAddonsToPackage(options, dependencies, devDependencies)
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

const plainStyleCss = `:root {
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
  gap: 8px;
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

.icon {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
}

.loading-row {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  color: #666;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 1px solid #d4d4d4;
  border-top-color: #111;
  border-radius: 999px;
  animation: spin 760ms linear infinite;
}

.skeleton {
  display: block;
  width: 96px;
  height: 16px;
  overflow: hidden;
  border-radius: 999px;
  background: linear-gradient(90deg, #eee 25%, #f8f8f8 37%, #eee 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
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

const tailwindStyleCss = `@import "tailwindcss";

@layer base {
  :root {
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
}

@layer components {
  .app {
    @apply mx-auto min-h-screen w-full max-w-[760px] px-6 py-[72px];
  }

  .hero {
    @apply mb-10 text-center;
  }

  .eyebrow {
    @apply m-0 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500;
  }

  .muted {
    @apply text-neutral-500;
  }

  .stack {
    @apply grid gap-4;
  }

  .card {
    @apply rounded-xl border border-neutral-200 bg-white p-5;
  }

  .row {
    @apply flex flex-wrap items-center gap-2;
  }

  .stat-grid {
    @apply grid grid-cols-1 gap-3 sm:grid-cols-2;
  }

  .stat {
    @apply rounded-lg border border-neutral-200 p-3.5;
  }

  .stat span {
    @apply mb-1.5 block text-xs text-neutral-500;
  }

  .button-link,
  button {
    @apply inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-2 rounded-full border border-neutral-950 bg-white px-3.5 py-2 text-neutral-950 no-underline;
  }

  .button-link:hover,
  button:hover {
    @apply bg-neutral-950 text-white;
  }

  button:disabled {
    @apply cursor-not-allowed border-neutral-200 bg-white text-neutral-400;
  }

  .icon {
    @apply block size-4 shrink-0;
  }

  .loading-row {
    @apply inline-flex items-center gap-2.5 text-neutral-500;
  }

  .spinner {
    @apply size-3.5 rounded-full border border-neutral-300 border-t-neutral-950;
    animation: spin 760ms linear infinite;
  }

  .skeleton {
    @apply block h-4 w-24 overflow-hidden rounded-full;
    background: linear-gradient(90deg, #eee 25%, #f8f8f8 37%, #eee 63%);
    background-size: 400% 100%;
    animation: shimmer 1.4s ease infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }

    100% {
      background-position: -100% 0;
    }
  }

  code,
  pre {
    white-space: pre-wrap;
    word-break: break-word;
  }

  pre {
    @apply max-h-80 overflow-auto rounded-lg border border-neutral-200 bg-neutral-50 p-3.5;
  }
}
`

function styleCss(options: ScaffoldOptions): string {
  return options.styling === 'tailwind' ? tailwindStyleCss : plainStyleCss
}

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

const solarIconsTsx = `import type { ComponentType, SVGProps } from 'react'
import * as SolarIcons from '@solar-icons/react'

type SolarIconProps = SVGProps<SVGSVGElement> & {
  name: string
}

const iconRegistry = SolarIcons as Record<string, ComponentType<SVGProps<SVGSVGElement>> | undefined>

export function SolarIcon({ name, className = 'icon', ...props }: SolarIconProps) {
  const Icon = iconRegistry[name]
  if (!Icon) return <span aria-hidden="true" className={className} />
  return <Icon aria-hidden="true" className={className} {...props} />
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

function appTsx(options: ScaffoldOptions): string {
  const motionImport =
    options.animation === 'motion' ? "import { motion } from 'motion/react'\n" : ''
  const mainOpen =
    options.animation === 'motion'
      ? '<motion.main className="app" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>'
      : '<main className="app">'
  const mainClose = options.animation === 'motion' ? '</motion.main>' : '</main>'

  return `import { useMemo, useState } from 'react'
${motionImport}import { qearnGetStateOfRound } from '@qubic.org/contracts'
import { useBalance, useContractQuery, useTickInfo, useWallet } from '@qubic.org/react'
import { SolarIcon } from './qubic/icons'

export function App() {
  const tickInfo = useTickInfo()
  const roundInput = useMemo(
    () => (tickInfo.data ? { epoch: tickInfo.data.epoch } : null),
    [tickInfo.data],
  )
  const qearnState = useContractQuery(qearnGetStateOfRound, roundInput)

  return (
    ${mainOpen}
      <header className="hero">
        <p className="eyebrow">create-qubic-app</p>
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
              {tickInfo.data ? tickInfo.data.epoch : <span className="skeleton" aria-label="Loading epoch" />}
            </p>
            <p className="stat">
              <span>Tick</span>
              {tickInfo.data ? tickInfo.data.tick : <span className="skeleton" aria-label="Loading tick" />}
            </p>
          </div>
        </section>

        <section className="card">
          <h2>Qearn contract query</h2>
          {qearnState.isLoading ? (
            <p className="loading-row">
              <span className="spinner" aria-hidden="true" />
              Loading contract state...
            </p>
          ) : null}
          {qearnState.error ? <p>Error: {String(qearnState.error)}</p> : null}
          {qearnState.data ? <pre>{JSON.stringify(qearnState.data, null, 2)}</pre> : null}
        </section>

        <section className="card">
          <h2>Next actions</h2>
          <div className="row">
            <a className="button-link" href="https://github.com/1jehuang/qubic-typescript" target="_blank" rel="noreferrer">
              <SolarIcon name="Code" />
              View SDK
            </a>
            <a className="button-link" href="https://docs.qubic.org" target="_blank" rel="noreferrer">
              <SolarIcon name="Book" />
              Qubic docs
            </a>
          </div>
        </section>
      </div>
    ${mainClose}
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
          <p>
            Balance:{' '}
            {balance.data ? balance.data.balance?.toString() : <span className="skeleton" aria-label="Loading balance" />}
          </p>
          <button type="button" onClick={() => void disconnect()}>
            <SolarIcon name="Logout" />
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
                <SolarIcon name={connector.id === 'walletconnect' ? 'LinkCircle' : 'Wallet'} />
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
}

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
- styling: ${options.styling}
- animation: ${options.animation}
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
    { path: 'src/App.tsx', content: appTsx(options) },
    { path: 'src/style.css', content: styleCss(options) },
    { path: 'src/qubic/clients.ts', content: clientsTs },
    { path: 'src/qubic/connectors.ts', content: connectorsTs(options) },
    { path: 'src/qubic/icons.tsx', content: solarIconsTsx },
    { path: 'src/qubic/vault.ts', content: vaultTs },
    { path: 'README.md', content: readme(options) },
    ...webAddonFiles('vite-react', options),
    ...toolingFiles('vite-react', options.tooling),
  ],
}
