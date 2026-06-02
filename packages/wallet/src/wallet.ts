import { deriveIdentityFromSeed, identityToPublicKey, publicKeyFromSeed } from '@qubic.org/crypto'
import {
  buildTransaction,
  computeTransactionHash,
  encodeTransaction,
  signTransaction,
} from '@qubic.org/tx'
import type { Base64, Identity, Seed, TxHash } from '@qubic.org/types'

export interface SignedTransaction {
  /** Base64-encoded signed transaction, ready for broadcast. */
  encoded: Base64
  /** 60-character lowercase transaction hash. */
  hash: TxHash
  /** Raw signed bytes. */
  bytes: Uint8Array
}

export interface TransferParams {
  /** Recipient identity (60-character uppercase). */
  destination: Identity
  /** Amount in QU. Use `0n` for contract calls. */
  amount: bigint
  /** Tick at which the transaction should execute. */
  targetTick: number
  /**
   * When provided, validates that `targetTick > currentTick`.
   * @throws {TickInThePastError}
   */
  currentTick?: number
}

export interface ScTransactionParams extends Omit<TransferParams, 'destination'> {
  /** SC procedure input type index. */
  inputType: number
  /** Encoded SC payload bytes. */
  payload: Uint8Array
  /** Destination identity. Use `contractIndexToIdentity(contractIndex)` from `@qubic.org/crypto`. */
  destination: Identity
}

export interface Wallet {
  /** Derived 60-character Qubic identity. */
  readonly identity: Identity
  /** Derived 32-byte compressed FourQ public key. */
  readonly publicKey: Uint8Array
  /** Builds and signs a plain QU transfer. */
  buildTransfer(params: TransferParams): Promise<SignedTransaction>
  /** Builds and signs a smart contract procedure call. */
  buildScTransaction(params: ScTransactionParams): Promise<SignedTransaction>
}

/**
 * Creates a `Wallet` from a 55-character seed.
 *
 * The wallet derives the identity and public key eagerly; all signing is async.
 *
 * @throws {InvalidSeedError} If the seed is invalid.
 * @example
 * ```ts
 * const wallet = createWallet(seed)
 * const { encoded } = await wallet.buildTransfer({ destination, amount: 100n, targetTick })
 * ```
 */
export function createWallet(seed: Seed): Wallet {
  const publicKey = publicKeyFromSeed(seed)
  const identity = deriveIdentityFromSeed(seed)

  async function build(
    destination: Identity,
    amount: bigint,
    targetTick: number,
    currentTick: number | undefined,
    inputType: number,
    payload: Uint8Array,
  ): Promise<SignedTransaction> {
    const txBytes = buildTransaction({
      sourcePublicKey: publicKey,
      destinationPublicKey: identityToPublicKey(destination),
      amount,
      targetTick,
      inputType,
      ...(payload.byteLength > 0 ? { payload } : {}),
      ...(currentTick !== undefined ? { currentTick } : {}),
    })
    const signed = await signTransaction(txBytes, seed)
    return {
      encoded: encodeTransaction(signed),
      hash: computeTransactionHash(signed),
      bytes: signed,
    }
  }

  return {
    identity,
    publicKey,

    buildTransfer({ destination, amount, targetTick, currentTick }) {
      return build(destination, amount, targetTick, currentTick, 0, new Uint8Array(0))
    },

    buildScTransaction({
      destination,
      amount,
      targetTick,
      currentTick,
      inputType,
      payload,
    }) {
      return build(destination, amount, targetTick, currentTick, inputType, payload)
    },
  }
}
