import { publicKeyToIdentity } from '@qubic.org/crypto'
import type { Identity } from '@qubic.org/types'
import type { NodeConnection } from './connection.js'
import {
  type AssetEntry,
  type ComputorList,
  type ContractFunctionResponse,
  type ContractIPO,
  type CurrentTickInfo,
  type ExchangePublicPeers,
  type LogIdRange,
  MESSAGE_TYPE,
  type OracleDataResponse,
  type RespondEntity,
  type SystemInfo,
  type TickTransactions,
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

// ── System info ───────────────────────────────────────────────────────────────

/**
 * Decodes a RESPOND_SYSTEM_INFO payload (128 bytes).
 * Layout: version(i16) epoch(u16) tick(u32) initialTick(u32) latestCreatedTick(u32)
 *   ms(u16) sec(u8) min(u8) hour(u8) day(u8) month(u8) year(u8)
 *   numberOfEntities(u32) numberOfTransactions(u32) randomMiningSeed(32B) solutionThreshold(i32)
 *   totalSpectrumAmount(u64) currentEntityBalanceDustThreshold(u64)
 *   targetTickVoteSignature(u32) computorPacketSignature(u64) solutionAdditionalThreshold(u64)
 *   _reserve2(u64) _reserve3(u64) _reserve4(u64)
 */
export function decodeSystemInfo(payload: Uint8Array): SystemInfo {
  if (payload.length < 128) throw new RangeError(`SystemInfo payload too short: ${payload.length}`)
  const v = new DataView(payload.buffer, payload.byteOffset, payload.byteLength)
  return {
    version: v.getInt16(0, true),
    epoch: v.getUint16(2, true),
    tick: v.getUint32(4, true),
    initialTick: v.getUint32(8, true),
    latestCreatedTick: v.getUint32(12, true),
    initialTimestamp: {
      millisecond: v.getUint16(16, true),
      second: v.getUint8(18),
      minute: v.getUint8(19),
      hour: v.getUint8(20),
      day: v.getUint8(21),
      month: v.getUint8(22),
      year: v.getUint8(23),
    },
    numberOfEntities: v.getUint32(24, true),
    numberOfTransactions: v.getUint32(28, true),
    randomMiningSeed: payload.slice(32, 64),
    solutionThreshold: v.getInt32(64, true),
    totalSpectrumAmount: v.getBigUint64(68, true),
    currentEntityBalanceDustThreshold: v.getBigUint64(76, true),
    targetTickVoteSignature: v.getUint32(84, true),
    computorPacketSignature: v.getBigUint64(88, true),
    solutionAdditionalThreshold: v.getBigUint64(96, true),
  }
}

/** Requests system info from the node (header-only request, no payload). */
export async function requestSystemInfo(
  conn: NodeConnection,
  options?: { signal?: AbortSignal },
): Promise<SystemInfo> {
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_SYSTEM_INFO, undefined, options)
  const payload = packets[0]
  if (!payload) throw new Error('No RESPOND_SYSTEM_INFO packet received')
  return decodeSystemInfo(payload)
}

// ── Computors ─────────────────────────────────────────────────────────────────

/**
 * Decodes a BROADCAST_COMPUTORS / RESPOND_COMPUTORS payload.
 * C++ Computors struct (pragma pack 1): epoch(u16) + publicKeys(676×32B) + signature(64B) = 21698 bytes.
 */
export function decodeComputors(payload: Uint8Array): ComputorList {
  // Minimum: 2 + 676*32 = 21634 (epoch + keys, ignoring signature)
  if (payload.length < 21_634)
    throw new RangeError(`Computors payload too short: ${payload.length}`)
  const v = new DataView(payload.buffer, payload.byteOffset, payload.byteLength)
  const epoch = v.getUint16(0, true)
  const publicKeys: Uint8Array[] = []
  const keyStart = 2 // epoch is 2 bytes, pragma pack(1) so no alignment padding
  for (let i = 0; i < 676; i++) {
    publicKeys.push(payload.slice(keyStart + i * 32, keyStart + (i + 1) * 32))
  }
  return { epoch, publicKeys }
}

