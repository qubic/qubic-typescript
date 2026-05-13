// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const NOSTROMO_CONTRACT_INDEX = 14

export interface NostromoProjectInfoStruct {
  creator: string
  tokenName: bigint
  supplyOfToken: bigint
  startDate: number
  endDate: number
  numberOfYes: number
  numberOfNo: number
}

export interface NostromoFundaraisingInfoStruct {
  tokenPrice: bigint
  soldAmount: bigint
  requiredFunds: bigint
  raisedFunds: bigint
  indexOfProject: number
  firstPhaseStartDate: number
  firstPhaseEndDate: number
  secondPhaseStartDate: number
  secondPhaseEndDate: number
  thirdPhaseStartDate: number
  thirdPhaseEndDate: number
  listingStartDate: number
  cliffEndDate: number
  vestingEndDate: number
  threshold: number
  TGE: number
  stepOfVesting: number
}

export interface NostromoInvestInfoStruct {
  investedAmount: bigint
  claimedAmount: bigint
  indexOfFundraising: number
}

const STRUCTS: Record<string, NamedStruct> = {
  projectInfo: {
  name: 'projectInfo',
  byteLength: 64,
  fields: [
    {
      name: 'creator',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'tokenName',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'supplyOfToken',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
    {
      name: 'startDate',
      type: 'uint32',
      offset: 48,
      byteLength: 4,
    },
    {
      name: 'endDate',
      type: 'uint32',
      offset: 52,
      byteLength: 4,
    },
    {
      name: 'numberOfYes',
      type: 'uint32',
      offset: 56,
      byteLength: 4,
    },
    {
      name: 'numberOfNo',
      type: 'uint32',
      offset: 60,
      byteLength: 4,
    },
],
},
  fundaraisingInfo: {
  name: 'fundaraisingInfo',
  byteLength: 75,
  fields: [
    {
      name: 'tokenPrice',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'soldAmount',
      type: 'uint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'requiredFunds',
      type: 'uint64',
      offset: 16,
      byteLength: 8,
    },
    {
      name: 'raisedFunds',
      type: 'uint64',
      offset: 24,
      byteLength: 8,
    },
    {
      name: 'indexOfProject',
      type: 'uint32',
      offset: 32,
      byteLength: 4,
    },
    {
      name: 'firstPhaseStartDate',
      type: 'uint32',
      offset: 36,
      byteLength: 4,
    },
    {
      name: 'firstPhaseEndDate',
      type: 'uint32',
      offset: 40,
      byteLength: 4,
    },
    {
      name: 'secondPhaseStartDate',
      type: 'uint32',
      offset: 44,
      byteLength: 4,
    },
    {
      name: 'secondPhaseEndDate',
      type: 'uint32',
      offset: 48,
      byteLength: 4,
    },
    {
      name: 'thirdPhaseStartDate',
      type: 'uint32',
      offset: 52,
      byteLength: 4,
    },
    {
      name: 'thirdPhaseEndDate',
      type: 'uint32',
      offset: 56,
      byteLength: 4,
    },
    {
      name: 'listingStartDate',
      type: 'uint32',
      offset: 60,
      byteLength: 4,
    },
    {
      name: 'cliffEndDate',
      type: 'uint32',
      offset: 64,
      byteLength: 4,
    },
    {
      name: 'vestingEndDate',
      type: 'uint32',
      offset: 68,
      byteLength: 4,
    },
    {
      name: 'threshold',
      type: 'uint8',
      offset: 72,
      byteLength: 1,
    },
    {
      name: 'TGE',
      type: 'uint8',
      offset: 73,
      byteLength: 1,
    },
    {
      name: 'stepOfVesting',
      type: 'uint8',
      offset: 74,
      byteLength: 1,
    },
],
},
  investInfo: {
  name: 'investInfo',
  byteLength: 20,
  fields: [
    {
      name: 'investedAmount',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'claimedAmount',
      type: 'uint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'indexOfFundraising',
      type: 'uint32',
      offset: 16,
      byteLength: 4,
    },
],
},
}

export const NOSTROMO_REGISTER_IN_TIER_INPUT_TYPE = 1
export const NOSTROMO_REGISTER_IN_TIER_INPUT_SIZE = 4
export const NOSTROMO_REGISTER_IN_TIER_OUTPUT_SIZE = 4

export interface NostromoRegisterInTierInput {
  tierLevel: number
}

export const NOSTROMO_REGISTER_IN_TIER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'tierLevel',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildNostromoRegisterInTierInput(
  input: NostromoRegisterInTierInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_REGISTER_IN_TIER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoRegisterInTierOutput {
  tierLevel: number
}

export const NOSTROMO_REGISTER_IN_TIER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'tierLevel',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeNostromoRegisterInTierOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoRegisterInTierOutput {
  return decodePayload(
    data,
    NOSTROMO_REGISTER_IN_TIER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoRegisterInTierOutput
}

export const NOSTROMO_LOGOUT_FROM_TIER_INPUT_TYPE = 2
export const NOSTROMO_LOGOUT_FROM_TIER_INPUT_SIZE = 0
export const NOSTROMO_LOGOUT_FROM_TIER_OUTPUT_SIZE = 0

export const NOSTROMO_CREATE_PROJECT_INPUT_TYPE = 3
export const NOSTROMO_CREATE_PROJECT_INPUT_SIZE = 48
export const NOSTROMO_CREATE_PROJECT_OUTPUT_SIZE = 4

export interface NostromoCreateProjectInput {
  tokenName: bigint
  supply: bigint
  startYear: number
  startMonth: number
  startDay: number
  startHour: number
  endYear: number
  endMonth: number
  endDay: number
  endHour: number
}

export const NOSTROMO_CREATE_PROJECT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'tokenName',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'supply',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'startYear',
    type: 'uint32',
    offset: 16,
    byteLength: 4,
  },
  {
    name: 'startMonth',
    type: 'uint32',
    offset: 20,
    byteLength: 4,
  },
  {
    name: 'startDay',
    type: 'uint32',
    offset: 24,
    byteLength: 4,
  },
  {
    name: 'startHour',
    type: 'uint32',
    offset: 28,
    byteLength: 4,
  },
  {
    name: 'endYear',
    type: 'uint32',
    offset: 32,
    byteLength: 4,
  },
  {
    name: 'endMonth',
    type: 'uint32',
    offset: 36,
    byteLength: 4,
  },
  {
    name: 'endDay',
    type: 'uint32',
    offset: 40,
    byteLength: 4,
  },
  {
    name: 'endHour',
    type: 'uint32',
    offset: 44,
    byteLength: 4,
  },
]

export function buildNostromoCreateProjectInput(
  input: NostromoCreateProjectInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_CREATE_PROJECT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoCreateProjectOutput {
  indexOfProject: number
}

export const NOSTROMO_CREATE_PROJECT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfProject',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeNostromoCreateProjectOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoCreateProjectOutput {
  return decodePayload(
    data,
    NOSTROMO_CREATE_PROJECT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoCreateProjectOutput
}

export const NOSTROMO_VOTE_IN_PROJECT_INPUT_TYPE = 4
export const NOSTROMO_VOTE_IN_PROJECT_INPUT_SIZE = 4
export const NOSTROMO_VOTE_IN_PROJECT_OUTPUT_SIZE = 0

export interface NostromoVoteInProjectInput {
  indexOfProject: number
}

export const NOSTROMO_VOTE_IN_PROJECT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfProject',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildNostromoVoteInProjectInput(
  input: NostromoVoteInProjectInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_VOTE_IN_PROJECT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const NOSTROMO_CREATE_FUNDRAISING_INPUT_TYPE = 5
export const NOSTROMO_CREATE_FUNDRAISING_INPUT_SIZE = 175
export const NOSTROMO_CREATE_FUNDRAISING_OUTPUT_SIZE = 0

export interface NostromoCreateFundraisingInput {
  tokenPrice: bigint
  soldAmount: bigint
  requiredFunds: bigint
  indexOfProject: number
  firstPhaseStartYear: number
  firstPhaseStartMonth: number
  firstPhaseStartDay: number
  firstPhaseStartHour: number
  firstPhaseEndYear: number
  firstPhaseEndMonth: number
  firstPhaseEndDay: number
  firstPhaseEndHour: number
  secondPhaseStartYear: number
  secondPhaseStartMonth: number
  secondPhaseStartDay: number
  secondPhaseStartHour: number
  secondPhaseEndYear: number
  secondPhaseEndMonth: number
  secondPhaseEndDay: number
  secondPhaseEndHour: number
  thirdPhaseStartYear: number
  thirdPhaseStartMonth: number
  thirdPhaseStartDay: number
  thirdPhaseStartHour: number
  thirdPhaseEndYear: number
  thirdPhaseEndMonth: number
  thirdPhaseEndDay: number
  thirdPhaseEndHour: number
  listingStartYear: number
  listingStartMonth: number
  listingStartDay: number
  listingStartHour: number
  cliffEndYear: number
  cliffEndMonth: number
  cliffEndDay: number
  cliffEndHour: number
  vestingEndYear: number
  vestingEndMonth: number
  vestingEndDay: number
  vestingEndHour: number
  threshold: number
  TGE: number
  stepOfVesting: number
}

export const NOSTROMO_CREATE_FUNDRAISING_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'tokenPrice',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'soldAmount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'requiredFunds',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'indexOfProject',
    type: 'uint32',
    offset: 24,
    byteLength: 4,
  },
  {
    name: 'firstPhaseStartYear',
    type: 'uint32',
    offset: 28,
    byteLength: 4,
  },
  {
    name: 'firstPhaseStartMonth',
    type: 'uint32',
    offset: 32,
    byteLength: 4,
  },
  {
    name: 'firstPhaseStartDay',
    type: 'uint32',
    offset: 36,
    byteLength: 4,
  },
  {
    name: 'firstPhaseStartHour',
    type: 'uint32',
    offset: 40,
    byteLength: 4,
  },
  {
    name: 'firstPhaseEndYear',
    type: 'uint32',
    offset: 44,
    byteLength: 4,
  },
  {
    name: 'firstPhaseEndMonth',
    type: 'uint32',
    offset: 48,
    byteLength: 4,
  },
  {
    name: 'firstPhaseEndDay',
    type: 'uint32',
    offset: 52,
    byteLength: 4,
  },
  {
    name: 'firstPhaseEndHour',
    type: 'uint32',
    offset: 56,
    byteLength: 4,
  },
  {
    name: 'secondPhaseStartYear',
    type: 'uint32',
    offset: 60,
    byteLength: 4,
  },
  {
    name: 'secondPhaseStartMonth',
    type: 'uint32',
    offset: 64,
    byteLength: 4,
  },
  {
    name: 'secondPhaseStartDay',
    type: 'uint32',
    offset: 68,
    byteLength: 4,
  },
  {
    name: 'secondPhaseStartHour',
    type: 'uint32',
    offset: 72,
    byteLength: 4,
  },
  {
    name: 'secondPhaseEndYear',
    type: 'uint32',
    offset: 76,
    byteLength: 4,
  },
  {
    name: 'secondPhaseEndMonth',
    type: 'uint32',
    offset: 80,
    byteLength: 4,
  },
  {
    name: 'secondPhaseEndDay',
    type: 'uint32',
    offset: 84,
    byteLength: 4,
  },
  {
    name: 'secondPhaseEndHour',
    type: 'uint32',
    offset: 88,
    byteLength: 4,
  },
  {
    name: 'thirdPhaseStartYear',
    type: 'uint32',
    offset: 92,
    byteLength: 4,
  },
  {
    name: 'thirdPhaseStartMonth',
    type: 'uint32',
    offset: 96,
    byteLength: 4,
  },
  {
    name: 'thirdPhaseStartDay',
    type: 'uint32',
    offset: 100,
    byteLength: 4,
  },
  {
    name: 'thirdPhaseStartHour',
    type: 'uint32',
    offset: 104,
    byteLength: 4,
  },
  {
    name: 'thirdPhaseEndYear',
    type: 'uint32',
    offset: 108,
    byteLength: 4,
  },
  {
    name: 'thirdPhaseEndMonth',
    type: 'uint32',
    offset: 112,
    byteLength: 4,
  },
  {
    name: 'thirdPhaseEndDay',
    type: 'uint32',
    offset: 116,
    byteLength: 4,
  },
  {
    name: 'thirdPhaseEndHour',
    type: 'uint32',
    offset: 120,
    byteLength: 4,
  },
  {
    name: 'listingStartYear',
    type: 'uint32',
    offset: 124,
    byteLength: 4,
  },
  {
    name: 'listingStartMonth',
    type: 'uint32',
    offset: 128,
    byteLength: 4,
  },
  {
    name: 'listingStartDay',
    type: 'uint32',
    offset: 132,
    byteLength: 4,
  },
  {
    name: 'listingStartHour',
    type: 'uint32',
    offset: 136,
    byteLength: 4,
  },
  {
    name: 'cliffEndYear',
    type: 'uint32',
    offset: 140,
    byteLength: 4,
  },
  {
    name: 'cliffEndMonth',
    type: 'uint32',
    offset: 144,
    byteLength: 4,
  },
  {
    name: 'cliffEndDay',
    type: 'uint32',
    offset: 148,
    byteLength: 4,
  },
  {
    name: 'cliffEndHour',
    type: 'uint32',
    offset: 152,
    byteLength: 4,
  },
  {
    name: 'vestingEndYear',
    type: 'uint32',
    offset: 156,
    byteLength: 4,
  },
  {
    name: 'vestingEndMonth',
    type: 'uint32',
    offset: 160,
    byteLength: 4,
  },
  {
    name: 'vestingEndDay',
    type: 'uint32',
    offset: 164,
    byteLength: 4,
  },
  {
    name: 'vestingEndHour',
    type: 'uint32',
    offset: 168,
    byteLength: 4,
  },
  {
    name: 'threshold',
    type: 'uint8',
    offset: 172,
    byteLength: 1,
  },
  {
    name: 'TGE',
    type: 'uint8',
    offset: 173,
    byteLength: 1,
  },
  {
    name: 'stepOfVesting',
    type: 'uint8',
    offset: 174,
    byteLength: 1,
  },
]

