import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AbiView } from '../../../../../components/abi-view'
import { Crumbs } from '../../../../../components/crumbs'
import { api } from '../../../../../lib/api'

export default async function AbiSnapshotPage({
  params,
}: {
  params: Promise<{ index: string; epoch: string }>
}) {
  const { index, epoch } = await params
  const idx = Number(index)
  const ep = Number(epoch)

  const [result, current] = await Promise.all([
    api.contractAtEpoch(idx, ep).catch(() => null),
    api.contract(idx).catch(() => null),
  ])

  if (!result) notFound()
  const { version } = result
  const name = current?.contractName ?? version.contractName
  const isCurrent = result.isCurrent

  return (
    <main className="container">
      <Crumbs
        items={[
          { label: 'Contracts', href: '/' },
          { label: name, href: `/contract/${idx}` },
          { label: `Epoch ${ep}` },
        ]}
      />

      <div className="page-head">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0 }}>
            <div className="eyebrow">
              Snapshot
              {isCurrent && (
                <>
                  {' '}
                  <span style={{ color: 'var(--accent)' }}>Current</span>
                </>
              )}
            </div>
            <h1 className="page-title">
              {name} <span className="mono-idx">@ epoch {ep}</span>
            </h1>
            <p className="page-sub">
              contractIndex {idx} · effective e{version.effectiveFromEpoch}
              {version.effectiveToEpoch !== null ? ` – e${version.effectiveToEpoch}` : ' → now'}
            </p>
          </div>
          <span style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <Link className="btn sm" href={`/contract/${idx}`}>
              ← Contract
            </Link>
            <a
              className="btn sm primary"
              href={`/download/epoch/${ep}/${version.contractName}.json`}
              download
            >
              Download Snapshot
            </a>
          </div>
        </div>
      </div>

      <AbiView version={version} />
    </main>
  )
}
