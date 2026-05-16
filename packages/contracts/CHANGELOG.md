# @qubic.org/contracts

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
  - @qubic.org/registry@0.2.1
  - @qubic.org/rpc@0.2.1
  - @qubic.org/types@0.2.1

## 0.2.0

### Minor Changes

- [`c75faa8`](https://github.com/alez04/qubic-typescript/commit/c75faa850fab3c186fd6b1a46e91c59a69dae173) Thanks [@alez04](https://github.com/alez04)! - initial public release

### Patch Changes

- Updated dependencies [[`c75faa8`](https://github.com/alez04/qubic-typescript/commit/c75faa850fab3c186fd6b1a46e91c59a69dae173)]:
  - @qubic.org/crypto@0.2.0
  - @qubic.org/registry@0.2.0
  - @qubic.org/rpc@0.2.0
  - @qubic.org/types@0.2.0
