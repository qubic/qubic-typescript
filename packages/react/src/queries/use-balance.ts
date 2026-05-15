import type { QubicBalance } from '@qubic.org/rpc'
import type { Identity } from '@qubic.org/types'
import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useQubic } from '../context.js'

type Options = Omit<UseQueryOptions<QubicBalance>, 'queryKey' | 'queryFn' | 'enabled'>

/**
 * Fetches the balance for a Qubic identity from the live API.
 * Query is disabled when `identity` is null or undefined.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useBalance(identity)
 * console.log(data?.balance) // bigint
 * ```
 */
export function useBalance(
  identity: Identity | string | null | undefined,
  options?: Options,
): UseQueryResult<QubicBalance> {
  const { liveClient } = useQubic()
  return useQuery<QubicBalance>({
    queryKey: ['qubic', 'balance', identity],
    queryFn: async () => {
      const r = await liveClient.getBalance(identity as string)
      if (!r.ok) throw r.error
      return r.value
    },
    enabled: identity != null && identity.length > 0,
    ...options,
  })
}
