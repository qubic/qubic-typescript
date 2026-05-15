import type { LiveTickInfo } from '@qubic.ts/rpc'
import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useQubic } from '../context.js'

type Options = Omit<UseQueryOptions<LiveTickInfo>, 'queryKey' | 'queryFn'>

/**
 * Fetches current tick, epoch, and timing info from the live API.
 *
 * @param refetchIntervalMs - How often to re-poll in milliseconds. Default: 5000.
 * @example
 * ```tsx
 * const { data, isLoading } = useTickInfo()
 * console.log(data?.tick)
 * ```
 */
export function useTickInfo(
  refetchIntervalMs = 5_000,
  options?: Options,
): UseQueryResult<LiveTickInfo> {
  const { liveClient } = useQubic()
  return useQuery<LiveTickInfo>({
    queryKey: ['qubic', 'tickInfo'],
    queryFn: () => liveClient.getTickInfo(),
    refetchInterval: refetchIntervalMs,
    ...options,
  })
}
