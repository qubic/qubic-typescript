import type { BinaryField } from '@qubic.org/registry'
import { TypeChip } from './type-chip'

function fieldTypeDisplay(f: BinaryField): string {
  if (f.type === 'array') {
    const item = f.arrayItemStructRef ?? f.arrayItemType ?? 'unknown'
    return f.arrayLength ? `${item}[${f.arrayLength}]` : `${item}[]`
  }
  if (f.type === 'struct') return f.structRef ?? 'struct'
  return f.type
}

export function FieldTable({
  fields,
  totalSize,
}: {
  fields: BinaryField[]
  totalSize?: number
}) {
  if (fields.length === 0) {
    return <div className="method-empty">— no fields —</div>
  }

  const total = totalSize ?? fields.reduce((s, f) => s + (f.byteLength ?? 0), 0)

  return (
    <table className="ft">
      <thead>
        <tr>
          <th style={{ width: '36%' }}>name</th>
          <th style={{ width: '26%' }}>type</th>
          <th className="right" style={{ width: '11%' }}>
            offset
          </th>
          <th className="right" style={{ width: '11%' }}>
            bytes
          </th>
          <th className="offbar-cell" style={{ width: '16%' }}>
            layout
          </th>
        </tr>
      </thead>
      <tbody>
        {fields.map((f) => {
          const off = f.offset ?? 0
          const len = f.byteLength ?? 0
          const pctOff = total > 0 ? (off / total) * 100 : 0
          const pctLen = total > 0 ? (len / total) * 100 : 0
          return (
            <tr key={f.name}>
              <td className="fname">
                {f.name}
                {f.description && <div className="fdesc">{f.description}</div>}
              </td>
              <td>
                <TypeChip type={fieldTypeDisplay(f)} />
              </td>
              <td className="right fmuted">{off}</td>
              <td className="right">{len}</td>
              <td className="offbar-cell">
                <span className="offbar">
                  <span className="fill" style={{ left: `${pctOff}%`, width: `${pctLen}%` }} />
                </span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
