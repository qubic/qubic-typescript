import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
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

  const epochNums = epochs.map((e) => e.epoch)
  const minEpoch = epochNums.length > 0 ? Math.min(...epochNums) : ep
  const maxEpoch = epochNums.length > 0 ? Math.max(...epochNums) : ep

  if (!contracts) {
    const others = epochNums.filter((e) => e !== ep).sort((a, b) => b - a)
    const nearest = others.find((e) => e <= ep) ?? others[0]
    if (nearest !== undefined) redirect(`/epoch/${nearest}`)
    notFound()
  }

  const isCurrentEpoch = ep === maxEpoch
  const totalProcs = contracts.reduce((s, c) => s + c.procedures.length, 0)
  const totalFuncs = contracts.reduce((s, c) => s + c.functions.length, 0)
  const totalStructs = contracts.reduce((s, c) => s + Object.keys(c.structs ?? {}).length, 0)

  return (
    <main className="container">
      <Crumbs items={[{ label: 'Epochs', href: '/epochs' }, { label: `Epoch ${ep}` }]} />

      <div className="page-head">
        <div className="eyebrow">{isCurrentEpoch ? 'Current Epoch' : 'Epoch Snapshot'}</div>
        <h1 className="page-title">
          Epoch <span style={{ color: 'var(--accent)' }}>{ep}</span>
          {isCurrentEpoch && <span className="mono-idx">Current</span>}
        </h1>
        <p className="page-sub">
          {contracts.length} contract{contracts.length !== 1 ? 's' : ''} · {totalProcs} procedures ·{' '}
          {totalFuncs} functions
          {totalStructs > 0 && ` · ${totalStructs} structs`}
        </p>
        {!isCurrentEpoch && (
          <p className="page-desc">
            Immutable ABI snapshot for epoch {ep}. All URLs are permanently cached — safe to pin in
            SDKs, codegen, or build systems.
          </p>
        )}
      </div>

      <EpochNav
        epoch={ep}
        min={minEpoch}
        max={maxEpoch}
        contractCount={contracts.length}
        availableEpochs={epochNums}
      />

      <div className="epoch-cards">
        {contracts.map((c, i) => {
          const structCount = Object.keys(c.structs ?? {}).length
          return (
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
                  <b>{c.procedures.length}</b> proc{c.procedures.length !== 1 ? 's' : ''}
                </span>
                <span>
                  <b>{c.functions.length}</b> func{c.functions.length !== 1 ? 's' : ''}
                </span>
                {structCount > 0 && (
                  <span>
                    <b>{structCount}</b> struct{structCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="ftr">
                <span className="fmuted" style={{ fontSize: 11 }}>
                  v{c.effectiveFromEpoch}+
                </span>
                <span className="open">View ABI →</span>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
