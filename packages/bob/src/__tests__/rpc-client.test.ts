import { describe, expect, test } from 'bun:test'
import { BobRpcError } from '../errors.js'
import { createBobRpcClient } from '../rpc-client.js'

function mockFetch(body: unknown, status = 200): typeof globalThis.fetch {
  return async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
}

const ENDPOINT = 'http://localhost:40420'

function rpcResult<T>(result: T, id = 1) {
  return { jsonrpc: '2.0', id, result }
}

function rpcError(code: number, message: string, id = 1) {
  return { jsonrpc: '2.0', id, error: { code, message } }
}

describe('createBobRpcClient', () => {
  test('getChainId returns ok with chain id', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      fetch: mockFetch({ jsonrpc: '2.0', id: 1, result: 'qubic-mainnet' }),
    })
    const result = await client.getChainId()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe('qubic-mainnet')
  })

  test('getTickNumber returns ok with tick', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      fetch: mockFetch({ jsonrpc: '2.0', id: 1, result: 1234567 }),
    })
    const result = await client.getTickNumber()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe(1234567)
  })

  test('request uses JSON-RPC 2.0 framing', async () => {
    let capturedBody: unknown
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        capturedBody = JSON.parse(init?.body as string)
        return new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result: 'chain' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getChainId()
    expect((capturedBody as { jsonrpc?: unknown }).jsonrpc).toBe('2.0')
    expect((capturedBody as { method?: unknown }).method).toBe('qubic_chainId')
    expect((capturedBody as { id?: unknown }).id).toBe(1)
  })

  test('id increments across calls', async () => {
    const ids: number[] = []
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        const body = JSON.parse(init?.body as string) as { id: number }
        ids.push(body.id)
        return new Response(JSON.stringify({ jsonrpc: '2.0', id: body.id, result: 'x' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getChainId()
    await client.getChainId()
    expect(ids).toEqual([1, 2])
  })

  test('error response returns err(BobRpcError)', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch({
        jsonrpc: '2.0',
        id: 1,
        error: { code: -32601, message: 'Method not found' },
      }),
    })
    const result = await client.getChainId()
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(BobRpcError)
      expect(result.error.jsonRpcCode).toBe(-32601)
      expect(result.error.message).toBe('Method not found')
    }
  })

  test('HTTP error returns err(BobRpcError)', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch({ message: 'not found' }, 404),
    })
    const result = await client.getChainId()
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toBeInstanceOf(BobRpcError)
  })

  test('getLogs passes filter as param', async () => {
    let capturedBody: unknown
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        capturedBody = JSON.parse(init?.body as string)
        return new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getLogs({ scIndex: 1, fromTick: 100 })
    const body = capturedBody as { method: string; params: unknown[] }
    expect(body.method).toBe('qubic_getLogs')
    expect(body.params[0]).toEqual({ scIndex: 1, fromTick: 100 })
  })

  test('AbortSignal cancels request', async () => {
    const controller = new AbortController()
    controller.abort()
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        const signal = init?.signal
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
        return new Response('{}', { status: 200 })
      },
    })
    const result = await client.getChainId({ signal: controller.signal })
    expect(result.ok).toBe(false)
  })

  test('getTickByNumber returns BobIndexedTick with all fields', async () => {
    const tick = {
      tickNumber: 12500000,
      epoch: 150,
      computorIndex: 42,
      signature: '0xdeadbeef',
      tickHash: '0xabcdef',
      timestamp: 1705312245,
      timestampISO: '2025-01-15T10:30:45Z',
      millisecond: 500,
      timelock: '0x1234',
      transactionCount: 2,
      transactions: ['aaaa', 'bbbb'],
      previousTickHash: '0xprev',
    }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch({ jsonrpc: '2.0', id: 1, result: tick }),
    })
    const result = await client.getTickByNumber(12500000, false)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.tickNumber).toBe(12500000)
      expect(result.value.epoch).toBe(150)
      expect(result.value.computorIndex).toBe(42)
      expect(result.value.signature).toBe('0xdeadbeef')
      expect(result.value.tickHash).toBe('0xabcdef')
      expect(result.value.timestamp).toBe(1705312245)
      expect(result.value.timestampISO).toBe('2025-01-15T10:30:45Z')
      expect(result.value.millisecond).toBe(500)
      expect(result.value.timelock).toBe('0x1234')
      expect(result.value.transactionCount).toBe(2)
      expect(result.value.transactions).toEqual(['aaaa', 'bbbb'])
      expect(result.value.previousTickHash).toBe('0xprev')
    }
  })
})

