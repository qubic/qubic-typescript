// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'

export const MULTI_SIGN_VAULT_CONTRACT_INDEX = 11

export interface MultiSignVaultAssetBalanceStruct {
  balance: bigint
}

export interface MultiSignVaultMsVaultFeeVoteStruct {
  registeringFee: bigint
  releaseFee: bigint
  releaseResetFee: bigint
  holdingFee: bigint
  depositFee: bigint
  burnFee: bigint
}

const STRUCTS: Record<string, NamedStruct> = {
  AssetBalance: {
  name: 'AssetBalance',
  byteLength: 8,
  fields: [
    {
      name: 'balance',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
],
},
  MsVaultFeeVote: {
  name: 'MsVaultFeeVote',
  byteLength: 48,
  fields: [
    {
      name: 'registeringFee',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'releaseFee',
      type: 'uint64',
      offset: 8,
      byteLength: 8,
    },
    {
      name: 'releaseResetFee',
      type: 'uint64',
      offset: 16,
      byteLength: 8,
    },
    {
      name: 'holdingFee',
      type: 'uint64',
      offset: 24,
      byteLength: 8,
    },
    {
      name: 'depositFee',
      type: 'uint64',
      offset: 32,
      byteLength: 8,
    },
    {
      name: 'burnFee',
      type: 'uint64',
      offset: 40,
      byteLength: 8,
    },
],
},
}

export const MULTI_SIGN_VAULT_REGISTER_VAULT_INPUT_TYPE = 7
export const MULTI_SIGN_VAULT_REGISTER_VAULT_INPUT_SIZE = 552
export const MULTI_SIGN_VAULT_REGISTER_VAULT_OUTPUT_SIZE = 8

export interface MultiSignVaultRegisterVaultInput {
  vaultName: string
  owners: string[]
  requiredApprovals: bigint
}

export const MULTI_SIGN_VAULT_REGISTER_VAULT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultName',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
  {
    name: 'owners',
    type: 'array',
    offset: 32,
    byteLength: 512,
    arrayLength: 16,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
  {
    name: 'requiredApprovals',
    type: 'uint64',
    offset: 544,
    byteLength: 8,
  },
]

export function buildMultiSignVaultRegisterVaultInput(
  input: MultiSignVaultRegisterVaultInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_REGISTER_VAULT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultRegisterVaultOutput {
  status: bigint
}

export const MULTI_SIGN_VAULT_REGISTER_VAULT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultRegisterVaultOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultRegisterVaultOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_REGISTER_VAULT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultRegisterVaultOutput
}

export const MULTI_SIGN_VAULT_DEPOSIT_INPUT_TYPE = 8
export const MULTI_SIGN_VAULT_DEPOSIT_INPUT_SIZE = 8
export const MULTI_SIGN_VAULT_DEPOSIT_OUTPUT_SIZE = 8

export interface MultiSignVaultDepositInput {
  vaultId: bigint
}

export const MULTI_SIGN_VAULT_DEPOSIT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMultiSignVaultDepositInput(
  input: MultiSignVaultDepositInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_DEPOSIT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultDepositOutput {
  status: bigint
}

export const MULTI_SIGN_VAULT_DEPOSIT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultDepositOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultDepositOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_DEPOSIT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultDepositOutput
}

export const MULTI_SIGN_VAULT_RELEASE_TO_INPUT_TYPE = 9
export const MULTI_SIGN_VAULT_RELEASE_TO_INPUT_SIZE = 48
export const MULTI_SIGN_VAULT_RELEASE_TO_OUTPUT_SIZE = 8

export interface MultiSignVaultReleaseToInput {
  vaultId: bigint
  amount: bigint
  destination: string
}

export const MULTI_SIGN_VAULT_RELEASE_TO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'destination',
    type: 'id',
    offset: 16,
    byteLength: 32,
  },
]

export function buildMultiSignVaultReleaseToInput(
  input: MultiSignVaultReleaseToInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_RELEASE_TO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultReleaseToOutput {
  status: bigint
}

export const MULTI_SIGN_VAULT_RELEASE_TO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultReleaseToOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultReleaseToOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_RELEASE_TO_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultReleaseToOutput
}

export const MULTI_SIGN_VAULT_RESET_RELEASE_INPUT_TYPE = 10
export const MULTI_SIGN_VAULT_RESET_RELEASE_INPUT_SIZE = 8
export const MULTI_SIGN_VAULT_RESET_RELEASE_OUTPUT_SIZE = 8

