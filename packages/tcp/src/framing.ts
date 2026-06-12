/**
 * Qubic RequestResponseHeader framing.
 *
 * Layout (8 bytes):
 *   [0–2]  size:    3-byte LE uint24 — total message size including this header
 *   [3]    type:    1-byte message type (NetworkMessageType)
 *   [4–7]  dejavu:  4-byte LE uint32 — 0 = broadcast to peers; non-zero = direct request
 */

import { randomBytes } from 'node:crypto'

export const HEADER_SIZE = 8

export interface DecodedHeader {
  /** Total message size including the 8-byte header. */
  size: number
  type: number
  dejavu: number
}

/** Returns a cryptographically random non-zero dejavu value for outgoing requests. */
function nextDejavu(): number {
  let v: number
  do {
    v = new DataView(randomBytes(4).buffer).getUint32(0, true)
  } while (v === 0)
  return v
}

/**
 * Encodes an 8-byte message header.
 * @param type    MessageType constant
 * @param payloadSize  Byte length of the payload that follows (not including the header)
 * @param dejavu  Override the auto-generated dejavu (0 = broadcast semantics)
 */
export function encodeHeader(type: number, payloadSize: number, dejavu?: number): Uint8Array {
  const totalSize = HEADER_SIZE + payloadSize
  if (totalSize > 0xffffff) throw new RangeError(`Message too large: ${totalSize} > 16777215`)
  const buf = new Uint8Array(HEADER_SIZE)
  buf[0] = totalSize & 0xff
  buf[1] = (totalSize >> 8) & 0xff
  buf[2] = (totalSize >> 16) & 0xff
  buf[3] = type & 0xff
  const dv = dejavu ?? nextDejavu()
  new DataView(buf.buffer).setUint32(4, dv, true)
  return buf
}

/**
 * Decodes the 8-byte header from the start of `bytes`.
 * @throws RangeError if bytes is shorter than HEADER_SIZE
 */
export function decodeHeader(bytes: Uint8Array): DecodedHeader {
  if (bytes.length < HEADER_SIZE)
    throw new RangeError(`Buffer too short: ${bytes.length} < ${HEADER_SIZE}`)
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const size = (view.getUint8(0) | (view.getUint8(1) << 8) | (view.getUint8(2) << 16)) >>> 0
  const type = view.getUint8(3)
  const dejavu = view.getUint32(4, true)
  return { size, type, dejavu }
}