describe('createBobRpcClient - retry logic', () => {
  test('retries on HTTP error and eventually succeeds', async () => {
    let callCount = 0
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 2,
      timeoutMs: 5000,
      fetch: async () => {
        callCount++
        if (callCount < 3) {
          return new Response('error', { status: 500 })
        }
        return new Response(JSON.stringify(rpcResult('success')), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    const result = await client.getChainId()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe('success')
    expect(callCount).toBe(3)
  })

  test('returns err after exhausting all retries on HTTP errors', async () => {
    let callCount = 0
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 1,
      timeoutMs: 5000,
      fetch: async () => {
        callCount++
        return new Response('error', { status: 503 })
      },
    })
    const result = await client.getChainId()
    expect(result.ok).toBe(false)
    // 1 initial + 1 retry = 2 calls
    expect(callCount).toBe(2)
  })

  test('retries on network failure and eventually succeeds', async () => {
    let callCount = 0
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 2,
      timeoutMs: 5000,
      fetch: async () => {
        callCount++
        if (callCount < 2) {
          throw new TypeError('fetch failed')
        }
        return new Response(JSON.stringify(rpcResult('ok')), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    const result = await client.getChainId()
    expect(result.ok).toBe(true)
    expect(callCount).toBe(2)
  })

  test('does not retry on JSON-RPC error response', async () => {
    let callCount = 0
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 3,
      fetch: async () => {
        callCount++
        return new Response(JSON.stringify(rpcError(-32601, 'Method not found')), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    const result = await client.getChainId()
    expect(result.ok).toBe(false)
    // Should only be called once (no retry for JSON-RPC errors)
    expect(callCount).toBe(1)
  })
})

describe('createBobRpcClient - getBalance', () => {
  test('converts numeric balance to bigint', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(12345)),
    })
    const result = await client.getBalance('A' as never)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe(12345n)
  })

  test('converts string balance to bigint', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult('99999999999999999')),
    })
    const result = await client.getBalance('A' as never)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe(99999999999999999n)
  })

  test('returns err for invalid balance value', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult('not-a-number')),
    })
    const result = await client.getBalance('A' as never)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(BobRpcError)
      expect(result.error.message).toContain('invalid balance value')
    }
  })

  test('propagates RPC error', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcError(-32602, 'Invalid params')),
    })
    const result = await client.getBalance('A' as never)
    expect(result.ok).toBe(false)
  })
})

describe('createBobRpcClient - getCurrentEpoch', () => {
  test('returns epoch number', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(150)),
    })
    const result = await client.getCurrentEpoch()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe(150)
  })
})

describe('createBobRpcClient - getTransactionByHash', () => {
  test('returns transaction object', async () => {
    const tx = {
      hash: 'abc',
      from: 'FROMID',
      to: 'TOID',
      amount: 100,
      tick: 5000,
      inputType: 0,
      inputSize: 0,
      inputData: '',
    }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(tx)),
    })
    const result = await client.getTransactionByHash('abc' as never)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.hash).toBe('abc')
  })
})

describe('createBobRpcClient - querySmartContract', () => {
  test('querySmartContract passes object params with nonce', async () => {
    let capturedBody: unknown
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        capturedBody = JSON.parse(init?.body as string)
        return new Response(JSON.stringify(rpcResult('AQIDBA==')), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    const result = await client.querySmartContract({
      nonce: 42,
      scIndex: 1,
      funcNumber: 2,
      data: 'AAAA',
    })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe('AQIDBA==')
    const body = capturedBody as { method: string; params: unknown[] }
    expect(body.method).toBe('qubic_querySmartContract')
    expect(body.params).toEqual([{ nonce: 42, scIndex: 1, funcNumber: 2, data: 'AAAA' }])
  })
})

describe('createBobRpcClient - broadcastTransaction', () => {
  test('returns transaction hash', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult('txhash123')),
    })
    const result = await client.broadcastTransaction('deadbeef')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe('txhash123')
  })
})

