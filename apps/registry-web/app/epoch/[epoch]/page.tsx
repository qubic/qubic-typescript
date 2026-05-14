import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EpochNav } from '../../../components/EpochNav'
import { Crumbs } from '../../../components/crumbs'
import { Sigil } from '../../../components/sigil'
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
  const isCurrentEpoch = ep === maxEpoch

  return (
    <main className="container">
      <Crumbs items={[{ label: 'Epochs', href: '/epochs' }, { label: `Epoch ${ep}` }]} />

      <div className="page-head">
        <div className="eyebrow">Epoch Snapshot</div>
        <h1 className="page-title">
          Epoch <span style={{ color: 'var(--accent)' }}>{ep}</span>
          {isCurrentEpoch && <span className="mono-idx">Current</span>}
        </h1>
        <p className="page-sub">
          {contracts.length} contract{contracts.length === 1 ? '' : 's'} active
        </p>
      </div>

      <EpochNav epoch={ep} min={minEpoch} max={maxEpoch} contractCount={contracts.length} />

      <div className="epoch-cards">
        {contracts.map((c, i) => (
          <Link
            key={c.contractIndex}
            href={`/contract/${c.contractIndex}/epoch/${ep}`}
            className="epoch-card row-stagger"
            style={{ animationDelay: `${i * 18}ms` }}
          >
            <div className="head">
              <Sigil name={c.contractName} size={28} />
              <span className="name">{c.contractName}</span>
              <span className="idx">#{String(c.contractIndex).padStart(2, '0')}</span>
            </div>
            <div className="counts">
              <span>
                <b>{c.procedures.length}</b> proc
              </span>
              <span>
                <b>{c.functions.length}</b> func
              </span>
              {Object.keys(c.structs ?? {}).length > 0 && (
                <span>
                  <b>{Object.keys(c.structs).length}</b> struct
                </span>
              )}
            </div>
            <div className="ftr">
              <span>Full ABI</span>
              <span className="open">View →</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
