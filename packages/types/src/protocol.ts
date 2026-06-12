import type { Identity } from './brands.js'

// ── Tick and epoch info ──────────────────────────────────────────────────────

export interface TickInfo {
  tick: number
  duration: number
  epoch: number
  initialTick: number
}

/**
 * Response to `REQUEST_CURRENT_TICK_INFO`.
 *
 * Wire layout (C++ `RespondCurrentTickInfo`):
 *   tickDuration(u16) epoch(u16) tick(u32) alignedVotes(u16)
 *   misalignedVotes(u16) initialTick(u32)
 */
export interface CurrentTickInfo {
  tickDuration: number
  epoch: number
  tick: number
  numberOfAlignedVotes: number
  numberOfMisalignedVotes: number
  initialTick: number
}

// ── Tick vote (quorum vote from a computor) ──────────────────────────────────

/**
 * A single computor tick vote.
 *
 * Wire layout (C++ `Tick`):
 *   computorIndex(u16) epoch(u16) tick(u32)
 *   ms(u16) sec(u8) min(u8) hour(u8) day(u8) month(u8) year(u8)
 *   prevResourceTestingDigest(u32) saltedResourceTestingDigest(u32)
 *   prevTransactionBodyDigest(u32) saltedTransactionBodyDigest(u32)
 *   6 × m256i digests + 2 × m256i transaction digests
 *   signature(64 bytes)
 *
 * Total: 8 + 8 + 2×4 + 2×4 + 6×32 + 2×32 + 64 = 360 bytes
 */
export interface TickVote {
  computorIndex: number
  epoch: number
  tick: number

  /** Timestamp fields from the voting computor. */
  timestamp: {
    millisecond: number
    second: number
    minute: number
    hour: number
    day: number
    month: number
    year: number
  }

  prevResourceTestingDigest: number
  saltedResourceTestingDigest: number
  prevTransactionBodyDigest: number
  saltedTransactionBodyDigest: number

  /** 32-byte digests. */
  prevSpectrumDigest: Uint8Array
  prevUniverseDigest: Uint8Array
  prevComputerDigest: Uint8Array
  saltedSpectrumDigest: Uint8Array
  saltedUniverseDigest: Uint8Array
  saltedComputerDigest: Uint8Array

  transactionDigest: Uint8Array
  expectedNextTickTransactionDigest: Uint8Array

  /** 64-byte SchnorrQ signature. */
  signature: Uint8Array
}

// ── TickData (tick proposal from a computor) ─────────────────────────────────

/**
 * Full tick data proposed by a computor for a specific tick.
 *
 * Wire layout (C++ `TickData`):
 *   computorIndex(u16) epoch(u16) tick(u32)
 *   ms(u16) sec(u8) min(u8) hour(u8) day(u8) month(u8) year(u8)
 *   timelock(m256i)
 *   transactionDigests(NUMBER_OF_TRANSACTIONS_PER_TICK × m256i)
 *   contractFees(MAX_NUMBER_OF_CONTRACTS × i64)
 *   signature(64 bytes)
 */
export interface TickData {
  computorIndex: number
  epoch: number
  tick: number

  timestamp: {
    millisecond: number
    second: number
    minute: number
    hour: number
    day: number
    month: number
    year: number
  }

  /** 32-byte timelock value. */
  timelock: Uint8Array

  /** Digests of included transactions (4096 × 32 bytes). */
  transactionDigests: Uint8Array[]

  /** Per-contract fee amounts (1024 × i64). */
  contractFees: bigint[]

  /** 64-byte SchnorrQ signature. */
  signature: Uint8Array
}

// ── Entity ───────────────────────────────────────────────────────────────────

export interface EntityRecord {
  /** 32-byte public key. */
  publicKey: Uint8Array
  incomingAmount: bigint
  outgoingAmount: bigint
  numberOfIncomingTransfers: number
  numberOfOutgoingTransfers: number
  latestIncomingTransferTick: number
  latestOutgoingTransferTick: number
}

/**
 * Response to `REQUEST_ENTITY`.
 *
 * Wire layout (C++ `RespondEntity`):
 *   entity(EntityRecord) tick(u32) spectrumIndex(i32)
 *   siblings(SPECTRUM_DEPTH × m256i)
 */
