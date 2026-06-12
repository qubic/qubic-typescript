import { describe, expect, test } from 'bun:test'
import { CUSTOM_MESSAGE_OP, customMessageOpLabel } from '../protocol.js'

describe('customMessageOpLabel', () => {
  test('returns correct label for START_EPOCH', () => {
    expect(customMessageOpLabel(CUSTOM_MESSAGE_OP.START_EPOCH)).toBe('START_EPOCH')
  })

  test('returns correct label for END_EPOCH', () => {
    expect(customMessageOpLabel(CUSTOM_MESSAGE_OP.END_EPOCH)).toBe('END_EPOCH')
  })

  test('returns correct label for START_DISTRIBUTE_DIVIDENDS', () => {
    expect(customMessageOpLabel(CUSTOM_MESSAGE_OP.START_DISTRIBUTE_DIVIDENDS)).toBe(
      'START_DISTRIBUTE_DIVIDENDS',
    )
  })

  test('returns correct label for END_DISTRIBUTE_DIVIDENDS', () => {
    expect(customMessageOpLabel(CUSTOM_MESSAGE_OP.END_DISTRIBUTE_DIVIDENDS)).toBe(
      'END_DISTRIBUTE_DIVIDENDS',
    )
  })

  test('returns undefined for unknown ops', () => {
    expect(customMessageOpLabel(0n)).toBeUndefined()
    expect(customMessageOpLabel(1n)).toBeUndefined()
    expect(customMessageOpLabel(999999n)).toBeUndefined()
    expect(customMessageOpLabel(0xffffffffffffffffn)).toBeUndefined()
  })
})

describe('CUSTOM_MESSAGE_OP constants', () => {
  test('are distinct bigint values', () => {
    const values = Object.values(CUSTOM_MESSAGE_OP)
    const unique = new Set(values)
    expect(unique.size).toBe(values.length)
  })

  test('are all bigint type', () => {
    for (const value of Object.values(CUSTOM_MESSAGE_OP)) {
      expect(typeof value).toBe('bigint')
    }
  })

  test('has exactly four known ops', () => {
    expect(Object.keys(CUSTOM_MESSAGE_OP)).toHaveLength(4)
  })
})
