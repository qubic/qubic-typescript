import { k12, sign, verify } from '@qubic.org/crypto'
import { PROTOCOL, toBase64 } from '@qubic.org/types'
import type { Base64, Seed, TxHash } from '@qubic.org/types'
import { BinaryReader } from './binary-reader.js'
import { BinaryWriter } from './binary-writer.js'
import { InvalidTransactionError, PayloadTooLargeError, TickInThePastError } from './errors.js'

const HEADER_SIZE = PROTOCOL.TX_HEADER_SIZE // 80
const SIG_SIZE = PROTOCOL.SIGNATURE_SIZE // 64
const PK_SIZE = PROTOCOL.PUBLIC_KEY_SIZE // 32

export interface TransactionInput {
  /** 32-byte compressed FourQ public key of the sender. */
  sourcePublicKey: Uint8Array
  /** 32-byte public key of the recipient; all-zeros for contract calls. */
  destinationPublicKey: Uint8Array
  /** Transfer amount in QU (signed 64-bit LE). Use `0n` for most contract calls. */
  amount: bigint
  /** The tick at which this transaction should execute. */
  targetTick: number
  /** 0 for plain QU transfer; procedure index for contract calls. */
  inputType: number
  /** SC-specific binary payload. Must be `≤ PROTOCOL.MAX_INPUT_SIZE` bytes. */
  payload?: Uint8Array
  /**
   * When provided, `buildTransaction` validates that `targetTick > currentTick`.
   * @throws {TickInThePastError}
   */
  currentTick?: number
}

export interface DecodedTransaction {
  sourcePublicKey: Uint8Array
  destinationPublicKey: Uint8Array
  amount: bigint
  targetTick: number
  inputType: number
  payload: Uint8Array
}

/**
 * Builds the unsigned transaction bytes (80-byte header + payload).
 *
 * @throws {PayloadTooLargeError} If `payload` exceeds `PROTOCOL.MAX_INPUT_SIZE`.
 * @throws {TickInThePastError} If `currentTick` is provided and `targetTick ≤ currentTick`.
 * @example
 * ```ts
 * const txBytes = buildTransaction({ sourcePublicKey, destinationPublicKey, amount: 100n, targetTick: tick + 5, inputType: 0 })
 * ```
 */
export function buildTransaction(input: TransactionInput): Uint8Array {
  const payload = input.payload ?? new Uint8Array(0)

  if (payload.byteLength > PROTOCOL.MAX_INPUT_SIZE) {
    throw new PayloadTooLargeError(payload.byteLength)
  }
  if (input.currentTick !== undefined && input.targetTick <= input.currentTick) {
    throw new TickInThePastError(input.targetTick, input.currentTick)
  }

  const writer = new BinaryWriter(HEADER_SIZE + payload.byteLength)
  writer.writeBytes(input.sourcePublicKey.slice(0, PK_SIZE))
  writer.writeBytes(input.destinationPublicKey.slice(0, PK_SIZE))
  writer.writeInt64(input.amount)
  writer.writeUint32(input.targetTick)
  writer.writeUint16(input.inputType)
  writer.writeUint16(payload.byteLength)
  writer.writeBytes(payload)
  return writer.getBytes()
}

/**
 * Signs unsigned transaction bytes: `K12(txBytes, 32)` → `SchnorrQ.sign` → appends 64-byte signature.
 *
 * @param txBytes - Output of `buildTransaction`.
 * @param seed - 55-character lowercase seed.
 * @returns Signed transaction bytes (`txBytes || signature`).
 * @throws {InvalidSeedError} If the seed is invalid.
 * @example
 * ```ts
 * const signedTx = await signTransaction(txBytes, seed)
 * ```
 */
export async function signTransaction(txBytes: Uint8Array, seed: Seed): Promise<Uint8Array> {
  const digest = k12(txBytes, 32)
  const signature = await sign(digest, seed)
  const result = new Uint8Array(txBytes.byteLength + SIG_SIZE)
  result.set(txBytes, 0)
  result.set(signature, txBytes.byteLength)
  return result
}

