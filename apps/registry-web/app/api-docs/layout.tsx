export const metadata = {
  title: 'API Reference',
  openGraph: {
    title: 'API Reference',
    images: ['/api/og?title=API+Reference&sub=REST+v1+%C2%B7+CORS+enabled'],
  },
  twitter: { title: 'API Reference' },
}

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
