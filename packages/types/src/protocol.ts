import type { Identity } from './brands.js'

export interface TickInfo {
  tick: number
  duration: number
  epoch: number
  initialTick: number
}

export interface CurrentTickInfo {
  tickDuration: number
  epoch: number
  tick: number
  numberOfAlignedVotes: number
  numberOfMisalignedVotes: number
  initialTick: number
}

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

export interface RespondEntity {
  entity: EntityRecord
  tick: number
  spectrumIndex: number
}

export interface ExchangePublicPeers {
  peers: string[]
}

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

export interface ComputorList {
  epoch: number
  identities: Identity[]
}
