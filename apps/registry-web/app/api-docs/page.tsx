'use client'
import { useMemo, useState } from 'react'
import { TryIt } from '../../components/try-it'

const BASE_URL = process.env.NEXT_PUBLIC_REGISTRY_API_URL ?? 'https://ts.registry.qubic.org'

interface Endpoint {
  id: string
  method: 'GET'
  path: string
  desc: string
  params?: { name: string; type: string }[]
  download?: boolean
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'list',
    method: 'GET',
    path: '/v1/contracts',
    desc: 'All contracts at the current epoch, with version summary.',
  },
  {
    id: 'one',
    method: 'GET',
    path: '/v1/contracts/:index',
    desc: 'Full current ABI for a single contract.',
    params: [{ name: ':index', type: 'number' }],
  },
  {
    id: 'history',
    method: 'GET',
    path: '/v1/contracts/:index/history',
    desc: 'All ABI versions for a contract, sorted ASC by effectiveFromEpoch.',
    params: [{ name: ':index', type: 'number' }],
  },
  {
    id: 'at-epoch',
    method: 'GET',
    path: '/v1/contracts/:index/epoch/:epoch',
    desc: 'ABI active at a specific epoch. Returns { version, isCurrent, isRegistryPossiblyStale }.',
    params: [
      { name: ':index', type: 'number' },
      { name: ':epoch', type: 'number' },
    ],
  },
  {
    id: 'by-name',
    method: 'GET',
    path: '/v1/contracts/by-name/:name',
    desc: 'Case-insensitive lookup by contractName.',
    params: [{ name: ':name', type: 'string' }],
  },
  {
    id: 'epochs',
    method: 'GET',
    path: '/v1/epochs',
    desc: 'All epochs with a snapshot on disk, with contractCount per epoch and the git tag.',
  },
  {
    id: 'epoch',
    method: 'GET',
    path: '/v1/epochs/:epoch',
    desc: 'All contract ABIs active at the given epoch.',
    params: [{ name: ':epoch', type: 'number' }],
  },
  {
    id: 'raw',
    method: 'GET',
    path: '/v1/registry.json',
    desc: 'The compiled registry index — { schemaVersion, updatedAt, versions[] }.',
  },
  {
    id: 'health',
    method: 'GET',
    path: '/health',
    desc: 'Uptime probe. Returns { ok: true }.',
  },
  {
    id: 'dl-reg',
    method: 'GET',
    path: '/download/registry.json',
    desc: 'registry.json as an attachment.',
    download: true,
  },
  {
    id: 'dl-file',
    method: 'GET',
    path: '/download/epoch/:epoch/:contract.json',
    desc: 'A single contract epoch snapshot, as an attachment.',
    params: [
      { name: ':epoch', type: 'number' },
      { name: ':contract', type: 'string' },
    ],
    download: true,
  },
  {
    id: 'dl-epoch',
    method: 'GET',
    path: '/download/epoch/:epoch/all.zip',
    desc: 'All contracts at the epoch as a zip — qubic-registry-epoch-N.zip.',
    params: [{ name: ':epoch', type: 'number' }],
    download: true,
  },
  {
    id: 'dl-all',
    method: 'GET',
    path: '/download/contract/:index/all.zip',
    desc: 'Every epoch snapshot for one contract.',
    params: [{ name: ':index', type: 'number' }],
    download: true,
  },
]

export default function ApiDocsPage() {
  const [activeId, setActiveId] = useState(ENDPOINTS[0].id)
  const active = useMemo(() => ENDPOINTS.find((e) => e.id === activeId) ?? ENDPOINTS[0], [activeId])

  return (
    <main className="container">
      <div className="page-head">
        <div className="eyebrow">REST · v1 · CORS enabled</div>
        <h1 className="page-title">API Reference</h1>
        <p className="page-sub">
          Public read API. No auth, rate-limited per IP. Base URL:{' '}
          <span className="mono" style={{ color: 'var(--text)' }}>
            https://ts.registry.qubic.org
          </span>
        </p>
      </div>

      <div className="api-stripe">
        {/* ── Endpoint list ──────────────────────────── */}
        <div className="api-list">
          {ENDPOINTS.map((ep) => (
            <button
              key={ep.id}
              type="button"
              className={`api-row${activeId === ep.id ? ' active' : ''}`}
              onClick={() => setActiveId(ep.id)}
            >
              <div className="ep">
                <span className={`mchip ${ep.method}`}>{ep.method}</span>
                <span className="path">{ep.path}</span>
                {ep.download && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-faint)',
                      marginLeft: 4,
                    }}
                  >
                    ↓
                  </span>
                )}
              </div>
              <p className="desc">{ep.desc}</p>
              {ep.params && ep.params.length > 0 && (
                <div className="params">
                  {ep.params.map((p, i) => (
                    <span key={p.name}>
                      {i > 0 ? '  ·  ' : ''}
                      <span className="param">{p.name}</span>
                      <span className="ptype">{p.type}</span>
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ── Sticky panel ───────────────────────────── */}
        <div className="api-sticky">
          <div className="card">
            <div className="card-head">
              <span className={`mchip ${active.method}`}>{active.method}</span>
              <span className="mono" style={{ color: 'var(--text-strong)', fontSize: 13 }}>
                {active.path}
              </span>
              <span style={{ flex: 1 }} />
            </div>
            <div className="card-body">
              {active.download ? (
                <a className="btn sm" href={`${BASE_URL}${active.path}`} download>
                  ↓ Download
                </a>
              ) : (
                <TryIt
                  baseUrl={BASE_URL}
                  path={active.path.replace(/:\w+/g, (m) => {
                    if (m === ':name' || m === ':contract') return 'System'
                    if (m === ':epoch') return '212'
                    return '1'
                  })}
                />
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Caching</h3>
            </div>
            <div
              className="card-body"
              style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.55 }}
            >
              Pinned epoch responses are immutable —{' '}
              <span className="mono" style={{ color: 'var(--text)' }}>
                Cache-Control: public, max-age=31536000, immutable
              </span>
              . Current snapshots use{' '}
              <span className="mono" style={{ color: 'var(--text)' }}>
                max-age=3600
              </span>{' '}
              with a strong <span className="mono">ETag</span>.
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Versioning</h3>
            </div>
            <div
              className="card-body"
              style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.55 }}
            >
              Routes are path-prefixed (
              <span className="mono" style={{ color: 'var(--text)' }}>
                /v1/
              </span>
              ). Breaking changes ship under <span className="mono">/v2/</span>;{' '}
              <span className="mono">/v1/</span> stays supported for at least 12 months.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
