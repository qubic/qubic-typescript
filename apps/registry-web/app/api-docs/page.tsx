import { TryIt } from '../../components/TryIt'

const ENDPOINTS = [
  { path: '/v1/contracts', desc: 'List all contracts with summary info' },
  { path: '/v1/contracts/1', desc: 'Current ABI for contract 1 (Qx)' },
  { path: '/v1/contracts/1/history', desc: 'All ABI versions for contract 1' },
  { path: '/v1/contracts/1/epoch/212', desc: 'ABI for contract 1 at epoch 212' },
  { path: '/v1/contracts/by-name/Qearn', desc: 'Current ABI by name (case-insensitive)' },
  { path: '/v1/epochs', desc: 'All epochs with contract counts and git tags' },
  { path: '/v1/epochs/212', desc: 'All contracts active at epoch 212' },
  { path: '/v1/registry.json', desc: 'Full compiled registry (cached 1h)' },
  { path: '/health', desc: 'Health check' },
]

const DOWNLOADS = [
  { path: '/download/registry.json', desc: 'Full registry.json as file download' },
  { path: '/download/epoch/212/Qearn.json', desc: 'Qearn ABI snapshot for epoch 212' },
  { path: '/download/epoch/212/all.zip', desc: 'All contracts for epoch 212 as zip' },
  { path: '/download/contract/9/all.zip', desc: 'All epoch snapshots for Qearn (index 9)' },
]

export default function ApiDocsPage() {
  return (
    <>
      <h1 style={{ marginBottom: 20 }}>API Reference</h1>

      <h2 style={{ marginBottom: 12 }}>JSON endpoints</h2>
      {ENDPOINTS.map(ep => (
        <div key={ep.path} className="endpoint" style={{ marginBottom: 12 }}>
          <div className="endpoint-header">
            <span className="method">GET</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{ep.path}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 'auto' }}>{ep.desc}</span>
          </div>
          <div style={{ padding: '12px 16px' }}>
            <TryIt path={ep.path} />
          </div>
        </div>
      ))}

      <h2 style={{ margin: '24px 0 12px' }}>Download endpoints</h2>
      {DOWNLOADS.map(ep => (
        <div key={ep.path} className="endpoint" style={{ marginBottom: 12 }}>
          <div className="endpoint-header">
            <span className="method">GET</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{ep.path}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 'auto' }}>{ep.desc}</span>
          </div>
          <div style={{ padding: '12px 16px' }}>
            <a className="btn" href={ep.path} download>↓ Download</a>
          </div>
        </div>
      ))}
    </>
  )
}