export interface MultiSignVaultResetReleaseInput {
  vaultId: bigint
}

export const MULTI_SIGN_VAULT_RESET_RELEASE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMultiSignVaultResetReleaseInput(
  input: MultiSignVaultResetReleaseInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_RESET_RELEASE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultResetReleaseOutput {
  status: bigint
}

export const MULTI_SIGN_VAULT_RESET_RELEASE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultResetReleaseOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultResetReleaseOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_RESET_RELEASE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultResetReleaseOutput
}

export const MULTI_SIGN_VAULT_VOTE_FEE_CHANGE_INPUT_TYPE = 11
export const MULTI_SIGN_VAULT_VOTE_FEE_CHANGE_INPUT_SIZE = 48
export const MULTI_SIGN_VAULT_VOTE_FEE_CHANGE_OUTPUT_SIZE = 8

export interface MultiSignVaultVoteFeeChangeInput {
  newRegisteringFee: bigint
  newReleaseFee: bigint
  newReleaseResetFee: bigint
  newHoldingFee: bigint
  newDepositFee: bigint
  burnFee: bigint
}

export const MULTI_SIGN_VAULT_VOTE_FEE_CHANGE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'newRegisteringFee',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'newReleaseFee',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'newReleaseResetFee',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'newHoldingFee',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'newDepositFee',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'burnFee',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function buildMultiSignVaultVoteFeeChangeInput(
  input: MultiSignVaultVoteFeeChangeInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_VOTE_FEE_CHANGE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultVoteFeeChangeOutput {
  status: bigint
}

export const MULTI_SIGN_VAULT_VOTE_FEE_CHANGE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultVoteFeeChangeOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultVoteFeeChangeOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_VOTE_FEE_CHANGE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultVoteFeeChangeOutput
}

export const MULTI_SIGN_VAULT_DEPOSIT_ASSET_INPUT_TYPE = 24
export const MULTI_SIGN_VAULT_DEPOSIT_ASSET_INPUT_SIZE = 16
export const MULTI_SIGN_VAULT_DEPOSIT_ASSET_OUTPUT_SIZE = 8

export interface MultiSignVaultDepositAssetInput {
  vaultId: bigint
  amount: bigint
}

export const MULTI_SIGN_VAULT_DEPOSIT_ASSET_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildMultiSignVaultDepositAssetInput(
  input: MultiSignVaultDepositAssetInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_DEPOSIT_ASSET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultDepositAssetOutput {
  status: bigint
}

export const MULTI_SIGN_VAULT_DEPOSIT_ASSET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultDepositAssetOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultDepositAssetOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_DEPOSIT_ASSET_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultDepositAssetOutput
}

export const MULTI_SIGN_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_INPUT_TYPE = 25
export const MULTI_SIGN_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_INPUT_SIZE = 8
export const MULTI_SIGN_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_OUTPUT_SIZE = 16

export interface MultiSignVaultRevokeAssetManagementRightsInput {
  numberOfShares: bigint
}

export const MULTI_SIGN_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfShares',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMultiSignVaultRevokeAssetManagementRightsInput(
  input: MultiSignVaultRevokeAssetManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultRevokeAssetManagementRightsOutput {
  transferredNumberOfShares: bigint
  status: bigint
}

export const MULTI_SIGN_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMultiSignVaultRevokeAssetManagementRightsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultRevokeAssetManagementRightsOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultRevokeAssetManagementRightsOutput
}

export const MULTI_SIGN_VAULT_RELEASE_ASSET_TO_INPUT_TYPE = 26
export const MULTI_SIGN_VAULT_RELEASE_ASSET_TO_INPUT_SIZE = 48
export const MULTI_SIGN_VAULT_RELEASE_ASSET_TO_OUTPUT_SIZE = 8

export interface MultiSignVaultReleaseAssetToInput {
  vaultId: bigint
  amount: bigint
  destination: string
}

export const MULTI_SIGN_VAULT_RELEASE_ASSET_TO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'destination',
    type: 'id',
    offset: 16,
    byteLength: 32,
  },
]

export function buildMultiSignVaultReleaseAssetToInput(
  input: MultiSignVaultReleaseAssetToInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_RELEASE_ASSET_TO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultReleaseAssetToOutput {
  status: bigint
}

export const MULTI_SIGN_VAULT_RELEASE_ASSET_TO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultReleaseAssetToOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultReleaseAssetToOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_RELEASE_ASSET_TO_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultReleaseAssetToOutput
}

