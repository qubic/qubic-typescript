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

## Wallet connector (extension / WalletConnect / MetaMask Snap)

### `extensionConnector` + `useWalletConnector(connector)`

Connects to `window.qubic` (Qubic browser extension). The `WalletConnector` interface is designed for future backends — pass any connector that implements it.

```tsx
import { extensionConnector, useWalletConnector } from '@qubic.ts/react'

function ConnectButton() {
  const { isAvailable, isConnected, isConnecting, account, connect, disconnect, error } =
    useWalletConnector(extensionConnector)

  if (!isAvailable) return <p>Install the Qubic extension</p>

  if (!isConnected) {
    return (
      <button onClick={connect} disabled={isConnecting}>
        {isConnecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
    )
  }

  return (
    <div>
      <p>{account?.name ?? account?.identity}</p>
      <button onClick={disconnect}>Disconnect</button>
      {error && <p>{error.message}</p>}
    </div>
  )
}
```

### Signing with the connector

```tsx
function SignPanel() {
  const { account, signMessage, sendTransaction } = useWalletConnector(extensionConnector)

  const handleSign = async () => {
    const result = await signMessage({ message: 'hello qubic' })
    console.log(result.signatureHex)
  }

  const handleSend = async () => {
    const result = await sendTransaction({
      toIdentity: '...',
      amount: '1000',
      inputType: 0,
    })
    console.log(result.networkTxId)
  }
}
```

### WalletConnect v2

Requires `@walletconnect/sign-client` installed in your app (not bundled by `@qubic.ts/react`):

```bash
bun add @walletconnect/sign-client
```

```tsx
import SignClient from '@walletconnect/sign-client'
import { createWalletConnectConnector, useWalletConnector } from '@qubic.ts/react'

// Initialize once (outside component)
const wcClient = await SignClient.init({
  projectId: 'YOUR_PROJECT_ID',
  metadata: {
    name: 'My App',
    description: '…',
    url: 'https://myapp.com',
    icons: ['https://myapp.com/icon.png'],
  },
})
const wcConnector = createWalletConnectConnector(wcClient)

// In a component — pass onUri to display the QR code
function ConnectWC() {
  const [qrUri, setQrUri] = useState<string>()
  const { isConnected, account, connect, disconnect } = useWalletConnector(wcConnector)

  if (!isConnected) {
    return (
      <>
        <button onClick={() => connect({ onUri: setQrUri })}>Connect via WalletConnect</button>
        {qrUri && <QRCode value={qrUri} />}
      </>
    )
  }
  return <p>{account?.identity}</p>
}
```

Sessions persist in `localStorage` across page reloads. WalletConnect uses the Qubic namespace (`qubic:mainnet`) with methods `qubic_requestAccounts`, `qubic_signTransaction`, `qubic_sendQubic`, and `qubic_sign`.

### MetaMask Snap

Requires MetaMask Flask and the `@qubic-lib/qubic-mm-snap` snap. Broadcasting is handled by your app — pass a `broadcast` function:

```tsx
import { createMetaMaskSnapConnector, useWalletConnector } from '@qubic.ts/react'
import type { Base64 } from '@qubic.ts/types'

const snapConnector = createMetaMaskSnapConnector({
  broadcast: async (signedBase64) => {
    const result = await liveClient.broadcastTransaction(signedBase64 as Base64)
    if (!result.isOk()) throw result.error
    return { networkTxId: result.value.transactionId, broadcast: result.value }
  },
})

function ConnectSnap() {
  const { isAvailable, isConnected, account, connect, error } = useWalletConnector(snapConnector)

  if (!isAvailable) return <p>MetaMask not detected</p>
  if (!isConnected) return <button onClick={() => connect()}>Connect MetaMask Snap</button>
  return <p>{account?.identity}</p>
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
  sendTransaction: async (tx) => { /* … */ },
  signTransaction: async (tx) => { /* … */ },
  signMessage: async (msg) => { /* … */ },
  on: (event, cb) => () => {},
}
```

## See also

- [`@qubic.ts/rpc`](../rpc) — `createLiveClient`, `createQueryClient`
- [`@qubic.ts/wallet`](../wallet) — `createVault`, `importVault`, `unlockVault`
- [`@qubic.ts/contracts`](../contracts) — typed contract builders, decoders, and readers
- [`@qubic.ts/events`](../events) — typed Bob subscription helpers