export function buildNostromoCreateFundraisingInput(
  input: NostromoCreateFundraisingInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_CREATE_FUNDRAISING_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const NOSTROMO_INVEST_IN_PROJECT_INPUT_TYPE = 6
export const NOSTROMO_INVEST_IN_PROJECT_INPUT_SIZE = 4
export const NOSTROMO_INVEST_IN_PROJECT_OUTPUT_SIZE = 0

export interface NostromoInvestInProjectInput {
  indexOfFundraising: number
}

export const NOSTROMO_INVEST_IN_PROJECT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfFundraising',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildNostromoInvestInProjectInput(
  input: NostromoInvestInProjectInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_INVEST_IN_PROJECT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const NOSTROMO_CLAIM_TOKEN_INPUT_TYPE = 7
export const NOSTROMO_CLAIM_TOKEN_INPUT_SIZE = 12
export const NOSTROMO_CLAIM_TOKEN_OUTPUT_SIZE = 8

export interface NostromoClaimTokenInput {
  amount: bigint
  indexOfFundraising: number
}

export const NOSTROMO_CLAIM_TOKEN_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'indexOfFundraising',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function buildNostromoClaimTokenInput(
  input: NostromoClaimTokenInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_CLAIM_TOKEN_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoClaimTokenOutput {
  claimedAmount: bigint
}

export const NOSTROMO_CLAIM_TOKEN_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'claimedAmount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeNostromoClaimTokenOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoClaimTokenOutput {
  return decodePayload(
    data,
    NOSTROMO_CLAIM_TOKEN_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoClaimTokenOutput
}

export const NOSTROMO_UPGRADE_TIER_INPUT_TYPE = 8
export const NOSTROMO_UPGRADE_TIER_INPUT_SIZE = 4
export const NOSTROMO_UPGRADE_TIER_OUTPUT_SIZE = 0

export interface NostromoUpgradeTierInput {
  newTierLevel: number
}

export const NOSTROMO_UPGRADE_TIER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newTierLevel',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildNostromoUpgradeTierInput(
  input: NostromoUpgradeTierInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_UPGRADE_TIER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 9
export const NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_SIZE = 12
export const NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_SIZE = 8

export interface NostromoTransferShareManagementRightsInput {
  numberOfShares: bigint
  newManagingContractIndex: number
}

export const NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'newManagingContractIndex',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function buildNostromoTransferShareManagementRightsInput(
  input: NostromoTransferShareManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
}

export const NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeNostromoTransferShareManagementRightsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoTransferShareManagementRightsOutput {
  return decodePayload(
    data,
    NOSTROMO_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoTransferShareManagementRightsOutput
}

export const NOSTROMO_GET_STATS_INPUT_TYPE = 10
export const NOSTROMO_GET_STATS_INPUT_SIZE = 0
export const NOSTROMO_GET_STATS_OUTPUT_SIZE = 12

export interface NostromoGetStatsOutput {
  epochRevenue: bigint
  numberOfRegister: number
}

export const NOSTROMO_GET_STATS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'epochRevenue',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numberOfRegister',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
]

export function decodeNostromoGetStatsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoGetStatsOutput {
  return decodePayload(
    data,
    NOSTROMO_GET_STATS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoGetStatsOutput
}

export const NOSTROMO_GET_TIER_LEVEL_BY_USER_INPUT_TYPE = 11
export const NOSTROMO_GET_TIER_LEVEL_BY_USER_INPUT_SIZE = 32
export const NOSTROMO_GET_TIER_LEVEL_BY_USER_OUTPUT_SIZE = 1

export interface NostromoGetTierLevelByUserInput {
  userId: string
}

export const NOSTROMO_GET_TIER_LEVEL_BY_USER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'userId',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildNostromoGetTierLevelByUserInput(
  input: NostromoGetTierLevelByUserInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_GET_TIER_LEVEL_BY_USER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetTierLevelByUserOutput {
  tierLevel: number
}

export const NOSTROMO_GET_TIER_LEVEL_BY_USER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'tierLevel',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeNostromoGetTierLevelByUserOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoGetTierLevelByUserOutput {
  return decodePayload(
    data,
    NOSTROMO_GET_TIER_LEVEL_BY_USER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoGetTierLevelByUserOutput
}

export const NOSTROMO_GET_USER_VOTE_STATUS_INPUT_TYPE = 12
export const NOSTROMO_GET_USER_VOTE_STATUS_INPUT_SIZE = 32
export const NOSTROMO_GET_USER_VOTE_STATUS_OUTPUT_SIZE = 516

export interface NostromoGetUserVoteStatusInput {
  userId: string
}

export const NOSTROMO_GET_USER_VOTE_STATUS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'userId',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildNostromoGetUserVoteStatusInput(
  input: NostromoGetUserVoteStatusInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_GET_USER_VOTE_STATUS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetUserVoteStatusOutput {
  numberOfVotedProjects: number
  projectIndexList: number[]
}

export const NOSTROMO_GET_USER_VOTE_STATUS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfVotedProjects',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'projectIndexList',
    type: 'array',
    offset: 4,
    byteLength: 512,
    arrayLength: 128,
    arrayItemType: 'uint32',
    arrayItemByteLength: 4,
  },
]

export function decodeNostromoGetUserVoteStatusOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoGetUserVoteStatusOutput {
  return decodePayload(
    data,
    NOSTROMO_GET_USER_VOTE_STATUS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoGetUserVoteStatusOutput
}

export const NOSTROMO_CHECK_TOKEN_CREATABILITY_INPUT_TYPE = 13
export const NOSTROMO_CHECK_TOKEN_CREATABILITY_INPUT_SIZE = 8
export const NOSTROMO_CHECK_TOKEN_CREATABILITY_OUTPUT_SIZE = 0

export interface NostromoCheckTokenCreatabilityInput {
  tokenName: bigint
}

export const NOSTROMO_CHECK_TOKEN_CREATABILITY_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'tokenName',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildNostromoCheckTokenCreatabilityInput(
  input: NostromoCheckTokenCreatabilityInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_CHECK_TOKEN_CREATABILITY_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export const NOSTROMO_GET_NUMBER_OF_INVESTED_PROJECTS_INPUT_TYPE = 14
export const NOSTROMO_GET_NUMBER_OF_INVESTED_PROJECTS_INPUT_SIZE = 32
export const NOSTROMO_GET_NUMBER_OF_INVESTED_PROJECTS_OUTPUT_SIZE = 4

export interface NostromoGetNumberOfInvestedProjectsInput {
  userId: string
}

export const NOSTROMO_GET_NUMBER_OF_INVESTED_PROJECTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'userId',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildNostromoGetNumberOfInvestedProjectsInput(
  input: NostromoGetNumberOfInvestedProjectsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_GET_NUMBER_OF_INVESTED_PROJECTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetNumberOfInvestedProjectsOutput {
  numberOfInvestedProjects: number
}

export const NOSTROMO_GET_NUMBER_OF_INVESTED_PROJECTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfInvestedProjects',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function decodeNostromoGetNumberOfInvestedProjectsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoGetNumberOfInvestedProjectsOutput {
  return decodePayload(
    data,
    NOSTROMO_GET_NUMBER_OF_INVESTED_PROJECTS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoGetNumberOfInvestedProjectsOutput
}

export const NOSTROMO_GET_PROJECT_BY_INDEX_INPUT_TYPE = 15
export const NOSTROMO_GET_PROJECT_BY_INDEX_INPUT_SIZE = 4
export const NOSTROMO_GET_PROJECT_BY_INDEX_OUTPUT_SIZE = 64

export interface NostromoGetProjectByIndexInput {
  indexOfProject: number
}

export const NOSTROMO_GET_PROJECT_BY_INDEX_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfProject',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildNostromoGetProjectByIndexInput(
  input: NostromoGetProjectByIndexInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_GET_PROJECT_BY_INDEX_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetProjectByIndexOutput {
  project: NostromoProjectInfoStruct
}

export const NOSTROMO_GET_PROJECT_BY_INDEX_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'project',
    type: 'struct',
    offset: 0,
    byteLength: 64,
    structRef: 'projectInfo',
  },
]

export function decodeNostromoGetProjectByIndexOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoGetProjectByIndexOutput {
  return decodePayload(
    data,
    NOSTROMO_GET_PROJECT_BY_INDEX_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoGetProjectByIndexOutput
}

export const NOSTROMO_GET_FUNDARASING_BY_INDEX_INPUT_TYPE = 16
export const NOSTROMO_GET_FUNDARASING_BY_INDEX_INPUT_SIZE = 4
export const NOSTROMO_GET_FUNDARASING_BY_INDEX_OUTPUT_SIZE = 75

export interface NostromoGetFundarasingByIndexInput {
  indexOfFundarasing: number
}

export const NOSTROMO_GET_FUNDARASING_BY_INDEX_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexOfFundarasing',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
]

export function buildNostromoGetFundarasingByIndexInput(
  input: NostromoGetFundarasingByIndexInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_GET_FUNDARASING_BY_INDEX_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetFundarasingByIndexOutput {
  fundarasing: NostromoFundaraisingInfoStruct
}

export const NOSTROMO_GET_FUNDARASING_BY_INDEX_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'fundarasing',
    type: 'struct',
    offset: 0,
    byteLength: 75,
    structRef: 'fundaraisingInfo',
  },
]

export function decodeNostromoGetFundarasingByIndexOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoGetFundarasingByIndexOutput {
  return decodePayload(
    data,
    NOSTROMO_GET_FUNDARASING_BY_INDEX_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoGetFundarasingByIndexOutput
}

export const NOSTROMO_GET_PROJECT_INDEX_LIST_BY_CREATOR_INPUT_TYPE = 17
export const NOSTROMO_GET_PROJECT_INDEX_LIST_BY_CREATOR_INPUT_SIZE = 32
export const NOSTROMO_GET_PROJECT_INDEX_LIST_BY_CREATOR_OUTPUT_SIZE = 512

export interface NostromoGetProjectIndexListByCreatorInput {
  creator: string
}

export const NOSTROMO_GET_PROJECT_INDEX_LIST_BY_CREATOR_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'creator',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildNostromoGetProjectIndexListByCreatorInput(
  input: NostromoGetProjectIndexListByCreatorInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_GET_PROJECT_INDEX_LIST_BY_CREATOR_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetProjectIndexListByCreatorOutput {
  indexListForProjects: number[]
}

export const NOSTROMO_GET_PROJECT_INDEX_LIST_BY_CREATOR_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'indexListForProjects',
    type: 'array',
    offset: 0,
    byteLength: 512,
    arrayLength: 128,
    arrayItemType: 'uint32',
    arrayItemByteLength: 4,
  },
]

export function decodeNostromoGetProjectIndexListByCreatorOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoGetProjectIndexListByCreatorOutput {
  return decodePayload(
    data,
    NOSTROMO_GET_PROJECT_INDEX_LIST_BY_CREATOR_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoGetProjectIndexListByCreatorOutput
}

export const NOSTROMO_GET_INFO_USER_INVESTED_INPUT_TYPE = 18
export const NOSTROMO_GET_INFO_USER_INVESTED_INPUT_SIZE = 32
export const NOSTROMO_GET_INFO_USER_INVESTED_OUTPUT_SIZE = 2560

export interface NostromoGetInfoUserInvestedInput {
  investorId: string
}

export const NOSTROMO_GET_INFO_USER_INVESTED_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'investorId',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildNostromoGetInfoUserInvestedInput(
  input: NostromoGetInfoUserInvestedInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_GET_INFO_USER_INVESTED_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetInfoUserInvestedOutput {
  listUserInvested: number[]
}

export const NOSTROMO_GET_INFO_USER_INVESTED_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'listUserInvested',
    type: 'array',
    offset: 0,
    byteLength: 2560,
    arrayLength: 128,
    arrayItemByteLength: 20,
    arrayItemStructRef: 'investInfo',
  },
]

export function decodeNostromoGetInfoUserInvestedOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoGetInfoUserInvestedOutput {
  return decodePayload(
    data,
    NOSTROMO_GET_INFO_USER_INVESTED_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoGetInfoUserInvestedOutput
}

export const NOSTROMO_GET_MAX_CLAIM_AMOUNT_INPUT_TYPE = 19
export const NOSTROMO_GET_MAX_CLAIM_AMOUNT_INPUT_SIZE = 36
export const NOSTROMO_GET_MAX_CLAIM_AMOUNT_OUTPUT_SIZE = 8

export interface NostromoGetMaxClaimAmountInput {
  investorId: string
  indexOfFundraising: number
}

export const NOSTROMO_GET_MAX_CLAIM_AMOUNT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'investorId',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'indexOfFundraising',
    type: 'uint32',
    offset: 32,
    byteLength: 4,
  },
]

export function buildNostromoGetMaxClaimAmountInput(
  input: NostromoGetMaxClaimAmountInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(NOSTROMO_GET_MAX_CLAIM_AMOUNT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface NostromoGetMaxClaimAmountOutput {
  amount: bigint
}

export const NOSTROMO_GET_MAX_CLAIM_AMOUNT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeNostromoGetMaxClaimAmountOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): NostromoGetMaxClaimAmountOutput {
  return decodePayload(
    data,
    NOSTROMO_GET_MAX_CLAIM_AMOUNT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as NostromoGetMaxClaimAmountOutput
}

