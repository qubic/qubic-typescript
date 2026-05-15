// ── Core provider ─────────────────────────────────────────────────────────────
export { QubicProvider, useQubic } from './context.js'
export type { QubicContextValue, QubicProviderProps } from './context.js'

// ── Vault (seed-based, encrypted) ─────────────────────────────────────────────
export { VaultProvider, useVaultState } from './vault/vault-provider.js'
export type { VaultProviderProps, VaultStateValue } from './vault/vault-provider.js'

// ── Wallet connectors (extension / WalletConnect / MetaMask Snap) ─────────────
export { WalletProvider, useWallet } from './wallet/wallet-provider.js'
export type { WalletProviderProps, WalletContextValue } from './wallet/wallet-provider.js'
export { useWalletConnector } from './wallet/use-wallet-connector.js'
export type { WalletConnectorState } from './wallet/use-wallet-connector.js'

export { extensionConnector } from './connectors/extension.js'
export { createWalletConnectConnector } from './connectors/walletconnect.js'
export type { WalletConnectConnectorOptions } from './connectors/walletconnect.js'
export { createMetaMaskSnapConnector, DEFAULT_SNAP_ID } from './connectors/metamask-snap.js'
export type { MetaMaskSnapConnectorOptions } from './connectors/metamask-snap.js'
export type {
  WalletAccount,
  WalletConnector,
  WalletConnectorEvent,
  ConnectOptions,
  SendTransactionResult,
  SignTransactionResult,
  SignMessageResult,
} from './connectors/connector.js'

// ── Data hooks — live API ──────────────────────────────────────────────────────
export { useTickInfo } from './queries/use-tick-info.js'
export { useBalance } from './queries/use-balance.js'
export { useBalances } from './queries/use-balances.js'
export type { BalancesResult } from './queries/use-balances.js'
export { useIssuedAssets, useOwnedAssets, usePossessedAssets } from './queries/use-assets.js'
export { useContractQuery } from './queries/use-contract-query.js'

// ── Data hooks — archive API ───────────────────────────────────────────────────
export { useTransaction } from './queries/use-transaction.js'
export { useEventLogs } from './queries/use-event-logs.js'
export type { EventLogsResult } from './queries/use-event-logs.js'
export { useTransactionsForIdentity } from './queries/use-transactions-for-identity.js'
export type { TransactionsForIdentityResult } from './queries/use-transactions-for-identity.js'

// ── Send mutations (require VaultProvider) ────────────────────────────────────
export { useSendTransfer } from './mutations/use-send-transfer.js'
export type { SendTransferParams } from './mutations/use-send-transfer.js'
export { useSendContractCall } from './mutations/use-send-contract-call.js'
export type { SendContractCallParams } from './mutations/use-send-contract-call.js'
