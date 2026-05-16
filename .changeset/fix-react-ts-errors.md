---
"@qubic.org/react": patch
---

Fix TypeScript build errors in `useSendContractCall`, `useSendTransfer`, and `MetaMaskSnapConnector`. Guard against `tick` being `undefined` (`exactOptionalPropertyTypes`), and type the `broadcast` callback return as `BroadcastTransactionResponse` instead of `unknown`.
