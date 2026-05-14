import { api } from '../lib/api'
import { SearchFilter } from '../components/SearchFilter'

export default async function Home() {
  const contracts = await api.contracts()
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1>Contracts</h1>
        <a className="btn" href="/download/registry.json" download style={{ marginLeft: 'auto' }}>↓ registry.json</a>
      </div>
      <SearchFilter contracts={contracts} />
    </>
  )
}