/**
 * Requests the current computor list from the node.
 * C++ RequestComputors is a header-only request with no payload.
 * Response arrives as BROADCAST_COMPUTORS packets.
 */
export async function requestComputors(
  conn: NodeConnection,
  options?: { signal?: AbortSignal },
): Promise<ComputorList> {
  // C++ RequestComputors has no payload fields — epoch-specific requests are not part of the protocol.
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_COMPUTORS, undefined, options)
  const first = packets[0]
  if (!first) throw new Error('No BROADCAST_COMPUTORS packet received')
  return decodeComputors(first)
}

// ── Contract IPO ──────────────────────────────────────────────────────────────

/**
 * Decodes a RESPOND_CONTRACT_IPO payload.
 * Layout: contractIndex(u32) tick(u32) publicKeys(676×32B) prices(676×i64)
 */
export function decodeContractIPO(payload: Uint8Array): ContractIPO {
  const minSize = 4 + 4 + 676 * 32 + 676 * 8 // 4 + 4 + 21632 + 5408 = 27048
  if (payload.length < minSize)
    throw new RangeError(`ContractIPO payload too short: ${payload.length}`)
  const v = new DataView(payload.buffer, payload.byteOffset, payload.byteLength)
  const contractIndex = v.getUint32(0, true)
  const tick = v.getUint32(4, true)
  const publicKeys: Uint8Array[] = []
  for (let i = 0; i < 676; i++) {
    const base = 8 + i * 32
    publicKeys.push(payload.slice(base, base + 32))
  }
  const prices: bigint[] = []
  const priceBase = 8 + 676 * 32
  for (let i = 0; i < 676; i++) {
    prices.push(v.getBigInt64(priceBase + i * 8, true))
  }
  return { contractIndex, tick, publicKeys, prices }
}

/**
 * Requests the IPO data for a given contract index.
 * Request payload: contractIndex(u32 LE).
 */
export async function requestContractIPO(
  conn: NodeConnection,
  contractIndex: number,
  options?: { signal?: AbortSignal },
): Promise<ContractIPO> {
  const payload = new Uint8Array(4)
  new DataView(payload.buffer).setUint32(0, contractIndex, true)
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_CONTRACT_IPO, payload, options)
  const first = packets[0]
  if (!first) throw new Error('No RESPOND_CONTRACT_IPO packet received')
  return decodeContractIPO(first)
}

// ── Assets ────────────────────────────────────────────────────────────────────

/** Reads a 7-char null-padded asset name from a DataView. */
function readAssetName(v: DataView, offset: number): string {
  let name = ''
  for (let i = 0; i < 7; i++) {
    const b = v.getUint8(offset + i)
    if (b === 0) break
    name += String.fromCharCode(b)
  }
  return name
}

/** Size of a single RespondIssuedAssets packet: AssetRecord(48) + tick(4) + universeIndex(4) + siblings(24×32=768) = 824. */
const RESPOND_ISSUED_ASSET_SIZE = 48 + 4 + 4 + 24 * 32
/** Size of a single RespondOwnedAssets packet: AssetRecord(48) + issuanceAsset(48) + tick(4) + universeIndex(4) + siblings(24×32=768) = 872. */
const RESPOND_OWNED_ASSET_SIZE = 48 + 48 + 4 + 4 + 24 * 32
/** Size of a single RespondPossessedAssets packet: AssetRecord(48) + ownershipAsset(48) + issuanceAsset(48) + tick(4) + universeIndex(4) + siblings(24×32=768) = 920. */
const RESPOND_POSSESSED_ASSET_SIZE = 48 + 48 + 48 + 4 + 4 + 24 * 32

