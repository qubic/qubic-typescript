'use client'
import { useEffect, useState } from 'react'

const MESSAGES = [
  { main: 'Every Qubic contract,', accent: 'indexed per epoch.' },
  { main: 'Link to any version.', accent: 'It stays there.' },
  { main: 'Browse the full history.', accent: 'Download any snapshot.' },
  { main: 'Track every change,', accent: 'epoch by epoch.' },
]

export function HeroHeadline() {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let swap: ReturnType<typeof setTimeout>
    const id = setInterval(() => {
      setFading(true)
      swap = setTimeout(() => {
        setIdx((i) => (i + 1) % MESSAGES.length)
        setFading(false)
      }, 350)
    }, 5500)
    return () => {
      clearInterval(id)
      clearTimeout(swap)
    }
  }, [])

  const msg = MESSAGES[idx]

  return (
    <h1 className={`hero-h1${fading ? ' fading' : ''}`}>
      {msg.main}
      <br />
      <span className="accent">{msg.accent}</span>
    </h1>
  )
}
