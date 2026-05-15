import {
  type NodeConnection,
  type NodeConnectionOptions,
  createNodeConnection,
} from './connection.js'

export interface NodePoolOptions extends NodeConnectionOptions {
  /** How many peer failures to tolerate per request before giving up. Defaults to peers.length. */
  maxRetries?: number
}

export interface NodePool {
  /** Send a request, retrying on other peers if one fails. */
  request(
    type: number,
    payload?: Uint8Array,
    options?: { signal?: AbortSignal },
  ): Promise<Uint8Array[]>
  close(): void
}

/**
 * Manages a set of node connections with round-robin selection and per-failure retry.
 */
export function createNodePool(peers: readonly string[], options: NodePoolOptions = {}): NodePool {
  if (peers.length === 0) throw new Error('createNodePool: at least one peer is required')

  const maxRetries = options.maxRetries ?? peers.length
  const connections = new Map<string, NodeConnection>()
  let robin = 0 // always kept in [0, peers.length)

  async function getConn(hostname: string): Promise<NodeConnection> {
    const cached = connections.get(hostname)
    if (cached) return cached
    const conn = await createNodeConnection(hostname, options)
    connections.set(hostname, conn)
    return conn
  }

  return {
    async request(type, payload?, opts?) {
      let lastErr: Error | undefined
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const hostname = peers[robin]
        robin = (robin + 1) % peers.length
        if (!hostname) continue
        try {
          const conn = await getConn(hostname)
          return await conn.request(type, payload, opts)
        } catch (err) {
          connections.get(hostname)?.close()
          connections.delete(hostname)
          lastErr = err instanceof Error ? err : new Error(String(err))
        }
      }
      throw lastErr ?? new Error('createNodePool: all peers exhausted')
    },

    close() {
      for (const conn of connections.values()) conn.close()
      connections.clear()
    },
  }
}