/**
 * Base64-encodes a signed transaction for broadcast via `POST /live/v1/broadcast-transaction`.
 *
 * @param signedTx - Output of `signTransaction`.
 * @returns Base64 string ready for the broadcast API.
 */
export function encodeTransaction(signedTx: Uint8Array): Base64 {
  let str = ''
  for (let i = 0; i < signedTx.byteLength; i++) {
    str += String.fromCharCode(signedTx[i] as number)
  }
  return toBase64(btoa(str))
}

/**
 * Decodes signed or unsigned transaction bytes back into their constituent fields.
 *
 * @throws {InvalidTransactionError} If `bytes` is too short to contain a valid header.
 */
export function decodeTransaction(bytes: Uint8Array): DecodedTransaction {
  if (bytes.byteLength < HEADER_SIZE) {
    throw new InvalidTransactionError(
      `buffer too small: expected ≥ ${HEADER_SIZE} bytes, got ${bytes.byteLength}`,
    )
  }
  const reader = new BinaryReader(bytes)
  const sourcePublicKey = reader.readBytes(PK_SIZE)
  const destinationPublicKey = reader.readBytes(PK_SIZE)
  const amount = reader.readInt64()
  const targetTick = reader.readUint32()
  const inputType = reader.readUint16()
  const inputSize = reader.readUint16()
  const payload = reader.readBytes(inputSize)
  return { sourcePublicKey, destinationPublicKey, amount, targetTick, inputType, payload }
}

/**
 * Computes the 60-character lowercase transaction hash from signed transaction bytes.
 *
 * Algorithm: `K12(signedTxBytes, 32)` → encode 32 bytes using the identity alphabet in lowercase.
 *
 * @param signedTxBytes - Fully signed transaction (output of `signTransaction`).
 * @returns A 60-character lowercase `TxHash`.
 */
export function computeTransactionHash(signedTxBytes: Uint8Array): TxHash {
  const digest = k12(signedTxBytes, 32)
  return encodeBytesAsTxHash(digest)
}

/**
 * Verifies the SchnorrQ signature on a fully signed transaction.
 *
 * @param signedTxBytes - Output of `signTransaction`.
 * @returns `true` if the signature is valid.
 */
export function verifyTransactionSignature(signedTxBytes: Uint8Array): boolean {
  if (signedTxBytes.byteLength < HEADER_SIZE + SIG_SIZE) return false

  const inputSize = new DataView(
    signedTxBytes.buffer,
    signedTxBytes.byteOffset,
    signedTxBytes.byteLength,
  ).getUint16(78, true)

  const txEnd = HEADER_SIZE + inputSize
  if (signedTxBytes.byteLength < txEnd + SIG_SIZE) return false

  const txBytes = signedTxBytes.slice(0, txEnd)
  const signature = signedTxBytes.slice(txEnd, txEnd + SIG_SIZE)
  const sourcePublicKey = signedTxBytes.slice(0, PK_SIZE)

  const digest = k12(txBytes, 32)
  return verify(digest, signature, sourcePublicKey)
}

/** Encodes 32 bytes using the Qubic identity alphabet but in lowercase (producing a TxHash). */
function encodeBytesAsTxHash(bytes: Uint8Array): TxHash {
  const view = new DataView(bytes.buffer, bytes.byteOffset, 32)
  const chars: number[] = []

  for (let i = 0; i < 4; i++) {
    let fragment = view.getBigUint64(i * 8, true)
    for (let j = 0; j < 14; j++) {
      chars.push(Number(fragment % 26n) + 97)
      fragment /= 26n
    }
  }

  const checksumBytes = k12(bytes, 3)
  let checksum =
    BigInt(checksumBytes[0] as number) |
    (BigInt(checksumBytes[1] as number) << 8n) |
    (BigInt(checksumBytes[2] as number) << 16n)
  checksum &= 0x3ffffn
  for (let i = 0; i < 4; i++) {
    chars.push(Number(checksum % 26n) + 97)
    checksum /= 26n
  }

  return String.fromCharCode(...chars) as TxHash
}
