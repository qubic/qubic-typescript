# @qubic.ts/tcp

Raw TCP transport for direct Qubic peer connections.

> **Status**: early development — API surface will expand significantly.

## Overview

`@qubic.ts/tcp` implements the low-level binary framing protocol used to communicate directly with Qubic nodes over TCP. It sits below `@qubic.ts/bob` (which uses HTTP/WebSocket) and is intended for use cases requiring direct peer access — custom indexers, validators, or environments where the HTTP gateway is unavailable.

## Installation

```bash
bun add @qubic.ts/tcp
```

## Dependencies

- `@qubic.ts/rpc` — shared data types
- `@qubic.ts/events` — event bus for incoming messages

## Design

The TCP layer decodes Qubic's length-prefixed binary frames and emits them as typed events via `@qubic.ts/events`. Application code subscribes to the event bus rather than parsing raw TCP bytes.

## See also

- [`@qubic.ts/bob`](../bob) — higher-level live node client over HTTP/WebSocket
- [`@qubic.ts/events`](../events) — event bus
- [`@qubic.ts/rpc`](../rpc) — REST gateway client (alternative transport)
