import { argon2id } from 'hash-wasm'
import type { AlgorithmParams } from '../models/types.js'

export async function deriveKeyArgon2id(
  password: string,
  salt: Uint8Array,
  params: AlgorithmParams,
): Promise<Uint8Array> {
  const result = await argon2id({
    password,
    salt,
    parallelism: params.parallelism,
    iterations: params.iterations,
    memorySize: params.memory,
    hashLength: 32,
    outputType: 'binary',
  })
  return new Uint8Array(result)
}
