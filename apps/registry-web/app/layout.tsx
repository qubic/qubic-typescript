import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Qubic Registry',
  description: 'Versioned ABI registry for Qubic smart contracts',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{
          display: 'flex', alignItems: 'center', gap: 24,
          padding: '0 24px', height: 48,
          background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <Link href="/" style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>
            Qubic Registry
          </Link>
          <div style={{ display: 'flex', gap: 16, marginLeft: 'auto' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', fontSize: 13 }}>Contracts</Link>
            <Link href="/epochs" style={{ color: 'var(--text-muted)', fontSize: 13 }}>Epochs</Link>
            <Link href="/api-docs" style={{ color: 'var(--text-muted)', fontSize: 13 }}>API</Link>
          </div>
        </nav>
        <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
