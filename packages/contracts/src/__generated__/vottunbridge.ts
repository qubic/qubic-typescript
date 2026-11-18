// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import { type ContractCall, type ContractCallOptions, type SmartContractCaller, callContractFunction } from '../call-contract.js'
import type { Result } from '@qubic.org/types'

export const VOTTUN_BRIDGE_CONTRACT_INDEX = 25

export interface VottunBridgeOrderResponseStruct {
  originAccount: string
  destinationAccount: number[]
  orderId: bigint
  amount: bigint
  memo: number[]
  sourceChain: number
  qubicDestination: string
  status: number
}

export interface VottunBridgeAdminProposalStruct {
  proposalId: bigint
  proposalType: number
  targetAddress: string
  oldAddress: string
  amount: bigint
  approvals: string[]
  approvalsCount: number
  executed: number
  active: number
}

export interface VottunBridgeBridgeOrderStruct {
  qubicSender: string
  qubicDestination: string
  ethAddress: number[]
  orderId: bigint
  amount: bigint
  orderType: number
  status: number
  fromQubicToEthereum: number
  tokensReceived: number
  tokensLocked: number
}

const STRUCTS: Record<string, NamedStruct> = {
  'OrderResponse': {
  name: 'OrderResponse',
  byteLength: 213,
  fields: [
    {
      name: 'originAccount',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'destinationAccount',
      type: 'array',
      offset: 32,
      byteLength: 64,
      arrayLength: 64,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'orderId',
      type: 'uint64',
      offset: 96,
      byteLength: 8,
    },
    {
      name: 'amount',
      type: 'uint64',
      offset: 104,
      byteLength: 8,
    },
    {
      name: 'memo',
      type: 'array',
      offset: 112,
      byteLength: 64,
      arrayLength: 64,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'sourceChain',
      type: 'uint32',
      offset: 176,
      byteLength: 4,
    },
    {
      name: 'qubicDestination',
      type: 'id',
      offset: 180,
      byteLength: 32,
    },
    {
      name: 'status',
      type: 'uint8',
      offset: 212,
      byteLength: 1,
    },
],
},
  'AdminProposal': {
  name: 'AdminProposal',
  byteLength: 596,
  fields: [
    {
      name: 'proposalId',
      type: 'uint64',
      offset: 0,
      byteLength: 8,
    },
    {
      name: 'proposalType',
      type: 'uint8',
      offset: 8,
      byteLength: 1,
    },
    {
      name: 'targetAddress',
      type: 'id',
      offset: 9,
      byteLength: 32,
    },
    {
      name: 'oldAddress',
      type: 'id',
      offset: 41,
      byteLength: 32,
    },
    {
      name: 'amount',
      type: 'uint64',
      offset: 73,
      byteLength: 8,
    },
    {
      name: 'approvals',
      type: 'array',
      offset: 81,
      byteLength: 512,
      arrayLength: 16,
      arrayItemType: 'id',
      arrayItemByteLength: 32,
    },
    {
      name: 'approvalsCount',
      type: 'uint8',
      offset: 593,
      byteLength: 1,
    },
    {
      name: 'executed',
      type: 'uint8',
      offset: 594,
      byteLength: 1,
    },
    {
      name: 'active',
      type: 'uint8',
      offset: 595,
      byteLength: 1,
    },
],
},
  'BridgeOrder': {
  name: 'BridgeOrder',
  byteLength: 149,
  fields: [
    {
      name: 'qubicSender',
      type: 'id',
      offset: 0,
      byteLength: 32,
    },
    {
      name: 'qubicDestination',
      type: 'id',
      offset: 32,
      byteLength: 32,
    },
    {
      name: 'ethAddress',
      type: 'array',
      offset: 64,
      byteLength: 64,
      arrayLength: 64,
      arrayItemType: 'uint8',
      arrayItemByteLength: 1,
    },
    {
      name: 'orderId',
      type: 'uint64',
      offset: 128,
      byteLength: 8,
    },
    {
      name: 'amount',
      type: 'uint64',
      offset: 136,
      byteLength: 8,
    },
    {
      name: 'orderType',
      type: 'uint8',
      offset: 144,
      byteLength: 1,
    },
    {
      name: 'status',
      type: 'uint8',
      offset: 145,
      byteLength: 1,
    },
    {
      name: 'fromQubicToEthereum',
      type: 'uint8',
      offset: 146,
      byteLength: 1,
    },
    {
      name: 'tokensReceived',
      type: 'uint8',
      offset: 147,
      byteLength: 1,
    },
    {
      name: 'tokensLocked',
      type: 'uint8',
      offset: 148,
      byteLength: 1,
    },
],
},
}

