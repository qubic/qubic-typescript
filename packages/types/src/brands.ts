import { InvalidBase64Error, InvalidIdentityError, InvalidSeedError, InvalidTxHashError } from './errors.js'

declare const _brand: unique symbol
export type Brand<T, B extends string> = T & { readonly [_brand]: B }

export type Identity = Brand<string, 'Identity'>
export type Seed = Brand<string, 'Seed'>
export type TxHash = Brand<string, 'TxHash'>
export type Base64 = Brand<string, 'Base64'>
export type HexPublicKey = Brand<string, 'HexPublicKey'>

/**
 * Validates and brands a string as an Identity.
 * @throws {InvalidIdentityError} If not exactly 60 uppercase ASCII letters.
 */
export function toIdentity(s: string): Identity {
  if (!isIdentity(s)) throw new InvalidIdentityError(s)
  return s as Identity
}

/**
 * Validates and brands a string as a Seed.
 * @throws {InvalidSeedError} If not exactly 55 lowercase ASCII letters.
 */
export function toSeed(s: string): Seed {
  if (!isSeed(s)) throw new InvalidSeedError(s)
  return s as Seed
}

/**
 * Validates and brands a string as a TxHash.
 * @throws {InvalidTxHashError} If not exactly 60 lowercase ASCII letters.
 */
export function toTxHash(s: string): TxHash {
  if (!isTxHash(s)) throw new InvalidTxHashError(s)
  return s as TxHash
}

/**
 * Validates and brands a string as Base64.
 * @throws {InvalidBase64Error} If not a valid base64 string.
 */
export function toBase64(s: string): Base64 {
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s) || s.length % 4 !== 0) throw new InvalidBase64Error(s)
  return s as Base64
}

/** Returns true if `s` is a valid Qubic identity (60 uppercase ASCII letters). */
export function isIdentity(s: string): s is Identity {
  return s.length === 60 && /^[A-Z]+$/.test(s)
}

/** Returns true if `s` is a valid Qubic seed (55 lowercase ASCII letters). */
export function isSeed(s: string): s is Seed {
  return s.length === 55 && /^[a-z]+$/.test(s)
}

/** Returns true if `s` is a valid transaction hash (60 lowercase ASCII letters). */
export function isTxHash(s: string): s is TxHash {
  return s.length === 60 && /^[a-z]+$/.test(s)
}
