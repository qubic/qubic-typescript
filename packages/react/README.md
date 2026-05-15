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
      <VaultProvider vaultData={vault} autoLockMs={15 * 60_000}>
        <YourApp />
      </VaultProvider>
    </QubicProvider>
  )
}
```

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

## See also

- [`@qubic.ts/rpc`](../rpc) — `createLiveClient`, `createQueryClient`
- [`@qubic.ts/wallet`](../wallet) — `createVault`, `importVault`, `unlockVault`
- [`@qubic.ts/contracts`](../contracts) — typed contract builders, decoders, and readers
- [`@qubic.ts/events`](../events) — typed Bob subscription helpers
