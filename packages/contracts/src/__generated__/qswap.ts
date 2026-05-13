// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

export const QSWAP_CONTRACT_INDEX = 13

const STRUCTS: Record<string, NamedStruct> = {}

export const QSWAP_SET_INVEST_REWARDS_INFO_INPUT_TYPE = 3
export const QSWAP_SET_INVEST_REWARDS_INFO_INPUT_SIZE = 32
export const QSWAP_SET_INVEST_REWARDS_INFO_OUTPUT_SIZE = 1

export interface QswapSetInvestRewardsInfoInput {
  newInvestRewardsId: string
}

export const QSWAP_SET_INVEST_REWARDS_INFO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newInvestRewardsId',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildQswapSetInvestRewardsInfoInput(
  input: QswapSetInvestRewardsInfoInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_SET_INVEST_REWARDS_INFO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapSetInvestRewardsInfoOutput {
  success: number
}

export const QSWAP_SET_INVEST_REWARDS_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'success',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQswapSetInvestRewardsInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapSetInvestRewardsInfoOutput {
  return decodePayload(
    data,
    QSWAP_SET_INVEST_REWARDS_INFO_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapSetInvestRewardsInfoOutput
}

export const QSWAP_ISSUE_ASSET_INPUT_TYPE = 10
export const QSWAP_ISSUE_ASSET_INPUT_SIZE = 25
export const QSWAP_ISSUE_ASSET_OUTPUT_SIZE = 8

export interface QswapIssueAssetInput {
  assetName: bigint
  numberOfShares: bigint
  unitOfMeasurement: bigint
  numberOfDecimalPlaces: number
}

export const QSWAP_ISSUE_ASSET_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetName',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'unitOfMeasurement',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'numberOfDecimalPlaces',
    type: 'sint8',
    offset: 24,
    byteLength: 1,
  },
]

export function buildQswapIssueAssetInput(
  input: QswapIssueAssetInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_ISSUE_ASSET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapIssueAssetOutput {
  issuedNumberOfShares: bigint
}

export const QSWAP_ISSUE_ASSET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'issuedNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapIssueAssetOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapIssueAssetOutput {
  return decodePayload(
    data,
    QSWAP_ISSUE_ASSET_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapIssueAssetOutput
}

export const QSWAP_CREATE_POOL_INPUT_TYPE = 11
export const QSWAP_CREATE_POOL_INPUT_SIZE = 40
export const QSWAP_CREATE_POOL_OUTPUT_SIZE = 1

export interface QswapCreatePoolInput {
  assetIssuer: string
  assetName: bigint
}

export const QSWAP_CREATE_POOL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
]

export function buildQswapCreatePoolInput(
  input: QswapCreatePoolInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_CREATE_POOL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapCreatePoolOutput {
  success: number
}

export const QSWAP_CREATE_POOL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'success',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeQswapCreatePoolOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapCreatePoolOutput {
  return decodePayload(
    data,
    QSWAP_CREATE_POOL_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapCreatePoolOutput
}

export const QSWAP_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_TYPE = 12
export const QSWAP_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_SIZE = 80
export const QSWAP_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_OUTPUT_SIZE = 8

export interface QswapTransferShareOwnershipAndPossessionInput {
  assetIssuer: string
  assetName: bigint
  newOwnerAndPossessor: string
  amount: bigint
}

export const QSWAP_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'newOwnerAndPossessor',
    type: 'id',
    offset: 40,
    byteLength: 32,
  },
  {
    name: 'amount',
    type: 'sint64',
    offset: 72,
    byteLength: 8,
  },
]

export function buildQswapTransferShareOwnershipAndPossessionInput(
  input: QswapTransferShareOwnershipAndPossessionInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapTransferShareOwnershipAndPossessionOutput {
  transferredAmount: bigint
}

export const QSWAP_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapTransferShareOwnershipAndPossessionOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapTransferShareOwnershipAndPossessionOutput {
  return decodePayload(
    data,
    QSWAP_TRANSFER_SHARE_OWNERSHIP_AND_POSSESSION_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapTransferShareOwnershipAndPossessionOutput
}

export const QSWAP_ADD_LIQUIDITY_INPUT_TYPE = 13
export const QSWAP_ADD_LIQUIDITY_INPUT_SIZE = 64
export const QSWAP_ADD_LIQUIDITY_OUTPUT_SIZE = 24

export interface QswapAddLiquidityInput {
  assetIssuer: string
  assetName: bigint
  assetAmountDesired: bigint
  quAmountMin: bigint
  assetAmountMin: bigint
}

export const QSWAP_ADD_LIQUIDITY_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'assetAmountDesired',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'quAmountMin',
    type: 'sint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'assetAmountMin',
    type: 'sint64',
    offset: 56,
    byteLength: 8,
  },
]

