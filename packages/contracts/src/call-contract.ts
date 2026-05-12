import type { BinaryField, FieldValue, NamedStruct } from '@qubic.ts/contract-registry'
import { buildPayload, decodePayload } from '@qubic.ts/contract-registry'
import { QubicRpcError } from '@qubic.ts/rpc'
import type { QuerySmartContractRequest, QuerySmartContractResponse } from '@qubic.ts/rpc'
import { err, ok } from './result.js'
import type { Result } from './result.js'

export interface SmartContractCaller {
  querySmartContract(req: QuerySmartContractRequest): Promise<QuerySmartContractResponse>
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
  identityToPublicKey: (identity: string) => Uint8Array
  publicKeyToIdentity: (pk: Uint8Array) => string
}

export async function callContractFunction<TInput extends Record<string, unknown>, TOutput>(
  options: CallContractFunctionOptions<TInput>,
): Promise<Result<TOutput, QubicRpcError>> {
  try {
    const payload = buildPayload(
      options.inputFields,
      options.structs,
      options.input as Record<string, FieldValue | Uint8Array>,
      options.identityToPublicKey,
    )
    const response = await options.live.querySmartContract({
      contractIndex: options.contractIndex,
      inputType: options.inputType,
      inputSize: options.inputSize,
      requestData: toBase64(payload),
    })
    const responseBytes = fromBase64(response.responseData ?? '')
    const decoded = decodePayload(
      responseBytes,
      options.outputFields,
      options.structs,
      options.publicKeyToIdentity,
    )
    return ok(decoded as unknown as TOutput)
  } catch (cause) {
    if (cause instanceof QubicRpcError) return err(cause)
    return err(new QubicRpcError(0, 'call-contract', String(cause)))
  }
}
