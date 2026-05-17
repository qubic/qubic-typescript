'use client'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyButton({ value }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  function copy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard
      ?.writeText(value)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      })
      .catch(() => {})
  }

  return (
    <button
      type="button"
      className={`copy${copied ? ' ok' : ''}`}
      onClick={copy}
      title={`Copy ${value}`}
      aria-label={`Copy ${value}`}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
    </button>
  )
}
