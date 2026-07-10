import type { ScaffoldOptions, TemplateDefinition } from '../options.js'

function packageJson(options: ScaffoldOptions): string {
  return `${JSON.stringify(
    {
      name: options.projectName,
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'tsx src/index.ts',
        typecheck: 'tsc --noEmit',
      },
      dependencies: {
        '@qubic.org/contracts': '^1.0.0',
        '@qubic.org/crypto': '^1.0.0',
        '@qubic.org/rpc': '^1.0.0',
        '@qubic.org/types': '^1.0.0',
        '@qubic.org/wallet': '^1.0.0',
        dotenv: '^16.4.7',
      },
      devDependencies: {
        tsx: '^4.20.0',
        typescript: '^5.7.0',
      },
    },
    null,
    2,
  )}\n`
}

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"]
}
`

const envExample = `# Optional seed for wallet examples. Never commit a real seed.
QUBIC_SEED=

# Optional transfer settings. Transactions are never broadcast unless you pass --broadcast.
QUBIC_DESTINATION=BZBQFLLBNCXEMGLOBHUVFTLUPLVCPQUASSILFABOFFBCADQSSUPNWLZBQEXK
QUBIC_AMOUNT=1
`

const indexTs = `import 'dotenv/config'
import { identityToPublicKey, publicKeyToIdentity } from '@qubic.org/crypto'
import { qearn } from '@qubic.org/contracts'
import { createLiveClient } from '@qubic.org/rpc'
import { toSeed } from '@qubic.org/types'
import { createWallet } from '@qubic.org/wallet'

const live = createLiveClient()
const shouldBroadcast = process.argv.includes('--broadcast')

async function main() {
  const tickInfo = await getTickInfo()
  await queryContract(tickInfo.epoch)

  const seed = process.env.QUBIC_SEED
  if (!seed) {
    log('Set QUBIC_SEED in .env to try the wallet example.')
    return
  }

  const wallet = createWallet(toSeed(seed))
  log(\`Wallet identity: \${wallet.identity}\`)

  const destination = process.env.QUBIC_DESTINATION
  const amount = BigInt(process.env.QUBIC_AMOUNT ?? '1')
  if (!destination) {
    log('Set QUBIC_DESTINATION in .env to build a transfer transaction.')
    return
  }

  const { encoded, txId } = await wallet.buildTransaction({
    destination,
    amount,
    targetTick: tickInfo.tick + 5,
    currentTick: tickInfo.tick,
  })

  log(\`Built transfer transaction: \${txId}\`)

  if (!shouldBroadcast) {
    log('Not broadcasting. Re-run with --broadcast if you really want to send it.')
    return
  }

  const broadcast = await live.broadcastTransaction(encoded)
  if (!broadcast.ok) throw broadcast.error
  log(\`Broadcasted to \${broadcast.value.peersBroadcastedTo} peers.\`)
}

async function getTickInfo() {
  const result = await live.getTickInfo()
  if (!result.ok) throw result.error

  log(\`Current epoch: \${result.value.epoch}\`)
  log(\`Current tick: \${result.value.tick}\`)
  return result.value
}

async function queryContract(epoch: number) {
  const result = await qearn.getStateOfRound(
    live,
    { epoch },
    { identityToPublicKey, publicKeyToIdentity },
  )

  if (result.ok) {
    log('Qearn state of round:')
    log(JSON.stringify(result.value, null, 2))
    return
  }

  log(\`Contract query failed: \${result.error.status} \${result.error.endpoint}\`)
}

function log(message: string) {
  process.stdout.write(\`\${message}\\n\`)
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error)
  process.stderr.write(\`\${message}\\n\`)
  process.exit(1)
})
`

function readme(options: ScaffoldOptions): string {
  return `# ${options.projectName}

Node/Bun starter generated with \`create-qubic-app\`.

## Getting started

\`\`\`bash
${options.packageManager} install
cp .env.example .env
${options.packageManager === 'npm' ? 'npm run dev' : `${options.packageManager} dev`}
\`\`\`

## What this example does

- reads live tick info with \`@qubic.org/rpc\`
- queries a typed contract wrapper from \`@qubic.org/contracts\`
- optionally creates a wallet from \`QUBIC_SEED\`
- builds a transfer transaction when \`QUBIC_DESTINATION\` is set
- never broadcasts unless you explicitly pass \`--broadcast\`

## Broadcast safety

The transfer example is safe by default. It only builds and signs a transaction. To broadcast, run:

\`\`\`bash
${options.packageManager === 'npm' ? 'npm run dev -- --broadcast' : `${options.packageManager} dev --broadcast`}
\`\`\`

Never commit a real seed or a populated \`.env\` file.
`
}

export const nodeTemplate: TemplateDefinition = {
  id: 'node',
  label: 'Node/Bun script',
  files: (options) => [
    { path: 'package.json', content: packageJson(options) },
    { path: 'tsconfig.json', content: tsconfig },
    { path: '.env.example', content: envExample },
    { path: '.gitignore', content: 'node_modules\n.env\ndist\n' },
    { path: 'src/index.ts', content: indexTs },
    { path: 'README.md', content: readme(options) },
  ],
}