export const VOTTUN_BRIDGE_CREATE_ORDER_INPUT_TYPE = 1

export interface VottunBridgeCreateOrderInput {
  qubicDestination: string
  amount: bigint
  ethAddress: number[]
  fromQubicToEthereum: number
}

const VOTTUN_BRIDGE_CREATE_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'qubicDestination',
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
    name: 'ethAddress',
    type: 'array',
    offset: 40,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'fromQubicToEthereum',
    type: 'uint8',
    offset: 104,
    byteLength: 1,
  },
]

export function buildVottunBridgeCreateOrderInput(
  input: VottunBridgeCreateOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX, inputType: VOTTUN_BRIDGE_CREATE_ORDER_INPUT_TYPE, payload: buildPayload(VOTTUN_BRIDGE_CREATE_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface VottunBridgeCreateOrderOutput {
  status: number
  orderId: bigint
}

const VOTTUN_BRIDGE_CREATE_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'orderId',
    type: 'uint64',
    offset: 1,
    byteLength: 8,
  },
]

export function decodeVottunBridgeCreateOrderOutput(
  data: Uint8Array,
): VottunBridgeCreateOrderOutput {
  return decodePayload(data, VOTTUN_BRIDGE_CREATE_ORDER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeCreateOrderOutput
}

export const VOTTUN_BRIDGE_COMPLETE_ORDER_INPUT_TYPE = 2

export interface VottunBridgeCompleteOrderInput {
  orderId: bigint
}

const VOTTUN_BRIDGE_COMPLETE_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'orderId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeCompleteOrderInput(
  input: VottunBridgeCompleteOrderInput,
): ContractCall {
  return { contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX, inputType: VOTTUN_BRIDGE_COMPLETE_ORDER_INPUT_TYPE, payload: buildPayload(VOTTUN_BRIDGE_COMPLETE_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface VottunBridgeCompleteOrderOutput {
  status: number
}

const VOTTUN_BRIDGE_COMPLETE_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeVottunBridgeCompleteOrderOutput(
  data: Uint8Array,
): VottunBridgeCompleteOrderOutput {
  return decodePayload(data, VOTTUN_BRIDGE_COMPLETE_ORDER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeCompleteOrderOutput
}

export const VOTTUN_BRIDGE_REFUND_ORDER_INPUT_TYPE = 3

export interface VottunBridgeRefundOrderInput {
  orderId: bigint
}

const VOTTUN_BRIDGE_REFUND_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'orderId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeRefundOrderInput(
  input: VottunBridgeRefundOrderInput,
): ContractCall {
  return { contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX, inputType: VOTTUN_BRIDGE_REFUND_ORDER_INPUT_TYPE, payload: buildPayload(VOTTUN_BRIDGE_REFUND_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface VottunBridgeRefundOrderOutput {
  status: number
}

const VOTTUN_BRIDGE_REFUND_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeVottunBridgeRefundOrderOutput(
  data: Uint8Array,
): VottunBridgeRefundOrderOutput {
  return decodePayload(data, VOTTUN_BRIDGE_REFUND_ORDER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeRefundOrderOutput
}

export const VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_INPUT_TYPE = 4

export interface VottunBridgeTransferToContractInput {
  amount: bigint
  orderId: bigint
}

const VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'amount',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'orderId',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
]

export function buildVottunBridgeTransferToContractInput(
  input: VottunBridgeTransferToContractInput,
): ContractCall {
  return { contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX, inputType: VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_INPUT_TYPE, payload: buildPayload(VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface VottunBridgeTransferToContractOutput {
  status: number
}

const VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeVottunBridgeTransferToContractOutput(
  data: Uint8Array,
): VottunBridgeTransferToContractOutput {
  return decodePayload(data, VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeTransferToContractOutput
}

export const VOTTUN_BRIDGE_ADD_LIQUIDITY_INPUT_TYPE = 5

export interface VottunBridgeAddLiquidityOutput {
  status: number
  addedAmount: bigint
  totalLocked: bigint
}

const VOTTUN_BRIDGE_ADD_LIQUIDITY_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'addedAmount',
    type: 'uint64',
    offset: 1,
    byteLength: 8,
  },
  {
    name: 'totalLocked',
    type: 'uint64',
    offset: 9,
    byteLength: 8,
  },
]

export function decodeVottunBridgeAddLiquidityOutput(
  data: Uint8Array,
): VottunBridgeAddLiquidityOutput {
  return decodePayload(data, VOTTUN_BRIDGE_ADD_LIQUIDITY_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeAddLiquidityOutput
}

export const VOTTUN_BRIDGE_CREATE_PROPOSAL_INPUT_TYPE = 6

export interface VottunBridgeCreateProposalInput {
  proposalType: number
  targetAddress: string
  oldAddress: string
  amount: bigint
}

const VOTTUN_BRIDGE_CREATE_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalType',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'targetAddress',
    type: 'id',
    offset: 1,
    byteLength: 32,
  },
  {
    name: 'oldAddress',
    type: 'id',
    offset: 33,
    byteLength: 32,
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 65,
    byteLength: 8,
  },
]

export function buildVottunBridgeCreateProposalInput(
  input: VottunBridgeCreateProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array,
): ContractCall {
  return { contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX, inputType: VOTTUN_BRIDGE_CREATE_PROPOSAL_INPUT_TYPE, payload: buildPayload(VOTTUN_BRIDGE_CREATE_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey) }
}

export interface VottunBridgeCreateProposalOutput {
  status: number
  proposalId: bigint
}

const VOTTUN_BRIDGE_CREATE_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'proposalId',
    type: 'uint64',
    offset: 1,
    byteLength: 8,
  },
]

export function decodeVottunBridgeCreateProposalOutput(
  data: Uint8Array,
): VottunBridgeCreateProposalOutput {
  return decodePayload(data, VOTTUN_BRIDGE_CREATE_PROPOSAL_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeCreateProposalOutput
}

export const VOTTUN_BRIDGE_APPROVE_PROPOSAL_INPUT_TYPE = 7

export interface VottunBridgeApproveProposalInput {
  proposalId: bigint
}

const VOTTUN_BRIDGE_APPROVE_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeApproveProposalInput(
  input: VottunBridgeApproveProposalInput,
): ContractCall {
  return { contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX, inputType: VOTTUN_BRIDGE_APPROVE_PROPOSAL_INPUT_TYPE, payload: buildPayload(VOTTUN_BRIDGE_APPROVE_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface VottunBridgeApproveProposalOutput {
  status: number
  executed: number
}

const VOTTUN_BRIDGE_APPROVE_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'executed',
    type: 'uint8',
    offset: 1,
    byteLength: 1,
  },
]

export function decodeVottunBridgeApproveProposalOutput(
  data: Uint8Array,
): VottunBridgeApproveProposalOutput {
  return decodePayload(data, VOTTUN_BRIDGE_APPROVE_PROPOSAL_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeApproveProposalOutput
}

export const VOTTUN_BRIDGE_CANCEL_PROPOSAL_INPUT_TYPE = 8

export interface VottunBridgeCancelProposalInput {
  proposalId: bigint
}

const VOTTUN_BRIDGE_CANCEL_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeCancelProposalInput(
  input: VottunBridgeCancelProposalInput,
): ContractCall {
  return { contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX, inputType: VOTTUN_BRIDGE_CANCEL_PROPOSAL_INPUT_TYPE, payload: buildPayload(VOTTUN_BRIDGE_CANCEL_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32)) }
}

export interface VottunBridgeCancelProposalOutput {
  status: number
}

const VOTTUN_BRIDGE_CANCEL_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeVottunBridgeCancelProposalOutput(
  data: Uint8Array,
): VottunBridgeCancelProposalOutput {
  return decodePayload(data, VOTTUN_BRIDGE_CANCEL_PROPOSAL_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeCancelProposalOutput
}

export const VOTTUN_BRIDGE_GET_ORDER_INPUT_TYPE = 1
export const VOTTUN_BRIDGE_GET_ORDER_INPUT_SIZE = 8

export interface VottunBridgeGetOrderInput {
  orderId: bigint
}

const VOTTUN_BRIDGE_GET_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'orderId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeGetOrderInput(
  input: VottunBridgeGetOrderInput,
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_GET_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface VottunBridgeGetOrderOutput {
  status: number
  order: VottunBridgeOrderResponseStruct
  message: number[]
}

const VOTTUN_BRIDGE_GET_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'order',
    type: 'struct',
    offset: 1,
    byteLength: 213,
    structRef: 'OrderResponse',
  },
  {
    name: 'message',
    type: 'array',
    offset: 214,
    byteLength: 32,
    arrayLength: 32,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
]

export function decodeVottunBridgeGetOrderOutput(
  data: Uint8Array,
): VottunBridgeGetOrderOutput {
  return decodePayload(data, VOTTUN_BRIDGE_GET_ORDER_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeGetOrderOutput
}

export async function vottunBridgeGetOrder(
  live: SmartContractCaller,
  input: VottunBridgeGetOrderInput,
  options?: ContractCallOptions,
): Promise<Result<VottunBridgeGetOrderOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX,
    inputType: VOTTUN_BRIDGE_GET_ORDER_INPUT_TYPE,
    inputSize: VOTTUN_BRIDGE_GET_ORDER_INPUT_SIZE,
    inputFields: VOTTUN_BRIDGE_GET_ORDER_INPUT_FIELDS,
    outputFields: VOTTUN_BRIDGE_GET_ORDER_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_INPUT_TYPE = 3
export const VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_INPUT_SIZE = 0

export interface VottunBridgeGetTotalReceivedTokensOutput {
  totalTokens: bigint
}

const VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'totalTokens',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeVottunBridgeGetTotalReceivedTokensOutput(
  data: Uint8Array,
): VottunBridgeGetTotalReceivedTokensOutput {
  return decodePayload(data, VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeGetTotalReceivedTokensOutput
}

export async function vottunBridgeGetTotalReceivedTokens(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<VottunBridgeGetTotalReceivedTokensOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX,
    inputType: VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_INPUT_TYPE,
    inputSize: VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_INPUT_SIZE,
    inputFields: [],
    outputFields: VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_INPUT_TYPE = 4
export const VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_INPUT_SIZE = 0

export interface VottunBridgeGetTotalLockedTokensOutput {
  totalLockedTokens: bigint
}

const VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'totalLockedTokens',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeVottunBridgeGetTotalLockedTokensOutput(
  data: Uint8Array,
): VottunBridgeGetTotalLockedTokensOutput {
  return decodePayload(data, VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeGetTotalLockedTokensOutput
}

export async function vottunBridgeGetTotalLockedTokens(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<VottunBridgeGetTotalLockedTokensOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX,
    inputType: VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_INPUT_TYPE,
    inputSize: VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_INPUT_SIZE,
    inputFields: [],
    outputFields: VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_INPUT_TYPE = 5
export const VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_INPUT_SIZE = 73

export interface VottunBridgeGetOrderByDetailsInput {
  ethAddress: number[]
  amount: bigint
  status: number
}

const VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'ethAddress',
    type: 'array',
    offset: 0,
    byteLength: 64,
    arrayLength: 64,
    arrayItemType: 'uint8',
    arrayItemByteLength: 1,
  },
  {
    name: 'amount',
    type: 'uint64',
    offset: 64,
    byteLength: 8,
  },
  {
    name: 'status',
    type: 'uint8',
    offset: 72,
    byteLength: 1,
  },
]

export function buildVottunBridgeGetOrderByDetailsInput(
  input: VottunBridgeGetOrderByDetailsInput,
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface VottunBridgeGetOrderByDetailsOutput {
  status: number
  orderId: bigint
  qubicDestination: string
}

const VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'orderId',
    type: 'uint64',
    offset: 1,
    byteLength: 8,
  },
  {
    name: 'qubicDestination',
    type: 'id',
    offset: 9,
    byteLength: 32,
  },
]

export function decodeVottunBridgeGetOrderByDetailsOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): VottunBridgeGetOrderByDetailsOutput {
  return decodePayload(data, VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as VottunBridgeGetOrderByDetailsOutput
}

export async function vottunBridgeGetOrderByDetails(
  live: SmartContractCaller,
  input: VottunBridgeGetOrderByDetailsInput,
  options?: ContractCallOptions,
): Promise<Result<VottunBridgeGetOrderByDetailsOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX,
    inputType: VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_INPUT_TYPE,
    inputSize: VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_INPUT_SIZE,
    inputFields: VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_INPUT_FIELDS,
    outputFields: VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const VOTTUN_BRIDGE_GET_CONTRACT_INFO_INPUT_TYPE = 6
export const VOTTUN_BRIDGE_GET_CONTRACT_INFO_INPUT_SIZE = 0

export interface VottunBridgeGetContractInfoOutput {
  managers: string[]
  nextOrderId: bigint
  lockedTokens: bigint
  totalReceivedTokens: bigint
  earnedFees: bigint
  tradeFeeBillionths: number
  sourceChain: number
  firstOrders: number[]
  totalOrdersFound: bigint
  emptySlots: bigint
  multisigAdmins: string[]
  numberOfAdmins: number
  requiredApprovals: number
  totalProposals: bigint
}

const VOTTUN_BRIDGE_GET_CONTRACT_INFO_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'managers',
    type: 'array',
    offset: 0,
    byteLength: 512,
    arrayLength: 16,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
  {
    name: 'nextOrderId',
    type: 'uint64',
    offset: 512,
    byteLength: 8,
  },
  {
    name: 'lockedTokens',
    type: 'uint64',
    offset: 520,
    byteLength: 8,
  },
  {
    name: 'totalReceivedTokens',
    type: 'uint64',
    offset: 528,
    byteLength: 8,
  },
  {
    name: 'earnedFees',
    type: 'uint64',
    offset: 536,
    byteLength: 8,
  },
  {
    name: 'tradeFeeBillionths',
    type: 'uint32',
    offset: 544,
    byteLength: 4,
  },
  {
    name: 'sourceChain',
    type: 'uint32',
    offset: 548,
    byteLength: 4,
  },
  {
    name: 'firstOrders',
    type: 'array',
    offset: 552,
    byteLength: 2384,
    arrayLength: 16,
    arrayItemByteLength: 149,
    arrayItemStructRef: 'BridgeOrder',
  },
  {
    name: 'totalOrdersFound',
    type: 'uint64',
    offset: 2936,
    byteLength: 8,
  },
  {
    name: 'emptySlots',
    type: 'uint64',
    offset: 2944,
    byteLength: 8,
  },
  {
    name: 'multisigAdmins',
    type: 'array',
    offset: 2952,
    byteLength: 512,
    arrayLength: 16,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
  {
    name: 'numberOfAdmins',
    type: 'uint8',
    offset: 3464,
    byteLength: 1,
  },
  {
    name: 'requiredApprovals',
    type: 'uint8',
    offset: 3465,
    byteLength: 1,
  },
  {
    name: 'totalProposals',
    type: 'uint64',
    offset: 3466,
    byteLength: 8,
  },
]

export function decodeVottunBridgeGetContractInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string,
): VottunBridgeGetContractInfoOutput {
  return decodePayload(data, VOTTUN_BRIDGE_GET_CONTRACT_INFO_OUTPUT_FIELDS, STRUCTS, publicKeyToIdentity) as unknown as VottunBridgeGetContractInfoOutput
}

export async function vottunBridgeGetContractInfo(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<VottunBridgeGetContractInfoOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX,
    inputType: VOTTUN_BRIDGE_GET_CONTRACT_INFO_INPUT_TYPE,
    inputSize: VOTTUN_BRIDGE_GET_CONTRACT_INFO_INPUT_SIZE,
    inputFields: [],
    outputFields: VOTTUN_BRIDGE_GET_CONTRACT_INFO_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const VOTTUN_BRIDGE_GET_AVAILABLE_FEES_INPUT_TYPE = 7
export const VOTTUN_BRIDGE_GET_AVAILABLE_FEES_INPUT_SIZE = 0

export interface VottunBridgeGetAvailableFeesOutput {
  availableFees: bigint
  totalEarnedFees: bigint
  totalDistributedFees: bigint
}

const VOTTUN_BRIDGE_GET_AVAILABLE_FEES_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'availableFees',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
  {
    name: 'totalEarnedFees',
    type: 'uint64',
    offset: 8,
    byteLength: 8,
  },
  {
    name: 'totalDistributedFees',
    type: 'uint64',
    offset: 16,
    byteLength: 8,
  },
]

export function decodeVottunBridgeGetAvailableFeesOutput(
  data: Uint8Array,
): VottunBridgeGetAvailableFeesOutput {
  return decodePayload(data, VOTTUN_BRIDGE_GET_AVAILABLE_FEES_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeGetAvailableFeesOutput
}

export async function vottunBridgeGetAvailableFees(
  live: SmartContractCaller,
  options?: ContractCallOptions,
): Promise<Result<VottunBridgeGetAvailableFeesOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX,
    inputType: VOTTUN_BRIDGE_GET_AVAILABLE_FEES_INPUT_TYPE,
    inputSize: VOTTUN_BRIDGE_GET_AVAILABLE_FEES_INPUT_SIZE,
    inputFields: [],
    outputFields: VOTTUN_BRIDGE_GET_AVAILABLE_FEES_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: {},
    ...options,
  })
}

export const VOTTUN_BRIDGE_GET_PROPOSAL_INPUT_TYPE = 8
export const VOTTUN_BRIDGE_GET_PROPOSAL_INPUT_SIZE = 8

export interface VottunBridgeGetProposalInput {
  proposalId: bigint
}

const VOTTUN_BRIDGE_GET_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeGetProposalInput(
  input: VottunBridgeGetProposalInput,
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_GET_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, (_: string) => new Uint8Array(32))
}

export interface VottunBridgeGetProposalOutput {
  status: number
  proposal: VottunBridgeAdminProposalStruct
}

const VOTTUN_BRIDGE_GET_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
  {
    name: 'proposal',
    type: 'struct',
    offset: 1,
    byteLength: 596,
    structRef: 'AdminProposal',
  },
]

export function decodeVottunBridgeGetProposalOutput(
  data: Uint8Array,
): VottunBridgeGetProposalOutput {
  return decodePayload(data, VOTTUN_BRIDGE_GET_PROPOSAL_OUTPUT_FIELDS, STRUCTS, (_: Uint8Array) => { throw new Error('unreachable') }) as unknown as VottunBridgeGetProposalOutput
}

export async function vottunBridgeGetProposal(
  live: SmartContractCaller,
  input: VottunBridgeGetProposalInput,
  options?: ContractCallOptions,
): Promise<Result<VottunBridgeGetProposalOutput, QubicRpcError>> {
  return callContractFunction({
    live,
    contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX,
    inputType: VOTTUN_BRIDGE_GET_PROPOSAL_INPUT_TYPE,
    inputSize: VOTTUN_BRIDGE_GET_PROPOSAL_INPUT_SIZE,
    inputFields: VOTTUN_BRIDGE_GET_PROPOSAL_INPUT_FIELDS,
    outputFields: VOTTUN_BRIDGE_GET_PROPOSAL_OUTPUT_FIELDS,
    structs: STRUCTS,
    input: (input as unknown as Record<string, unknown>),
    ...options,
  })
}

export const vottunBridge = {
  contractIndex: VOTTUN_BRIDGE_CONTRACT_INDEX,
  getOrder: vottunBridgeGetOrder,
  getTotalReceivedTokens: vottunBridgeGetTotalReceivedTokens,
  getTotalLockedTokens: vottunBridgeGetTotalLockedTokens,
  getOrderByDetails: vottunBridgeGetOrderByDetails,
  getContractInfo: vottunBridgeGetContractInfo,
  getAvailableFees: vottunBridgeGetAvailableFees,
  getProposal: vottunBridgeGetProposal,
  buildCreateOrderInput: buildVottunBridgeCreateOrderInput,
  decodeCreateOrderOutput: decodeVottunBridgeCreateOrderOutput,
  buildCompleteOrderInput: buildVottunBridgeCompleteOrderInput,
  decodeCompleteOrderOutput: decodeVottunBridgeCompleteOrderOutput,
  buildRefundOrderInput: buildVottunBridgeRefundOrderInput,
  decodeRefundOrderOutput: decodeVottunBridgeRefundOrderOutput,
  buildTransferToContractInput: buildVottunBridgeTransferToContractInput,
  decodeTransferToContractOutput: decodeVottunBridgeTransferToContractOutput,
  decodeAddLiquidityOutput: decodeVottunBridgeAddLiquidityOutput,
  buildCreateProposalInput: buildVottunBridgeCreateProposalInput,
  decodeCreateProposalOutput: decodeVottunBridgeCreateProposalOutput,
  buildApproveProposalInput: buildVottunBridgeApproveProposalInput,
  decodeApproveProposalOutput: decodeVottunBridgeApproveProposalOutput,
  buildCancelProposalInput: buildVottunBridgeCancelProposalInput,
  decodeCancelProposalOutput: decodeVottunBridgeCancelProposalOutput,
}