export interface RespondEntity {
  entity: EntityRecord
  tick: number
  spectrumIndex: number
  /** Merkle siblings for spectrum proof (SPECTRUM_DEPTH × 32 bytes). */
  siblings?: Uint8Array[]
}

// ── Peers ────────────────────────────────────────────────────────────────────

/**
 * IPv4 peer list exchanged between nodes.
 *
 * Wire layout (C++ `ExchangePublicPeers`):
 *   peers(NUMBER_OF_EXCHANGED_PEERS × IPv4Address)
 */
export interface ExchangePublicPeers {
  /** IPv4 addresses as dotted-quad strings. */
  peers: string[]
}

// ── Transaction ──────────────────────────────────────────────────────────────

/**
 * Core transaction header.
 *
 * Wire layout (C++ `Transaction`):
 *   sourcePublicKey(m256i) destinationPublicKey(m256i) amount(i64)
 *   tick(u32) inputType(u16) inputSize(u16)
 *   [inputSize bytes payload] [64 bytes signature]
 *
 * Total header: 32 + 32 + 8 + 4 + 2 + 2 = 80 bytes.
 */
export interface TransactionHeader {
  /** 32-byte source public key. */
  sourcePublicKey: Uint8Array
  /** 32-byte destination public key. */
  destinationPublicKey: Uint8Array
  amount: bigint
  tick: number
  inputType: number
  inputSize: number
}

// ── Computors ────────────────────────────────────────────────────────────────

/**
 * Computor list signed by the arbitrator.
 *
 * Wire layout (C++ `Computors`):
 *   epoch(u16) publicKeys(NUMBER_OF_COMPUTORS × m256i) signature(64 bytes)
 */
export interface Computors {
  epoch: number
  /** 676 × 32-byte public keys. */
  publicKeys: Uint8Array[]
  /** 64-byte signature from the arbitrator. */
  signature: Uint8Array
}

// ── Asset types ──────────────────────────────────────────────────────────────

export interface Asset {
  issuer: Identity
  /** Up to 7 characters; padded with null bytes in binary encoding. */
  name: string
  numberOfShares: bigint
  unitOfMeasurement: bigint
  numberOfDecimalPlaces: number
}

export interface AssetOrder {
  entityId: Identity
  price: bigint
  numberOfShares: bigint
}

/**
 * Simplified computor list for higher-level consumers.
 */
export interface ComputorList {
  epoch: number
  identities: Identity[]
}

// ── System info ──────────────────────────────────────────────────────────────

/**
 * Response to `REQUEST_SYSTEM_INFO`.
 *
 * Wire layout (C++ `RespondSystemInfo`): 128 bytes total.
 */
export interface SystemInfo {
  version: number
  epoch: number
  tick: number
  initialTick: number
  latestCreatedTick: number

  initialTimestamp: {
    millisecond: number
    second: number
    minute: number
    hour: number
    day: number
    month: number
    year: number
  }

  numberOfEntities: number
  numberOfTransactions: number

  /** 32-byte random mining seed. */
  randomMiningSeed: Uint8Array
  solutionThreshold: number

  totalSpectrumAmount: bigint
  currentEntityBalanceDustThreshold: bigint
}

// ── Request/response header ──────────────────────────────────────────────────

/**
 * Network message header.
 *
 * Wire layout (C++ `RequestResponseHeader`):
 *   size(3 bytes LE) type(u8) dejavu(u32) = 8 bytes total.
 */
export interface RequestResponseHeader {
  /** Payload size including this header. Encoded in 24 bits. */
  size: number
  /** Message type byte (see `MESSAGE_TYPE`). */
  type: number
  /** Dejavu field for peer-to-peer message deduplication. */
  dejavu: number
}

// ── Contract IPO ─────────────────────────────────────────────────────────────

/**
 * Response to `REQUEST_CONTRACT_IPO`.
 */
export interface ContractIPO {
  contractIndex: number
  tick: number
  /** 676 public keys (32 bytes each). */
  publicKeys: Uint8Array[]
  /** 676 bid prices. */
  prices: bigint[]
}

// ── Quorum tick request ──────────────────────────────────────────────────────

/**
 * Request payload for `REQUEST_QUORUM_TICK`.
 */
export interface RequestedQuorumTick {
  tick: number
  /** Bitfield of which computor votes are requested. */
  voteFlags: Uint8Array
}