describe('createBobRpcClient - getTransfers', () => {
  test('returns transfer events', async () => {
    const transfers = [
      { tick: 100, logId: '1', source: 'AAA', destination: 'BBB', amount: 50, isCatchUp: false },
    ]
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(transfers)),
    })
    const result = await client.getTransfers({ fromTick: 100 })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toHaveLength(1)
  })
})

describe('createBobRpcClient - getComputors', () => {
  test('returns computor list with identities', async () => {
    const raw = { epoch: 100, identities: ['ID1', 'ID2'] }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getComputors(100)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.epoch).toBe(100)
      expect(result.value.identities).toEqual(['ID1', 'ID2'])
    }
  })

  test('returns err when identities is missing', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult({ epoch: 100 })),
    })
    const result = await client.getComputors(100)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toContain('missing identities')
  })

  test('calls with empty params when epoch is undefined', async () => {
    let capturedBody: unknown
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        capturedBody = JSON.parse(init?.body as string)
        return new Response(JSON.stringify(rpcResult({ epoch: 1, identities: [] })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getComputors()
    const body = capturedBody as { params: unknown[] }
    expect(body.params).toEqual([])
  })
})

describe('createBobRpcClient - getEpochInfo', () => {
  test('converts log ID fields to bigint', async () => {
    const raw = {
      epoch: 100,
      initialTick: 100000,
      endTick: 200000,
      endTickStartLogId: '1000',
      endTickEndLogId: '2000',
      lastIndexedTick: 199999,
      latestLogId: '3000',
    }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getEpochInfo(100)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.epoch).toBe(100)
      expect(result.value.endTickStartLogId).toBe(1000n)
      expect(result.value.endTickEndLogId).toBe(2000n)
      expect(result.value.latestLogId).toBe(3000n)
    }
  })

  test('returns err when required fields are missing', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(
        rpcResult({ epoch: null, initialTick: null, endTick: null, lastIndexedTick: null }),
      ),
    })
    const result = await client.getEpochInfo(1)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toContain('missing required fields')
  })
})

describe('createBobRpcClient - getEndEpochLogs', () => {
  test('converts logId to bigint', async () => {
    const raw = [{ logId: '42', tick: 100, epoch: 5, scIndex: 1, logType: 0, message: {} }]
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getEndEpochLogs(5)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value[0].logId).toBe(42n)
    }
  })
})

describe('createBobRpcClient - findLogIds', () => {
  test('converts log IDs to bigint array', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult([1, 2, '3'])),
    })
    const result = await client.findLogIds({
      scIndex: 1,
      logType: 0,
      fromTick: 100,
      toTick: 200,
    })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toEqual([1n, 2n, 3n])
  })
})

describe('createBobRpcClient - getTickLogRanges', () => {
  test('converts null fields correctly', async () => {
    const raw = [
      { tick: 100, fromLogId: '50', length: '10' },
      { tick: 200, fromLogId: null, length: null },
    ]
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getTickLogRanges([100, 200])
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value[0].fromLogId).toBe(50n)
      expect(result.value[0].length).toBe(10n)
      expect(result.value[1].fromLogId).toBeNull()
      expect(result.value[1].length).toBeNull()
    }
  })
})

describe('createBobRpcClient - getLogsByIdRange', () => {
  test('passes epoch and converted bigint IDs', async () => {
    let capturedBody: unknown
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        capturedBody = JSON.parse(init?.body as string)
        return new Response(JSON.stringify(rpcResult([])), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getLogsByIdRange(5, 100n, 200n)
    const body = capturedBody as { method: string; params: unknown[] }
    expect(body.method).toBe('qubic_getLogsByIdRange')
    expect(body.params).toEqual([5, 100, 200])
  })
})

describe('createBobRpcClient - getQuTransfers', () => {
  test('converts logId to bigint', async () => {
    const raw = [{ logId: '77', tick: 100, epoch: 5, scIndex: 1, logType: 0, message: {} }]
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getQuTransfers({
      identity: 'AAA' as never,
      fromTick: 100,
      toTick: 200,
    })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value[0].logId).toBe(77n)
  })
})

