'use client'
import type { BinaryField } from '@qubic.ts/registry'
import { useState } from 'react'

const INT_TYPES = new Set([
  'uint8',
  'uint16',
  'uint32',
  'uint64',
  'sint8',
  'sint16',
  'sint32',
  'sint64',
  'uint128',
])

function TypeBadge({ type }: { type: string }) {
  let cls = 'badge-bytes'
  if (INT_TYPES.has(type)) cls = 'badge-int'
  else if (type === 'id') cls = 'badge-id'
  else if (type === 'array') cls = 'badge-arr'
  else if (type === 'struct') cls = 'badge-struct'

  return <span className={`badge ${cls}`}>{type}</span>
}

type SortKey = 'offset' | 'name'

export function FieldTable({ fields }: { fields: BinaryField[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('offset')
  const [asc, setAsc] = useState(true)

  if (fields.length === 0)
    return <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No fields</p>

  const sorted = [...fields].sort((a, b) => {
    const cmp =
      sortKey === 'offset' ? a.offset - b.offset : a.name.localeCompare(b.name)
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
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th
              onClick={() => toggle('name')}
              onKeyDown={(e) => e.key === 'Enter' && toggle('name')}
              style={{ cursor: 'pointer', color: sortKey === 'name' ? 'var(--link)' : undefined }}
            >
              Name{arrow('name')}
            </th>
            <th>Type</th>
            <th
              onClick={() => toggle('offset')}
              onKeyDown={(e) => e.key === 'Enter' && toggle('offset')}
              style={{ cursor: 'pointer', color: sortKey === 'offset' ? 'var(--link)' : undefined }}
            >
              Offset{arrow('offset')}
            </th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((f) => (
            <tr key={f.name}>
              <td>{f.name}</td>
              <td>
                <TypeBadge type={f.type} />
                {f.arrayItemType && (
                  <span style={{ marginLeft: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                    [<TypeBadge type={f.arrayItemType} />×{f.arrayLength}]
                  </span>
                )}
              </td>
              <td>{f.offset}</td>
              <td>{f.byteLength}B</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