/** Decodes an issuance AssetRecord (48 bytes): publicKey(32) type(1) name(7) decimalPlaces(1) unitOfMeasurement(7). */
function decodeIssuanceAssetRecord(payload: Uint8Array, offset: number): AssetEntry {
  const v = new DataView(payload.buffer, payload.byteOffset + offset, 48)
  return {
    issuerPublicKey: payload.slice(offset, offset + 32),
    numberOfShares: 0n, // issuance records don't have numberOfShares
    managingContractIndex: 0,
    assetName: readAssetName(v, 33), // skip type byte at 32
    numberOfDecimalPlaces: v.getUint8(40),
    unitOfMeasurement: readAssetName(v, 41),
  }
}

/** Decodes an ownership/possession AssetRecord (48 bytes): publicKey(32) type(1) padding(1) managingContractIndex(u16) index(u32) numberOfShares(i64). */
function decodeOwnershipAssetRecord(payload: Uint8Array, offset: number): AssetEntry {
  const v = new DataView(payload.buffer, payload.byteOffset + offset, 48)
  return {
    issuerPublicKey: payload.slice(offset, offset + 32),
    numberOfShares: v.getBigInt64(40, true),
    managingContractIndex: v.getUint16(34, true),
    assetName: '',
    numberOfDecimalPlaces: 0,
    unitOfMeasurement: '',
  }
}

/**
 * Requests assets issued by a given identity.
 * The node sends one RespondIssuedAssets packet per asset (824 bytes each), terminated by END_RESPONSE.
 * Each packet: AssetRecord(48) + tick(u32) + universeIndex(u32) + siblings(24×32).
 */
export async function requestIssuedAssets(
  conn: NodeConnection,
  publicKey: Uint8Array,
  options?: { signal?: AbortSignal },
): Promise<AssetEntry[]> {
  if (publicKey.length !== 32) throw new RangeError('publicKey must be 32 bytes')
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_ISSUED_ASSETS, publicKey, options)
  const entries: AssetEntry[] = []
  for (const packet of packets) {
    if (packet.length < RESPOND_ISSUED_ASSET_SIZE) continue
    entries.push(decodeIssuanceAssetRecord(packet, 0))
  }
  return entries
}

/**
 * Requests assets owned by a given identity.
 * Each packet: ownershipAsset(48) + issuanceAsset(48) + tick(u32) + universeIndex(u32) + siblings(24×32).
 */
export async function requestOwnedAssets(
  conn: NodeConnection,
  publicKey: Uint8Array,
  options?: { signal?: AbortSignal },
): Promise<AssetEntry[]> {
  if (publicKey.length !== 32) throw new RangeError('publicKey must be 32 bytes')
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_OWNED_ASSETS, publicKey, options)
  const entries: AssetEntry[] = []
  for (const packet of packets) {
    if (packet.length < RESPOND_OWNED_ASSET_SIZE) continue
    const ownership = decodeOwnershipAssetRecord(packet, 0)
    const issuance = decodeIssuanceAssetRecord(packet, 48)
    entries.push({
      ...ownership,
      assetName: issuance.assetName,
      numberOfDecimalPlaces: issuance.numberOfDecimalPlaces,
      unitOfMeasurement: issuance.unitOfMeasurement,
    })
  }
  return entries
}

/**
 * Requests assets possessed by a given identity.
 * Each packet: possessionAsset(48) + ownershipAsset(48) + issuanceAsset(48) + tick(u32) + universeIndex(u32) + siblings(24×32).
 */
export async function requestPossessedAssets(
  conn: NodeConnection,
  publicKey: Uint8Array,
  options?: { signal?: AbortSignal },
): Promise<AssetEntry[]> {
  if (publicKey.length !== 32) throw new RangeError('publicKey must be 32 bytes')
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_POSSESSED_ASSETS, publicKey, options)
  const entries: AssetEntry[] = []
  for (const packet of packets) {
    if (packet.length < RESPOND_POSSESSED_ASSET_SIZE) continue
    const possession = decodeOwnershipAssetRecord(packet, 0)
    const issuance = decodeIssuanceAssetRecord(packet, 96)
    entries.push({
      ...possession,
      assetName: issuance.assetName,
      numberOfDecimalPlaces: issuance.numberOfDecimalPlaces,
      unitOfMeasurement: issuance.unitOfMeasurement,
    })
  }
  return entries
}

