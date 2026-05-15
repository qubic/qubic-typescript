import type { QueryTransaction } from '@qubic.ts/rpc'
import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useQubic } from '../context.js'

type Options = Omit<UseQueryOptions<QueryTransaction>, 'queryKey' | 'queryFn' | 'enabled'>

/**
 * Fetches a transaction by its 60-char lowercase hash from the archive API.
 * Requires `archiveClient` to be provided to QubicProvider.
 * Query is disabled when `hash` is null or undefined.
 *
 * @example
 * ```tsx
 * const { data } = useTransaction(txHash)
 * console.log(data?.inputType)
 * ```
 */
export function useTransaction(
  hash: string | null | undefined,
  options?: Options,
): UseQueryResult<QueryTransaction> {
  const { archiveClient } = useQubic()
  return useQuery<QueryTransaction>({
    queryKey: ['qubic', 'transaction', hash],
    queryFn: () => {
      if (archiveClient == null) throw new Error('archiveClient is required for useTransaction')
      return archiveClient.getTransactionByHash(hash as string)
    },
    enabled: hash != null && hash.length > 0,
    ...options,
  })
}
