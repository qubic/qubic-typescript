/**
 * Core ABI extraction logic for Qubic C++ contract headers.
 * Used by extract-abi.ts (single contract) and backfill.ts (batch).
 */
import { join } from 'node:path'
import type { BinaryField, ContractAbiVersion, FieldType, NamedStruct } from '../src/types.js'

// ── Tree-sitter init (singleton) ──────────────────────────────────────────────

const { Parser, Language } = require('web-tree-sitter') as typeof import('web-tree-sitter')
await Parser.init()
const wasmPath = join(import.meta.dir, '../node_modules/tree-sitter-cpp/tree-sitter-cpp.wasm')
const Cpp = await Language.load(wasmPath)

function makeParser() {
  const p = new Parser()
  p.setLanguage(Cpp)
  return p
}

// ── Known opaque QPI types ────────────────────────────────────────────────────

// These types are valid in contract STATE and _locals but are not serializable
// as ABI fields — silently skip them in all contexts.
const OPAQUE_QPI_TYPES = new Set([
  'HashMap',
  'HashSet',
  'Collection',
  'BitArray',
  'Locals',
  'StateData',
])

// ── Type map ──────────────────────────────────────────────────────────────────

type MappedType = { type: FieldType; byteLength: number }

const QPI_TYPE_MAP: Record<string, MappedType> = {
  uint8: { type: 'uint8', byteLength: 1 },
  uint8_t: { type: 'uint8', byteLength: 1 },
  char: { type: 'uint8', byteLength: 1 },
  bool: { type: 'uint8', byteLength: 1 },
  bit: { type: 'uint8', byteLength: 1 }, // QPI::bit wraps a char
  sint8: { type: 'sint8', byteLength: 1 },
  int8_t: { type: 'sint8', byteLength: 1 },
  uint16: { type: 'uint16', byteLength: 2 },
  uint16_t: { type: 'uint16', byteLength: 2 },
  sint16: { type: 'sint16', byteLength: 2 },
  int16_t: { type: 'sint16', byteLength: 2 },
  uint32: { type: 'uint32', byteLength: 4 },
  uint32_t: { type: 'uint32', byteLength: 4 },
  'unsigned int': { type: 'uint32', byteLength: 4 },
  sint32: { type: 'sint32', byteLength: 4 },
  int32_t: { type: 'sint32', byteLength: 4 },
  int: { type: 'sint32', byteLength: 4 },
  uint64: { type: 'uint64', byteLength: 8 },
  uint64_t: { type: 'uint64', byteLength: 8 },
  sint64: { type: 'sint64', byteLength: 8 },
  int64_t: { type: 'sint64', byteLength: 8 },
  'long long': { type: 'sint64', byteLength: 8 },
  uint128: { type: 'uint128', byteLength: 16 },
  id: { type: 'id', byteLength: 32 },
  m256i: { type: 'id', byteLength: 32 },
  // BitArray<L> typedefs: storage = ceil(L/64) * 8 bytes (one uint64 per 64 bits)
  bit_2: { type: 'bytes', byteLength: 8 },
  bit_4: { type: 'bytes', byteLength: 8 },
  bit_8: { type: 'bytes', byteLength: 8 },
  bit_16: { type: 'bytes', byteLength: 8 },
  bit_32: { type: 'bytes', byteLength: 8 },
  bit_64: { type: 'bytes', byteLength: 8 },
  bit_128: { type: 'bytes', byteLength: 16 },
  bit_256: { type: 'bytes', byteLength: 32 },
  bit_512: { type: 'bytes', byteLength: 64 },
  bit_1024: { type: 'bytes', byteLength: 128 },
  bit_2048: { type: 'bytes', byteLength: 256 },
  bit_4096: { type: 'bytes', byteLength: 512 },
}

