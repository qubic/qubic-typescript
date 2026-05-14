import type { NextConfig } from 'next'

const API_URL = process.env.REGISTRY_API_URL ?? 'http://localhost:3001'

const config: NextConfig = {
  async rewrites() {
    return [
      { source: '/v1/:path*', destination: `${API_URL}/v1/:path*` },
      { source: '/download/:path*', destination: `${API_URL}/download/:path*` },
      { source: '/health', destination: `${API_URL}/health` },
    ]
  },
}

export default config