export const MULTI_SIGN_VAULT_RESET_ASSET_RELEASE_INPUT_TYPE = 27
export const MULTI_SIGN_VAULT_RESET_ASSET_RELEASE_INPUT_SIZE = 8
export const MULTI_SIGN_VAULT_RESET_ASSET_RELEASE_OUTPUT_SIZE = 8

export interface MultiSignVaultResetAssetReleaseInput {
  vaultId: bigint
}

export const MULTI_SIGN_VAULT_RESET_ASSET_RELEASE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMultiSignVaultResetAssetReleaseInput(
  input: MultiSignVaultResetAssetReleaseInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_RESET_ASSET_RELEASE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultResetAssetReleaseOutput {
  status: bigint
}

export const MULTI_SIGN_VAULT_RESET_ASSET_RELEASE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultResetAssetReleaseOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultResetAssetReleaseOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_RESET_ASSET_RELEASE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultResetAssetReleaseOutput
}

export const MULTI_SIGN_VAULT_IS_SHARE_HOLDER_INPUT_TYPE = 5
export const MULTI_SIGN_VAULT_IS_SHARE_HOLDER_INPUT_SIZE = 32
export const MULTI_SIGN_VAULT_IS_SHARE_HOLDER_OUTPUT_SIZE = 8

export interface MultiSignVaultIsShareHolderInput {
  candidate: string
}

export const MULTI_SIGN_VAULT_IS_SHARE_HOLDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'candidate',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildMultiSignVaultIsShareHolderInput(
  input: MultiSignVaultIsShareHolderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_IS_SHARE_HOLDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultIsShareHolderOutput {
  result: bigint
}

export const MULTI_SIGN_VAULT_IS_SHARE_HOLDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'result',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultIsShareHolderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultIsShareHolderOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_IS_SHARE_HOLDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultIsShareHolderOutput
}

export const MULTI_SIGN_VAULT_GET_MANAGED_ASSET_BALANCE_INPUT_TYPE = 6
export const MULTI_SIGN_VAULT_GET_MANAGED_ASSET_BALANCE_INPUT_SIZE = 32
export const MULTI_SIGN_VAULT_GET_MANAGED_ASSET_BALANCE_OUTPUT_SIZE = 8

export interface MultiSignVaultGetManagedAssetBalanceInput {
  owner: string
}

export const MULTI_SIGN_VAULT_GET_MANAGED_ASSET_BALANCE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'owner',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildMultiSignVaultGetManagedAssetBalanceInput(
  input: MultiSignVaultGetManagedAssetBalanceInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_GET_MANAGED_ASSET_BALANCE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultGetManagedAssetBalanceOutput {
  balance: bigint
}

export const MULTI_SIGN_VAULT_GET_MANAGED_ASSET_BALANCE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'balance',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultGetManagedAssetBalanceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetManagedAssetBalanceOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_MANAGED_ASSET_BALANCE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetManagedAssetBalanceOutput
}

export const MULTI_SIGN_VAULT_GET_VAULTS_INPUT_TYPE = 12
export const MULTI_SIGN_VAULT_GET_VAULTS_INPUT_SIZE = 32
export const MULTI_SIGN_VAULT_GET_VAULTS_OUTPUT_SIZE = 328

export interface MultiSignVaultGetVaultsInput {
  publicKey: string
}

export const MULTI_SIGN_VAULT_GET_VAULTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'publicKey',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildMultiSignVaultGetVaultsInput(
  input: MultiSignVaultGetVaultsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_GET_VAULTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultGetVaultsOutput {
  numberOfVaults: bigint
  vaultIds: bigint[]
  vaultNames: string[]
}

export const MULTI_SIGN_VAULT_GET_VAULTS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfVaults',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'vaultIds',
    type: 'array',
    offset: 8,
    byteLength: 64,
    arrayLength: 8,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'vaultNames',
    type: 'array',
    offset: 72,
    byteLength: 256,
    arrayLength: 8,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
]

export function decodeMultiSignVaultGetVaultsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetVaultsOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_VAULTS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetVaultsOutput
}

export const MULTI_SIGN_VAULT_GET_RELEASE_STATUS_INPUT_TYPE = 13
export const MULTI_SIGN_VAULT_GET_RELEASE_STATUS_INPUT_SIZE = 8
export const MULTI_SIGN_VAULT_GET_RELEASE_STATUS_OUTPUT_SIZE = 648