// Built-in QPI structs from qpi.h that appear as field types in contracts.
// Sizes verified against static_assert statements in qpi.h.
const QPI_NAMED_STRUCTS: NamedStruct[] = [
  {
    name: 'Entity',
    byteLength: 64,
    fields: [
      { name: 'publicKey', type: 'id', offset: 0, byteLength: 32 },
      { name: 'incomingAmount', type: 'sint64', offset: 32, byteLength: 8 },
      { name: 'outgoingAmount', type: 'sint64', offset: 40, byteLength: 8 },
      { name: 'numberOfIncomingTransfers', type: 'uint32', offset: 48, byteLength: 4 },
      { name: 'numberOfOutgoingTransfers', type: 'uint32', offset: 52, byteLength: 4 },
      { name: 'latestIncomingTransferTick', type: 'uint32', offset: 56, byteLength: 4 },
      { name: 'latestOutgoingTransferTick', type: 'uint32', offset: 60, byteLength: 4 },
    ],
  },
  // ProposalSingleVoteDataV1: static_assert(sizeof == 16)
  {
    name: 'ProposalSingleVoteDataV1',
    byteLength: 16,
    fields: [
      { name: 'proposalIndex', type: 'uint16', offset: 0, byteLength: 2 },
      { name: 'proposalType', type: 'uint16', offset: 2, byteLength: 2 },
      { name: 'proposalTick', type: 'uint32', offset: 4, byteLength: 4 },
      { name: 'voteValue', type: 'sint64', offset: 8, byteLength: 8 },
    ],
  },
  { name: 'NoData', byteLength: 0, fields: [] },
  // OI::Price::OracleQuery (oracle_interfaces/Price.h):
  // id oracle (32) + DateAndTime timestamp (8) + id currency1 (32) + id currency2 (32) = 104
  {
    name: 'OI::Price::OracleQuery',
    byteLength: 104,
    fields: [
      { name: 'oracle', type: 'id', offset: 0, byteLength: 32 },
      { name: 'timestamp', type: 'struct', offset: 32, byteLength: 8, structRef: 'DateAndTime' },
      { name: 'currency1', type: 'id', offset: 40, byteLength: 32 },
      { name: 'currency2', type: 'id', offset: 72, byteLength: 32 },
    ],
  },
  // OI::Price::OracleReply: sint64 numerator (8) + sint64 denominator (8) = 16
  {
    name: 'OI::Price::OracleReply',
    byteLength: 16,
    fields: [
      { name: 'numerator', type: 'sint64', offset: 0, byteLength: 8 },
      { name: 'denominator', type: 'sint64', offset: 8, byteLength: 8 },
    ],
  },
  // Asset: id issuer (32) + uint64 assetName (8) = 40
  {
    name: 'Asset',
    byteLength: 40,
    fields: [
      { name: 'issuer', type: 'id', offset: 0, byteLength: 32 },
      { name: 'assetName', type: 'uint64', offset: 32, byteLength: 8 },
    ],
  },
  // DateAndTime: single uint64 value encoding year/month/day/hour/min/sec/ms = 8
  {
    name: 'DateAndTime',
    byteLength: 8,
    fields: [{ name: 'value', type: 'uint64', offset: 0, byteLength: 8 }],
  },
  // ProposalSummarizedVotingDataV1: static_assert(sizeof == 16 + 8*4 = 48)
  // union { Array<uint32,8>; sint64 } occupies 32 bytes at offset 16
  {
    name: 'ProposalSummarizedVotingDataV1',
    byteLength: 48,
    fields: [
      { name: 'proposalIndex', type: 'uint16', offset: 0, byteLength: 2 },
      { name: 'optionCount', type: 'uint16', offset: 2, byteLength: 2 },
      { name: 'proposalTick', type: 'uint32', offset: 4, byteLength: 4 },
      { name: 'totalVotesAuthorized', type: 'uint32', offset: 8, byteLength: 4 },
      { name: 'totalVotesCasted', type: 'uint32', offset: 12, byteLength: 4 },
      {
        name: 'optionVoteCount',
        type: 'array',
        offset: 16,
        byteLength: 32,
        arrayLength: 8,
        arrayItemType: 'uint32',
        arrayItemByteLength: 4,
      },
    ],
  },
  // ProposalDataV1<T>: static_assert(sizeof(ProposalDataV1<true>) == 256+8+64 = 328)
  // Template param only controls constexpr bool, not struct layout — both <true> and <false> are 328 bytes.
  {
    name: 'ProposalDataV1',
    byteLength: 328,
    fields: [
      { name: 'url', type: 'bytes', offset: 0, byteLength: 256 },
      { name: 'epoch', type: 'uint16', offset: 256, byteLength: 2 },
      { name: 'type', type: 'uint16', offset: 258, byteLength: 2 },
      { name: 'tick', type: 'uint32', offset: 260, byteLength: 4 },
      { name: 'data', type: 'bytes', offset: 264, byteLength: 64 },
    ],
  },
  // ProposalDataYesNo: static_assert(sizeof == 256+8+40 = 304)
  // union Data = max(Transfer: id(32)+sint64(8)=40, VariableOptions: uint64(8)+sint64(8)=16) = 40
  {
    name: 'ProposalDataYesNo',
    byteLength: 304,
    fields: [
      { name: 'url', type: 'bytes', offset: 0, byteLength: 256 },
      { name: 'epoch', type: 'uint16', offset: 256, byteLength: 2 },
      { name: 'type', type: 'uint16', offset: 258, byteLength: 2 },
      { name: 'tick', type: 'uint32', offset: 260, byteLength: 4 },
      { name: 'data', type: 'bytes', offset: 264, byteLength: 40 },
    ],
  },
]