// ── Smart contract query ──────────────────────────────────────────────────────

/**
 * Decodes a RESPOND_CONTRACT_FUNCTION payload.
 * Layout: responseData(variable length — rest of payload)
 */
export function decodeContractFunctionResponse(payload: Uint8Array): ContractFunctionResponse {
  return { responseData: payload.slice(0) }
}

/**
 * Queries a smart contract function via TCP.
 * Request payload: contractIndex(u32) inputType(u16) inputSize(u16) requestData(variable)
 * Matches C++ RequestContractFunction struct (8-byte header + variable input).
 */
export async function requestContractFunction(
  conn: NodeConnection,
  contractIndex: number,
  inputType: number,
  requestData: Uint8Array,
  options?: { signal?: AbortSignal },
): Promise<ContractFunctionResponse> {
  const payload = new Uint8Array(8 + requestData.length)
  const v = new DataView(payload.buffer)
  v.setUint32(0, contractIndex, true)
  v.setUint16(4, inputType, true)
  v.setUint16(6, requestData.length, true)
  payload.set(requestData, 8)
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_CONTRACT_FUNCTION, payload, options)
  const first = packets[0]
  if (!first) throw new Error('No RESPOND_CONTRACT_FUNCTION packet received')
  return decodeContractFunctionResponse(first)
}

// ── Tick transactions ─────────────────────────────────────────────────────────

/**
 * Decodes RESPOND_TICK_TRANSACTIONS packets into a list of transaction hashes.
 * Each packet contains multiple 32-byte hashes.
 */
export function decodeTickTransactions(payloads: Uint8Array[]): TickTransactions {
  const transactionHashes: Uint8Array[] = []
  for (const payload of payloads) {
    for (let i = 0; i + 32 <= payload.length; i += 32) {
      transactionHashes.push(payload.slice(i, i + 32))
    }
  }
  return { transactionHashes }
}

/**
 * Requests all transaction hashes included in a given tick.
 * Request payload: tick(u32 LE).
 * Returns multiple packets, each containing 32-byte hashes.
 */
export async function requestTickTransactions(
  conn: NodeConnection,
  tick: number,
  options?: { signal?: AbortSignal },
): Promise<TickTransactions> {
  const payload = new Uint8Array(4)
  new DataView(payload.buffer).setUint32(0, tick, true)
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_TICK_TRANSACTIONS, payload, options)
  return decodeTickTransactions(packets)
}

// ── Transaction info ──────────────────────────────────────────────────────────

/**
 * Requests transaction info by its 32-byte hash.
 * Returns the raw response payload (the full Transaction struct).
 */
export async function requestTransactionInfo(
  conn: NodeConnection,
  txHash: Uint8Array,
  options?: { signal?: AbortSignal },
): Promise<Uint8Array> {
  if (txHash.length !== 32) throw new RangeError('txHash must be 32 bytes')
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_TRANSACTION_INFO, txHash, options)
  const payload = packets[0]
  if (!payload) throw new Error('No response to REQUEST_TRANSACTION_INFO received')
  return payload
}

// ── Tick data ─────────────────────────────────────────────────────────────────

/**
 * Requests full tick data for a given tick number.
 * Returns the raw response payload (the full TickData struct).
 */
export async function requestTickData(
  conn: NodeConnection,
  tick: number,
  options?: { signal?: AbortSignal },
): Promise<Uint8Array> {
  const payload = new Uint8Array(4)
  new DataView(payload.buffer).setUint32(0, tick, true)
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_TICK_DATA, payload, options)
  const first = packets[0]
  if (!first) throw new Error('No tick data response received')
  return first
}

