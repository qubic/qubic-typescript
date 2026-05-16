import type { BroadcastTransactionResponse } from '@qubic.org/rpc'
import type { Identity } from '@qubic.org/types'
import { SC_DESTINATION } from '@qubic.org/wallet'
import { type UseMutationResult, useMutation } from '@tanstack/react-query'
import { useQubic } from '../context.js'
import { useVaultSigning } from '../vault/vault-provider.js'

export interface SendContractCallParams {
  /** Identity of the sender — must correspond to a wallet in the active vault. */
  from: Identity
  /** SC procedure input type index. */
  inputType: number
  /** Encoded payload bytes — use a buildXxxInput helper from @qubic.org/contracts. */
  payload: Uint8Array
  /** Amount to attach (QU). Default: 0n. */
  amount?: bigint
  /**
   * Destination identity. Defaults to the Qubic zero identity (standard for SC calls).
   * Override when targeting a specific contract address.
   */
  destination?: Identity
  /**
   * Ticks added to the current tick to compute `targetTick`.
   * Default: 5.
   */
  tickOffset?: number
}

/**
 * Mutation hook for sending a smart contract call.
 * Automatically fetches the current tick, signs via the active vault,
 * and broadcasts. The component never receives a wallet or seed.
 * Must be used inside both QubicProvider and VaultProvider.
 *
 * @example
 * ```tsx
 * import { qearn } from '@qubic.org/contracts'
 *
 * const { mutate: send, isPending } = useSendContractCall()
 *
 * send({
 *   from: identities[0],
 *   inputType: qearn.QEARN_LOCK_INPUT_TYPE,
 *   payload: qearn.buildQearnLockInput({ amount: 10_000_000n }),
 *   amount: 10_000_000n,
 * })
 * ```
 */
export function useSendContractCall(): UseMutationResult<
  BroadcastTransactionResponse,
  Error,
  SendContractCallParams
> {
  const { liveClient } = useQubic()
  const { getWallet } = useVaultSigning()

  return useMutation({
    mutationFn: async ({
      from,
      inputType,
      payload,
      amount = 0n,
      destination = SC_DESTINATION,
      tickOffset = 5,
    }) => {
      const wallet = getWallet(from)
      if (wallet === undefined) throw new Error(`No wallet for identity: ${from}`)
      const tickR = await liveClient.getTickInfo()
      if (!tickR.ok) throw tickR.error
      const { tick } = tickR.value
      if (tick === undefined) throw new Error('getTickInfo returned no tick')
      const { encoded } = await wallet.buildScTransaction({
        destination,
        amount,
        targetTick: tick + tickOffset,
        currentTick: tick,
        inputType,
        payload,
      })
      const broadcastR = await liveClient.broadcastTransaction(encoded)
      if (!broadcastR.ok) throw broadcastR.error
      return broadcastR.value
    },
  })
}
