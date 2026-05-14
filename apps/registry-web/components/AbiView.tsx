'use client'
import { useState } from 'react'
import type { ContractAbiVersion, ContractCallBase, StructDef } from '@qubic.ts/registry'
import { CopyButton } from './CopyButton'
import { FieldTable } from './FieldTable'

function MethodBlock({ call, kind }: { call: ContractCallBase; kind: 'procedure' | 'function' }) {
  const ins = call.inputFields ?? []
  const outs = call.outputFields ?? []
  const hasIn = ins.length > 0
  const hasOut = outs.length > 0
  const bodyClass = !hasIn && !hasOut ? 'empty' : !hasIn || !hasOut ? 'solo' : ''

  return (
    <div className="method" id={`${kind}-${call.name}`}>
      <div className="method-head">
        <span className={`kind ${kind === 'procedure' ? 'proc' : 'func'}`}>
          {kind === 'procedure' ? 'proc' : 'func'}
        </span>
        <span className="name">{call.name}</span>
        <span className="iotype">inputType {call.inputType}</span>
        <div className="sizes">
          <span className="pill">
            in <b>{call.inputSize}</b>B
          </span>
          <span className="pill">
            out <b>{call.outputSize}</b>B
          </span>
          <CopyButton value={call.name} />
        </div>
      </div>

      {!hasIn && !hasOut && (
        <div className="method-empty">— no input or output fields —</div>
      )}

      <div className={`method-body ${bodyClass}`}>
        {hasIn && (
          <div className="iohalf">
            <div className="iolabel">
              <span className="arrow in">→</span>
              <span>input</span>
              <span className="size">
                {ins.length} · {call.inputSize}B
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
                {outs.length} · {call.outputSize}B
              </span>
            </div>
            <FieldTable fields={outs} totalSize={call.outputSize} />
          </div>
        )}
      </div>
    </div>
  )
}

function StructBlock({ struct }: { struct: StructDef }) {
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
                <MethodBlock key={p.name} call={p} kind="procedure" />
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
                <MethodBlock key={f.name} call={f} kind="function" />
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

function JsonView({ data, label }: { data: unknown; label: string }) {
  const text = JSON.stringify(data, null, 2)
  const html = highlightJson(text)
  return (
    <div className="code">
      <div className="code-bar">
        <span className="dots">
          <i /><i /><i />
        </span>
        <span className="lbl">{label}</span>
        <span className="grow" />
        <CopyButton value={text} />
      </div>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: syntax highlighting output */}
      <pre style={{ maxHeight: 480, overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function highlightJson(text: string): string {
  let s = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  s = s.replace(/("(?:[^"\\]|\\.)*")(\s*:)?/g, (_m, str, colon) =>
    colon
      ? `<span class="tok-k">${str}</span>${colon}`
      : `<span class="tok-s">${str}</span>`,
  )
  s = s.replace(/(^|[,\s:\[])(-?\d+(?:\.\d+)?(?:e[-+]?\d+)?)/gi, (_m, pre, num) =>
    `${pre}<span class="tok-n">${num}</span>`,
  )
  s = s.replace(/\b(true|false)\b/g, '<span class="tok-b">$1</span>')
  s = s.replace(/\bnull\b/g, '<span class="tok-null">null</span>')
  s = s.replace(/([{}[\]])/g, '<span class="tok-p">$1</span>')
  return s
}
