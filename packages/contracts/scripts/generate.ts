import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type {
  BinaryField,
  ContractRegistry,
  FieldType,
  NamedStruct,
} from '@qubic.ts/contract-registry'

const registryPath = join(import.meta.dir, '../../contract-registry/data/registry.json')
const registry = (await Bun.file(registryPath).json()) as ContractRegistry

const outDir = join(import.meta.dir, '../src/__generated__')
mkdirSync(outDir, { recursive: true })

// "My Last Match" → "mylastmatch"  |  "QEarn" → "qearn"
function toFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
}

// "My Last Match" → "MyLastMatch"  |  "Multi-Sign Vault" → "MultiSignVault"  |  "QEarn" → "QEarn"
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
        ? `${contractPascal}${toPascalCase(field.structRef)}Struct`
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

const contractFiles: string[] = []

for (const version of registry.versions) {
  if (version.effectiveToEpoch !== null) continue

  const cSnake = toScreamingSnake(version.contractName)
  const cPascal = toContractPascal(version.contractName)
  const contractFile = toFileName(version.contractName)
  contractFiles.push(contractFile)

  const structNames = Object.keys(version.structs)
  const hasStructs = structNames.length > 0

  const lines: string[] = [
    '// @generated — do not edit by hand. Run `bun run generate` to regenerate.',
    "import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'",
    "import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'",
    '',
    `export const ${cSnake}_CONTRACT_INDEX = ${version.contractIndex}`,
    '',
  ]

  // Struct interfaces + internal STRUCTS map (not exported — only used by build/decode calls)
  if (hasStructs) {
    for (const [name, s] of Object.entries(version.structs)) {
      if (s.fields.length > 0) {
        lines.push(
          `export interface ${cPascal}${toPascalCase(name)}Struct {`,
          interfaceFields(s.fields, cPascal),
          '}',
          '',
        )
      }
    }
    const structEntries = structNames
      .map((name) => `  ${name}: ${structLiteral(version.structs[name] as NamedStruct)}`)
      .join(',\n')
    lines.push(`const STRUCTS: Record<string, NamedStruct> = {\n${structEntries},\n}`, '')
  } else {
    lines.push('const STRUCTS: Record<string, NamedStruct> = {}', '')
  }

  const allCalls = [...version.procedures, ...version.functions]

  for (const call of allCalls) {
    // Prefix procedure/function name with contract name to prevent barrel collisions
    const callPascal = toPascalCase(call.name)
    const callSnake = toScreamingSnake(call.name)

    lines.push(
      `export const ${cSnake}_${callSnake}_INPUT_TYPE = ${call.inputType}`,
      `export const ${cSnake}_${callSnake}_INPUT_SIZE = ${call.inputSize}`,
      `export const ${cSnake}_${callSnake}_OUTPUT_SIZE = ${call.outputSize}`,
      '',
    )

    if (call.inputFields.length > 0) {
      lines.push(
        `export interface ${cPascal}${callPascal}Input {`,
        interfaceFields(call.inputFields, cPascal),
        '}',
        '',
        `export const ${cSnake}_${callSnake}_INPUT_FIELDS: BinaryField[] = ${fieldsLiteral(call.inputFields)}`,
        '',
        `export function build${cPascal}${callPascal}Input(`,
        `  input: ${cPascal}${callPascal}Input,`,
        '  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),',
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
        `export const ${cSnake}_${callSnake}_OUTPUT_FIELDS: BinaryField[] = ${fieldsLiteral(call.outputFields)}`,
        '',
        `export function decode${cPascal}${callPascal}Output(`,
        '  data: Uint8Array,',
        "  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),",
        `): ${cPascal}${callPascal}Output {`,
        '  return decodePayload(',
        '    data,',
        `    ${cSnake}_${callSnake}_OUTPUT_FIELDS,`,
        '    STRUCTS,',
        '    publicKeyToIdentity,',
        `  ) as unknown as ${cPascal}${callPascal}Output`,
        '}',
        '',
      )
    }
  }

  const content = `${lines.join('\n')}\n`
  writeFileSync(join(outDir, `${contractFile}.ts`), content)
}

const indexContent = `${contractFiles.map((f) => `export * from './${f}.js'`).join('\n')}\n`
writeFileSync(join(outDir, 'index.ts'), indexContent)
