# Development Roadmap

Full milestone breakdown from project setup to stable v1.0 across all packages.

---

## Milestone Overview

```
M0  Repository Setup            (1–2 days)
M1  @qubic.ts/crypto            (3–5 days)
M2  @qubic.ts/types             (1–2 days)
M3  @qubic.ts/tx                (3–4 days)
M4  @qubic.ts/rpc               (3–4 days)
M5  @qubic.ts/bob               (4–5 days)
M6  @qubic.ts/contracts         (5–7 days)
M7  @qubic.ts/wallet            (2–3 days)
M8  @qubic.ts/events            (3–4 days)
M9  @qubic.ts/registry  (5–7 days)
M10 @qubic.ts/tcp               (4–6 days)
M11 @qubic.ts/react             (3–4 days)
M12 Integration & QA            (3–5 days)
M13 Docs site + v1.0 release    (2–3 days)
```

---

## M0 — Repository Setup

**Goal:** Full monorepo skeleton with all tooling wired, CI green on an empty project.

**Tasks:**
- [ ] Root `package.json`: workspaces, shared scripts (`build`, `test`, `typecheck`, `generate`, `docs`, `clean`, `release`, `version`, `changeset`)
- [ ] Root `tsconfig.json`: strict flags, project references enabled
- [ ] `biome.json`: lint + format config, import sorting, all rules configured
- [ ] `lefthook.yml` or `simple-git-hooks` + `commitlint.config.js`
- [ ] `typedoc.json`: entry points, output dir, version
- [ ] `.changeset/config.json`: changelog provider, baseBranch, access
- [ ] `.github/workflows/ci.yml`: generate → typecheck → test → build
- [ ] `.github/workflows/release.yml`: changesets/action release flow
- [ ] `.github/workflows/docs.yml`: TypeDoc deploy to GitHub Pages
- [ ] Empty package scaffolds under `packages/` and `apps/` (package.json + tsconfig.json + src/index.ts placeholder)
- [ ] `.npmrc` for registry auth
- [ ] `CONTRIBUTING.md`: commit convention, changeset requirement, PR checklist

**Done when:** `bun install && bun run typecheck && bun test && bun run build` all pass on a clean checkout.

---

## M1 — `@qubic.ts/crypto`

**Goal:** Production-quality, fully-tested cryptography library with test vectors from the C++ reference.

**Tasks:**
- [ ] Move and refactor all files from `resources/cryptography/`: fix import aliases, apply kebab-case filenames
- [ ] `k12.ts` — re-export `kt128` from `@noble/hashes` with typed wrapper; TSDoc
- [ ] `fourq-constants.ts` — generator point, PARAM_D as `as const`
- [ ] `fp.ts` — GF(p) field arithmetic; TSDoc every operation
- [ ] `fq.ts` — GF(p²) extension field; TSDoc
- [ ] `fourq.ts` — `scalarBaseMult`, `doubleScalarMult`, `pointMarshal`, `pointUnmarshal`; TSDoc
- [ ] `schnorrq.ts` — `sign`, `verify`; branded types for subSeed/publicKey inputs
- [ ] `identity.ts` — full derivation pipeline; export `DerivedIdentity`, all helpers
- [ ] `random.ts` — isomorphic CSPRNG; browser + Bun + Node paths
- [ ] Test vectors: collect from C++ reference impl and `go-schnorrq` test suite
- [ ] `__tests__/k12.test.ts` — 5+ known vectors
- [ ] `__tests__/identity.test.ts` — derivation pipeline, checksum, round-trip
- [ ] `__tests__/schnorrq.test.ts` — sign/verify, wrong key, tampered message
- [ ] `__tests__/fourq.test.ts` — scalar mult vectors, marshal/unmarshal
- [ ] `__tests__/random.test.ts` — uniqueness, length
- [ ] Coverage ≥ 95%

**Done when:** All tests green, coverage ≥ 95%, package builds, TSDoc complete.

---

## M2 — `@qubic.ts/types`

**Goal:** Single source of truth for all shared TypeScript types, branded primitives, constants. Zero runtime code except validators.

**Tasks:**
- [ ] `branded.ts` — `Identity`, `Seed`, `TxHash`, `Base64`, `HexPublicKey` brands + factories + type guards
- [ ] `network.ts` — `TickInfo`, `ProcessedTickInterval`, `ComputorList`
- [ ] `transaction.ts` — `Transaction`, `TickData`, `BroadcastTransactionRequest/Response`, `QuerySmartContractRequest/Response`
- [ ] `balance.ts` — `Balance`
- [ ] `assets.ts` — `IssuedAsset`, `OwnedAsset`, `PossessedAsset` + sub-types; `Ipo`, `IpoBidData`
- [ ] `events.ts` — `LogType` const enum, `EventBase`, all 14 event data types, `Event` discriminated union
- [ ] `constants.ts` — `SIGNATURE_SIZE`, `NUMBER_OF_COMPUTORS`, `QUORUM`, `MAX_INPUT_SIZE`, `MAINNET_CHAIN_ID`, `MAX_AMOUNT`, `ISSUANCE_RATE`
- [ ] `errors.ts` — abstract `QubicError` base class
- [ ] `index.ts` — barrel re-exporting everything
- [ ] `__tests__/branded.test.ts` — all validators, edge cases
- [ ] TSDoc on every exported symbol

