# @qubic.ts/events

Typed event bus and event definitions for the Qubic SDK.

> **Status**: early development — API surface will expand significantly.

## Overview

`@qubic.ts/events` provides a typed event bus used internally by higher-level packages (`@qubic.ts/bob`, `@qubic.ts/tcp`, `@qubic.ts/react`) to propagate on-chain events — tick advances, balance changes, transaction confirmations — without coupling packages directly to each other.

## Installation

```bash
bun add @qubic.ts/events
```

## Dependencies

- `@qubic.ts/rpc` — shared types for RPC data shapes
- `@qubic.ts/types` — branded types

## Design

The event bus decouples event producers (the live node clients in `@qubic.ts/bob` and `@qubic.ts/tcp`) from consumers (React hooks, application code). This lets you swap the underlying transport without changing event-handling code.

## See also

- [`@qubic.ts/bob`](../bob) — emits events via this package
- [`@qubic.ts/tcp`](../tcp) — emits events via this package
- [`@qubic.ts/react`](../react) — consumes events via hooks
