'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function EpochNav({
  epoch,
  min,
  max,
  contractCount,
}: {
  epoch: number
  min: number
  max: number
  contractCount?: number
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

  const hasPrev = epoch > min
  const hasNext = epoch < max

  return (
    <div className="epoch-nav">
      <div className="epoch-pager">
        <a
          className={`btn sm${hasPrev ? '' : ' disabled'}`}
          href={hasPrev ? `/epoch/${epoch - 1}` : '#'}
          onClick={(e) => !hasPrev && e.preventDefault()}
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
          className={`btn sm${hasNext ? '' : ' disabled'}`}
          href={hasNext ? `/epoch/${epoch + 1}` : '#'}
          onClick={(e) => !hasNext && e.preventDefault()}
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