describe('createBobRpcClient - getAssetTransfers', () => {
  test('converts logId to bigint', async () => {
    const raw = [{ logId: '88', tick: 200, epoch: 6, scIndex: 2, logType: 1, message: {} }]
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getAssetTransfers({
      identity: 'AAA' as never,
      issuer: 'BBB' as never,
      assetName: 'TOKEN',
      fromTick: 100,
      toTick: 300,
    })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value[0].logId).toBe(88n)
  })
})

describe('createBobRpcClient - getAllAssetTransfers', () => {
  test('converts logId to bigint', async () => {
    const raw = [{ logId: '99', tick: 300, epoch: 7, scIndex: 3, logType: 2, message: {} }]
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getAllAssetTransfers({
      issuer: 'BBB' as never,
      assetName: 'TOKEN',
      fromTick: 100,
      toTick: 400,
    })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value[0].logId).toBe(99n)
  })
})

describe('createBobRpcClient - getAssetBalance', () => {
  test('converts balance to bigint and validates identities', async () => {
    const raw = {
      identity: 'A'.repeat(60),
      issuer: 'B'.repeat(60),
      assetName: 'TOKEN',
      balance: '500',
    }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getAssetBalance(
      'A'.repeat(60) as never,
      'B'.repeat(60) as never,
      'TOKEN',
    )
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.balance).toBe(500n)
      expect(result.value.assetName).toBe('TOKEN')
    }
  })

  test('returns err for invalid identity in response', async () => {
    const raw = { identity: 'SHORT', issuer: 'B'.repeat(60), assetName: 'T', balance: 10 }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getAssetBalance(
      'A'.repeat(60) as never,
      'B'.repeat(60) as never,
      'T',
    )
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toContain('invalid identity format')
  })

  test('returns err for non-numeric balance', async () => {
    const raw = { identity: 'A'.repeat(60), issuer: 'B'.repeat(60), assetName: 'T', balance: 'NaN' }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getAssetBalance(
      'A'.repeat(60) as never,
      'B'.repeat(60) as never,
      'T',
    )
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toContain('invalid balance value')
  })
})

describe('createBobRpcClient - getAssets', () => {
  test('converts amounts to bigint and validates identities', async () => {
    const raw = [
      { identity: 'A'.repeat(60), issuer: 'B'.repeat(60), assetName: 'TK1', amount: '100' },
      { identity: 'A'.repeat(60), issuer: 'B'.repeat(60), assetName: 'TK2', amount: '200' },
    ]
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getAssets('A'.repeat(60) as never)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toHaveLength(2)
      expect(result.value[0].amount).toBe(100n)
      expect(result.value[1].amount).toBe(200n)
    }
  })

  test('returns err for invalid identity in response', async () => {
    const raw = [{ identity: 'BAD', issuer: 'B'.repeat(60), assetName: 'T', amount: 10 }]
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(raw)),
    })
    const result = await client.getAssets('A'.repeat(60) as never)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toContain('invalid identity format')
  })
})

