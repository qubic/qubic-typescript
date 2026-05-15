import type { BroadcastTransactionResponse } from '@qubic.org/rpc'
import type { Identity } from '@qubic.org/types'
import { type UseMutationResult, useMutation } from '@tanstack/react-query'
import { useQubic } from '../context.js'
import { useVaultSigning } from '../vault/vault-provider.js'

export interface SendTransferParams {
  /** Identity of the sender — must correspond to a wallet in the active vault. */
  from: Identity
  /** Recipient Qubic identity. */
  destination: Identity
  /** Amount in QU (as bigint). */
  amount: bigint
  /**
   * Ticks added to the current tick to compute `targetTick`.
   * Default: 5.
   */
  tickOffset?: number
}

/**
 * Mutation hook for sending a QU transfer.
 * Automatically fetches the current tick, signs via the active vault,
 * and broadcasts. The component never receives a wallet or seed.
 * Must be used inside both QubicProvider and VaultProvider.
 *
 * @example
 * ```tsx
 * const { mutate: send, isPending } = useSendTransfer()
 *
 * send({
 *   from: identities[0],
 *   destination: recipientId,
 *   amount: 1_000_000n,
 * })
 * ```
 */
export function useSendTransfer(): UseMutationResult<
  BroadcastTransactionResponse,
  Error,
  SendTransferParams
> {
  const { liveClient } = useQubic()
  const { getWallet } = useVaultSigning()

  return useMutation({
    mutationFn: async ({ from, destination, amount, tickOffset = 5 }) => {
      const wallet = getWallet(from)
      if (wallet === undefined) throw new Error(`No wallet for identity: ${from}`)
      const tickR = await liveClient.getTickInfo()
      if (!tickR.ok) throw tickR.error
      const { tick } = tickR.value
      const { encoded } = await wallet.buildTransfer({
        destination,
        amount,
        targetTick: tick + tickOffset,
        currentTick: tick,
      })
      const broadcastR = await liveClient.broadcastTransaction(encoded)
      if (!broadcastR.ok) throw broadcastR.error
      return broadcastR.value
    },
  })
}
