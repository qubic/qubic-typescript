'use client'
import type {
  BinaryField,
  ContractAbiVersion,
  ContractCallBase,
  NamedStruct,
} from '@qubic.ts/registry'
import { useState } from 'react'
import { CopyButton } from './CopyButton'
import { FieldTable } from './FieldTable'

// ── Type helpers ─────────────────────────────────────────

function tsTypeFor(f: BinaryField): string {
  switch (f.type) {
    case 'uint64':
    case 'uint128':
    case 'sint64':
      return 'bigint'
    case 'id':
      return 'string'
    case 'bytes':
      return 'Uint8Array'
    case 'array': {
      const ref = f.arrayItemStructRef
      const base = f.arrayItemType
      let inner: string
      if (ref) {
        inner = ref
      } else if (base === 'uint64' || base === 'sint64' || base === 'uint128') {
        inner = 'bigint'
      } else if (base === 'id') {
        inner = 'string'
      } else {
        inner = 'number'
      }
      return f.arrayLength ? `${inner}[${f.arrayLength}]` : `${inner}[]`
    }
    case 'struct':
      return f.structRef ?? 'object'
    default:
      return 'number'
  }
}

function buildSnippet(call: ContractCallBase, contractIndex: number): string {
  const ins = call.inputFields ?? []
  const outs = call.outputFields ?? []
  const cap = call.name.charAt(0).toUpperCase() + call.name.slice(1)
  const lines: string[] = []

  lines.push(`// ${call.name}  ·  inputType: ${call.inputType}  ·  ${call.kind}`)
  if (call.description) lines.push(`// ${call.description}`)

  if (ins.length > 0) {
    lines.push(`\ninterface ${cap}Input {`)
    for (const f of ins) {
      lines.push(`  ${f.name}: ${tsTypeFor(f).padEnd(12)}// ${f.type} · ${f.byteLength}B`)
    }
    lines.push('}')
  }

  if (outs.length > 0) {
    lines.push(`\ninterface ${cap}Output {`)
    for (const f of outs) {
      lines.push(`  ${f.name}: ${tsTypeFor(f).padEnd(12)}// ${f.type} · ${f.byteLength}B`)
    }
    lines.push('}')
  }

  if (call.kind === 'function') {
    const body =
      ins.length > 0
        ? `{"contractIndex":${contractIndex},"inputType":${call.inputType},"requestData":"<base64 input>"}`
        : `{"contractIndex":${contractIndex},"inputType":${call.inputType}}`
    lines.push(
      '\n// query via RPC:',
      `curl -s 'https://rpc.qubic.org/v1/querySmartContract' \\`,
      `  -H 'Content-Type: application/json' \\`,
      `  -d '${body}'`,
    )
  } else {
    lines.push(
      '\n// invoke via @qubic.ts/rpc (requires signed transaction):',
      'rpc.sendTransaction({',
      `  destId: CONTRACT_IDS[${contractIndex}],`,
      `  inputType: ${call.inputType},`,
      ins.length > 0 ? `  input: encode${cap}Input({...})` : '  // no input fields',
      '})',
    )
    if (call.requiresAmount) {
      lines.push('\n// Note: requiresAmount — tx.amount is used as the invocation reward')
    }
  }

  return lines.join('\n')
}

// ── Method block ─────────────────────────────────────────

