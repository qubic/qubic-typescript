import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import { QubicRpcError } from '@qubic.org/rpc'
import type { QuerySmartContractRequest, QuerySmartContractResponse } from '@qubic.org/rpc'
import { err, ok } from './result.js'
import type { Result } from './result.js'

export interface SmartContractCaller {
  querySmartContract(req: QuerySmartContractRequest): Promise<QuerySmartContractResponse>
}

export interface ContractCallOptions {
  identityToPublicKey?: (identity: string) => Uint8Array
  publicKeyToIdentity?: (pk: Uint8Array) => string
}

const _defaultIdToPk = (_identity: string): Uint8Array => {
  throw new Error('identityToPublicKey is required for contracts with id-type fields')
}
const _defaultPkToId = (_pk: Uint8Array): string => {
  throw new Error('publicKeyToIdentity is required for contracts with id-type fields')
}

function toBase64(bytes: Uint8Array): string {
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i] ?? 0)
  return btoa(s)
}

function fromBase64(b64: string): Uint8Array {
  const s = atob(b64)
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i)
  return out
}

export interface CallContractFunctionOptions<TInput extends Record<string, unknown>> {
  live: SmartContractCaller
  contractIndex: number
  inputType: number
  inputSize: number
  inputFields: BinaryField[]
  outputFields: BinaryField[]
  structs: Record<string, NamedStruct>
  input: TInput
  identityToPublicKey?: (identity: string) => Uint8Array
  publicKeyToIdentity?: (pk: Uint8Array) => string
}

export async function callContractFunction<TInput extends Record<string, unknown>, TOutput>(
  options: CallContractFunctionOptions<TInput>,
): Promise<Result<TOutput, QubicRpcError>> {
  const idToPk = options.identityToPublicKey ?? _defaultIdToPk
  const pkToId = options.publicKeyToIdentity ?? _defaultPkToId
  // buildPayload / decodePayload throw PayloadBuildError on bad input — those are
  // programmer errors and must not be swallowed as QubicRpcError.
  const payload = buildPayload(
    options.inputFields,
    options.structs,
    options.input as Record<string, FieldValue | Uint8Array>,
    idToPk,
  )
  try {
    const response = await options.live.querySmartContract({
      contractIndex: options.contractIndex,
      inputType: options.inputType,
      inputSize: options.inputSize,
      requestData: toBase64(payload),
    })
    const responseBytes = fromBase64(response.responseData ?? '')
    const decoded = decodePayload(responseBytes, options.outputFields, options.structs, pkToId)
    return ok(decoded as unknown as TOutput)
  } catch (cause) {
    if (cause instanceof QubicRpcError) return err(cause)
    throw cause
  }
}