**Done when:** Tests green, no runtime dependencies, tsc compiles with zero errors.

---

## M3 — `@qubic.ts/tx`

**Goal:** Bit-perfect binary transaction encoder/decoder/signer matching C++ struct layout.

**Tasks:**
- [ ] `transaction-builder.ts` — `buildTransaction(TransactionInput)` → `Uint8Array`; validate all fields
- [ ] `transaction-signer.ts` — `signTransaction(txBytes, subSeed, publicKey)` → signed `Uint8Array`
- [ ] `transaction-encoder.ts` — `encodeTransactionToBase64`, `decodeTransaction`
- [ ] `transaction-hash.ts` — `computeTransactionHash` (60-char lowercase)
- [ ] `payload-builder.ts` — `buildPayload(PayloadField[])`, `PayloadReader` fluent reader
- [ ] `errors.ts` — `TransactionBuildError`, `PayloadTooLargeError`, `TickInThePastError`
- [ ] `__tests__/transaction-builder.test.ts` — byte-level layout verification, every field at correct offset
- [ ] `__tests__/transaction-signer.test.ts` — sign → verify round-trip; signature appended at correct offset
- [ ] `__tests__/transaction-hash.test.ts` — known hash vectors from real network txs
- [ ] `__tests__/payload-builder.test.ts` — every field type, alignment, round-trip
- [ ] Coverage ≥ 90%

**Done when:** Binary output matches C++ reference encoder byte-for-byte on known test vectors.

---

## M4 — `@qubic.ts/rpc`

**Goal:** Type-safe, OpenAPI-generated HTTP clients for live and archive APIs.

**Tasks:**
- [ ] Run `openapi-typescript` on `resources/qubic-http/protobuff/qubic.openapi.yaml` → `src/live-schema.d.ts`
- [ ] Run `openapi-typescript` on `resources/archive-query-service/v2/api/.../query_services.openapi.yaml` → `src/query-schema.d.ts`
- [ ] `live-client.ts` — `createLiveClient()`, all endpoints, amounts parsed as `bigint`, responses mapped to `@qubic.ts/types`
- [ ] `query-client.ts` — `createQueryClient()`, all endpoints, pagination, event log query
- [ ] `errors.ts` — `QubicRpcError`, `RpcNotFoundError`
- [ ] `types.ts` — re-exports and convenience type aliases for request/response shapes
- [ ] `__tests__/live-client.test.ts` — mock fetch; URL, body, response parsing, error paths for every method
- [ ] `__tests__/query-client.test.ts` — same pattern
- [ ] `generate` script in `package.json`; generated files committed

**Done when:** All methods typechecked against OpenAPI schema; mock tests green.

---

## M5 — `@qubic.ts/bob`

**Goal:** Full-coverage Bob indexer client — REST, JSON-RPC 2.0, and typed WebSocket subscriptions.

**Tasks:**
- [ ] Run `openapi-typescript` on `resources/core-bob/RESTAPI/openapi.json` → `src/bob-schema.d.ts`
- [ ] `rpc-types.ts` — hand-typed interfaces for all `qubic_*` JSON-RPC methods
- [ ] `rpc-client.ts` — `createBobRpcClient()`, JSON-RPC 2.0 framing, auto-incrementing IDs, batch support
- [ ] `rest-client.ts` — `createBobRestClient()`, openapi-fetch over generated schema
- [ ] `subscription-client.ts` — `createBobSubscriptionClient()`, all 4 subscription types as `AsyncIterable`, reconnection, catch-up tracking
- [ ] `errors.ts` — `BobRpcError`, `BobConnectionError`
- [ ] `__tests__/rpc-client.test.ts` — JSON-RPC framing, method coverage, error handling
- [ ] `__tests__/rest-client.test.ts` — URL/body/response for each endpoint
- [ ] `__tests__/subscription-client.test.ts` — subscribe, notification emit, catchUp flag, reconnect

**Done when:** All three client surfaces tested and typechecked.

---

## M6 — `@qubic.ts/contracts`

**Goal:** Typed, versioned payload builders and decoders for all known Qubic smart contracts.

