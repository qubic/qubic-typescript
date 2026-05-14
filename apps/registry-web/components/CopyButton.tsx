'use client'
import { useState } from 'react'

export function CopyButton({ value, label = 'copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  function copy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  return (
    <button type="button" className={`copy${copied ? ' ok' : ''}`} onClick={copy} title={`Copy ${value}`}>
      {copied ? '✓ copied' : label}
    </button>
  )
}
