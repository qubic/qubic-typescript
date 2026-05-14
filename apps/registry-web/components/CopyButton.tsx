'use client'
import { useState } from 'react'

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      style={{
        background: 'none',
        border: '1px solid var(--border)',
        borderRadius: 4,
        color: copied ? 'var(--green)' : 'var(--text-muted)',
        cursor: 'pointer',
        fontSize: 11,
        fontFamily: 'var(--mono)',
        padding: '1px 6px',
      }}
    >
      {copied ? 'copied!' : value}
    </button>
  )
}