**Tasks (per contract):**
- [ ] `registry.ts` — `CONTRACTS` const with index, name, known procedure/function indices
- [ ] `qx.ts` — Qx DEX: all procedures (addBidOrder, addAskOrder, removeBidOrder, removeAskOrder, transferShares, issueAsset) + read functions (getFees, getEntityOrders, getOrder) with binary layout matching C++ headers
- [ ] `qutil.ts` — QUtil utility functions
- [ ] `qearn.ts` — Qearn staking
- [ ] `ms-vault.ts` — MsVault multi-sig
- [ ] `escrow.ts` — Escrow
- [ ] `quottery.ts` — Quottery
- [ ] `qvault.ts` — QVAULT
- [ ] `qbond.ts` — QBond
- [ ] `qswap.ts` — Qswap
- [ ] `random.ts` — Random oracle
- [ ] `vottun-bridge.ts` — VottunBridge
- [ ] Generic `encode-sc-input.ts` / `decode-sc-response.ts` for custom contracts
- [ ] `__tests__/<contract>.test.ts` — encode/decode round-trip + known binary vectors for each contract

**Done when:** All 20+ contracts covered, payload builders/decoders tested against known binary payloads.

---

## M7 — `@qubic.ts/wallet`

**Goal:** High-level key management with vault file encryption.

**Tasks:**
- [ ] `wallet.ts` — `createWallet(seed)`, `Wallet` interface, `buildTransfer`, `buildScTransaction`
- [ ] `seed-utils.ts` — `generateSeed()`, `validateSeed()`
- [ ] `vault.ts` — `createVault`, `addToVault`, `unlockVault`, `exportVault`, `importVault` using AES-GCM via `globalThis.crypto`
- [ ] `errors.ts` — `WalletError`, `VaultDecryptionError`, `InvalidVaultError`
- [ ] `__tests__/wallet.test.ts` — known seed→identity, sign→verify round-trip
- [ ] `__tests__/vault.test.ts` — encrypt/decrypt, wrong password, corrupt data

**Done when:** `createWallet(seed).buildTransfer(...)` produces a verifiable signed transaction.

---

## M8 — `@qubic.ts/events`

**Goal:** Fully typed event decoding layer with oracle support and fluent filter builder.

**Tasks:**
- [ ] `decode-event.ts` — `decodeEvent(raw: Event): TypedEvent` for all 14 log types; binary payload parsing
- [ ] `event-filter-builder.ts` — `EventFilterBuilder` fluent API, `.build()` produces `EventLogFilters`
- [ ] `subscription-helpers.ts` — `subscribeQuTransfers`, `subscribeAssetEvents`, `subscribeContractLogs`, typed wrappers over `@qubic.ts/bob` subscriptions
- [ ] `oracle-events.ts` — `subscribeOracleEvents`, `queryOracleStatus`; `OracleQueryStatus` enum; full oracle data types
- [ ] `types.ts` — `TypedEvent` discriminated union, all event data interfaces
- [ ] `__tests__/decode-event.test.ts` — all 14 log types against known binary payloads
- [ ] `__tests__/event-filter-builder.test.ts` — filter shape for rpc and bob clients

**Done when:** All 14 log types decode to correct typed structs from known test payloads.

---

## M9 — `@qubic.ts/registry`

**Goal:** Published npm package — versioned ABI registry with unified build/decode engine for all Qubic contracts across all epochs.

**Tasks:**
- [ ] `src/types.ts` — `FieldType`, `BinaryField`, `NamedStruct`, `ContractCallBase`, `ContractAbiVersion`, `ContractRegistry`, `AbiLookupResult`
- [ ] `src/registry.ts` — `getAbi`, `getAbiHistory`, `getCurrentAbi`, `getProcedure`, `getFunction`, `findContractByIndex`, `findContractByName`, `validateRegistry`; `AbiNotFoundError`
- [ ] `src/payload.ts` — `buildPayload`, `decodePayload`, `buildPayloadManual`; `PayloadBuildError`; raw `Uint8Array` passthrough support
- [ ] `src/client.ts` — `createRegistryClient` with `'none' | 'session' | 'persistent'` caching and `ttlMs` option
- [ ] `data/registry.json` — seeded with Qearn as canonical example (`effectiveFromEpoch: 137`)
- [ ] `data/schema.json` — JSON Schema validating `arrayLength × arrayItemByteLength === byteLength`, no overlapping epochs, etc.
- [ ] `scripts/_git-utils.ts` — `cloneAtRef` (sparse checkout), `fetchCoreTags` (GitHub API)
- [ ] `scripts/extract-abi.ts` — tree-sitter-cpp ABI extraction at a specific git ref; `--write` flag to merge into `registry.json`
- [ ] `scripts/backfill.ts` — batch extraction across all git tags; `--static-bootstrap` reads `resources/static/data/smart_contracts.json` for `firstUseEpoch` per contract; interactive epoch mapping via `@clack/prompts`
- [ ] `scripts/validate.ts` — validate `registry.json` and exit 1 on error
- [ ] `package.json` — exports: `.` (main), `./client`, `./registry.json`, `./schema.json`; `"sideEffects": false`
- [ ] Tests: `registry.test.ts` (getAbi, findContractByIndex/Name, validateRegistry edge cases), `payload.test.ts` (encode/decode round-trips, raw passthrough, error cases)

