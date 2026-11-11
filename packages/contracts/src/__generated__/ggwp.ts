// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '@qubic.org/types'

export const GGWP_CONTRACT_INDEX = 28

const STRUCTS: Record<string, NamedStruct> = {}

export const GGWP_DEPOSIT_REVENUE_INPUT_TYPE = 1

export interface GGWPDepositRevenueOutput {
  returnCode: number
}

const GGWP_DEPOSIT_REVENUE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGGWPDepositRevenueOutput(
  data: Uint8Array,
): GGWPDepositRevenueOutput {
  return decodePayload(data, GGWP_DEPOSIT_REVENUE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPDepositRevenueOutput
}

export const GGWP_ADD_CLAN_MEMBER_INPUT_TYPE = 2

export interface GGWPAddClanMemberInput {
  memberAddress: string
  rank: bigint
}

const GGWP_ADD_CLAN_MEMBER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'memberAddress',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'rank',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
]

export function buildGGWPAddClanMemberInput(
  input: GGWPAddClanMemberInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: GGWP_CONTRACT_INDEX, inputType: GGWP_ADD_CLAN_MEMBER_INPUT_TYPE, payload: buildPayload(GGWP_ADD_CLAN_MEMBER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface GGWPAddClanMemberOutput {
  returnCode: number
}

const GGWP_ADD_CLAN_MEMBER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGGWPAddClanMemberOutput(
  data: Uint8Array,
): GGWPAddClanMemberOutput {
  return decodePayload(data, GGWP_ADD_CLAN_MEMBER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPAddClanMemberOutput
}

export const GGWP_REMOVE_CLAN_MEMBER_INPUT_TYPE = 3

export interface GGWPRemoveClanMemberInput {
  memberAddress: string
}

const GGWP_REMOVE_CLAN_MEMBER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'memberAddress',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildGGWPRemoveClanMemberInput(
  input: GGWPRemoveClanMemberInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: GGWP_CONTRACT_INDEX, inputType: GGWP_REMOVE_CLAN_MEMBER_INPUT_TYPE, payload: buildPayload(GGWP_REMOVE_CLAN_MEMBER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface GGWPRemoveClanMemberOutput {
  returnCode: number
}

const GGWP_REMOVE_CLAN_MEMBER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGGWPRemoveClanMemberOutput(
  data: Uint8Array,
): GGWPRemoveClanMemberOutput {
  return decodePayload(data, GGWP_REMOVE_CLAN_MEMBER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPRemoveClanMemberOutput
}

export const GGWP_SET_CLAN_RANK_INPUT_TYPE = 4

export interface GGWPSetClanRankInput {
  memberAddress: string
  rank: bigint
}

const GGWP_SET_CLAN_RANK_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'memberAddress',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'rank',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
]

export function buildGGWPSetClanRankInput(
  input: GGWPSetClanRankInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: GGWP_CONTRACT_INDEX, inputType: GGWP_SET_CLAN_RANK_INPUT_TYPE, payload: buildPayload(GGWP_SET_CLAN_RANK_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface GGWPSetClanRankOutput {
  returnCode: number
}

const GGWP_SET_CLAN_RANK_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGGWPSetClanRankOutput(
  data: Uint8Array,
): GGWPSetClanRankOutput {
  return decodePayload(data, GGWP_SET_CLAN_RANK_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPSetClanRankOutput
}

export const GGWP_SET_ADMIN_INPUT_TYPE = 5

export interface GGWPSetAdminInput {
  newAdmin: string
}

const GGWP_SET_ADMIN_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newAdmin',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildGGWPSetAdminInput(
  input: GGWPSetAdminInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: GGWP_CONTRACT_INDEX, inputType: GGWP_SET_ADMIN_INPUT_TYPE, payload: buildPayload(GGWP_SET_ADMIN_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface GGWPSetAdminOutput {
  returnCode: number
}

const GGWP_SET_ADMIN_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGGWPSetAdminOutput(
  data: Uint8Array,
): GGWPSetAdminOutput {
  return decodePayload(data, GGWP_SET_ADMIN_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPSetAdminOutput
}

export const GGWP_SET_EXCLUDE_ADDRESS_INPUT_TYPE = 6

export interface GGWPSetExcludeAddressInput {
  slot: bigint
  address: string
}

const GGWP_SET_EXCLUDE_ADDRESS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'slot',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'address',
    type: 'id',
    offset: 8,
    byteLength: 32,
  },
]

export function buildGGWPSetExcludeAddressInput(
  input: GGWPSetExcludeAddressInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: GGWP_CONTRACT_INDEX, inputType: GGWP_SET_EXCLUDE_ADDRESS_INPUT_TYPE, payload: buildPayload(GGWP_SET_EXCLUDE_ADDRESS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface GGWPSetExcludeAddressOutput {
  returnCode: number
}

const GGWP_SET_EXCLUDE_ADDRESS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGGWPSetExcludeAddressOutput(
  data: Uint8Array,
): GGWPSetExcludeAddressOutput {
  return decodePayload(data, GGWP_SET_EXCLUDE_ADDRESS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPSetExcludeAddressOutput
}

export const GGWP_STAKE_INPUT_TYPE = 7

export interface GGWPStakeInput {
  numberOfShares: bigint
}

const GGWP_STAKE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfShares',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildGGWPStakeInput(
  input: GGWPStakeInput,
): ContractCall {
  return { contractIndex: GGWP_CONTRACT_INDEX, inputType: GGWP_STAKE_INPUT_TYPE, payload: buildPayload(GGWP_STAKE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface GGWPStakeOutput {
  returnCode: number
}

const GGWP_STAKE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGGWPStakeOutput(
  data: Uint8Array,
): GGWPStakeOutput {
  return decodePayload(data, GGWP_STAKE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPStakeOutput
}

export const GGWP_REQUEST_UNSTAKE_INPUT_TYPE = 8

export interface GGWPRequestUnstakeInput {
  numberOfShares: bigint
}

const GGWP_REQUEST_UNSTAKE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfShares',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildGGWPRequestUnstakeInput(
  input: GGWPRequestUnstakeInput,
): ContractCall {
  return { contractIndex: GGWP_CONTRACT_INDEX, inputType: GGWP_REQUEST_UNSTAKE_INPUT_TYPE, payload: buildPayload(GGWP_REQUEST_UNSTAKE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface GGWPRequestUnstakeOutput {
  returnCode: number
}

const GGWP_REQUEST_UNSTAKE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGGWPRequestUnstakeOutput(
  data: Uint8Array,
): GGWPRequestUnstakeOutput {
  return decodePayload(data, GGWP_REQUEST_UNSTAKE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPRequestUnstakeOutput
}

export const GGWP_FINALIZE_UNSTAKE_INPUT_TYPE = 9

export interface GGWPFinalizeUnstakeOutput {
  returnCode: number
}

const GGWP_FINALIZE_UNSTAKE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGGWPFinalizeUnstakeOutput(
  data: Uint8Array,
): GGWPFinalizeUnstakeOutput {
  return decodePayload(data, GGWP_FINALIZE_UNSTAKE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPFinalizeUnstakeOutput
}

export const GGWP_DEPOSIT_STAKING_REWARDS_INPUT_TYPE = 10

export interface GGWPDepositStakingRewardsInput {
  numberOfShares: bigint
}

const GGWP_DEPOSIT_STAKING_REWARDS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfShares',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildGGWPDepositStakingRewardsInput(
  input: GGWPDepositStakingRewardsInput,
): ContractCall {
  return { contractIndex: GGWP_CONTRACT_INDEX, inputType: GGWP_DEPOSIT_STAKING_REWARDS_INPUT_TYPE, payload: buildPayload(GGWP_DEPOSIT_STAKING_REWARDS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface GGWPDepositStakingRewardsOutput {
  returnCode: number
}

const GGWP_DEPOSIT_STAKING_REWARDS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGGWPDepositStakingRewardsOutput(
  data: Uint8Array,
): GGWPDepositStakingRewardsOutput {
  return decodePayload(data, GGWP_DEPOSIT_STAKING_REWARDS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPDepositStakingRewardsOutput
}

export const GGWP_CLAIM_STAKING_REWARDS_INPUT_TYPE = 11

export interface GGWPClaimStakingRewardsOutput {
  returnCode: number
  claimedAmount: bigint
}

const GGWP_CLAIM_STAKING_REWARDS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'claimedAmount',
    type: 'uint64',
    offset: 4,
    byteLength: 8,
  },
]

export function decodeGGWPClaimStakingRewardsOutput(
  data: Uint8Array,
): GGWPClaimStakingRewardsOutput {
  return decodePayload(data, GGWP_CLAIM_STAKING_REWARDS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPClaimStakingRewardsOutput
}

export const GGWP_PROPOSE_GOV_CHANGE_INPUT_TYPE = 12

export interface GGWPProposeGovChangeInput {
  targetType: number
  newAddress: string
}

const GGWP_PROPOSE_GOV_CHANGE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'targetType',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'newAddress',
    type: 'id',
    offset: 1,
    byteLength: 32,
  },
]

export function buildGGWPProposeGovChangeInput(
  input: GGWPProposeGovChangeInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: GGWP_CONTRACT_INDEX, inputType: GGWP_PROPOSE_GOV_CHANGE_INPUT_TYPE, payload: buildPayload(GGWP_PROPOSE_GOV_CHANGE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface GGWPProposeGovChangeOutput {
  returnCode: number
  proposalIndex: bigint
  passed: number
}

const GGWP_PROPOSE_GOV_CHANGE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'proposalIndex',
    type: 'uint64',
    offset: 4,
    byteLength: 8,
  },
  {
    name: 'passed',
    type: 'uint8',
    offset: 12,
    byteLength: 1,
  },
]

export function decodeGGWPProposeGovChangeOutput(
  data: Uint8Array,
): GGWPProposeGovChangeOutput {
  return decodePayload(data, GGWP_PROPOSE_GOV_CHANGE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPProposeGovChangeOutput
}

export const GGWP_VOTE_GOV_CHANGE_INPUT_TYPE = 13

export interface GGWPVoteGovChangeInput {
  proposalIndex: bigint
  approve: number
}

const GGWP_VOTE_GOV_CHANGE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'approve',
    type: 'uint8',
    offset: 8,
    byteLength: 1,
  },
]

export function buildGGWPVoteGovChangeInput(
  input: GGWPVoteGovChangeInput,
): ContractCall {
  return { contractIndex: GGWP_CONTRACT_INDEX, inputType: GGWP_VOTE_GOV_CHANGE_INPUT_TYPE, payload: buildPayload(GGWP_VOTE_GOV_CHANGE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface GGWPVoteGovChangeOutput {
  returnCode: number
  passed: number
}

const GGWP_VOTE_GOV_CHANGE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'passed',
    type: 'uint8',
    offset: 4,
    byteLength: 1,
  },
]

export function decodeGGWPVoteGovChangeOutput(
  data: Uint8Array,
): GGWPVoteGovChangeOutput {
  return decodePayload(data, GGWP_VOTE_GOV_CHANGE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPVoteGovChangeOutput
}

export const GGWP_ADMIN_RECONCILE_STAKE_INPUT_TYPE = 14

export interface GGWPAdminReconcileStakeInput {
  staker: string
  correctAmount: bigint
}

const GGWP_ADMIN_RECONCILE_STAKE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'staker',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'correctAmount',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
]

export function buildGGWPAdminReconcileStakeInput(
  input: GGWPAdminReconcileStakeInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: GGWP_CONTRACT_INDEX, inputType: GGWP_ADMIN_RECONCILE_STAKE_INPUT_TYPE, payload: buildPayload(GGWP_ADMIN_RECONCILE_STAKE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface GGWPAdminReconcileStakeOutput {
  returnCode: number
}

const GGWP_ADMIN_RECONCILE_STAKE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeGGWPAdminReconcileStakeOutput(
  data: Uint8Array,
): GGWPAdminReconcileStakeOutput {
  return decodePayload(data, GGWP_ADMIN_RECONCILE_STAKE_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPAdminReconcileStakeOutput
}

export const GGWP_GET_STATUS_INPUT_TYPE = 1
export const GGWP_GET_STATUS_INPUT_SIZE = 0

export interface GGWPGetStatusOutput {
  holderCount: bigint
  totalTokensSnapshot: bigint
  clanMemberCount: bigint
  clanWeightedTotal: bigint
  pendingRevenue: bigint
  reinvestmentFund: bigint
  execReserveFund: bigint
  totalDistributed: bigint
  totalDeposited: bigint
  lastPayoutTick: bigint
  lastDistributionEpoch: bigint
  adminAddress: string
}

const GGWP_GET_STATUS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'holderCount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'totalTokensSnapshot',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'clanMemberCount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'clanWeightedTotal',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'pendingRevenue',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'reinvestmentFund',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'execReserveFund',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'totalDistributed',
    type: 'uint64',
    offset: 56,
    byteLength: 8,
  },
  {
    name: 'totalDeposited',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: 'lastPayoutTick',
    type: 'uint64',
    offset: 72,
    byteLength: 8,
  },
  {
    name: 'lastDistributionEpoch',
    type: 'uint64',
    offset: 80,
    byteLength: 8,
  },
  {
    name: 'adminAddress',
    type: 'id',
    offset: 88,
    byteLength: 32,
  },
]

export function decodeGGWPGetStatusOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): GGWPGetStatusOutput {
  return decodePayload(data, GGWP_GET_STATUS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as GGWPGetStatusOutput
}

export async function gGWPGetStatus(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<GGWPGetStatusOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GGWP_CONTRACT_INDEX,
    inputType: GGWP_GET_STATUS_INPUT_TYPE,
    inputSize: GGWP_GET_STATUS_INPUT_SIZE,
    inputFields: [],
    outputFields: GGWP_GET_STATUS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const GGWP_GET_HOLDER_INFO_INPUT_TYPE = 2
export const GGWP_GET_HOLDER_INFO_INPUT_SIZE = 32

export interface GGWPGetHolderInfoInput {
  holderAddress: string
}

const GGWP_GET_HOLDER_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'holderAddress',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildGGWPGetHolderInfoInput(
  input: GGWPGetHolderInfoInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(GGWP_GET_HOLDER_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GGWPGetHolderInfoOutput {
  tokenBalance: bigint
  isHolder: number
}

const GGWP_GET_HOLDER_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'tokenBalance',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'isHolder',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function decodeGGWPGetHolderInfoOutput(
  data: Uint8Array,
): GGWPGetHolderInfoOutput {
  return decodePayload(data, GGWP_GET_HOLDER_INFO_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPGetHolderInfoOutput
}

export async function gGWPGetHolderInfo(
  live: SmartContractCaller,
  input: GGWPGetHolderInfoInput,
  options?: ContractCallOptions,
): Promise<Result<GGWPGetHolderInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GGWP_CONTRACT_INDEX,
    inputType: GGWP_GET_HOLDER_INFO_INPUT_TYPE,
    inputSize: GGWP_GET_HOLDER_INFO_INPUT_SIZE,
    inputFields: GGWP_GET_HOLDER_INFO_INPUT_FIELDS,
    outputFields: GGWP_GET_HOLDER_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const GGWP_GET_CLAN_MEMBER_INFO_INPUT_TYPE = 3
export const GGWP_GET_CLAN_MEMBER_INFO_INPUT_SIZE = 32

export interface GGWPGetClanMemberInfoInput {
  memberAddress: string
}

const GGWP_GET_CLAN_MEMBER_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'memberAddress',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildGGWPGetClanMemberInfoInput(
  input: GGWPGetClanMemberInfoInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(GGWP_GET_CLAN_MEMBER_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GGWPGetClanMemberInfoOutput {
  rank: bigint
  isMember: number
}

const GGWP_GET_CLAN_MEMBER_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'rank',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'isMember',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function decodeGGWPGetClanMemberInfoOutput(
  data: Uint8Array,
): GGWPGetClanMemberInfoOutput {
  return decodePayload(data, GGWP_GET_CLAN_MEMBER_INFO_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPGetClanMemberInfoOutput
}

export async function gGWPGetClanMemberInfo(
  live: SmartContractCaller,
  input: GGWPGetClanMemberInfoInput,
  options?: ContractCallOptions,
): Promise<Result<GGWPGetClanMemberInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GGWP_CONTRACT_INDEX,
    inputType: GGWP_GET_CLAN_MEMBER_INFO_INPUT_TYPE,
    inputSize: GGWP_GET_CLAN_MEMBER_INFO_INPUT_SIZE,
    inputFields: GGWP_GET_CLAN_MEMBER_INFO_INPUT_FIELDS,
    outputFields: GGWP_GET_CLAN_MEMBER_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const GGWP_GET_SHAREHOLDER_INFO_INPUT_TYPE = 4
export const GGWP_GET_SHAREHOLDER_INFO_INPUT_SIZE = 32

export interface GGWPGetShareholderInfoInput {
  shareholderAddress: string
}

const GGWP_GET_SHAREHOLDER_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'shareholderAddress',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildGGWPGetShareholderInfoInput(
  input: GGWPGetShareholderInfoInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(GGWP_GET_SHAREHOLDER_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GGWPGetShareholderInfoOutput {
  shares: bigint
  isShareholder: number
}

const GGWP_GET_SHAREHOLDER_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'shares',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'isShareholder',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function decodeGGWPGetShareholderInfoOutput(
  data: Uint8Array,
): GGWPGetShareholderInfoOutput {
  return decodePayload(data, GGWP_GET_SHAREHOLDER_INFO_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPGetShareholderInfoOutput
}

export async function gGWPGetShareholderInfo(
  live: SmartContractCaller,
  input: GGWPGetShareholderInfoInput,
  options?: ContractCallOptions,
): Promise<Result<GGWPGetShareholderInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GGWP_CONTRACT_INDEX,
    inputType: GGWP_GET_SHAREHOLDER_INFO_INPUT_TYPE,
    inputSize: GGWP_GET_SHAREHOLDER_INFO_INPUT_SIZE,
    inputFields: GGWP_GET_SHAREHOLDER_INFO_INPUT_FIELDS,
    outputFields: GGWP_GET_SHAREHOLDER_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const GGWP_GET_STAKING_INFO_INPUT_TYPE = 5
export const GGWP_GET_STAKING_INFO_INPUT_SIZE = 32

export interface GGWPGetStakingInfoInput {
  stakerAddress: string
}

const GGWP_GET_STAKING_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'stakerAddress',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildGGWPGetStakingInfoInput(
  input: GGWPGetStakingInfoInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): Uint8Array {
  return buildPayload(GGWP_GET_STAKING_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface GGWPGetStakingInfoOutput {
  stakedAmount: bigint
  pendingRewards: bigint
  unstakeAmount: bigint
  unstakeEpoch: bigint
  totalStaked: bigint
  stakingRewardPool: bigint
  isStaker: number
}

const GGWP_GET_STAKING_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'stakedAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'pendingRewards',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'unstakeAmount',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'unstakeEpoch',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'totalStaked',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'stakingRewardPool',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'isStaker',
    type: 'uint32',
    offset: 48,
    byteLength: 4,
  },
]

export function decodeGGWPGetStakingInfoOutput(
  data: Uint8Array,
): GGWPGetStakingInfoOutput {
  return decodePayload(data, GGWP_GET_STAKING_INFO_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPGetStakingInfoOutput
}

export async function gGWPGetStakingInfo(
  live: SmartContractCaller,
  input: GGWPGetStakingInfoInput,
  options?: ContractCallOptions,
): Promise<Result<GGWPGetStakingInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GGWP_CONTRACT_INDEX,
    inputType: GGWP_GET_STAKING_INFO_INPUT_TYPE,
    inputSize: GGWP_GET_STAKING_INFO_INPUT_SIZE,
    inputFields: GGWP_GET_STAKING_INFO_INPUT_FIELDS,
    outputFields: GGWP_GET_STAKING_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const GGWP_GET_EXCLUDE_ADDRESSES_INPUT_TYPE = 6
export const GGWP_GET_EXCLUDE_ADDRESSES_INPUT_SIZE = 0

export interface GGWPGetExcludeAddressesOutput {
  address1: string
  address2: string
}

const GGWP_GET_EXCLUDE_ADDRESSES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'address1',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'address2',
    type: 'id',
    offset: 32,
    byteLength: 32,
  },
]

export function decodeGGWPGetExcludeAddressesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): GGWPGetExcludeAddressesOutput {
  return decodePayload(data, GGWP_GET_EXCLUDE_ADDRESSES_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as GGWPGetExcludeAddressesOutput
}

export async function gGWPGetExcludeAddresses(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<GGWPGetExcludeAddressesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GGWP_CONTRACT_INDEX,
    inputType: GGWP_GET_EXCLUDE_ADDRESSES_INPUT_TYPE,
    inputSize: GGWP_GET_EXCLUDE_ADDRESSES_INPUT_SIZE,
    inputFields: [],
    outputFields: GGWP_GET_EXCLUDE_ADDRESSES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const GGWP_GET_DISTRIBUTION_PREVIEW_INPUT_TYPE = 7
export const GGWP_GET_DISTRIBUTION_PREVIEW_INPUT_SIZE = 8

export interface GGWPGetDistributionPreviewInput {
  amount: bigint
}

const GGWP_GET_DISTRIBUTION_PREVIEW_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildGGWPGetDistributionPreviewInput(
  input: GGWPGetDistributionPreviewInput,
): Uint8Array {
  return buildPayload(GGWP_GET_DISTRIBUTION_PREVIEW_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface GGWPGetDistributionPreviewOutput {
  holderShare: bigint
  shareholderShare: bigint
  clanShare: bigint
  reinvestShare: bigint
  execReserveShare: bigint
}

const GGWP_GET_DISTRIBUTION_PREVIEW_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'holderShare',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'shareholderShare',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'clanShare',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'reinvestShare',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'execReserveShare',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
]

export function decodeGGWPGetDistributionPreviewOutput(
  data: Uint8Array,
): GGWPGetDistributionPreviewOutput {
  return decodePayload(data, GGWP_GET_DISTRIBUTION_PREVIEW_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as GGWPGetDistributionPreviewOutput
}

export async function gGWPGetDistributionPreview(
  live: SmartContractCaller,
  input: GGWPGetDistributionPreviewInput,
  options?: ContractCallOptions,
): Promise<Result<GGWPGetDistributionPreviewOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GGWP_CONTRACT_INDEX,
    inputType: GGWP_GET_DISTRIBUTION_PREVIEW_INPUT_TYPE,
    inputSize: GGWP_GET_DISTRIBUTION_PREVIEW_INPUT_SIZE,
    inputFields: GGWP_GET_DISTRIBUTION_PREVIEW_INPUT_FIELDS,
    outputFields: GGWP_GET_DISTRIBUTION_PREVIEW_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const GGWP_GET_GOV_PROPOSAL_INPUT_TYPE = 8
export const GGWP_GET_GOV_PROPOSAL_INPUT_SIZE = 8

export interface GGWPGetGovProposalInput {
  proposalIndex: bigint
}

const GGWP_GET_GOV_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalIndex',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildGGWPGetGovProposalInput(
  input: GGWPGetGovProposalInput,
): Uint8Array {
  return buildPayload(GGWP_GET_GOV_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface GGWPGetGovProposalOutput {
  status: number
  targetType: number
  proposedAddress: string
  proposalId: bigint
  proposalEpoch: bigint
  yesShares: bigint
  totalShares: bigint
  requiredShares: bigint
}

const GGWP_GET_GOV_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'targetType',
    type: 'uint8',
    offset: 1,
    byteLength: 1,
  },
  {
    name: 'proposedAddress',
    type: 'id',
    offset: 2,
    byteLength: 32,
  },
  {
    name: 'proposalId',
    type: 'uint64',
    offset: 34,
    byteLength: 8,
  },
  {
    name: 'proposalEpoch',
    type: 'uint64',
    offset: 42,
    byteLength: 8,
  },
  {
    name: 'yesShares',
    type: 'uint64',
    offset: 50,
    byteLength: 8,
  },
  {
    name: 'totalShares',
    type: 'uint64',
    offset: 58,
    byteLength: 8,
  },
  {
    name: 'requiredShares',
    type: 'uint64',
    offset: 66,
    byteLength: 8,
  },
]

export function decodeGGWPGetGovProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): GGWPGetGovProposalOutput {
  return decodePayload(data, GGWP_GET_GOV_PROPOSAL_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as GGWPGetGovProposalOutput
}

export async function gGWPGetGovProposal(
  live: SmartContractCaller,
  input: GGWPGetGovProposalInput,
  options?: ContractCallOptions,
): Promise<Result<GGWPGetGovProposalOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: GGWP_CONTRACT_INDEX,
    inputType: GGWP_GET_GOV_PROPOSAL_INPUT_TYPE,
    inputSize: GGWP_GET_GOV_PROPOSAL_INPUT_SIZE,
    inputFields: GGWP_GET_GOV_PROPOSAL_INPUT_FIELDS,
    outputFields: GGWP_GET_GOV_PROPOSAL_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const gGWP = {
  contractIndex: GGWP_CONTRACT_INDEX,
  GetStatus: gGWPGetStatus,
  GetHolderInfo: gGWPGetHolderInfo,
  GetClanMemberInfo: gGWPGetClanMemberInfo,
  GetShareholderInfo: gGWPGetShareholderInfo,
  GetStakingInfo: gGWPGetStakingInfo,
  GetExcludeAddresses: gGWPGetExcludeAddresses,
  GetDistributionPreview: gGWPGetDistributionPreview,
  GetGovProposal: gGWPGetGovProposal,
  decodeDepositRevenueOutput: decodeGGWPDepositRevenueOutput,
  buildAddClanMemberInput: buildGGWPAddClanMemberInput,
  decodeAddClanMemberOutput: decodeGGWPAddClanMemberOutput,
  buildRemoveClanMemberInput: buildGGWPRemoveClanMemberInput,
  decodeRemoveClanMemberOutput: decodeGGWPRemoveClanMemberOutput,
  buildSetClanRankInput: buildGGWPSetClanRankInput,
  decodeSetClanRankOutput: decodeGGWPSetClanRankOutput,
  buildSetAdminInput: buildGGWPSetAdminInput,
  decodeSetAdminOutput: decodeGGWPSetAdminOutput,
  buildSetExcludeAddressInput: buildGGWPSetExcludeAddressInput,
  decodeSetExcludeAddressOutput: decodeGGWPSetExcludeAddressOutput,
  buildStakeInput: buildGGWPStakeInput,
  decodeStakeOutput: decodeGGWPStakeOutput,
  buildRequestUnstakeInput: buildGGWPRequestUnstakeInput,
  decodeRequestUnstakeOutput: decodeGGWPRequestUnstakeOutput,
  decodeFinalizeUnstakeOutput: decodeGGWPFinalizeUnstakeOutput,
  buildDepositStakingRewardsInput: buildGGWPDepositStakingRewardsInput,
  decodeDepositStakingRewardsOutput: decodeGGWPDepositStakingRewardsOutput,
  decodeClaimStakingRewardsOutput: decodeGGWPClaimStakingRewardsOutput,
  buildProposeGovChangeInput: buildGGWPProposeGovChangeInput,
  decodeProposeGovChangeOutput: decodeGGWPProposeGovChangeOutput,
  buildVoteGovChangeInput: buildGGWPVoteGovChangeInput,
  decodeVoteGovChangeOutput: decodeGGWPVoteGovChangeOutput,
  buildAdminReconcileStakeInput: buildGGWPAdminReconcileStakeInput,
  decodeAdminReconcileStakeOutput: decodeGGWPAdminReconcileStakeOutput,
}

