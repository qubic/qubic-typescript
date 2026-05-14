export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span className="dot pulse" />
        <span>All systems normal</span>
        <span className="mono">·</span>
        <span className="mono">registry.qubic.org</span>
        <span style={{ flex: 1 }} />
        <a href="/api-docs" className="muted">
          API
        </a>
        <a
          href="https://github.com/qubic/qubic-typescript"
          className="muted"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a href="/health" className="muted">
          /health
        </a>
      </div>
    </footer>
  )
}
