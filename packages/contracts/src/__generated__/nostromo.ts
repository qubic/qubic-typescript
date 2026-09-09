// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '@qubic.org/types'

export const NOSTROMO_CONTRACT_INDEX = 14

export interface NostromoAuctionAssetEntryStruct {
  asset: NostromoAssetStruct
  quantity: bigint
}

export interface NostromoAssetStruct {
  issuer: string
  assetName: bigint
}

export interface NostromoAuctionViewStruct {
  core: NostromoAuctionCoreStruct
  allowedBidderWallets: string[]
  requiredAccessAssets: number[]
  requiredAccessAssetCount: bigint
  allowedBidderWalletCount: bigint
}

export interface NostromoAuctionParticipantDataStruct {
  auctionIndex: bigint
  bidIndex: bigint
  escrowedAmount: bigint
  requestedQuantity: bigint
  allocatedQuantity: bigint
  bidAmount: bigint
  participant: string
  lastBidTime: NostromoDateAndTimeStruct
  isUsed: number
  isActive: number
  isWinningBid: number
}

export interface NostromoNostromoFeePoolStruct {
  shareholderDividendTier1Amount: bigint
  shareholderDividendTier2Amount: bigint
  shareholderDividendTier3Amount: bigint
  shareholderDividendTier4Amount: bigint
  commonServiceFeeAmount: bigint
  shareholderDividendAmount: bigint
  managementAmount: bigint
  developmentAmount: bigint
  takeoverCoordinatorAmount: bigint
}

export interface NostromoDateAndTimeStruct {
  value: bigint
}

export interface NostromoContractStatsStruct {
  totalAuctionsCreated: bigint
  activeAuctionCount: bigint
  pendingSellerDecisionAuctionCount: bigint
  finalizedAuctionCount: bigint
  cancelledAuctionCount: bigint
  participantCount: bigint
  closedAuctionHistoryCounter: bigint
  auctionShareholderDividendPool: bigint
  pendingServiceFeePool: bigint
  totalPendingQuPayouts: bigint
  retainedClosedAuctionCount: bigint
  retainedParticipantHistoryCount: bigint
  qxTransferFee: number
  routeAllFeesToDevelopment: number
  isAuctionTimerPaused: number
  isPostBeginEpochPauseArmed: number
  isEmergencyPaused: number
}

export interface NostromoAuctionSummaryStruct {
  metadataIpfsCid: number[]
  seller: string
  highestBidder: string
  createdAt: NostromoDateAndTimeStruct
  settledAt: NostromoDateAndTimeStruct
  auctionIndex: bigint
  quantityForSale: bigint
  allocatedQuantity: bigint
  initialPrice: bigint
  salePrice: bigint
  buyNowPrice: bigint
  highestBidPrice: bigint
  highestBidQuantity: bigint
  highestBidAmount: bigint
  type: number
  visibility: number
  status: number
}

export interface NostromoParticipantSummaryStruct {
  participant: string
  lastBidTime: NostromoDateAndTimeStruct
  bidAmount: bigint
  escrowedAmount: bigint
  requestedQuantity: bigint
  allocatedQuantity: bigint
  isWinningBid: number
}

export interface NostromoUserParticipationSummaryStruct {
  participant: string
  lastBidTime: NostromoDateAndTimeStruct
  auctionIndex: bigint
  bidAmount: bigint
  escrowedAmount: bigint
  requestedQuantity: bigint
  allocatedQuantity: bigint
  isWinningBid: number
}

export interface NostromoAuctionCoreStruct {
  auctionLotItems: number[]
  metadataIpfsCid: number[]
  seller: string
  highestBidder: string
  createdAt: NostromoDateAndTimeStruct
  lastBidAt: NostromoDateAndTimeStruct
  sellerDecisionDeadline: NostromoDateAndTimeStruct
  settledAt: NostromoDateAndTimeStruct
  quantityForSale: bigint
  allocatedQuantity: bigint
  minimumPurchaseQuantity: bigint
  initialPrice: bigint
  salePrice: bigint
  minimumBidIncrement: bigint
  buyNowPrice: bigint
  highestBidPrice: bigint
  highestBidQuantity: bigint
  highestBidAmount: bigint
  auctionDurationSeconds: bigint
  auctionIndex: bigint
  nextBidIndex: bigint
  highestBidSlotIndex: bigint
}

