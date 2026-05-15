import type { SmartContractCaller } from '@qubic.org/contracts'
import { identityToPublicKey, publicKeyToIdentity } from '@qubic.org/crypto'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useQubic } from '../context.js'

type ContractQueryFn<TInput, TOutput> = (
  live: SmartContractCaller,
  input: TInput,
  options?: {
    identityToPublicKey?: (id: string) => Uint8Array
    publicKeyToIdentity?: (pk: Uint8Array) => string
  },
) => Promise<{ ok: true; value: TOutput } | { ok: false; error: QubicRpcError }>

type Options<TOutput> = Omit<UseQueryOptions<TOutput>, 'queryKey' | 'queryFn' | 'enabled'>

/**
 * Runs a typed smart contract read function from @qubic.org/contracts as a TanStack Query.
 * Automatically provides identityToPublicKey and publicKeyToIdentity from @qubic.org/crypto.
 * Query is disabled when `input` is null or undefined.
 *
 * @example
 * ```tsx
 * import { qearnGetStateOfRound } from '@qubic.org/contracts'
 *
 * const { data, isLoading } = useContractQuery(qearnGetStateOfRound, { epoch: 212 })
 * console.log(data?.totalLockedAmount)
 * ```
 */
export function useContractQuery<TInput, TOutput>(
  fn: ContractQueryFn<TInput, TOutput>,
  input: TInput | null | undefined,
  options?: Options<TOutput>,
): UseQueryResult<TOutput> {
  const { liveClient } = useQubic()

  return useQuery<TOutput>({
    queryKey: ['qubic', 'contract', fn, input],
    queryFn: async () => {
      const result = await fn(liveClient, input as TInput, {
        identityToPublicKey: identityToPublicKey as (id: string) => Uint8Array,
        publicKeyToIdentity,
      })
      if (!result.ok) throw result.error
      return result.value
    },
    enabled: input != null,
    ...options,
  })
}
