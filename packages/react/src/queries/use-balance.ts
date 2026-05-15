import type { LiveBalance } from '@qubic.org/rpc'
import type { Identity } from '@qubic.org/types'
import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useQubic } from '../context.js'

type Options = Omit<UseQueryOptions<LiveBalance>, 'queryKey' | 'queryFn' | 'enabled'>

/**
 * Fetches the balance for a Qubic identity from the live API.
 * Query is disabled when `identity` is null or undefined.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useBalance(identity)
 * console.log(data?.balance)
 * ```
 */
export function useBalance(
  identity: Identity | string | null | undefined,
  options?: Options,
): UseQueryResult<LiveBalance> {
  const { liveClient } = useQubic()
  return useQuery<LiveBalance>({
    queryKey: ['qubic', 'balance', identity],
    queryFn: () => liveClient.getBalance(identity as string),
    enabled: identity != null && identity.length > 0,
    ...options,
  })
}