// ── Active IPOs ───────────────────────────────────────────────────────────────

/**
 * Requests all currently active IPOs (header-only request).
 * Returns the raw response payload(s).
 */
export async function requestActiveIPOs(
  conn: NodeConnection,
  options?: { signal?: AbortSignal },
): Promise<Uint8Array[]> {
  return conn.request(MESSAGE_TYPE.REQUEST_ACTIVE_IPOS, undefined, options)
}

// ── Oracle data ──────────────────────────────────────────────────────────────

/** Oracle request types matching C++ RequestOracleData constants. */
export const ORACLE_REQ_TYPE = {
  ALL_QUERY_IDS_BY_TICK: 0,
  USER_QUERY_IDS_BY_TICK: 1,
  CONTRACT_DIRECT_QUERY_IDS_BY_TICK: 2,
  CONTRACT_SUBSCRIPTION_QUERY_IDS_BY_TICK: 3,
  PENDING_QUERY_IDS: 4,
  QUERY_AND_RESPONSE: 5,
  SUBSCRIPTION: 6,
  QUERY_STATISTICS: 7,
  ORACLE_REVENUE_POINTS: 8,
  ACTIVE_SUBSCRIPTIONS: 9,
  ACTIVE_CONTRACT_SUBSCRIPTIONS: 10,
} as const

/** Oracle response types matching C++ RespondOracleData constants. */
export const ORACLE_RES_TYPE = {
  QUERY_IDS: 0,
  QUERY_METADATA: 1,
  QUERY_DATA: 2,
  REPLY_DATA: 3,
  NOTIFIED_SUBSCRIBER_CONTRACTS: 4,
  SUBSCRIPTION: 5,
  SUBSCRIBER: 6,
  QUERY_STATISTICS: 7,
  ORACLE_REVENUE_POINTS: 8,
  TICK_RANGE: 9,
  SUBSCRIPTION_IDS: 10,
} as const

/**
 * Requests oracle data from the node.
 * Request payload: reqType(u32) _padding(u32) reqTickOrId(i64) = 16 bytes.
 * Returns all response packets, each prefixed with a 4-byte resType header.
 */
export async function requestOracleData(
  conn: NodeConnection,
  reqType: number,
  reqTickOrId: bigint | number = 0n,
  options?: { signal?: AbortSignal },
): Promise<OracleDataResponse[]> {
  const payload = new Uint8Array(16)
  const v = new DataView(payload.buffer)
  v.setUint32(0, reqType, true)
  // 4 bytes padding at offset 4 (zero)
  v.setBigInt64(8, BigInt(reqTickOrId), true)
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_ORACLE_DATA, payload, options)
  return packets.map((packet) => {
    if (packet.length < 4) return { resType: 0, payload: new Uint8Array(0) }
    const rv = new DataView(packet.buffer, packet.byteOffset, packet.byteLength)
    return {
      resType: rv.getUint32(0, true),
      payload: packet.slice(4),
    }
  })
}

// ── Log queries (admin — require passcode) ───────────────────────────────────

/**
 * Requests log events by ID range. Requires a 32-byte admin passcode.
 * Request payload: passcode(4×u64=32B) fromID(u64) toID(u64 inclusive) = 48 bytes.
 * Returns raw response payload(s).
 */
export async function requestLog(
  conn: NodeConnection,
  passcode: Uint8Array,
  fromId: bigint,
  toId: bigint,
  options?: { signal?: AbortSignal },
): Promise<Uint8Array[]> {
  if (passcode.length !== 32) throw new RangeError('passcode must be 32 bytes')
  const payload = new Uint8Array(48)
  payload.set(passcode, 0)
  const v = new DataView(payload.buffer)
  v.setBigUint64(32, fromId, true)
  v.setBigUint64(40, toId, true)
  return conn.request(MESSAGE_TYPE.REQUEST_LOG, payload, options)
}

