# @qubic.org/types

## 1.0.0

### Major Changes

- 782265b: - Remove `TICKS_TO_EXPIRY` from `PROTOCOL` (not a protocol constant)
  - Remove `SignatureVerificationError` (was unused)
  - Add `Result<T,E>`, `ok()`, `err()` shared across bob/rpc/contracts
  - Add `CurrentTickInfo`, `EntityRecord`, `RespondEntity`, `ExchangePublicPeers`, `TickData`, `TickVote`, `SystemInfo`, `Computors`, `TransactionHeader`, `RequestResponseHeader`, `ContractIPO`, `RequestedQuorumTick` protocol interfaces
  - Add `CUSTOM_MESSAGE_OP` constants and `CustomMessageSubtype` discriminated union for epoch/dividend protocol events
  - Add `isValidIdentityChecksum` type guard for full Qubic identity checksum validation

### Minor Changes

- f63c873: - **tcp**: Add request helpers and decoders for all 20 TCP message types, including oracle data queries and log/pruning helpers. Fix `decodeComputors` key offset (10→2), `requestContractFunction` header size (12→8 bytes with u16 fields), and asset decoders to read individual per-packet structs instead of count+array
  - **types**: Add protocol constants (`MAX_MESSAGE_SIZE`, `SPECTRUM_CAPACITY`, `ASSETS_CAPACITY`, `ISSUANCE_RATE`, `MAX_AMOUNT`, `MAX_SUPPLY`, `INITIAL_TICK`, `DEFAULT_PORT`, `NUMBER_OF_SOLUTION_PROCESSORS`, `QUORUM`) and enums (`ORACLE_QUERY_TYPE`, `ORACLE_QUERY_STATUS`, `ORACLE_FLAG`, `ASSET_TYPE`, `TX_INPUT_TYPE`, `ORACLE_REQ_TYPE`, `ORACLE_RES_TYPE`)
  - **events**: Add `subscribeBurningEvents`, `subscribeOracleEvents`, `subscribeCustomMessages` subscription helpers
  - **react**: Add `useActiveIpos` and `useContractIpoBids` hooks
  - **bob**: Fix `BobSyncStatus` discriminated union shape to match C++ response (`{ syncing: false }` instead of bare `false`)

### Patch Changes

- 02405fa: - **types**: Add `GGWP` (index 28) to `CONTRACT_INDEX` constant to match `smart_contracts.json`
  - **bob**: Add missing JSON-RPC methods: `getClientVersion`, `getSyncing`, `getStatus`, `sendRawTransaction`, `getTickByHash` with `BobSyncStatus` and `BobRpcStatus` types
- abc3d50: - Fix `SystemInfo` to include all 128 bytes: add `targetTickVoteSignature`, `computorPacketSignature`, `solutionAdditionalThreshold`, and 3 reserve fields
  - Fix `SpectrumStats` decoder to read full 224-byte struct including `entityCategoryPopulations[48]`
  - Fix `TickVote` byte count comment (360 -> 352, matching C++ `static_assert`)

## 0.2.7

### Patch Changes

- [`0ee4560`](https://github.com/alez04/qubic-typescript/commit/0ee4560fba8353ddf8cb48e3e8c45244ffe2d5fc) Thanks [@alez04](https://github.com/alez04)! - Point the `bun` export condition to `dist/index.js` instead of `src/index.ts` so packages resolve correctly when installed from npm.

## 0.2.6

## 0.2.5

## 0.2.4

### Patch Changes

- [`bd0335d`](https://github.com/alez04/qubic-typescript/commit/bd0335de3e34d339102298cb0f40f68618d73df8) Thanks [@alez04](https://github.com/alez04)! - Add `main` and `types` fields to all packages. This allows tools using `moduleResolution: "node"` (e.g. Angular 16) to resolve the packages without requiring `paths` overrides in tsconfig.

## 0.2.3

## 0.2.2

## 0.2.1

### Patch Changes

- c9aa0f8: Audit fixes across all packages.

  **@qubic.org/rpc**

  - All methods return `Result<T, QubicRpcError>` instead of throwing
  - New `QubicBalance` interface with `bigint` amounts; `getBalance` returns it
  - New utilities: `createQubicClient`, `waitForTick`, `pollUntilConfirmed`, `estimateTargetTick`

  **@qubic.org/contracts**

  - Procedure builders return `ContractCall` (`{ contractIndex, inputType, payload }`) instead of bare `Uint8Array`
  - Identity converter parameters omitted (not defaulted to zero bytes) when no `id`-type fields present; required when they are present

  **@qubic.org/registry**

  - `getProcedure` and `getFunction` now throw `EntryNotFoundError` (extends `AbiNotFoundError`) instead of plain `Error`
  - `buildPayloadManual` throws `PayloadBuildError` for `struct`/`array` types instead of silently producing a zero-sized buffer
  - Fixed `sint8`/`sint16`/`sint32` decode using signed reads
  - Fixed `sessionCache` shared across `createRegistryClient` instances

  **@qubic.org/crypto**

  - `publicKeyToIdentity` now throws `InvalidIdentityError` instead of plain `Error`
  - Fixed modulo bias in `generateRandomSeed`

  **@qubic.org/tx**

  - `buildTransaction` now validates `sourcePublicKey` and `destinationPublicKey` are exactly 32 bytes

  **@qubic.org/wallet**

  - Exported `SC_DESTINATION` constant (all-A identity for SC calls)
  - `ScTransactionParams.destination` is now optional; defaults to `SC_DESTINATION`
  - `WalletError` now extends `QubicError` from `@qubic.org/types`
  - Fixed `unlockVault` to use `vaultData.iterations` instead of the module constant

  **@qubic.org/bob**

  - Added 13 missing `BobRpcClient` methods
  - Per-method `AbortSignal` support on `BobRestClient`
  - Fixed `AbortSignal.any` usage with runtime guard
  - New `createBobClient` composite factory

  **@qubic.org/react**

  - `WalletAccount.identity` typed as branded `Identity`
  - `SendTransactionResult.broadcast` typed as `BroadcastTransactionResponse`
  - `useBalance` returns `QubicBalance` with `bigint` amounts
  - All query hooks unwrap `Result` and surface errors to TanStack Query
  - Fixed post-unmount state update in `WalletProvider`
  - Fixed `MetaMaskSnapConnector.isAvailable()` false positive for non-Flask MetaMask

## 0.2.0

### Minor Changes

- [`c75faa8`](https://github.com/alez04/qubic-typescript/commit/c75faa850fab3c186fd6b1a46e91c59a69dae173) Thanks [@alez04](https://github.com/alez04)! - initial public release
