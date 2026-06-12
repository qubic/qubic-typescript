import type { BobLogFilter } from '@qubic.org/bob'
import type { Identity, LogType } from '@qubic.org/types'
import type { EventFilter } from './types.js'

// ── Fluent builder ────────────────────────────────────────────────────────────

interface EventFilterBuilder {
  forIdentity(identity: Identity): this
  ofTypes(...types: LogType[]): this
  forContract(contractIndex: number): this
  fromTick(tick: number): this
  toTick(tick: number): this
  build(): EventFilter
  toBobFilter(): BobLogFilter
}

/**
 * Fluent event filter builder. Works with both Bob subscriptions and archive queries.
 *
 * @example
 * const filter = eventFilter()
 *   .forIdentity(id)
 *   .ofTypes(LOG_TYPE.QU_TRANSFER)
 *   .fromTick(1000)
 *   .build()
 */
export function eventFilter(): EventFilterBuilder {
  const state: EventFilter = {}

  const builder: EventFilterBuilder = {
    forIdentity(identity) {
      state.identity = identity
      return builder
    },
    ofTypes(...types) {
      state.logTypes = types
      return builder
    },
    forContract(contractIndex) {
      state.contractIndex = contractIndex
      return builder
    },
    fromTick(tick) {
      state.fromTick = tick
      return builder
    },
    toTick(tick) {
      state.toTick = tick
      return builder
    },
    build(): EventFilter {
      return { ...state }
    },
    /**
     * Converts this filter to a Bob-compatible filter.
     *
     * **Limitation:** The Bob API only supports a single `logType` value, so
     * when multiple types are specified via {@link ofTypes}, only the first
     * type is forwarded. The remaining types must be filtered client-side.
     */
    toBobFilter(): BobLogFilter {
      const f: BobLogFilter = {}
      if (state.identity !== undefined) f.identity = state.identity
      if (state.contractIndex !== undefined) f.contractIndex = state.contractIndex
      // Bob API limitation: logType is a single value, not an array.
      // Only the first requested type is sent; remaining types are
      // dropped and must be handled by client-side filtering.
      const lt = state.logTypes?.[0]
      if (lt !== undefined) f.logType = lt
      if (state.fromTick !== undefined) f.fromTick = state.fromTick
      if (state.toTick !== undefined) f.toTick = state.toTick
      return f
    },
  }

  return builder
}
