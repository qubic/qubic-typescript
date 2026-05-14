'use client'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import type { ContractSummary } from '../lib/api'
import { Sigil } from './sigil'

type SortKey = 'idx' | 'name' | 'procs' | 'funcs'

function NumBar({
  value,
  max,
  kind,
}: { value: number; max: number; kind: 'proc' | 'func' | 'struct' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <span className="num-bar">
      <span className={`v${value === 0 ? ' zero' : ''}`}>{value}</span>
      <span className={`b ${kind}`}>
        <span className="f" style={{ width: `${pct}%` }} />
      </span>
    </span>
  )
}

export function SearchFilter({ contracts }: { contracts: ContractSummary[] }) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('idx')
  const router = useRouter()

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim()
    let arr = contracts
    if (s) {
      arr = arr.filter(
        (c) => c.contractName.toLowerCase().includes(s) || String(c.contractIndex) === s,
      )
    }
    return [...arr].sort((a, b) => {
      if (sort === 'name') return a.contractName.localeCompare(b.contractName)
      if (sort === 'procs') return b.procedureCount - a.procedureCount
      if (sort === 'funcs') return b.functionCount - a.functionCount
      return a.contractIndex - b.contractIndex
    })
  }, [q, sort, contracts])

  const maxProc = useMemo(() => Math.max(...contracts.map((c) => c.procedureCount), 1), [contracts])
  const maxFunc = useMemo(() => Math.max(...contracts.map((c) => c.functionCount), 1), [contracts])

  return (
    <>
      <div className="toolbar">
        <div className="search">
          <Search size={14} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by name or index…"
          />
          <span className="kbd">/</span>
        </div>
        <span className="toolbar-lbl">Sort</span>
        <div className="seg">
          {(
            [
              { k: 'idx', l: 'Index' },
              { k: 'name', l: 'Name' },
              { k: 'procs', l: 'Procs' },
              { k: 'funcs', l: 'Funcs' },
            ] as { k: SortKey; l: string }[]
          ).map((o) => (
            <button
              key={o.k}
              type="button"
              className={sort === o.k ? 'on' : ''}
              onClick={() => setSort(o.k)}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 44 }}>Idx</th>
              <th>Contract</th>
              <th style={{ width: 80 }}>Since</th>
              <th className="right" style={{ width: 90 }}>
                Proc
              </th>
              <th className="right" style={{ width: 90 }}>
                Func
              </th>
              <th className="right" style={{ width: 70 }}>
                Struct
              </th>
              <th className="right" style={{ width: 140 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.contractIndex}
                className="row-stagger"
                style={{ animationDelay: `${i * 18}ms` }}
                onClick={() => router.push(`/contract/${c.contractIndex}`)}
                onKeyDown={(e) => e.key === 'Enter' && router.push(`/contract/${c.contractIndex}`)}
              >
                <td>
                  <span className="idx-col">{String(c.contractIndex).padStart(2, '0')}</span>
                </td>
                <td>
                  <div className="row-name">
                    <Sigil name={c.contractName} size={28} />
                    <div>
                      <div className="name">{c.contractName}</div>
                      <div className="sub">
                        e{c.currentFromEpoch} · v{c.versionCount}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="since-col">e{c.currentFromEpoch}</span>
                </td>
                <td className="right">
                  <NumBar value={c.procedureCount} max={maxProc} kind="proc" />
                </td>
                <td className="right">
                  <NumBar value={c.functionCount} max={maxFunc} kind="func" />
                </td>
                <td className="right">
                  <span className={`num${c.structCount === 0 ? ' zero' : ''}`}>
                    {c.structCount}
                  </span>
                </td>
                <td className="right">
                  <div
                    className="row-actions"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <a className="btn sm ghost" href={`/contract/${c.contractIndex}`}>
                      Open →
                    </a>
                    <a
                      className="btn sm ghost"
                      href={`/download/epoch/${c.currentFromEpoch}/${c.contractName}.json`}
                      download
                    >
                      JSON
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div className="empty">
                    <span>
                      No contracts match <span className="mono">&ldquo;{q}&rdquo;</span>
                    </span>
                    <span className="mono">Try an index (1–27) or a name fragment</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
