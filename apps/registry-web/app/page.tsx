import Link from 'next/link'
import { SearchFilter } from '../components/SearchFilter'
import { api } from '../lib/api'

export default async function Home() {
  const [contracts, epochs] = await Promise.all([api.contracts(), api.epochs().catch(() => [])])

  const totalProcs = contracts.reduce((s, c) => s + c.procedureCount, 0)
  const totalFuncs = contracts.reduce((s, c) => s + c.functionCount, 0)
  const totalStructs = contracts.reduce((s, c) => s + c.structCount, 0)
  const currentEpoch = epochs.length > 0 ? Math.max(...epochs.map((e) => e.epoch)) : '—'

  const stats = [
    { lbl: 'Contracts', num: contracts.length },
    { lbl: 'Epochs', num: epochs.length },
    { lbl: 'Current', num: `#${currentEpoch}` },
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

        <div className="home-hero-left">
          <div className="eyebrow">
            <span className="dot pulse" />
            Live · Epoch {currentEpoch}
          </div>
          <h1>
            The canonical <span className="accent">ABI registry</span> for every Qubic smart
            contract — pinned per epoch.
          </h1>
          <p className="lead">
            One JSON snapshot per contract per epoch. Stable URLs, content-addressed, edge-cached.
            Generated from upstream{' '}
            <span className="mono" style={{ color: 'var(--text)' }}>
              core
            </span>{' '}
            headers — never hand-edited, never drifts.
          </p>
          <div className="hero-actions">
            <EndpointPill url="https://registry.qubic.org/v1/registry.json" />
            <Link href="/api-docs" className="btn primary">
              API Reference →
            </Link>
            <a href="#contracts" className="btn ghost">
              Browse contracts ↓
            </a>
          </div>
        </div>

        <div className="home-hero-right">
          <TerminalCard />
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

function EndpointPill({ url }: { url: string }) {
  return (
    <div className="endpoint-pill">
      <span className="mchip GET">GET</span>
      <span className="url">{url}</span>
    </div>
  )
}

function TerminalCard() {
  const sample = JSON.stringify(
    {
      contractIndex: 9,
      contractName: 'Qearn',
      effectiveFromEpoch: 212,
      procedures: ['lock', 'unlock'],
      functions: ['getLockInfoPerEpoch', '…'],
    },
    null,
    2,
  )

  return (
    <div className="code term-card">
      <div className="code-bar">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="lbl">~/qubic — curl</span>
        <span className="grow" />
        <span className="kbd">⌘K</span>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '14px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          lineHeight: 1.65,
        }}
      >
        <span className="tok-c"># Pull the live registry</span>
        {'\n'}
        <span className="tok-b">$</span>
        {' curl -s registry.qubic.org/v1/contracts/9\n'}
        {sample}
        {'\n\n'}
        <span className="tok-c"># Pin to a past epoch for reproducible builds</span>
        {'\n'}
        <span className="tok-b">$</span>
        {' curl registry.qubic.org/v1/contracts/9/epoch/170'}
      </pre>
    </div>
  )
}
