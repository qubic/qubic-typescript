import { publicKeyToIdentity } from '@qubic.ts/crypto'
import type { Identity } from '@qubic.ts/types'
import type { NodeConnection } from './connection.js'
import {
  type CurrentTickInfo,
  type ExchangePublicPeers,
  MESSAGE_TYPE,
  type RespondEntity,
} from './message-types.js'

// ── Decoders ──────────────────────────────────────────────────────────────────

/**
 * Decodes a RESPOND_CURRENT_TICK_INFO payload (16 bytes).
 * Layout: tickDuration(u16) epoch(u16) tick(u32) alignedVotes(u16) misalignedVotes(u16) initialTick(u32)
 */
export function decodeCurrentTickInfo(payload: Uint8Array): CurrentTickInfo {
  if (payload.length < 16)
    throw new RangeError(`CurrentTickInfo payload too short: ${payload.length}`)
  const v = new DataView(payload.buffer, payload.byteOffset, payload.byteLength)
  return {
    tickDuration: v.getUint16(0, true),
    epoch: v.getUint16(2, true),
    tick: v.getUint32(4, true),
    numberOfAlignedVotes: v.getUint16(8, true),
    numberOfMisalignedVotes: v.getUint16(10, true),
    initialTick: v.getUint32(12, true),
  }
}

/**
 * Decodes a RESPOND_ENTITY payload (840 bytes).
 * EntityRecord(64) + tick(4) + spectrumIndex(4) + siblings(24×32=768)
 */
export function decodeRespondEntity(payload: Uint8Array): RespondEntity {
  if (payload.length < 72)
    throw new RangeError(`RespondEntity payload too short: ${payload.length}`)
  const v = new DataView(payload.buffer, payload.byteOffset, payload.byteLength)
  return {
    entity: {
      publicKey: payload.slice(0, 32),
      incomingAmount: v.getBigInt64(32, true),
      outgoingAmount: v.getBigInt64(40, true),
      numberOfIncomingTransfers: v.getUint32(48, true),
      numberOfOutgoingTransfers: v.getUint32(52, true),
      latestIncomingTransferTick: v.getUint32(56, true),
      latestOutgoingTransferTick: v.getUint32(60, true),
    },
    tick: v.getUint32(64, true),
    spectrumIndex: v.getInt32(68, true),
  }
}

/**
 * Decodes an EXCHANGE_PUBLIC_PEERS payload (16 bytes: 4 × IPv4).
 */
export function decodeExchangePublicPeers(payload: Uint8Array): ExchangePublicPeers {
  if (payload.length < 16)
    throw new RangeError(`ExchangePublicPeers payload too short: ${payload.length}`)
  const peers: string[] = []
  for (let i = 0; i < 4; i++) {
    const base = i * 4
    peers.push(`${payload[base]}.${payload[base + 1]}.${payload[base + 2]}.${payload[base + 3]}`)
  }
  return { peers }
}

// ── Typed request helpers ─────────────────────────────────────────────────────

/** Requests current tick info from the node. */
export async function requestCurrentTickInfo(
  conn: NodeConnection,
  options?: { signal?: AbortSignal },
): Promise<CurrentTickInfo> {
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_CURRENT_TICK_INFO, undefined, options)
  const payload = packets[0]
  if (!payload) throw new Error('No RESPOND_CURRENT_TICK_INFO packet received')
  return decodeCurrentTickInfo(payload)
}

/**
 * Requests entity (balance) info for a given 32-byte public key.
 * Returns the entity record along with the tick and spectrum index.
 */
export async function requestEntity(
  conn: NodeConnection,
  publicKey: Uint8Array,
  options?: { signal?: AbortSignal },
): Promise<RespondEntity & { identity: Identity }> {
  if (publicKey.length !== 32) throw new RangeError('publicKey must be 32 bytes')
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_ENTITY, publicKey, options)
  const payload = packets[0]
  if (!payload) throw new Error('No RESPOND_ENTITY packet received')
  const result = decodeRespondEntity(payload)
  return { ...result, identity: publicKeyToIdentity(result.entity.publicKey) }
}

/** Broadcasts a fully-signed transaction (no response expected beyond END_RESPONSE). */
export async function broadcastTransaction(
  conn: NodeConnection,
  signedTxBytes: Uint8Array,
  options?: { signal?: AbortSignal },
): Promise<void> {
  await conn.request(MESSAGE_TYPE.BROADCAST_TRANSACTION, signedTxBytes, options)
}

/** Exchanges known peers with the node. */
export async function exchangePublicPeers(
  conn: NodeConnection,
  ourPeers: string[],
  options?: { signal?: AbortSignal },
): Promise<ExchangePublicPeers> {
  const payload = new Uint8Array(16)
  for (let i = 0; i < Math.min(4, ourPeers.length); i++) {
    const parts = (ourPeers[i] ?? '0.0.0.0').split('.').map(Number)
    for (let j = 0; j < 4; j++) payload[i * 4 + j] = parts[j] ?? 0
  }
  const packets = await conn.request(MESSAGE_TYPE.EXCHANGE_PUBLIC_PEERS, payload, options)
  const first = packets[0] ?? new Uint8Array(16)
  return decodeExchangePublicPeers(first)
}
