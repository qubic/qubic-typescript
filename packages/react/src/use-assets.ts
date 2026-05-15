import type { IssuedAsset, OwnedAsset, PossessedAsset } from '@qubic.ts/rpc'
import type { Identity } from '@qubic.ts/types'
import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useQubic } from './context.js'

type IdentityParam = Identity | string | null | undefined

function enabled(id: IdentityParam) {
  return id != null && id.length > 0
}

/**
 * Fetches all assets issued by the given identity.
 * Query is disabled when identity is null or undefined.
 */
export function useIssuedAssets(
  identity: IdentityParam,
  options?: Omit<UseQueryOptions<IssuedAsset[]>, 'queryKey' | 'queryFn' | 'enabled'>,
): UseQueryResult<IssuedAsset[]> {
  const { liveClient } = useQubic()
  return useQuery<IssuedAsset[]>({
    queryKey: ['qubic', 'issuedAssets', identity],
    queryFn: () => liveClient.getIssuedAssets(identity as string),
    enabled: enabled(identity),
    ...options,
  })
}

/**
 * Fetches all assets owned by the given identity.
 * Query is disabled when identity is null or undefined.
 */
export function useOwnedAssets(
  identity: IdentityParam,
  options?: Omit<UseQueryOptions<OwnedAsset[]>, 'queryKey' | 'queryFn' | 'enabled'>,
): UseQueryResult<OwnedAsset[]> {
  const { liveClient } = useQubic()
  return useQuery<OwnedAsset[]>({
    queryKey: ['qubic', 'ownedAssets', identity],
    queryFn: () => liveClient.getOwnedAssets(identity as string),
    enabled: enabled(identity),
    ...options,
  })
}

/**
 * Fetches all assets possessed by the given identity.
 * Query is disabled when identity is null or undefined.
 */
export function usePossessedAssets(
  identity: IdentityParam,
  options?: Omit<UseQueryOptions<PossessedAsset[]>, 'queryKey' | 'queryFn' | 'enabled'>,
): UseQueryResult<PossessedAsset[]> {
  const { liveClient } = useQubic()
  return useQuery<PossessedAsset[]>({
    queryKey: ['qubic', 'possessedAssets', identity],
    queryFn: () => liveClient.getPossessedAssets(identity as string),
    enabled: enabled(identity),
    ...options,
  })
}