export function buildQswapAddLiquidityInput(
  input: QswapAddLiquidityInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_ADD_LIQUIDITY_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapAddLiquidityOutput {
  userIncreaseLiquidity: bigint
  quAmount: bigint
  assetAmount: bigint
}

export const QSWAP_ADD_LIQUIDITY_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'userIncreaseLiquidity',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'quAmount',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'assetAmount',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
]

export function decodeQswapAddLiquidityOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapAddLiquidityOutput {
  return decodePayload(
    data,
    QSWAP_ADD_LIQUIDITY_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapAddLiquidityOutput
}

export const QSWAP_REMOVE_LIQUIDITY_INPUT_TYPE = 14
export const QSWAP_REMOVE_LIQUIDITY_INPUT_SIZE = 64
export const QSWAP_REMOVE_LIQUIDITY_OUTPUT_SIZE = 16

export interface QswapRemoveLiquidityInput {
  assetIssuer: string
  assetName: bigint
  burnLiquidity: bigint
  quAmountMin: bigint
  assetAmountMin: bigint
}

export const QSWAP_REMOVE_LIQUIDITY_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'burnLiquidity',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'quAmountMin',
    type: 'sint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'assetAmountMin',
    type: 'sint64',
    offset: 56,
    byteLength: 8,
  },
]

export function buildQswapRemoveLiquidityInput(
  input: QswapRemoveLiquidityInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_REMOVE_LIQUIDITY_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapRemoveLiquidityOutput {
  quAmount: bigint
  assetAmount: bigint
}

export const QSWAP_REMOVE_LIQUIDITY_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'quAmount',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'assetAmount',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
]

export function decodeQswapRemoveLiquidityOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapRemoveLiquidityOutput {
  return decodePayload(
    data,
    QSWAP_REMOVE_LIQUIDITY_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapRemoveLiquidityOutput
}

export const QSWAP_SWAP_EXACT_QU_FOR_ASSET_INPUT_TYPE = 15
export const QSWAP_SWAP_EXACT_QU_FOR_ASSET_INPUT_SIZE = 48
export const QSWAP_SWAP_EXACT_QU_FOR_ASSET_OUTPUT_SIZE = 8

export interface QswapSwapExactQuForAssetInput {
  assetIssuer: string
  assetName: bigint
  assetAmountOutMin: bigint
}

export const QSWAP_SWAP_EXACT_QU_FOR_ASSET_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'assetAmountOutMin',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQswapSwapExactQuForAssetInput(
  input: QswapSwapExactQuForAssetInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_SWAP_EXACT_QU_FOR_ASSET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapSwapExactQuForAssetOutput {
  assetAmountOut: bigint
}

export const QSWAP_SWAP_EXACT_QU_FOR_ASSET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetAmountOut',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapSwapExactQuForAssetOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapSwapExactQuForAssetOutput {
  return decodePayload(
    data,
    QSWAP_SWAP_EXACT_QU_FOR_ASSET_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapSwapExactQuForAssetOutput
}

export const QSWAP_SWAP_QU_FOR_EXACT_ASSET_INPUT_TYPE = 16
export const QSWAP_SWAP_QU_FOR_EXACT_ASSET_INPUT_SIZE = 48
export const QSWAP_SWAP_QU_FOR_EXACT_ASSET_OUTPUT_SIZE = 8

export interface QswapSwapQuForExactAssetInput {
  assetIssuer: string
  assetName: bigint
  assetAmountOut: bigint
}

export const QSWAP_SWAP_QU_FOR_EXACT_ASSET_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'assetAmountOut',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQswapSwapQuForExactAssetInput(
  input: QswapSwapQuForExactAssetInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_SWAP_QU_FOR_EXACT_ASSET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapSwapQuForExactAssetOutput {
  quAmountIn: bigint
}

export const QSWAP_SWAP_QU_FOR_EXACT_ASSET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'quAmountIn',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapSwapQuForExactAssetOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapSwapQuForExactAssetOutput {
  return decodePayload(
    data,
    QSWAP_SWAP_QU_FOR_EXACT_ASSET_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapSwapQuForExactAssetOutput
}

export const QSWAP_SWAP_EXACT_ASSET_FOR_QU_INPUT_TYPE = 17
export const QSWAP_SWAP_EXACT_ASSET_FOR_QU_INPUT_SIZE = 56
export const QSWAP_SWAP_EXACT_ASSET_FOR_QU_OUTPUT_SIZE = 8

export interface QswapSwapExactAssetForQuInput {
  assetIssuer: string
  assetName: bigint
  assetAmountIn: bigint
  quAmountOutMin: bigint
}

export const QSWAP_SWAP_EXACT_ASSET_FOR_QU_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'assetAmountIn',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'quAmountOutMin',
    type: 'sint64',
    offset: 48,
    byteLength: 8,
  },
]

export function buildQswapSwapExactAssetForQuInput(
  input: QswapSwapExactAssetForQuInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_SWAP_EXACT_ASSET_FOR_QU_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapSwapExactAssetForQuOutput {
  quAmountOut: bigint
}

export const QSWAP_SWAP_EXACT_ASSET_FOR_QU_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'quAmountOut',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapSwapExactAssetForQuOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapSwapExactAssetForQuOutput {
  return decodePayload(
    data,
    QSWAP_SWAP_EXACT_ASSET_FOR_QU_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapSwapExactAssetForQuOutput
}

export const QSWAP_SWAP_ASSET_FOR_EXACT_QU_INPUT_TYPE = 18
export const QSWAP_SWAP_ASSET_FOR_EXACT_QU_INPUT_SIZE = 56
export const QSWAP_SWAP_ASSET_FOR_EXACT_QU_OUTPUT_SIZE = 8

export interface QswapSwapAssetForExactQuInput {
  assetIssuer: string
  assetName: bigint
  assetAmountInMax: bigint
  quAmountOut: bigint
}

export const QSWAP_SWAP_ASSET_FOR_EXACT_QU_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'assetAmountInMax',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
  {
    name: 'quAmountOut',
    type: 'sint64',
    offset: 48,
    byteLength: 8,
  },
]

export function buildQswapSwapAssetForExactQuInput(
  input: QswapSwapAssetForExactQuInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_SWAP_ASSET_FOR_EXACT_QU_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapSwapAssetForExactQuOutput {
  assetAmountIn: bigint
}

export const QSWAP_SWAP_ASSET_FOR_EXACT_QU_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetAmountIn',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapSwapAssetForExactQuOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapSwapAssetForExactQuOutput {
  return decodePayload(
    data,
    QSWAP_SWAP_ASSET_FOR_EXACT_QU_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapSwapAssetForExactQuOutput
}

export const QSWAP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_TYPE = 19
export const QSWAP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_SIZE = 12
export const QSWAP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_SIZE = 8

export interface QswapTransferShareManagementRightsInput {
  numberOfShares: bigint
  newManagingContractIndex: number
}

export const QSWAP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
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

export function buildQswapTransferShareManagementRightsInput(
  input: QswapTransferShareManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapTransferShareManagementRightsOutput {
  transferredNumberOfShares: bigint
}

export const QSWAP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'transferredNumberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapTransferShareManagementRightsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapTransferShareManagementRightsOutput {
  return decodePayload(
    data,
    QSWAP_TRANSFER_SHARE_MANAGEMENT_RIGHTS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapTransferShareManagementRightsOutput
}

export const QSWAP_FEES_INPUT_TYPE = 1
export const QSWAP_FEES_INPUT_SIZE = 0
export const QSWAP_FEES_OUTPUT_SIZE = 32

export interface QswapFeesOutput {
  assetIssuanceFee: number
  poolCreationFee: number
  transferFee: number
  swapFee: number
  shareholderFee: number
  investRewardsFee: number
  qxFee: number
  burnFee: number
}

export const QSWAP_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuanceFee',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'poolCreationFee',
    type: 'uint32',
    offset: 4,
    byteLength: 4,
  },
  {
    name: 'transferFee',
    type: 'uint32',
    offset: 8,
    byteLength: 4,
  },
  {
    name: 'swapFee',
    type: 'uint32',
    offset: 12,
    byteLength: 4,
  },
  {
    name: 'shareholderFee',
    type: 'uint32',
    offset: 16,
    byteLength: 4,
  },
  {
    name: 'investRewardsFee',
    type: 'uint32',
    offset: 20,
    byteLength: 4,
  },
  {
    name: 'qxFee',
    type: 'uint32',
    offset: 24,
    byteLength: 4,
  },
  {
    name: 'burnFee',
    type: 'uint32',
    offset: 28,
    byteLength: 4,
  },
]

export function decodeQswapFeesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapFeesOutput {
  return decodePayload(
    data,
    QSWAP_FEES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapFeesOutput
}

export const QSWAP_INVEST_REWARDS_INFO_INPUT_TYPE = 2
export const QSWAP_INVEST_REWARDS_INFO_INPUT_SIZE = 0
export const QSWAP_INVEST_REWARDS_INFO_OUTPUT_SIZE = 36

export interface QswapInvestRewardsInfoOutput {
  investRewardsFee: number
  investRewardsId: string
}

export const QSWAP_INVEST_REWARDS_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'investRewardsFee',
    type: 'uint32',
    offset: 0,
    byteLength: 4,
  },
  {
    name: 'investRewardsId',
    type: 'id',
    offset: 4,
    byteLength: 32,
  },
]

export function decodeQswapInvestRewardsInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapInvestRewardsInfoOutput {
  return decodePayload(
    data,
    QSWAP_INVEST_REWARDS_INFO_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapInvestRewardsInfoOutput
}

export const QSWAP_GET_POOL_BASIC_STATE_INPUT_TYPE = 4
export const QSWAP_GET_POOL_BASIC_STATE_INPUT_SIZE = 40
export const QSWAP_GET_POOL_BASIC_STATE_OUTPUT_SIZE = 32

export interface QswapGetPoolBasicStateInput {
  assetIssuer: string
  assetName: bigint
}

export const QSWAP_GET_POOL_BASIC_STATE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
]

export function buildQswapGetPoolBasicStateInput(
  input: QswapGetPoolBasicStateInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_GET_POOL_BASIC_STATE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapGetPoolBasicStateOutput {
  poolExists: bigint
  reservedQuAmount: bigint
  reservedAssetAmount: bigint
  totalLiquidity: bigint
}

export const QSWAP_GET_POOL_BASIC_STATE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'poolExists',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'reservedQuAmount',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'reservedAssetAmount',
    type: 'sint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'totalLiquidity',
    type: 'sint64',
    offset: 24,
    byteLength: 8,
  },
]

export function decodeQswapGetPoolBasicStateOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapGetPoolBasicStateOutput {
  return decodePayload(
    data,
    QSWAP_GET_POOL_BASIC_STATE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapGetPoolBasicStateOutput
}

export const QSWAP_GET_LIQUIDITY_OF_INPUT_TYPE = 5
export const QSWAP_GET_LIQUIDITY_OF_INPUT_SIZE = 72
export const QSWAP_GET_LIQUIDITY_OF_OUTPUT_SIZE = 8

export interface QswapGetLiquidityOfInput {
  assetIssuer: string
  assetName: bigint
  account: string
}

export const QSWAP_GET_LIQUIDITY_OF_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'account',
    type: 'id',
    offset: 40,
    byteLength: 32,
  },
]

