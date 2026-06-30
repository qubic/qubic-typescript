import { argon2idAsync } from '@noble/hashes/argon2.js'
import type { AlgorithmParams } from '../models/types.js'

export async function deriveKeyArgon2id(
  password: string,
  salt: Uint8Array,
  params: AlgorithmParams,
): Promise<Uint8Array> {
  return argon2idAsync(password, salt, {
    t: params.iterations,
    m: params.memory,
    p: params.parallelism,
    dkLen: 32,
  })
}