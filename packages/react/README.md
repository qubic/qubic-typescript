# @qubic.ts/react

React hooks and context provider for the Qubic SDK, powered by [TanStack Query](https://tanstack.com/query).

## Installation

```bash
bun add @qubic.ts/react
```

Peer dependency: React 18+.

## Dependencies

- `@qubic.ts/rpc` — `createLiveClient`, `createQueryClient`
- `@qubic.ts/wallet` — `createWallet`, vault encryption
- `@qubic.ts/types` — `Identity`, `Seed` branded types
- `@tanstack/react-query` — query cache, `useQuery`

## Setup

Wrap your app root with `QubicProvider`. Pass a `liveClient` (required) and an optional `archiveClient` for historical data. `QubicProvider` also acts as a `QueryClientProvider` — pass your own TanStack `queryClient` to share the cache with the rest of your app.

```tsx
import { createLiveClient, createQueryClient } from '@qubic.ts/rpc'
import { QubicProvider } from '@qubic.ts/react'

const live = createLiveClient()
const archive = createQueryClient()

export function App() {
  return (
    <QubicProvider liveClient={live} archiveClient={archive}>
      <YourApp />
    </QubicProvider>
  )
}
```

## Hooks

### `useVault(vaultData)`

Manages an encrypted Qubic vault. Call `unlock(password)` to decrypt and derive `Wallet` objects. **Seeds are never stored in React state** — they are decrypted transiently inside `unlock`, wallets are derived, and the seeds fall out of scope immediately. The wallet closures retain the seed only for signing.

```tsx
import { useVault } from '@qubic.ts/react'
import { importVault } from '@qubic.ts/wallet'

// Load vault from localStorage / file / network
const vaultData = importVault(localStorage.getItem('qubic-vault')!)

function WalletPanel() {
  const { wallets, isUnlocked, isUnlocking, error, unlock, lock } = useVault(vaultData)

  const handleUnlock = async () => {
    await unlock('my-strong-password')
  }

  if (!isUnlocked) {
    return (
      <div>
        <button onClick={handleUnlock} disabled={isUnlocking}>
          {isUnlocking ? 'Unlocking…' : 'Unlock Wallet'}
        </button>
        {error && <p>Wrong password or corrupt vault</p>}
      </div>
    )
  }

  const [wallet] = wallets ?? []
  return (
    <div>
      <p>Identity: {wallet?.identity}</p>
      <button onClick={lock}>Lock</button>
    </div>
  )
}
```

### `useTickInfo(refetchIntervalMs?)`

Polls current tick, epoch, and timing from the live API.

```tsx
import { useTickInfo } from '@qubic.ts/react'

function TickDisplay() {
  const { data, isLoading } = useTickInfo(3_000) // re-poll every 3s
  if (isLoading) return <span>Loading…</span>
  return <span>Tick: {data?.tick} — Epoch: {data?.epoch}</span>
}
```

### `useBalance(identity)`

Fetches the balance for a Qubic identity. Disabled when identity is null/undefined.

```tsx
import { useBalance } from '@qubic.ts/react'

function Balance({ identity }: { identity: string }) {
  const { data } = useBalance(identity)
  return <span>{data?.balance ?? '—'} QU</span>
}
```

### `useTransaction(hash)`

Fetches a transaction from the archive by its 60-char hash. Requires `archiveClient`.

```tsx
import { useTransaction } from '@qubic.ts/react'

function TxInfo({ hash }: { hash: string }) {
  const { data, error } = useTransaction(hash)
  if (error) return <span>Not found</span>
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
```

### `useEventLogs(request)`

Queries historical event logs from the archive with rich filtering. Requires `archiveClient`.

```tsx
import { useEventLogs } from '@qubic.ts/react'

function RecentTransfers() {
  const { data } = useEventLogs({
    filters: { eventType: '0' },   // 0 = QU_TRANSFER
    pagination: { offset: 0, size: 20 },
  })
  return <ul>{data?.eventLogs.map(e => <li key={e.eventId}>{e.eventId}</li>)}</ul>
}
```

### `useQubic()`

Returns the raw context value — access `liveClient` and `archiveClient` directly for custom queries.

```tsx
import { useQubic } from '@qubic.ts/react'

function Custom() {
  const { liveClient, archiveClient } = useQubic()
  // call any client method directly
}
```

## Sharing your TanStack Query cache

If your app already uses TanStack Query, pass your `QueryClient` so Qubic hooks share the same cache and devtools:

```tsx
import { QueryClient } from '@tanstack/react-query'
import { QubicProvider } from '@qubic.ts/react'

const queryClient = new QueryClient()

<QubicProvider liveClient={live} queryClient={queryClient}>
  <App />
</QubicProvider>
```

## Security notes

- `useVault` never exposes seeds to component code or React state.
- Seeds live only in the `Wallet` closure created inside `unlock` — required for signing.
- Call `lock()` when the user logs out to remove wallet references from memory.
- Vault encryption: AES-256-GCM with PBKDF2-SHA256 (600k iterations) via `globalThis.crypto`.

## See also

- [`@qubic.ts/rpc`](../rpc) — `createLiveClient`, `createQueryClient`
- [`@qubic.ts/wallet`](../wallet) — `createWallet`, `createVault`, `unlockVault`
- [`@qubic.ts/events`](../events) — typed event decoder for Bob subscriptions
