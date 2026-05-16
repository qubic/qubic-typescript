import Link from 'next/link'
import { SearchFilter } from '../components/search-filter'
import { api } from '../lib/api'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'qubic / registry — contract ABIs pinned per epoch',
  openGraph: {
    title: 'Qubic Registry',
    images: ['/api/og?title=Qubic+Registry&sub=Contract+ABIs+pinned+per+epoch'],
  },
  twitter: { title: 'Qubic Registry' },
}

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
            Every Qubic contract, <span className="accent">exactly as it shipped</span>.
          </h1>
          <p className="lead">
            Each ABI is captured from the source code when an epoch closes and locked in place. Link
            to a specific version in your SDK or docs — it'll be there, unchanged, for as long as
            you need it.
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
