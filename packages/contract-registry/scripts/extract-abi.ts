#!/usr/bin/env bun
/**
 * Extracts a ContractAbiVersion from a Qubic C++ contract header.
 *
 * Usage:
 *   bun scripts/extract-abi.ts --contract Qearn --index 9 --effective-from 137 --local
 *   bun scripts/extract-abi.ts --contract Qx --index 1 --effective-from 66 --ref v1.234.0 [--write]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import type {
  BinaryField,
  ContractAbiVersion,
  ContractRegistry,
  FieldType,
  NamedStruct,
} from '../src/types.js'

// ── CLI ───────────────────────────────────────────────────────────────────────

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    contract: { type: 'string' },
    'struct-name': { type: 'string' },
    index: { type: 'string' },
    ref: { type: 'string' },
    'effective-from': { type: 'string' },
    local: { type: 'boolean', default: false },
    write: { type: 'boolean', default: false },
  },
})

const contractName = args.contract
const contractIndex = args.index !== undefined ? Number(args.index) : undefined
const effectiveFrom =
  args['effective-from'] !== undefined ? Number(args['effective-from']) : undefined

if (!contractName || contractIndex === undefined || effectiveFrom === undefined) {
  console.error(
    'Usage: extract-abi.ts --contract <Name> --index <N> --effective-from <epoch> [--local] [--ref <tag>] [--struct-name <CppName>] [--write]',
  )
  process.exit(1)
}

// ── Tree-sitter init ──────────────────────────────────────────────────────────

const { Parser, Language } = require('web-tree-sitter') as typeof import('web-tree-sitter')
await Parser.init()
const wasmPath = join(import.meta.dir, '../node_modules/tree-sitter-cpp/tree-sitter-cpp.wasm')
const Cpp = await Language.load(wasmPath)
const parser = new Parser()
parser.setLanguage(Cpp)

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

// ── Header loading ────────────────────────────────────────────────────────────

let headerSource: string

if (args.local) {
  const headerPath = join(
    import.meta.dir,
    `../../../resources/core/src/contracts/${contractName}.h`,
  )
  headerSource = readFileSync(headerPath, 'utf-8')
} else {
  if (!args.ref) {
    console.error('--ref <tag> is required when not using --local')
    process.exit(1)
  }
  const { cloneAtRef } = await import('./_git-utils.js')
  const { dir, cleanup } = await cloneAtRef({ ref: args.ref, paths: ['src/contracts'] })
  try {
    headerSource = readFileSync(join(dir, `src/contracts/${contractName}.h`), 'utf-8')
  } finally {
    await cleanup()
  }
}

// ── Constant resolution ───────────────────────────────────────────────────────

function resolveConstants(source: string): Map<string, number> {
  const constants = new Map<string, number>()
  // #define NAME VALUE
  for (const m of source.matchAll(/^#define\s+(\w+)\s+(\d+)/gm)) {
    if (m[1] !== undefined) constants.set(m[1], Number(m[2]))
  }
  // constexpr ... NAME = VALUE
  for (const m of source.matchAll(/constexpr\s+\w+\s+(\w+)\s*=\s*(\d+)/g)) {
    if (m[1] !== undefined) constants.set(m[1], Number(m[2]))
  }
  return constants
}

const CONSTANTS = resolveConstants(headerSource)

function resolveSize(token: string): number {
  const n = Number(token)
  if (!Number.isNaN(n)) return n
  return CONSTANTS.get(token) ?? 0
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

// ── Struct collection ─────────────────────────────────────────────────────────

interface RawStruct {
  name: string
  node: TsNode
}

/** Find the main contract struct by explicit struct name or by ContractBase inheritance. */
function findContractBody(root: TsNode): TsNode | null {
  const explicitName = args['struct-name']
  // First pass: look for explicit name or contract name match
  for (const s of findAllByType(root, 'struct_specifier')) {
    const nameNode = s.childForFieldName('name') as TsNode | null
    const body = s.childForFieldName('body') as TsNode | null
    const name = nameNode?.text ?? ''
    const searchName = explicitName ?? contractName
    if (name === searchName && body && body.text.length > 4) return body
  }
  // Second pass: find the struct that inherits ContractBase (grep-based)
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

/** Collect all direct-child struct nodes from a class body.
 * Handles both bare struct_specifier and field_declaration wrapping a struct_specifier. */
function collectDirectStructs(body: TsNode): RawStruct[] {
  const result: RawStruct[] = []
  for (const child of body.children as TsNode[]) {
    let structNode: TsNode | null = null
    if (child.type === 'struct_specifier') {
      structNode = child
    } else if (child.type === 'field_declaration') {
      // Inline struct: `struct Foo { ... };` parsed as field_declaration with struct_specifier child
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

function getStructByteLength(structName: string, namedStructs: Map<string, NamedStruct>): number {
  return namedStructs.get(structName)?.byteLength ?? 0
}

function extractFields(body: TsNode, namedStructs: Map<string, NamedStruct>): BinaryField[] {
  const fields: BinaryField[] = []
  let offset = 0

  for (const child of body.children as TsNode[]) {
    if (child.type !== 'field_declaration') continue

    const typeNode = child.childForFieldName('type') as TsNode | null
    const declNode = child.childForFieldName('declarator') as TsNode | null
    if (!typeNode || !declNode) continue

    const fieldName = declNode.text.trim()
    if (fieldName.startsWith('_')) continue // skip internal padding fields

    const typeName = typeNode.text.trim()

    // Array<T, N> template
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
            const itemLen = getStructByteLength(itemTypeName, namedStructs)
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
            offset += 0
          }
          continue
        }
      }
    }

    // Nested struct reference
    if (namedStructs.has(typeName)) {
      const bl = getStructByteLength(typeName, namedStructs)
      fields.push({ name: fieldName, type: 'struct', offset, byteLength: bl, structRef: typeName })
      offset += bl
      continue
    }

    // Primitive type
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

// ── Main extraction ───────────────────────────────────────────────────────────

const tree = parser.parse(headerSource)
if (!tree) throw new Error('Failed to parse header source')
const contractBody = findContractBody(tree.rootNode)

if (!contractBody) {
  console.error(`Could not find contract struct "${contractName}" in header`)
  process.exit(1)
}

const directStructs = collectDirectStructs(contractBody)

// Collect helper structs (not input/output) into namedStructs first
// so field extraction can reference them
const namedStructs = new Map<string, NamedStruct>()

for (const { name, node } of directStructs) {
  if (name.endsWith('_input') || name.endsWith('_output')) continue
  const body = node.childForFieldName('body') as TsNode | null
  if (!body) continue
  // Two-pass: extract fields using already-seen namedStructs
  const fields = extractFields(body, namedStructs)
  const byteLength = fields.reduce((s, f) => s + f.byteLength, 0)
  namedStructs.set(name, { name, fields, byteLength })
}

// Now assign ordinals: all _input structs in declaration order
const inputOrdinals = new Map<string, number>() // procName → inputType
let ordinal = 1
for (const { name } of directStructs) {
  if (!name.endsWith('_input')) continue
  const procName = name.slice(0, -'_input'.length)
  inputOrdinals.set(procName, ordinal++)
}

// Find PUBLIC_PROCEDURE and PUBLIC_FUNCTION via regex (macros expand to function definitions,
// not declarations, so tree-sitter can't reliably detect them as declarations)
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

// Build procedures and functions
const procedures: ContractAbiVersion['procedures'] = []
const functions: ContractAbiVersion['functions'] = []
const usedStructs = new Set<string>()

function collectUsedStructs(fields: BinaryField[]) {
  for (const f of fields) {
    if (f.structRef) usedStructs.add(f.structRef)
    if (f.arrayItemStructRef) usedStructs.add(f.arrayItemStructRef)
  }
}

for (const procName of publicProcedures) {
  const inputType = inputOrdinals.get(procName) ?? 0
  const inputStructName = `${procName}_input`
  const outputStructName = `${procName}_output`

  const inputStructNode = directStructs.find((s) => s.name === inputStructName)
  const outputStructNode = directStructs.find((s) => s.name === outputStructName)

  const inputFields = inputStructNode
    ? extractFields(inputStructNode.node.childForFieldName('body') as TsNode, namedStructs)
    : []
  const outputFields = outputStructNode
    ? extractFields(outputStructNode.node.childForFieldName('body') as TsNode, namedStructs)
    : []

  collectUsedStructs(inputFields)
  collectUsedStructs(outputFields)

  procedures.push({
    kind: 'procedure',
    inputType,
    name: procName,
    inputFields,
    outputFields,
    inputSize: inputFields.reduce((s, f) => s + f.byteLength, 0),
    outputSize: outputFields.reduce((s, f) => s + f.byteLength, 0),
  })
}

for (const fnName of publicFunctions) {
  const inputType = inputOrdinals.get(fnName) ?? 0
  const inputStructName = `${fnName}_input`
  const outputStructName = `${fnName}_output`

  const inputStructNode = directStructs.find((s) => s.name === inputStructName)
  const outputStructNode = directStructs.find((s) => s.name === outputStructName)

  const inputFields = inputStructNode
    ? extractFields(inputStructNode.node.childForFieldName('body') as TsNode, namedStructs)
    : []
  const outputFields = outputStructNode
    ? extractFields(outputStructNode.node.childForFieldName('body') as TsNode, namedStructs)
    : []

  collectUsedStructs(inputFields)
  collectUsedStructs(outputFields)

  functions.push({
    kind: 'function',
    inputType,
    name: fnName,
    inputFields,
    outputFields,
    inputSize: inputFields.reduce((s, f) => s + f.byteLength, 0),
    outputSize: outputFields.reduce((s, f) => s + f.byteLength, 0),
  })
}

// Sort by inputType
procedures.sort((a, b) => a.inputType - b.inputType)
functions.sort((a, b) => a.inputType - b.inputType)

// Collect only referenced structs
const structs: Record<string, NamedStruct> = {}
for (const name of usedStructs) {
  const s = namedStructs.get(name)
  if (s) structs[name] = s
}

const version: ContractAbiVersion = {
  contractIndex,
  contractName,
  effectiveFromEpoch: effectiveFrom,
  effectiveToEpoch: null,
  registeredAt: new Date().toISOString(),
  structs,
  procedures,
  functions,
}

// ── Output ────────────────────────────────────────────────────────────────────

const jsonOut = JSON.stringify(version, null, 2)

if (!args.write) {
  console.log(jsonOut)
} else {
  const registryPath = join(import.meta.dir, '../data/registry.json')
  const registry = JSON.parse(readFileSync(registryPath, 'utf-8')) as ContractRegistry

  // Close previous current version for this contract (if any)
  for (const v of registry.versions) {
    if (v.contractIndex === contractIndex && v.effectiveToEpoch === null) {
      v.effectiveToEpoch = effectiveFrom - 1
    }
  }

  registry.versions.push(version)
  registry.versions.sort(
    (a, b) => a.contractIndex - b.contractIndex || a.effectiveFromEpoch - b.effectiveFromEpoch,
  )
  registry.updatedAt = new Date().toISOString()

  writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`)
  console.log(
    `✓ Wrote ${contractName} (index ${contractIndex}) effectiveFrom=${effectiveFrom} to registry.json`,
  )
}
