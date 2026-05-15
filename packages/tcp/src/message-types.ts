/** All known Qubic native TCP message types, sourced from network_message_type.h. */
export const MESSAGE_TYPE = {
  EXCHANGE_PUBLIC_PEERS: 0,
  BROADCAST_MESSAGE: 1,
  BROADCAST_COMPUTORS: 2,
  BROADCAST_TICK: 3,
  BROADCAST_FUTURE_TICK_DATA: 8,
  REQUEST_COMPUTORS: 11,
  REQUEST_QUORUM_TICK: 14,
  REQUEST_TICK_DATA: 16,
  BROADCAST_TRANSACTION: 24,
  REQUEST_TRANSACTION_INFO: 26,
  REQUEST_CURRENT_TICK_INFO: 27,
  RESPOND_CURRENT_TICK_INFO: 28,
  REQUEST_TICK_TRANSACTIONS: 29,
  REQUEST_ENTITY: 31,
  RESPOND_ENTITY: 32,
  REQUEST_CONTRACT_IPO: 33,
  RESPOND_CONTRACT_IPO: 34,
  END_RESPONSE: 35,
  REQUEST_ISSUED_ASSETS: 36,
  RESPOND_ISSUED_ASSETS: 37,
  REQUEST_OWNED_ASSETS: 38,
  RESPOND_OWNED_ASSETS: 39,
  REQUEST_POSSESSED_ASSETS: 40,
  RESPOND_POSSESSED_ASSETS: 41,
  REQUEST_CONTRACT_FUNCTION: 42,
  RESPOND_CONTRACT_FUNCTION: 43,
  REQUEST_LOG: 44,
  RESPOND_LOG: 45,
  REQUEST_SYSTEM_INFO: 46,
  RESPOND_SYSTEM_INFO: 47,
  REQUEST_ASSETS: 52,
  RESPOND_ASSETS: 53,
  TRY_AGAIN: 54,
  REQUEST_ACTIVE_IPOS: 64,
  RESPOND_ACTIVE_IPO: 65,
} as const satisfies Record<string, number>

export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE]

/** Default Qubic node port. */
export const DEFAULT_PORT = 21841

// ── Decoded struct types ──────────────────────────────────────────────────────

/** RESPOND_CURRENT_TICK_INFO (16 bytes). */
export interface CurrentTickInfo {
  tickDuration: number
  epoch: number
  tick: number
  numberOfAlignedVotes: number
  numberOfMisalignedVotes: number
  initialTick: number
}

/** Core EntityRecord (64 bytes). */
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

/** RESPOND_ENTITY payload (840 bytes: EntityRecord + tick + spectrumIndex + 24 siblings). */
export interface RespondEntity {
  entity: EntityRecord
  tick: number
  spectrumIndex: number
}

/** EXCHANGE_PUBLIC_PEERS (16 bytes: 4 × IPv4). */
export interface ExchangePublicPeers {
  peers: string[]
}
