import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { BinaryField, ContractAbiVersion, FieldType, NamedStruct } from '@qubic.org/registry'

const epochsDir = join(import.meta.dir, '../../registry/data/epochs')

// Find the highest-numbered epoch folder
const epochDirs = readdirSync(epochsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory() && /^\d+$/.test(e.name))
  .map((e) => Number(e.name))
  .sort((a, b) => a - b)

if (epochDirs.length === 0) throw new Error(`No epoch folders found in ${epochsDir}`)
const latestEpoch = epochDirs[epochDirs.length - 1] as number
const latestEpochDir = join(epochsDir, String(latestEpoch))

console.log(`Generating from epoch ${latestEpoch} (${latestEpochDir})`)

// Read all contract snapshots from the latest epoch folder
const versions: ContractAbiVersion[] = readdirSync(latestEpochDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(latestEpochDir, f), 'utf-8')) as ContractAbiVersion)
  .sort((a, b) => a.contractIndex - b.contractIndex)

const outDir = join(import.meta.dir, '../src/__generated__')
mkdirSync(outDir, { recursive: true })

// ── Name helpers ──────────────────────────────────────────────────────────────

// "My Last Match" → "mylastmatch"  |  "QEarn" → "qearn"
function toFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
}

// "My Last Match" → "MyLastMatch"  |  "Multi-Sign Vault" → "MultiSignVault"
function toContractPascal(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (c: string) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
}

// "My Last Match" → "MY_LAST_MATCH"  |  "QEarn" → "QEARN"
function toScreamingSnake(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase()
}

