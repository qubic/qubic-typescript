'use client'
import { useState } from 'react'

export function TryIt({ path }: { path: string }) {
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function run() {
    setLoading(true)
    try {
      const res = await fetch(path)
      const data = await res.json()
      const text = JSON.stringify(data, null, 2)
      setResult(text.length > 6000 ? `${text.slice(0, 6000)}\n… (truncated)` : text)
    } catch (e) {
      setResult(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button type="button" className="try-it" onClick={run} disabled={loading}>
        {loading ? 'Loading…' : 'Try live ↗'}
      </button>
      {result && (
        <div className="code" style={{ marginTop: 8 }}>
          <div className="code-bar">
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            <span className="lbl">200 OK · application/json</span>
          </div>
          <pre style={{ maxHeight: 320, overflow: 'auto' }}>{result}</pre>
        </div>
      )}
    </div>
  )
}
