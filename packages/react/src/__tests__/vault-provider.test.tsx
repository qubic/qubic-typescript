import { describe, expect, test } from 'bun:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { VaultProvider, useVaultState } from '../vault/vault-provider.js'
import type { VaultStateValue } from '../vault/vault-provider.js'

// ── Minimal mock VaultData ──────────────────────────────────────────────────

/** VaultData is { salt: string; iv: string; ct: string; version: number } */
function makeMockVaultData() {
  return {
    salt: 'aabbccdd',
    iv: '00112233',
    ct: 'encrypted_payload',
    version: 1,
  } as any
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('VaultProvider', () => {
  test('renders children', () => {
    const vaultData = makeMockVaultData()
    const html = renderToStaticMarkup(
      <VaultProvider vaultData={vaultData}>
        <div>vault-child</div>
      </VaultProvider>,
    )
    expect(html).toContain('vault-child')
  })

  test('renders nested children', () => {
    const vaultData = makeMockVaultData()
    const html = renderToStaticMarkup(
      <VaultProvider vaultData={vaultData}>
        <span>a</span>
        <span>b</span>
      </VaultProvider>,
    )
    expect(html).toContain('a')
    expect(html).toContain('b')
  })
})

describe('useVaultState', () => {
  test('returns initial locked state when inside VaultProvider', () => {
    const vaultData = makeMockVaultData()
    let captured: VaultStateValue | null = null

    function Consumer() {
      captured = useVaultState()
      return (
        <span>
          {captured.isUnlocked ? 'unlocked' : 'locked'}
        </span>
      )
    }

    const html = renderToStaticMarkup(
      <VaultProvider vaultData={vaultData}>
        <Consumer />
      </VaultProvider>,
    )

    expect(html).toContain('locked')
    expect(captured).not.toBeNull()
    expect(captured!.isUnlocked).toBe(false)
    expect(captured!.isUnlocking).toBe(false)
    expect(captured!.identities).toHaveLength(0)
    expect(captured!.error).toBeUndefined()
    expect(typeof captured!.unlock).toBe('function')
    expect(typeof captured!.lock).toBe('function')
  })

  test('throws when used outside VaultProvider', () => {
    function BadConsumer() {
      useVaultState()
      return <span>never</span>
    }

    expect(() => renderToStaticMarkup(<BadConsumer />)).toThrow(
      'useVaultState must be used inside VaultProvider',
    )
  })
})