// ── Tree-sitter helpers ───────────────────────────────────────────────────────

type TsTree = NonNullable<ReturnType<InstanceType<typeof Parser>['parse']>>
type TsNode = TsTree['rootNode']

function namedChildren(node: TsNode): TsNode[] {
  return node.namedChildren as TsNode[]
}

function findChildByType(node: TsNode, type: string): TsNode | null {
  for (const c of node.children as TsNode[]) {
    if (c.type === type) return c
  }
  return null
}

function findAllByType(node: TsNode, type: string, results: TsNode[] = []): TsNode[] {
  if (node.type === type) results.push(node)
  for (const c of node.children as TsNode[]) findAllByType(c, type, results)
  return results
}

// ── Constant resolution ───────────────────────────────────────────────────────

function resolveConstants(source: string): Map<string, number> {
  const constants = new Map<string, number>()
  for (const m of source.matchAll(/^#define\s+(\w+)\s+(\d+)/gm)) {
    if (m[1] !== undefined) constants.set(m[1], Number(m[2]))
  }
  for (const m of source.matchAll(/constexpr\s+\w+\s+(\w+)\s*=\s*(\d+)/g)) {
    if (m[1] !== undefined) constants.set(m[1], Number(m[2]))
  }
  return constants
}

// ── Struct collection ─────────────────────────────────────────────────────────

interface RawStruct {
  name: string
  node: TsNode
}

function findContractBody(
  root: TsNode,
  headerSource: string,
  explicitStructName?: string,
): TsNode | null {
  // First pass: explicit name if provided
  if (explicitStructName) {
    for (const s of findAllByType(root, 'struct_specifier')) {
      const nameNode = s.childForFieldName('name') as TsNode | null
      const body = s.childForFieldName('body') as TsNode | null
      if (nameNode?.text === explicitStructName && body && body.text.length > 4) return body
    }
  }
  // Second pass: find struct that inherits ContractBase
  const match = headerSource.match(/^struct\s+(\w+)\s*:[^{]*ContractBase/m)
  if (match) {
    const cppName = match[1]
    for (const s of findAllByType(root, 'struct_specifier')) {
      const nameNode = s.childForFieldName('name') as TsNode | null
      const body = s.childForFieldName('body') as TsNode | null
      if (nameNode?.text === cppName && body && body.text.length > 4) return body
    }
  }
  return null
}

function collectDirectStructs(body: TsNode): RawStruct[] {
  const result: RawStruct[] = []
  for (const child of body.children as TsNode[]) {
    let structNode: TsNode | null = null
    if (child.type === 'struct_specifier') {
      structNode = child
    } else if (child.type === 'field_declaration') {
      const typeNode = child.childForFieldName('type') as TsNode | null
      if (typeNode?.type === 'struct_specifier') structNode = typeNode
    }
    if (structNode) {
      const nameNode = structNode.childForFieldName('name') as TsNode | null
      const bodyNode = structNode.childForFieldName('body') as TsNode | null
      if (nameNode && bodyNode) result.push({ name: nameNode.text, node: structNode })
    }
  }
  return result
}

// ── Field extraction ──────────────────────────────────────────────────────────

function extractFields(
  body: TsNode,
  namedStructs: Map<string, NamedStruct>,
  resolveSize: (token: string) => number,
  warnOnUnknown = false,
): BinaryField[] {
  const fields: BinaryField[] = []
  let offset = 0

  // Pre-pass: register any inline struct definitions so they can be referenced as field types.
  // Handles both bare `struct Foo { ... };` and `field_declaration` whose type is a struct.
  for (const child of body.children as TsNode[]) {
    let structNode: TsNode | null = null
    if (child.type === 'struct_specifier') {
      structNode = child
    } else if (child.type === 'field_declaration') {
      const typeNode = child.childForFieldName('type') as TsNode | null
      if (typeNode?.type === 'struct_specifier') structNode = typeNode
    }
    if (!structNode) continue
    const nameNode = structNode.childForFieldName('name') as TsNode | null
    const bodyNode = structNode.childForFieldName('body') as TsNode | null
    if (!nameNode || !bodyNode || namedStructs.has(nameNode.text)) continue
    const inlineFields = extractFields(bodyNode, namedStructs, resolveSize, warnOnUnknown)
    namedStructs.set(nameNode.text, {
      name: nameNode.text,
      fields: inlineFields,
      byteLength: inlineFields.reduce((s, f) => s + f.byteLength, 0),
    })
  }

  for (const child of body.children as TsNode[]) {
    if (child.type !== 'field_declaration') continue

    const typeNode = child.childForFieldName('type') as TsNode | null
    const declNode = child.childForFieldName('declarator') as TsNode | null
    if (!typeNode || !declNode) continue

    const fieldName = declNode.text.trim()

    // When the type node is an inline struct_specifier, use the struct's name for lookup
    // (the pre-pass should have already registered it in namedStructs).
    const rawTypeName =
      typeNode.type === 'struct_specifier'
        ? ((typeNode.childForFieldName('name') as TsNode | null)?.text ?? typeNode.text)
        : typeNode.text
    // Strip known namespace qualifiers (QPI::, QPI::QPI::) that are transparent aliases.
    // Do NOT strip OI::X:: — those are registered in namedStructs under their full qualified name.
    const typeName = rawTypeName.replace(/^(?:QPI::)+/, '')

    if (typeNode.type === 'template_type') {
      const templateName = findChildByType(typeNode, 'type_identifier')?.text
      if (templateName === 'BitArray') {
        // BitArray<N>: storage = ceil(N/64) * 8 bytes. Treat as opaque bytes.
        const argList = findChildByType(typeNode, 'template_argument_list')
        const sizeToken = argList ? namedChildren(argList)[0]?.text?.trim() ?? '0' : '0'
        const bits = resolveSize(sizeToken)
        const byteLength = Math.ceil(bits / 64) * 8
        fields.push({ name: fieldName, type: 'bytes', offset, byteLength })
        offset += byteLength
        continue
      }
      if (templateName === 'Array') {
        const argList = findChildByType(typeNode, 'template_argument_list')
        if (argList) {
          const argChildren = namedChildren(argList)
          const itemTypeName = argChildren[0]?.text?.trim() ?? ''
          const sizeToken = argChildren[1]?.text?.trim() ?? '0'
          const arrayLength = resolveSize(sizeToken)

          const primitiveItem = QPI_TYPE_MAP[itemTypeName]
          if (primitiveItem) {
            const itemLen = primitiveItem.byteLength
            fields.push({
              name: fieldName,
              type: 'array',
              offset,
              byteLength: arrayLength * itemLen,
              arrayLength,
              arrayItemType: primitiveItem.type,
              arrayItemByteLength: itemLen,
            })
            offset += arrayLength * itemLen
          } else if (namedStructs.has(itemTypeName)) {
            const itemLen = namedStructs.get(itemTypeName)?.byteLength ?? 0
            fields.push({
              name: fieldName,
              type: 'array',
              offset,
              byteLength: arrayLength * itemLen,
              arrayLength,
              arrayItemStructRef: itemTypeName,
              arrayItemByteLength: itemLen,
            })
            offset += arrayLength * itemLen
          } else if (warnOnUnknown && !OPAQUE_QPI_TYPES.has(itemTypeName)) {
            console.warn(`  ⚠ Unknown Array item type "${itemTypeName}" for field "${fieldName}"`)
          }
          continue
        }
      }
    }

    if (namedStructs.has(typeName)) {
      const bl = namedStructs.get(typeName)?.byteLength ?? 0
      fields.push({ name: fieldName, type: 'struct', offset, byteLength: bl, structRef: typeName })
      offset += bl
      continue
    }

    const mapped = QPI_TYPE_MAP[typeName]
    if (mapped) {
      fields.push({ name: fieldName, type: mapped.type, offset, byteLength: mapped.byteLength })
      offset += mapped.byteLength
      continue
    }

    if (warnOnUnknown && !OPAQUE_QPI_TYPES.has(typeName)) {
      console.warn(`  ⚠ Unknown field type "${typeName}" for "${fieldName}" — skipping`)
    }
  }

  return fields
}

// ── Typedef resolution ────────────────────────────────────────────────────────

/**
 * Resolves typedef aliases into namedStructs entries. Runs until fixpoint so that
 * chained typedefs (e.g. Array<X,N> → T → T Foo_output) resolve in any order.
 *
 * Handles:
 *  - Simple struct aliases:        typedef ProposalSingleVoteDataV1 Vote_input
 *  - Template instantiation alias: typedef ProposalDataV1<false> ProposalDataT
 *  - Array<ItemType, Length>:      typedef Array<RevenueDonationEntry, 128> RevenueDonationT
 *  - Primitive type alias:         typedef sint64 GetTotalNumberOfAssetShares_output
 */
function resolveTypedefs(
  source: string,
  namedStructs: Map<string, NamedStruct>,
  resolveSize: (token: string) => number,
): void {
  let prevSize = -1
  while (prevSize !== namedStructs.size) {
    prevSize = namedStructs.size
    for (const m of source.matchAll(/typedef\s+(\w+)\s*(?:<([^>]*)>)?\s+(\w+)\s*;/g)) {
      const [, src, templateArgs, alias] = m
      if (!src || !alias || namedStructs.has(alias)) continue

      if (src === 'Array' && templateArgs !== undefined) {
        const parts = templateArgs.split(',').map((s) => s.trim())
        const itemTypeName = parts[0] ?? ''
        const sizeToken = parts[1]?.trim() ?? '0'
        const arrayLength = resolveSize(sizeToken)

        const primitiveItem = QPI_TYPE_MAP[itemTypeName]
        if (primitiveItem) {
          const totalBytes = arrayLength * primitiveItem.byteLength
          namedStructs.set(alias, {
            name: alias,
            byteLength: totalBytes,
            fields: [
              {
                name: 'data',
                type: 'array',
                offset: 0,
                byteLength: totalBytes,
                arrayLength,
                arrayItemType: primitiveItem.type,
                arrayItemByteLength: primitiveItem.byteLength,
              },
            ],
          })
        } else if (namedStructs.has(itemTypeName)) {
          const itemByteLen = namedStructs.get(itemTypeName)!.byteLength
          const totalBytes = arrayLength * itemByteLen
          namedStructs.set(alias, {
            name: alias,
            byteLength: totalBytes,
            fields: [
              {
                name: 'data',
                type: 'array',
                offset: 0,
                byteLength: totalBytes,
                arrayLength,
                arrayItemStructRef: itemTypeName,
                arrayItemByteLength: itemByteLen,
              },
            ],
          })
        }
        continue
      }

      // Simple struct alias (possibly from template instantiation like ProposalDataV1<false>)
      const resolved = namedStructs.get(src)
      if (resolved) {
        namedStructs.set(alias, { ...resolved, name: alias })
        continue
      }

      // Primitive type alias: typedef sint64 Foo_output → wrap in single-field struct
      const primitiveType = QPI_TYPE_MAP[src]
      if (primitiveType) {
        namedStructs.set(alias, {
          name: alias,
          byteLength: primitiveType.byteLength,
          fields: [{ name: 'value', type: primitiveType.type, offset: 0, byteLength: primitiveType.byteLength }],
        })
      }
    }
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface ParseHeaderOptions {
  headerSource: string
  contractName: string
  contractIndex: number
  effectiveFromEpoch: number
  explicitStructName?: string
}

export function parseContractHeader(options: ParseHeaderOptions): ContractAbiVersion {
  const { headerSource, contractName, contractIndex, effectiveFromEpoch, explicitStructName } =
    options

  const constants = resolveConstants(headerSource)
  function resolveSize(token: string): number {
    const n = Number(token)
    if (!Number.isNaN(n)) return n
    return constants.get(token) ?? 0
  }

  const parser = makeParser()
  const tree = parser.parse(headerSource)
  if (!tree) throw new Error(`Failed to parse header for ${contractName}`)

  const contractBody = findContractBody(tree.rootNode, headerSource, explicitStructName)
  if (!contractBody) throw new Error(`Could not find ContractBase subclass in ${contractName}.h`)

  const directStructs = collectDirectStructs(contractBody)

  // Pre-populate with QPI built-ins and global-scope structs from this header.
  // Global structs (defined outside the contract body, e.g. QEARNLogger) are
  // collected by scanning all top-level struct_specifiers that aren't the contract itself.
  const namedStructs = new Map<string, NamedStruct>()
  for (const s of QPI_NAMED_STRUCTS) namedStructs.set(s.name, s)

  for (const s of findAllByType(tree.rootNode, 'struct_specifier')) {
    const nameNode = s.childForFieldName('name') as TsNode | null
    const body = s.childForFieldName('body') as TsNode | null
    if (!nameNode || !body) continue
    const name = nameNode.text
    if (namedStructs.has(name)) continue // already known
    // Only collect top-level or file-scope structs (not inside the contract body)
    if (contractBody.text.includes(body.text) && body.text.length > 20) continue
    const fields = extractFields(body, namedStructs, resolveSize)
    namedStructs.set(name, {
      name,
      fields,
      byteLength: fields.reduce((s, f) => s + f.byteLength, 0),
    })
  }

  // Build struct map from direct children — includes _input/_output so they can be used
  // as field types inside other structs (e.g. _RemoveGapsInLockerArray_input).
  // Must run BEFORE typedef resolution so that structs like RevenueDonationEntry are
  // available when typedef Array<RevenueDonationEntry, 128> is resolved.
  for (const { name, node } of directStructs) {
    if (namedStructs.has(name)) continue
    const body = node.childForFieldName('body') as TsNode | null
    if (!body) continue
    const fields = extractFields(body, namedStructs, resolveSize)
    namedStructs.set(name, {
      name,
      fields,
      byteLength: fields.reduce((s, f) => s + f.byteLength, 0),
    })
  }

  // Resolve typedef aliases (fixpoint — handles chained, Array<X,N>, and primitive typedefs).
  resolveTypedefs(headerSource, namedStructs, resolveSize)

  // Assign ordinals: all _input declarations in source order (both struct and typedef forms).
  const inputOrdinals = new Map<string, number>()
  let ordinal = 1
  for (const m of contractBody.text.matchAll(
    /\bstruct\s+(\w+_input)\s*(?:\{|;)|\btypedef\s+\S+(?:\s*<[^>]*>)?\s+(\w+_input)\s*;/g,
  )) {
    const inputName = m[1] ?? m[2]
    if (!inputName) continue
    const procName = inputName.slice(0, -'_input'.length)
    if (!inputOrdinals.has(procName)) inputOrdinals.set(procName, ordinal++)
  }

  // Detect public procedures and functions via regex (macros expand to function defs)
  const publicProcedures = new Set<string>()
  const publicFunctions = new Set<string>()
  for (const m of headerSource.matchAll(
    /\bPUBLIC_(PROCEDURE|FUNCTION)(?:_WITH_LOCALS)?\s*\((\w+)\)/g,
  )) {
    const kind = m[1]
    const name = m[2]
    if (!kind || !name) continue
    if (kind === 'PROCEDURE') publicProcedures.add(name)
    else publicFunctions.add(name)
  }

  const procedures: ContractAbiVersion['procedures'] = []
  const functions: ContractAbiVersion['functions'] = []
  const usedStructs = new Set<string>()

  function collectUsed(fields: BinaryField[]) {
    for (const f of fields) {
      if (f.structRef) usedStructs.add(f.structRef)
      if (f.arrayItemStructRef) usedStructs.add(f.arrayItemStructRef)
    }
  }

  function buildEntry(name: string, kind: 'procedure' | 'function') {
    const inputType = inputOrdinals.get(name) ?? 0
    const inNode = directStructs.find((s) => s.name === `${name}_input`)
    const outNode = directStructs.find((s) => s.name === `${name}_output`)
    // Re-extract from tree-sitter node when available (captures warnOnUnknown warnings).
    // Fall back to namedStructs for typedef-aliased structs (e.g. typedef NoData Foo_input).
    const inputFields = inNode
      ? extractFields(inNode.node.childForFieldName('body') as TsNode, namedStructs, resolveSize, true)
      : (namedStructs.get(`${name}_input`)?.fields ?? [])
    const outputFields = outNode
      ? extractFields(outNode.node.childForFieldName('body') as TsNode, namedStructs, resolveSize, true)
      : (namedStructs.get(`${name}_output`)?.fields ?? [])
    collectUsed(inputFields)
    collectUsed(outputFields)
    return {
      kind,
      inputType,
      name,
      inputFields,
      outputFields,
      inputSize: inputFields.reduce((s, f) => s + f.byteLength, 0),
      outputSize: outputFields.reduce((s, f) => s + f.byteLength, 0),
    }
  }

  for (const name of publicProcedures) procedures.push(buildEntry(name, 'procedure'))
  for (const name of publicFunctions) functions.push(buildEntry(name, 'function'))

  procedures.sort((a, b) => a.inputType - b.inputType)
  functions.sort((a, b) => a.inputType - b.inputType)

  const structs: Record<string, NamedStruct> = {}
  for (const name of usedStructs) {
    const s = namedStructs.get(name)
    if (s) structs[name] = s
  }
  // Recursively include structs referenced by struct fields (e.g. QtryOrder inside QtryOrderWithPrice)
  let prevSize = -1
  while (prevSize !== Object.keys(structs).length) {
    prevSize = Object.keys(structs).length
    for (const s of Object.values(structs)) {
      for (const f of s.fields) {
        for (const ref of [f.structRef, f.arrayItemStructRef]) {
          if (ref && !structs[ref]) {
            const nested = namedStructs.get(ref)
            if (nested) structs[ref] = nested
          }
        }
      }
    }
  }

  return {
    contractIndex,
    contractName,
    effectiveFromEpoch,
    effectiveToEpoch: null,
    structs,
    procedures,
    functions,
  }
}