export interface MultiSignVaultGetReleaseStatusInput {
  vaultId: bigint
}

export const MULTI_SIGN_VAULT_GET_RELEASE_STATUS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMultiSignVaultGetReleaseStatusInput(
  input: MultiSignVaultGetReleaseStatusInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_GET_RELEASE_STATUS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultGetReleaseStatusOutput {
  status: bigint
  amounts: bigint[]
  destinations: string[]
}

export const MULTI_SIGN_VAULT_GET_RELEASE_STATUS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'amounts',
    type: 'array',
    offset: 8,
    byteLength: 128,
    arrayLength: 16,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'destinations',
    type: 'array',
    offset: 136,
    byteLength: 512,
    arrayLength: 16,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
]

export function decodeMultiSignVaultGetReleaseStatusOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetReleaseStatusOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_RELEASE_STATUS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetReleaseStatusOutput
}

export const MULTI_SIGN_VAULT_GET_BALANCE_OF_INPUT_TYPE = 14
export const MULTI_SIGN_VAULT_GET_BALANCE_OF_INPUT_SIZE = 8
export const MULTI_SIGN_VAULT_GET_BALANCE_OF_OUTPUT_SIZE = 16

export interface MultiSignVaultGetBalanceOfInput {
  vaultId: bigint
}

export const MULTI_SIGN_VAULT_GET_BALANCE_OF_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMultiSignVaultGetBalanceOfInput(
  input: MultiSignVaultGetBalanceOfInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_GET_BALANCE_OF_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultGetBalanceOfOutput {
  status: bigint
  balance: bigint
}

export const MULTI_SIGN_VAULT_GET_BALANCE_OF_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'balance',
    type: 'sint64',
    offset: 8,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultGetBalanceOfOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetBalanceOfOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_BALANCE_OF_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetBalanceOfOutput
}

export const MULTI_SIGN_VAULT_GET_VAULT_NAME_INPUT_TYPE = 15
export const MULTI_SIGN_VAULT_GET_VAULT_NAME_INPUT_SIZE = 8
export const MULTI_SIGN_VAULT_GET_VAULT_NAME_OUTPUT_SIZE = 40

export interface MultiSignVaultGetVaultNameInput {
  vaultId: bigint
}

export const MULTI_SIGN_VAULT_GET_VAULT_NAME_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMultiSignVaultGetVaultNameInput(
  input: MultiSignVaultGetVaultNameInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_GET_VAULT_NAME_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultGetVaultNameOutput {
  status: bigint
  vaultName: string
}

export const MULTI_SIGN_VAULT_GET_VAULT_NAME_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'vaultName',
    type: 'id',
    offset: 8,
    byteLength: 32,
  },
]

export function decodeMultiSignVaultGetVaultNameOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetVaultNameOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_VAULT_NAME_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetVaultNameOutput
}

export const MULTI_SIGN_VAULT_GET_REVENUE_INFO_INPUT_TYPE = 16
export const MULTI_SIGN_VAULT_GET_REVENUE_INFO_INPUT_SIZE = 0
export const MULTI_SIGN_VAULT_GET_REVENUE_INFO_OUTPUT_SIZE = 32

export interface MultiSignVaultGetRevenueInfoOutput {
  numberOfActiveVaults: bigint
  totalRevenue: bigint
  totalDistributedToShareholders: bigint
  burnedAmount: bigint
}

export const MULTI_SIGN_VAULT_GET_REVENUE_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'numberOfActiveVaults',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'totalRevenue',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'totalDistributedToShareholders',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'burnedAmount',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultGetRevenueInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetRevenueInfoOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_REVENUE_INFO_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetRevenueInfoOutput
}

export const MULTI_SIGN_VAULT_GET_FEES_INPUT_TYPE = 17
export const MULTI_SIGN_VAULT_GET_FEES_INPUT_SIZE = 0
export const MULTI_SIGN_VAULT_GET_FEES_OUTPUT_SIZE = 48

export interface MultiSignVaultGetFeesOutput {
  registeringFee: bigint
  releaseFee: bigint
  releaseResetFee: bigint
  holdingFee: bigint
  depositFee: bigint
  burnFee: bigint
}

export const MULTI_SIGN_VAULT_GET_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'registeringFee',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'releaseFee',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'releaseResetFee',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
  {
    name: 'holdingFee',
    type: 'uint64',
    offset: 24,
    byteLength: 8,
  },
  {
    name: 'depositFee',
    type: 'uint64',
    offset: 32,
    byteLength: 8,
  },
  {
    name: 'burnFee',
    type: 'uint64',
    offset: 40,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultGetFeesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetFeesOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_FEES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetFeesOutput
}

