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
    }
    setLoading(false)
  }

  return (
    <>
      <button
        type="button"
        className="btn"
        onClick={run}
        disabled={loading}
        style={{ marginBottom: 8 }}
      >
        {loading ? 'Loading…' : 'Try it'}
      </button>
      {result && <pre style={{ marginTop: 8 }}>{result}</pre>}
    </>
  )
}