const STRUCTS: Record<string, NamedStruct> = {
  'AuctionAssetEntry': {
  name: 'AuctionAssetEntry',
  byteLength: 48,
  fields: [
    {
      name: 'asset',
      type: 'struct',
      offset: 0,
      byteLength: 40,
      structRef: 'Asset',
    },
    {
      name: 'quantity',
      type: 'sint64',
      offset: 40,
      byteLength: 8,
    },
],
},
  'Asset': {
  name: 'Asset',
  byteLength: 40,
  fields: [
    {
      name: 'issuer',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'assetName',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
],
},
  'AuctionView': {
  name: 'AuctionView',
  byteLength: 1184,
  fields: [
    {
      name: 'core',
      type: 'struct',
      offset: 0,
      byteLength: 464,
      structRef: 'AuctionCore',
    },
    {
      name: 'allowedBidderWallets',
      type: 'array',
      offset: 464,
      byteLength: 512,
      arrayLength: 16,
      arrayItemType: 'id',
      arrayItemByteLength: 32,
    },
    {
      name: 'requiredAccessAssets',
      type: 'array',
      offset: 976,
      byteLength: 192,
      arrayLength: 4,
      arrayItemByteLength: 48,
      arrayItemStructRef: 'AuctionAssetEntry',
    },
    {
      name: 'requiredAccessAssetCount',
      type: 'uint64',
      offset: 1168,
      byteLength: 8,
    },
    {
      name: 'allowedBidderWalletCount',
      type: 'uint64',
      offset: 1176,
      byteLength: 8,
    },
],
},
  'AuctionParticipantData': {
  name: 'AuctionParticipantData',
  byteLength: 91,
  fields: [
    {
      name: 'auctionIndex',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'bidIndex',
      type: 'uint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'escrowedAmount',
      type: 'uint64',
      offset: 16,
      byteLength: 8,
    },
    {
      name: 'requestedQuantity',
      type: 'uint64',
      offset: 24,
      byteLength: 8,
    },
    {
      name: 'allocatedQuantity',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'bidAmount',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'participant',
      type: 'id',
      offset: 48,
      byteLength: 32,
    },
    {
      name: 'lastBidTime',
      type: 'struct',
      offset: 80,
      byteLength: 8,
      structRef: 'DateAndTime',
    },
    {
      name: 'isUsed',
      type: 'uint8',
      offset: 88,
      byteLength: 1,
    },
    {
      name: 'isActive',
      type: 'uint8',
      offset: 89,
      byteLength: 1,
    },
    {
      name: 'isWinningBid',
      type: 'uint8',
      offset: 90,
      byteLength: 1,
    },
],
},
  'NostromoFeePool': {
  name: 'NostromoFeePool',
  byteLength: 72,
  fields: [
    {
      name: 'shareholderDividendTier1Amount',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'shareholderDividendTier2Amount',
      type: 'uint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'shareholderDividendTier3Amount',
      type: 'uint64',
      offset: 16,
      byteLength: 8,
    },
    {
      name: 'shareholderDividendTier4Amount',
      type: 'uint64',
      offset: 24,
      byteLength: 8,
    },
    {
      name: 'commonServiceFeeAmount',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'shareholderDividendAmount',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'managementAmount',
      type: 'uint64',
      offset: 48,
      byteLength: 8,
    },
    {
      name: 'developmentAmount',
      type: 'uint64',
      offset: 56,
      byteLength: 8,
    },
    {
      name: 'takeoverCoordinatorAmount',
      type: 'uint64',
      offset: 64,
      byteLength: 8,
    },
],
},
  'DateAndTime': {
  name: 'DateAndTime',
  byteLength: 8,
  fields: [
    {
      name: 'value',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
],
},
  'ContractStats': {
  name: 'ContractStats',
  byteLength: 104,
  fields: [
    {
      name: 'totalAuctionsCreated',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'activeAuctionCount',
      type: 'uint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'pendingSellerDecisionAuctionCount',
      type: 'uint64',
      offset: 16,
      byteLength: 8,
    },
    {
      name: 'finalizedAuctionCount',
      type: 'uint64',
      offset: 24,
      byteLength: 8,
    },
    {
      name: 'cancelledAuctionCount',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'participantCount',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'closedAuctionHistoryCounter',
      type: 'uint64',
      offset: 48,
      byteLength: 8,
    },
    {
      name: 'auctionShareholderDividendPool',
      type: 'uint64',
      offset: 56,
      byteLength: 8,
    },
    {
      name: 'pendingServiceFeePool',
      type: 'uint64',
      offset: 64,
      byteLength: 8,
    },
    {
      name: 'totalPendingQuPayouts',
      type: 'uint64',
      offset: 72,
      byteLength: 8,
    },
    {
      name: 'retainedClosedAuctionCount',
      type: 'uint64',
      offset: 80,
      byteLength: 8,
    },
    {
      name: 'retainedParticipantHistoryCount',
      type: 'uint64',
      offset: 88,
      byteLength: 8,
    },
    {
      name: 'qxTransferFee',
      type: 'uint32',
      offset: 96,
      byteLength: 4,
    },
    {
      name: 'routeAllFeesToDevelopment',
      type: 'uint8',
      offset: 100,
      byteLength: 1,
    },
    {
      name: 'isAuctionTimerPaused',
      type: 'uint8',
      offset: 101,
      byteLength: 1,
    },
    {
      name: 'isPostBeginEpochPauseArmed',
      type: 'uint8',
      offset: 102,
      byteLength: 1,
    },
    {
      name: 'isEmergencyPaused',
      type: 'uint8',
      offset: 103,
      byteLength: 1,
    },
],
},
  'AuctionSummary': {
  name: 'AuctionSummary',
  byteLength: 219,
  fields: [
    {
      name: 'metadataIpfsCid',
      type: 'array',
      offset: 0,
      byteLength: 64,
      arrayLength: 64,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'seller',
      type: 'id',
      offset: 64,
      byteLength: 32,
    },
    {
      name: 'highestBidder',
      type: 'id',
      offset: 96,
      byteLength: 32,
    },
    {
      name: 'createdAt',
      type: 'struct',
      offset: 128,
      byteLength: 8,
      structRef: 'DateAndTime',
    },
    {
      name: 'settledAt',
      type: 'struct',
      offset: 136,
      byteLength: 8,
      structRef: 'DateAndTime',
    },
    {
      name: 'auctionIndex',
      type: 'uint64',
      offset: 144,
      byteLength: 8,
    },
    {
      name: 'quantityForSale',
      type: 'uint64',
      offset: 152,
      byteLength: 8,
    },
    {
      name: 'allocatedQuantity',
      type: 'uint64',
      offset: 160,
      byteLength: 8,
    },
    {
      name: 'initialPrice',
      type: 'uint64',
      offset: 168,
      byteLength: 8,
    },
    {
      name: 'salePrice',
      type: 'uint64',
      offset: 176,
      byteLength: 8,
    },
    {
      name: 'buyNowPrice',
      type: 'uint64',
      offset: 184,
      byteLength: 8,
    },
    {
      name: 'highestBidPrice',
      type: 'uint64',
      offset: 192,
      byteLength: 8,
    },
    {
      name: 'highestBidQuantity',
      type: 'uint64',
      offset: 200,
      byteLength: 8,
    },
    {
      name: 'highestBidAmount',
      type: 'uint64',
      offset: 208,
      byteLength: 8,
    },
    {
      name: 'type',
      type: 'uint8',
      offset: 216,
      byteLength: 1,
    },
    {
      name: 'visibility',
      type: 'uint8',
      offset: 217,
      byteLength: 1,
    },
    {
      name: 'status',
      type: 'uint8',
      offset: 218,
      byteLength: 1,
    },
],
},
  'ParticipantSummary': {
  name: 'ParticipantSummary',
  byteLength: 73,
  fields: [
    {
      name: 'participant',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'lastBidTime',
      type: 'struct',
      offset: 32,
      byteLength: 8,
      structRef: 'DateAndTime',
    },
    {
      name: 'bidAmount',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'escrowedAmount',
      type: 'uint64',
      offset: 48,
      byteLength: 8,
    },
    {
      name: 'requestedQuantity',
      type: 'uint64',
      offset: 56,
      byteLength: 8,
    },
    {
      name: 'allocatedQuantity',
      type: 'uint64',
      offset: 64,
      byteLength: 8,
    },
    {
      name: 'isWinningBid',
      type: 'uint8',
      offset: 72,
      byteLength: 1,
    },
],
},
  'UserParticipationSummary': {
  name: 'UserParticipationSummary',
  byteLength: 81,
  fields: [
    {
      name: 'participant',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'lastBidTime',
      type: 'struct',
      offset: 32,
      byteLength: 8,
      structRef: 'DateAndTime',
    },
    {
      name: 'auctionIndex',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'bidAmount',
      type: 'uint64',
      offset: 48,
      byteLength: 8,
    },
    {
      name: 'escrowedAmount',
      type: 'uint64',
      offset: 56,
      byteLength: 8,
    },
    {
      name: 'requestedQuantity',
      type: 'uint64',
      offset: 64,
      byteLength: 8,
    },
    {
      name: 'allocatedQuantity',
      type: 'uint64',
      offset: 72,
      byteLength: 8,
    },
    {
      name: 'isWinningBid',
      type: 'uint8',
      offset: 80,
      byteLength: 1,
    },
],
},
  'AuctionCore': {
  name: 'AuctionCore',
  byteLength: 464,
  fields: [
    {
      name: 'auctionLotItems',
      type: 'array',
      offset: 0,
      byteLength: 192,
      arrayLength: 4,
      arrayItemByteLength: 48,
      arrayItemStructRef: 'AuctionAssetEntry',
    },
    {
      name: 'metadataIpfsCid',
      type: 'array',
      offset: 192,
      byteLength: 64,
      arrayLength: 64,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'seller',
      type: 'id',
      offset: 256,
      byteLength: 32,
    },
    {
      name: 'highestBidder',
      type: 'id',
      offset: 288,
      byteLength: 32,
    },
    {
      name: 'createdAt',
      type: 'struct',
      offset: 320,
      byteLength: 8,
      structRef: 'DateAndTime',
    },
    {
      name: 'lastBidAt',
      type: 'struct',
      offset: 328,
      byteLength: 8,
      structRef: 'DateAndTime',
    },
    {
      name: 'sellerDecisionDeadline',
      type: 'struct',
      offset: 336,
      byteLength: 8,
      structRef: 'DateAndTime',
    },
    {
      name: 'settledAt',
      type: 'struct',
      offset: 344,
      byteLength: 8,
      structRef: 'DateAndTime',
    },
    {
      name: 'quantityForSale',
      type: 'uint64',
      offset: 352,
      byteLength: 8,
    },
    {
      name: 'allocatedQuantity',
      type: 'uint64',
      offset: 360,
      byteLength: 8,
    },
    {
      name: 'minimumPurchaseQuantity',
      type: 'uint64',
      offset: 368,
      byteLength: 8,
    },
    {
      name: 'initialPrice',
      type: 'uint64',
      offset: 376,
      byteLength: 8,
    },
    {
      name: 'salePrice',
      type: 'uint64',
      offset: 384,
      byteLength: 8,
    },
    {
      name: 'minimumBidIncrement',
      type: 'uint64',
      offset: 392,
      byteLength: 8,
    },
    {
      name: 'buyNowPrice',
      type: 'uint64',
      offset: 400,
      byteLength: 8,
    },
    {
      name: 'highestBidPrice',
      type: 'uint64',
      offset: 408,
      byteLength: 8,
    },
    {
      name: 'highestBidQuantity',
      type: 'uint64',
      offset: 416,
      byteLength: 8,
    },
    {
      name: 'highestBidAmount',
      type: 'uint64',
      offset: 424,
      byteLength: 8,
    },
    {
      name: 'auctionDurationSeconds',
      type: 'uint64',
      offset: 432,
      byteLength: 8,
    },
    {
      name: 'auctionIndex',
      type: 'uint64',
      offset: 440,
      byteLength: 8,
    },
    {
      name: 'nextBidIndex',
      type: 'uint64',
      offset: 448,
      byteLength: 8,
    },
    {
      name: 'highestBidSlotIndex',
      type: 'uint64',
      offset: 456,
      byteLength: 8,
    },
],
},
}

export const NOSTROMO_CREATE_AUCTION_INPUT_TYPE = 0

export interface NostromoCreateAuctionInput {
  metadataIpfsCid: number[]
  auctionLotItems: number[]
  requiredAccessAssets: number[]
  allowedBidderWallets: string[]
  minimumPurchaseQuantity: bigint
  initialPrice: bigint
  salePrice: bigint
  minimumBidIncrement: bigint
  buyNowPrice: bigint
  durationDays: number
  auctionType: number
  auctionVisibility: number
}

const NOSTROMO_CREATE_AUCTION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'metadataIpfsCid',
    type: 'array',
    offset: 0,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'auctionLotItems',
    type: 'array',
    offset: 64,
    byteLength: 192,
    arrayLength: 4,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'AuctionAssetEntry',
  },
  {
    name: 'requiredAccessAssets',
    type: 'array',
    offset: 256,
    byteLength: 192,
    arrayLength: 4,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'AuctionAssetEntry',
  },
  {
    name: 'allowedBidderWallets',
    type: 'array',
    offset: 448,
    byteLength: 512,
    arrayLength: 16,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
  {
    name: 'minimumPurchaseQuantity',
    type: 'uint64',
    offset: 960,
    byteLength: 8,
  },
  {
    name: 'initialPrice',
    type: 'uint64',
    offset: 968,
    byteLength: 8,
  },
  {
    name: 'salePrice',
    type: 'uint64',
    offset: 976,
    byteLength: 8,
  },
  {
    name: 'minimumBidIncrement',
    type: 'uint64',
    offset: 984,
    byteLength: 8,
  },
  {
    name: 'buyNowPrice',
    type: 'uint64',
    offset: 992,
    byteLength: 8,
  },
  {
    name: 'durationDays',
    type: 'uint32',
    offset: 1000,
    byteLength: 4,
  },
  {
    name: 'auctionType',
    type: 'uint8',
    offset: 1004,
    byteLength: 1,
  },
  {
    name: 'auctionVisibility',
    type: 'uint8',
    offset: 1005,
    byteLength: 1,
  },
]

export function buildNostromoCreateAuctionInput(
  input: NostromoCreateAuctionInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: NOSTROMO_CONTRACT_INDEX, inputType: NOSTROMO_CREATE_AUCTION_INPUT_TYPE, payload: buildPayload(NOSTROMO_CREATE_AUCTION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface NostromoCreateAuctionOutput {
  auctionIndex: bigint
}

const NOSTROMO_CREATE_AUCTION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeNostromoCreateAuctionOutput(
  data: Uint8Array,
): NostromoCreateAuctionOutput {
  return decodePayload(data, NOSTROMO_CREATE_AUCTION_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoCreateAuctionOutput
}

export const NOSTROMO_PLACE_BID_INPUT_TYPE = 0

export interface NostromoPlaceBidInput {
  auctionIndex: bigint
  quantity: bigint
  bidAmount: bigint
}

const NOSTROMO_PLACE_BID_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'quantity',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'bidAmount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
]

export function buildNostromoPlaceBidInput(
  input: NostromoPlaceBidInput,
): ContractCall {
  return { contractIndex: NOSTROMO_CONTRACT_INDEX, inputType: NOSTROMO_PLACE_BID_INPUT_TYPE, payload: buildPayload(NOSTROMO_PLACE_BID_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface NostromoPlaceBidOutput {
  escrowedAmount: bigint
  refundedAmount: bigint
}

const NOSTROMO_PLACE_BID_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'escrowedAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'refundedAmount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function decodeNostromoPlaceBidOutput(
  data: Uint8Array,
): NostromoPlaceBidOutput {
  return decodePayload(data, NOSTROMO_PLACE_BID_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoPlaceBidOutput
}

export const NOSTROMO_CANCEL_AUCTION_INPUT_TYPE = 0

export interface NostromoCancelAuctionInput {
  auctionIndex: bigint
}

const NOSTROMO_CANCEL_AUCTION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildNostromoCancelAuctionInput(
  input: NostromoCancelAuctionInput,
): ContractCall {
  return { contractIndex: NOSTROMO_CONTRACT_INDEX, inputType: NOSTROMO_CANCEL_AUCTION_INPUT_TYPE, payload: buildPayload(NOSTROMO_CANCEL_AUCTION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface NostromoCancelAuctionOutput {
  refundedAmount: bigint
  cancellationFee: bigint
}

const NOSTROMO_CANCEL_AUCTION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'refundedAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'cancellationFee',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function decodeNostromoCancelAuctionOutput(
  data: Uint8Array,
): NostromoCancelAuctionOutput {
  return decodePayload(data, NOSTROMO_CANCEL_AUCTION_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoCancelAuctionOutput
}

export const NOSTROMO_RESOLVE_PENDING_STANDARD_AUCTION_INPUT_TYPE = 0

export interface NostromoResolvePendingStandardAuctionInput {
  auctionIndex: bigint
  acceptSale: number
}

const NOSTROMO_RESOLVE_PENDING_STANDARD_AUCTION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'acceptSale',
    type: 'uint8',
    offset: 8,
    byteLength: 1,
  },
]

export function buildNostromoResolvePendingStandardAuctionInput(
  input: NostromoResolvePendingStandardAuctionInput,
): ContractCall {
  return { contractIndex: NOSTROMO_CONTRACT_INDEX, inputType: NOSTROMO_RESOLVE_PENDING_STANDARD_AUCTION_INPUT_TYPE, payload: buildPayload(NOSTROMO_RESOLVE_PENDING_STANDARD_AUCTION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface NostromoResolvePendingStandardAuctionOutput {
  refundedAmount: bigint
}

const NOSTROMO_RESOLVE_PENDING_STANDARD_AUCTION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'refundedAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeNostromoResolvePendingStandardAuctionOutput(
  data: Uint8Array,
): NostromoResolvePendingStandardAuctionOutput {
  return decodePayload(data, NOSTROMO_RESOLVE_PENDING_STANDARD_AUCTION_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoResolvePendingStandardAuctionOutput
}

export const NOSTROMO_SET_AUCTION_FEES_INPUT_TYPE = 0

export interface NostromoSetAuctionFeesInput {
  privateAuctionFee: bigint
  publicAuctionCreationFee: bigint
  auctionCancellationFeeBasisPoints: bigint
  managementFeeBasisPoints: bigint
  developmentFeeBasisPoints: bigint
  takeoverCoordinatorFeeBasisPoints: bigint
  shareholderDividendBasisPoints: bigint
  shareholderFeeBasisPointsTier1: bigint
  shareholderFeeBasisPointsTier2: bigint
  shareholderFeeBasisPointsTier3: bigint
  shareholderFeeBasisPointsTier4: bigint
}

const NOSTROMO_SET_AUCTION_FEES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'privateAuctionFee',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'publicAuctionCreationFee',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'auctionCancellationFeeBasisPoints',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'managementFeeBasisPoints',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'developmentFeeBasisPoints',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'takeoverCoordinatorFeeBasisPoints',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'shareholderDividendBasisPoints',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier1',
    type: 'uint64',
    offset: 56,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier2',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier3',
    type: 'uint64',
    offset: 72,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier4',
    type: 'uint64',
    offset: 80,
    byteLength: 8,
  },
]

export function buildNostromoSetAuctionFeesInput(
  input: NostromoSetAuctionFeesInput,
): ContractCall {
  return { contractIndex: NOSTROMO_CONTRACT_INDEX, inputType: NOSTROMO_SET_AUCTION_FEES_INPUT_TYPE, payload: buildPayload(NOSTROMO_SET_AUCTION_FEES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const NOSTROMO_SET_AUCTION_FEES_BY_MANAGEMENT_INPUT_TYPE = 0

export interface NostromoSetAuctionFeesByManagementInput {
  privateAuctionFee: bigint
  publicAuctionCreationFee: bigint
  auctionCancellationFeeBasisPoints: bigint
  managementFeeBasisPoints: bigint
  developmentFeeBasisPoints: bigint
  shareholderFeeBasisPointsTier1: bigint
  shareholderFeeBasisPointsTier2: bigint
  shareholderFeeBasisPointsTier3: bigint
  shareholderFeeBasisPointsTier4: bigint
}

const NOSTROMO_SET_AUCTION_FEES_BY_MANAGEMENT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'privateAuctionFee',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'publicAuctionCreationFee',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'auctionCancellationFeeBasisPoints',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'managementFeeBasisPoints',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'developmentFeeBasisPoints',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier1',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier2',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier3',
    type: 'uint64',
    offset: 56,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier4',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
]

export function buildNostromoSetAuctionFeesByManagementInput(
  input: NostromoSetAuctionFeesByManagementInput,
): ContractCall {
  return { contractIndex: NOSTROMO_CONTRACT_INDEX, inputType: NOSTROMO_SET_AUCTION_FEES_BY_MANAGEMENT_INPUT_TYPE, payload: buildPayload(NOSTROMO_SET_AUCTION_FEES_BY_MANAGEMENT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const NOSTROMO_SET_MANAGEMENT_INPUT_TYPE = 0

export interface NostromoSetManagementInput {
  management: string
}

const NOSTROMO_SET_MANAGEMENT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'management',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildNostromoSetManagementInput(
  input: NostromoSetManagementInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: NOSTROMO_CONTRACT_INDEX, inputType: NOSTROMO_SET_MANAGEMENT_INPUT_TYPE, payload: buildPayload(NOSTROMO_SET_MANAGEMENT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export const NOSTROMO_SET_FEE_RESERVE_GUARD_CONFIG_INPUT_TYPE = 0

export interface NostromoSetFeeReserveGuardConfigInput {
  dropBasisPoints: bigint
  windowSeconds: bigint
}

const NOSTROMO_SET_FEE_RESERVE_GUARD_CONFIG_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'dropBasisPoints',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'windowSeconds',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildNostromoSetFeeReserveGuardConfigInput(
  input: NostromoSetFeeReserveGuardConfigInput,
): ContractCall {
  return { contractIndex: NOSTROMO_CONTRACT_INDEX, inputType: NOSTROMO_SET_FEE_RESERVE_GUARD_CONFIG_INPUT_TYPE, payload: buildPayload(NOSTROMO_SET_FEE_RESERVE_GUARD_CONFIG_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const NOSTROMO_SET_EMERGENCY_PAUSE_INPUT_TYPE = 0

export interface NostromoSetEmergencyPauseInput {
  paused: number
}

const NOSTROMO_SET_EMERGENCY_PAUSE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'paused',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildNostromoSetEmergencyPauseInput(
  input: NostromoSetEmergencyPauseInput,
): ContractCall {
  return { contractIndex: NOSTROMO_CONTRACT_INDEX, inputType: NOSTROMO_SET_EMERGENCY_PAUSE_INPUT_TYPE, payload: buildPayload(NOSTROMO_SET_EMERGENCY_PAUSE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export const NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 0

export interface NostromoTransferShareManagementRightsInput {
  asset: NostromoAssetStruct
  numberOfShares: bigint
  newManagingContractIndex: number
}

const NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'asset',
    type: 'struct',
    offset: 0,
    byteLength: 40,
    structRef: 'Asset',
  },
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'newManagingContractIndex',
    type: 'uint32',
    offset: 48,
    byteLength: 4,
  },
]

export function buildNostromoTransferShareManagementRightsInput(
  input: NostromoTransferShareManagementRightsInput,
): ContractCall {
  return { contractIndex: NOSTROMO_CONTRACT_INDEX, inputType: NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE, payload: buildPayload(NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface NostromoTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
}

const NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeNostromoTransferShareManagementRightsOutput(
  data: Uint8Array,
): NostromoTransferShareManagementRightsOutput {
  return decodePayload(data, NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoTransferShareManagementRightsOutput
}

export const NOSTROMO_GET_AUCTION_BY_INDEX_INPUT_TYPE = 0
export const NOSTROMO_GET_AUCTION_BY_INDEX_INPUT_SIZE = 8

export interface NostromoGetAuctionByIndexInput {
  auctionIndex: bigint
}

const NOSTROMO_GET_AUCTION_BY_INDEX_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildNostromoGetAuctionByIndexInput(
  input: NostromoGetAuctionByIndexInput,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_AUCTION_BY_INDEX_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface NostromoGetAuctionByIndexOutput {
  auction: NostromoAuctionViewStruct
  found: number
}

const NOSTROMO_GET_AUCTION_BY_INDEX_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'auction',
    type: 'struct',
    offset: 0,
    byteLength: 1184,
    structRef: 'AuctionView',
  },
  {
    name: 'found',
    type: 'uint8',
    offset: 1184,
    byteLength: 1,
  },
]

export function decodeNostromoGetAuctionByIndexOutput(
  data: Uint8Array,
): NostromoGetAuctionByIndexOutput {
  return decodePayload(data, NOSTROMO_GET_AUCTION_BY_INDEX_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetAuctionByIndexOutput
}

export async function nostromoGetAuctionByIndex(
  live: SmartContractCaller,
  input: NostromoGetAuctionByIndexInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetAuctionByIndexOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_AUCTION_BY_INDEX_INPUT_TYPE,
    inputSize: NOSTROMO_GET_AUCTION_BY_INDEX_INPUT_SIZE,
    inputFields: NOSTROMO_GET_AUCTION_BY_INDEX_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_AUCTION_BY_INDEX_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_AUCTION_PARTICIPANT_INPUT_TYPE = 0
export const NOSTROMO_GET_AUCTION_PARTICIPANT_INPUT_SIZE = 40

export interface NostromoGetAuctionParticipantInput {
  auctionIndex: bigint
  participant: string
}

const NOSTROMO_GET_AUCTION_PARTICIPANT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'participant',
    type: 'id',
    offset: 8,
    byteLength: 32,
  },
]

export function buildNostromoGetAuctionParticipantInput(
  input: NostromoGetAuctionParticipantInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_AUCTION_PARTICIPANT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetAuctionParticipantOutput {
  participantData: NostromoAuctionParticipantDataStruct
  found: number
}

const NOSTROMO_GET_AUCTION_PARTICIPANT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'participantData',
    type: 'struct',
    offset: 0,
    byteLength: 91,
    structRef: 'AuctionParticipantData',
  },
  {
    name: 'found',
    type: 'uint8',
    offset: 91,
    byteLength: 1,
  },
]

export function decodeNostromoGetAuctionParticipantOutput(
  data: Uint8Array,
): NostromoGetAuctionParticipantOutput {
  return decodePayload(data, NOSTROMO_GET_AUCTION_PARTICIPANT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetAuctionParticipantOutput
}

export async function nostromoGetAuctionParticipant(
  live: SmartContractCaller,
  input: NostromoGetAuctionParticipantInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetAuctionParticipantOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_AUCTION_PARTICIPANT_INPUT_TYPE,
    inputSize: NOSTROMO_GET_AUCTION_PARTICIPANT_INPUT_SIZE,
    inputFields: NOSTROMO_GET_AUCTION_PARTICIPANT_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_AUCTION_PARTICIPANT_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_TICKS_BEFORE_AUCTION_LAUNCH_INPUT_TYPE = 0
export const NOSTROMO_GET_TICKS_BEFORE_AUCTION_LAUNCH_INPUT_SIZE = 0

export interface NostromoGetTicksBeforeAuctionLaunchOutput {
  ticks: number
}

const NOSTROMO_GET_TICKS_BEFORE_AUCTION_LAUNCH_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'ticks',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeNostromoGetTicksBeforeAuctionLaunchOutput(
  data: Uint8Array,
): NostromoGetTicksBeforeAuctionLaunchOutput {
  return decodePayload(data, NOSTROMO_GET_TICKS_BEFORE_AUCTION_LAUNCH_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetTicksBeforeAuctionLaunchOutput
}

export async function nostromoGetTicksBeforeAuctionLaunch(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetTicksBeforeAuctionLaunchOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_TICKS_BEFORE_AUCTION_LAUNCH_INPUT_TYPE,
    inputSize: NOSTROMO_GET_TICKS_BEFORE_AUCTION_LAUNCH_INPUT_SIZE,
    inputFields: [],
    outputFields: NOSTROMO_GET_TICKS_BEFORE_AUCTION_LAUNCH_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const NOSTROMO_GET_AUCTION_FEES_INPUT_TYPE = 0
export const NOSTROMO_GET_AUCTION_FEES_INPUT_SIZE = 0

export interface NostromoGetAuctionFeesOutput {
  privateAuctionFee: bigint
  publicAuctionCreationFee: bigint
  auctionCancellationFeeBasisPoints: bigint
  managementFeeBasisPoints: bigint
  developmentFeeBasisPoints: bigint
  takeoverCoordinatorFeeBasisPoints: bigint
  shareholderDividendBasisPoints: bigint
  shareholderFeeBasisPointsTier1: bigint
  shareholderFeeBasisPointsTier2: bigint
  shareholderFeeBasisPointsTier3: bigint
  shareholderFeeBasisPointsTier4: bigint
}

const NOSTROMO_GET_AUCTION_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'privateAuctionFee',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'publicAuctionCreationFee',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'auctionCancellationFeeBasisPoints',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'managementFeeBasisPoints',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'developmentFeeBasisPoints',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'takeoverCoordinatorFeeBasisPoints',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'shareholderDividendBasisPoints',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier1',
    type: 'uint64',
    offset: 56,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier2',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier3',
    type: 'uint64',
    offset: 72,
    byteLength: 8,
  },
  {
    name: 'shareholderFeeBasisPointsTier4',
    type: 'uint64',
    offset: 80,
    byteLength: 8,
  },
]

export function decodeNostromoGetAuctionFeesOutput(
  data: Uint8Array,
): NostromoGetAuctionFeesOutput {
  return decodePayload(data, NOSTROMO_GET_AUCTION_FEES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetAuctionFeesOutput
}

export async function nostromoGetAuctionFees(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetAuctionFeesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_AUCTION_FEES_INPUT_TYPE,
    inputSize: NOSTROMO_GET_AUCTION_FEES_INPUT_SIZE,
    inputFields: [],
    outputFields: NOSTROMO_GET_AUCTION_FEES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const NOSTROMO_CALCULATE_BATCH_AUCTION_BID_FEE_INPUT_TYPE = 0
export const NOSTROMO_CALCULATE_BATCH_AUCTION_BID_FEE_INPUT_SIZE = 16

export interface NostromoCalculateBatchAuctionBidFeeInput {
  bidQuantity: bigint
  bidAmount: bigint
}

const NOSTROMO_CALCULATE_BATCH_AUCTION_BID_FEE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'bidQuantity',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'bidAmount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildNostromoCalculateBatchAuctionBidFeeInput(
  input: NostromoCalculateBatchAuctionBidFeeInput,
): Uint8Array {
  return buildPayload(NOSTROMO_CALCULATE_BATCH_AUCTION_BID_FEE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface NostromoCalculateBatchAuctionBidFeeOutput {
  escrowAmount: bigint
  fee: bigint
  requiredReward: bigint
}

const NOSTROMO_CALCULATE_BATCH_AUCTION_BID_FEE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'escrowAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'fee',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'requiredReward',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
]

export function decodeNostromoCalculateBatchAuctionBidFeeOutput(
  data: Uint8Array,
): NostromoCalculateBatchAuctionBidFeeOutput {
  return decodePayload(data, NOSTROMO_CALCULATE_BATCH_AUCTION_BID_FEE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoCalculateBatchAuctionBidFeeOutput
}

export async function nostromoCalculateBatchAuctionBidFee(
  live: SmartContractCaller,
  input: NostromoCalculateBatchAuctionBidFeeInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoCalculateBatchAuctionBidFeeOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_CALCULATE_BATCH_AUCTION_BID_FEE_INPUT_TYPE,
    inputSize: NOSTROMO_CALCULATE_BATCH_AUCTION_BID_FEE_INPUT_SIZE,
    inputFields: NOSTROMO_CALCULATE_BATCH_AUCTION_BID_FEE_INPUT_FIELDS,
    outputFields: NOSTROMO_CALCULATE_BATCH_AUCTION_BID_FEE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_FEE_RECIPIENTS_INPUT_TYPE = 0
export const NOSTROMO_GET_FEE_RECIPIENTS_INPUT_SIZE = 0

export interface NostromoGetFeeRecipientsOutput {
  management: string
  development: string
  takeoverCoordinator: string
}

const NOSTROMO_GET_FEE_RECIPIENTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'management',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'development',
    type: 'id',
    offset: 32,
    byteLength: 32,
  },
  {
    name: 'takeoverCoordinator',
    type: 'id',
    offset: 64,
    byteLength: 32,
  },
]

export function decodeNostromoGetFeeRecipientsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): NostromoGetFeeRecipientsOutput {
  return decodePayload(data, NOSTROMO_GET_FEE_RECIPIENTS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as NostromoGetFeeRecipientsOutput
}

export async function nostromoGetFeeRecipients(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetFeeRecipientsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_FEE_RECIPIENTS_INPUT_TYPE,
    inputSize: NOSTROMO_GET_FEE_RECIPIENTS_INPUT_SIZE,
    inputFields: [],
    outputFields: NOSTROMO_GET_FEE_RECIPIENTS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const NOSTROMO_GET_CLOSED_AUCTION_HISTORY_INPUT_TYPE = 0
export const NOSTROMO_GET_CLOSED_AUCTION_HISTORY_INPUT_SIZE = 0

export interface NostromoGetClosedAuctionHistoryOutput {
  auctionIndices: bigint[]
  totalEntries: bigint
}

const NOSTROMO_GET_CLOSED_AUCTION_HISTORY_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndices',
    type: 'array',
    offset: 0,
    byteLength: 8192,
    arrayLength: 1024,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'totalEntries',
    type: 'uint64',
    offset: 8192,
    byteLength: 8,
  },
]

export function decodeNostromoGetClosedAuctionHistoryOutput(
  data: Uint8Array,
): NostromoGetClosedAuctionHistoryOutput {
  return decodePayload(data, NOSTROMO_GET_CLOSED_AUCTION_HISTORY_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetClosedAuctionHistoryOutput
}

export async function nostromoGetClosedAuctionHistory(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetClosedAuctionHistoryOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_CLOSED_AUCTION_HISTORY_INPUT_TYPE,
    inputSize: NOSTROMO_GET_CLOSED_AUCTION_HISTORY_INPUT_SIZE,
    inputFields: [],
    outputFields: NOSTROMO_GET_CLOSED_AUCTION_HISTORY_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const NOSTROMO_GET_ROUTE_ALL_FEES_TO_DEVELOPMENT_INPUT_TYPE = 0
export const NOSTROMO_GET_ROUTE_ALL_FEES_TO_DEVELOPMENT_INPUT_SIZE = 0

export interface NostromoGetRouteAllFeesToDevelopmentOutput {
  enabled: number
}

const NOSTROMO_GET_ROUTE_ALL_FEES_TO_DEVELOPMENT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'enabled',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeNostromoGetRouteAllFeesToDevelopmentOutput(
  data: Uint8Array,
): NostromoGetRouteAllFeesToDevelopmentOutput {
  return decodePayload(data, NOSTROMO_GET_ROUTE_ALL_FEES_TO_DEVELOPMENT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetRouteAllFeesToDevelopmentOutput
}

export async function nostromoGetRouteAllFeesToDevelopment(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetRouteAllFeesToDevelopmentOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_ROUTE_ALL_FEES_TO_DEVELOPMENT_INPUT_TYPE,
    inputSize: NOSTROMO_GET_ROUTE_ALL_FEES_TO_DEVELOPMENT_INPUT_SIZE,
    inputFields: [],
    outputFields: NOSTROMO_GET_ROUTE_ALL_FEES_TO_DEVELOPMENT_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const NOSTROMO_GET_PENDING_SERVICE_FEE_POOL_INPUT_TYPE = 0
export const NOSTROMO_GET_PENDING_SERVICE_FEE_POOL_INPUT_SIZE = 0

export interface NostromoGetPendingServiceFeePoolOutput {
  pendingServiceFeePool: bigint
}

const NOSTROMO_GET_PENDING_SERVICE_FEE_POOL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'pendingServiceFeePool',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeNostromoGetPendingServiceFeePoolOutput(
  data: Uint8Array,
): NostromoGetPendingServiceFeePoolOutput {
  return decodePayload(data, NOSTROMO_GET_PENDING_SERVICE_FEE_POOL_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetPendingServiceFeePoolOutput
}

export async function nostromoGetPendingServiceFeePool(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetPendingServiceFeePoolOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_PENDING_SERVICE_FEE_POOL_INPUT_TYPE,
    inputSize: NOSTROMO_GET_PENDING_SERVICE_FEE_POOL_INPUT_SIZE,
    inputFields: [],
    outputFields: NOSTROMO_GET_PENDING_SERVICE_FEE_POOL_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const NOSTROMO_GET_NOSTROMO_FEE_POOL_INPUT_TYPE = 0
export const NOSTROMO_GET_NOSTROMO_FEE_POOL_INPUT_SIZE = 0

export interface NostromoGetNostromoFeePoolOutput {
  feePool: NostromoNostromoFeePoolStruct
  totalAmount: bigint
}

const NOSTROMO_GET_NOSTROMO_FEE_POOL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'feePool',
    type: 'struct',
    offset: 0,
    byteLength: 72,
    structRef: 'NostromoFeePool',
  },
  {
    name: 'totalAmount',
    type: 'uint64',
    offset: 72,
    byteLength: 8,
  },
]

export function decodeNostromoGetNostromoFeePoolOutput(
  data: Uint8Array,
): NostromoGetNostromoFeePoolOutput {
  return decodePayload(data, NOSTROMO_GET_NOSTROMO_FEE_POOL_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetNostromoFeePoolOutput
}

export async function nostromoGetNostromoFeePool(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetNostromoFeePoolOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_NOSTROMO_FEE_POOL_INPUT_TYPE,
    inputSize: NOSTROMO_GET_NOSTROMO_FEE_POOL_INPUT_SIZE,
    inputFields: [],
    outputFields: NOSTROMO_GET_NOSTROMO_FEE_POOL_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const NOSTROMO_GET_PENDING_PAYOUT_INPUT_TYPE = 0
export const NOSTROMO_GET_PENDING_PAYOUT_INPUT_SIZE = 32

export interface NostromoGetPendingPayoutInput {
  account: string
}

const NOSTROMO_GET_PENDING_PAYOUT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'account',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildNostromoGetPendingPayoutInput(
  input: NostromoGetPendingPayoutInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_PENDING_PAYOUT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetPendingPayoutOutput {
  amount: bigint
}

const NOSTROMO_GET_PENDING_PAYOUT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeNostromoGetPendingPayoutOutput(
  data: Uint8Array,
): NostromoGetPendingPayoutOutput {
  return decodePayload(data, NOSTROMO_GET_PENDING_PAYOUT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetPendingPayoutOutput
}

export async function nostromoGetPendingPayout(
  live: SmartContractCaller,
  input: NostromoGetPendingPayoutInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetPendingPayoutOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_PENDING_PAYOUT_INPUT_TYPE,
    inputSize: NOSTROMO_GET_PENDING_PAYOUT_INPUT_SIZE,
    inputFields: NOSTROMO_GET_PENDING_PAYOUT_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_PENDING_PAYOUT_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_FEE_RESERVE_GUARD_STATE_INPUT_TYPE = 0
export const NOSTROMO_GET_FEE_RESERVE_GUARD_STATE_INPUT_SIZE = 0

export interface NostromoGetFeeReserveGuardStateOutput {
  currentFeeReserve: bigint
  feeReserveBaseline: bigint
  feeReserveBaselineAt: NostromoDateAndTimeStruct
  emergencyPausedAt: NostromoDateAndTimeStruct
  dropBasisPoints: bigint
  windowSeconds: bigint
  isEmergencyPaused: number
}

const NOSTROMO_GET_FEE_RESERVE_GUARD_STATE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'currentFeeReserve',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'feeReserveBaseline',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'feeReserveBaselineAt',
    type: 'struct',
    offset: 16,
    byteLength: 8,
    structRef: 'DateAndTime',
  },
  {
    name: 'emergencyPausedAt',
    type: 'struct',
    offset: 24,
    byteLength: 8,
    structRef: 'DateAndTime',
  },
  {
    name: 'dropBasisPoints',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'windowSeconds',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'isEmergencyPaused',
    type: 'uint8',
    offset: 48,
    byteLength: 1,
  },
]

export function decodeNostromoGetFeeReserveGuardStateOutput(
  data: Uint8Array,
): NostromoGetFeeReserveGuardStateOutput {
  return decodePayload(data, NOSTROMO_GET_FEE_RESERVE_GUARD_STATE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetFeeReserveGuardStateOutput
}

export async function nostromoGetFeeReserveGuardState(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetFeeReserveGuardStateOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_FEE_RESERVE_GUARD_STATE_INPUT_TYPE,
    inputSize: NOSTROMO_GET_FEE_RESERVE_GUARD_STATE_INPUT_SIZE,
    inputFields: [],
    outputFields: NOSTROMO_GET_FEE_RESERVE_GUARD_STATE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const NOSTROMO_GET_CONTRACT_STATS_INPUT_TYPE = 0
export const NOSTROMO_GET_CONTRACT_STATS_INPUT_SIZE = 0

export interface NostromoGetContractStatsOutput {
  stats: NostromoContractStatsStruct
}

const NOSTROMO_GET_CONTRACT_STATS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'stats',
    type: 'struct',
    offset: 0,
    byteLength: 104,
    structRef: 'ContractStats',
  },
]

export function decodeNostromoGetContractStatsOutput(
  data: Uint8Array,
): NostromoGetContractStatsOutput {
  return decodePayload(data, NOSTROMO_GET_CONTRACT_STATS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetContractStatsOutput
}

export async function nostromoGetContractStats(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetContractStatsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_CONTRACT_STATS_INPUT_TYPE,
    inputSize: NOSTROMO_GET_CONTRACT_STATS_INPUT_SIZE,
    inputFields: [],
    outputFields: NOSTROMO_GET_CONTRACT_STATS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const NOSTROMO_GET_AUCTION_SUMMARIES_INPUT_TYPE = 0
export const NOSTROMO_GET_AUCTION_SUMMARIES_INPUT_SIZE = 16

export interface NostromoGetAuctionSummariesInput {
  offset: bigint
  limit: bigint
}

const NOSTROMO_GET_AUCTION_SUMMARIES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'offset',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'limit',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildNostromoGetAuctionSummariesInput(
  input: NostromoGetAuctionSummariesInput,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_AUCTION_SUMMARIES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface NostromoGetAuctionSummariesOutput {
  auctions: number[]
  totalCount: bigint
  returnedCount: bigint
}

const NOSTROMO_GET_AUCTION_SUMMARIES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctions',
    type: 'array',
    offset: 0,
    byteLength: 14016,
    arrayLength: 64,
    arrayItemByteLength: 219,
    arrayItemStructRef: 'AuctionSummary',
  },
  {
    name: 'totalCount',
    type: 'uint64',
    offset: 14016,
    byteLength: 8,
  },
  {
    name: 'returnedCount',
    type: 'uint64',
    offset: 14024,
    byteLength: 8,
  },
]

export function decodeNostromoGetAuctionSummariesOutput(
  data: Uint8Array,
): NostromoGetAuctionSummariesOutput {
  return decodePayload(data, NOSTROMO_GET_AUCTION_SUMMARIES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetAuctionSummariesOutput
}

export async function nostromoGetAuctionSummaries(
  live: SmartContractCaller,
  input: NostromoGetAuctionSummariesInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetAuctionSummariesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_AUCTION_SUMMARIES_INPUT_TYPE,
    inputSize: NOSTROMO_GET_AUCTION_SUMMARIES_INPUT_SIZE,
    inputFields: NOSTROMO_GET_AUCTION_SUMMARIES_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_AUCTION_SUMMARIES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_ACTIVE_AUCTION_INDICES_INPUT_TYPE = 0
export const NOSTROMO_GET_ACTIVE_AUCTION_INDICES_INPUT_SIZE = 16

export interface NostromoGetActiveAuctionIndicesInput {
  offset: bigint
  limit: bigint
}

const NOSTROMO_GET_ACTIVE_AUCTION_INDICES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'offset',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'limit',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildNostromoGetActiveAuctionIndicesInput(
  input: NostromoGetActiveAuctionIndicesInput,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_ACTIVE_AUCTION_INDICES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface NostromoGetActiveAuctionIndicesOutput {
  auctionIndices: bigint[]
  totalCount: bigint
  returnedCount: bigint
}

const NOSTROMO_GET_ACTIVE_AUCTION_INDICES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndices',
    type: 'array',
    offset: 0,
    byteLength: 512,
    arrayLength: 64,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'totalCount',
    type: 'uint64',
    offset: 512,
    byteLength: 8,
  },
  {
    name: 'returnedCount',
    type: 'uint64',
    offset: 520,
    byteLength: 8,
  },
]

export function decodeNostromoGetActiveAuctionIndicesOutput(
  data: Uint8Array,
): NostromoGetActiveAuctionIndicesOutput {
  return decodePayload(data, NOSTROMO_GET_ACTIVE_AUCTION_INDICES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetActiveAuctionIndicesOutput
}

export async function nostromoGetActiveAuctionIndices(
  live: SmartContractCaller,
  input: NostromoGetActiveAuctionIndicesInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetActiveAuctionIndicesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_ACTIVE_AUCTION_INDICES_INPUT_TYPE,
    inputSize: NOSTROMO_GET_ACTIVE_AUCTION_INDICES_INPUT_SIZE,
    inputFields: NOSTROMO_GET_ACTIVE_AUCTION_INDICES_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_ACTIVE_AUCTION_INDICES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_AUCTIONS_BY_SELLER_INPUT_TYPE = 0
export const NOSTROMO_GET_AUCTIONS_BY_SELLER_INPUT_SIZE = 48

export interface NostromoGetAuctionsBySellerInput {
  seller: string
  offset: bigint
  limit: bigint
}

const NOSTROMO_GET_AUCTIONS_BY_SELLER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'seller',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'offset',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'limit',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildNostromoGetAuctionsBySellerInput(
  input: NostromoGetAuctionsBySellerInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_AUCTIONS_BY_SELLER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetAuctionsBySellerOutput {
  auctions: number[]
  totalCount: bigint
  returnedCount: bigint
}

const NOSTROMO_GET_AUCTIONS_BY_SELLER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctions',
    type: 'array',
    offset: 0,
    byteLength: 14016,
    arrayLength: 64,
    arrayItemByteLength: 219,
    arrayItemStructRef: 'AuctionSummary',
  },
  {
    name: 'totalCount',
    type: 'uint64',
    offset: 14016,
    byteLength: 8,
  },
  {
    name: 'returnedCount',
    type: 'uint64',
    offset: 14024,
    byteLength: 8,
  },
]

export function decodeNostromoGetAuctionsBySellerOutput(
  data: Uint8Array,
): NostromoGetAuctionsBySellerOutput {
  return decodePayload(data, NOSTROMO_GET_AUCTIONS_BY_SELLER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetAuctionsBySellerOutput
}

export async function nostromoGetAuctionsBySeller(
  live: SmartContractCaller,
  input: NostromoGetAuctionsBySellerInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetAuctionsBySellerOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_AUCTIONS_BY_SELLER_INPUT_TYPE,
    inputSize: NOSTROMO_GET_AUCTIONS_BY_SELLER_INPUT_SIZE,
    inputFields: NOSTROMO_GET_AUCTIONS_BY_SELLER_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_AUCTIONS_BY_SELLER_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_AUCTION_BY_METADATA_CID_INPUT_TYPE = 0
export const NOSTROMO_GET_AUCTION_BY_METADATA_CID_INPUT_SIZE = 64

export interface NostromoGetAuctionByMetadataCidInput {
  metadataIpfsCid: number[]
}

const NOSTROMO_GET_AUCTION_BY_METADATA_CID_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'metadataIpfsCid',
    type: 'array',
    offset: 0,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildNostromoGetAuctionByMetadataCidInput(
  input: NostromoGetAuctionByMetadataCidInput,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_AUCTION_BY_METADATA_CID_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface NostromoGetAuctionByMetadataCidOutput {
  auction: NostromoAuctionSummaryStruct
  auctionIndex: bigint
  found: number
}

const NOSTROMO_GET_AUCTION_BY_METADATA_CID_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'auction',
    type: 'struct',
    offset: 0,
    byteLength: 219,
    structRef: 'AuctionSummary',
  },
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 219,
    byteLength: 8,
  },
  {
    name: 'found',
    type: 'uint8',
    offset: 227,
    byteLength: 1,
  },
]

export function decodeNostromoGetAuctionByMetadataCidOutput(
  data: Uint8Array,
): NostromoGetAuctionByMetadataCidOutput {
  return decodePayload(data, NOSTROMO_GET_AUCTION_BY_METADATA_CID_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetAuctionByMetadataCidOutput
}

export async function nostromoGetAuctionByMetadataCid(
  live: SmartContractCaller,
  input: NostromoGetAuctionByMetadataCidInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetAuctionByMetadataCidOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_AUCTION_BY_METADATA_CID_INPUT_TYPE,
    inputSize: NOSTROMO_GET_AUCTION_BY_METADATA_CID_INPUT_SIZE,
    inputFields: NOSTROMO_GET_AUCTION_BY_METADATA_CID_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_AUCTION_BY_METADATA_CID_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_AUCTION_SUMMARIES_BY_INDEX_BATCH_INPUT_TYPE = 0
export const NOSTROMO_GET_AUCTION_SUMMARIES_BY_INDEX_BATCH_INPUT_SIZE = 520

export interface NostromoGetAuctionSummariesByIndexBatchInput {
  auctionIndices: bigint[]
  count: bigint
}

const NOSTROMO_GET_AUCTION_SUMMARIES_BY_INDEX_BATCH_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndices',
    type: 'array',
    offset: 0,
    byteLength: 512,
    arrayLength: 64,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'count',
    type: 'uint64',
    offset: 512,
    byteLength: 8,
  },
]

export function buildNostromoGetAuctionSummariesByIndexBatchInput(
  input: NostromoGetAuctionSummariesByIndexBatchInput,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_AUCTION_SUMMARIES_BY_INDEX_BATCH_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface NostromoGetAuctionSummariesByIndexBatchOutput {
  auctions: number[]
  found: number[]
  returnedCount: bigint
}

const NOSTROMO_GET_AUCTION_SUMMARIES_BY_INDEX_BATCH_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctions',
    type: 'array',
    offset: 0,
    byteLength: 14016,
    arrayLength: 64,
    arrayItemByteLength: 219,
    arrayItemStructRef: 'AuctionSummary',
  },
  {
    name: 'found',
    type: 'array',
    offset: 14016,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'returnedCount',
    type: 'uint64',
    offset: 14080,
    byteLength: 8,
  },
]

export function decodeNostromoGetAuctionSummariesByIndexBatchOutput(
  data: Uint8Array,
): NostromoGetAuctionSummariesByIndexBatchOutput {
  return decodePayload(data, NOSTROMO_GET_AUCTION_SUMMARIES_BY_INDEX_BATCH_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetAuctionSummariesByIndexBatchOutput
}

export async function nostromoGetAuctionSummariesByIndexBatch(
  live: SmartContractCaller,
  input: NostromoGetAuctionSummariesByIndexBatchInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetAuctionSummariesByIndexBatchOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_AUCTION_SUMMARIES_BY_INDEX_BATCH_INPUT_TYPE,
    inputSize: NOSTROMO_GET_AUCTION_SUMMARIES_BY_INDEX_BATCH_INPUT_SIZE,
    inputFields: NOSTROMO_GET_AUCTION_SUMMARIES_BY_INDEX_BATCH_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_AUCTION_SUMMARIES_BY_INDEX_BATCH_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_AUCTION_PARTICIPANTS_INPUT_TYPE = 0
export const NOSTROMO_GET_AUCTION_PARTICIPANTS_INPUT_SIZE = 24

export interface NostromoGetAuctionParticipantsInput {
  auctionIndex: bigint
  offset: bigint
  limit: bigint
}

const NOSTROMO_GET_AUCTION_PARTICIPANTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'offset',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'limit',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
]

export function buildNostromoGetAuctionParticipantsInput(
  input: NostromoGetAuctionParticipantsInput,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_AUCTION_PARTICIPANTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface NostromoGetAuctionParticipantsOutput {
  participants: number[]
  totalCount: bigint
  returnedCount: bigint
}

const NOSTROMO_GET_AUCTION_PARTICIPANTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'participants',
    type: 'array',
    offset: 0,
    byteLength: 4672,
    arrayLength: 64,
    arrayItemByteLength: 73,
    arrayItemStructRef: 'ParticipantSummary',
  },
  {
    name: 'totalCount',
    type: 'uint64',
    offset: 4672,
    byteLength: 8,
  },
  {
    name: 'returnedCount',
    type: 'uint64',
    offset: 4680,
    byteLength: 8,
  },
]

export function decodeNostromoGetAuctionParticipantsOutput(
  data: Uint8Array,
): NostromoGetAuctionParticipantsOutput {
  return decodePayload(data, NOSTROMO_GET_AUCTION_PARTICIPANTS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetAuctionParticipantsOutput
}

export async function nostromoGetAuctionParticipants(
  live: SmartContractCaller,
  input: NostromoGetAuctionParticipantsInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetAuctionParticipantsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_AUCTION_PARTICIPANTS_INPUT_TYPE,
    inputSize: NOSTROMO_GET_AUCTION_PARTICIPANTS_INPUT_SIZE,
    inputFields: NOSTROMO_GET_AUCTION_PARTICIPANTS_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_AUCTION_PARTICIPANTS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_USER_PARTICIPATIONS_INPUT_TYPE = 0
export const NOSTROMO_GET_USER_PARTICIPATIONS_INPUT_SIZE = 48

export interface NostromoGetUserParticipationsInput {
  participant: string
  offset: bigint
  limit: bigint
}

const NOSTROMO_GET_USER_PARTICIPATIONS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'participant',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'offset',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'limit',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildNostromoGetUserParticipationsInput(
  input: NostromoGetUserParticipationsInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_USER_PARTICIPATIONS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetUserParticipationsOutput {
  participations: number[]
  totalCount: bigint
  returnedCount: bigint
}

const NOSTROMO_GET_USER_PARTICIPATIONS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'participations',
    type: 'array',
    offset: 0,
    byteLength: 5184,
    arrayLength: 64,
    arrayItemByteLength: 81,
    arrayItemStructRef: 'UserParticipationSummary',
  },
  {
    name: 'totalCount',
    type: 'uint64',
    offset: 5184,
    byteLength: 8,
  },
  {
    name: 'returnedCount',
    type: 'uint64',
    offset: 5192,
    byteLength: 8,
  },
]

export function decodeNostromoGetUserParticipationsOutput(
  data: Uint8Array,
): NostromoGetUserParticipationsOutput {
  return decodePayload(data, NOSTROMO_GET_USER_PARTICIPATIONS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetUserParticipationsOutput
}

export async function nostromoGetUserParticipations(
  live: SmartContractCaller,
  input: NostromoGetUserParticipationsInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetUserParticipationsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_USER_PARTICIPATIONS_INPUT_TYPE,
    inputSize: NOSTROMO_GET_USER_PARTICIPATIONS_INPUT_SIZE,
    inputFields: NOSTROMO_GET_USER_PARTICIPATIONS_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_USER_PARTICIPATIONS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_LATEST_AUCTION_INDEX_INPUT_TYPE = 0
export const NOSTROMO_GET_LATEST_AUCTION_INDEX_INPUT_SIZE = 0

export interface NostromoGetLatestAuctionIndexOutput {
  auctionIndex: bigint
  found: number
}

const NOSTROMO_GET_LATEST_AUCTION_INDEX_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'found',
    type: 'uint8',
    offset: 8,
    byteLength: 1,
  },
]

export function decodeNostromoGetLatestAuctionIndexOutput(
  data: Uint8Array,
): NostromoGetLatestAuctionIndexOutput {
  return decodePayload(data, NOSTROMO_GET_LATEST_AUCTION_INDEX_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetLatestAuctionIndexOutput
}

export async function nostromoGetLatestAuctionIndex(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetLatestAuctionIndexOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_LATEST_AUCTION_INDEX_INPUT_TYPE,
    inputSize: NOSTROMO_GET_LATEST_AUCTION_INDEX_INPUT_SIZE,
    inputFields: [],
    outputFields: NOSTROMO_GET_LATEST_AUCTION_INDEX_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const NOSTROMO_GET_AUCTION_COUNT_BY_SELLER_INPUT_TYPE = 0
export const NOSTROMO_GET_AUCTION_COUNT_BY_SELLER_INPUT_SIZE = 32

export interface NostromoGetAuctionCountBySellerInput {
  seller: string
}

const NOSTROMO_GET_AUCTION_COUNT_BY_SELLER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'seller',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildNostromoGetAuctionCountBySellerInput(
  input: NostromoGetAuctionCountBySellerInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_AUCTION_COUNT_BY_SELLER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetAuctionCountBySellerOutput {
  count: bigint
}

const NOSTROMO_GET_AUCTION_COUNT_BY_SELLER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'count',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeNostromoGetAuctionCountBySellerOutput(
  data: Uint8Array,
): NostromoGetAuctionCountBySellerOutput {
  return decodePayload(data, NOSTROMO_GET_AUCTION_COUNT_BY_SELLER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetAuctionCountBySellerOutput
}

export async function nostromoGetAuctionCountBySeller(
  live: SmartContractCaller,
  input: NostromoGetAuctionCountBySellerInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetAuctionCountBySellerOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_AUCTION_COUNT_BY_SELLER_INPUT_TYPE,
    inputSize: NOSTROMO_GET_AUCTION_COUNT_BY_SELLER_INPUT_SIZE,
    inputFields: NOSTROMO_GET_AUCTION_COUNT_BY_SELLER_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_AUCTION_COUNT_BY_SELLER_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_AUCTION_AT_CREATION_SNAPSHOT_INPUT_TYPE = 0
export const NOSTROMO_GET_AUCTION_AT_CREATION_SNAPSHOT_INPUT_SIZE = 8

export interface NostromoGetAuctionAtCreationSnapshotInput {
  auctionIndex: bigint
}

const NOSTROMO_GET_AUCTION_AT_CREATION_SNAPSHOT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildNostromoGetAuctionAtCreationSnapshotInput(
  input: NostromoGetAuctionAtCreationSnapshotInput,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_AUCTION_AT_CREATION_SNAPSHOT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface NostromoGetAuctionAtCreationSnapshotOutput {
  seller: string
  createdAt: NostromoDateAndTimeStruct
  auctionIndex: bigint
  quantityForSale: bigint
  initialPrice: bigint
  salePrice: bigint
  minimumBidIncrement: bigint
  buyNowPrice: bigint
  auctionDurationSeconds: bigint
  type: number
  visibility: number
  found: number
}

const NOSTROMO_GET_AUCTION_AT_CREATION_SNAPSHOT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'seller',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'createdAt',
    type: 'struct',
    offset: 32,
    byteLength: 8,
    structRef: 'DateAndTime',
  },
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'quantityForSale',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'initialPrice',
    type: 'uint64',
    offset: 56,
    byteLength: 8,
  },
  {
    name: 'salePrice',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: 'minimumBidIncrement',
    type: 'uint64',
    offset: 72,
    byteLength: 8,
  },
  {
    name: 'buyNowPrice',
    type: 'uint64',
    offset: 80,
    byteLength: 8,
  },
  {
    name: 'auctionDurationSeconds',
    type: 'uint64',
    offset: 88,
    byteLength: 8,
  },
  {
    name: 'type',
    type: 'uint8',
    offset: 96,
    byteLength: 1,
  },
  {
    name: 'visibility',
    type: 'uint8',
    offset: 97,
    byteLength: 1,
  },
  {
    name: 'found',
    type: 'uint8',
    offset: 98,
    byteLength: 1,
  },
]

export function decodeNostromoGetAuctionAtCreationSnapshotOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): NostromoGetAuctionAtCreationSnapshotOutput {
  return decodePayload(data, NOSTROMO_GET_AUCTION_AT_CREATION_SNAPSHOT_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as NostromoGetAuctionAtCreationSnapshotOutput
}

export async function nostromoGetAuctionAtCreationSnapshot(
  live: SmartContractCaller,
  input: NostromoGetAuctionAtCreationSnapshotInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetAuctionAtCreationSnapshotOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_AUCTION_AT_CREATION_SNAPSHOT_INPUT_TYPE,
    inputSize: NOSTROMO_GET_AUCTION_AT_CREATION_SNAPSHOT_INPUT_SIZE,
    inputFields: NOSTROMO_GET_AUCTION_AT_CREATION_SNAPSHOT_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_AUCTION_AT_CREATION_SNAPSHOT_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const NOSTROMO_GET_BATCH_AUCTION_BID_AVAILABILITY_INPUT_TYPE = 0
export const NOSTROMO_GET_BATCH_AUCTION_BID_AVAILABILITY_INPUT_SIZE = 8

export interface NostromoGetBatchAuctionBidAvailabilityInput {
  auctionIndex: bigint
}

const NOSTROMO_GET_BATCH_AUCTION_BID_AVAILABILITY_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'auctionIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildNostromoGetBatchAuctionBidAvailabilityInput(
  input: NostromoGetBatchAuctionBidAvailabilityInput,
): Uint8Array {
  return buildPayload(NOSTROMO_GET_BATCH_AUCTION_BID_AVAILABILITY_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface NostromoGetBatchAuctionBidAvailabilityOutput {
  minimumBidPrice: bigint
  availableQuantity: bigint
  found: number
  isAcceptingBids: number
}

const NOSTROMO_GET_BATCH_AUCTION_BID_AVAILABILITY_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'minimumBidPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'availableQuantity',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'found',
    type: 'uint8',
    offset: 16,
    byteLength: 1,
  },
  {
    name: 'isAcceptingBids',
    type: 'uint8',
    offset: 17,
    byteLength: 1,
  },
]

export function decodeNostromoGetBatchAuctionBidAvailabilityOutput(
  data: Uint8Array,
): NostromoGetBatchAuctionBidAvailabilityOutput {
  return decodePayload(data, NOSTROMO_GET_BATCH_AUCTION_BID_AVAILABILITY_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as NostromoGetBatchAuctionBidAvailabilityOutput
}

export async function nostromoGetBatchAuctionBidAvailability(
  live: SmartContractCaller,
  input: NostromoGetBatchAuctionBidAvailabilityInput,
  options?: ContractCallOptions,
): Promise<Result<NostromoGetBatchAuctionBidAvailabilityOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: NOSTROMO_CONTRACT_INDEX,
    inputType: NOSTROMO_GET_BATCH_AUCTION_BID_AVAILABILITY_INPUT_TYPE,
    inputSize: NOSTROMO_GET_BATCH_AUCTION_BID_AVAILABILITY_INPUT_SIZE,
    inputFields: NOSTROMO_GET_BATCH_AUCTION_BID_AVAILABILITY_INPUT_FIELDS,
    outputFields: NOSTROMO_GET_BATCH_AUCTION_BID_AVAILABILITY_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const nostromo = {
  contractIndex: NOSTROMO_CONTRACT_INDEX,
  GetAuctionByIndex: nostromoGetAuctionByIndex,
  GetAuctionParticipant: nostromoGetAuctionParticipant,
  GetTicksBeforeAuctionLaunch: nostromoGetTicksBeforeAuctionLaunch,
  GetAuctionFees: nostromoGetAuctionFees,
  CalculateBatchAuctionBidFee: nostromoCalculateBatchAuctionBidFee,
  GetFeeRecipients: nostromoGetFeeRecipients,
  GetClosedAuctionHistory: nostromoGetClosedAuctionHistory,
  GetRouteAllFeesToDevelopment: nostromoGetRouteAllFeesToDevelopment,
  GetPendingServiceFeePool: nostromoGetPendingServiceFeePool,
  GetNostromoFeePool: nostromoGetNostromoFeePool,
  GetPendingPayout: nostromoGetPendingPayout,
  GetFeeReserveGuardState: nostromoGetFeeReserveGuardState,
  GetContractStats: nostromoGetContractStats,
  GetAuctionSummaries: nostromoGetAuctionSummaries,
  GetActiveAuctionIndices: nostromoGetActiveAuctionIndices,
  GetAuctionsBySeller: nostromoGetAuctionsBySeller,
  GetAuctionByMetadataCid: nostromoGetAuctionByMetadataCid,
  GetAuctionSummariesByIndexBatch: nostromoGetAuctionSummariesByIndexBatch,
  GetAuctionParticipants: nostromoGetAuctionParticipants,
  GetUserParticipations: nostromoGetUserParticipations,
  GetLatestAuctionIndex: nostromoGetLatestAuctionIndex,
  GetAuctionCountBySeller: nostromoGetAuctionCountBySeller,
  GetAuctionAtCreationSnapshot: nostromoGetAuctionAtCreationSnapshot,
  GetBatchAuctionBidAvailability: nostromoGetBatchAuctionBidAvailability,
  buildCreateAuctionInput: buildNostromoCreateAuctionInput,
  decodeCreateAuctionOutput: decodeNostromoCreateAuctionOutput,
  buildPlaceBidInput: buildNostromoPlaceBidInput,
  decodePlaceBidOutput: decodeNostromoPlaceBidOutput,
  buildCancelAuctionInput: buildNostromoCancelAuctionInput,
  decodeCancelAuctionOutput: decodeNostromoCancelAuctionOutput,
  buildResolvePendingStandardAuctionInput: buildNostromoResolvePendingStandardAuctionInput,
  decodeResolvePendingStandardAuctionOutput: decodeNostromoResolvePendingStandardAuctionOutput,
  buildSetAuctionFeesInput: buildNostromoSetAuctionFeesInput,
  buildSetAuctionFeesByManagementInput: buildNostromoSetAuctionFeesByManagementInput,
  buildSetManagementInput: buildNostromoSetManagementInput,
  buildSetFeeReserveGuardConfigInput: buildNostromoSetFeeReserveGuardConfigInput,
  buildSetEmergencyPauseInput: buildNostromoSetEmergencyPauseInput,
  buildTransferShareManagementRightsInput: buildNostromoTransferShareManagementRightsInput,
  decodeTransferShareManagementRightsOutput: decodeNostromoTransferShareManagementRightsOutput,
}

