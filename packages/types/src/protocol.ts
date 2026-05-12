import type { Identity } from './brands.js'

export interface TickInfo {
  tick: number
  duration: number
  epoch: number
  initialTick: number
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
