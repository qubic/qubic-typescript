// @generated — do not edit by hand. Run `bun run generate` to regenerate.
import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'

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
}

export interface VottunBridgeBridgeOrderStruct {
  qubicSender: string
  qubicDestination: string
  ethAddress: number[]
  orderId: bigint
  amount: bigint
  orderType: number
  status: number
}

const STRUCTS: Record<string, NamedStruct> = {
  OrderResponse: {
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
  AdminProposal: {
  name: 'AdminProposal',
  byteLength: 594,
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
],
},
  BridgeOrder: {
  name: 'BridgeOrder',
  byteLength: 146,
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
],
},
}

export const VOTTUN_BRIDGE_CREATE_ORDER_INPUT_TYPE = 1
export const VOTTUN_BRIDGE_CREATE_ORDER_INPUT_SIZE = 104
export const VOTTUN_BRIDGE_CREATE_ORDER_OUTPUT_SIZE = 9

export interface VottunBridgeCreateOrderInput {
  qubicDestination: string
  amount: bigint
  ethAddress: number[]
}

export const VOTTUN_BRIDGE_CREATE_ORDER_INPUT_FIELDS: BinaryField[] = [
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
]

export function buildVottunBridgeCreateOrderInput(
  input: VottunBridgeCreateOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_CREATE_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface VottunBridgeCreateOrderOutput {
  status: number
  orderId: bigint
}

export const VOTTUN_BRIDGE_CREATE_ORDER_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeCreateOrderOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_CREATE_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeCreateOrderOutput
}

export const VOTTUN_BRIDGE_COMPLETE_ORDER_INPUT_TYPE = 3
export const VOTTUN_BRIDGE_COMPLETE_ORDER_INPUT_SIZE = 8
export const VOTTUN_BRIDGE_COMPLETE_ORDER_OUTPUT_SIZE = 1

export interface VottunBridgeCompleteOrderInput {
  orderId: bigint
}

export const VOTTUN_BRIDGE_COMPLETE_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'orderId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeCompleteOrderInput(
  input: VottunBridgeCompleteOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_COMPLETE_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface VottunBridgeCompleteOrderOutput {
  status: number
}

export const VOTTUN_BRIDGE_COMPLETE_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeVottunBridgeCompleteOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeCompleteOrderOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_COMPLETE_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeCompleteOrderOutput
}

export const VOTTUN_BRIDGE_REFUND_ORDER_INPUT_TYPE = 4
export const VOTTUN_BRIDGE_REFUND_ORDER_INPUT_SIZE = 8
export const VOTTUN_BRIDGE_REFUND_ORDER_OUTPUT_SIZE = 1

export interface VottunBridgeRefundOrderInput {
  orderId: bigint
}

export const VOTTUN_BRIDGE_REFUND_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'orderId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeRefundOrderInput(
  input: VottunBridgeRefundOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_REFUND_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface VottunBridgeRefundOrderOutput {
  status: number
}

export const VOTTUN_BRIDGE_REFUND_ORDER_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeVottunBridgeRefundOrderOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeRefundOrderOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_REFUND_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeRefundOrderOutput
}

export const VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_INPUT_TYPE = 5
export const VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_INPUT_SIZE = 16
export const VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_OUTPUT_SIZE = 1

export interface VottunBridgeTransferToContractInput {
  amount: bigint
  orderId: bigint
}

export const VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface VottunBridgeTransferToContractOutput {
  status: number
}

export const VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeVottunBridgeTransferToContractOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeTransferToContractOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_TRANSFER_TO_CONTRACT_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeTransferToContractOutput
}

export const VOTTUN_BRIDGE_CREATE_PROPOSAL_INPUT_TYPE = 10
export const VOTTUN_BRIDGE_CREATE_PROPOSAL_INPUT_SIZE = 73
export const VOTTUN_BRIDGE_CREATE_PROPOSAL_OUTPUT_SIZE = 9

export interface VottunBridgeCreateProposalInput {
  proposalType: number
  targetAddress: string
  oldAddress: string
  amount: bigint
}

export const VOTTUN_BRIDGE_CREATE_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_CREATE_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface VottunBridgeCreateProposalOutput {
  status: number
  proposalId: bigint
}

export const VOTTUN_BRIDGE_CREATE_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeCreateProposalOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_CREATE_PROPOSAL_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeCreateProposalOutput
}

