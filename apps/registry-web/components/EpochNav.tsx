'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
        <a
          className={`btn sm${prevEpoch !== null ? '' : ' disabled'}`}
          href={prevEpoch !== null ? `/epoch/${prevEpoch}` : '#'}
          onClick={(e) => prevEpoch === null && e.preventDefault()}
        >
          ← Prev
        </a>
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
        <a
          className={`btn sm${nextEpoch !== null ? '' : ' disabled'}`}
          href={nextEpoch !== null ? `/epoch/${nextEpoch}` : '#'}
          onClick={(e) => nextEpoch === null && e.preventDefault()}
        >
          Next →
        </a>
      </div>
      <span className="muted" style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>
        Range {min} – {max}
      </span>
      <span style={{ flex: 1 }} />
      {contractCount !== undefined && (
        <a className="btn sm" href={`/download/epoch/${epoch}/all.zip`} download>
          ↓ epoch-{epoch}.zip · {contractCount} contracts
        </a>
      )}
    </div>
  )
}
