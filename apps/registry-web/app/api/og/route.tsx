import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const W = 1200
const H = 630

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? 'qubic / registry'
  const sub = searchParams.get('sub') ?? null

  return new ImageResponse(
    <div
      style={{
        background: '#0a0c10',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 72px',
      }}
    >
      {/* Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#5eead4' }} />
        <span style={{ color: '#5eead4', fontSize: 20, fontFamily: 'monospace' }}>
          qubic / registry
        </span>
      </div>

      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', gap: 18 }}>
        <div
          style={{
            color: '#e2e8f0',
            fontSize: title.length > 24 ? 56 : 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }}
        >
          {title}
        </div>
        {sub && (
          <div style={{ color: '#64748b', fontSize: 26 }}>
            {sub}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 48,
        }}
      >
        <span style={{ color: '#475569', fontSize: 20, fontFamily: 'monospace' }}>
          registry.qubickit.dev
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 32,
                height: 4,
                borderRadius: 2,
                background: i === 0 ? '#5eead4' : i === 1 ? '#2dd4bf60' : '#2dd4bf20',
              }}
            />
          ))}
        </div>
      </div>
    </div>,
    { width: W, height: H },
  )
}
