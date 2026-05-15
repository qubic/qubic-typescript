import type { BobSubscriptionClient, SubscriptionEvent } from '@qubic.ts/bob'
import { LOG_TYPE } from '@qubic.ts/types'
import { decodeEvent } from './decode-event.js'
import type { EventFilter, TypedEvent } from './types.js'

type SubOptions = { startLogId?: bigint; startEpoch?: number; signal?: AbortSignal }

function filterToLogType(filter?: EventFilter) {
  if (!filter?.logTypes || filter.logTypes.length === 0) return undefined
  return filter.logTypes[0]
}

function toBobFilter(filter?: EventFilter) {
  if (!filter) return undefined
  const f: Parameters<BobSubscriptionClient['subscribeLogs']>[0] = {}
  if (filter.identity !== undefined) f.identity = filter.identity
  if (filter.contractIndex !== undefined) f.contractIndex = filter.contractIndex
  const lt = filterToLogType(filter)
  if (lt !== undefined) f.logType = lt
  if (filter.fromTick !== undefined) f.fromTick = filter.fromTick
  if (filter.toTick !== undefined) f.toTick = filter.toTick
  return f
}

async function* decodeStream(
  source: AsyncIterable<SubscriptionEvent<import('@qubic.ts/bob').BobLogEvent>>,
  logTypeFilter?: ReadonlyArray<number>,
): AsyncGenerator<SubscriptionEvent<TypedEvent>> {
  for await (const item of source) {
    if (logTypeFilter && !logTypeFilter.includes(item.data.logType)) continue
    yield { ...item, data: decodeEvent(item.data) }
  }
}

// ── Public helpers ────────────────────────────────────────────────────────────

/** Subscribes to all QU transfer events, decoded. */
export function subscribeQuTransfers(
  bob: BobSubscriptionClient,
  filter?: Omit<EventFilter, 'logTypes'>,
  options?: SubOptions,
): AsyncIterable<SubscriptionEvent<TypedEvent & { logType: typeof LOG_TYPE.QU_TRANSFER }>> {
  const bobFilter = toBobFilter({ ...filter, logTypes: [LOG_TYPE.QU_TRANSFER] })
  const raw = bob.subscribeLogs(bobFilter, options)
  return decodeStream(raw) as AsyncIterable<
    SubscriptionEvent<TypedEvent & { logType: typeof LOG_TYPE.QU_TRANSFER }>
  >
}

/** Subscribes to asset events (issuance, ownership/possession changes). */
export function subscribeAssetEvents(
  bob: BobSubscriptionClient,
  filter?: Omit<EventFilter, 'logTypes'>,
  options?: SubOptions,
): AsyncIterable<SubscriptionEvent<TypedEvent>> {
  const assetLogTypes = [
    LOG_TYPE.ASSET_ISSUANCE,
    LOG_TYPE.ASSET_OWNERSHIP_CHANGE,
    LOG_TYPE.ASSET_POSSESSION_CHANGE,
    LOG_TYPE.ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE,
    LOG_TYPE.ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE,
  ] as const
  const bobFilter = toBobFilter({ ...filter })
  const raw = bob.subscribeLogs(bobFilter, options)
  return decodeStream(raw, assetLogTypes)
}

/** Subscribes to SC log messages (error, warning, info, debug). */
export function subscribeContractLogs(
  bob: BobSubscriptionClient,
  filter?: Omit<EventFilter, 'logTypes'>,
  options?: SubOptions,
): AsyncIterable<SubscriptionEvent<TypedEvent>> {
  const scLogTypes = [
    LOG_TYPE.CONTRACT_ERROR_MESSAGE,
    LOG_TYPE.CONTRACT_WARNING_MESSAGE,
    LOG_TYPE.CONTRACT_INFORMATION_MESSAGE,
    LOG_TYPE.CONTRACT_DEBUG_MESSAGE,
  ] as const
  const bobFilter = toBobFilter({ ...filter })
  const raw = bob.subscribeLogs(bobFilter, options)
  return decodeStream(raw, scLogTypes)
}

/** Subscribes to all log events and decodes each one. */
export function subscribeAllEvents(
  bob: BobSubscriptionClient,
  filter?: EventFilter,
  options?: SubOptions,
): AsyncIterable<SubscriptionEvent<TypedEvent>> {
  const bobFilter = toBobFilter(filter)
  const raw = bob.subscribeLogs(bobFilter, options)
  return decodeStream(raw)
}
