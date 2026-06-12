import type { QueryTransaction } from '@qubic.org/rpc'
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
    queryFn: async () => {
      if (!archiveClient) throw new Error('useTransaction requires archiveClient to be provided to QubicProvider')
      const client = archiveClient
      const r = await client.getTransactionByHash(hash as string)
      if (!r.ok) throw r.error
      return r.value
    },
    enabled: hash != null && hash.length > 0 && archiveClient != null,
    ...options,
  })
}
