import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EpochNav } from '../../../components/EpochNav'
import { api } from '../../../lib/api'

export default async function EpochPage({ params }: { params: Promise<{ epoch: string }> }) {
  const { epoch } = await params
  const ep = Number(epoch)

  const [contracts, epochs] = await Promise.all([
    api.epoch(ep).catch(() => null),
    api.epochs().catch(() => []),
  ])
  if (!contracts) notFound()

  const epochNums = epochs.map((e) => e.epoch)
  const minEpoch = epochNums.length > 0 ? Math.min(...epochNums) : ep
  const maxEpoch = epochNums.length > 0 ? Math.max(...epochNums) : ep

  return (
    <>
      <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
        <Link href="/epochs" style={{ color: 'var(--text-muted)' }}>
          Epochs
        </Link>
        {' / '}
        <span style={{ color: 'var(--text)' }}>Epoch {ep}</span>
      </div>

      <EpochNav epoch={ep} min={minEpoch} max={maxEpoch} />

      <div className="card-grid">
        {contracts.map((c) => (
          <div key={c.contractIndex} className="card">
            <h3>{c.contractName}</h3>
            <div className="meta">
              #{c.contractIndex} · {c.procedures.length} procedures · {c.functions.length} functions
            </div>
            <div className="actions">
              <Link href={`/contract/${c.contractIndex}/epoch/${ep}`} className="btn">
                View ABI
              </Link>
              <a className="btn" href={`/download/epoch/${ep}/${c.contractName}.json`} download>
                ↓ JSON
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
