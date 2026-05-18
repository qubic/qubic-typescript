import Link from 'next/link'
import { HeroHeadline } from '../components/hero-headline'
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
  const [contracts, epochs] = await Promise.all([
    api.contracts().catch(() => []),
    api.epochs().catch(() => []),
  ])

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
          <HeroHeadline />
          <p className="lead">
            Every contract ABI is captured when an epoch closes. Browse them, link to a specific
            version, or pull them via API — they&apos;re not going anywhere.
          </p>
          <div className="hero-actions">
            <a href="#contracts" className="btn primary lg">
              Browse contracts ↓
            </a>
            <Link href="/api-docs" className="btn ghost lg">
              API Reference →
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