export const VOTTUN_BRIDGE_APPROVE_PROPOSAL_INPUT_TYPE = 11
export const VOTTUN_BRIDGE_APPROVE_PROPOSAL_INPUT_SIZE = 8
export const VOTTUN_BRIDGE_APPROVE_PROPOSAL_OUTPUT_SIZE = 1

export interface VottunBridgeApproveProposalInput {
  proposalId: bigint
}

export const VOTTUN_BRIDGE_APPROVE_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeApproveProposalInput(
  input: VottunBridgeApproveProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_APPROVE_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface VottunBridgeApproveProposalOutput {
  status: number
}

export const VOTTUN_BRIDGE_APPROVE_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeVottunBridgeApproveProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeApproveProposalOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_APPROVE_PROPOSAL_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeApproveProposalOutput
}

export const VOTTUN_BRIDGE_CANCEL_PROPOSAL_INPUT_TYPE = 13
export const VOTTUN_BRIDGE_CANCEL_PROPOSAL_INPUT_SIZE = 8
export const VOTTUN_BRIDGE_CANCEL_PROPOSAL_OUTPUT_SIZE = 1

export interface VottunBridgeCancelProposalInput {
  proposalId: bigint
}

export const VOTTUN_BRIDGE_CANCEL_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeCancelProposalInput(
  input: VottunBridgeCancelProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_CANCEL_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface VottunBridgeCancelProposalOutput {
  status: number
}

export const VOTTUN_BRIDGE_CANCEL_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'status',
    type: 'uint8',
    offset: 0,
    byteLength: 1,
  },
]

export function decodeVottunBridgeCancelProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeCancelProposalOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_CANCEL_PROPOSAL_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeCancelProposalOutput
}

export const VOTTUN_BRIDGE_ADD_LIQUIDITY_INPUT_TYPE = 15
export const VOTTUN_BRIDGE_ADD_LIQUIDITY_INPUT_SIZE = 0
export const VOTTUN_BRIDGE_ADD_LIQUIDITY_OUTPUT_SIZE = 17

export interface VottunBridgeAddLiquidityOutput {
  status: number
  addedAmount: bigint
  totalLocked: bigint
}

export const VOTTUN_BRIDGE_ADD_LIQUIDITY_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeAddLiquidityOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_ADD_LIQUIDITY_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeAddLiquidityOutput
}

export const VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_INPUT_TYPE = 2
export const VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_INPUT_SIZE = 0
export const VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_OUTPUT_SIZE = 8

export interface VottunBridgeGetTotalReceivedTokensOutput {
  totalTokens: bigint
}

export const VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'totalTokens',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeVottunBridgeGetTotalReceivedTokensOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeGetTotalReceivedTokensOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_GET_TOTAL_RECEIVED_TOKENS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeGetTotalReceivedTokensOutput
}

export const VOTTUN_BRIDGE_GET_AVAILABLE_FEES_INPUT_TYPE = 6
export const VOTTUN_BRIDGE_GET_AVAILABLE_FEES_INPUT_SIZE = 0
export const VOTTUN_BRIDGE_GET_AVAILABLE_FEES_OUTPUT_SIZE = 24

export interface VottunBridgeGetAvailableFeesOutput {
  availableFees: bigint
  totalEarnedFees: bigint
  totalDistributedFees: bigint
}

export const VOTTUN_BRIDGE_GET_AVAILABLE_FEES_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeGetAvailableFeesOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_GET_AVAILABLE_FEES_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeGetAvailableFeesOutput
}

export const VOTTUN_BRIDGE_GET_ORDER_INPUT_TYPE = 7
export const VOTTUN_BRIDGE_GET_ORDER_INPUT_SIZE = 8
export const VOTTUN_BRIDGE_GET_ORDER_OUTPUT_SIZE = 246

export interface VottunBridgeGetOrderInput {
  orderId: bigint
}

export const VOTTUN_BRIDGE_GET_ORDER_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'orderId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeGetOrderInput(
  input: VottunBridgeGetOrderInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_GET_ORDER_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface VottunBridgeGetOrderOutput {
  status: number
  order: VottunBridgeOrderResponseStruct
  message: number[]
}

export const VOTTUN_BRIDGE_GET_ORDER_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeGetOrderOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_GET_ORDER_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeGetOrderOutput
}

export const VOTTUN_BRIDGE_GET_CONTRACT_INFO_INPUT_TYPE = 8
export const VOTTUN_BRIDGE_GET_CONTRACT_INFO_INPUT_SIZE = 0
export const VOTTUN_BRIDGE_GET_CONTRACT_INFO_OUTPUT_SIZE = 3426

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

