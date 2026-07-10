import type { ConnectorId, ScaffoldOptions, TemplateDefinition } from '../options.js'

function hasConnector(options: ScaffoldOptions, connector: ConnectorId): boolean {
  return options.connectors.includes(connector)
}

function packageJson(options: ScaffoldOptions): string {
  const dependencies: Record<string, string> = {
    '@qubic.org/contracts': '^1.0.0',
    '@qubic.org/react': '^1.0.0',
    '@qubic.org/rpc': '^1.0.0',
    '@tanstack/react-query': '^5.100.10',
    react: '^19.0.0',
    'react-dom': '^19.2.7',
  }

  if (hasConnector(options, 'walletconnect')) {
    dependencies['@walletconnect/sign-client'] = '^2.21.0'
  }

  return `${JSON.stringify(
    {
      name: options.projectName,
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc -b && vite build',
        preview: 'vite preview',
        typecheck: 'tsc --noEmit',
      },
      dependencies,
      devDependencies: {
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.2.3',
        '@vitejs/plugin-react': '^4.6.0',
        typescript: '^5.7.0',
        vite: '^6.0.0',
      },
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
  color: #f7f7fb;
  background: #080a12;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

body {
  margin: 0;
}

button, input {
  font: inherit;
}

.app {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 20px;
}

.card {
  border: 1px solid #2b3148;
  border-radius: 16px;
  padding: 20px;
  margin-top: 16px;
  background: #101525;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

button {
  border: 0;
  border-radius: 999px;
  padding: 10px 14px;
  color: #080a12;
  background: #7dd3fc;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

code, pre {
  white-space: pre-wrap;
  word-break: break-word;
}
`

const mainTsx = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QubicProvider, WalletProvider } from '@qubic.org/react'
import { App } from './App'
import { live } from './qubic/clients'
import { connectors } from './qubic/connectors'
import './style.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <QubicProvider liveClient={live}>
      <WalletProvider connectors={connectors}>
        <App />
      </WalletProvider>
    </QubicProvider>
  </StrictMode>,
)
`

const clientsTs = `import { createLiveClient } from '@qubic.org/rpc'

export const live = createLiveClient()
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

  if (hasConnector(options, 'snap')) {
    imports.add('createMetaMaskSnapConnector')
    lines.push(`  createMetaMaskSnapConnector({
    snapId: import.meta.env.VITE_QUBIC_SNAP_ID || undefined,
    accountIndex: Number(import.meta.env.VITE_QUBIC_SNAP_ACCOUNT_INDEX ?? '0'),
    broadcast: async (base64) => {
      const result = await live.broadcastTransaction(base64 as Base64)
      if (!result.ok) throw result.error
      return {
        networkTxId: result.value.transactionId,
        broadcast: result.value,
      }
    },
  }),`)
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
  const base64Import = hasConnector(options, 'snap')
    ? "import type { Base64 } from '@qubic.org/types'\n"
    : ''

  return `import { ${[...imports].join(', ')} } from '@qubic.org/react'
${signClientImport}${base64Import}import { live } from './clients'

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
      <h1>Qubic app</h1>
      <p>Vite + React starter generated with create-qubic-app.</p>

      <WalletCard />

      <section className="card">
        <h2>Network</h2>
        <p>Epoch: {tickInfo.data?.epoch ?? 'loading...'}</p>
        <p>Tick: {tickInfo.data?.tick ?? 'loading...'}</p>
      </section>

      <section className="card">
        <h2>Qearn contract query</h2>
        {qearnState.isLoading ? <p>Loading...</p> : null}
        {qearnState.error ? <p>Error: {String(qearnState.error)}</p> : null}
        {qearnState.data ? <pre>{JSON.stringify(qearnState.data, null, 2)}</pre> : null}
      </section>
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
          <p>Connected identity:</p>
          <code>{account.identity}</code>
          <p>Balance: {balance.data?.balance?.toString() ?? 'loading...'}</p>
          <button type="button" onClick={() => void disconnect()}>
            Disconnect
          </button>
        </>
      ) : (
        <>
          <p>Select a wallet connector:</p>
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
                {connector.id}
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
  if (hasConnector(options, 'snap')) {
    lines.push('VITE_QUBIC_SNAP_ID=', 'VITE_QUBIC_SNAP_ACCOUNT_INDEX=0')
  }
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
- wallet connectors: ${connectorList}
- live tick info query
- wallet balance query
- typed Qearn contract query

## Connector notes

- Qubic extension uses \`window.qubic\`.
- MetaMask Snap requires MetaMask Flask and the Qubic Snap.
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
    { path: 'README.md', content: readme(options) },
  ],
}
