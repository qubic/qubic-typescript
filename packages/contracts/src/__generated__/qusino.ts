// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '../result.js'

export const QUSINO_CONTRACT_INDEX = 26

export interface QusinoAssetStruct {
  issuer: string
  assetName: bigint
}

export interface QusinoGameInfoStruct {
  URI: number[]
  proposer: string
  yesVotes: number
  noVotes: number
  proposedEpoch: number
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
  'GameInfo': {
  name: 'GameInfo',
  byteLength: 108,
  fields: [
    {
      name: 'URI',
      type: 'array',
      offset: 0,
      byteLength: 64,
      arrayLength: 64,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'proposer',
      type: 'id',
      offset: 64,
      byteLength: 32,
    },
    {
      name: 'yesVotes',
      type: 'uint32',
      offset: 96,
      byteLength: 4,
    },
    {
      name: 'noVotes',
      type: 'uint32',
      offset: 100,
      byteLength: 4,
    },
    {
      name: 'proposedEpoch',
      type: 'uint32',
      offset: 104,
      byteLength: 4,
    },
],
},
}

export const QUSINO_EARN_STAR_INPUT_TYPE = 1

export interface QusinoEarnSTARInput {
  amount: bigint
}

const QUSINO_EARN_STAR_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQusinoEarnSTARInput(
  input: QusinoEarnSTARInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QUSINO_CONTRACT_INDEX, inputType: QUSINO_EARN_STAR_INPUT_TYPE, payload: buildPayload(QUSINO_EARN_STAR_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QusinoEarnSTAROutput {
  returnCode: number
}

const QUSINO_EARN_STAR_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQusinoEarnSTAROutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoEarnSTAROutput {
  return decodePayload(data, QUSINO_EARN_STAR_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoEarnSTAROutput
}

export const QUSINO_TRANSFER_STAR_OR_QSC_INPUT_TYPE = 2

export interface QusinoTransferSTAROrQSCInput {
  dest: string
  amount: bigint
  type: number
}

const QUSINO_TRANSFER_STAR_OR_QSC_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'dest',
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
    name: 'type',
    type: 'uint8',
    offset: 40,
    byteLength: 1,
  },
]

export function buildQusinoTransferSTAROrQSCInput(
  input: QusinoTransferSTAROrQSCInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QUSINO_CONTRACT_INDEX, inputType: QUSINO_TRANSFER_STAR_OR_QSC_INPUT_TYPE, payload: buildPayload(QUSINO_TRANSFER_STAR_OR_QSC_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QusinoTransferSTAROrQSCOutput {
  returnCode: number
}

const QUSINO_TRANSFER_STAR_OR_QSC_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQusinoTransferSTAROrQSCOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoTransferSTAROrQSCOutput {
  return decodePayload(data, QUSINO_TRANSFER_STAR_OR_QSC_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoTransferSTAROrQSCOutput
}

export const QUSINO_SUBMIT_GAME_INPUT_TYPE = 3

export interface QusinoSubmitGameInput {
  URI: number[]
}

const QUSINO_SUBMIT_GAME_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'URI',
    type: 'array',
    offset: 0,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function buildQusinoSubmitGameInput(
  input: QusinoSubmitGameInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QUSINO_CONTRACT_INDEX, inputType: QUSINO_SUBMIT_GAME_INPUT_TYPE, payload: buildPayload(QUSINO_SUBMIT_GAME_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QusinoSubmitGameOutput {
  returnCode: number
}

const QUSINO_SUBMIT_GAME_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQusinoSubmitGameOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoSubmitGameOutput {
  return decodePayload(data, QUSINO_SUBMIT_GAME_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoSubmitGameOutput
}

export const QUSINO_VOTE_IN_GAME_PROPOSAL_INPUT_TYPE = 4

export interface QusinoVoteInGameProposalInput {
  URI: number[]
  gameIndex: bigint
  yesNo: number
}

const QUSINO_VOTE_IN_GAME_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'URI',
    type: 'array',
    offset: 0,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'gameIndex',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: 'yesNo',
    type: 'uint8',
    offset: 72,
    byteLength: 1,
  },
]

export function buildQusinoVoteInGameProposalInput(
  input: QusinoVoteInGameProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QUSINO_CONTRACT_INDEX, inputType: QUSINO_VOTE_IN_GAME_PROPOSAL_INPUT_TYPE, payload: buildPayload(QUSINO_VOTE_IN_GAME_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QusinoVoteInGameProposalOutput {
  returnCode: number
}

const QUSINO_VOTE_IN_GAME_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQusinoVoteInGameProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoVoteInGameProposalOutput {
  return decodePayload(data, QUSINO_VOTE_IN_GAME_PROPOSAL_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoVoteInGameProposalOutput
}

export const QUSINO_DEPOSIT_BONUS_INPUT_TYPE = 5

export interface QusinoDepositBonusInput {
  amount: bigint
}

const QUSINO_DEPOSIT_BONUS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQusinoDepositBonusInput(
  input: QusinoDepositBonusInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QUSINO_CONTRACT_INDEX, inputType: QUSINO_DEPOSIT_BONUS_INPUT_TYPE, payload: buildPayload(QUSINO_DEPOSIT_BONUS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QusinoDepositBonusOutput {
  returnCode: number
}

const QUSINO_DEPOSIT_BONUS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQusinoDepositBonusOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoDepositBonusOutput {
  return decodePayload(data, QUSINO_DEPOSIT_BONUS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoDepositBonusOutput
}

export const QUSINO_DAILY_CLAIM_BONUS_INPUT_TYPE = 6

export interface QusinoDailyClaimBonusOutput {
  returnCode: number
}

const QUSINO_DAILY_CLAIM_BONUS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQusinoDailyClaimBonusOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoDailyClaimBonusOutput {
  return decodePayload(data, QUSINO_DAILY_CLAIM_BONUS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoDailyClaimBonusOutput
}

export const QUSINO_REDEMPTION_QSC_TO_QUBIC_INPUT_TYPE = 7

export interface QusinoRedemptionQSCToQubicInput {
  amount: bigint
}

const QUSINO_REDEMPTION_QSC_TO_QUBIC_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildQusinoRedemptionQSCToQubicInput(
  input: QusinoRedemptionQSCToQubicInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QUSINO_CONTRACT_INDEX, inputType: QUSINO_REDEMPTION_QSC_TO_QUBIC_INPUT_TYPE, payload: buildPayload(QUSINO_REDEMPTION_QSC_TO_QUBIC_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QusinoRedemptionQSCToQubicOutput {
  returnCode: number
}

const QUSINO_REDEMPTION_QSC_TO_QUBIC_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'returnCode',
    type: 'sint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeQusinoRedemptionQSCToQubicOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoRedemptionQSCToQubicOutput {
  return decodePayload(data, QUSINO_REDEMPTION_QSC_TO_QUBIC_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoRedemptionQSCToQubicOutput
}

export const QUSINO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 12

export interface QusinoTransferShareManagementRightsInput {
  asset: QusinoAssetStruct
  numberOfShares: bigint
  newManagingContractIndex: number
}

const QUSINO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
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

export function buildQusinoTransferShareManagementRightsInput(
  input: QusinoTransferShareManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): ContractCall {
  return { contractIndex: QUSINO_CONTRACT_INDEX, inputType: QUSINO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE, payload: buildPayload(QUSINO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface QusinoTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
}

const QUSINO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQusinoTransferShareManagementRightsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoTransferShareManagementRightsOutput {
  return decodePayload(data, QUSINO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoTransferShareManagementRightsOutput
}

export const QUSINO_GET_USER_ASSET_VOLUME_INPUT_TYPE = 8
export const QUSINO_GET_USER_ASSET_VOLUME_INPUT_SIZE = 32

export interface QusinoGetUserAssetVolumeInput {
  user: string
}

const QUSINO_GET_USER_ASSET_VOLUME_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'user',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQusinoGetUserAssetVolumeInput(
  input: QusinoGetUserAssetVolumeInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUSINO_GET_USER_ASSET_VOLUME_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QusinoGetUserAssetVolumeOutput {
  STARAmount: bigint
  QSCAmount: bigint
}

const QUSINO_GET_USER_ASSET_VOLUME_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'STARAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'QSCAmount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function decodeQusinoGetUserAssetVolumeOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoGetUserAssetVolumeOutput {
  return decodePayload(data, QUSINO_GET_USER_ASSET_VOLUME_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoGetUserAssetVolumeOutput
}

export async function qusinoGetUserAssetVolume(
  live: SmartContractCaller,
  input: QusinoGetUserAssetVolumeInput,
  options?: ContractCallOptions,
): Promise<Result<QusinoGetUserAssetVolumeOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QUSINO_CONTRACT_INDEX,
    inputType: QUSINO_GET_USER_ASSET_VOLUME_INPUT_TYPE,
    inputSize: QUSINO_GET_USER_ASSET_VOLUME_INPUT_SIZE,
    inputFields: QUSINO_GET_USER_ASSET_VOLUME_INPUT_FIELDS,
    outputFields: QUSINO_GET_USER_ASSET_VOLUME_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QUSINO_GET_FAILED_GAME_LIST_INPUT_TYPE = 9
export const QUSINO_GET_FAILED_GAME_LIST_INPUT_SIZE = 4

export interface QusinoGetFailedGameListInput {
  offset: number
}

const QUSINO_GET_FAILED_GAME_LIST_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'offset',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQusinoGetFailedGameListInput(
  input: QusinoGetFailedGameListInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUSINO_GET_FAILED_GAME_LIST_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QusinoGetFailedGameListOutput {
  games: number[]
}

const QUSINO_GET_FAILED_GAME_LIST_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'games',
    type: 'array',
    offset: 0,
    byteLength: 3456,
    arrayLength: 32,
    arrayItemByteLength: 108,
    arrayItemStructRef: 'GameInfo',
  },
]

export function decodeQusinoGetFailedGameListOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoGetFailedGameListOutput {
  return decodePayload(data, QUSINO_GET_FAILED_GAME_LIST_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoGetFailedGameListOutput
}

export async function qusinoGetFailedGameList(
  live: SmartContractCaller,
  input: QusinoGetFailedGameListInput,
  options?: ContractCallOptions,
): Promise<Result<QusinoGetFailedGameListOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QUSINO_CONTRACT_INDEX,
    inputType: QUSINO_GET_FAILED_GAME_LIST_INPUT_TYPE,
    inputSize: QUSINO_GET_FAILED_GAME_LIST_INPUT_SIZE,
    inputFields: QUSINO_GET_FAILED_GAME_LIST_INPUT_FIELDS,
    outputFields: QUSINO_GET_FAILED_GAME_LIST_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QUSINO_GET_SC_INFO_INPUT_TYPE = 10
export const QUSINO_GET_SC_INFO_INPUT_SIZE = 0

export interface QusinoGetSCInfoOutput {
  QSCCirclatingSupply: bigint
  STARCirclatingSupply: bigint
  burntSTAR: bigint
  epochRevenue: bigint
  maxGameIndex: bigint
  bonusAmount: bigint
}

const QUSINO_GET_SC_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'QSCCirclatingSupply',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'STARCirclatingSupply',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'burntSTAR',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'epochRevenue',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'maxGameIndex',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'bonusAmount',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function decodeQusinoGetSCInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoGetSCInfoOutput {
  return decodePayload(data, QUSINO_GET_SC_INFO_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoGetSCInfoOutput
}

export async function qusinoGetSCInfo(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<QusinoGetSCInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QUSINO_CONTRACT_INDEX,
    inputType: QUSINO_GET_SC_INFO_INPUT_TYPE,
    inputSize: QUSINO_GET_SC_INFO_INPUT_SIZE,
    inputFields: [],
    outputFields: QUSINO_GET_SC_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const QUSINO_GET_ACTIVE_GAME_LIST_INPUT_TYPE = 11
export const QUSINO_GET_ACTIVE_GAME_LIST_INPUT_SIZE = 4

export interface QusinoGetActiveGameListInput {
  offset: number
}

const QUSINO_GET_ACTIVE_GAME_LIST_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'offset',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildQusinoGetActiveGameListInput(
  input: QusinoGetActiveGameListInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUSINO_GET_ACTIVE_GAME_LIST_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QusinoGetActiveGameListOutput {
  games: number[]
  gameIndexes: bigint[]
}

const QUSINO_GET_ACTIVE_GAME_LIST_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'games',
    type: 'array',
    offset: 0,
    byteLength: 3456,
    arrayLength: 32,
    arrayItemByteLength: 108,
    arrayItemStructRef: 'GameInfo',
  },
  {
    name: 'gameIndexes',
    type: 'array',
    offset: 3456,
    byteLength: 256,
    arrayLength: 32,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
]

export function decodeQusinoGetActiveGameListOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoGetActiveGameListOutput {
  return decodePayload(data, QUSINO_GET_ACTIVE_GAME_LIST_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoGetActiveGameListOutput
}

export async function qusinoGetActiveGameList(
  live: SmartContractCaller,
  input: QusinoGetActiveGameListInput,
  options?: ContractCallOptions,
): Promise<Result<QusinoGetActiveGameListOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QUSINO_CONTRACT_INDEX,
    inputType: QUSINO_GET_ACTIVE_GAME_LIST_INPUT_TYPE,
    inputSize: QUSINO_GET_ACTIVE_GAME_LIST_INPUT_SIZE,
    inputFields: QUSINO_GET_ACTIVE_GAME_LIST_INPUT_FIELDS,
    outputFields: QUSINO_GET_ACTIVE_GAME_LIST_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const QUSINO_GET_PROPOSER_EARNED_QSC_INFO_INPUT_TYPE = 13
export const QUSINO_GET_PROPOSER_EARNED_QSC_INFO_INPUT_SIZE = 36

export interface QusinoGetProposerEarnedQSCInfoInput {
  proposer: string
  epoch: number
}

const QUSINO_GET_PROPOSER_EARNED_QSC_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposer',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'epoch',
    type: 'uint32',
    offset: 32,
    byteLength: 4,
  },
]

export function buildQusinoGetProposerEarnedQSCInfoInput(
  input: QusinoGetProposerEarnedQSCInfoInput,
  identityToPublicKey: (identity: string) => Uint8Array = (_identity: string) => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QUSINO_GET_PROPOSER_EARNED_QSC_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QusinoGetProposerEarnedQSCInfoOutput {
  earnedQSC: bigint
}

const QUSINO_GET_PROPOSER_EARNED_QSC_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'earnedQSC',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQusinoGetProposerEarnedQSCInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = (_pk: Uint8Array) => 'A'.repeat(60),
): QusinoGetProposerEarnedQSCInfoOutput {
  return decodePayload(data, QUSINO_GET_PROPOSER_EARNED_QSC_INFO_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as QusinoGetProposerEarnedQSCInfoOutput
}

export async function qusinoGetProposerEarnedQSCInfo(
  live: SmartContractCaller,
  input: QusinoGetProposerEarnedQSCInfoInput,
  options?: ContractCallOptions,
): Promise<Result<QusinoGetProposerEarnedQSCInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: QUSINO_CONTRACT_INDEX,
    inputType: QUSINO_GET_PROPOSER_EARNED_QSC_INFO_INPUT_TYPE,
    inputSize: QUSINO_GET_PROPOSER_EARNED_QSC_INFO_INPUT_SIZE,
    inputFields: QUSINO_GET_PROPOSER_EARNED_QSC_INFO_INPUT_FIELDS,
    outputFields: QUSINO_GET_PROPOSER_EARNED_QSC_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const qusino = {
  contractIndex: QUSINO_CONTRACT_INDEX,
  getUserAssetVolume: qusinoGetUserAssetVolume,
  getFailedGameList: qusinoGetFailedGameList,
  getSCInfo: qusinoGetSCInfo,
  getActiveGameList: qusinoGetActiveGameList,
  getProposerEarnedQSCInfo: qusinoGetProposerEarnedQSCInfo,
  buildEarnSTARInput: buildQusinoEarnSTARInput,
  decodeEarnSTAROutput: decodeQusinoEarnSTAROutput,
  buildTransferSTAROrQSCInput: buildQusinoTransferSTAROrQSCInput,
  decodeTransferSTAROrQSCOutput: decodeQusinoTransferSTAROrQSCOutput,
  buildSubmitGameInput: buildQusinoSubmitGameInput,
  decodeSubmitGameOutput: decodeQusinoSubmitGameOutput,
  buildVoteInGameProposalInput: buildQusinoVoteInGameProposalInput,
  decodeVoteInGameProposalOutput: decodeQusinoVoteInGameProposalOutput,
  buildDepositBonusInput: buildQusinoDepositBonusInput,
  decodeDepositBonusOutput: decodeQusinoDepositBonusOutput,
  decodeDailyClaimBonusOutput: decodeQusinoDailyClaimBonusOutput,
  buildRedemptionQSCToQubicInput: buildQusinoRedemptionQSCToQubicInput,
  decodeRedemptionQSCToQubicOutput: decodeQusinoRedemptionQSCToQubicOutput,
  buildTransferShareManagementRightsInput: buildQusinoTransferShareManagementRightsInput,
  decodeTransferShareManagementRightsOutput: decodeQusinoTransferShareManagementRightsOutput,
}

