'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Search } from 'lucide-react'

export function NavBar() {
  const pathname = usePathname()

  const contractsActive =
    pathname === '/' ||
    pathname.startsWith('/contract')

  const epochsActive =
    pathname === '/epochs' || pathname.startsWith('/epoch')

  const apiActive = pathname === '/api-docs'

  return (
    <header className="topnav">
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">q</span>
          <span className="brand-text">
            <span className="reg">qubic</span>
            <span className="slash">/</span>
            <span className="reg">registry</span>
          </span>
        </Link>

        <nav className="nav-links">
          <Link href="/" className={contractsActive ? 'active' : ''}>
            Contracts
          </Link>
          <Link href="/epochs" className={epochsActive ? 'active' : ''}>
            Epochs
          </Link>
          <Link href="/api-docs" className={apiActive ? 'active' : ''}>
            API
          </Link>
        </nav>

        <span className="grow" />

        <div className="kbar" role="button" tabIndex={0}>
          <Search size={13} />
          <span>Quick search…</span>
          <span className="kbd">⌘K</span>
        </div>

        <a
          className="btn sm"
          href="https://github.com/qubic/qubic-typescript"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={13} />
          Source
        </a>
      </div>
    </header>
  )
}
