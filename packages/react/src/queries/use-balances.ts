import { qUtilGetBalances16 } from '@qubic.ts/contracts'
import { identityToPublicKey } from '@qubic.ts/crypto'
import type { Identity } from '@qubic.ts/types'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useQubic } from '../context.js'

const BATCH_SIZE = 16

function chunk<T>(arr: readonly T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size) as T[])
  return result
}

export interface BalancesResult {
  /** Balance in QU for each queried identity. Present only for identities in the input. */
  balances: Map<Identity, bigint>
  /** True while any batch is still loading. */
  isLoading: boolean
  /** First error encountered across batches, or undefined. */
  error: Error | undefined
  refetch(): void
}

/**
 * Fetches QU balances for up to N identities in one call per 16, using the
 * QUtil GetBalances16 smart contract function. Batches automatically if more
 * than 16 identities are provided.
 *
 * @example
 * ```tsx
 * const { balances, isLoading } = useBalances([identity1, identity2, identity3])
 *
 * balances.get(identity1) // bigint | undefined
 * ```
 */
export function useBalances(
  identities: readonly (Identity | string)[] | null | undefined,
): BalancesResult {
  const { liveClient } = useQubic()

  const batches = useMemo(
    () => (identities?.length ? chunk(identities, BATCH_SIZE) : []),
    [identities],
  )

  const results = useQueries({
    queries: batches.map((batch) => ({
      queryKey: ['qubic', 'balances16', batch] as const,
      queryFn: async () => {
        const result = await qUtilGetBalances16(
          liveClient,
          { publicKeys: batch as string[] },
          { identityToPublicKey: identityToPublicKey as (id: string) => Uint8Array },
        )
        if (!result.ok) throw result.error
        return { batch, output: result.value }
      },
      enabled: batch.length > 0,
    })),
  })

  const balances = useMemo(() => {
    const map = new Map<Identity, bigint>()
    for (const r of results) {
      if (!r.data) continue
      const { batch, output } = r.data
      for (let i = 0; i < batch.length; i++) {
        map.set(batch[i] as Identity, output.balances[i] ?? 0n)
      }
    }
    return map
  }, [results])

  const isLoading = results.some((r) => r.isPending)
  const error = results.find((r) => r.error)?.error as Error | undefined

  function refetch() {
    for (const r of results) void r.refetch()
  }

  return { balances, isLoading, error, refetch }
}
