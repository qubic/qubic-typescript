import type { AbiLookupResult, ContractAbiVersion } from '@qubic.ts/registry'

const BASE = process.env.REGISTRY_API_URL ?? 'http://localhost:3001'

export interface ContractSummary {
  contractIndex: number
  contractName: string
  currentFromEpoch: number
  versionCount: number
  procedureCount: number
  functionCount: number
}

export interface EpochSummary {
  epoch: number
  contractCount: number
  gitTag: string | null
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json() as Promise<T>
}

export const api = {
  contracts: () => get<ContractSummary[]>('/v1/contracts'),
  contract: (index: number) => get<ContractAbiVersion>(`/v1/contracts/${index}`),
  contractHistory: (index: number) => get<ContractAbiVersion[]>(`/v1/contracts/${index}/history`),
  contractAtEpoch: (index: number, epoch: number) =>
    get<AbiLookupResult>(`/v1/contracts/${index}/epoch/${epoch}`),
  epochs: () => get<EpochSummary[]>('/v1/epochs'),
  epoch: (epoch: number) => get<ContractAbiVersion[]>(`/v1/epochs/${epoch}`),
}
