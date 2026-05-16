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
      return (await this.listEpochsWithCounts()).map((e) => e.epoch)
    },

    async listEpochsWithCounts(): Promise<{ epoch: number; contractCount: number }[]> {
      const counts = new Map<number, number>()
      let cursor: string | undefined
      while (true) {
        const list = await bucket.list({ prefix: 'epochs/', ...(cursor ? { cursor } : {}), limit: 1000 })
        for (const obj of list.objects) {
          const match = obj.key.match(/^epochs\/(\d+)\//)
          if (match) {
            const epoch = Number(match[1])
            counts.set(epoch, (counts.get(epoch) ?? 0) + 1)
          }
        }
        if (!list.truncated) break
        cursor = list.cursor
      }
      return [...counts.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([epoch, contractCount]) => ({ epoch, contractCount }))
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