**Done when:** `getAbi(registry, 9, 150)` returns Qearn ABI; `buildPayload` + `decodePayload` round-trip correctly; `backfill` script runs and populates registry from git history.

---

## M10 — `@qubic.ts/tcp`

**Goal:** Low-level Qubic native TCP protocol client for direct node communication.

**Tasks:**
- [ ] `message-types.ts` — `MessageType` const enum, all protocol message type numbers
- [ ] `protocol-framing.ts` — `encodeHeader`, `decodeHeader`, 3-byte size + 1-byte type + 4-byte dejavu
- [ ] `node-connection.ts` — `QubicNodeConnection` using `Bun.connect()` (falls back to `net.Socket` on Node); typed `request<TReq, TRes>`
- [ ] `node-pool.ts` — `QubicNodePool` with peer list, round-robin or random selection, retry
- [ ] `__tests__/protocol-framing.test.ts` — encode/decode round-trips, endianness
- [ ] `__tests__/node-connection.test.ts` — mock TCP server; request/response framing

**Done when:** Can connect to a live Qubic node, request tick data, and receive a valid response (integration test).

---

## M11 — `@qubic.ts/react`

**Goal:** React hooks and providers for Qubic dApp development.

**Tasks:**
- [ ] `qubic-provider.tsx` — `QubicProvider` context with LiveClient + QueryClient + optional BobSubscriptionClient
- [ ] `use-balance.ts` — `useBalance(identity)`
- [ ] `use-tick-info.ts` — `useTickInfo()` with auto-refresh
- [ ] `use-transaction.ts` — `useTransaction(hash)`
- [ ] `use-event-logs.ts` — `useEventLogs(filter)` with EventFilterBuilder integration
- [ ] `use-wallet.ts` — `useWallet(seed)` → `Wallet`
- [ ] `use-bob-subscription.ts` — `useBobSubscription(type, filter)` with automatic cleanup
- [ ] `__tests__/` — react-testing-library or bun test with JSDOM

**Done when:** All hooks typechecked and tested.

---

## M12 — Integration & QA

**Goal:** End-to-end integration tests against the live Qubic network.

**Tasks:**
- [ ] Integration test: full transaction send flow (getTickInfo → buildTransaction → sign → broadcast → verify inclusion)
- [ ] Integration test: read balance → build Qx order → submit → query event logs → verify order appears
- [ ] Integration test: Bob WebSocket subscription → receive live tick events
- [ ] Integration test: contract registry → decode real historical transaction payloads from archive
- [ ] Performance benchmarks: k12Hash throughput, identity derivation time
- [ ] Security audit checklist: no seeds logged, no private keys in errors, input validation at all boundaries

---

## M13 — Docs Site + v1.0 Release

**Goal:** Published documentation site + first stable release of all packages.

**Tasks:**
- [ ] TypeDoc generates full API reference site from TSDoc
- [ ] GitHub Pages deployment on release
- [ ] All README files complete (per-package: install, quickstart, API overview, links to TypeDoc)
- [ ] Root README: monorepo overview, package directory, quickstart for common use cases
- [ ] 0.x → 1.0: review all public APIs for breaking-change candidates, freeze them
- [ ] Publish all packages to npm under `@qubic.ts/` scope
- [ ] GitHub Release with changelog for v1.0

---

## Dependency Order Summary

```
M0 (setup) → M1 (crypto) → M2 (types) → M3 (tx)
                                       ↓
                            M4 (rpc) ← M3
                            M5 (bob) ← M2
                                       ↓
                  M6 (contracts) ← M3, M2
                  M7 (wallet) ← M1, M3, M2
                  M8 (events) ← M4, M5, M2
                  M9 (registry) ← M2
                                       ↓
                  M10 (tcp) ← M2, M1   (parallel)
                  M11 (react) ← M4, M7, M8
                                       ↓
                       M12 (integration & QA)
                                       ↓
                       M13 (docs + release)
```

M3–M5 can be parallelized across team members once M1 and M2 are done.
M6–M9 can be parallelized once M3–M5 are done. M9 (registry) only requires M2 and can start earlier.
