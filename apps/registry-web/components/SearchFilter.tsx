'use client'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ContractSummary } from '../lib/api'
import { Sigil } from './sigil'

type SortKey = 'idx' | 'name' | 'procs' | 'funcs' | 'structs'

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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

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
      if (sort === 'structs') return b.structCount - a.structCount
      return a.contractIndex - b.contractIndex
    })
  }, [q, sort, contracts])

  const maxProc = useMemo(() => Math.max(...contracts.map((c) => c.procedureCount), 1), [contracts])
  const maxFunc = useMemo(() => Math.max(...contracts.map((c) => c.functionCount), 1), [contracts])
  const maxStruct = useMemo(() => Math.max(...contracts.map((c) => c.structCount), 1), [contracts])

  function nav(idx: number) {
    router.push(`/contract/${idx}`)
  }

  return (
    <>
      <div className="toolbar">
        <div className="search">
          <Search size={14} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by name or index…"
          />
          <span className="kbd" title="Press / to focus">
            /
          </span>
        </div>
        <span className="toolbar-lbl">Sort</span>
        <div className="seg">
          {(
            [
              { k: 'idx', l: 'Index' },
              { k: 'name', l: 'Name' },
              { k: 'procs', l: 'Procs' },
              { k: 'funcs', l: 'Funcs' },
              { k: 'structs', l: 'Structs' },
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
        {q && (
          <span className="toolbar-lbl">
            {filtered.length}/{contracts.length}
          </span>
        )}
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 44 }}>#</th>
              <th>Contract</th>
              <th className="right" style={{ width: 90 }}>
                Procs
              </th>
              <th className="right" style={{ width: 90 }}>
                Funcs
              </th>
              <th className="right" style={{ width: 70 }}>
                Structs
              </th>
              <th className="right" style={{ width: 130 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.contractIndex}
                className="row-stagger clickable"
                style={{ animationDelay: `${i * 18}ms` }}
                tabIndex={0}
                onClick={() => nav(c.contractIndex)}
                onKeyDown={(e) => e.key === 'Enter' && nav(c.contractIndex)}
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
                        since e{c.currentFromEpoch} · {c.versionCount} ABI version
                        {c.versionCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="right">
                  <NumBar value={c.procedureCount} max={maxProc} kind="proc" />
                </td>
                <td className="right">
                  <NumBar value={c.functionCount} max={maxFunc} kind="func" />
                </td>
                <td className="right">
                  <NumBar value={c.structCount} max={maxStruct} kind="struct" />
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
                <td colSpan={6}>
                  <div className="empty">
                    <span>
                      No contracts match <span className="mono">&ldquo;{q}&rdquo;</span>
                    </span>
                    <span className="mono" style={{ fontSize: 11 }}>
                      Try an index (1–{contracts.length}) or a partial name
                    </span>
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
