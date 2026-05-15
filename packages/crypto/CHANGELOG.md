# @qubic.org/crypto

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
  - @qubic.org/types@0.2.1
