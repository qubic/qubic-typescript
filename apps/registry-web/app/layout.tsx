import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { NavBar } from '../components/nav-bar'
import { Footer } from '../components/footer'

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

export const metadata: Metadata = {
  title: 'qubic / registry — contract ABIs pinned per epoch',
  description:
    'Canonical Qubic smart-contract ABIs, served per epoch. JSON snapshots, stable URLs, edge-cached.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-density="comfortable"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div className="shell">
          <NavBar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
