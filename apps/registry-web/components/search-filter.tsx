'use client'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ContractSummary } from '../lib/api'
import { Sigil } from './sigil'

type SortKey = 'idx' | 'name' | 'procs' | 'funcs' | 'structs'
type SortDir = 'asc' | 'desc'

function SortArrow({ dir }: { dir: SortDir }) {
  return <span className="sort-arrow">{dir === 'asc' ? '↑' : '↓'}</span>
}

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
  const [dir, setDir] = useState<SortDir>('asc')
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

  function toggleSort(key: SortKey) {
    if (sort === key) {
      setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(key)
      setDir(key === 'name' || key === 'idx' ? 'asc' : 'desc')
    }
  }

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim()
    let arr = contracts
    if (s) {
      arr = arr.filter(
        (c) => c.contractName.toLowerCase().includes(s) || String(c.contractIndex) === s,
      )
    }
    return [...arr].sort((a, b) => {
      let cmp = 0
      if (sort === 'name') cmp = a.contractName.localeCompare(b.contractName)
      else if (sort === 'procs') cmp = a.procedureCount - b.procedureCount
      else if (sort === 'funcs') cmp = a.functionCount - b.functionCount
      else if (sort === 'structs') cmp = a.structCount - b.structCount
      else cmp = a.contractIndex - b.contractIndex
      return dir === 'desc' ? -cmp : cmp
    })
  }, [q, sort, dir, contracts])

  const maxProc = useMemo(() => Math.max(...contracts.map((c) => c.procedureCount), 1), [contracts])
  const maxFunc = useMemo(() => Math.max(...contracts.map((c) => c.functionCount), 1), [contracts])
  const maxStruct = useMemo(() => Math.max(...contracts.map((c) => c.structCount), 1), [contracts])

  function nav(idx: number) {
    router.push(`/contract/${idx}`)
  }

  function SortTh({
    col,
    label,
    className,
    style,
  }: { col: SortKey; label: string; className?: string; style?: React.CSSProperties }) {
    return (
      <th
        className={`sortable${className ? ` ${className}` : ''}${sort === col ? ' sort-active' : ''}`}
        style={style}
        onClick={() => toggleSort(col)}
        onKeyDown={(e) => e.key === 'Enter' && toggleSort(col)}
      >
        {label}
        {sort === col && <SortArrow dir={dir} />}
      </th>
    )
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
              <SortTh col="idx" label="#" className="col-idx" style={{ width: 44 }} />
              <SortTh col="name" label="Contract" className="col-name" />
              <SortTh col="procs" label="Procs" className="col-procs right" style={{ width: 90 }} />
              <SortTh col="funcs" label="Funcs" className="col-funcs right" style={{ width: 90 }} />
              <SortTh
                col="structs"
                label="Structs"
                className="col-structs right"
                style={{ width: 70 }}
              />
              <th className="col-actions right" style={{ width: 130 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.contractIndex}
                className="row-stagger clickable"
                style={{ animationDelay: `${i * 18}ms` }}
                tabIndex={0}
                aria-label={`Open ${c.contractName}`}
                onClick={() => nav(c.contractIndex)}
                onKeyDown={(e) => e.key === 'Enter' && nav(c.contractIndex)}
              >
                <td className="col-idx">
                  <span className="idx-col">{String(c.contractIndex).padStart(2, '0')}</span>
                </td>
                <td className="col-name">
                  <div className="row-name">
                    <Sigil name={c.contractName} size={28} />
                    <div>
                      <div className="name">{c.contractName}</div>
                      <div className="sub">
                        since e{c.currentFromEpoch} · {c.versionCount} ABI version
                        {c.versionCount !== 1 ? 's' : ''}
                      </div>
                      <div className="sub sub-mobile">
                        {c.procedureCount}P · {c.functionCount}F · {c.structCount}S
                      </div>
                    </div>
                  </div>
                </td>
                <td className="col-procs right">
                  <NumBar value={c.procedureCount} max={maxProc} kind="proc" />
                </td>
                <td className="col-funcs right">
                  <NumBar value={c.functionCount} max={maxFunc} kind="func" />
                </td>
                <td className="col-structs right">
                  <NumBar value={c.structCount} max={maxStruct} kind="struct" />
                </td>
                <td className="col-actions right">
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