// "myField" → "MyField"
function toPascalCase(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// "OI::Price::OracleQuery" → "OIPriceOracleQuery"  |  "SimpleStruct" → "SimpleStruct"
function toStructName(name: string): string {
  return name
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

// "GeneralQuorumProposal" → "generalQuorumProposal"  |  "QEarn" → "qEarn"
function toObjectName(name: string): string {
  const pascal = toContractPascal(name)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

// ── Code helpers ──────────────────────────────────────────────────────────────

function tsType(field: BinaryField, contractPascal: string): string {
  switch (field.type) {
    case 'uint8':
    case 'uint16':
    case 'uint32':
    case 'sint8':
    case 'sint16':
    case 'sint32':
      return 'number'
    case 'uint64':
    case 'sint64':
    case 'uint128':
      return 'bigint'
    case 'id':
      return 'string'
    case 'bytes':
      return 'Uint8Array'
    case 'struct':
      return field.structRef
        ? `${contractPascal}${toStructName(field.structRef)}Struct`
        : 'Record<string, unknown>'
    case 'array': {
      const itemType: FieldType = field.arrayItemType ?? 'uint8'
      const itemField: BinaryField = {
        name: field.name,
        type: itemType,
        offset: 0,
        byteLength: field.arrayItemByteLength ?? 0,
        structRef: field.arrayItemStructRef,
      }
      return `${tsType(itemField, contractPascal)}[]`
    }
  }
}

function fieldsLiteral(fields: BinaryField[], indent = '  '): string {
  if (fields.length === 0) return '[]'
  const items = fields
    .map((f) => {
      const entries: string[] = [
        `${indent}  name: '${f.name}'`,
        `${indent}  type: '${f.type}'`,
        `${indent}  offset: ${f.offset}`,
        `${indent}  byteLength: ${f.byteLength}`,
      ]
      if (f.structRef !== undefined) entries.push(`${indent}  structRef: '${f.structRef}'`)
      if (f.arrayLength !== undefined) entries.push(`${indent}  arrayLength: ${f.arrayLength}`)
      if (f.arrayItemType !== undefined)
        entries.push(`${indent}  arrayItemType: '${f.arrayItemType}'`)
      if (f.arrayItemByteLength !== undefined)
        entries.push(`${indent}  arrayItemByteLength: ${f.arrayItemByteLength}`)
      if (f.arrayItemStructRef !== undefined)
        entries.push(`${indent}  arrayItemStructRef: '${f.arrayItemStructRef}'`)
      return `${indent}{\n${entries.join(',\n')},\n${indent}}`
    })
    .join(',\n')
  return `[\n${items},\n]`
}

function interfaceFields(fields: BinaryField[], contractPascal: string): string {
  return fields.map((f) => `  ${f.name}: ${tsType(f, contractPascal)}`).join('\n')
}

function structLiteral(s: NamedStruct): string {
  return `{
  name: '${s.name}',
  byteLength: ${s.byteLength},
  fields: ${fieldsLiteral(s.fields, '    ')},
}`
}

// ── Per-contract generation ───────────────────────────────────────────────────

const contractFiles: string[] = []

for (const version of versions) {
  const cSnake = toScreamingSnake(version.contractName)
  const cPascal = toContractPascal(version.contractName)
  const contractFile = toFileName(version.contractName)
  const cObject = toObjectName(version.contractName)
  contractFiles.push(contractFile)

  const structNames = Object.keys(version.structs)
  const hasStructs = structNames.length > 0

  // Determine which runtime helpers are needed
  const functionsWithOutput = version.functions.filter((f) => f.outputFields.length > 0)
  const needsCallRuntime = functionsWithOutput.length > 0

  const lines: string[] = [
    '// @generated — do not edit by hand. Run `bun run generate` to regenerate.',
    "import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'",
    "import { buildPayload, decodePayload } from '@qubic.org/registry'",
    ...(needsCallRuntime
      ? [
          "import type { QubicRpcError } from '@qubic.org/rpc'",
          "import { type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'",
          "import type { Result } from '../result.js'",
        ]
      : []),
    '',
    `export const ${cSnake}_CONTRACT_INDEX = ${version.contractIndex}`,
    '',
  ]

  // Struct interfaces + internal STRUCTS map
  if (hasStructs) {
    for (const [name, s] of Object.entries(version.structs)) {
      if (s.fields.length > 0) {
        lines.push(
          `export interface ${cPascal}${toStructName(name)}Struct {`,
          interfaceFields(s.fields, cPascal),
          '}',
          '',
        )
      }
    }
    const structEntries = structNames
      .map((name) => `  '${name}': ${structLiteral(version.structs[name] as NamedStruct)}`)
      .join(',\n')
    lines.push(`const STRUCTS: Record<string, NamedStruct> = {\n${structEntries},\n}`, '')
  } else {
    lines.push('const STRUCTS: Record<string, NamedStruct> = {}', '')
  }

  // ── Procedures ──────────────────────────────────────────────────────────────
  // Procedures are write operations: expose buildInput + decodeOutput only.
  for (const call of version.procedures) {
    const callPascal = toPascalCase(call.name)
    const callSnake = toScreamingSnake(call.name)

    lines.push(`export const ${cSnake}_${callSnake}_INPUT_TYPE = ${call.inputType}`, '')

    if (call.inputFields.length > 0) {
      lines.push(
        `export interface ${cPascal}${callPascal}Input {`,
        interfaceFields(call.inputFields, cPascal),
        '}',
        '',
        `const ${cSnake}_${callSnake}_INPUT_FIELDS: BinaryField[] = ${fieldsLiteral(call.inputFields)}`,
        '',
        `export function build${cPascal}${callPascal}Input(`,
        `  input: ${cPascal}${callPascal}Input,`,
        '  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),',
        '): Uint8Array {',
        `  return buildPayload(${cSnake}_${callSnake}_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)`,
        '}',
        '',
      )
    }

    if (call.outputFields.length > 0) {
      lines.push(
        `export interface ${cPascal}${callPascal}Output {`,
        interfaceFields(call.outputFields, cPascal),
        '}',
        '',
        `const ${cSnake}_${callSnake}_OUTPUT_FIELDS: BinaryField[] = ${fieldsLiteral(call.outputFields)}`,
        '',
        `export function decode${cPascal}${callPascal}Output(`,
        '  data: Uint8Array,',
        "  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),",
        `): ${cPascal}${callPascal}Output {`,
        `  return decodePayload(data, ${cSnake}_${callSnake}_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as ${cPascal}${callPascal}Output`,
        '}',
        '',
      )
    }
  }

  // ── Functions ────────────────────────────────────────────────────────────────
  // Functions are read-only queries: expose a high-level async caller + low-level decode.
  for (const call of version.functions) {
    const callPascal = toPascalCase(call.name)
    const callSnake = toScreamingSnake(call.name)
    const hasInput = call.inputFields.length > 0

    lines.push(
      `export const ${cSnake}_${callSnake}_INPUT_TYPE = ${call.inputType}`,
      `export const ${cSnake}_${callSnake}_INPUT_SIZE = ${call.inputSize}`,
      '',
    )

    if (hasInput) {
      lines.push(
        `export interface ${cPascal}${callPascal}Input {`,
        interfaceFields(call.inputFields, cPascal),
        '}',
        '',
        `const ${cSnake}_${callSnake}_INPUT_FIELDS: BinaryField[] = ${fieldsLiteral(call.inputFields)}`,
        '',
        `export function build${cPascal}${callPascal}Input(`,
        `  input: ${cPascal}${callPascal}Input,`,
        '  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),',
        '): Uint8Array {',
        `  return buildPayload(${cSnake}_${callSnake}_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)`,
        '}',
        '',
      )
    }

    if (call.outputFields.length > 0) {
      lines.push(
        `export interface ${cPascal}${callPascal}Output {`,
        interfaceFields(call.outputFields, cPascal),
        '}',
        '',
        `const ${cSnake}_${callSnake}_OUTPUT_FIELDS: BinaryField[] = ${fieldsLiteral(call.outputFields)}`,
        '',
        `export function decode${cPascal}${callPascal}Output(`,
        '  data: Uint8Array,',
        "  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),",
        `): ${cPascal}${callPascal}Output {`,
        `  return decodePayload(data, ${cSnake}_${callSnake}_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as ${cPascal}${callPascal}Output`,
        '}',
        '',
        // High-level async caller
        `export async function ${cObject}${callPascal}(`,
        '  live: SmartContractCaller,',
        ...(hasInput ? [`  input: ${cPascal}${callPascal}Input,`] : []),
        '  options?: ContractCallOptions,',
        `): Promise<Result<${cPascal}${callPascal}Output, QubicRpcError>> {`,
        '  return callContractFunction({',
        '    live,',
        `    contractIndex: ${cSnake}_CONTRACT_INDEX,`,
        `    inputType: ${cSnake}_${callSnake}_INPUT_TYPE,`,
        `    inputSize: ${cSnake}_${callSnake}_INPUT_SIZE,`,
        `    inputFields: ${hasInput ? `${cSnake}_${callSnake}_INPUT_FIELDS` : '[]'},`,
        `    outputFields: ${cSnake}_${callSnake}_OUTPUT_FIELDS,`,
        '    structs: STRUCTS,',
        `    input: ${hasInput ? '(input as unknown as Record<string, unknown>)' : '{}'},`,
        '    ...options,',
        '  })',
        '}',
        '',
      )
    }
  }

  // ── Contract namespace object ─────────────────────────────────────────────────
  // Bundles all entrypoints under a single ergonomic object.
  // Async function callers + sync procedure payload builders/decoders.
  const objEntries: string[] = [`  contractIndex: ${cSnake}_CONTRACT_INDEX,`]

  for (const call of version.functions) {
    if (call.outputFields.length === 0) continue
    objEntries.push(`  ${call.name}: ${cObject}${toPascalCase(call.name)},`)
  }

  for (const call of version.procedures) {
    const callPascal = toPascalCase(call.name)
    if (call.inputFields.length > 0)
      objEntries.push(`  build${callPascal}Input: build${cPascal}${callPascal}Input,`)
    if (call.outputFields.length > 0)
      objEntries.push(`  decode${callPascal}Output: decode${cPascal}${callPascal}Output,`)
  }

  lines.push(`export const ${cObject} = {`, ...objEntries, '}', '')

  const content = `${lines.join('\n')}\n`
  writeFileSync(join(outDir, `${contractFile}.ts`), content)
}

const indexContent = `${contractFiles.map((f) => `export * from './${f}.js'`).join('\n')}\n`
writeFileSync(join(outDir, 'index.ts'), indexContent)

console.log(`Generated ${contractFiles.length} contract files from epoch ${latestEpoch}.`)
