import type { GetTransactionsForIdentityRequest, Hits, QueryTransaction } from '@qubic.org/rpc'
import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useQubic } from '../context.js'

export interface TransactionsForIdentityResult {
  transactions: QueryTransaction[]
  hits: Hits
  validForTick: number
}

type Options = Omit<
  UseQueryOptions<TransactionsForIdentityResult>,
  'queryKey' | 'queryFn' | 'enabled'
>

/**
 * Fetches transactions for an identity from the archive API. Requires `archiveClient`.
 * Query is disabled when `request` is null or undefined.
 *
 * @example
 * ```tsx
 * const { data } = useTransactionsForIdentity({
 *   addressId: identity,
 *   pagination: { offset: 0, size: 20 },
 * })
 * ```
 */
export function useTransactionsForIdentity(
  request: GetTransactionsForIdentityRequest | null | undefined,
  options?: Options,
): UseQueryResult<TransactionsForIdentityResult> {
  const { archiveClient } = useQubic()
  return useQuery<TransactionsForIdentityResult>({
    queryKey: ['qubic', 'transactionsForIdentity', request],
    queryFn: async () => {
      if (archiveClient == null)
        throw new Error('archiveClient is required for useTransactionsForIdentity')
      const r = await archiveClient.getTransactionsForIdentity(
        request as GetTransactionsForIdentityRequest,
      )
      if (!r.ok) throw r.error
      return r.value
    },
    enabled: request != null,
    ...options,
  })
}
