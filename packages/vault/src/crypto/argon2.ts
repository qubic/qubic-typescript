export async function deriveKeyArgon2id(
  password: string,
  salt: Uint8Array,
  params: { memory: number; iterations: number; parallelism: number },
): Promise<Uint8Array> {
  // TODO: Implement in Batch 4
  throw new Error('Not implemented')
}