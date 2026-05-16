import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Qubic Registry — Contract ABIs pinned per epoch'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
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
      {/* Top label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#5eead4',
          }}
        />
        <span style={{ color: '#5eead4', fontSize: 20, fontFamily: 'monospace' }}>
          qubic / registry
        </span>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', gap: 20 }}>
        <div
          style={{
            color: '#e2e8f0',
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          The canonical ABI registry for every Qubic smart contract.
        </div>
        <div style={{ color: '#64748b', fontSize: 26 }}>
          Pinned per epoch · Stable URLs · Edge-cached · Never drifts.
        </div>
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
    { ...size },
  )
}
