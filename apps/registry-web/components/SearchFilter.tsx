'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { ContractSummary } from '../lib/api'

export function SearchFilter({ contracts }: { contracts: ContractSummary[] }) {
  const [q, setQ] = useState('')
  const filtered = q
    ? contracts.filter(c =>
        c.contractName.toLowerCase().includes(q.toLowerCase()) ||
        String(c.contractIndex).includes(q)
      )
    : contracts

  return (
    <>
      <input
        type="text"
        placeholder="Search by name or index…"
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 6, color: 'var(--text)', padding: '6px 12px',
          fontSize: 13, outline: 'none', width: 280, marginBottom: 16,
        }}
      />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Epoch</th>
              <th>Versions</th><th>Procedures</th><th>Functions</th><th />
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.contractIndex} className="clickable">
                <td>{c.contractIndex}</td>
                <td><Link href={`/contract/${c.contractIndex}`}>{c.contractName}</Link></td>
                <td>{c.currentFromEpoch}+</td>
                <td>{c.versionCount}</td>
                <td>{c.procedureCount}</td>
                <td>{c.functionCount}</td>
                <td>
                  <a
                    className="btn"
                    href={`/download/epoch/${c.currentFromEpoch}/${c.contractName}.json`}
                    download
                  >↓ JSON</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
