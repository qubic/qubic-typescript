import { contractIndexToIdentity } from '@qubic.org/crypto'
import { Archive, ArrowUpRight, Download } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AbiView } from '../../../components/abi-view'
import { CopyButton } from '../../../components/copy-button'
import { Crumbs } from '../../../components/crumbs'
import { Sigil } from '../../../components/sigil'
import { BACKEND_URL, api } from '../../../lib/api'

export async function generateStaticParams() {
  const contracts = await api.contracts().catch(() => [])
  return contracts.map((c) => ({ index: String(c.contractIndex) }))
}

export async function generateMetadata({ params }: { params: Promise<{ index: string }> }) {
  const { index } = await params
  const contract = await api.contract(Number(index)).catch(() => null)
  const title = contract?.contractName ?? `Contract #${index}`
  return {
    title,
    openGraph: { title },
    twitter: { title },
  }
}

export default async function ContractPage({ params }: { params: Promise<{ index: string }> }) {
  const { index } = await params
  const idx = Number(index)

  const address = contractIndexToIdentity(idx)
  const [current, history] = await Promise.all([
    api.contract(idx).catch(() => null),
    api.contractHistory(idx).catch(() => []),
  ])

  if (!current) notFound()

  const structs = Object.values(current.structs ?? {})

  return (
    <main className="container">
      <Crumbs items={[{ label: 'Contracts', href: '/' }, { label: current.contractName }]} />

      {/* ── Contract header ─────────────────────────── */}
      <header className="contract-head">
        <Sigil name={current.contractName} size={56} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1>{current.contractName}</h1>
          <div className="sub">
            <span>
              Idx <b style={{ color: 'var(--text)' }}>{String(idx).padStart(2, '0')}</b>
            </span>
            <span className="pipe">·</span>
            <span>Since e{current.effectiveFromEpoch}</span>
            <span className="pipe">·</span>
            <span>
              {history.length} ABI version{history.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="contract-address">
            <div className="addr-card">
              <span>{address}</span>
              <CopyButton value={address} />
            </div>
          </div>
        </div>
        <div className="actions">
          <a
            className="btn sm"
            href={`${BACKEND_URL}/download/epoch/${current.effectiveFromEpoch}/${current.contractName}.json`}
            download
            title="Download JSON"
          >
            <Download size={13} />
            JSON
          </a>
          <a
            className="btn sm"
            href={`${BACKEND_URL}/download/contract/${idx}/all.zip`}
            download
            title="Download all epochs as zip"
          >
            <Archive size={13} />
            All epochs
          </a>
          <Link
            className="btn sm primary"
            href={`/contract/${idx}/epoch/${current.effectiveFromEpoch}`}
          >
            Open Snapshot
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </header>

      {/* ── Stats ────────────────────────────────────── */}
      <section className="contract-meta">
        {[
          { num: current.procedures.length, lbl: 'Procedures' },
          { num: current.functions.length, lbl: 'Functions' },
          { num: structs.length, lbl: 'Structs' },
          { num: history.length, lbl: `ABI Version${history.length === 1 ? '' : 's'}` },
        ].map((s) => (
          <div key={s.lbl} className="stat">
            <span className="stat-num">{s.num}</span>
            <span className="stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </section>

      {/* ── ABI ──────────────────────────────────────── */}
      <div className="section-title">
        <h2>Current ABI</h2>
        <span className="count">e{current.effectiveFromEpoch}</span>
        <span className="grow" />
        <Link className="btn sm" href={`/contract/${idx}/epoch/${current.effectiveFromEpoch}`}>
          Open Snapshot
          <ArrowUpRight size={13} />
        </Link>
      </div>
      <AbiView version={current} compact />
    </main>
  )
}
