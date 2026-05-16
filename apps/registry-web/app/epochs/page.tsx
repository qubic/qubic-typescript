import Link from 'next/link'
import { api } from '../../lib/api'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Epoch History',
  openGraph: {
    title: 'Epoch History',
    images: ['/api/og?title=Epoch+History&sub=Immutable+ABI+snapshots+per+epoch'],
  },
  twitter: { title: 'Epoch History' },
}

export default async function EpochsPage() {
  const epochs = await api.epochs()
  const sorted = [...epochs].reverse()
  const maxEpoch = epochs.length > 0 ? Math.max(...epochs.map((e) => e.epoch)) : null
  const minEpoch = epochs.length > 0 ? Math.min(...epochs.map((e) => e.epoch)) : null
  const totalContracts = maxEpoch
    ? (epochs.find((e) => e.epoch === maxEpoch)?.contractCount ?? 0)
    : 0

  return (
    <main className="container">
      <div className="page-head">
        <div className="eyebrow">/v1/epochs</div>
        <h1 className="page-title">Epoch History</h1>
        <p className="page-sub">
          {epochs.length} snapshots · epoch {minEpoch}–{maxEpoch} · {totalContracts} contracts today
        </p>
        <p className="page-desc">
          Each epoch is an immutable snapshot of every deployed contract ABI at that point in time.
          Snapshots are content-addressed and permanently cached — safe to pin in builds or SDKs.
        </p>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 80 }}>Epoch</th>
              <th style={{ width: 110 }}>Contracts</th>
              <th>Git tag</th>
              <th className="right" style={{ width: 180 }} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((e, i) => (
              <tr key={e.epoch} className="row-stagger" style={{ animationDelay: `${i * 10}ms` }}>
                <td>
                  <Link
                    href={`/epoch/${e.epoch}`}
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                  >
                    {e.epoch}
                  </Link>
                  {e.epoch === maxEpoch && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 9,
                        padding: '1.5px 6px',
                        borderRadius: 100,
                        background: 'var(--accent)',
                        color: '#021214',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      current
                    </span>
                  )}
                </td>
                <td>
                  <span className="num">{e.contractCount}</span>
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 11,
                      color: 'var(--text-faint)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    deployed
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      fontSize: 12,
                    }}
                  >
                    {e.gitTag ?? '—'}
                  </span>
                </td>
                <td className="right">
                  <div className="row-actions">
                    <Link className="btn sm ghost" href={`/epoch/${e.epoch}`}>
                      View ABIs →
                    </Link>
                    <a
                      className="btn sm ghost"
                      href={`/download/epoch/${e.epoch}/all.zip`}
                      download
                    >
                      ↓ Zip
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
