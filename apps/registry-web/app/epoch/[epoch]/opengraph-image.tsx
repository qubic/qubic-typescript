import { ImageResponse } from 'next/og'
import { api } from '../../../lib/api'

export const alt = 'Epoch snapshot — Qubic Registry'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ epoch: string }> }) {
  const { epoch } = await params
  const epochNum = Number(epoch)

  const contracts = await api.epoch(epochNum).catch(() => null)
  const contractCount = contracts?.length ?? 0

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
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#5eead4' }} />
        <span style={{ color: '#5eead4', fontSize: 20, fontFamily: 'monospace' }}>
          qubic / registry · epoch
        </span>
      </div>

      {/* Epoch number */}
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', gap: 24 }}>
        <div
          style={{
            color: '#e2e8f0',
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          Epoch{' '}
          <span style={{ color: '#5eead4' }}>#{epochNum}</span>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: 'Contracts', value: contractCount },
            { label: 'Type', value: 'ABI snapshot' },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff08',
                border: '1px solid #ffffff12',
                borderRadius: 10,
                padding: '12px 20px',
                gap: 4,
              }}
            >
              <span style={{ color: '#e2e8f0', fontSize: 28, fontWeight: 700 }}>{value}</span>
              <span style={{ color: '#64748b', fontSize: 16 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
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
