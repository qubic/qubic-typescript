# @qubic.ts/react

React hooks and context providers for the Qubic SDK.

> **Status**: early development — API surface will expand significantly.

## Overview

`@qubic.ts/react` wraps the lower-level Qubic packages into idiomatic React hooks and context providers. It handles connection management, wallet state, real-time balance and tick subscriptions, and transaction lifecycle — letting React components consume Qubic data without managing async state manually.

## Installation

```bash
bun add @qubic.ts/react
```

Peer dependencies: React 18+.

## Dependencies

- `@qubic.ts/wallet` — wallet and key management
- `@qubic.ts/events` — real-time event bus
- `@qubic.ts/rpc` — REST client for initial data fetches

## Planned API surface

```ts
// Context provider — wrap your app root
<QubicProvider rpcUrl="https://rpc.qubic.org" bobUrl="http://localhost:40420">
  {children}
</QubicProvider>

// Hooks
const { tick, epoch } = useTickInfo()
const { balance } = useBalance(identity)
const { sendTransaction, status } = useTransaction()
const { identity, seed, connect, disconnect } = useWallet()
```

## See also

- [`@qubic.ts/wallet`](../wallet) — wallet primitives
- [`@qubic.ts/bob`](../bob) — live node client powering real-time subscriptions
- [`@qubic.ts/rpc`](../rpc) — REST gateway client
- [`@qubic.ts/events`](../events) — event bus
