import { readdirSync } from 'node:fs'
import type { ContractSnapshot } from '@qubic.org/registry'
import type { Storage } from '../storage'

const REGISTRY_SRC = Bun.resolveSync('@qubic.org/registry', import.meta.dir)
const DATA_DIR = REGISTRY_SRC.replace(/\/src\/index\.ts$/, '/data/')
const EPOCHS_DIR = `${DATA_DIR}epochs/`

export function createBunStorage(): Storage {
  return {
    async getEpochSnapshots(epoch: number): Promise<ContractSnapshot[] | null> {
      const dir = `${EPOCHS_DIR}${epoch}/`
      try {
        const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
        if (files.length === 0) return null
        const snapshots = await Promise.all(
          files.map((f) => Bun.file(`${dir}${f}`).json() as Promise<ContractSnapshot>),
        )
        return snapshots.sort((a, b) => a.contractIndex - b.contractIndex)
      } catch {
        return null
      }
    },

    async getContractSnapshot(
      contractIndex: number,
      epoch: number,
    ): Promise<ContractSnapshot | null> {
      const snapshots = await this.getEpochSnapshots(epoch)
      return snapshots?.find((c) => c.contractIndex === contractIndex) ?? null
    },

    async listEpochs(): Promise<number[]> {
      return readdirSync(EPOCHS_DIR)
        .map(Number)
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b)
    },

    async listEpochsWithCounts(): Promise<{ epoch: number; contractCount: number }[]> {
      const epochs = readdirSync(EPOCHS_DIR)
        .map(Number)
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b)
      return epochs.map((epoch) => {
        try {
          const contractCount = readdirSync(`${EPOCHS_DIR}${epoch}/`).filter((f) =>
            f.endsWith('.json'),
          ).length
          return { epoch, contractCount }
        } catch {
          return { epoch, contractCount: 0 }
        }
      })
    },

    async getEpochRefs(): Promise<Record<string, string>> {
      return Bun.file(`${DATA_DIR}epoch-refs.json`).json()
    },

    async readFile(path: string): Promise<Uint8Array | null> {
      const f = Bun.file(`${DATA_DIR}${path}`)
      if (!(await f.exists())) return null
      return new Uint8Array(await f.arrayBuffer())
    },
  }
}
