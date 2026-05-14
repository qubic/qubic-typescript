'use client'
import type { BinaryField } from '@qubic.ts/registry'
import { useState } from 'react'
import { TypeChip } from './type-chip'

type SortKey = 'offset' | 'name'

export function FieldTable({
  fields,
  totalSize,
}: {
  fields: BinaryField[]
  totalSize?: number
}) {
  const [sortKey, setSortKey] = useState<SortKey>('offset')
  const [asc, setAsc] = useState(true)

  if (fields.length === 0) {
    return <div className="method-empty">— no fields —</div>
  }

  const total = totalSize ?? fields.reduce((s, f) => s + (f.byteLength ?? 0), 0)

  const sorted = [...fields].sort((a, b) => {
    const cmp = sortKey === 'offset' ? a.offset - b.offset : a.name.localeCompare(b.name)
    return asc ? cmp : -cmp
  })

  function toggle(key: SortKey) {
    if (sortKey === key) setAsc((v) => !v)
    else {
      setSortKey(key)
      setAsc(true)
    }
  }

  const arrow = (key: SortKey) => (sortKey === key ? (asc ? ' ↑' : ' ↓') : '')

  return (
    <table className="ft">
      <thead>
        <tr>
          <th
            style={{
              width: '38%',
              cursor: 'pointer',
              color: sortKey === 'name' ? 'var(--accent)' : undefined,
            }}
            onClick={() => toggle('name')}
            onKeyDown={(e) => e.key === 'Enter' && toggle('name')}
          >
            name{arrow('name')}
          </th>
          <th style={{ width: '24%' }}>type</th>
          <th
            className="right"
            style={{
              width: '12%',
              cursor: 'pointer',
              color: sortKey === 'offset' ? 'var(--accent)' : undefined,
            }}
            onClick={() => toggle('offset')}
            onKeyDown={(e) => e.key === 'Enter' && toggle('offset')}
          >
            offset{arrow('offset')}
          </th>
          <th className="right" style={{ width: '12%' }}>
            bytes
          </th>
          <th className="offbar-cell" style={{ width: '14%' }}>
            layout
          </th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((f) => {
          const off = f.offset ?? 0
          const len = f.byteLength ?? 0
          const pctOff = total > 0 ? (off / total) * 100 : 0
          const pctLen = total > 0 ? (len / total) * 100 : 0
          return (
            <tr key={f.name}>
              <td className="fname">{f.name}</td>
              <td>
                <TypeChip type={f.type} />
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
