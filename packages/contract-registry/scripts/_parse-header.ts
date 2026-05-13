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

// ── Type map ──────────────────────────────────────────────────────────────────

type MappedType = { type: FieldType; byteLength: number }

const QPI_TYPE_MAP: Record<string, MappedType> = {
  uint8: { type: 'uint8', byteLength: 1 },
  uint8_t: { type: 'uint8', byteLength: 1 },
  char: { type: 'uint8', byteLength: 1 },
  bool: { type: 'uint8', byteLength: 1 },
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
}

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
): BinaryField[] {
  const fields: BinaryField[] = []
  let offset = 0

  for (const child of body.children as TsNode[]) {
    if (child.type !== 'field_declaration') continue

    const typeNode = child.childForFieldName('type') as TsNode | null
    const declNode = child.childForFieldName('declarator') as TsNode | null
    if (!typeNode || !declNode) continue

    const fieldName = declNode.text.trim()
    if (fieldName.startsWith('_')) continue

    const typeName = typeNode.text.trim()

    if (typeNode.type === 'template_type') {
      const templateName = findChildByType(typeNode, 'type_identifier')?.text
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
          } else {
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

    console.warn(`  ⚠ Unknown field type "${typeName}" for "${fieldName}" — skipping`)
  }

  return fields
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

  // Build named helper structs (two-pass so later structs can reference earlier ones)
  const namedStructs = new Map<string, NamedStruct>()
  for (const { name, node } of directStructs) {
    if (name.endsWith('_input') || name.endsWith('_output')) continue
    const body = node.childForFieldName('body') as TsNode | null
    if (!body) continue
    const fields = extractFields(body, namedStructs, resolveSize)
    namedStructs.set(name, {
      name,
      fields,
      byteLength: fields.reduce((s, f) => s + f.byteLength, 0),
    })
  }

  // Assign ordinals: all _input structs in declaration order (1-indexed)
  const inputOrdinals = new Map<string, number>()
  let ordinal = 1
  for (const { name } of directStructs) {
    if (!name.endsWith('_input')) continue
    inputOrdinals.set(name.slice(0, -'_input'.length), ordinal++)
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
    const inputFields = inNode
      ? extractFields(inNode.node.childForFieldName('body') as TsNode, namedStructs, resolveSize)
      : []
    const outputFields = outNode
      ? extractFields(outNode.node.childForFieldName('body') as TsNode, namedStructs, resolveSize)
      : []
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

  return {
    contractIndex,
    contractName,
    effectiveFromEpoch,
    effectiveToEpoch: null,
    registeredAt: new Date().toISOString(),
    structs,
    procedures,
    functions,
  }
}
