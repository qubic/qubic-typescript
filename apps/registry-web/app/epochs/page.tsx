import Link from 'next/link'
import { api } from '../../lib/api'

export default async function EpochsPage() {
  const epochs = await api.epochs()

  return (
    <>
      <h1 style={{ marginBottom: 20 }}>Epochs</h1>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Epoch</th>
              <th>Contracts</th>
              <th>Git tag</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {[...epochs].reverse().map((e) => (
              <tr key={e.epoch} className="clickable">
                <td>
                  <Link href={`/epoch/${e.epoch}`}>{e.epoch}</Link>
                </td>
                <td>{e.contractCount}</td>
                <td style={{ color: 'var(--text-muted)' }}>{e.gitTag ?? '—'}</td>
                <td>
                  <a className="btn" href={`/download/epoch/${e.epoch}/all.zip`} download>
                    ↓ Zip
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
