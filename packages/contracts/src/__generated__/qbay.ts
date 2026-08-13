// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import type { Result } from '@qubic.org/types'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'

export const QBAY_CONTRACT_INDEX = 12

export interface QbayAssetStruct {
  issuer: string
  assetName: bigint
}

const STRUCTS: Record<string, NamedStruct> = {
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
}

export const QBAY_SETTING_CFB_AND_QUBIC_PRICE_INPUT_TYPE = 1

export interface QbaySettingCFBAndQubicPriceInput {
  CFBPrice: bigint
  QubicPrice: bigint
}

const QBAY_SETTING_CFB_AND_QUBIC_PRICE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'CFBPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'QubicPrice',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildQbaySettingCFBAndQubicPriceInput(
  input: QbaySettingCFBAndQubicPriceInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_SETTING_CFB_AND_QUBIC_PRICE_INPUT_TYPE, payload: buildPayload(QBAY_SETTING_CFB_AND_QUBIC_PRICE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbaySettingCFBAndQubicPriceOutput {
  returnCode: number
}

const QBAY_SETTING_CFB_AND_QUBIC_PRICE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbaySettingCFBAndQubicPriceOutput(
  data: Uint8Array,
): QbaySettingCFBAndQubicPriceOutput {
  return decodePayload(data, QBAY_SETTING_CFB_AND_QUBIC_PRICE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbaySettingCFBAndQubicPriceOutput
}

export const QBAY_CREATE_COLLECTION_INPUT_TYPE = 2

export interface QbayCreateCollectionInput {
  priceForDropMint: bigint
  volume: number
  royalty: number
  maxSizePerOneId: number
  URI: number[]
  typeOfCollection: number
}

const QBAY_CREATE_COLLECTION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'priceForDropMint',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'volume',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
  {
    name: 'royalty',
    type: 'uint32',
    offset: 12,
    byteLength: 4,
  },
  {
    name: 'maxSizePerOneId',
    type: 'uint32',
    offset: 16,
    byteLength: 4,
  },
  {
    name: 'URI',
    type: 'array',
    offset: 20,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'typeOfCollection',
    type: 'uint8',
    offset: 84,
    byteLength: 1,
  },
]

export function buildQbayCreateCollectionInput(
  input: QbayCreateCollectionInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_CREATE_COLLECTION_INPUT_TYPE, payload: buildPayload(QBAY_CREATE_COLLECTION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayCreateCollectionOutput {
  returnCode: number
}

const QBAY_CREATE_COLLECTION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayCreateCollectionOutput(
  data: Uint8Array,
): QbayCreateCollectionOutput {
  return decodePayload(data, QBAY_CREATE_COLLECTION_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayCreateCollectionOutput
}

export const QBAY_MINT_INPUT_TYPE = 3

export interface QbayMintInput {
  royalty: number
  collectionId: number
  URI: number[]
  typeOfMint: number
}

const QBAY_MINT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'royalty',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'collectionId',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
  {
    name: 'URI',
    type: 'array',
    offset: 8,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'typeOfMint',
    type: 'uint8',
    offset: 72,
    byteLength: 1,
  },
]

export function buildQbayMintInput(
  input: QbayMintInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_MINT_INPUT_TYPE, payload: buildPayload(QBAY_MINT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayMintOutput {
  returnCode: number
}

const QBAY_MINT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayMintOutput(
  data: Uint8Array,
): QbayMintOutput {
  return decodePayload(data, QBAY_MINT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayMintOutput
}

export const QBAY_MINT_OF_DROP_INPUT_TYPE = 4

export interface QbayMintOfDropInput {
  collectionId: number
  URI: number[]
}

const QBAY_MINT_OF_DROP_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'collectionId',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'URI',
    type: 'array',
    offset: 4,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQbayMintOfDropInput(
  input: QbayMintOfDropInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_MINT_OF_DROP_INPUT_TYPE, payload: buildPayload(QBAY_MINT_OF_DROP_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayMintOfDropOutput {
  returnCode: number
}

const QBAY_MINT_OF_DROP_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayMintOfDropOutput(
  data: Uint8Array,
): QbayMintOfDropOutput {
  return decodePayload(data, QBAY_MINT_OF_DROP_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayMintOfDropOutput
}

export const QBAY_TRANSFER_INPUT_TYPE = 5

export interface QbayTransferInput {
  receiver: string
  NFTid: number
}

const QBAY_TRANSFER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'receiver',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'NFTid',
    type: 'uint32',
    offset: 32,
    byteLength: 4,
  },
]

export function buildQbayTransferInput(
  input: QbayTransferInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_TRANSFER_INPUT_TYPE, payload: buildPayload(QBAY_TRANSFER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QbayTransferOutput {
  returnCode: number
}

const QBAY_TRANSFER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayTransferOutput(
  data: Uint8Array,
): QbayTransferOutput {
  return decodePayload(data, QBAY_TRANSFER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayTransferOutput
}

export const QBAY_LIST_IN_MARKET_INPUT_TYPE = 6

export interface QbayListInMarketInput {
  price: bigint
  NFTid: number
}

const QBAY_LIST_IN_MARKET_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'price',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'NFTid',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function buildQbayListInMarketInput(
  input: QbayListInMarketInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_LIST_IN_MARKET_INPUT_TYPE, payload: buildPayload(QBAY_LIST_IN_MARKET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayListInMarketOutput {
  returnCode: number
}

const QBAY_LIST_IN_MARKET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayListInMarketOutput(
  data: Uint8Array,
): QbayListInMarketOutput {
  return decodePayload(data, QBAY_LIST_IN_MARKET_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayListInMarketOutput
}

export const QBAY_BUY_INPUT_TYPE = 7

export interface QbayBuyInput {
  NFTid: number
  methodOfPayment: number
}

const QBAY_BUY_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'NFTid',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'methodOfPayment',
    type: 'uint8',
    offset: 4,
    byteLength: 1,
  },
]

export function buildQbayBuyInput(
  input: QbayBuyInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_BUY_INPUT_TYPE, payload: buildPayload(QBAY_BUY_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayBuyOutput {
  returnCode: number
}

const QBAY_BUY_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayBuyOutput(
  data: Uint8Array,
): QbayBuyOutput {
  return decodePayload(data, QBAY_BUY_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayBuyOutput
}

export const QBAY_CANCEL_SALE_INPUT_TYPE = 8

export interface QbayCancelSaleInput {
  NFTid: number
}

const QBAY_CANCEL_SALE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'NFTid',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQbayCancelSaleInput(
  input: QbayCancelSaleInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_CANCEL_SALE_INPUT_TYPE, payload: buildPayload(QBAY_CANCEL_SALE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayCancelSaleOutput {
  returnCode: number
}

const QBAY_CANCEL_SALE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayCancelSaleOutput(
  data: Uint8Array,
): QbayCancelSaleOutput {
  return decodePayload(data, QBAY_CANCEL_SALE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayCancelSaleOutput
}

export const QBAY_LIST_IN_EXCHANGE_INPUT_TYPE = 9

export interface QbayListInExchangeInput {
  possessedNFT: number
  anotherNFT: number
}

const QBAY_LIST_IN_EXCHANGE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'possessedNFT',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'anotherNFT',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
]

export function buildQbayListInExchangeInput(
  input: QbayListInExchangeInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_LIST_IN_EXCHANGE_INPUT_TYPE, payload: buildPayload(QBAY_LIST_IN_EXCHANGE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayListInExchangeOutput {
  returnCode: number
}

const QBAY_LIST_IN_EXCHANGE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayListInExchangeOutput(
  data: Uint8Array,
): QbayListInExchangeOutput {
  return decodePayload(data, QBAY_LIST_IN_EXCHANGE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayListInExchangeOutput
}

export const QBAY_CANCEL_EXCHANGE_INPUT_TYPE = 10

export interface QbayCancelExchangeInput {
  possessedNFT: number
  anotherNFT: number
}

const QBAY_CANCEL_EXCHANGE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'possessedNFT',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'anotherNFT',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
]

export function buildQbayCancelExchangeInput(
  input: QbayCancelExchangeInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_CANCEL_EXCHANGE_INPUT_TYPE, payload: buildPayload(QBAY_CANCEL_EXCHANGE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayCancelExchangeOutput {
  returnCode: number
}

const QBAY_CANCEL_EXCHANGE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayCancelExchangeOutput(
  data: Uint8Array,
): QbayCancelExchangeOutput {
  return decodePayload(data, QBAY_CANCEL_EXCHANGE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayCancelExchangeOutput
}

export const QBAY_MAKE_OFFER_INPUT_TYPE = 11

export interface QbayMakeOfferInput {
  askPrice: bigint
  NFTid: number
  paymentMethod: number
}

const QBAY_MAKE_OFFER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'askPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'NFTid',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
  {
    name: 'paymentMethod',
    type: 'uint8',
    offset: 12,
    byteLength: 1,
  },
]

export function buildQbayMakeOfferInput(
  input: QbayMakeOfferInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_MAKE_OFFER_INPUT_TYPE, payload: buildPayload(QBAY_MAKE_OFFER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayMakeOfferOutput {
  returnCode: number
}

const QBAY_MAKE_OFFER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayMakeOfferOutput(
  data: Uint8Array,
): QbayMakeOfferOutput {
  return decodePayload(data, QBAY_MAKE_OFFER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayMakeOfferOutput
}

export const QBAY_ACCEPT_OFFER_INPUT_TYPE = 12

export interface QbayAcceptOfferInput {
  NFTid: number
}

const QBAY_ACCEPT_OFFER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'NFTid',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQbayAcceptOfferInput(
  input: QbayAcceptOfferInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_ACCEPT_OFFER_INPUT_TYPE, payload: buildPayload(QBAY_ACCEPT_OFFER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayAcceptOfferOutput {
  returnCode: number
}

const QBAY_ACCEPT_OFFER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayAcceptOfferOutput(
  data: Uint8Array,
): QbayAcceptOfferOutput {
  return decodePayload(data, QBAY_ACCEPT_OFFER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayAcceptOfferOutput
}

export const QBAY_CANCEL_OFFER_INPUT_TYPE = 13

export interface QbayCancelOfferInput {
  NFTid: number
}

const QBAY_CANCEL_OFFER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'NFTid',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQbayCancelOfferInput(
  input: QbayCancelOfferInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_CANCEL_OFFER_INPUT_TYPE, payload: buildPayload(QBAY_CANCEL_OFFER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayCancelOfferOutput {
  returnCode: number
}

const QBAY_CANCEL_OFFER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayCancelOfferOutput(
  data: Uint8Array,
): QbayCancelOfferOutput {
  return decodePayload(data, QBAY_CANCEL_OFFER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayCancelOfferOutput
}

export const QBAY_CREATE_TRADITIONAL_AUCTION_INPUT_TYPE = 14

export interface QbayCreateTraditionalAuctionInput {
  minPrice: bigint
  NFTId: number
  startYear: number
  startMonth: number
  startDay: number
  startHour: number
  endYear: number
  endMonth: number
  endDay: number
  endHour: number
  paymentMethodOfAuction: number
}

const QBAY_CREATE_TRADITIONAL_AUCTION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'minPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'NFTId',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
  {
    name: 'startYear',
    type: 'uint32',
    offset: 12,
    byteLength: 4,
  },
  {
    name: 'startMonth',
    type: 'uint32',
    offset: 16,
    byteLength: 4,
  },
  {
    name: 'startDay',
    type: 'uint32',
    offset: 20,
    byteLength: 4,
  },
  {
    name: 'startHour',
    type: 'uint32',
    offset: 24,
    byteLength: 4,
  },
  {
    name: 'endYear',
    type: 'uint32',
    offset: 28,
    byteLength: 4,
  },
  {
    name: 'endMonth',
    type: 'uint32',
    offset: 32,
    byteLength: 4,
  },
  {
    name: 'endDay',
    type: 'uint32',
    offset: 36,
    byteLength: 4,
  },
  {
    name: 'endHour',
    type: 'uint32',
    offset: 40,
    byteLength: 4,
  },
  {
    name: 'paymentMethodOfAuction',
    type: 'uint8',
    offset: 44,
    byteLength: 1,
  },
]

export function buildQbayCreateTraditionalAuctionInput(
  input: QbayCreateTraditionalAuctionInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_CREATE_TRADITIONAL_AUCTION_INPUT_TYPE, payload: buildPayload(QBAY_CREATE_TRADITIONAL_AUCTION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayCreateTraditionalAuctionOutput {
  returnCode: number
}

const QBAY_CREATE_TRADITIONAL_AUCTION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayCreateTraditionalAuctionOutput(
  data: Uint8Array,
): QbayCreateTraditionalAuctionOutput {
  return decodePayload(data, QBAY_CREATE_TRADITIONAL_AUCTION_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayCreateTraditionalAuctionOutput
}

export const QBAY_BID_ON_TRADITIONAL_AUCTION_INPUT_TYPE = 15

export interface QbayBidOnTraditionalAuctionInput {
  price: bigint
  NFTId: number
  paymentMethod: number
}

const QBAY_BID_ON_TRADITIONAL_AUCTION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'price',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'NFTId',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
  {
    name: 'paymentMethod',
    type: 'uint8',
    offset: 12,
    byteLength: 1,
  },
]

export function buildQbayBidOnTraditionalAuctionInput(
  input: QbayBidOnTraditionalAuctionInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_BID_ON_TRADITIONAL_AUCTION_INPUT_TYPE, payload: buildPayload(QBAY_BID_ON_TRADITIONAL_AUCTION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayBidOnTraditionalAuctionOutput {
  returnCode: number
}

const QBAY_BID_ON_TRADITIONAL_AUCTION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayBidOnTraditionalAuctionOutput(
  data: Uint8Array,
): QbayBidOnTraditionalAuctionOutput {
  return decodePayload(data, QBAY_BID_ON_TRADITIONAL_AUCTION_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayBidOnTraditionalAuctionOutput
}

export const QBAY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 16

export interface QbayTransferShareManagementRightsInput {
  asset: QbayAssetStruct
  numberOfShares: bigint
  newManagingContractIndex: number
}

const QBAY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
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

export function buildQbayTransferShareManagementRightsInput(
  input: QbayTransferShareManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE, payload: buildPayload(QBAY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QbayTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
  returnCode: number
}

const QBAY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function decodeQbayTransferShareManagementRightsOutput(
  data: Uint8Array,
): QbayTransferShareManagementRightsOutput {
  return decodePayload(data, QBAY_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayTransferShareManagementRightsOutput
}

export const QBAY_CHANGE_STATUS_OF_MARKET_PLACE_INPUT_TYPE = 17

export interface QbayChangeStatusOfMarketPlaceInput {
  status: number
}

const QBAY_CHANGE_STATUS_OF_MARKET_PLACE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function buildQbayChangeStatusOfMarketPlaceInput(
  input: QbayChangeStatusOfMarketPlaceInput,
): ContractCall {
  return { contractIndex: QBAY_CONTRACT_INDEX, inputType: QBAY_CHANGE_STATUS_OF_MARKET_PLACE_INPUT_TYPE, payload: buildPayload(QBAY_CHANGE_STATUS_OF_MARKET_PLACE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface QbayChangeStatusOfMarketPlaceOutput {
  returnCode: number
}

const QBAY_CHANGE_STATUS_OF_MARKET_PLACE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayChangeStatusOfMarketPlaceOutput(
  data: Uint8Array,
): QbayChangeStatusOfMarketPlaceOutput {
  return decodePayload(data, QBAY_CHANGE_STATUS_OF_MARKET_PLACE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayChangeStatusOfMarketPlaceOutput
}

export const QBAY_GET_NUMBER_OF_NFT_FOR_USER_INPUT_TYPE = 1
export const QBAY_GET_NUMBER_OF_NFT_FOR_USER_INPUT_SIZE = 32

export interface QbayGetNumberOfNFTForUserInput {
  user: string
}

const QBAY_GET_NUMBER_OF_NFT_FOR_USER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'user',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQbayGetNumberOfNFTForUserInput(
  input: QbayGetNumberOfNFTForUserInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(QBAY_GET_NUMBER_OF_NFT_FOR_USER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QbayGetNumberOfNFTForUserOutput {
  numberOfNFT: number
}

const QBAY_GET_NUMBER_OF_NFT_FOR_USER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfNFT',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQbayGetNumberOfNFTForUserOutput(
  data: Uint8Array,
): QbayGetNumberOfNFTForUserOutput {
  return decodePayload(data, QBAY_GET_NUMBER_OF_NFT_FOR_USER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayGetNumberOfNFTForUserOutput
}

export async function qbayGetNumberOfNFTForUser(
  live: SmartContractCaller,
  input: QbayGetNumberOfNFTForUserInput,
  options?: ContractCallOptions,
): Promise<Result<QbayGetNumberOfNFTForUserOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QBAY_CONTRACT_INDEX,
    inputType: QBAY_GET_NUMBER_OF_NFT_FOR_USER_INPUT_TYPE,
    inputSize: QBAY_GET_NUMBER_OF_NFT_FOR_USER_INPUT_SIZE,
    inputFields: QBAY_GET_NUMBER_OF_NFT_FOR_USER_INPUT_FIELDS,
    outputFields: QBAY_GET_NUMBER_OF_NFT_FOR_USER_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QBAY_GET_INFO_OF_NFT_USER_POSSESSED_INPUT_TYPE = 2
export const QBAY_GET_INFO_OF_NFT_USER_POSSESSED_INPUT_SIZE = 36

export interface QbayGetInfoOfNFTUserPossessedInput {
  user: string
  NFTNumber: number
}

const QBAY_GET_INFO_OF_NFT_USER_POSSESSED_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'user',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'NFTNumber',
    type: 'uint32',
    offset: 32,
    byteLength: 4,
  },
]

export function buildQbayGetInfoOfNFTUserPossessedInput(
  input: QbayGetInfoOfNFTUserPossessedInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(QBAY_GET_INFO_OF_NFT_USER_POSSESSED_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QbayGetInfoOfNFTUserPossessedOutput {
  creator: string
  possessor: string
  askUser: string
  creatorOfAuction: string
  salePrice: bigint
  askMaxPrice: bigint
  currentPriceOfAuction: bigint
  royalty: number
  NFTidForExchange: number
  URI: number[]
  statusOfAuction: number
  yearAuctionStarted: number
  monthAuctionStarted: number
  dayAuctionStarted: number
  hourAuctionStarted: number
  minuteAuctionStarted: number
  secondAuctionStarted: number
  yearAuctionEnded: number
  monthAuctionEnded: number
  dayAuctionEnded: number
  hourAuctionEnded: number
  minuteAuctionEnded: number
  secondAuctionEnded: number
  statusOfSale: number
  statusOfAsk: number
  paymentMethodOfAsk: number
  statusOfExchange: number
  paymentMethodOfAuction: number
}

const QBAY_GET_INFO_OF_NFT_USER_POSSESSED_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'creator',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'possessor',
    type: 'id',
    offset: 32,
    byteLength: 32,
  },
  {
    name: 'askUser',
    type: 'id',
    offset: 64,
    byteLength: 32,
  },
  {
    name: 'creatorOfAuction',
    type: 'id',
    offset: 96,
    byteLength: 32,
  },
  {
    name: 'salePrice',
    type: 'sint64',
    offset: 128,
    byteLength: 8,
  },
  {
    name: 'askMaxPrice',
    type: 'sint64',
    offset: 136,
    byteLength: 8,
  },
  {
    name: 'currentPriceOfAuction',
    type: 'uint64',
    offset: 144,
    byteLength: 8,
  },
  {
    name: 'royalty',
    type: 'uint32',
    offset: 152,
    byteLength: 4,
  },
  {
    name: 'NFTidForExchange',
    type: 'uint32',
    offset: 156,
    byteLength: 4,
  },
  {
    name: 'URI',
    type: 'array',
    offset: 160,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'statusOfAuction',
    type: 'uint8',
    offset: 224,
    byteLength: 1,
  },
  {
    name: 'yearAuctionStarted',
    type: 'uint8',
    offset: 225,
    byteLength: 1,
  },
  {
    name: 'monthAuctionStarted',
    type: 'uint8',
    offset: 226,
    byteLength: 1,
  },
  {
    name: 'dayAuctionStarted',
    type: 'uint8',
    offset: 227,
    byteLength: 1,
  },
  {
    name: 'hourAuctionStarted',
    type: 'uint8',
    offset: 228,
    byteLength: 1,
  },
  {
    name: 'minuteAuctionStarted',
    type: 'uint8',
    offset: 229,
    byteLength: 1,
  },
  {
    name: 'secondAuctionStarted',
    type: 'uint8',
    offset: 230,
    byteLength: 1,
  },
  {
    name: 'yearAuctionEnded',
    type: 'uint8',
    offset: 231,
    byteLength: 1,
  },
  {
    name: 'monthAuctionEnded',
    type: 'uint8',
    offset: 232,
    byteLength: 1,
  },
  {
    name: 'dayAuctionEnded',
    type: 'uint8',
    offset: 233,
    byteLength: 1,
  },
  {
    name: 'hourAuctionEnded',
    type: 'uint8',
    offset: 234,
    byteLength: 1,
  },
  {
    name: 'minuteAuctionEnded',
    type: 'uint8',
    offset: 235,
    byteLength: 1,
  },
  {
    name: 'secondAuctionEnded',
    type: 'uint8',
    offset: 236,
    byteLength: 1,
  },
  {
    name: 'statusOfSale',
    type: 'uint8',
    offset: 237,
    byteLength: 1,
  },
  {
    name: 'statusOfAsk',
    type: 'uint8',
    offset: 238,
    byteLength: 1,
  },
  {
    name: 'paymentMethodOfAsk',
    type: 'uint8',
    offset: 239,
    byteLength: 1,
  },
  {
    name: 'statusOfExchange',
    type: 'uint8',
    offset: 240,
    byteLength: 1,
  },
  {
    name: 'paymentMethodOfAuction',
    type: 'uint8',
    offset: 241,
    byteLength: 1,
  },
]

export function decodeQbayGetInfoOfNFTUserPossessedOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QbayGetInfoOfNFTUserPossessedOutput {
  return decodePayload(data, QBAY_GET_INFO_OF_NFT_USER_POSSESSED_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QbayGetInfoOfNFTUserPossessedOutput
}

export async function qbayGetInfoOfNFTUserPossessed(
  live: SmartContractCaller,
  input: QbayGetInfoOfNFTUserPossessedInput,
  options?: ContractCallOptions,
): Promise<Result<QbayGetInfoOfNFTUserPossessedOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QBAY_CONTRACT_INDEX,
    inputType: QBAY_GET_INFO_OF_NFT_USER_POSSESSED_INPUT_TYPE,
    inputSize: QBAY_GET_INFO_OF_NFT_USER_POSSESSED_INPUT_SIZE,
    inputFields: QBAY_GET_INFO_OF_NFT_USER_POSSESSED_INPUT_FIELDS,
    outputFields: QBAY_GET_INFO_OF_NFT_USER_POSSESSED_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QBAY_GET_INFO_OF_MARKETPLACE_INPUT_TYPE = 3
export const QBAY_GET_INFO_OF_MARKETPLACE_INPUT_SIZE = 0

export interface QbayGetInfoOfMarketplaceOutput {
  priceOfCFB: bigint
  priceOfQubic: bigint
  numberOfNFTIncoming: bigint
  earnedQubic: bigint
  earnedCFB: bigint
  numberOfCollection: number
  numberOfNFT: number
  statusOfMarketPlace: number
}

const QBAY_GET_INFO_OF_MARKETPLACE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'priceOfCFB',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'priceOfQubic',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'numberOfNFTIncoming',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'earnedQubic',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'earnedCFB',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'numberOfCollection',
    type: 'uint32',
    offset: 40,
    byteLength: 4,
  },
  {
    name: 'numberOfNFT',
    type: 'uint32',
    offset: 44,
    byteLength: 4,
  },
  {
    name: 'statusOfMarketPlace',
    type: 'uint8',
    offset: 48,
    byteLength: 1,
  },
]

export function decodeQbayGetInfoOfMarketplaceOutput(
  data: Uint8Array,
): QbayGetInfoOfMarketplaceOutput {
  return decodePayload(data, QBAY_GET_INFO_OF_MARKETPLACE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayGetInfoOfMarketplaceOutput
}

export async function qbayGetInfoOfMarketplace(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QbayGetInfoOfMarketplaceOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QBAY_CONTRACT_INDEX,
    inputType: QBAY_GET_INFO_OF_MARKETPLACE_INPUT_TYPE,
    inputSize: QBAY_GET_INFO_OF_MARKETPLACE_INPUT_SIZE,
    inputFields: [],
    outputFields: QBAY_GET_INFO_OF_MARKETPLACE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const QBAY_GET_INFO_OF_COLLECTION_BY_CREATOR_INPUT_TYPE = 4
export const QBAY_GET_INFO_OF_COLLECTION_BY_CREATOR_INPUT_SIZE = 36

export interface QbayGetInfoOfCollectionByCreatorInput {
  creator: string
  orderOfCollection: number
}

const QBAY_GET_INFO_OF_COLLECTION_BY_CREATOR_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'creator',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'orderOfCollection',
    type: 'uint32',
    offset: 32,
    byteLength: 4,
  },
]

export function buildQbayGetInfoOfCollectionByCreatorInput(
  input: QbayGetInfoOfCollectionByCreatorInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(QBAY_GET_INFO_OF_COLLECTION_BY_CREATOR_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QbayGetInfoOfCollectionByCreatorOutput {
  priceForDropMint: bigint
  idOfCollection: number
  royalty: number
  currentSize: number
  maxSizeHoldingPerOneId: number
  URI: number[]
  typeOfCollection: number
}

const QBAY_GET_INFO_OF_COLLECTION_BY_CREATOR_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'priceForDropMint',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'idOfCollection',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
  {
    name: 'royalty',
    type: 'uint32',
    offset: 12,
    byteLength: 4,
  },
  {
    name: 'currentSize',
    type: 'sint32',
    offset: 16,
    byteLength: 4,
  },
  {
    name: 'maxSizeHoldingPerOneId',
    type: 'uint32',
    offset: 20,
    byteLength: 4,
  },
  {
    name: 'URI',
    type: 'array',
    offset: 24,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'typeOfCollection',
    type: 'uint8',
    offset: 88,
    byteLength: 1,
  },
]

export function decodeQbayGetInfoOfCollectionByCreatorOutput(
  data: Uint8Array,
): QbayGetInfoOfCollectionByCreatorOutput {
  return decodePayload(data, QBAY_GET_INFO_OF_COLLECTION_BY_CREATOR_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayGetInfoOfCollectionByCreatorOutput
}

export async function qbayGetInfoOfCollectionByCreator(
  live: SmartContractCaller,
  input: QbayGetInfoOfCollectionByCreatorInput,
  options?: ContractCallOptions,
): Promise<Result<QbayGetInfoOfCollectionByCreatorOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QBAY_CONTRACT_INDEX,
    inputType: QBAY_GET_INFO_OF_COLLECTION_BY_CREATOR_INPUT_TYPE,
    inputSize: QBAY_GET_INFO_OF_COLLECTION_BY_CREATOR_INPUT_SIZE,
    inputFields: QBAY_GET_INFO_OF_COLLECTION_BY_CREATOR_INPUT_FIELDS,
    outputFields: QBAY_GET_INFO_OF_COLLECTION_BY_CREATOR_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QBAY_GET_INFO_OF_COLLECTION_BY_ID_INPUT_TYPE = 5
export const QBAY_GET_INFO_OF_COLLECTION_BY_ID_INPUT_SIZE = 4

export interface QbayGetInfoOfCollectionByIdInput {
  idOfCollection: number
}

const QBAY_GET_INFO_OF_COLLECTION_BY_ID_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'idOfCollection',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQbayGetInfoOfCollectionByIdInput(
  input: QbayGetInfoOfCollectionByIdInput,
): Uint8Array {
  return buildPayload(QBAY_GET_INFO_OF_COLLECTION_BY_ID_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QbayGetInfoOfCollectionByIdOutput {
  creator: string
  priceForDropMint: bigint
  royalty: number
  currentSize: number
  maxSizeHoldingPerOneId: number
  URI: number[]
  typeOfCollection: number
}

const QBAY_GET_INFO_OF_COLLECTION_BY_ID_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'creator',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'priceForDropMint',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'royalty',
    type: 'uint32',
    offset: 40,
    byteLength: 4,
  },
  {
    name: 'currentSize',
    type: 'sint32',
    offset: 44,
    byteLength: 4,
  },
  {
    name: 'maxSizeHoldingPerOneId',
    type: 'uint32',
    offset: 48,
    byteLength: 4,
  },
  {
    name: 'URI',
    type: 'array',
    offset: 52,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'typeOfCollection',
    type: 'uint8',
    offset: 116,
    byteLength: 1,
  },
]

export function decodeQbayGetInfoOfCollectionByIdOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QbayGetInfoOfCollectionByIdOutput {
  return decodePayload(data, QBAY_GET_INFO_OF_COLLECTION_BY_ID_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QbayGetInfoOfCollectionByIdOutput
}

export async function qbayGetInfoOfCollectionById(
  live: SmartContractCaller,
  input: QbayGetInfoOfCollectionByIdInput,
  options?: ContractCallOptions,
): Promise<Result<QbayGetInfoOfCollectionByIdOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QBAY_CONTRACT_INDEX,
    inputType: QBAY_GET_INFO_OF_COLLECTION_BY_ID_INPUT_TYPE,
    inputSize: QBAY_GET_INFO_OF_COLLECTION_BY_ID_INPUT_SIZE,
    inputFields: QBAY_GET_INFO_OF_COLLECTION_BY_ID_INPUT_FIELDS,
    outputFields: QBAY_GET_INFO_OF_COLLECTION_BY_ID_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QBAY_GET_INCOMING_AUCTIONS_INPUT_TYPE = 6
export const QBAY_GET_INCOMING_AUCTIONS_INPUT_SIZE = 8

export interface QbayGetIncomingAuctionsInput {
  offset: number
  count: number
}

const QBAY_GET_INCOMING_AUCTIONS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'offset',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'count',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
]

export function buildQbayGetIncomingAuctionsInput(
  input: QbayGetIncomingAuctionsInput,
): Uint8Array {
  return buildPayload(QBAY_GET_INCOMING_AUCTIONS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QbayGetIncomingAuctionsOutput {
  NFTId: number[]
}

const QBAY_GET_INCOMING_AUCTIONS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'NFTId',
    type: 'array',
    offset: 0,
    byteLength: 4096,
    arrayLength: 1024,
    arrayItemType: 'uint32',
    arrayItemByteLength: 4,
  },
]

export function decodeQbayGetIncomingAuctionsOutput(
  data: Uint8Array,
): QbayGetIncomingAuctionsOutput {
  return decodePayload(data, QBAY_GET_INCOMING_AUCTIONS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayGetIncomingAuctionsOutput
}

export async function qbayGetIncomingAuctions(
  live: SmartContractCaller,
  input: QbayGetIncomingAuctionsInput,
  options?: ContractCallOptions,
): Promise<Result<QbayGetIncomingAuctionsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QBAY_CONTRACT_INDEX,
    inputType: QBAY_GET_INCOMING_AUCTIONS_INPUT_TYPE,
    inputSize: QBAY_GET_INCOMING_AUCTIONS_INPUT_SIZE,
    inputFields: QBAY_GET_INCOMING_AUCTIONS_INPUT_FIELDS,
    outputFields: QBAY_GET_INCOMING_AUCTIONS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QBAY_GET_INFO_OF_NFT_BY_ID_INPUT_TYPE = 7
export const QBAY_GET_INFO_OF_NFT_BY_ID_INPUT_SIZE = 4

export interface QbayGetInfoOfNFTByIdInput {
  NFTId: number
}

const QBAY_GET_INFO_OF_NFT_BY_ID_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'NFTId',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQbayGetInfoOfNFTByIdInput(
  input: QbayGetInfoOfNFTByIdInput,
): Uint8Array {
  return buildPayload(QBAY_GET_INFO_OF_NFT_BY_ID_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface QbayGetInfoOfNFTByIdOutput {
  creator: string
  possessor: string
  askUser: string
  creatorOfAuction: string
  salePrice: bigint
  askMaxPrice: bigint
  currentPriceOfAuction: bigint
  royalty: number
  NFTidForExchange: number
  URI: number[]
  statusOfAuction: number
  yearAuctionStarted: number
  monthAuctionStarted: number
  dayAuctionStarted: number
  hourAuctionStarted: number
  minuteAuctionStarted: number
  secondAuctionStarted: number
  yearAuctionEnded: number
  monthAuctionEnded: number
  dayAuctionEnded: number
  hourAuctionEnded: number
  minuteAuctionEnded: number
  secondAuctionEnded: number
  statusOfSale: number
  statusOfAsk: number
  paymentMethodOfAsk: number
  statusOfExchange: number
  paymentMethodOfAuction: number
}

const QBAY_GET_INFO_OF_NFT_BY_ID_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'creator',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'possessor',
    type: 'id',
    offset: 32,
    byteLength: 32,
  },
  {
    name: 'askUser',
    type: 'id',
    offset: 64,
    byteLength: 32,
  },
  {
    name: 'creatorOfAuction',
    type: 'id',
    offset: 96,
    byteLength: 32,
  },
  {
    name: 'salePrice',
    type: 'sint64',
    offset: 128,
    byteLength: 8,
  },
  {
    name: 'askMaxPrice',
    type: 'sint64',
    offset: 136,
    byteLength: 8,
  },
  {
    name: 'currentPriceOfAuction',
    type: 'uint64',
    offset: 144,
    byteLength: 8,
  },
  {
    name: 'royalty',
    type: 'uint32',
    offset: 152,
    byteLength: 4,
  },
  {
    name: 'NFTidForExchange',
    type: 'uint32',
    offset: 156,
    byteLength: 4,
  },
  {
    name: 'URI',
    type: 'array',
    offset: 160,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'statusOfAuction',
    type: 'uint8',
    offset: 224,
    byteLength: 1,
  },
  {
    name: 'yearAuctionStarted',
    type: 'uint8',
    offset: 225,
    byteLength: 1,
  },
  {
    name: 'monthAuctionStarted',
    type: 'uint8',
    offset: 226,
    byteLength: 1,
  },
  {
    name: 'dayAuctionStarted',
    type: 'uint8',
    offset: 227,
    byteLength: 1,
  },
  {
    name: 'hourAuctionStarted',
    type: 'uint8',
    offset: 228,
    byteLength: 1,
  },
  {
    name: 'minuteAuctionStarted',
    type: 'uint8',
    offset: 229,
    byteLength: 1,
  },
  {
    name: 'secondAuctionStarted',
    type: 'uint8',
    offset: 230,
    byteLength: 1,
  },
  {
    name: 'yearAuctionEnded',
    type: 'uint8',
    offset: 231,
    byteLength: 1,
  },
  {
    name: 'monthAuctionEnded',
    type: 'uint8',
    offset: 232,
    byteLength: 1,
  },
  {
    name: 'dayAuctionEnded',
    type: 'uint8',
    offset: 233,
    byteLength: 1,
  },
  {
    name: 'hourAuctionEnded',
    type: 'uint8',
    offset: 234,
    byteLength: 1,
  },
  {
    name: 'minuteAuctionEnded',
    type: 'uint8',
    offset: 235,
    byteLength: 1,
  },
  {
    name: 'secondAuctionEnded',
    type: 'uint8',
    offset: 236,
    byteLength: 1,
  },
  {
    name: 'statusOfSale',
    type: 'uint8',
    offset: 237,
    byteLength: 1,
  },
  {
    name: 'statusOfAsk',
    type: 'uint8',
    offset: 238,
    byteLength: 1,
  },
  {
    name: 'paymentMethodOfAsk',
    type: 'uint8',
    offset: 239,
    byteLength: 1,
  },
  {
    name: 'statusOfExchange',
    type: 'uint8',
    offset: 240,
    byteLength: 1,
  },
  {
    name: 'paymentMethodOfAuction',
    type: 'uint8',
    offset: 241,
    byteLength: 1,
  },
]

export function decodeQbayGetInfoOfNFTByIdOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): QbayGetInfoOfNFTByIdOutput {
  return decodePayload(data, QBAY_GET_INFO_OF_NFT_BY_ID_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QbayGetInfoOfNFTByIdOutput
}

export async function qbayGetInfoOfNFTById(
  live: SmartContractCaller,
  input: QbayGetInfoOfNFTByIdInput,
  options?: ContractCallOptions,
): Promise<Result<QbayGetInfoOfNFTByIdOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QBAY_CONTRACT_INDEX,
    inputType: QBAY_GET_INFO_OF_NFT_BY_ID_INPUT_TYPE,
    inputSize: QBAY_GET_INFO_OF_NFT_BY_ID_INPUT_SIZE,
    inputFields: QBAY_GET_INFO_OF_NFT_BY_ID_INPUT_FIELDS,
    outputFields: QBAY_GET_INFO_OF_NFT_BY_ID_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QBAY_GET_USER_CREATED_COLLECTION_INPUT_TYPE = 8
export const QBAY_GET_USER_CREATED_COLLECTION_INPUT_SIZE = 40

export interface QbayGetUserCreatedCollectionInput {
  user: string
  offset: number
  count: number
}

const QBAY_GET_USER_CREATED_COLLECTION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'user',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'offset',
    type: 'uint32',
    offset: 32,
    byteLength: 4,
  },
  {
    name: 'count',
    type: 'uint32',
    offset: 36,
    byteLength: 4,
  },
]

export function buildQbayGetUserCreatedCollectionInput(
  input: QbayGetUserCreatedCollectionInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(QBAY_GET_USER_CREATED_COLLECTION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QbayGetUserCreatedCollectionOutput {
  collectionId: number[]
}

const QBAY_GET_USER_CREATED_COLLECTION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'collectionId',
    type: 'array',
    offset: 0,
    byteLength: 4096,
    arrayLength: 1024,
    arrayItemType: 'uint32',
    arrayItemByteLength: 4,
  },
]

export function decodeQbayGetUserCreatedCollectionOutput(
  data: Uint8Array,
): QbayGetUserCreatedCollectionOutput {
  return decodePayload(data, QBAY_GET_USER_CREATED_COLLECTION_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayGetUserCreatedCollectionOutput
}

export async function qbayGetUserCreatedCollection(
  live: SmartContractCaller,
  input: QbayGetUserCreatedCollectionInput,
  options?: ContractCallOptions,
): Promise<Result<QbayGetUserCreatedCollectionOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QBAY_CONTRACT_INDEX,
    inputType: QBAY_GET_USER_CREATED_COLLECTION_INPUT_TYPE,
    inputSize: QBAY_GET_USER_CREATED_COLLECTION_INPUT_SIZE,
    inputFields: QBAY_GET_USER_CREATED_COLLECTION_INPUT_FIELDS,
    outputFields: QBAY_GET_USER_CREATED_COLLECTION_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QBAY_GET_USER_CREATED_NFT_INPUT_TYPE = 9
export const QBAY_GET_USER_CREATED_NFT_INPUT_SIZE = 40

export interface QbayGetUserCreatedNFTInput {
  user: string
  offset: number
  count: number
}

const QBAY_GET_USER_CREATED_NFT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'user',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'offset',
    type: 'uint32',
    offset: 32,
    byteLength: 4,
  },
  {
    name: 'count',
    type: 'uint32',
    offset: 36,
    byteLength: 4,
  },
]

export function buildQbayGetUserCreatedNFTInput(
  input: QbayGetUserCreatedNFTInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(QBAY_GET_USER_CREATED_NFT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QbayGetUserCreatedNFTOutput {
  NFTId: number[]
}

const QBAY_GET_USER_CREATED_NFT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'NFTId',
    type: 'array',
    offset: 0,
    byteLength: 4096,
    arrayLength: 1024,
    arrayItemType: 'uint32',
    arrayItemByteLength: 4,
  },
]

export function decodeQbayGetUserCreatedNFTOutput(
  data: Uint8Array,
): QbayGetUserCreatedNFTOutput {
  return decodePayload(data, QBAY_GET_USER_CREATED_NFT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as QbayGetUserCreatedNFTOutput
}

export async function qbayGetUserCreatedNFT(
  live: SmartContractCaller,
  input: QbayGetUserCreatedNFTInput,
  options?: ContractCallOptions,
): Promise<Result<QbayGetUserCreatedNFTOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QBAY_CONTRACT_INDEX,
    inputType: QBAY_GET_USER_CREATED_NFT_INPUT_TYPE,
    inputSize: QBAY_GET_USER_CREATED_NFT_INPUT_SIZE,
    inputFields: QBAY_GET_USER_CREATED_NFT_INPUT_FIELDS,
    outputFields: QBAY_GET_USER_CREATED_NFT_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const qbay = {
  contractIndex: QBAY_CONTRACT_INDEX,
  getNumberOfNFTForUser: qbayGetNumberOfNFTForUser,
  getInfoOfNFTUserPossessed: qbayGetInfoOfNFTUserPossessed,
  getInfoOfMarketplace: qbayGetInfoOfMarketplace,
  getInfoOfCollectionByCreator: qbayGetInfoOfCollectionByCreator,
  getInfoOfCollectionById: qbayGetInfoOfCollectionById,
  getIncomingAuctions: qbayGetIncomingAuctions,
  getInfoOfNFTById: qbayGetInfoOfNFTById,
  getUserCreatedCollection: qbayGetUserCreatedCollection,
  getUserCreatedNFT: qbayGetUserCreatedNFT,
  buildSettingCFBAndQubicPriceInput: buildQbaySettingCFBAndQubicPriceInput,
  decodeSettingCFBAndQubicPriceOutput: decodeQbaySettingCFBAndQubicPriceOutput,
  buildCreateCollectionInput: buildQbayCreateCollectionInput,
  decodeCreateCollectionOutput: decodeQbayCreateCollectionOutput,
  buildMintInput: buildQbayMintInput,
  decodeMintOutput: decodeQbayMintOutput,
  buildMintOfDropInput: buildQbayMintOfDropInput,
  decodeMintOfDropOutput: decodeQbayMintOfDropOutput,
  buildTransferInput: buildQbayTransferInput,
  decodeTransferOutput: decodeQbayTransferOutput,
  buildListInMarketInput: buildQbayListInMarketInput,
  decodeListInMarketOutput: decodeQbayListInMarketOutput,
  buildBuyInput: buildQbayBuyInput,
  decodeBuyOutput: decodeQbayBuyOutput,
  buildCancelSaleInput: buildQbayCancelSaleInput,
  decodeCancelSaleOutput: decodeQbayCancelSaleOutput,
  buildListInExchangeInput: buildQbayListInExchangeInput,
  decodeListInExchangeOutput: decodeQbayListInExchangeOutput,
  buildCancelExchangeInput: buildQbayCancelExchangeInput,
  decodeCancelExchangeOutput: decodeQbayCancelExchangeOutput,
  buildMakeOfferInput: buildQbayMakeOfferInput,
  decodeMakeOfferOutput: decodeQbayMakeOfferOutput,
  buildAcceptOfferInput: buildQbayAcceptOfferInput,
  decodeAcceptOfferOutput: decodeQbayAcceptOfferOutput,
  buildCancelOfferInput: buildQbayCancelOfferInput,
  decodeCancelOfferOutput: decodeQbayCancelOfferOutput,
  buildCreateTraditionalAuctionInput: buildQbayCreateTraditionalAuctionInput,
  decodeCreateTraditionalAuctionOutput: decodeQbayCreateTraditionalAuctionOutput,
  buildBidOnTraditionalAuctionInput: buildQbayBidOnTraditionalAuctionInput,
  decodeBidOnTraditionalAuctionOutput: decodeQbayBidOnTraditionalAuctionOutput,
  buildTransferShareManagementRightsInput: buildQbayTransferShareManagementRightsInput,
  decodeTransferShareManagementRightsOutput: decodeQbayTransferShareManagementRightsOutput,
  buildChangeStatusOfMarketPlaceInput: buildQbayChangeStatusOfMarketPlaceInput,
  decodeChangeStatusOfMarketPlaceOutput: decodeQbayChangeStatusOfMarketPlaceOutput,
}