function MethodBlock({
  call,
  contractIndex,
}: {
  call: ContractCallBase
  contractIndex: number
}) {
  const [showCode, setShowCode] = useState(false)
  const ins = call.inputFields ?? []
  const outs = call.outputFields ?? []
  const hasIn = ins.length > 0
  const hasOut = outs.length > 0
  const bodyClass = !hasIn && !hasOut ? 'empty' : !hasIn || !hasOut ? 'solo' : ''

  return (
    <div className="method" id={`${call.kind}-${call.name}`}>
      <div className="method-head">
        <span className={`kind ${call.kind === 'procedure' ? 'proc' : 'func'}`}>
          {call.kind === 'procedure' ? 'proc' : 'func'}
        </span>
        <span className="name">{call.name}</span>
        <span className="iotype" title={`inputType: ${call.inputType}`}>
          #{call.inputType}
        </span>
        <div className="sizes">
          <span className="pill">
            in <b>{call.inputSize}</b>B
          </span>
          <span className="pill">
            out <b>{call.outputSize}</b>B
          </span>
          <button
            type="button"
            className={`code-toggle${showCode ? ' on' : ''}`}
            onClick={() => setShowCode((v) => !v)}
          >
            {showCode ? '× code' : '</> code'}
          </button>
          <CopyButton value={call.name} />
        </div>
      </div>

      {call.description && <div className="method-desc">{call.description}</div>}

      {!hasIn && !hasOut && <div className="method-empty">— no input or output fields —</div>}

      <div className={`method-body ${bodyClass}`}>
        {hasIn && (
          <div className="iohalf">
            <div className="iolabel">
              <span className="arrow in">→</span>
              <span>input</span>
              <span className="size">
                {ins.length} field{ins.length !== 1 ? 's' : ''} · {call.inputSize}B
              </span>
            </div>
            <FieldTable fields={ins} totalSize={call.inputSize} />
          </div>
        )}
        {hasOut && (
          <div className="iohalf">
            <div className="iolabel">
              <span className="arrow out">←</span>
              <span>output</span>
              <span className="size">
                {outs.length} field{outs.length !== 1 ? 's' : ''} · {call.outputSize}B
              </span>
            </div>
            <FieldTable fields={outs} totalSize={call.outputSize} />
          </div>
        )}
      </div>

      {showCode && (
        <div className="method-code">
          <pre>{buildSnippet(call, contractIndex)}</pre>
          <CopyButton value={buildSnippet(call, contractIndex)} />
        </div>
      )}
    </div>
  )
}

// ── Struct block ─────────────────────────────────────────

function StructBlock({ struct }: { struct: NamedStruct }) {
  const fields = struct.fields ?? []
  return (
    <div className="method" id={`struct-${struct.name}`}>
      <div className="method-head">
        <span className="kind struct">struct</span>
        <span className="name">{struct.name}</span>
        <div className="sizes">
          <span className="pill">
            <b>{struct.byteLength ?? 0}</b>B
          </span>
          <span className="pill">
            <b>{fields.length}</b> field{fields.length === 1 ? '' : 's'}
          </span>
          <CopyButton value={struct.name} />
        </div>
      </div>
      <div className="method-body solo">
        <div className="iohalf">
          <div className="iolabel">
            <span>fields</span>
          </div>
          <FieldTable fields={fields} totalSize={struct.byteLength} />
        </div>
      </div>
    </div>
  )
}

// ── AbiView ───────────────────────────────────────────────

type Tab = 'all' | 'procs' | 'funcs' | 'structs' | 'raw'