export const MULTI_SIGN_VAULT_GET_VAULT_OWNERS_INPUT_TYPE = 18
export const MULTI_SIGN_VAULT_GET_VAULT_OWNERS_INPUT_SIZE = 8
export const MULTI_SIGN_VAULT_GET_VAULT_OWNERS_OUTPUT_SIZE = 536

export interface MultiSignVaultGetVaultOwnersInput {
  vaultId: bigint
}

export const MULTI_SIGN_VAULT_GET_VAULT_OWNERS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMultiSignVaultGetVaultOwnersInput(
  input: MultiSignVaultGetVaultOwnersInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_GET_VAULT_OWNERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultGetVaultOwnersOutput {
  status: bigint
  numberOfOwners: bigint
  owners: string[]
  requiredApprovals: bigint
}

export const MULTI_SIGN_VAULT_GET_VAULT_OWNERS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numberOfOwners',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'owners',
    type: 'array',
    offset: 16,
    byteLength: 512,
    arrayLength: 16,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
  {
    name: 'requiredApprovals',
    type: 'uint64',
    offset: 528,
    byteLength: 8,
  },
]

export function decodeMultiSignVaultGetVaultOwnersOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetVaultOwnersOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_VAULT_OWNERS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetVaultOwnersOutput
}

export const MULTI_SIGN_VAULT_GET_FEE_VOTES_INPUT_TYPE = 19
export const MULTI_SIGN_VAULT_GET_FEE_VOTES_INPUT_SIZE = 0
export const MULTI_SIGN_VAULT_GET_FEE_VOTES_OUTPUT_SIZE = 3088

export interface MultiSignVaultGetFeeVotesOutput {
  status: bigint
  numberOfFeeVotes: bigint
  feeVotes: number[]
}

export const MULTI_SIGN_VAULT_GET_FEE_VOTES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numberOfFeeVotes',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'feeVotes',
    type: 'array',
    offset: 16,
    byteLength: 3072,
    arrayLength: 64,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'MsVaultFeeVote',
  },
]

export function decodeMultiSignVaultGetFeeVotesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetFeeVotesOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_FEE_VOTES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetFeeVotesOutput
}

export const MULTI_SIGN_VAULT_GET_FEE_VOTES_OWNER_INPUT_TYPE = 20
export const MULTI_SIGN_VAULT_GET_FEE_VOTES_OWNER_INPUT_SIZE = 0
export const MULTI_SIGN_VAULT_GET_FEE_VOTES_OWNER_OUTPUT_SIZE = 2064

export interface MultiSignVaultGetFeeVotesOwnerOutput {
  status: bigint
  numberOfFeeVotes: bigint
  feeVotesOwner: string[]
}

export const MULTI_SIGN_VAULT_GET_FEE_VOTES_OWNER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numberOfFeeVotes',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'feeVotesOwner',
    type: 'array',
    offset: 16,
    byteLength: 2048,
    arrayLength: 64,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
]

export function decodeMultiSignVaultGetFeeVotesOwnerOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetFeeVotesOwnerOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_FEE_VOTES_OWNER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetFeeVotesOwnerOutput
}

export const MULTI_SIGN_VAULT_GET_FEE_VOTES_SCORE_INPUT_TYPE = 21
export const MULTI_SIGN_VAULT_GET_FEE_VOTES_SCORE_INPUT_SIZE = 0
export const MULTI_SIGN_VAULT_GET_FEE_VOTES_SCORE_OUTPUT_SIZE = 528

export interface MultiSignVaultGetFeeVotesScoreOutput {
  status: bigint
  numberOfFeeVotes: bigint
  feeVotesScore: bigint[]
}

export const MULTI_SIGN_VAULT_GET_FEE_VOTES_SCORE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numberOfFeeVotes',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'feeVotesScore',
    type: 'array',
    offset: 16,
    byteLength: 512,
    arrayLength: 64,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
]

export function decodeMultiSignVaultGetFeeVotesScoreOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetFeeVotesScoreOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_FEE_VOTES_SCORE_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetFeeVotesScoreOutput
}

export const MULTI_SIGN_VAULT_GET_UNIQUE_FEE_VOTES_INPUT_TYPE = 22
export const MULTI_SIGN_VAULT_GET_UNIQUE_FEE_VOTES_INPUT_SIZE = 0
export const MULTI_SIGN_VAULT_GET_UNIQUE_FEE_VOTES_OUTPUT_SIZE = 3088

