import { identityToPublicKey } from '@qubic.ts/crypto'
import type { Identity } from '@qubic.ts/types'
import { BinaryWriter } from './binary-writer.js'

export type PayloadField =
  | { type: 'uint8'; value: number }
  | { type: 'uint16'; value: number }
  | { type: 'uint32'; value: number }
  | { type: 'uint64'; value: bigint }
  | { type: 'sint64'; value: bigint }
  | { type: 'bytes'; value: Uint8Array }
  | { type: 'id'; value: Identity }

const FIELD_SIZE: Record<PayloadField['type'], number> = {
  uint8: 1,
  uint16: 2,
  uint32: 4,
  uint64: 8,
  sint64: 8,
  bytes: 0,
  id: 32,
}

/**
 * Serialises a list of typed fields into a binary payload buffer.
 *
 * @param fields - Ordered list of typed values to encode.
 * @returns A `Uint8Array` containing the concatenated little-endian binary encoding.
 * @example
 * ```ts
 * const payload = buildPayload([
 *   { type: 'id',    value: issuerIdentity },
 *   { type: 'uint64', value: pricePerShare },
 *   { type: 'uint64', value: numberOfShares },
 * ])
 * ```
 */
export function buildPayload(fields: PayloadField[]): Uint8Array {
  const size = fields.reduce((acc, f) => {
    if (f.type === 'bytes') return acc + f.value.byteLength
    return acc + (FIELD_SIZE[f.type] as number)
  }, 0)

  const writer = new BinaryWriter(size)
  for (const field of fields) {
    switch (field.type) {
      case 'uint8':
        writer.writeUint8(field.value)
        break
      case 'uint16':
        writer.writeUint16(field.value)
        break
      case 'uint32':
        writer.writeUint32(field.value)
        break
      case 'uint64':
        writer.writeUint64(field.value)
        break
      case 'sint64':
        writer.writeInt64(field.value)
        break
      case 'bytes':
        writer.writeBytes(field.value)
        break
      case 'id':
        writer.writeBytes(identityToPublicKey(field.value))
        break
    }
  }
  return writer.getBytes()
}
