import type { GetEventLogsRequest, Hits, QueryEvent } from '@qubic.org/rpc'
import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useQubic } from '../context.js'

export interface EventLogsResult {
  eventLogs: QueryEvent[]
  hits: Hits
  validForTick: number
}

type Options = Omit<UseQueryOptions<EventLogsResult>, 'queryKey' | 'queryFn' | 'enabled'>

/**
 * Queries historical event logs from the archive API.
 * Requires `archiveClient` to be provided to QubicProvider.
 * Query is disabled when `request` is null or undefined.
 *
 * @example
 * ```tsx
 * const { data } = useEventLogs({
 *   filters: { logType: '0' },
 *   pagination: { offset: 0, size: 20 },
 * })
 * data?.eventLogs.forEach(e => console.log(e))
 * ```
 */
export function useEventLogs(
  request: GetEventLogsRequest | null | undefined,
  options?: Options,
): UseQueryResult<EventLogsResult> {
  const { archiveClient } = useQubic()
  return useQuery<EventLogsResult>({
    queryKey: ['qubic', 'eventLogs', request],
    queryFn: async () => {
      if (!archiveClient) throw new Error('useEventLogs requires archiveClient to be provided to QubicProvider')
      const client = archiveClient
      const r = await client.getEventLogs(request as GetEventLogsRequest)
      if (!r.ok) throw r.error
      return r.value
    },
    enabled: request != null && archiveClient != null,
    ...options,
  })
}
