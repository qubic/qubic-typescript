export const LOG_TYPE = {
  QU_TRANSFER: 0,
  ASSET_ISSUANCE: 1,
  ASSET_OWNERSHIP_CHANGE: 2,
  ASSET_POSSESSION_CHANGE: 3,
  CONTRACT_ERROR_MESSAGE: 4,
  CONTRACT_WARNING_MESSAGE: 5,
  CONTRACT_INFORMATION_MESSAGE: 6,
  CONTRACT_DEBUG_MESSAGE: 7,
  BURNING: 8,
  DUST_BURNING: 9,
  SPECTRUM_STATS: 10,
  ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE: 11,
  ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE: 12,
  CONTRACT_RESERVE_DEDUCTION: 13,
  ORACLE_QUERY_STATUS_CHANGE: 14,
  ORACLE_SUBSCRIBER_LOG_MESSAGE: 15,
  CUSTOM_MESSAGE: 255,
} as const satisfies Record<string, number>

export type LogType = (typeof LOG_TYPE)[keyof typeof LOG_TYPE]

export const CONTRACT_INDEX = {
  QX: 1,
  QUOTTERY: 2,
  RANDOM: 3,
  QUTIL: 4,
  MY_LAST_MATCH: 5,
  GENERAL_QUORUM_PROPOSAL: 6,
  SUPPLY_WATCHER: 7,
  COMPUTOR_CONTROLLED_FUND: 8,
  QEARN: 9,
  QVAULT: 10,
  MS_VAULT: 11,
  QBAY: 12,
  QSWAP: 13,
  NOSTROMO: 14,
  QDRAW: 15,
  RANDOM_LOTTERY: 16,
  QBOND: 17,
  QIP: 18,
  QRAFFLE: 19,
  QRWA: 20,
  QRESERVE_POOL: 21,
  QTHIRTYFOUR: 22,
  QDUEL: 23,
  PULSE: 24,
  VOTTUN_BRIDGE: 25,
  QUSINO: 26,
  ESCROW: 27,
  GGWP: 28,
} as const satisfies Record<string, number>

export type ContractIndex = (typeof CONTRACT_INDEX)[keyof typeof CONTRACT_INDEX]

export const PROTOCOL = {
  MAX_INPUT_SIZE: 1024,
  TX_HEADER_SIZE: 80,
  SIGNATURE_SIZE: 64,
  PUBLIC_KEY_SIZE: 32,
  IDENTITY_LENGTH: 60,
  SEED_LENGTH: 55,
  TX_HASH_LENGTH: 60,

  /** Total number of computors in the network. */
  NUMBER_OF_COMPUTORS: 676,
  /** Quorum threshold: 2/3 + 1 of computors. */
  QUORUM: 451,
  /** Max transactions per tick (must be 2^N). */
  NUMBER_OF_TRANSACTIONS_PER_TICK: 4096,
  /** Max number of smart contracts. */
  MAX_NUMBER_OF_CONTRACTS: 1024,
  /** Number of peers exchanged in EXCHANGE_PUBLIC_PEERS. */
  NUMBER_OF_EXCHANGED_PEERS: 4,
  /** Request/response header size in bytes. */
  HEADER_SIZE: 8,
  /** Spectrum Merkle tree depth. */
  SPECTRUM_DEPTH: 24,
  /** Assets Merkle tree depth. */
  ASSETS_DEPTH: 24,
  /** Max message size including header (24-bit size field). */
  MAX_MESSAGE_SIZE: 16_777_215,
  /** Spectrum capacity: 2^SPECTRUM_DEPTH. */
  SPECTRUM_CAPACITY: 16_777_216,
  /** Assets capacity: 2^ASSETS_DEPTH. */
  ASSETS_CAPACITY: 16_777_216,
} as const satisfies Record<string, number>
