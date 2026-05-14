const COLORS = [
  'var(--t-int)',
  'var(--t-id)',
  'var(--t-arr)',
  'var(--t-struct)',
  'var(--accent)',
  'var(--t-bytes)',
]
const BGS = [
  'rgba(56,139,253,0.12)',
  'rgba(188,140,255,0.12)',
  'rgba(255,166,87,0.14)',
  'rgba(126,231,135,0.12)',
  'rgba(94,234,212,0.12)',
  'rgba(255,123,114,0.10)',
]

function fnv(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h = (h ^ s.charCodeAt(i)) >>> 0
    h = Math.imul(h, 16777619) >>> 0
  }
  return h
}

export function Sigil({ name, size = 28 }: { name: string; size?: number }) {
  const h = fnv(name || '?')
  const family = h % 6
  const color = COLORS[family]
  const bg = BGS[family]

  const cells: [number, number][] = []
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      if ((h >> (y * 3 + x)) & 1) {
        cells.push([x, y])
        if (x < 2) cells.push([4 - x, y])
      }
    }
  }

  const cell = 100 / 5
  const r = cell * 0.18

  return (
    <span
      className="sigil"
      style={{ width: size, height: size, background: bg, borderColor: 'transparent' }}
    >
      <svg viewBox="0 0 100 100" width={size - 6} height={size - 6} aria-hidden="true">
        {cells.map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x * cell + 1}
            y={y * cell + 1}
            width={cell - 2}
            height={cell - 2}
            rx={r}
            ry={r}
            fill={color}
          />
        ))}
      </svg>
    </span>
  )
}
