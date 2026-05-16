import type { ContractSnapshot } from '@qubic.org/registry'

export interface Storage {
  getEpochSnapshots(epoch: number): Promise<ContractSnapshot[] | null>
  getContractSnapshot(contractIndex: number, epoch: number): Promise<ContractSnapshot | null>
  listEpochs(): Promise<number[]>
  getEpochRefs(): Promise<Record<string, string>>
  readFile(path: string): Promise<Uint8Array | null>
}
