import type { LiveClient, QueryClient as RpcQueryClient } from '@qubic.ts/rpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, createContext, useContext, useMemo, useState } from 'react'

export interface QubicContextValue {
  liveClient: LiveClient
  archiveClient: RpcQueryClient | undefined
}

const QubicContext = createContext<QubicContextValue | undefined>(undefined)

export interface QubicProviderProps {
  /** Pre-created LiveClient from createLiveClient(). */
  liveClient: LiveClient
  /** Optional archive query client from createQueryClient(). */
  archiveClient?: RpcQueryClient
  /**
   * Optional TanStack QueryClient. When omitted a default one is created.
   * Pass your app's QueryClient here to share the cache with Qubic hooks.
   */
  queryClient?: QueryClient
  children: ReactNode
}

/**
 * Provides Qubic RPC clients to all child hooks.
 * Must wrap any component that uses useTickInfo, useBalance, etc.
 *
 * Also acts as a QueryClientProvider — pass `queryClient` to share your
 * app's TanStack Query cache, or omit it to use an isolated default one.
 *
 * @example
 * ```tsx
 * const live = createLiveClient()
 * const archive = createQueryClient()
 *
 * <QubicProvider liveClient={live} archiveClient={archive}>
 *   <App />
 * </QubicProvider>
 * ```
 */
export function QubicProvider({
  liveClient,
  archiveClient,
  queryClient: externalQueryClient,
  children,
}: QubicProviderProps) {
  const [internalQueryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 10_000, retry: 2 },
        },
      }),
  )

  const queryClient = externalQueryClient ?? internalQueryClient

  const value = useMemo<QubicContextValue>(
    () => ({ liveClient, archiveClient }),
    [liveClient, archiveClient],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <QubicContext.Provider value={value}>{children}</QubicContext.Provider>
    </QueryClientProvider>
  )
}

/**
 * Returns the Qubic context value.
 * Must be called inside a QubicProvider.
 * @throws {Error} if called outside QubicProvider
 */
export function useQubic(): QubicContextValue {
  const ctx = useContext(QubicContext)
  if (ctx === undefined) throw new Error('useQubic must be used inside QubicProvider')
  return ctx
}
