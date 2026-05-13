# qubic-typescript

TypeScript SDK for the [Qubic](https://qubic.org) network — monorepo of modular, tree-shakeable packages.

## Packages

| Package | Description |
|---|---|
| [`@qubic.ts/types`](packages/types) | Branded primitives, protocol constants, and shared error types |
| [`@qubic.ts/crypto`](packages/crypto) | K12 hash, SchnorrQ signatures, and identity derivation |
| [`@qubic.ts/tx`](packages/tx) | Binary transaction builder and signer |
| [`@qubic.ts/rpc`](packages/rpc) | Typed REST client for the Qubic RPC gateway |
| [`@qubic.ts/bob`](packages/bob) | Live node client — JSON-RPC 2.0, WebSocket subscriptions, OpenAPI REST |
| [`@qubic.ts/registry`](packages/registry) | Versioned ABI registry for all Qubic smart contracts across all epochs |
| [`@qubic.ts/contracts`](packages/contracts) | Generated typed wrappers for every deployed contract (built on `@qubic.ts/registry`) |
| [`@qubic.ts/events`](packages/events) | Event bus and typed event definitions |
| [`@qubic.ts/wallet`](packages/wallet) | Wallet and key management |
| [`@qubic.ts/tcp`](packages/tcp) | Raw TCP transport for peer connections |
| [`@qubic.ts/react`](packages/react) | React hooks and context providers |

## Quick start

```bash
bun install
bun test          # run all tests
bun run typecheck # typecheck all packages
bun run build     # build all packages
bun run lint      # lint + format
```

## Contract ABI registry

`@qubic.ts/registry` stores per-epoch ABI snapshots for every Qubic smart contract. The registry allows you to encode and decode contract call payloads for any epoch — including historical transactions — without any per-contract glue code.

```ts
import { createRegistryClient } from '@qubic.ts/registry/client'

const client = createRegistryClient('https://registry.qubic.ts')
const abi = await client.getAbi(9 /* Qearn */, 212 /* epoch */)
// abi.functions, abi.procedures, abi.structs
```

## Generated contract wrappers

`@qubic.ts/contracts` provides fully typed, zero-boilerplate wrappers generated from the latest epoch snapshot.

```ts
import { qearn } from '@qubic.ts/contracts'
import { createRpcClient } from '@qubic.ts/rpc'

const live = createRpcClient('https://rpc.qubic.org')

// High-level async query
const result = await qearn.getStateOfRound(live, { epoch: 212 })
if (result.ok) console.log(result.value.state)

// Payload builder for transaction construction
const payload = qearn.buildUnlockInput({ amount: 5_000_000n, lockedEpoch: 212 })
```

## Backfilling epoch snapshots

To regenerate ABI snapshots from the on-chain history:

```bash
# Regenerate a specific epoch range from qubic/core git tags
bun run packages/registry/scripts/backfill.ts --from-epoch 200

# Regenerate TypeScript wrappers from the latest epoch snapshot
bun run packages/contracts/scripts/generate.ts
```

## Monorepo structure

```
packages/
  registry/          @qubic.ts/registry   — ABI registry + payload codec
  contracts/         @qubic.ts/contracts  — generated typed wrappers
  rpc/               @qubic.ts/rpc        — REST gateway client
  bob/               @qubic.ts/bob        — live node client
  crypto/            @qubic.ts/crypto     — cryptographic primitives
  tx/                @qubic.ts/tx         — transaction builder
  types/             @qubic.ts/types      — shared primitives
  wallet/            @qubic.ts/wallet
  events/            @qubic.ts/events
  tcp/               @qubic.ts/tcp
  react/             @qubic.ts/react
apps/
  registry-cli/      CLI tool for the ABI registry
planning/            Architecture and design documents
resources/           Reference implementations and API schemas
```
