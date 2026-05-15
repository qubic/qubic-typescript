import type { BinaryField, FieldType, NamedStruct } from './types.js'

// DecodedStruct uses unknown to avoid circular type constraint issues.
export type DecodedStruct = Record<string, unknown>
export type FieldValue = number | bigint | string | Uint8Array | FieldValue[] | DecodedStruct

export class PayloadBuildError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, { cause: options?.cause })
    this.name = 'PayloadBuildError'
  }
}

/**
 * Encodes a contract call input into binary using registry field descriptors.
 *
 * Field encoding rules:
 *   uint8/16/32    → DataView.setUintN (little-endian)
 *   uint64/sint64  → DataView.setBigUint64 / setBigInt64 (little-endian)
 *   uint128        → two consecutive uint64 LE (lo word first, hi word second)
 *   id             → 32-byte public key via injected identityToPublicKey
 *   bytes          → Uint8Array copied verbatim (must be exactly field.byteLength)
 *   struct         → recursively encoded using structs[field.structRef].fields
 *   array          → N items encoded sequentially
 *
 * Advanced mode: pass a Uint8Array as the value for any field. Its length must
 * equal field.byteLength — it is copied verbatim without type coercion.
 *
 * @throws {PayloadBuildError} on type mismatch, out-of-range value, or length mismatch
 */
export function buildPayload(
  fields: BinaryField[],
  structs: Record<string, NamedStruct>,
  input: Record<string, FieldValue | Uint8Array>,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  const totalSize = fields.reduce((s, f) => s + f.byteLength, 0)
  const buf = new Uint8Array(totalSize)
  const view = new DataView(buf.buffer)

  for (const field of fields) {
    const raw = input[field.name]
    if (raw === undefined) {
      throw new PayloadBuildError(`Missing field "${field.name}"`)
    }

    // Advanced mode: Uint8Array verbatim copy
    if (raw instanceof Uint8Array) {
      if (raw.byteLength !== field.byteLength) {
        throw new PayloadBuildError(
          `Field "${field.name}": Uint8Array length ${raw.byteLength} !== expected ${field.byteLength}`,
        )
      }
      buf.set(raw, field.offset)
      continue
    }

    encodeField(field, raw as FieldValue, buf, view, field.offset, structs, identityToPublicKey)
  }

  return buf
}

// ── Shared scalar encoder ─────────────────────────────────────────────────────

function writeScalar(
  type: FieldType,
  fieldName: string,
  value: FieldValue,
  buf: Uint8Array,
  view: DataView,
  offset: number,
  identityToPublicKey: (identity: string) => Uint8Array,
): void {
  switch (type) {
    case 'uint8':
    case 'sint8':
      if (typeof value !== 'number')
        throw new PayloadBuildError(`Field "${fieldName}": expected number`)
      view.setUint8(offset, value)
      break
    case 'uint16':
    case 'sint16':
      if (typeof value !== 'number')
        throw new PayloadBuildError(`Field "${fieldName}": expected number`)
      view.setUint16(offset, value, true)
      break
    case 'uint32':
    case 'sint32':
      if (typeof value !== 'number')
        throw new PayloadBuildError(`Field "${fieldName}": expected number`)
      view.setUint32(offset, value, true)
      break
    case 'uint64':
      if (typeof value !== 'bigint')
        throw new PayloadBuildError(`Field "${fieldName}": expected bigint`)
      view.setBigUint64(offset, value, true)
      break
    case 'sint64':
      if (typeof value !== 'bigint')
        throw new PayloadBuildError(`Field "${fieldName}": expected bigint`)
      view.setBigInt64(offset, value, true)
      break
    case 'uint128': {
      if (typeof value !== 'bigint')
        throw new PayloadBuildError(`Field "${fieldName}": expected bigint`)
      view.setBigUint64(offset, value & 0xffffffffffffffffn, true)
      view.setBigUint64(offset + 8, value >> 64n, true)
      break
    }
    case 'id': {
      if (typeof value !== 'string')
        throw new PayloadBuildError(`Field "${fieldName}": expected Identity string`)
      buf.set(identityToPublicKey(value).subarray(0, 32), offset)
      break
    }
    default:
      throw new PayloadBuildError(`Scalar encoding not supported for type "${type}"`)
  }
}

// ── Shared scalar decoder ─────────────────────────────────────────────────────

