import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { BinaryField, ContractRegistry, FieldType } from '@qubic.ts/contract-registry'

const registryPath = join(import.meta.dir, '../../contract-registry/data/registry.json')
const registry = (await Bun.file(registryPath).json()) as ContractRegistry

const outDir = join(import.meta.dir, '../src/__generated__')
mkdirSync(outDir, { recursive: true })

function toPascalCase(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function toScreamingSnake(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toUpperCase()
}

function tsType(field: BinaryField): string {
  switch (field.type) {
    case 'uint8':
    case 'uint16':
    case 'uint32':
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
      return field.structRef ? `${toPascalCase(field.structRef)}Struct` : 'Record<string, unknown>'
    case 'array': {
      const itemType: FieldType = field.arrayItemType ?? 'uint8'
      const itemField: BinaryField = {
        name: field.name,
        type: itemType,
        offset: 0,
        byteLength: field.arrayItemByteLength ?? 0,
        structRef: field.arrayItemStructRef,
      }
      return `${tsType(itemField)}[]`
    }
  }
}

function fieldsLiteral(fields: BinaryField[]): string {
  const items = fields
    .map((f) => {
      const entries: string[] = [
        `    name: '${f.name}'`,
        `    type: '${f.type}'`,
        `    offset: ${f.offset}`,
        `    byteLength: ${f.byteLength}`,
      ]
      if (f.structRef !== undefined) entries.push(`    structRef: '${f.structRef}'`)
      if (f.arrayLength !== undefined) entries.push(`    arrayLength: ${f.arrayLength}`)
      if (f.arrayItemType !== undefined) entries.push(`    arrayItemType: '${f.arrayItemType}'`)
      if (f.arrayItemByteLength !== undefined)
        entries.push(`    arrayItemByteLength: ${f.arrayItemByteLength}`)
      if (f.arrayItemStructRef !== undefined)
        entries.push(`    arrayItemStructRef: '${f.arrayItemStructRef}'`)
      return `  {\n${entries.join(',\n')},\n  }`
    })
    .join(',\n')
  return `[\n${items},\n]`
}

function interfaceFields(fields: BinaryField[]): string {
  return fields.map((f) => `  ${f.name}: ${tsType(f)}`).join('\n')
}

const contractFiles: string[] = []

for (const version of registry.versions) {
  if (version.effectiveToEpoch !== null) continue

  const contractSnake = toScreamingSnake(version.contractName)
  const contractFile = version.contractName.toLowerCase()
  contractFiles.push(contractFile)

  const lines: string[] = [
    '// @generated — do not edit by hand. Run `bun run generate` to regenerate.',
    "import type { BinaryField, NamedStruct } from '@qubic.ts/contract-registry'",
    "import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'",
    '',
    `export const ${contractSnake}_CONTRACT_INDEX = ${version.contractIndex}`,
    '',
    'export const STRUCTS: Record<string, NamedStruct> = {}',
    '',
  ]

  const allCalls = [...version.procedures, ...version.functions]

  for (const call of allCalls) {
    const pascal = toPascalCase(call.name)
    const snake = toScreamingSnake(call.name)

    lines.push(
      `export const ${snake}_INPUT_TYPE = ${call.inputType}`,
      `export const ${snake}_INPUT_SIZE = ${call.inputSize}`,
      `export const ${snake}_OUTPUT_SIZE = ${call.outputSize}`,
      '',
    )

    if (call.inputFields.length > 0) {
      lines.push(
        `export interface ${pascal}Input {`,
        interfaceFields(call.inputFields),
        '}',
        '',
        `export const ${snake}_INPUT_FIELDS: BinaryField[] = ${fieldsLiteral(call.inputFields)}`,
        '',
        `export function build${pascal}Input(`,
        `  input: ${pascal}Input,`,
        '  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),',
        '): Uint8Array {',
        `  return buildPayload(${snake}_INPUT_FIELDS, STRUCTS, input, identityToPublicKey)`,
        '}',
        '',
      )
    }

    if (call.outputFields.length > 0) {
      lines.push(
        `export interface ${pascal}Output {`,
        interfaceFields(call.outputFields),
        '}',
        '',
        `export const ${snake}_OUTPUT_FIELDS: BinaryField[] = ${fieldsLiteral(call.outputFields)}`,
        '',
        `export function decode${pascal}Output(`,
        '  data: Uint8Array,',
        "  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),",
        `): ${pascal}Output {`,
        '  return decodePayload(',
        '    data,',
        `    ${snake}_OUTPUT_FIELDS,`,
        '    STRUCTS,',
        '    publicKeyToIdentity,',
        `  ) as ${pascal}Output`,
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
