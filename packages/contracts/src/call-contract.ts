import type { BinaryField, FieldValue, NamedStruct } from '@qubic.org/registry'
import { buildPayload, decodePayload } from '@qubic.org/registry'
import type { QubicRpcError } from '@qubic.org/rpc'
import type { QuerySmartContractRequest, QuerySmartContractResponse } from '@qubic.org/rpc'
import type { Result } from '@qubic.org/rpc'
import { ok } from '@qubic.org/types'

export interface SmartContractCaller {
  querySmartContract(
    req: QuerySmartContractRequest,
  ): Promise<Result<QuerySmartContractResponse, QubicRpcError>>
}

export interface ContractCallOptions {
  identityToPublicKey?: (identity: string) => Uint8Array
  publicKeyToIdentity?: (pk: Uint8Array) => string
}

/** Returned by builder functions — contains everything needed to send a contract call. */
export interface ContractCall {
  contractIndex: number
  inputType: number
  payload: Uint8Array
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
  const r = await options.live.querySmartContract({
    contractIndex: options.contractIndex,
    inputType: options.inputType,
    inputSize: options.inputSize,
    requestData: toBase64(payload),
  })
  if (!r.ok) return r
  const responseBytes = fromBase64(r.value.responseData ?? '')
  const decoded = decodePayload(responseBytes, options.outputFields, options.structs, pkToId)
  for (const field of options.outputFields) {
    if (!(field.name in decoded)) {
      throw new Error(`decoded response missing expected field "${field.name}"`)
    }
  }
  return ok(decoded as unknown as TOutput)
}