function readScalar(
  type: FieldType,
  data: Uint8Array,
  view: DataView,
  offset: number,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): FieldValue {
  switch (type) {
    case 'uint8':
      return view.getUint8(offset)
    case 'sint8':
      return view.getInt8(offset)
    case 'uint16':
      return view.getUint16(offset, true)
    case 'sint16':
      return view.getInt16(offset, true)
    case 'uint32':
      return view.getUint32(offset, true)
    case 'sint32':
      return view.getInt32(offset, true)
    case 'uint64':
      return view.getBigUint64(offset, true)
    case 'sint64':
      return view.getBigInt64(offset, true)
    case 'uint128': {
      const lo = view.getBigUint64(offset, true)
      const hi = view.getBigUint64(offset + 8, true)
      return lo + hi * 2n ** 64n
    }
    case 'id':
      return publicKeyToIdentity(data.subarray(offset, offset + 32))
    default:
      throw new PayloadBuildError(`Scalar decoding not supported for type "${type}"`)
  }
}

// ── Field encoder ─────────────────────────────────────────────────────────────

function encodeField(
  field: BinaryField,
  value: FieldValue,
  buf: Uint8Array,
  view: DataView,
  offset: number,
  structs: Record<string, NamedStruct>,
  identityToPublicKey: (identity: string) => Uint8Array,
): void {
  switch (field.type) {
    case 'uint8':
    case 'sint8':
    case 'uint16':
    case 'sint16':
    case 'uint32':
    case 'sint32':
    case 'uint64':
    case 'sint64':
    case 'uint128':
    case 'id':
      writeScalar(field.type, field.name, value, buf, view, offset, identityToPublicKey)
      break
    case 'bytes': {
      if (!(value instanceof Uint8Array))
        throw new PayloadBuildError(`Field "${field.name}": expected Uint8Array`)
      if (value.byteLength !== field.byteLength)
        throw new PayloadBuildError(
          `Field "${field.name}": Uint8Array length ${value.byteLength} !== expected ${field.byteLength}`,
        )
      buf.set(value, offset)
      break
    }
    case 'struct': {
      if (field.structRef === undefined)
        throw new PayloadBuildError(`Field "${field.name}": missing structRef`)
      const namedStruct = structs[field.structRef]
      if (!namedStruct)
        throw new PayloadBuildError(`Field "${field.name}": struct "${field.structRef}" not found`)
      if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value) ||
        value instanceof Uint8Array
      )
        throw new PayloadBuildError(`Field "${field.name}": expected object for struct`)
      const nested = value as DecodedStruct
      for (const sf of namedStruct.fields) {
        const sv = nested[sf.name]
        if (sv === undefined) throw new PayloadBuildError(`Struct field "${sf.name}" missing`)
        encodeField(
          sf,
          sv as FieldValue,
          buf,
          view,
          offset + sf.offset,
          structs,
          identityToPublicKey,
        )
      }
      break
    }
    case 'array': {
      if (!Array.isArray(value))
        throw new PayloadBuildError(`Field "${field.name}": expected array`)
      if (field.arrayItemByteLength === undefined)
        throw new PayloadBuildError(`Field "${field.name}": missing arrayItemByteLength`)
      const itemLen = field.arrayItemByteLength
      const itemType = field.arrayItemType ?? 'uint8'
      for (let i = 0; i < value.length; i++) {
        const itemOffset = offset + i * itemLen
        if (field.arrayItemStructRef !== undefined) {
          const namedStruct = structs[field.arrayItemStructRef]
          if (!namedStruct)
            throw new PayloadBuildError(
              `Field "${field.name}": struct item "${field.arrayItemStructRef}" not found`,
            )
          const itemVal = value[i] as DecodedStruct
          for (const sf of namedStruct.fields) {
            const sv = itemVal[sf.name]
            if (sv === undefined)
              throw new PayloadBuildError(`Array struct field "${sf.name}" missing`)
            encodeField(
              sf,
              sv as FieldValue,
              buf,
              view,
              itemOffset + sf.offset,
              structs,
              identityToPublicKey,
            )
          }
        } else {
          writeScalar(
            itemType,
            field.name,
            value[i] as FieldValue,
            buf,
            view,
            itemOffset,
            identityToPublicKey,
          )
        }
      }
      break
    }
    default:
      throw new PayloadBuildError(`Unknown field type: ${field.type}`)
  }
}

