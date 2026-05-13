// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/registry'
import { buildPayload, decodePayload } from '@qubic.ts/registry'
import type { QubicRpcError } from '@qubic.ts/rpc'
import { type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '../result.js'

export const MS_VAULT_CONTRACT_INDEX = 11

export interface MsVaultAssetStruct {
  issuer: string
  assetName: bigint
}

export interface MsVaultAssetBalanceStruct {
  asset: MsVaultAssetStruct
  balance: bigint
}

export interface MsVaultMsVaultFeeVoteStruct {
  registeringFee: bigint
  releaseFee: bigint
  releaseResetFee: bigint
  holdingFee: bigint
  depositFee: bigint
  burnFee: bigint
}

const STRUCTS: Record<string, NamedStruct> = {
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
  AssetBalance: {
  name: 'AssetBalance',
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
      name: 'balance',
      type: 'uint64',
      offset: 40,
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

export const MS_VAULT_REGISTER_VAULT_INPUT_TYPE = 7

export interface MsVaultRegisterVaultInput {
  vaultName: string
  owners: string[]
  requiredApprovals: bigint
}

const MS_VAULT_REGISTER_VAULT_INPUT_FIELDS: BinaryField[] = [
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

export function buildMsVaultRegisterVaultInput(
  input: MsVaultRegisterVaultInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_REGISTER_VAULT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultRegisterVaultOutput {
  status: bigint
}

const MS_VAULT_REGISTER_VAULT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMsVaultRegisterVaultOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultRegisterVaultOutput {
  return decodePayload(data, MS_VAULT_REGISTER_VAULT_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultRegisterVaultOutput
}

export const MS_VAULT_DEPOSIT_INPUT_TYPE = 8

export interface MsVaultDepositInput {
  vaultId: bigint
}

const MS_VAULT_DEPOSIT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMsVaultDepositInput(
  input: MsVaultDepositInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_DEPOSIT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultDepositOutput {
  status: bigint
}

const MS_VAULT_DEPOSIT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMsVaultDepositOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultDepositOutput {
  return decodePayload(data, MS_VAULT_DEPOSIT_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultDepositOutput
}

export const MS_VAULT_RELEASE_TO_INPUT_TYPE = 9

export interface MsVaultReleaseToInput {
  vaultId: bigint
  amount: bigint
  destination: string
}

const MS_VAULT_RELEASE_TO_INPUT_FIELDS: BinaryField[] = [
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

export function buildMsVaultReleaseToInput(
  input: MsVaultReleaseToInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_RELEASE_TO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultReleaseToOutput {
  status: bigint
}

const MS_VAULT_RELEASE_TO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMsVaultReleaseToOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultReleaseToOutput {
  return decodePayload(data, MS_VAULT_RELEASE_TO_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultReleaseToOutput
}

export const MS_VAULT_RESET_RELEASE_INPUT_TYPE = 10

export interface MsVaultResetReleaseInput {
  vaultId: bigint
}

const MS_VAULT_RESET_RELEASE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMsVaultResetReleaseInput(
  input: MsVaultResetReleaseInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_RESET_RELEASE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultResetReleaseOutput {
  status: bigint
}

const MS_VAULT_RESET_RELEASE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMsVaultResetReleaseOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultResetReleaseOutput {
  return decodePayload(data, MS_VAULT_RESET_RELEASE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultResetReleaseOutput
}

export const MS_VAULT_VOTE_FEE_CHANGE_INPUT_TYPE = 11

export interface MsVaultVoteFeeChangeInput {
  newRegisteringFee: bigint
  newReleaseFee: bigint
  newReleaseResetFee: bigint
  newHoldingFee: bigint
  newDepositFee: bigint
  burnFee: bigint
}

const MS_VAULT_VOTE_FEE_CHANGE_INPUT_FIELDS: BinaryField[] = [
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

export function buildMsVaultVoteFeeChangeInput(
  input: MsVaultVoteFeeChangeInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_VOTE_FEE_CHANGE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultVoteFeeChangeOutput {
  status: bigint
}

const MS_VAULT_VOTE_FEE_CHANGE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMsVaultVoteFeeChangeOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultVoteFeeChangeOutput {
  return decodePayload(data, MS_VAULT_VOTE_FEE_CHANGE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultVoteFeeChangeOutput
}

export const MS_VAULT_DEPOSIT_ASSET_INPUT_TYPE = 24

export interface MsVaultDepositAssetInput {
  vaultId: bigint
  asset: MsVaultAssetStruct
  amount: bigint
}

const MS_VAULT_DEPOSIT_ASSET_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'asset',
    type: 'struct',
    offset: 8,
    byteLength: 40,
    structRef: 'Asset',
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
]

export function buildMsVaultDepositAssetInput(
  input: MsVaultDepositAssetInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_DEPOSIT_ASSET_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultDepositAssetOutput {
  status: bigint
}

const MS_VAULT_DEPOSIT_ASSET_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMsVaultDepositAssetOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultDepositAssetOutput {
  return decodePayload(data, MS_VAULT_DEPOSIT_ASSET_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultDepositAssetOutput
}

export const MS_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_INPUT_TYPE = 25

export interface MsVaultRevokeAssetManagementRightsInput {
  asset: MsVaultAssetStruct
  numberOfShares: bigint
}

const MS_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_INPUT_FIELDS: BinaryField[] = [
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

export function buildMsVaultRevokeAssetManagementRightsInput(
  input: MsVaultRevokeAssetManagementRightsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultRevokeAssetManagementRightsOutput {
  transferredNumberOfShares: bigint
  status: bigint
}

const MS_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultRevokeAssetManagementRightsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultRevokeAssetManagementRightsOutput {
  return decodePayload(data, MS_VAULT_REVOKE_ASSET_MANAGEMENT_RIGHTS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultRevokeAssetManagementRightsOutput
}

export const MS_VAULT_RELEASE_ASSET_TO_INPUT_TYPE = 26

export interface MsVaultReleaseAssetToInput {
  vaultId: bigint
  asset: MsVaultAssetStruct
  amount: bigint
  destination: string
}

const MS_VAULT_RELEASE_ASSET_TO_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'asset',
    type: 'struct',
    offset: 8,
    byteLength: 40,
    structRef: 'Asset',
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 48,
    byteLength: 8,
  },
  {
    name: 'destination',
    type: 'id',
    offset: 56,
    byteLength: 32,
  },
]

export function buildMsVaultReleaseAssetToInput(
  input: MsVaultReleaseAssetToInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_RELEASE_ASSET_TO_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultReleaseAssetToOutput {
  status: bigint
}

const MS_VAULT_RELEASE_ASSET_TO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMsVaultReleaseAssetToOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultReleaseAssetToOutput {
  return decodePayload(data, MS_VAULT_RELEASE_ASSET_TO_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultReleaseAssetToOutput
}

export const MS_VAULT_RESET_ASSET_RELEASE_INPUT_TYPE = 27

export interface MsVaultResetAssetReleaseInput {
  vaultId: bigint
}

const MS_VAULT_RESET_ASSET_RELEASE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMsVaultResetAssetReleaseInput(
  input: MsVaultResetAssetReleaseInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_RESET_ASSET_RELEASE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultResetAssetReleaseOutput {
  status: bigint
}

const MS_VAULT_RESET_ASSET_RELEASE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMsVaultResetAssetReleaseOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultResetAssetReleaseOutput {
  return decodePayload(data, MS_VAULT_RESET_ASSET_RELEASE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultResetAssetReleaseOutput
}

export const MS_VAULT_IS_SHARE_HOLDER_INPUT_TYPE = 5
export const MS_VAULT_IS_SHARE_HOLDER_INPUT_SIZE = 32

export interface MsVaultIsShareHolderInput {
  candidate: string
}

const MS_VAULT_IS_SHARE_HOLDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'candidate',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildMsVaultIsShareHolderInput(
  input: MsVaultIsShareHolderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_IS_SHARE_HOLDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultIsShareHolderOutput {
  result: bigint
}

const MS_VAULT_IS_SHARE_HOLDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'result',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMsVaultIsShareHolderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultIsShareHolderOutput {
  return decodePayload(data, MS_VAULT_IS_SHARE_HOLDER_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultIsShareHolderOutput
}

export async function msVaultIsShareHolder(
  live: SmartContractCaller,
  input: MsVaultIsShareHolderInput,
  options?: ContractCallOptions,
): Promise<Result<MsVaultIsShareHolderOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_IS_SHARE_HOLDER_INPUT_TYPE,
    inputSize: MS_VAULT_IS_SHARE_HOLDER_INPUT_SIZE,
    inputFields: MS_VAULT_IS_SHARE_HOLDER_INPUT_FIELDS,
    outputFields: MS_VAULT_IS_SHARE_HOLDER_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const MS_VAULT_GET_MANAGED_ASSET_BALANCE_INPUT_TYPE = 6
export const MS_VAULT_GET_MANAGED_ASSET_BALANCE_INPUT_SIZE = 72

export interface MsVaultGetManagedAssetBalanceInput {
  asset: MsVaultAssetStruct
  owner: string
}

const MS_VAULT_GET_MANAGED_ASSET_BALANCE_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'asset',
    type: 'struct',
    offset: 0,
    byteLength: 40,
    structRef: 'Asset',
  },
  {
    name: 'owner',
    type: 'id',
    offset: 40,
    byteLength: 32,
  },
]

export function buildMsVaultGetManagedAssetBalanceInput(
  input: MsVaultGetManagedAssetBalanceInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_GET_MANAGED_ASSET_BALANCE_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultGetManagedAssetBalanceOutput {
  balance: bigint
}

const MS_VAULT_GET_MANAGED_ASSET_BALANCE_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'balance',
    type: 'sint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeMsVaultGetManagedAssetBalanceOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetManagedAssetBalanceOutput {
  return decodePayload(data, MS_VAULT_GET_MANAGED_ASSET_BALANCE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetManagedAssetBalanceOutput
}

export async function msVaultGetManagedAssetBalance(
  live: SmartContractCaller,
  input: MsVaultGetManagedAssetBalanceInput,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetManagedAssetBalanceOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_MANAGED_ASSET_BALANCE_INPUT_TYPE,
    inputSize: MS_VAULT_GET_MANAGED_ASSET_BALANCE_INPUT_SIZE,
    inputFields: MS_VAULT_GET_MANAGED_ASSET_BALANCE_INPUT_FIELDS,
    outputFields: MS_VAULT_GET_MANAGED_ASSET_BALANCE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const MS_VAULT_GET_VAULTS_INPUT_TYPE = 12
export const MS_VAULT_GET_VAULTS_INPUT_SIZE = 32

export interface MsVaultGetVaultsInput {
  publicKey: string
}

const MS_VAULT_GET_VAULTS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'publicKey',
    type: 'id',
    offset: 0,
    byteLength: 32,
  },
]

export function buildMsVaultGetVaultsInput(
  input: MsVaultGetVaultsInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_GET_VAULTS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultGetVaultsOutput {
  numberOfVaults: bigint
  vaultIds: bigint[]
  vaultNames: string[]
}

const MS_VAULT_GET_VAULTS_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetVaultsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetVaultsOutput {
  return decodePayload(data, MS_VAULT_GET_VAULTS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetVaultsOutput
}

export async function msVaultGetVaults(
  live: SmartContractCaller,
  input: MsVaultGetVaultsInput,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetVaultsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_VAULTS_INPUT_TYPE,
    inputSize: MS_VAULT_GET_VAULTS_INPUT_SIZE,
    inputFields: MS_VAULT_GET_VAULTS_INPUT_FIELDS,
    outputFields: MS_VAULT_GET_VAULTS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const MS_VAULT_GET_RELEASE_STATUS_INPUT_TYPE = 13
export const MS_VAULT_GET_RELEASE_STATUS_INPUT_SIZE = 8

export interface MsVaultGetReleaseStatusInput {
  vaultId: bigint
}

const MS_VAULT_GET_RELEASE_STATUS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMsVaultGetReleaseStatusInput(
  input: MsVaultGetReleaseStatusInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_GET_RELEASE_STATUS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultGetReleaseStatusOutput {
  status: bigint
  amounts: bigint[]
  destinations: string[]
}

const MS_VAULT_GET_RELEASE_STATUS_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetReleaseStatusOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetReleaseStatusOutput {
  return decodePayload(data, MS_VAULT_GET_RELEASE_STATUS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetReleaseStatusOutput
}

export async function msVaultGetReleaseStatus(
  live: SmartContractCaller,
  input: MsVaultGetReleaseStatusInput,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetReleaseStatusOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_RELEASE_STATUS_INPUT_TYPE,
    inputSize: MS_VAULT_GET_RELEASE_STATUS_INPUT_SIZE,
    inputFields: MS_VAULT_GET_RELEASE_STATUS_INPUT_FIELDS,
    outputFields: MS_VAULT_GET_RELEASE_STATUS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const MS_VAULT_GET_BALANCE_OF_INPUT_TYPE = 14
export const MS_VAULT_GET_BALANCE_OF_INPUT_SIZE = 8

export interface MsVaultGetBalanceOfInput {
  vaultId: bigint
}

const MS_VAULT_GET_BALANCE_OF_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMsVaultGetBalanceOfInput(
  input: MsVaultGetBalanceOfInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_GET_BALANCE_OF_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultGetBalanceOfOutput {
  status: bigint
  balance: bigint
}

const MS_VAULT_GET_BALANCE_OF_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetBalanceOfOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetBalanceOfOutput {
  return decodePayload(data, MS_VAULT_GET_BALANCE_OF_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetBalanceOfOutput
}

export async function msVaultGetBalanceOf(
  live: SmartContractCaller,
  input: MsVaultGetBalanceOfInput,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetBalanceOfOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_BALANCE_OF_INPUT_TYPE,
    inputSize: MS_VAULT_GET_BALANCE_OF_INPUT_SIZE,
    inputFields: MS_VAULT_GET_BALANCE_OF_INPUT_FIELDS,
    outputFields: MS_VAULT_GET_BALANCE_OF_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const MS_VAULT_GET_VAULT_NAME_INPUT_TYPE = 15
export const MS_VAULT_GET_VAULT_NAME_INPUT_SIZE = 8

export interface MsVaultGetVaultNameInput {
  vaultId: bigint
}

const MS_VAULT_GET_VAULT_NAME_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMsVaultGetVaultNameInput(
  input: MsVaultGetVaultNameInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_GET_VAULT_NAME_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultGetVaultNameOutput {
  status: bigint
  vaultName: string
}

const MS_VAULT_GET_VAULT_NAME_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetVaultNameOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetVaultNameOutput {
  return decodePayload(data, MS_VAULT_GET_VAULT_NAME_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetVaultNameOutput
}

export async function msVaultGetVaultName(
  live: SmartContractCaller,
  input: MsVaultGetVaultNameInput,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetVaultNameOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_VAULT_NAME_INPUT_TYPE,
    inputSize: MS_VAULT_GET_VAULT_NAME_INPUT_SIZE,
    inputFields: MS_VAULT_GET_VAULT_NAME_INPUT_FIELDS,
    outputFields: MS_VAULT_GET_VAULT_NAME_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const MS_VAULT_GET_REVENUE_INFO_INPUT_TYPE = 16
export const MS_VAULT_GET_REVENUE_INFO_INPUT_SIZE = 0

export interface MsVaultGetRevenueInfoOutput {
  numberOfActiveVaults: bigint
  totalRevenue: bigint
  totalDistributedToShareholders: bigint
  burnedAmount: bigint
}

const MS_VAULT_GET_REVENUE_INFO_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetRevenueInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetRevenueInfoOutput {
  return decodePayload(data, MS_VAULT_GET_REVENUE_INFO_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetRevenueInfoOutput
}

export async function msVaultGetRevenueInfo(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetRevenueInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_REVENUE_INFO_INPUT_TYPE,
    inputSize: MS_VAULT_GET_REVENUE_INFO_INPUT_SIZE,
    inputFields: [],
    outputFields: MS_VAULT_GET_REVENUE_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const MS_VAULT_GET_FEES_INPUT_TYPE = 17
export const MS_VAULT_GET_FEES_INPUT_SIZE = 0

export interface MsVaultGetFeesOutput {
  registeringFee: bigint
  releaseFee: bigint
  releaseResetFee: bigint
  holdingFee: bigint
  depositFee: bigint
  burnFee: bigint
}

const MS_VAULT_GET_FEES_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetFeesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetFeesOutput {
  return decodePayload(data, MS_VAULT_GET_FEES_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetFeesOutput
}

export async function msVaultGetFees(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetFeesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_FEES_INPUT_TYPE,
    inputSize: MS_VAULT_GET_FEES_INPUT_SIZE,
    inputFields: [],
    outputFields: MS_VAULT_GET_FEES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const MS_VAULT_GET_VAULT_OWNERS_INPUT_TYPE = 18
export const MS_VAULT_GET_VAULT_OWNERS_INPUT_SIZE = 8

export interface MsVaultGetVaultOwnersInput {
  vaultId: bigint
}

const MS_VAULT_GET_VAULT_OWNERS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMsVaultGetVaultOwnersInput(
  input: MsVaultGetVaultOwnersInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_GET_VAULT_OWNERS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultGetVaultOwnersOutput {
  status: bigint
  numberOfOwners: bigint
  owners: string[]
  requiredApprovals: bigint
}

const MS_VAULT_GET_VAULT_OWNERS_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetVaultOwnersOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetVaultOwnersOutput {
  return decodePayload(data, MS_VAULT_GET_VAULT_OWNERS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetVaultOwnersOutput
}

export async function msVaultGetVaultOwners(
  live: SmartContractCaller,
  input: MsVaultGetVaultOwnersInput,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetVaultOwnersOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_VAULT_OWNERS_INPUT_TYPE,
    inputSize: MS_VAULT_GET_VAULT_OWNERS_INPUT_SIZE,
    inputFields: MS_VAULT_GET_VAULT_OWNERS_INPUT_FIELDS,
    outputFields: MS_VAULT_GET_VAULT_OWNERS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const MS_VAULT_GET_FEE_VOTES_INPUT_TYPE = 19
export const MS_VAULT_GET_FEE_VOTES_INPUT_SIZE = 0

export interface MsVaultGetFeeVotesOutput {
  status: bigint
  numberOfFeeVotes: bigint
  feeVotes: number[]
}

const MS_VAULT_GET_FEE_VOTES_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetFeeVotesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetFeeVotesOutput {
  return decodePayload(data, MS_VAULT_GET_FEE_VOTES_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetFeeVotesOutput
}

export async function msVaultGetFeeVotes(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetFeeVotesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_FEE_VOTES_INPUT_TYPE,
    inputSize: MS_VAULT_GET_FEE_VOTES_INPUT_SIZE,
    inputFields: [],
    outputFields: MS_VAULT_GET_FEE_VOTES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const MS_VAULT_GET_FEE_VOTES_OWNER_INPUT_TYPE = 20
export const MS_VAULT_GET_FEE_VOTES_OWNER_INPUT_SIZE = 0

export interface MsVaultGetFeeVotesOwnerOutput {
  status: bigint
  numberOfFeeVotes: bigint
  feeVotesOwner: string[]
}

const MS_VAULT_GET_FEE_VOTES_OWNER_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetFeeVotesOwnerOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetFeeVotesOwnerOutput {
  return decodePayload(data, MS_VAULT_GET_FEE_VOTES_OWNER_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetFeeVotesOwnerOutput
}

export async function msVaultGetFeeVotesOwner(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetFeeVotesOwnerOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_FEE_VOTES_OWNER_INPUT_TYPE,
    inputSize: MS_VAULT_GET_FEE_VOTES_OWNER_INPUT_SIZE,
    inputFields: [],
    outputFields: MS_VAULT_GET_FEE_VOTES_OWNER_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const MS_VAULT_GET_FEE_VOTES_SCORE_INPUT_TYPE = 21
export const MS_VAULT_GET_FEE_VOTES_SCORE_INPUT_SIZE = 0

export interface MsVaultGetFeeVotesScoreOutput {
  status: bigint
  numberOfFeeVotes: bigint
  feeVotesScore: bigint[]
}

const MS_VAULT_GET_FEE_VOTES_SCORE_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetFeeVotesScoreOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetFeeVotesScoreOutput {
  return decodePayload(data, MS_VAULT_GET_FEE_VOTES_SCORE_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetFeeVotesScoreOutput
}

export async function msVaultGetFeeVotesScore(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetFeeVotesScoreOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_FEE_VOTES_SCORE_INPUT_TYPE,
    inputSize: MS_VAULT_GET_FEE_VOTES_SCORE_INPUT_SIZE,
    inputFields: [],
    outputFields: MS_VAULT_GET_FEE_VOTES_SCORE_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const MS_VAULT_GET_UNIQUE_FEE_VOTES_INPUT_TYPE = 22
export const MS_VAULT_GET_UNIQUE_FEE_VOTES_INPUT_SIZE = 0

export interface MsVaultGetUniqueFeeVotesOutput {
  status: bigint
  numberOfUniqueFeeVotes: bigint
  uniqueFeeVotes: number[]
}

const MS_VAULT_GET_UNIQUE_FEE_VOTES_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetUniqueFeeVotesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetUniqueFeeVotesOutput {
  return decodePayload(data, MS_VAULT_GET_UNIQUE_FEE_VOTES_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetUniqueFeeVotesOutput
}

export async function msVaultGetUniqueFeeVotes(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetUniqueFeeVotesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_UNIQUE_FEE_VOTES_INPUT_TYPE,
    inputSize: MS_VAULT_GET_UNIQUE_FEE_VOTES_INPUT_SIZE,
    inputFields: [],
    outputFields: MS_VAULT_GET_UNIQUE_FEE_VOTES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const MS_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_INPUT_TYPE = 23
export const MS_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_INPUT_SIZE = 0

export interface MsVaultGetUniqueFeeVotesRankingOutput {
  status: bigint
  numberOfUniqueFeeVotes: bigint
  uniqueFeeVotesRanking: bigint[]
}

const MS_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_OUTPUT_FIELDS: BinaryField[] = [
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

export function decodeMsVaultGetUniqueFeeVotesRankingOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetUniqueFeeVotesRankingOutput {
  return decodePayload(data, MS_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetUniqueFeeVotesRankingOutput
}

export async function msVaultGetUniqueFeeVotesRanking(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetUniqueFeeVotesRankingOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_INPUT_TYPE,
    inputSize: MS_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_INPUT_SIZE,
    inputFields: [],
    outputFields: MS_VAULT_GET_UNIQUE_FEE_VOTES_RANKING_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const MS_VAULT_GET_ASSET_RELEASE_STATUS_INPUT_TYPE = 28
export const MS_VAULT_GET_ASSET_RELEASE_STATUS_INPUT_SIZE = 8

export interface MsVaultGetAssetReleaseStatusInput {
  vaultId: bigint
}

const MS_VAULT_GET_ASSET_RELEASE_STATUS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMsVaultGetAssetReleaseStatusInput(
  input: MsVaultGetAssetReleaseStatusInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_GET_ASSET_RELEASE_STATUS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultGetAssetReleaseStatusOutput {
  status: bigint
  assets: number[]
  amounts: bigint[]
  destinations: string[]
}

const MS_VAULT_GET_ASSET_RELEASE_STATUS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'assets',
    type: 'array',
    offset: 8,
    byteLength: 640,
    arrayLength: 16,
    arrayItemByteLength: 40,
    arrayItemStructRef: 'Asset',
  },
  {
    name: 'amounts',
    type: 'array',
    offset: 648,
    byteLength: 128,
    arrayLength: 16,
    arrayItemType: 'uint64',
    arrayItemByteLength: 8,
  },
  {
    name: 'destinations',
    type: 'array',
    offset: 776,
    byteLength: 512,
    arrayLength: 16,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
]

export function decodeMsVaultGetAssetReleaseStatusOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetAssetReleaseStatusOutput {
  return decodePayload(data, MS_VAULT_GET_ASSET_RELEASE_STATUS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetAssetReleaseStatusOutput
}

export async function msVaultGetAssetReleaseStatus(
  live: SmartContractCaller,
  input: MsVaultGetAssetReleaseStatusInput,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetAssetReleaseStatusOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_ASSET_RELEASE_STATUS_INPUT_TYPE,
    inputSize: MS_VAULT_GET_ASSET_RELEASE_STATUS_INPUT_SIZE,
    inputFields: MS_VAULT_GET_ASSET_RELEASE_STATUS_INPUT_FIELDS,
    outputFields: MS_VAULT_GET_ASSET_RELEASE_STATUS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const MS_VAULT_GET_VAULT_ASSET_BALANCES_INPUT_TYPE = 29
export const MS_VAULT_GET_VAULT_ASSET_BALANCES_INPUT_SIZE = 8

export interface MsVaultGetVaultAssetBalancesInput {
  vaultId: bigint
}

const MS_VAULT_GET_VAULT_ASSET_BALANCES_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'vaultId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildMsVaultGetVaultAssetBalancesInput(
  input: MsVaultGetVaultAssetBalancesInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(MS_VAULT_GET_VAULT_ASSET_BALANCES_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface MsVaultGetVaultAssetBalancesOutput {
  status: bigint
  numberOfAssetTypes: bigint
  assetBalances: number[]
}

const MS_VAULT_GET_VAULT_ASSET_BALANCES_OUTPUT_FIELDS: BinaryField[] = [
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
    byteLength: 384,
    arrayLength: 8,
    arrayItemByteLength: 48,
    arrayItemStructRef: 'AssetBalance',
  },
]

export function decodeMsVaultGetVaultAssetBalancesOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): MsVaultGetVaultAssetBalancesOutput {
  return decodePayload(data, MS_VAULT_GET_VAULT_ASSET_BALANCES_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as MsVaultGetVaultAssetBalancesOutput
}

export async function msVaultGetVaultAssetBalances(
  live: SmartContractCaller,
  input: MsVaultGetVaultAssetBalancesInput,
  options?: ContractCallOptions,
): Promise<Result<MsVaultGetVaultAssetBalancesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: MS_VAULT_CONTRACT_INDEX,
    inputType: MS_VAULT_GET_VAULT_ASSET_BALANCES_INPUT_TYPE,
    inputSize: MS_VAULT_GET_VAULT_ASSET_BALANCES_INPUT_SIZE,
    inputFields: MS_VAULT_GET_VAULT_ASSET_BALANCES_INPUT_FIELDS,
    outputFields: MS_VAULT_GET_VAULT_ASSET_BALANCES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const msVault = {
  contractIndex: MS_VAULT_CONTRACT_INDEX,
  isShareHolder: msVaultIsShareHolder,
  getManagedAssetBalance: msVaultGetManagedAssetBalance,
  getVaults: msVaultGetVaults,
  getReleaseStatus: msVaultGetReleaseStatus,
  getBalanceOf: msVaultGetBalanceOf,
  getVaultName: msVaultGetVaultName,
  getRevenueInfo: msVaultGetRevenueInfo,
  getFees: msVaultGetFees,
  getVaultOwners: msVaultGetVaultOwners,
  getFeeVotes: msVaultGetFeeVotes,
  getFeeVotesOwner: msVaultGetFeeVotesOwner,
  getFeeVotesScore: msVaultGetFeeVotesScore,
  getUniqueFeeVotes: msVaultGetUniqueFeeVotes,
  getUniqueFeeVotesRanking: msVaultGetUniqueFeeVotesRanking,
  getAssetReleaseStatus: msVaultGetAssetReleaseStatus,
  getVaultAssetBalances: msVaultGetVaultAssetBalances,
  buildRegisterVaultInput: buildMsVaultRegisterVaultInput,
  decodeRegisterVaultOutput: decodeMsVaultRegisterVaultOutput,
  buildDepositInput: buildMsVaultDepositInput,
  decodeDepositOutput: decodeMsVaultDepositOutput,
  buildReleaseToInput: buildMsVaultReleaseToInput,
  decodeReleaseToOutput: decodeMsVaultReleaseToOutput,
  buildResetReleaseInput: buildMsVaultResetReleaseInput,
  decodeResetReleaseOutput: decodeMsVaultResetReleaseOutput,
  buildVoteFeeChangeInput: buildMsVaultVoteFeeChangeInput,
  decodeVoteFeeChangeOutput: decodeMsVaultVoteFeeChangeOutput,
  buildDepositAssetInput: buildMsVaultDepositAssetInput,
  decodeDepositAssetOutput: decodeMsVaultDepositAssetOutput,
  buildRevokeAssetManagementRightsInput: buildMsVaultRevokeAssetManagementRightsInput,
  decodeRevokeAssetManagementRightsOutput: decodeMsVaultRevokeAssetManagementRightsOutput,
  buildReleaseAssetToInput: buildMsVaultReleaseAssetToInput,
  decodeReleaseAssetToOutput: decodeMsVaultReleaseAssetToOutput,
  buildResetAssetReleaseInput: buildMsVaultResetAssetReleaseInput,
  decodeResetAssetReleaseOutput: decodeMsVaultResetAssetReleaseOutput,
}

