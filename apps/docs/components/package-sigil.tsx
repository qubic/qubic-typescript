const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#ef4444",
];
const BGS = [
  "rgba(59,130,246,0.12)",
  "rgba(139,92,246,0.12)",
  "rgba(245,158,11,0.14)",
  "rgba(16,185,129,0.12)",
  "rgba(6,182,212,0.12)",
  "rgba(239,68,68,0.10)",
];

function fnv(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h = ((h ^ s.charCodeAt(i)) >>> 0);
    h = (Math.imul(h, 16777619) >>> 0);
  }
  return h;
}

export function PackageSigil({
  name,
  size = 48,
}: {
  name: string;
  size?: number;
}) {
  const h = fnv(name || "?");
  const family = h % 6;
  const color = COLORS[family];
  const bg = BGS[family];

  const cells: [number, number][] = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      if ((h >> (y * 3 + x)) & 1) {
        cells.push([x, y]);
        if (x < 2) cells.push([4 - x, y]);
      }
    }
  }

  const cell = 100 / 5;
  const r = cell * 0.18;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        background: bg,
        borderRadius: 3,
        border: `1px solid ${color}22`,
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size - 14}
        height={size - 14}
        aria-hidden="true"
      >
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
  );
}

export function PackageHeader({ name }: { name: string; label?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <PackageSigil name={name} size={52} />
    </div>
  );
}
