// Context
export { QubicProvider, useQubic } from './context.js'
export type { QubicContextValue, QubicProviderProps } from './context.js'

// Vault
export { VaultProvider, useVaultState } from './vault-provider.js'
export type { VaultProviderProps, VaultStateValue } from './vault-provider.js'

// Data hooks — live API
export { useTickInfo } from './use-tick-info.js'
export { useBalance } from './use-balance.js'
export { useIssuedAssets, useOwnedAssets, usePossessedAssets } from './use-assets.js'

// Data hooks — archive API (require archiveClient)
export { useTransaction } from './use-transaction.js'
export { useEventLogs } from './use-event-logs.js'
export type { EventLogsResult } from './use-event-logs.js'
export { useTransactionsForIdentity } from './use-transactions-for-identity.js'
export type { TransactionsForIdentityResult } from './use-transactions-for-identity.js'

// Contract hooks
export { useContractQuery } from './use-contract-query.js'

// Send mutations (require VaultProvider)
export { useSendTransfer } from './use-send-transfer.js'
export type { SendTransferParams } from './use-send-transfer.js'
export { useSendContractCall } from './use-send-contract-call.js'
export type { SendContractCallParams } from './use-send-contract-call.js'

// Wallet connector — extension, WalletConnect, MetaMask Snap, etc.
export type {
  WalletAccount,
  WalletConnector,
  WalletConnectorEvent,
  ConnectOptions,
  SendTransactionResult,
  SignTransactionResult,
  SignMessageResult,
} from './connector.js'
export { extensionConnector } from './extension-connector.js'
export { createWalletConnectConnector } from './walletconnect-connector.js'
export type { WalletConnectConnectorOptions } from './walletconnect-connector.js'
export { createMetaMaskSnapConnector, DEFAULT_SNAP_ID } from './metamask-snap-connector.js'
export type { MetaMaskSnapConnectorOptions } from './metamask-snap-connector.js'
export { useWalletConnector } from './use-wallet-connector.js'
export type { WalletConnectorState } from './use-wallet-connector.js'
