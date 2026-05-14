'use client'
import { useRouter } from 'next/navigation'

export function EpochNav({ epoch, min, max }: { epoch: number; min: number; max: number }) {
  const router = useRouter()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
      <button
        className="epoch-btn"
        disabled={epoch <= min}
        onClick={() => router.push(`/epoch/${epoch - 1}`)}
      >← Prev</button>
      <h1>Epoch {epoch}</h1>
      <button
        className="epoch-btn"
        disabled={epoch >= max}
        onClick={() => router.push(`/epoch/${epoch + 1}`)}
      >Next →</button>
      <input
        type="number"
        defaultValue={epoch}
        min={min}
        max={max}
        style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 6, color: 'var(--text)', padding: '4px 8px',
          fontSize: 13, outline: 'none', width: 80,
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            const v = Number((e.target as HTMLInputElement).value)
            if (v >= min && v <= max) router.push(`/epoch/${v}`)
          }
        }}
      />
      <a className="btn" href={`/download/epoch/${epoch}.zip`} download style={{ marginLeft: 'auto' }}>↓ All contracts (zip)</a>
    </div>
  )
}