/**
 * Requests log ID range for a specific transaction in a tick.
 * Request payload: passcode(32B) tick(u32) txId(u32) = 40 bytes.
 * Returns LogIdRange { fromLogId, length }.
 */
export async function requestLogIdRangeFromTx(
  conn: NodeConnection,
  passcode: Uint8Array,
  tick: number,
  txId: number,
  options?: { signal?: AbortSignal },
): Promise<LogIdRange> {
  if (passcode.length !== 32) throw new RangeError('passcode must be 32 bytes')
  const payload = new Uint8Array(40)
  payload.set(passcode, 0)
  const v = new DataView(payload.buffer)
  v.setUint32(32, tick, true)
  v.setUint32(36, txId, true)
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_LOG_ID_RANGE_FROM_TX, payload, options)
  const first = packets[0]
  if (!first || first.length < 16) throw new Error('No RESPOND_LOG_ID_RANGE_FROM_TX received')
  const rv = new DataView(first.buffer, first.byteOffset, first.byteLength)
  return {
    fromLogId: rv.getBigInt64(0, true),
    length: rv.getBigInt64(8, true),
  }
}

/**
 * Requests log ID ranges for all transactions in a tick.
 * Request payload: passcode(32B) tick(u32) = 36 bytes.
 * Returns raw response payload (pairs of fromLogId/length arrays).
 */
export async function requestAllLogIdRangesFromTick(
  conn: NodeConnection,
  passcode: Uint8Array,
  tick: number,
  options?: { signal?: AbortSignal },
): Promise<Uint8Array[]> {
  if (passcode.length !== 32) throw new RangeError('passcode must be 32 bytes')
  const payload = new Uint8Array(36)
  payload.set(passcode, 0)
  new DataView(payload.buffer).setUint32(32, tick, true)
  return conn.request(MESSAGE_TYPE.REQUEST_ALL_LOG_ID_RANGES_FROM_TX, payload, options)
}

/**
 * Requests log pruning (admin). Requires a 32-byte admin passcode.
 * Request payload: passcode(32B) fromLogId(u64) toLogId(u64) = 48 bytes.
 * Returns the success/failure response.
 */
export async function requestPruningLog(
  conn: NodeConnection,
  passcode: Uint8Array,
  fromLogId: bigint,
  toLogId: bigint,
  options?: { signal?: AbortSignal },
): Promise<bigint> {
  if (passcode.length !== 32) throw new RangeError('passcode must be 32 bytes')
  const payload = new Uint8Array(48)
  payload.set(passcode, 0)
  const v = new DataView(payload.buffer)
  v.setBigUint64(32, fromLogId, true)
  v.setBigUint64(40, toLogId, true)
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_PRUNING_LOG, payload, options)
  const first = packets[0]
  if (!first || first.length < 8) throw new Error('No RESPOND_PRUNING_LOG received')
  return new DataView(first.buffer, first.byteOffset, first.byteLength).getBigInt64(0, true)
}

/**
 * Requests the log state digest for a tick (admin). Requires a 32-byte admin passcode.
 * Request payload: passcode(32B) requestedTick(u32) = 36 bytes.
 * Returns the 32-byte digest.
 */
export async function requestLogStateDigest(
  conn: NodeConnection,
  passcode: Uint8Array,
  requestedTick: number,
  options?: { signal?: AbortSignal },
): Promise<Uint8Array> {
  if (passcode.length !== 32) throw new RangeError('passcode must be 32 bytes')
  const payload = new Uint8Array(36)
  payload.set(passcode, 0)
  new DataView(payload.buffer).setUint32(32, requestedTick, true)
  const packets = await conn.request(MESSAGE_TYPE.REQUEST_LOG_STATE_DIGEST, payload, options)
  const first = packets[0]
  if (!first || first.length < 32) throw new Error('No RESPOND_LOG_STATE_DIGEST received')
  return first.slice(0, 32)
}