export interface MultiSignVaultGetUniqueFeeVotesOutput {
  status: bigint
  numberOfUniqueFeeVotes: bigint
  uniqueFeeVotes: number[]
}

export const MULTI_SIGN_VAULT_GET_UNIQUE_FEE_VOTES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numberOfUniqueFeeVotes',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'uniqueFeeVotes',
    type: 'array',
    offset: 16,
    byteLength: 3072,
    arrayLength: 64,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'MsVaultFeeVote',
  },
]

export function decodeMultiSignVaultGetUniqueFeeVotesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetUniqueFeeVotesOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_UNIQUE_FEE_VOTES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetUniqueFeeVotesOutput
}

export const MULTI_SIGN_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_INPUT_TYPE = 23
export const MULTI_SIGN_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_INPUT_SIZE = 0
export const MULTI_SIGN_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_OUTPUT_SIZE = 528

export interface MultiSignVaultGetUniqueFeeVotesRankingOutput {
  status: bigint
  numberOfUniqueFeeVotes: bigint
  uniqueFeeVotesRanking: bigint[]
}

export const MULTI_SIGN_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numberOfUniqueFeeVotes',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'uniqueFeeVotesRanking',
    type: 'array',
    offset: 16,
    byteLength: 512,
    arrayLength: 64,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
]

export function decodeMultiSignVaultGetUniqueFeeVotesRankingOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetUniqueFeeVotesRankingOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetUniqueFeeVotesRankingOutput
}

export const MULTI_SIGN_VAULT_GET_ASSET_RELEASE_STATUS_INPUT_TYPE = 28
export const MULTI_SIGN_VAULT_GET_ASSET_RELEASE_STATUS_INPUT_SIZE = 8
export const MULTI_SIGN_VAULT_GET_ASSET_RELEASE_STATUS_OUTPUT_SIZE = 648

export interface MultiSignVaultGetAssetReleaseStatusInput {
  vaultId: bigint
}

export const MULTI_SIGN_VAULT_GET_ASSET_RELEASE_STATUS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMultiSignVaultGetAssetReleaseStatusInput(
  input: MultiSignVaultGetAssetReleaseStatusInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_GET_ASSET_RELEASE_STATUS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultGetAssetReleaseStatusOutput {
  status: bigint
  amounts: bigint[]
  destinations: string[]
}

export const MULTI_SIGN_VAULT_GET_ASSET_RELEASE_STATUS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'amounts',
    type: 'array',
    offset: 8,
    byteLength: 128,
    arrayLength: 16,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'destinations',
    type: 'array',
    offset: 136,
    byteLength: 512,
    arrayLength: 16,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
]

export function decodeMultiSignVaultGetAssetReleaseStatusOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetAssetReleaseStatusOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_ASSET_RELEASE_STATUS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetAssetReleaseStatusOutput
}

export const MULTI_SIGN_VAULT_GET_VAULT_ASSET_BALANCES_INPUT_TYPE = 29
export const MULTI_SIGN_VAULT_GET_VAULT_ASSET_BALANCES_INPUT_SIZE = 8
export const MULTI_SIGN_VAULT_GET_VAULT_ASSET_BALANCES_OUTPUT_SIZE = 80

export interface MultiSignVaultGetVaultAssetBalancesInput {
  vaultId: bigint
}

export const MULTI_SIGN_VAULT_GET_VAULT_ASSET_BALANCES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMultiSignVaultGetVaultAssetBalancesInput(
  input: MultiSignVaultGetVaultAssetBalancesInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MULTI_SIGN_VAULT_GET_VAULT_ASSET_BALANCES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MultiSignVaultGetVaultAssetBalancesOutput {
  status: bigint
  numberOfAssetTypes: bigint
  assetBalances: number[]
}

export const MULTI_SIGN_VAULT_GET_VAULT_ASSET_BALANCES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'numberOfAssetTypes',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'assetBalances',
    type: 'array',
    offset: 16,
    byteLength: 64,
    arrayLength: 8,
    arrayItemByteLength: 8,
    arrayItemStructRef: 'AssetBalance',
  },
]

export function decodeMultiSignVaultGetVaultAssetBalancesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MultiSignVaultGetVaultAssetBalancesOutput {
  return decodePayload(
    data,
    MULTI_SIGN_VAULT_GET_VAULT_ASSET_BALANCES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as MultiSignVaultGetVaultAssetBalancesOutput
}

