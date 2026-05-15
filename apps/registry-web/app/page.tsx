import Link from 'next/link'
import { SearchFilter } from '../components/search-filter'
import { api } from '../lib/api'

export default async function Home() {
  const [contracts, epochs] = await Promise.all([api.contracts(), api.epochs().catch(() => [])])

  const totalProcs = contracts.reduce((s, c) => s + c.procedureCount, 0)
  const totalFuncs = contracts.reduce((s, c) => s + c.functionCount, 0)
  const totalStructs = contracts.reduce((s, c) => s + c.structCount, 0)
  const currentEpoch = epochs.length > 0 ? Math.max(...epochs.map((e) => e.epoch)) : '—'

  const stats = [
    { lbl: 'Contracts', num: contracts.length },
    { lbl: 'Epochs tracked', num: epochs.length },
    { lbl: 'Current epoch', num: `#${currentEpoch}` },
    { lbl: 'Procedures', num: totalProcs },
    { lbl: 'Functions', num: totalFuncs },
    { lbl: 'Structs', num: totalStructs },
  ]

  return (
    <main className="container">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="home-hero">
        <div className="hero-grid" />
        <div className="hero-spotlight" />

        <div className="home-hero-content">
          <div className="eyebrow">
            <span className="dot pulse" />
            Live · Epoch {currentEpoch}
          </div>
          <h1>
            The canonical <span className="accent">ABI registry</span> for every Qubic smart
            contract — pinned per epoch.
          </h1>
          <p className="lead">
            One immutable JSON snapshot per contract per epoch. Stable URLs, content-addressed,
            edge-cached. Generated directly from{' '}
            <span className="mono" style={{ color: 'var(--text)' }}>
              core
            </span>{' '}
            headers — never hand-edited, never drifts.
          </p>
          <div className="hero-actions">
            <Link href="/api-docs" className="btn primary">
              API Reference →
            </Link>
            <a href="#contracts" className="btn ghost">
              Browse contracts ↓
            </a>
            <Link href="/epochs" className="btn ghost">
              Epoch history
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────── */}
      <section className="statstrip">
        {stats.map((s, i) => (
          <div key={s.lbl} className="stat fade-stagger" style={{ animationDelay: `${i * 40}ms` }}>
            <span className="stat-num">{s.num}</span>
            <span className="stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </section>

      {/* ── Contracts index ───────────────────────────── */}
      <section id="contracts">
        <div className="section-title">
          <h2>Contracts</h2>
          <span className="count">{contracts.length}</span>
          <span className="meta">/v1/contracts</span>
        </div>
        <SearchFilter contracts={contracts} />
      </section>
    </main>
  )
}
