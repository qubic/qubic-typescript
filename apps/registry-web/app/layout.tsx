import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { CommandPalette } from '../components/command-palette'
import { Footer } from '../components/footer'
import { NavBar } from '../components/nav-bar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const OG_DEFAULT = '/api/og?title=Qubic+Registry&sub=Contract+ABIs+pinned+per+epoch'

export const metadata: Metadata = {
  metadataBase: new URL('https://registry.qubickit.dev'),
  title: {
    default: 'qubic / registry — contract ABIs pinned per epoch',
    template: '%s | qubic registry',
  },
  description:
    'Canonical Qubic smart-contract ABIs, served per epoch. JSON snapshots, stable URLs, edge-cached.',
  openGraph: {
    siteName: 'Qubic Registry',
    type: 'website',
    images: [OG_DEFAULT],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-density="comfortable"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div className="shell">
          <NavBar />
          {children}
          <Footer />
        </div>
        <CommandPalette />
      </body>
    </html>
  )
}