// ── Field decoder ─────────────────────────────────────────────────────────────

/**
 * Decodes binary payload bytes into a typed record using registry field descriptors.
 * Mirror of buildPayload — same field dispatch logic, reversed direction.
 */
export function decodePayload(
  data: Uint8Array,
  fields: BinaryField[],
  structs: Record<string, NamedStruct>,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): DecodedStruct {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  const result: DecodedStruct = {}
  for (const field of fields) {
    result[field.name] = decodeField(field, data, view, field.offset, structs, publicKeyToIdentity)
  }
  return result
}

function decodeField(
  field: BinaryField,
  data: Uint8Array,
  view: DataView,
  offset: number,
  structs: Record<string, NamedStruct>,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): FieldValue {
  switch (field.type) {
    case 'uint8':
    case 'sint8':
    case 'uint16':
    case 'sint16':
    case 'uint32':
    case 'sint32':
    case 'uint64':
    case 'sint64':
    case 'uint128':
    case 'id':
      return readScalar(field.type, data, view, offset, publicKeyToIdentity)
    case 'bytes':
      return data.slice(offset, offset + field.byteLength)
    case 'struct': {
      if (field.structRef === undefined)
        throw new PayloadBuildError(`Field "${field.name}": missing structRef`)
      const namedStruct = structs[field.structRef]
      if (!namedStruct)
        throw new PayloadBuildError(`Field "${field.name}": struct "${field.structRef}" not found`)
      const nested: DecodedStruct = {}
      for (const sf of namedStruct.fields) {
        nested[sf.name] = decodeField(
          sf,
          data,
          view,
          offset + sf.offset,
          structs,
          publicKeyToIdentity,
        )
      }
      return nested
    }
    case 'array': {
      if (field.arrayLength === undefined)
        throw new PayloadBuildError(`Field "${field.name}": missing arrayLength`)
      const items: FieldValue[] = []
      const itemLen = field.arrayItemByteLength ?? 0
      const itemType = field.arrayItemType ?? 'uint8'
      for (let i = 0; i < field.arrayLength; i++) {
        const itemOffset = offset + i * itemLen
        if (field.arrayItemStructRef !== undefined) {
          const namedStruct = structs[field.arrayItemStructRef]
          if (namedStruct) {
            const nested: DecodedStruct = {}
            for (const sf of namedStruct.fields) {
              nested[sf.name] = decodeField(
                sf,
                data,
                view,
                itemOffset + sf.offset,
                structs,
                publicKeyToIdentity,
              )
            }
            items.push(nested)
          }
        } else {
          items.push(readScalar(itemType, data, view, itemOffset, publicKeyToIdentity))
        }
      }
      return items
    }
    default:
      throw new PayloadBuildError(`Unknown field type: ${field.type}`)
  }
}

/**
 * Builds a payload from an ordered list of typed fields — no registry, no field names.
 * For use with unknown or custom contracts.
 *
 * @example
 * const payload = buildPayloadManual([
 *   { type: 'uint64', value: 5_000_000n },
 *   { type: 'uint32', value: 150 },
 * ])
 */
export function buildPayloadManual(
  fields: ReadonlyArray<{ type: FieldType; value: FieldValue }>,
): Uint8Array {
  const sizes: Record<string, number> = {
    uint8: 1,
    sint8: 1,
    uint16: 2,
    sint16: 2,
    uint32: 4,
    sint32: 4,
    uint64: 8,
    sint64: 8,
    uint128: 16,
    id: 32,
  }
  let totalSize = 0
  for (const f of fields) {
    if (f.type === 'struct' || f.type === 'array') {
      throw new PayloadBuildError(
        `buildPayloadManual does not support '${f.type}' fields — use buildPayload with a full BinaryField descriptor instead`,
      )
    }
    totalSize += f.value instanceof Uint8Array ? f.value.byteLength : (sizes[f.type] ?? 0)
  }
  const buf = new Uint8Array(totalSize)
  const view = new DataView(buf.buffer)
  let offset = 0
  for (const f of fields) {
    if (f.value instanceof Uint8Array) {
      buf.set(f.value, offset)
      offset += f.value.byteLength
    } else {
      const size = sizes[f.type] ?? 0
      writeScalar(f.type, '', f.value, buf, view, offset, () => new Uint8Array(32))
      offset += size
    }
  }
  return buf
}