export const VOTTUN_BRIDGE_GET_CONTRACT_INFO_OUTPUT_FIELDS: BinaryField[] = [
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
    byteLength: 2336,
    arrayLength: 16,
    arrayItemByteLength: 146,
    arrayItemStructRef: 'BridgeOrder',
  },
  {
    name: 'totalOrdersFound',
    type: 'uint64',
    offset: 2888,
    byteLength: 8,
  },
  {
    name: 'emptySlots',
    type: 'uint64',
    offset: 2896,
    byteLength: 8,
  },
  {
    name: 'multisigAdmins',
    type: 'array',
    offset: 2904,
    byteLength: 512,
    arrayLength: 16,
    arrayItemType: 'id',
    arrayItemByteLength: 32,
  },
  {
    name: 'numberOfAdmins',
    type: 'uint8',
    offset: 3416,
    byteLength: 1,
  },
  {
    name: 'requiredApprovals',
    type: 'uint8',
    offset: 3417,
    byteLength: 1,
  },
  {
    name: 'totalProposals',
    type: 'uint64',
    offset: 3418,
    byteLength: 8,
  },
]

export function decodeVottunBridgeGetContractInfoOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeGetContractInfoOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_GET_CONTRACT_INFO_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeGetContractInfoOutput
}

export const VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_INPUT_TYPE = 9
export const VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_INPUT_SIZE = 0
export const VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_OUTPUT_SIZE = 8

export interface VottunBridgeGetTotalLockedTokensOutput {
  totalLockedTokens: bigint
}

export const VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_OUTPUT_FIELDS: BinaryField[] = [
  {
    name: 'totalLockedTokens',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function decodeVottunBridgeGetTotalLockedTokensOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeGetTotalLockedTokensOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_GET_TOTAL_LOCKED_TOKENS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeGetTotalLockedTokensOutput
}

export const VOTTUN_BRIDGE_GET_PROPOSAL_INPUT_TYPE = 12
export const VOTTUN_BRIDGE_GET_PROPOSAL_INPUT_SIZE = 8
export const VOTTUN_BRIDGE_GET_PROPOSAL_OUTPUT_SIZE = 595

export interface VottunBridgeGetProposalInput {
  proposalId: bigint
}

export const VOTTUN_BRIDGE_GET_PROPOSAL_INPUT_FIELDS: BinaryField[] = [
  {
    name: 'proposalId',
    type: 'uint64',
    offset: 0,
    byteLength: 8,
  },
]

export function buildVottunBridgeGetProposalInput(
  input: VottunBridgeGetProposalInput,
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_GET_PROPOSAL_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface VottunBridgeGetProposalOutput {
  status: number
  proposal: VottunBridgeAdminProposalStruct
}

export const VOTTUN_BRIDGE_GET_PROPOSAL_OUTPUT_FIELDS: BinaryField[] = [
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
    byteLength: 594,
    structRef: 'AdminProposal',
  },
]

export function decodeVottunBridgeGetProposalOutput(
  data: Uint8Array,
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeGetProposalOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_GET_PROPOSAL_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeGetProposalOutput
}

export const VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_INPUT_TYPE = 14
export const VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_INPUT_SIZE = 73
export const VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_OUTPUT_SIZE = 41

export interface VottunBridgeGetOrderByDetailsInput {
  ethAddress: number[]
  amount: bigint
  status: number
}

export const VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_INPUT_FIELDS: BinaryField[] = [
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
  identityToPublicKey: (identity: string) => Uint8Array = () => new Uint8Array(32),
): Uint8Array {
  return buildPayload(VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_INPUT_FIELDS, STRUCTS, input as unknown as Record<string, FieldValue | Uint8Array>, identityToPublicKey)
}

export interface VottunBridgeGetOrderByDetailsOutput {
  status: number
  orderId: bigint
  qubicDestination: string
}

export const VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_OUTPUT_FIELDS: BinaryField[] = [
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
  publicKeyToIdentity: (pk: Uint8Array) => string = () => 'A'.repeat(60),
): VottunBridgeGetOrderByDetailsOutput {
  return decodePayload(
    data,
    VOTTUN_BRIDGE_GET_ORDER_BY_DETAILS_OUTPUT_FIELDS,
    STRUCTS,
    publicKeyToIdentity,
  ) as unknown as VottunBridgeGetOrderByDetailsOutput
}

