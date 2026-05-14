import Link from 'next/link'

interface Crumb {
  label: string
  href?: string
}

export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && <span className="sep">/</span>}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="cur">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
