# @qubic.ts/react

React hooks and context providers for the Qubic SDK, powered by [TanStack Query](https://tanstack.com/query).

## Installation

```bash
bun add @qubic.ts/react
```

Peer dependency: React 18+.

## Security model

Seeds **never** appear in React state or component code:

- `VaultProvider` stores wallets in a `Ref` — invisible to React DevTools, not serialisable, not part of the render cycle.
- Components only receive `identities: Identity[]` (60-char strings).
- `useSendTransfer` / `useSendContractCall` access signing internally — the component passes params but never touches a wallet.
- Auto-lock on page hide (`visibilitychange`) and after a configurable idle timeout.

**Session persistence** (`persistSession` prop):
- Seeds re-encrypted with a freshly generated AES-256-GCM key on every unlock.
- The key is stored in IndexedDB as `extractable: false` — JS cannot read key bytes even under XSS.
- The encrypted payload lives in `sessionStorage` (tab-scoped — cleared automatically when the tab closes).
- Keys rotate on every restore: the previous IDB key is deleted before wallets are loaded (forward secrecy).
- If decryption fails for any reason the session is silently cleared and the lock form is shown.

## Setup

```tsx
import { createLiveClient, createQueryClient } from '@qubic.ts/rpc'
import { importVault } from '@qubic.ts/wallet'
import { QubicProvider, VaultProvider } from '@qubic.ts/react'

const live = createLiveClient()
const archive = createQueryClient()
const vault = importVault(localStorage.getItem('qubic-vault')!)

export function App() {
  return (
    <QubicProvider liveClient={live} archiveClient={archive}>
      <VaultProvider
        vaultData={vault}
        persistSession        // survives page refresh; expires on tab close
        autoLockMs={15 * 60_000}  // also auto-locks after 15 min idle
      >
        <YourApp />
      </VaultProvider>
    </QubicProvider>
  )
}
```

| Prop | Default | Description |
|------|---------|-------------|
| `vaultData` | required | `VaultData` from `importVault` / `createVault` |
| `persistSession` | `false` | Re-encrypt seeds into sessionStorage + IDB on unlock; restore on page refresh |
| `sessionStorageKey` | `'qubic-session'` | Key used in sessionStorage — override for multiple vaults |
| `autoLockMs` | none | Auto-lock after N ms idle; also locks on `visibilitychange` |

`QubicProvider` also acts as a TanStack `QueryClientProvider`. Pass your own `queryClient` to share the cache with the rest of your app.

## Vault hooks

### `useVaultState()`

Lock/unlock the vault and read the active identities.

```tsx
import { useVaultState } from '@qubic.ts/react'

function WalletPanel() {
  const { isUnlocked, identities, isUnlocking, error, unlock, lock } = useVaultState()

  if (!isUnlocked) {
    return (
      <form onSubmit={e => { e.preventDefault(); unlock(e.currentTarget.password.value) }}>
        <input name="password" type="password" />
        <button disabled={isUnlocking}>Unlock</button>
        {error && <p>Wrong password</p>}
      </form>
    )
  }

  return (
    <div>
      {identities.map(id => <p key={id}>{id}</p>)}
      <button onClick={lock}>Lock</button>
    </div>
  )
}
```

## Send hooks

### `useSendTransfer()`

Fetches the current tick, builds and signs a QU transfer, broadcasts. Zero wallet exposure.

```tsx
import { useSendTransfer, useVaultState } from '@qubic.ts/react'

function SendPanel() {
  const { identities } = useVaultState()
  const { mutate: send, isPending, data, error } = useSendTransfer()

  return (
    <button
      disabled={isPending || !identities[0]}
      onClick={() => send({
        from: identities[0]!,
        destination: '...' as Identity,
        amount: 1_000_000n,
      })}
    >
      Send
    </button>
  )
}
```

### `useSendContractCall()`

Signs and broadcasts a smart contract procedure call.

```tsx
import { useSendContractCall, useVaultState } from '@qubic.ts/react'
import { QEARN_LOCK_INPUT_TYPE, buildQearnLockInput } from '@qubic.ts/contracts'

function LockPanel() {
  const { identities } = useVaultState()
  const { mutate: send, isPending } = useSendContractCall()

  return (
    <button
      disabled={isPending}
      onClick={() => send({
        from: identities[0]!,
        inputType: QEARN_LOCK_INPUT_TYPE,
        payload: buildQearnLockInput({ amount: 10_000_000n }),
        amount: 10_000_000n,
      })}
    >
      Lock QU
    </button>
  )
}
```

## Contract query hook

### `useContractQuery(fn, input)`

Wraps any typed contract read function from `@qubic.ts/contracts` as a TanStack Query. `identityToPublicKey` / `publicKeyToIdentity` are provided automatically.

```tsx
import { useContractQuery } from '@qubic.ts/react'
import { qearnGetStateOfRound } from '@qubic.ts/contracts'

function RoundStats({ epoch }: { epoch: number }) {
  const { data, isLoading } = useContractQuery(qearnGetStateOfRound, { epoch })

  if (isLoading) return <span>Loading…</span>
  return <span>Locked: {data?.totalLockedAmount?.toString()}</span>
}
```

## Live API hooks

### `useTickInfo(refetchIntervalMs?)`

```tsx
const { data } = useTickInfo(3_000)
// data.tick, data.epoch, data.duration
```

### `useBalance(identity)`

```tsx
const { data } = useBalance(identities[0])
// data.balance
```

### `useIssuedAssets(identity)` / `useOwnedAssets(identity)` / `usePossessedAssets(identity)`

```tsx
const { data: issued } = useIssuedAssets(identity)
const { data: owned } = useOwnedAssets(identity)
const { data: possessed } = usePossessedAssets(identity)
```

## Archive API hooks (require `archiveClient`)

### `useTransaction(hash)`

```tsx
const { data } = useTransaction(txHash)
```

### `useEventLogs(request)`

```tsx
const { data } = useEventLogs({
  filters: { eventType: '0' },
  pagination: { offset: 0, size: 20 },
})
```

### `useTransactionsForIdentity(request)`

```tsx
const { data } = useTransactionsForIdentity({
  addressId: identity,
  pagination: { offset: 0, size: 20 },
})
```

### `useQubic()`

Direct access to `liveClient` and `archiveClient` for one-off queries.

```tsx
const { liveClient, archiveClient } = useQubic()
```

## Sharing your TanStack Query cache

```tsx
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

<QubicProvider liveClient={live} queryClient={queryClient}>
  <App />
</QubicProvider>
```

## Wallet connectors (extension / WalletConnect / MetaMask Snap)

### Setup — `WalletProvider`

Register all wallet backends once and wrap your app. Components call `useWallet()` with no arguments — no connector plumbing in every component.

```bash
bun add @walletconnect/sign-client   # only if using WalletConnect
```

```tsx
import SignClient from '@walletconnect/sign-client'
import {
  QubicProvider,
  WalletProvider,
  extensionConnector,
  createWalletConnectConnector,
  createMetaMaskSnapConnector,
} from '@qubic.ts/react'
import type { Base64 } from '@qubic.ts/types'

// Create connectors outside the component tree (stable references)
const connectors = [
  extensionConnector,

  createWalletConnectConnector({
    // SignClient is initialized lazily on first connect() — no upfront await
    createClient: () => SignClient.init({
      projectId: 'YOUR_WC_PROJECT_ID',
      metadata: { name: 'My App', description: '…', url: 'https://myapp.com', icons: [] },
    }),
  }),

  createMetaMaskSnapConnector({
    broadcast: async (signedBase64) => {
      const result = await liveClient.broadcastTransaction(signedBase64 as Base64)
      if (!result.isOk()) throw result.error
      return { networkTxId: result.value.transactionId, broadcast: result.value }
    },
  }),
]

export function App() {
  return (
    <QubicProvider liveClient={live} archiveClient={archive}>
      <WalletProvider connectors={connectors}>
        <YourApp />
      </WalletProvider>
    </QubicProvider>
  )
}
```

| Prop | Default | Description |
|------|---------|-------------|
| `connectors` | required | List of `WalletConnector` instances |
| `storageKey` | `'qubic-active-connector'` | localStorage key for persisting the active connector |

### `useWallet()`

Single hook for all wallet state. Works with any connector registered in `WalletProvider`.

```tsx
import { useWallet } from '@qubic.ts/react'

function ConnectModal() {
  const [qrUri, setQrUri] = useState<string>()
  const { connectors, isConnected, isConnecting, account, activeConnector, connect, disconnect, error } = useWallet()

  if (isConnected) {
    return (
      <div>
        <p>{account?.name ?? account?.identity}</p>
        <p>via {activeConnector?.id}</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectors.filter(c => c.isAvailable()).map(c => (
        <button
          key={c.id}
          disabled={isConnecting}
          onClick={() => connect(c.id, c.id === 'walletconnect' ? { onUri: setQrUri } : undefined)}
        >
          {c.id}
        </button>
      ))}
      {qrUri && <QRCode value={qrUri} />}
      {error && <p>{error.message}</p>}
    </div>
  )
}
```

### Signing from any component

```tsx
function SendPanel() {
  const { isConnected, sendTransaction, signMessage } = useWallet()

  const handleSend = async () => {
    const result = await sendTransaction({ toIdentity: '…', amount: '1000', inputType: 0 })
    console.log(result.networkTxId)
  }

  const handleSign = async () => {
    const result = await signMessage({ message: 'hello qubic' })
    console.log(result.signatureHex)
  }
}
```

### Custom connector

Implement `WalletConnector` to add any other wallet backend:

```ts
import type { WalletConnector } from '@qubic.ts/react'

export const myConnector: WalletConnector = {
  id: 'my-wallet',
  isAvailable: () => true,
  connect: async () => ({ identity: '…' }),
  getAccount: async () => null,
  disconnect: async () => {},
  sendTransaction: async (_tx) => { throw new Error('not implemented') },
  signTransaction: async (_tx) => { throw new Error('not implemented') },
  signMessage: async (_msg) => { throw new Error('not implemented') },
  on: (_event, _cb) => () => {},
}
```

### Lower-level: `useWalletConnector(connector)` (no provider)

When you only need a single connector and don't want a provider:

```tsx
import { extensionConnector, useWalletConnector } from '@qubic.ts/react'

function ConnectButton() {
  const { isAvailable, isConnected, account, connect, disconnect } =
    useWalletConnector(extensionConnector)

  if (!isAvailable) return <p>Install the Qubic extension</p>
  if (!isConnected) return <button onClick={() => connect()}>Connect</button>
  return <button onClick={disconnect}>{account?.identity}</button>
}
```

## See also

- [`@qubic.ts/rpc`](../rpc) — `createLiveClient`, `createQueryClient`
- [`@qubic.ts/wallet`](../wallet) — `createVault`, `importVault`, `unlockVault`
- [`@qubic.ts/contracts`](../contracts) — typed contract builders, decoders, and readers
- [`@qubic.ts/events`](../events) — typed Bob subscription helpers
