---
'@qubic.org/tcp': minor
'@qubic.org/types': minor
'@qubic.org/events': minor
'@qubic.org/react': minor
'@qubic.org/bob': patch
---

- **tcp**: Add request helpers and decoders for all 20 TCP message types, including oracle data queries and log/pruning helpers. Fix `decodeComputors` key offset (10→2), `requestContractFunction` header size (12→8 bytes with u16 fields), and asset decoders to read individual per-packet structs instead of count+array
- **types**: Add protocol constants (`MAX_MESSAGE_SIZE`, `SPECTRUM_CAPACITY`, `ASSETS_CAPACITY`, `ISSUANCE_RATE`, `MAX_AMOUNT`, `MAX_SUPPLY`, `INITIAL_TICK`, `DEFAULT_PORT`, `NUMBER_OF_SOLUTION_PROCESSORS`, `QUORUM`) and enums (`ORACLE_QUERY_TYPE`, `ORACLE_QUERY_STATUS`, `ORACLE_FLAG`, `ASSET_TYPE`, `TX_INPUT_TYPE`, `ORACLE_REQ_TYPE`, `ORACLE_RES_TYPE`)
- **events**: Add `subscribeBurningEvents`, `subscribeOracleEvents`, `subscribeCustomMessages` subscription helpers
- **react**: Add `useActiveIpos` and `useContractIpoBids` hooks
- **bob**: Fix `BobSyncStatus` discriminated union shape to match C++ response (`{ syncing: false }` instead of bare `false`)
