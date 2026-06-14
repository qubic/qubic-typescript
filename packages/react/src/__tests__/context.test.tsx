import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { QubicProvider, useQubic } from '../context.js'
import type { QubicContextValue } from '../context.js'

// ── Minimal mock LiveClient ─────────────────────────────────────────────────

function makeMockLiveClient() {
  return {
    getTickInfo: async () => ({ tick: 0 }),
    getBalance: async () => ({ balance: '0' }),
  } as any // LiveClient is a complex inferred type; cast for testing
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('QubicProvider', () => {
  test('renders children', () => {
    const liveClient = makeMockLiveClient()
    const html = renderToStaticMarkup(
      <QubicProvider liveClient={liveClient}>
        <div>hello qubic</div>
      </QubicProvider>,
    )
    expect(html).toContain('hello qubic')
  })

  test('renders nested children', () => {
    const liveClient = makeMockLiveClient()
    const html = renderToStaticMarkup(
      <QubicProvider liveClient={liveClient}>
        <div>
          <span>child1</span>
          <span>child2</span>
        </div>
      </QubicProvider>,
    )
    expect(html).toContain('child1')
    expect(html).toContain('child2')
  })
})

describe('useQubic', () => {
  test('returns context values when inside QubicProvider', () => {
    const liveClient = makeMockLiveClient()
    let captured: QubicContextValue | null = null

    function Consumer() {
      captured = useQubic()
      return <span>ok</span>
    }

    const html = renderToStaticMarkup(
      <QubicProvider liveClient={liveClient}>
        <Consumer />
      </QubicProvider>,
    )

    expect(html).toContain('ok')
    expect(captured).not.toBeNull()
    expect(captured!.liveClient).toBe(liveClient)
    expect(captured!.archiveClient).toBeUndefined()
  })

  test('returns archiveClient when provided', () => {
    const liveClient = makeMockLiveClient()
    const archiveClient = { query: async () => ({}) } as any
    let captured: QubicContextValue | null = null

    function Consumer() {
      captured = useQubic()
      return <span>ok</span>
    }

    renderToStaticMarkup(
      <QubicProvider liveClient={liveClient} archiveClient={archiveClient}>
        <Consumer />
      </QubicProvider>,
    )

    expect(captured).not.toBeNull()
    expect(captured!.archiveClient).toBe(archiveClient)
  })

  test('throws when used outside QubicProvider', () => {
    function BadConsumer() {
      useQubic()
      return <span>never</span>
    }

    expect(() => renderToStaticMarkup(<BadConsumer />)).toThrow(
      'useQubic must be used inside QubicProvider',
    )
  })
})

describe('default QueryClient creation', () => {
  test('QubicProvider works without explicit queryClient (uses internal default)', () => {
    const liveClient = makeMockLiveClient()

    // If no queryClient is passed, the provider creates one internally.
    // Rendering should succeed without errors.
    const html = renderToStaticMarkup(
      <QubicProvider liveClient={liveClient}>
        <div>default-qc</div>
      </QubicProvider>,
    )
    expect(html).toContain('default-qc')
  })

  test('QubicProvider accepts an external QueryClient', () => {
    const { QueryClient } = require('@tanstack/react-query')
    const liveClient = makeMockLiveClient()
    const externalQC = new QueryClient()

    const html = renderToStaticMarkup(
      <QubicProvider liveClient={liveClient} queryClient={externalQC}>
        <div>external-qc</div>
      </QubicProvider>,
    )
    expect(html).toContain('external-qc')
  })
})
