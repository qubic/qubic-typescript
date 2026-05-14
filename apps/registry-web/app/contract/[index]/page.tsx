import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AbiView } from '../../../components/AbiView'
import { api } from '../../../lib/api'

export default async function ContractPage({ params }: { params: Promise<{ index: string }> }) {
  const { index } = await params
  const idx = Number(index)

  const [current, history] = await Promise.all([
    api.contract(idx).catch(() => null),
    api.contractHistory(idx).catch(() => []),
  ])

  if (!current) notFound()

  return (
    <>
      <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
        <Link href="/" style={{ color: 'var(--text-muted)' }}>
          Contracts
        </Link>
        {' / '}
        <span style={{ color: 'var(--text)' }}>{current.contractName}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1>
          {current.contractName}
          <span
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              fontWeight: 'normal',
              marginLeft: 8,
            }}
          >
            #{current.contractIndex}
          </span>
        </h1>
        <a
          className="btn"
          href={`/download/epoch/${current.effectiveFromEpoch}/${current.contractName}.json`}
          download
        >
          ↓ Current ABI
        </a>
        <a className="btn" href={`/download/contract/${idx}/all.zip`} download>
          ↓ All epochs (zip)
        </a>
      </div>

      {history.length > 1 && (
        <>
          <h2 style={{ marginBottom: 12 }}>Version history</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
            {[...history].reverse().map((v) => (
              <Link
                key={v.effectiveFromEpoch}
                href={`/contract/${idx}/epoch/${v.effectiveFromEpoch}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="timeline-row"
                  style={{ borderColor: v.effectiveToEpoch === null ? 'var(--green)' : undefined }}
                >
                  <span
                    style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-muted)' }}
                  >
                    {v.effectiveToEpoch === null
                      ? `Epoch ${v.effectiveFromEpoch}+`
                      : `Epochs ${v.effectiveFromEpoch}–${v.effectiveToEpoch}`}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {v.procedures.length} procedures · {v.functions.length} functions
                  </span>
                  {v.effectiveToEpoch === null && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: 11,
                        padding: '1px 6px',
                        background: '#1a3a1a',
                        color: 'var(--green)',
                        borderRadius: 4,
                      }}
                    >
                      current
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 style={{ marginBottom: 12 }}>{history.length > 1 ? 'Current ABI' : 'ABI'}</h2>
      <AbiView version={current} />
    </>
  )
}
