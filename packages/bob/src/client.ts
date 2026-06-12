import { DEFAULT_BOB_BASE_URL } from './constants.js'
import { createBobRestClient } from './rest-client.js'
import type { BobRestClient, BobRestClientOptions } from './rest-client.js'
import { createBobRpcClient } from './rpc-client.js'
import type { BobRpcClient, BobRpcClientOptions } from './rpc-client.js'
import { createBobSubscriptionClient } from './subscription-client.js'
import type { BobSubscriptionClient, BobSubscriptionClientOptions } from './subscription-client.js'

export interface BobClientOptions {
  /** HTTP base URL for the Bob REST and RPC APIs. Default: http://localhost:40420 */
  baseUrl?: string
  /** WebSocket URL for real-time subscriptions. Default: ws://localhost:40420 */
  wsUrl?: string
  /** Override options for the REST client. */
  rest?: Partial<BobRestClientOptions>
  /** Override options for the RPC client. */
  rpc?: Partial<Omit<BobRpcClientOptions, 'endpoint'>>
  /** Override options for the subscription client. */
  subscription?: Partial<Omit<BobSubscriptionClientOptions, 'wsUrl'>>
}

export interface BobClient {
  rest: BobRestClient
  rpc: BobRpcClient
  subscription: BobSubscriptionClient
}

/**
 * Creates a composite Bob client with REST, RPC, and subscription sub-clients.
 *
 * @example
 * ```ts
 * const bob = createBobClient({ baseUrl: 'http://bob.example.com', wsUrl: 'ws://bob.example.com' })
 * const status = await bob.rest.getStatus()
 * for await (const event of bob.subscription.subscribeNewTicks()) {
 *   console.log(event.data.tick)
 *   break
 * }
 * ```
 */
export function createBobClient(options: BobClientOptions = {}): BobClient {
  const baseUrl = options.baseUrl ?? DEFAULT_BOB_BASE_URL
  const wsUrl = options.wsUrl ?? baseUrl.replace(/^http/, 'ws')

  return {
    rest: createBobRestClient({ baseUrl, ...options.rest }),
    rpc: createBobRpcClient({ endpoint: baseUrl, ...options.rpc }),
    subscription: createBobSubscriptionClient({ wsUrl, ...options.subscription }),
  }
}