export function buildQswapGetLiquidityOfInput(
  input: QswapGetLiquidityOfInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_GET_LIQUIDITY_OF_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapGetLiquidityOfOutput {
  liquidity: bigint
}

export const QSWAP_GET_LIQUIDITY_OF_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'liquidity',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapGetLiquidityOfOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapGetLiquidityOfOutput {
  return decodePayload(
    data,
    QSWAP_GET_LIQUIDITY_OF_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapGetLiquidityOfOutput
}

export const QSWAP_QUOTE_EXACT_QU_INPUT_INPUT_TYPE = 6
export const QSWAP_QUOTE_EXACT_QU_INPUT_INPUT_SIZE = 48
export const QSWAP_QUOTE_EXACT_QU_INPUT_OUTPUT_SIZE = 8

export interface QswapQuoteExactQuInputInput {
  assetIssuer: string
  assetName: bigint
  quAmountIn: bigint
}

export const QSWAP_QUOTE_EXACT_QU_INPUT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'quAmountIn',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQswapQuoteExactQuInputInput(
  input: QswapQuoteExactQuInputInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_QUOTE_EXACT_QU_INPUT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapQuoteExactQuInputOutput {
  assetAmountOut: bigint
}

export const QSWAP_QUOTE_EXACT_QU_INPUT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetAmountOut',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapQuoteExactQuInputOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapQuoteExactQuInputOutput {
  return decodePayload(
    data,
    QSWAP_QUOTE_EXACT_QU_INPUT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapQuoteExactQuInputOutput
}

export const QSWAP_QUOTE_EXACT_QU_OUTPUT_INPUT_TYPE = 7
export const QSWAP_QUOTE_EXACT_QU_OUTPUT_INPUT_SIZE = 48
export const QSWAP_QUOTE_EXACT_QU_OUTPUT_OUTPUT_SIZE = 8

export interface QswapQuoteExactQuOutputInput {
  assetIssuer: string
  assetName: bigint
  quAmountOut: bigint
}

export const QSWAP_QUOTE_EXACT_QU_OUTPUT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'quAmountOut',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQswapQuoteExactQuOutputInput(
  input: QswapQuoteExactQuOutputInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_QUOTE_EXACT_QU_OUTPUT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapQuoteExactQuOutputOutput {
  assetAmountIn: bigint
}

export const QSWAP_QUOTE_EXACT_QU_OUTPUT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetAmountIn',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapQuoteExactQuOutputOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapQuoteExactQuOutputOutput {
  return decodePayload(
    data,
    QSWAP_QUOTE_EXACT_QU_OUTPUT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapQuoteExactQuOutputOutput
}

export const QSWAP_QUOTE_EXACT_ASSET_INPUT_INPUT_TYPE = 8
export const QSWAP_QUOTE_EXACT_ASSET_INPUT_INPUT_SIZE = 48
export const QSWAP_QUOTE_EXACT_ASSET_INPUT_OUTPUT_SIZE = 8

export interface QswapQuoteExactAssetInputInput {
  assetIssuer: string
  assetName: bigint
  assetAmountIn: bigint
}

export const QSWAP_QUOTE_EXACT_ASSET_INPUT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'assetAmountIn',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQswapQuoteExactAssetInputInput(
  input: QswapQuoteExactAssetInputInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_QUOTE_EXACT_ASSET_INPUT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapQuoteExactAssetInputOutput {
  quAmountOut: bigint
}

export const QSWAP_QUOTE_EXACT_ASSET_INPUT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'quAmountOut',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapQuoteExactAssetInputOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapQuoteExactAssetInputOutput {
  return decodePayload(
    data,
    QSWAP_QUOTE_EXACT_ASSET_INPUT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapQuoteExactAssetInputOutput
}

export const QSWAP_QUOTE_EXACT_ASSET_OUTPUT_INPUT_TYPE = 9
export const QSWAP_QUOTE_EXACT_ASSET_OUTPUT_INPUT_SIZE = 48
export const QSWAP_QUOTE_EXACT_ASSET_OUTPUT_OUTPUT_SIZE = 8

export interface QswapQuoteExactAssetOutputInput {
  assetIssuer: string
  assetName: bigint
  assetAmountOut: bigint
}

export const QSWAP_QUOTE_EXACT_ASSET_OUTPUT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'assetIssuer',
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
  {
    name: 'assetAmountOut',
    type: 'sint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildQswapQuoteExactAssetOutputInput(
  input: QswapQuoteExactAssetOutputInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(QSWAP_QUOTE_EXACT_ASSET_OUTPUT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface QswapQuoteExactAssetOutputOutput {
  quAmountIn: bigint
}

export const QSWAP_QUOTE_EXACT_ASSET_OUTPUT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'quAmountIn',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeQswapQuoteExactAssetOutputOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): QswapQuoteExactAssetOutputOutput {
  return decodePayload(
    data,
    QSWAP_QUOTE_EXACT_ASSET_OUTPUT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as QswapQuoteExactAssetOutputOutput
}

