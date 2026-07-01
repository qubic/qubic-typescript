# @qubic.org/registry

## 1.0.1

### Patch Changes

- 7c72b05: Fix tree-sitter WASM path in backfill script and regenerate contract wrappers from epoch 218

## 1.0.0

### Major Changes

- 782265b: - Validate fetched registry JSON with `validateRegistry()` after parsing
  - Throw explicit error for `id` type in `buildPayloadManual`
  - Add GGWP contract ABI snapshot
  - Update QIP and Random epoch snapshots

### Patch Changes

- a9f2da5: Fix payload encoding for signed integer types: `sint8` now uses `setInt8`, `sint16` uses `setInt16`, `sint32` uses `setInt32` instead of their unsigned counterparts. While two's complement makes the bit patterns identical for current JS engines, the signed setters are semantically correct and future-proof.
- caa30e3: Improve the backfill script with a `--catch-up` mode that queries the live RPC for the current epoch, refreshes stale cached epoch refs when needed, and records epoch/tag mappings through epoch 217.
- 4574738: Add ABI snapshots and contract wrappers for epochs 214–215. QVAULT changed in epoch 214 (v1.292.0), Qswap changed in epoch 215 (v1.293.1). Fix backfill script to pre-seed prior state so single-epoch runs only write snapshots for contracts with ABI changes.
- Updated dependencies [782265b]
- Updated dependencies [02405fa]
- Updated dependencies [13a2267]
- Updated dependencies [f63c873]
- Updated dependencies [eebe912]
- Updated dependencies [782265b]
- Updated dependencies [e5f4a1a]
- Updated dependencies [abc3d50]
  - @qubic.org/crypto@1.0.0
  - @qubic.org/types@1.0.0

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

### Patch Changes

- [`e3913f0`](https://github.com/alez04/qubic-typescript/commit/e3913f0abfce826fb6270793beabc36c9af596bc) Thanks [@alez04](https://github.com/alez04)! - Fix inputType values for all contract procedures and functions. The ABI parser was deriving inputType by counting `_input` struct declarations in source order, which produced wrong values (e.g. `GetFees` was 31 instead of 8) because internal and state structs shifted the ordinals. The parser now reads the registered number directly from `REGISTER_USER_FUNCTION` / `REGISTER_USER_PROCEDURE` macros, which are the authoritative source in the contract headers.

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

- Updated dependencies [c9aa0f8]
  - @qubic.org/crypto@0.2.1
  - @qubic.org/types@0.2.1

## 0.2.0

### Minor Changes

- [`c75faa8`](https://github.com/alez04/qubic-typescript/commit/c75faa850fab3c186fd6b1a46e91c59a69dae173) Thanks [@alez04](https://github.com/alez04)! - initial public release

### Patch Changes

- Updated dependencies [[`c75faa8`](https://github.com/alez04/qubic-typescript/commit/c75faa850fab3c186fd6b1a46e91c59a69dae173)]:
  - @qubic.org/crypto@0.2.0
  - @qubic.org/types@0.2.0
