# @qubic.org/crypto

## 1.0.0

### Major Changes

- 782265b: - Add `isValidIdentityChecksum()` for full Qubic identity checksum validation
  - Rename internal `bytesToBigInt` to `bytesToBigIntLE`/`bytesToBigIntBE` for endianness clarity

### Patch Changes

- 13a2267: - **events**: Fix `decodeSpectrumStats` minimum payload size from 224 to 220 bytes (u64+u64+u64+u32+48×u32 = 220)
  - **crypto**: Export `deriveKeys` and `DerivedKeys` type from package index
- eebe912: Fix package implementations against network specs and reference resource files.

  - **rpc**: Add missing `getContractIpoBids` endpoint (`GET /ipos/{contractIndex}/bids`) with `IpoBid`/`IpoBidData` types
  - **bob**: Fix `querySmartContract` params (add missing nonce, correct arg shape), add `getTransactionReceipt` method, rename `contractIndex` to `scIndex` in `BobLogFilter`/`BobFindLogFilter` to match core spec
  - **crypto**: Rename `bytesToBigIntBE` to `bytesToBigIntLE` to reflect correct little-endian semantics

- e5f4a1a: Fix signature malleability: remove weak S < 2^246 bit-mask guard and rely solely on the strict S < curve_order check. Signatures with non-canonical scalars (S in [r, 2^246)) are now correctly rejected, closing the double-spend vector where S' = S + r would verify for the same message.
- Updated dependencies [02405fa]
- Updated dependencies [f63c873]
- Updated dependencies [782265b]
- Updated dependencies [abc3d50]
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

## 0.2.0

### Minor Changes

- [`c75faa8`](https://github.com/alez04/qubic-typescript/commit/c75faa850fab3c186fd6b1a46e91c59a69dae173) Thanks [@alez04](https://github.com/alez04)! - initial public release

### Patch Changes

- Updated dependencies [[`c75faa8`](https://github.com/alez04/qubic-typescript/commit/c75faa850fab3c186fd6b1a46e91c59a69dae173)]:
  - @qubic.org/types@0.2.0
