import type { ContractSnapshot } from '@qubic.org/registry'
import type { Storage } from '../storage'

export function createR2Storage(bucket: R2Bucket): Storage {
  return {
    async getEpochSnapshots(epoch: number): Promise<ContractSnapshot[] | null> {
      const prefix = `epochs/${epoch}/`
      const list = await bucket.list({ prefix })
      if (list.objects.length === 0) return null
      const snapshots = await Promise.all(
        list.objects.map(async (obj) => {
          const r2obj = await bucket.get(obj.key)
          if (!r2obj) return null
          return r2obj.json<ContractSnapshot>()
        }),
      )
      const result = snapshots.filter((s): s is ContractSnapshot => s !== null)
      return result.sort((a, b) => a.contractIndex - b.contractIndex)
    },

    async getContractSnapshot(
      contractIndex: number,
      epoch: number,
    ): Promise<ContractSnapshot | null> {
      const snapshots = await this.getEpochSnapshots(epoch)
      return snapshots?.find((c) => c.contractIndex === contractIndex) ?? null
    },

    async listEpochs(): Promise<number[]> {
      const list = await bucket.list({ prefix: 'epochs/', delimiter: '/' })
      return (list.delimitedPrefixes ?? [])
        .map((p) => Number(p.replace('epochs/', '').replace('/', '')))
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b)
    },

    async getEpochRefs(): Promise<Record<string, string>> {
      const obj = await bucket.get('epoch-refs.json')
      if (!obj) return {}
      return obj.json<Record<string, string>>()
    },

    async readFile(path: string): Promise<Uint8Array | null> {
      const obj = await bucket.get(path)
      if (!obj) return null
      return new Uint8Array(await obj.arrayBuffer())
    },
  }
}
