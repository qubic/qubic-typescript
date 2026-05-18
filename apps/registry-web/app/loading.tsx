export default function Loading() {
  return (
    <main className="container" style={{ paddingTop: 48 }}>
      <div
        style={{
          height: 16,
          width: 120,
          borderRadius: 4,
          background: 'var(--surface-raised)',
          marginBottom: 32,
          animation: 'pulse 1.4s ease-in-out infinite',
        }}
      />
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 64,
            borderRadius: 8,
            background: 'var(--surface-raised)',
            marginBottom: 12,
            opacity: 1 - i * 0.2,
            animation: 'pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 80}ms`,
          }}
        />
      ))}
    </main>
  )
}
