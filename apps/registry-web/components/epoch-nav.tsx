'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_REGISTRY_API_URL ?? 'https://registry.qubic.org'

export function EpochNav({
  epoch,
  min,
  max,
  contractCount,
  availableEpochs,
}: {
  epoch: number
  min: number
  max: number
  contractCount?: number
  availableEpochs?: number[]
}) {
  const router = useRouter()
  const [val, setVal] = useState(String(epoch))

  function commit() {
    const n = Number.parseInt(val, 10)
    if (!Number.isNaN(n) && n >= min && n <= max) {
      router.push(`/epoch/${n}`)
    } else {
      setVal(String(epoch))
    }
  }

  const sorted = availableEpochs ? [...availableEpochs].sort((a, b) => a - b) : null
  const prevEpoch = sorted
    ? (sorted.filter((e) => e < epoch).at(-1) ?? null)
    : epoch > min
      ? epoch - 1
      : null
  const nextEpoch = sorted
    ? (sorted.find((e) => e > epoch) ?? null)
    : epoch < max
      ? epoch + 1
      : null

  return (
    <div className="epoch-nav">
      <div className="epoch-pager">
        {prevEpoch !== null ? (
          <a className="btn sm" href={`/epoch/${prevEpoch}`}>
            ← Prev
          </a>
        ) : (
          <span className="btn sm disabled" aria-disabled="true">
            ← Prev
          </span>
        )}
        <input
          value={val}
          onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, ''))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') setVal(String(epoch))
          }}
          onBlur={commit}
          aria-label="jump to epoch"
        />
        {nextEpoch !== null ? (
          <a className="btn sm" href={`/epoch/${nextEpoch}`}>
            Next →
          </a>
        ) : (
          <span className="btn sm disabled" aria-disabled="true">
            Next →
          </span>
        )}
      </div>
      <span className="muted" style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>
        Range {min} – {max}
      </span>
      <span style={{ flex: 1 }} />
      {contractCount !== undefined && (
        <a className="btn sm" href={`${BACKEND}/download/epoch/${epoch}/all.zip`} download>
          ↓ epoch-{epoch}.zip · {contractCount} contracts
        </a>
      )}
    </div>
  )
}
