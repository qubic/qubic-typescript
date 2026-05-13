// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/registry'
import { buildPayload, decodePayload } from '@qubic.ts/registry'
import type { QubicRpcError } from '@qubic.ts/rpc'
import { type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '../result.js'

export const Q_RWA_CONTRACT_INDEX = 20

export interface QRWAQRWAGovParamsStruct {
  mAdminAddress: string
  electricityAddress: string
  maintenanceAddress: string
  reinvestmentAddress: string
  qmineDevAddress: string
  electricityPercent: bigint
  maintenancePercent: bigint
  reinvestmentPercent: bigint
}

export interface QRWAAssetStruct {
  issuer: string
  assetName: bigint
}

export interface QRWAQRWAGovProposalStruct {
  proposalId: bigint
  status: bigint
  score: bigint
  params: QRWAQRWAGovParamsStruct
}

export interface QRWAQRWAPayoutEntryStruct {
  recipient: string
  amount: bigint
  qmineHolding: bigint
  qrwaHolding: bigint
  tick: number
  epoch: number
  payoutType: number
}

const STRUCTS: Record<string, NamedStruct> = {
  QRWAGovParams: {
  name: 'QRWAGovParams',
  byteLength: 184,
  fields: [
    {
      name: 'mAdminAddress',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'electricityAddress',
      type: 'id',
      offset: 32,
      byteLength: 32,
    },
    {
      name: 'maintenanceAddress',
      type: 'id',
      offset: 64,
      byteLength: 32,
    },
    {
      name: 'reinvestmentAddress',
      type: 'id',
      offset: 96,
      byteLength: 32,
    },
    {
      name: 'qmineDevAddress',
      type: 'id',
      offset: 128,
      byteLength: 32,
    },
    {
      name: 'electricityPercent',
      type: 'uint64',
      offset: 160,
      byteLength: 8,
    },
    {
      name: 'maintenancePercent',
      type: 'uint64',
      offset: 168,
      byteLength: 8,
    },
    {
      name: 'reinvestmentPercent',
      type: 'uint64',
      offset: 176,
      byteLength: 8,
    },
],
},
  Asset: {
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
  QRWAGovProposal: {
  name: 'QRWAGovProposal',
  byteLength: 208,
  fields: [
    {
      name: 'proposalId',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'status',
      type: 'uint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'score',
      type: 'uint64',
      offset: 16,
      byteLength: 8,
    },
    {
      name: 'params',
      type: 'struct',
      offset: 24,
      byteLength: 184,
      structRef: 'QRWAGovParams',
    },
],
},
  QRWAPayoutEntry: {
  name: 'QRWAPayoutEntry',
  byteLength: 63,
  fields: [
    {
      name: 'recipient',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'amount',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'qmineHolding',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'qrwaHolding',
      type: 'uint64',
      offset: 48,
      byteLength: 8,
    },
    {
      name: 'tick',
      type: 'uint32',
      offset: 56,
      byteLength: 4,
    },
    {
      name: 'epoch',
      type: 'uint16',
      offset: 60,
      byteLength: 2,
    },
    {
      name: 'payoutType',
      type: 'uint8',
      offset: 62,
      byteLength: 1,
    },
],
},
}

export const Q_RWA_DONATE_TO_TREASURY_INPUT_TYPE = 1

export interface QRWADonateToTreasuryInput {
  amount: bigint
}

const Q_RWA_DONATE_TO_TREASURY_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQRWADonateToTreasuryInput(
  input: QRWADonateToTreasuryInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_DONATE_TO_TREASURY_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWADonateToTreasuryOutput {
  status: bigint
}

const Q_RWA_DONATE_TO_TREASURY_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQRWADonateToTreasuryOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWADonateToTreasuryOutput {
  return decodePayload(data, Q_RWA_DONATE_TO_TREASURY_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWADonateToTreasuryOutput
}

export const Q_RWA_VOTE_GOV_PARAMS_INPUT_TYPE = 2

export interface QRWAVoteGovParamsInput {
  proposal: QRWAQRWAGovParamsStruct
}

const Q_RWA_VOTE_GOV_PARAMS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposal',
    type: 'struct',
    offset: 0,
    byteLength: 184,
    structRef: 'QRWAGovParams',
  },
]

export function buildQRWAVoteGovParamsInput(
  input: QRWAVoteGovParamsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_VOTE_GOV_PARAMS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWAVoteGovParamsOutput {
  status: bigint
}

const Q_RWA_VOTE_GOV_PARAMS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQRWAVoteGovParamsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAVoteGovParamsOutput {
  return decodePayload(data, Q_RWA_VOTE_GOV_PARAMS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAVoteGovParamsOutput
}

export const Q_RWA_DEPOSIT_GENERAL_ASSET_INPUT_TYPE = 3

export interface QRWADepositGeneralAssetInput {
  asset: QRWAAssetStruct
  amount: bigint
}

const Q_RWA_DEPOSIT_GENERAL_ASSET_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'asset',
    type: 'struct',
    offset: 0,
    byteLength: 40,
    structRef: 'Asset',
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQRWADepositGeneralAssetInput(
  input: QRWADepositGeneralAssetInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_DEPOSIT_GENERAL_ASSET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWADepositGeneralAssetOutput {
  status: bigint
}

const Q_RWA_DEPOSIT_GENERAL_ASSET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQRWADepositGeneralAssetOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWADepositGeneralAssetOutput {
  return decodePayload(data, Q_RWA_DEPOSIT_GENERAL_ASSET_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWADepositGeneralAssetOutput
}

export const Q_RWA_REVOKE_ASSET_MANAGEMENT_RIGHTS_INPUT_TYPE = 4

export interface QRWARevokeAssetManagementRightsInput {
  asset: QRWAAssetStruct
  numberOfShares: bigint
}

const Q_RWA_REVOKE_ASSET_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
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
]

export function buildQRWARevokeAssetManagementRightsInput(
  input: QRWARevokeAssetManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_REVOKE_ASSET_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWARevokeAssetManagementRightsOutput {
  transferredNumberOfShares: bigint
  status: bigint
}

const Q_RWA_REVOKE_ASSET_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'status',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function decodeQRWARevokeAssetManagementRightsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWARevokeAssetManagementRightsOutput {
  return decodePayload(data, Q_RWA_REVOKE_ASSET_MANAGEMENT_RIGHTS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWARevokeAssetManagementRightsOutput
}

export const Q_RWA_SET_POOL_A_REVENUE_ADDRESS_INPUT_TYPE = 5

export interface QRWASetPoolARevenueAddressInput {
  newAddress: string
}

const Q_RWA_SET_POOL_A_REVENUE_ADDRESS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newAddress',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQRWASetPoolARevenueAddressInput(
  input: QRWASetPoolARevenueAddressInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_SET_POOL_A_REVENUE_ADDRESS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWASetPoolARevenueAddressOutput {
  status: bigint
}

const Q_RWA_SET_POOL_A_REVENUE_ADDRESS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQRWASetPoolARevenueAddressOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWASetPoolARevenueAddressOutput {
  return decodePayload(data, Q_RWA_SET_POOL_A_REVENUE_ADDRESS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWASetPoolARevenueAddressOutput
}

export const Q_RWA_SET_POOL_D_REVENUE_ADDRESS_INPUT_TYPE = 6

export interface QRWASetPoolDRevenueAddressInput {
  newAddress: string
}

const Q_RWA_SET_POOL_D_REVENUE_ADDRESS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newAddress',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQRWASetPoolDRevenueAddressInput(
  input: QRWASetPoolDRevenueAddressInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_SET_POOL_D_REVENUE_ADDRESS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWASetPoolDRevenueAddressOutput {
  status: bigint
}

const Q_RWA_SET_POOL_D_REVENUE_ADDRESS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQRWASetPoolDRevenueAddressOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWASetPoolDRevenueAddressOutput {
  return decodePayload(data, Q_RWA_SET_POOL_D_REVENUE_ADDRESS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWASetPoolDRevenueAddressOutput
}

export const Q_RWA_GET_GOV_PARAMS_INPUT_TYPE = 7
export const Q_RWA_GET_GOV_PARAMS_INPUT_SIZE = 0

export interface QRWAGetGovParamsOutput {
  params: QRWAQRWAGovParamsStruct
}

const Q_RWA_GET_GOV_PARAMS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'params',
    type: 'struct',
    offset: 0,
    byteLength: 184,
    structRef: 'QRWAGovParams',
  },
]

export function decodeQRWAGetGovParamsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetGovParamsOutput {
  return decodePayload(data, Q_RWA_GET_GOV_PARAMS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetGovParamsOutput
}

export async function qRWAGetGovParams(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetGovParamsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_GOV_PARAMS_INPUT_TYPE,
    inputSize: Q_RWA_GET_GOV_PARAMS_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_RWA_GET_GOV_PARAMS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_RWA_GET_GOV_POLL_INPUT_TYPE = 8
export const Q_RWA_GET_GOV_POLL_INPUT_SIZE = 8

export interface QRWAGetGovPollInput {
  proposalId: bigint
}

const Q_RWA_GET_GOV_POLL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQRWAGetGovPollInput(
  input: QRWAGetGovPollInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_GET_GOV_POLL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWAGetGovPollOutput {
  proposal: QRWAQRWAGovProposalStruct
  status: bigint
}

const Q_RWA_GET_GOV_POLL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposal',
    type: 'struct',
    offset: 0,
    byteLength: 208,
    structRef: 'QRWAGovProposal',
  },
  {
    name: 'status',
    type: 'uint64',
    offset: 208,
    byteLength: 8,
  },
]

export function decodeQRWAGetGovPollOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetGovPollOutput {
  return decodePayload(data, Q_RWA_GET_GOV_POLL_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetGovPollOutput
}

export async function qRWAGetGovPoll(
  live: SmartContractCaller,
  input: QRWAGetGovPollInput,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetGovPollOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_GOV_POLL_INPUT_TYPE,
    inputSize: Q_RWA_GET_GOV_POLL_INPUT_SIZE,
    inputFields: Q_RWA_GET_GOV_POLL_INPUT_FIELDS,
    outputFields: Q_RWA_GET_GOV_POLL_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RWA_GET_TREASURY_BALANCE_INPUT_TYPE = 9
export const Q_RWA_GET_TREASURY_BALANCE_INPUT_SIZE = 0

export interface QRWAGetTreasuryBalanceOutput {
  balance: bigint
}

const Q_RWA_GET_TREASURY_BALANCE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'balance',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQRWAGetTreasuryBalanceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetTreasuryBalanceOutput {
  return decodePayload(data, Q_RWA_GET_TREASURY_BALANCE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetTreasuryBalanceOutput
}

export async function qRWAGetTreasuryBalance(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetTreasuryBalanceOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_TREASURY_BALANCE_INPUT_TYPE,
    inputSize: Q_RWA_GET_TREASURY_BALANCE_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_RWA_GET_TREASURY_BALANCE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_RWA_GET_DIVIDEND_BALANCES_INPUT_TYPE = 10
export const Q_RWA_GET_DIVIDEND_BALANCES_INPUT_SIZE = 0

export interface QRWAGetDividendBalancesOutput {
  revenuePoolA: bigint
  revenuePoolB: bigint
  dedicatedRevenuePool: bigint
  poolAQmineDividend: bigint
  poolAQrwaDividend: bigint
  poolBQmineDividend: bigint
  poolBQrwaDividend: bigint
  poolCQmineDividend: bigint
  poolCQrwaDividend: bigint
  poolDRevenuePool: bigint
  poolDQmineDividend: bigint
  poolDQrwaDividend: bigint
}

const Q_RWA_GET_DIVIDEND_BALANCES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'revenuePoolA',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'revenuePoolB',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'dedicatedRevenuePool',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'poolAQmineDividend',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'poolAQrwaDividend',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'poolBQmineDividend',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'poolBQrwaDividend',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'poolCQmineDividend',
    type: 'uint64',
    offset: 56,
    byteLength: 8,
  },
  {
    name: 'poolCQrwaDividend',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: 'poolDRevenuePool',
    type: 'uint64',
    offset: 72,
    byteLength: 8,
  },
  {
    name: 'poolDQmineDividend',
    type: 'uint64',
    offset: 80,
    byteLength: 8,
  },
  {
    name: 'poolDQrwaDividend',
    type: 'uint64',
    offset: 88,
    byteLength: 8,
  },
]

export function decodeQRWAGetDividendBalancesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetDividendBalancesOutput {
  return decodePayload(data, Q_RWA_GET_DIVIDEND_BALANCES_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetDividendBalancesOutput
}

export async function qRWAGetDividendBalances(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetDividendBalancesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_DIVIDEND_BALANCES_INPUT_TYPE,
    inputSize: Q_RWA_GET_DIVIDEND_BALANCES_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_RWA_GET_DIVIDEND_BALANCES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_RWA_GET_TOTAL_DISTRIBUTED_INPUT_TYPE = 11
export const Q_RWA_GET_TOTAL_DISTRIBUTED_INPUT_SIZE = 0

export interface QRWAGetTotalDistributedOutput {
  totalPoolADistributed: bigint
  totalPoolBDistributed: bigint
  totalPoolCDistributed: bigint
  totalPoolDDistributed: bigint
  payoutTotalQmineBegin: bigint
}

const Q_RWA_GET_TOTAL_DISTRIBUTED_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'totalPoolADistributed',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'totalPoolBDistributed',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'totalPoolCDistributed',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'totalPoolDDistributed',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'payoutTotalQmineBegin',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
]

export function decodeQRWAGetTotalDistributedOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetTotalDistributedOutput {
  return decodePayload(data, Q_RWA_GET_TOTAL_DISTRIBUTED_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetTotalDistributedOutput
}

export async function qRWAGetTotalDistributed(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetTotalDistributedOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_TOTAL_DISTRIBUTED_INPUT_TYPE,
    inputSize: Q_RWA_GET_TOTAL_DISTRIBUTED_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_RWA_GET_TOTAL_DISTRIBUTED_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_RWA_GET_CONTRACT_ADDRESSES_INPUT_TYPE = 12
export const Q_RWA_GET_CONTRACT_ADDRESSES_INPUT_SIZE = 0

export interface QRWAGetContractAddressesOutput {
  dedicatedRevenueAddress: string
  poolARevenueAddress: string
  poolDRevenueAddress: string
  fundraisingAddress: string
  exchangeAddress: string
}

const Q_RWA_GET_CONTRACT_ADDRESSES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'dedicatedRevenueAddress',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'poolARevenueAddress',
    type: 'id',
    offset: 32,
    byteLength: 32,
  },
  {
    name: 'poolDRevenueAddress',
    type: 'id',
    offset: 64,
    byteLength: 32,
  },
  {
    name: 'fundraisingAddress',
    type: 'id',
    offset: 96,
    byteLength: 32,
  },
  {
    name: 'exchangeAddress',
    type: 'id',
    offset: 128,
    byteLength: 32,
  },
]

export function decodeQRWAGetContractAddressesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetContractAddressesOutput {
  return decodePayload(data, Q_RWA_GET_CONTRACT_ADDRESSES_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetContractAddressesOutput
}

export async function qRWAGetContractAddresses(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetContractAddressesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_CONTRACT_ADDRESSES_INPUT_TYPE,
    inputSize: Q_RWA_GET_CONTRACT_ADDRESSES_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_RWA_GET_CONTRACT_ADDRESSES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_RWA_GET_ACTIVE_GOV_POLL_IDS_INPUT_TYPE = 13
export const Q_RWA_GET_ACTIVE_GOV_POLL_IDS_INPUT_SIZE = 0

export interface QRWAGetActiveGovPollIdsOutput {
  count: bigint
  ids: bigint[]
}

const Q_RWA_GET_ACTIVE_GOV_POLL_IDS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'count',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'ids',
    type: 'array',
    offset: 8,
    byteLength: 512,
    arrayLength: 64,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
]

export function decodeQRWAGetActiveGovPollIdsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetActiveGovPollIdsOutput {
  return decodePayload(data, Q_RWA_GET_ACTIVE_GOV_POLL_IDS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetActiveGovPollIdsOutput
}

export async function qRWAGetActiveGovPollIds(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetActiveGovPollIdsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_ACTIVE_GOV_POLL_IDS_INPUT_TYPE,
    inputSize: Q_RWA_GET_ACTIVE_GOV_POLL_IDS_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_RWA_GET_ACTIVE_GOV_POLL_IDS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_RWA_GET_GENERAL_ASSET_BALANCE_INPUT_TYPE = 14
export const Q_RWA_GET_GENERAL_ASSET_BALANCE_INPUT_SIZE = 40

export interface QRWAGetGeneralAssetBalanceInput {
  asset: QRWAAssetStruct
}

const Q_RWA_GET_GENERAL_ASSET_BALANCE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'asset',
    type: 'struct',
    offset: 0,
    byteLength: 40,
    structRef: 'Asset',
  },
]

export function buildQRWAGetGeneralAssetBalanceInput(
  input: QRWAGetGeneralAssetBalanceInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_GET_GENERAL_ASSET_BALANCE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWAGetGeneralAssetBalanceOutput {
  balance: bigint
  status: bigint
}

const Q_RWA_GET_GENERAL_ASSET_BALANCE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'balance',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'status',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function decodeQRWAGetGeneralAssetBalanceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetGeneralAssetBalanceOutput {
  return decodePayload(data, Q_RWA_GET_GENERAL_ASSET_BALANCE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetGeneralAssetBalanceOutput
}

export async function qRWAGetGeneralAssetBalance(
  live: SmartContractCaller,
  input: QRWAGetGeneralAssetBalanceInput,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetGeneralAssetBalanceOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_GENERAL_ASSET_BALANCE_INPUT_TYPE,
    inputSize: Q_RWA_GET_GENERAL_ASSET_BALANCE_INPUT_SIZE,
    inputFields: Q_RWA_GET_GENERAL_ASSET_BALANCE_INPUT_FIELDS,
    outputFields: Q_RWA_GET_GENERAL_ASSET_BALANCE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RWA_GET_GENERAL_ASSETS_INPUT_TYPE = 15
export const Q_RWA_GET_GENERAL_ASSETS_INPUT_SIZE = 0

export interface QRWAGetGeneralAssetsOutput {
  count: bigint
  assets: number[]
  balances: bigint[]
}

const Q_RWA_GET_GENERAL_ASSETS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'count',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'assets',
    type: 'array',
    offset: 8,
    byteLength: 40960,
    arrayLength: 1024,
    arrayItemByteLength: 40,
    arrayItemStructRef: 'Asset',
  },
  {
    name: 'balances',
    type: 'array',
    offset: 40968,
    byteLength: 8192,
    arrayLength: 1024,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
]

export function decodeQRWAGetGeneralAssetsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetGeneralAssetsOutput {
  return decodePayload(data, Q_RWA_GET_GENERAL_ASSETS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetGeneralAssetsOutput
}

export async function qRWAGetGeneralAssets(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetGeneralAssetsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_GENERAL_ASSETS_INPUT_TYPE,
    inputSize: Q_RWA_GET_GENERAL_ASSETS_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_RWA_GET_GENERAL_ASSETS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_RWA_GET_SC_DIVIDEND_TRACKING_INPUT_TYPE = 16
export const Q_RWA_GET_SC_DIVIDEND_TRACKING_INPUT_SIZE = 0

export interface QRWAGetScDividendTrackingOutput {
  count: bigint
  scContractIds: string[]
  cumulativeDividends: bigint[]
}

const Q_RWA_GET_SC_DIVIDEND_TRACKING_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'count',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'scContractIds',
    type: 'array',
    offset: 8,
    byteLength: 32768,
    arrayLength: 1024,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
  {
    name: 'cumulativeDividends',
    type: 'array',
    offset: 32776,
    byteLength: 8192,
    arrayLength: 1024,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
]

export function decodeQRWAGetScDividendTrackingOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetScDividendTrackingOutput {
  return decodePayload(data, Q_RWA_GET_SC_DIVIDEND_TRACKING_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetScDividendTrackingOutput
}

export async function qRWAGetScDividendTracking(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetScDividendTrackingOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_SC_DIVIDEND_TRACKING_INPUT_TYPE,
    inputSize: Q_RWA_GET_SC_DIVIDEND_TRACKING_INPUT_SIZE,
    inputFields: [],
    outputFields: Q_RWA_GET_SC_DIVIDEND_TRACKING_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const Q_RWA_GET_PAYOUTS_QMINE_INPUT_TYPE = 17
export const Q_RWA_GET_PAYOUTS_QMINE_INPUT_SIZE = 2

export interface QRWAGetPayoutsQmineInput {
  page: number
}

const Q_RWA_GET_PAYOUTS_QMINE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'page',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildQRWAGetPayoutsQmineInput(
  input: QRWAGetPayoutsQmineInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_GET_PAYOUTS_QMINE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWAGetPayoutsQmineOutput {
  payouts: number[]
  nextIdx: number
  returnedCount: number
  page: number
  totalPages: number
}

const Q_RWA_GET_PAYOUTS_QMINE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'payouts',
    type: 'array',
    offset: 0,
    byteLength: 32256,
    arrayLength: 512,
    arrayItemByteLength: 63,
    arrayItemStructRef: 'QRWAPayoutEntry',
  },
  {
    name: 'nextIdx',
    type: 'uint16',
    offset: 32256,
    byteLength: 2,
  },
  {
    name: 'returnedCount',
    type: 'uint16',
    offset: 32258,
    byteLength: 2,
  },
  {
    name: 'page',
    type: 'uint16',
    offset: 32260,
    byteLength: 2,
  },
  {
    name: 'totalPages',
    type: 'uint16',
    offset: 32262,
    byteLength: 2,
  },
]

export function decodeQRWAGetPayoutsQmineOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetPayoutsQmineOutput {
  return decodePayload(data, Q_RWA_GET_PAYOUTS_QMINE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetPayoutsQmineOutput
}

export async function qRWAGetPayoutsQmine(
  live: SmartContractCaller,
  input: QRWAGetPayoutsQmineInput,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetPayoutsQmineOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_PAYOUTS_QMINE_INPUT_TYPE,
    inputSize: Q_RWA_GET_PAYOUTS_QMINE_INPUT_SIZE,
    inputFields: Q_RWA_GET_PAYOUTS_QMINE_INPUT_FIELDS,
    outputFields: Q_RWA_GET_PAYOUTS_QMINE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RWA_GET_PAYOUTS_QRWA_INPUT_TYPE = 18
export const Q_RWA_GET_PAYOUTS_QRWA_INPUT_SIZE = 2

export interface QRWAGetPayoutsQrwaInput {
  page: number
}

const Q_RWA_GET_PAYOUTS_QRWA_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'page',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildQRWAGetPayoutsQrwaInput(
  input: QRWAGetPayoutsQrwaInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_GET_PAYOUTS_QRWA_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWAGetPayoutsQrwaOutput {
  payouts: number[]
  nextIdx: number
  returnedCount: number
  page: number
  totalPages: number
}

const Q_RWA_GET_PAYOUTS_QRWA_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'payouts',
    type: 'array',
    offset: 0,
    byteLength: 32256,
    arrayLength: 512,
    arrayItemByteLength: 63,
    arrayItemStructRef: 'QRWAPayoutEntry',
  },
  {
    name: 'nextIdx',
    type: 'uint16',
    offset: 32256,
    byteLength: 2,
  },
  {
    name: 'returnedCount',
    type: 'uint16',
    offset: 32258,
    byteLength: 2,
  },
  {
    name: 'page',
    type: 'uint16',
    offset: 32260,
    byteLength: 2,
  },
  {
    name: 'totalPages',
    type: 'uint16',
    offset: 32262,
    byteLength: 2,
  },
]

export function decodeQRWAGetPayoutsQrwaOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetPayoutsQrwaOutput {
  return decodePayload(data, Q_RWA_GET_PAYOUTS_QRWA_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetPayoutsQrwaOutput
}

export async function qRWAGetPayoutsQrwa(
  live: SmartContractCaller,
  input: QRWAGetPayoutsQrwaInput,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetPayoutsQrwaOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_PAYOUTS_QRWA_INPUT_TYPE,
    inputSize: Q_RWA_GET_PAYOUTS_QRWA_INPUT_SIZE,
    inputFields: Q_RWA_GET_PAYOUTS_QRWA_INPUT_FIELDS,
    outputFields: Q_RWA_GET_PAYOUTS_QRWA_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RWA_GET_PAYOUTS_DEDICATED_INPUT_TYPE = 19
export const Q_RWA_GET_PAYOUTS_DEDICATED_INPUT_SIZE = 2

export interface QRWAGetPayoutsDedicatedInput {
  page: number
}

const Q_RWA_GET_PAYOUTS_DEDICATED_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'page',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildQRWAGetPayoutsDedicatedInput(
  input: QRWAGetPayoutsDedicatedInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_GET_PAYOUTS_DEDICATED_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWAGetPayoutsDedicatedOutput {
  payouts: number[]
  nextIdx: number
  returnedCount: number
  page: number
  totalPages: number
}

const Q_RWA_GET_PAYOUTS_DEDICATED_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'payouts',
    type: 'array',
    offset: 0,
    byteLength: 32256,
    arrayLength: 512,
    arrayItemByteLength: 63,
    arrayItemStructRef: 'QRWAPayoutEntry',
  },
  {
    name: 'nextIdx',
    type: 'uint16',
    offset: 32256,
    byteLength: 2,
  },
  {
    name: 'returnedCount',
    type: 'uint16',
    offset: 32258,
    byteLength: 2,
  },
  {
    name: 'page',
    type: 'uint16',
    offset: 32260,
    byteLength: 2,
  },
  {
    name: 'totalPages',
    type: 'uint16',
    offset: 32262,
    byteLength: 2,
  },
]

export function decodeQRWAGetPayoutsDedicatedOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetPayoutsDedicatedOutput {
  return decodePayload(data, Q_RWA_GET_PAYOUTS_DEDICATED_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetPayoutsDedicatedOutput
}

export async function qRWAGetPayoutsDedicated(
  live: SmartContractCaller,
  input: QRWAGetPayoutsDedicatedInput,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetPayoutsDedicatedOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_PAYOUTS_DEDICATED_INPUT_TYPE,
    inputSize: Q_RWA_GET_PAYOUTS_DEDICATED_INPUT_SIZE,
    inputFields: Q_RWA_GET_PAYOUTS_DEDICATED_INPUT_FIELDS,
    outputFields: Q_RWA_GET_PAYOUTS_DEDICATED_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const Q_RWA_GET_PAYOUTS_POOL_D_INPUT_TYPE = 20
export const Q_RWA_GET_PAYOUTS_POOL_D_INPUT_SIZE = 2

export interface QRWAGetPayoutsPoolDInput {
  page: number
}

const Q_RWA_GET_PAYOUTS_POOL_D_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'page',
    type: 'uint16',
    offset: 0,
    byteLength: 2,
  },
]

export function buildQRWAGetPayoutsPoolDInput(
  input: QRWAGetPayoutsPoolDInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(Q_RWA_GET_PAYOUTS_POOL_D_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QRWAGetPayoutsPoolDOutput {
  payouts: number[]
  nextIdx: number
  returnedCount: number
  page: number
  totalPages: number
}

const Q_RWA_GET_PAYOUTS_POOL_D_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'payouts',
    type: 'array',
    offset: 0,
    byteLength: 32256,
    arrayLength: 512,
    arrayItemByteLength: 63,
    arrayItemStructRef: 'QRWAPayoutEntry',
  },
  {
    name: 'nextIdx',
    type: 'uint16',
    offset: 32256,
    byteLength: 2,
  },
  {
    name: 'returnedCount',
    type: 'uint16',
    offset: 32258,
    byteLength: 2,
  },
  {
    name: 'page',
    type: 'uint16',
    offset: 32260,
    byteLength: 2,
  },
  {
    name: 'totalPages',
    type: 'uint16',
    offset: 32262,
    byteLength: 2,
  },
]

export function decodeQRWAGetPayoutsPoolDOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QRWAGetPayoutsPoolDOutput {
  return decodePayload(data, Q_RWA_GET_PAYOUTS_POOL_D_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QRWAGetPayoutsPoolDOutput
}

export async function qRWAGetPayoutsPoolD(
  live: SmartContractCaller,
  input: QRWAGetPayoutsPoolDInput,
  options?: ContractCallOptions,
): Promise<Result<QRWAGetPayoutsPoolDOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: Q_RWA_CONTRACT_INDEX,
    inputType: Q_RWA_GET_PAYOUTS_POOL_D_INPUT_TYPE,
    inputSize: Q_RWA_GET_PAYOUTS_POOL_D_INPUT_SIZE,
    inputFields: Q_RWA_GET_PAYOUTS_POOL_D_INPUT_FIELDS,
    outputFields: Q_RWA_GET_PAYOUTS_POOL_D_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const qRWA = {
  contractIndex: Q_RWA_CONTRACT_INDEX,
  GetGovParams: qRWAGetGovParams,
  GetGovPoll: qRWAGetGovPoll,
  GetTreasuryBalance: qRWAGetTreasuryBalance,
  GetDividendBalances: qRWAGetDividendBalances,
  GetTotalDistributed: qRWAGetTotalDistributed,
  GetContractAddresses: qRWAGetContractAddresses,
  GetActiveGovPollIds: qRWAGetActiveGovPollIds,
  GetGeneralAssetBalance: qRWAGetGeneralAssetBalance,
  GetGeneralAssets: qRWAGetGeneralAssets,
  GetScDividendTracking: qRWAGetScDividendTracking,
  GetPayoutsQmine: qRWAGetPayoutsQmine,
  GetPayoutsQrwa: qRWAGetPayoutsQrwa,
  GetPayoutsDedicated: qRWAGetPayoutsDedicated,
  GetPayoutsPoolD: qRWAGetPayoutsPoolD,
  buildDonateToTreasuryInput: buildQRWADonateToTreasuryInput,
  decodeDonateToTreasuryOutput: decodeQRWADonateToTreasuryOutput,
  buildVoteGovParamsInput: buildQRWAVoteGovParamsInput,
  decodeVoteGovParamsOutput: decodeQRWAVoteGovParamsOutput,
  buildDepositGeneralAssetInput: buildQRWADepositGeneralAssetInput,
  decodeDepositGeneralAssetOutput: decodeQRWADepositGeneralAssetOutput,
  buildRevokeAssetManagementRightsInput: buildQRWARevokeAssetManagementRightsInput,
  decodeRevokeAssetManagementRightsOutput: decodeQRWARevokeAssetManagementRightsOutput,
  buildSetPoolARevenueAddressInput: buildQRWASetPoolARevenueAddressInput,
  decodeSetPoolARevenueAddressOutput: decodeQRWASetPoolARevenueAddressOutput,
  buildSetPoolDRevenueAddressInput: buildQRWASetPoolDRevenueAddressInput,
  decodeSetPoolDRevenueAddressOutput: decodeQRWASetPoolDRevenueAddressOutput,
}