export function AbiView({
  version,
  compact = false,
}: {
  version: ContractAbiVersion
  compact?: boolean
}) {
  const [tab, setTab] = useState<Tab>('all')

  const procs = version.procedures ?? []
  const funcs = version.functions ?? []
  const structs = Object.values(version.structs ?? {})

  const showProcs = tab === 'all' || tab === 'procs'
  const showFuncs = tab === 'all' || tab === 'funcs'
  const showStructs = tab === 'all' || tab === 'structs'

  return (
    <div>
      {compact ? (
        <div className="abi-toc">
          <a href="#procedures">
            Procedures<span className="count">{procs.length}</span>
          </a>
          <a href="#functions">
            Functions<span className="count">{funcs.length}</span>
          </a>
          {structs.length > 0 && (
            <a href="#structs">
              Structs<span className="count">{structs.length}</span>
            </a>
          )}
          <a href="#raw-json">Raw JSON</a>
        </div>
      ) : (
        <div className="tabs">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'procs', label: 'Procedures', count: procs.length },
              { key: 'funcs', label: 'Functions', count: funcs.length },
              ...(structs.length > 0
                ? [{ key: 'structs', label: 'Structs', count: structs.length }]
                : []),
              { key: 'raw', label: 'Raw JSON' },
            ] as { key: Tab; label: string; count?: number }[]
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              className={tab === t.key ? 'on' : ''}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              {t.count !== undefined && <span className="count">{t.count}</span>}
            </button>
          ))}
        </div>
      )}

      {tab !== 'raw' && (
        <>
          {showProcs && procs.length > 0 && (
            <section id="procedures">
              <div className="section-title">
                <h2>Procedures</h2>
                <span className="count">{procs.length}</span>
                <span className="meta">State-changing</span>
              </div>
              {procs.map((p) => (
                <MethodBlock key={p.name} call={p} contractIndex={version.contractIndex} />
              ))}
            </section>
          )}

          {showFuncs && funcs.length > 0 && (
            <section id="functions">
              <div className="section-title">
                <h2>Functions</h2>
                <span className="count">{funcs.length}</span>
                <span className="meta">Read-only</span>
              </div>
              {funcs.map((f) => (
                <MethodBlock key={f.name} call={f} contractIndex={version.contractIndex} />
              ))}
            </section>
          )}

          {showStructs && structs.length > 0 && (
            <section id="structs">
              <div className="section-title">
                <h2>Structs</h2>
                <span className="count">{structs.length}</span>
                <span className="meta">Shared types</span>
              </div>
              {structs.map((s) => (
                <StructBlock key={s.name} struct={s} />
              ))}
            </section>
          )}
        </>
      )}

      {(tab === 'raw' || compact) && (
        <section id="raw-json" style={{ marginTop: compact ? 24 : 0 }}>
          {compact && (
            <div className="section-title">
              <h2>Raw JSON</h2>
              <span className="meta">/v1/contracts/{version.contractIndex}</span>
            </div>
          )}
          <JsonView data={version} label={`contracts/${version.contractIndex}.json`} />
        </section>
      )}
    </div>
  )
}

// ── JSON viewer ───────────────────────────────────────────

type Token = { text: string; cls: string | null }

function tokenizeJson(raw: string): Token[] {
  const tokens: Token[] = []
  const re =
    /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)|(\btrue\b|\bfalse\b)|\bnull\b|([{}[\],])/g
  let last = 0
  let m: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex exec loop
  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) tokens.push({ text: raw.slice(last, m.index), cls: null })
    if (m[1] !== undefined) {
      tokens.push({ text: m[1], cls: m[2] !== undefined ? 'tok-k' : 'tok-s' })
      if (m[2] !== undefined) tokens.push({ text: m[2], cls: null })
    } else if (m[3] !== undefined) {
      tokens.push({ text: m[3], cls: 'tok-n' })
    } else if (m[4] !== undefined) {
      tokens.push({ text: m[4], cls: 'tok-b' })
    } else if (m[0] === 'null') {
      tokens.push({ text: 'null', cls: 'tok-null' })
    } else if (m[5] !== undefined) {
      tokens.push({ text: m[5], cls: 'tok-p' })
    }
    last = m.index + m[0].length
  }
  if (last < raw.length) tokens.push({ text: raw.slice(last), cls: null })
  return tokens
}

function JsonView({ data, label }: { data: unknown; label: string }) {
  const text = JSON.stringify(data, null, 2)
  const tokens = tokenizeJson(text)
  return (
    <div className="code">
      <div className="code-bar">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="lbl">{label}</span>
        <span className="grow" />
        <CopyButton value={text} />
      </div>
      <pre style={{ maxHeight: 480, overflow: 'auto' }}>
        {tokens.map((t, i) =>
          t.cls ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: token order is stable
            <span key={i} className={t.cls}>
              {t.text}
            </span>
          ) : (
            t.text
          ),
        )}
      </pre>
    </div>
  )
}
