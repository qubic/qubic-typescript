import type { GetEventLogsRequest, Hits, QueryEvent } from '@qubic.ts/rpc'
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
 *   filters: { eventType: '0' },
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
    queryFn: () => {
      if (archiveClient == null) throw new Error('archiveClient is required for useEventLogs')
      return archiveClient.getEventLogs(request as GetEventLogsRequest)
    },
    enabled: request != null,
    ...options,
  })
}
