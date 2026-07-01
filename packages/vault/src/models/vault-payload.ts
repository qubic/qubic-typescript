import type { TaintStatus } from './types.js'

export interface VaultPayload {
  version: 3
  seeds: SeedEntry[]
  metadata: VaultMetadata
  extensions?: Record<string, unknown>
}

export interface SeedEntry {
  publicId: string
  encryptedSeed?: Uint8Array
  alias?: string
  taintStatus: TaintStatus
  isOnlyWatch?: boolean
  createdAt?: string
}

export interface VaultMetadata {
  createdAt: string
  updatedAt: string
  appVersion: string
  schemaVersion: 3
}
