import type { Ipo, IpoBidData } from '@qubic.org/rpc'
import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useQubic } from '../context.js'

type Options = Omit<UseQueryOptions<Ipo[]>, 'queryKey' | 'queryFn'>

/**
 * Fetches all currently active IPOs from the live API.
 *
 * @example
 * ```tsx
 * const { data: ipos } = useActiveIpos()
 * ipos?.forEach(ipo => console.log(ipo.contractIndex, ipo.numberOfBids))
 * ```
 */
export function useActiveIpos(options?: Options): UseQueryResult<Ipo[]> {
  const { liveClient } = useQubic()
  return useQuery<Ipo[]>({
    queryKey: ['qubic', 'activeIpos'],
    queryFn: async () => {
      const r = await liveClient.getActiveIpos()
      if (!r.ok) throw r.error
      return r.value
    },
    ...options,
  })
}

type BidOptions = Omit<UseQueryOptions<IpoBidData>, 'queryKey' | 'queryFn' | 'enabled'>

/**
 * Fetches IPO bid data for a specific contract.
 * Query is disabled when `contractIndex` is null or undefined.
 *
 * @example
 * ```tsx
 * const { data } = useContractIpoBids(5)
 * data?.bids.forEach(bid => console.log(bid))
 * ```
 */
export function useContractIpoBids(
  contractIndex: number | null | undefined,
  options?: BidOptions,
): UseQueryResult<IpoBidData> {
  const { liveClient } = useQubic()
  return useQuery<IpoBidData>({
    queryKey: ['qubic', 'ipoBids', contractIndex],
    queryFn: async () => {
      const r = await liveClient.getContractIpoBids(contractIndex as number)
      if (!r.ok) throw r.error
      return r.value
    },
    enabled: contractIndex != null,
    ...options,
  })
}