describe('createBobRpcClient - getTickByNumber', () => {
  test('passes includeTx as true in params', async () => {
    let capturedBody: unknown
    const tick = {
      tickNumber: 1,
      epoch: 1,
      computorIndex: 0,
      signature: '',
      tickHash: '',
      timestamp: 0,
      timestampISO: '',
      millisecond: 0,
      timelock: '',
      transactionCount: 0,
      transactions: [],
      previousTickHash: '',
    }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        capturedBody = JSON.parse(init?.body as string)
        return new Response(JSON.stringify(rpcResult(tick)), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getTickByNumber(123, true)
    const body = capturedBody as { params: unknown[] }
    expect(body.params).toEqual(['123', true])
  })

  test('defaults includeTx to false when undefined', async () => {
    let capturedBody: unknown
    const tick = {
      tickNumber: 1,
      epoch: 1,
      computorIndex: 0,
      signature: '',
      tickHash: '',
      timestamp: 0,
      timestampISO: '',
      millisecond: 0,
      timelock: '',
      transactionCount: 0,
      transactions: [],
      previousTickHash: '',
    }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        capturedBody = JSON.parse(init?.body as string)
        return new Response(JSON.stringify(rpcResult(tick)), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getTickByNumber(456, undefined)
    const body = capturedBody as { params: unknown[] }
    expect(body.params).toEqual(['456', false])
  })
})

describe('createBobRpcClient - getTransactionReceipt', () => {
  test('returns receipt with logs and converts logId/bigint', async () => {
    const receipt = {
      hash: 'abc',
      from: 'FROMID',
      to: 'TOID',
      amount: 100,
      tick: 5000,
      inputType: 0,
      inputSize: 0,
      inputData: '',
      logs: [{ logId: '77', tick: 5000, epoch: 150, scIndex: 1, logType: 0, message: {} }],
    }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: mockFetch(rpcResult(receipt)),
    })
    const result = await client.getTransactionReceipt('abc' as never)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.hash).toBe('abc')
      expect(result.value.logs).toHaveLength(1)
      expect(result.value.logs![0].logId).toBe(77n)
    }
  })
})

describe('createBobRpcClient - aborted signal', () => {
  test('returns err with abort message when signal already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        if (init?.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
        return new Response('{}', { status: 200 })
      },
    })
    const result = await client.getChainId({ signal: controller.signal })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.jsonRpcCode).toBe(-32000)
      expect(result.error.message).toBe('Request aborted')
    }
  })

  test('getClientVersion returns ok with version string', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      fetch: mockFetch(rpcResult('bob/1.2.3')),
    })
    const result = await client.getClientVersion()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe('bob/1.2.3')
  })

  test('getSyncing returns false when synced', async () => {
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      fetch: mockFetch(rpcResult(false)),
    })
    const result = await client.getSyncing()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe(false)
  })

  test('getSyncing returns sync object when not synced', async () => {
    const syncObj = { currentTick: 100, highestTick: 200, currentEpoch: 5 }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      fetch: mockFetch(rpcResult(syncObj)),
    })
    const result = await client.getSyncing()
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).not.toBe(false)
      if (result.value !== false) {
        expect(result.value.currentTick).toBe(100)
        expect(result.value.highestTick).toBe(200)
      }
    }
  })

  test('getStatus returns node status', async () => {
    const status = { currentTick: 500, currentEpoch: 10, verifiedTick: 499, bmConnections: 3 }
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      fetch: mockFetch(rpcResult(status)),
    })
    const result = await client.getStatus()
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.currentTick).toBe(500)
      expect(result.value.bmConnections).toBe(3)
    }
  })

  test('getStatus passes challenge param when provided', async () => {
    let capturedBody: unknown
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        capturedBody = JSON.parse(init?.body as string)
        return new Response(JSON.stringify(rpcResult({})), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getStatus('my-challenge')
    expect((capturedBody as { params?: unknown[] }).params).toEqual(['my-challenge'])
  })

  test('sendRawTransaction returns tx hash', async () => {
    const hash = 'a'.repeat(60)
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      fetch: mockFetch(rpcResult(hash)),
    })
    const result = await client.sendRawTransaction('deadbeef')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe(hash)
  })

  test('getTickByHash sends correct method and params', async () => {
    let capturedBody: unknown
    const client = createBobRpcClient({
      endpoint: ENDPOINT,
      retries: 0,
      fetch: async (_url, init) => {
        capturedBody = JSON.parse(init?.body as string)
        return new Response(JSON.stringify(rpcResult({ tickNumber: 1, epoch: 1 })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })
    await client.getTickByHash('0xdeadbeef', true)
    expect((capturedBody as { method?: string }).method).toBe('qubic_getTickByHash')
    expect((capturedBody as { params?: unknown[] }).params).toEqual(['0xdeadbeef', true])
  })
})
