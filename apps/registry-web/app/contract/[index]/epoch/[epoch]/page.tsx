import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AbiView } from '../../../../../components/AbiView'
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

  return (
    <>
      <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
        <Link href="/" style={{ color: 'var(--text-muted)' }}>
          Contracts
        </Link>
        {' / '}
        <Link href={`/contract/${idx}`} style={{ color: 'var(--text-muted)' }}>
          {name}
        </Link>
        {' / '}
        <span style={{ color: 'var(--text)' }}>Epoch {ep}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1>
          {name} — Epoch {ep}
        </h1>
        <a className="btn" href={`/download/epoch/${ep}/${version.contractName}.json`} download>
          ↓ JSON
        </a>
      </div>

      <AbiView version={version} />
    </>
  )
}
