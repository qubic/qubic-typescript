import type { ContractAbiVersion, ContractCallBase } from '@qubic.ts/registry'
import { FieldTable } from './FieldTable'
import { CopyButton } from './CopyButton'

function CallBlock({ call }: { call: ContractCallBase }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600 }}>{call.name}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>inputType</span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 12,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 4, padding: '1px 6px',
        }}>{call.inputType}</span>
        <CopyButton value={String(call.inputType)} />
      </div>
      {call.inputFields.length > 0 && (
        <>
          <h3>Input fields</h3>
          <FieldTable fields={call.inputFields} />
        </>
      )}
      {call.outputFields.length > 0 && (
        <>
          <h3>Output fields</h3>
          <FieldTable fields={call.outputFields} />
        </>
      )}
      {call.inputFields.length === 0 && call.outputFields.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No input or output fields</p>
      )}
    </div>
  )
}

function Section({ title, calls }: { title: string; calls: ContractCallBase[] }) {
  if (calls.length === 0) return null
  return (
    <div className="section" style={{ marginBottom: 20 }}>
      <div className="section-header">
        <h2>{title}</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{calls.length}</span>
      </div>
      <div style={{ padding: 16 }}>
        {calls.map((call, i) => (
          <div key={call.name}>
            <CallBlock call={call} />
            {i < calls.length - 1 && <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export function AbiView({ version }: { version: ContractAbiVersion }) {
  const structs = Object.values(version.structs ?? {})
  return (
    <>
      <Section title="Procedures" calls={version.procedures} />
      <Section title="Functions" calls={version.functions} />
      {structs.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2>Structs</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{structs.length}</span>
          </div>
          <div style={{ padding: 16 }}>
            {structs.map(s => (
              <div key={s.name} style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{s.name}</div>
                <FieldTable fields={s.fields} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
