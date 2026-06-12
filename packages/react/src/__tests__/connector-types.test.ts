import { describe, expect, test } from 'bun:test'
import type {
  ConnectOptions,
  SendTransactionResult,
  SignMessageResult,
  SignTransactionResult,
  TransactionRequest,
  WalletAccount,
  WalletConnector,
  WalletConnectorEvent,
} from '../connectors/connector.js'

describe('connector type interfaces', () => {
  test('TransactionRequest has required fields (destination, amount)', () => {
    const tx: TransactionRequest = {
      destination:
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      amount: '1000',
    }

    expect(tx.destination).toBeTypeOf('string')
    expect(tx.destination).toBe(
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    )
    expect(tx.amount).toBeTypeOf('string')
    expect(tx.amount).toBe('1000')
  })

  test('TransactionRequest optional fields are accepted', () => {
    const tx: TransactionRequest = {
      destination:
        'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      amount: '500',
      inputType: 1,
      payload: 'base64encoded',
    }

    expect(tx.inputType).toBe(1)
    expect(tx.payload).toBe('base64encoded')
  })

  test('WalletAccount has required field (identity)', () => {
    const account: WalletAccount = {
      identity:
        'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    }

    expect(account.identity).toBeTypeOf('string')
    expect(account.identity).toBe(
      'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    )
  })

  test('WalletAccount optional name field is accepted', () => {
    const account: WalletAccount = {
      identity: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
      name: 'My Wallet',
    }

    expect(account.name).toBe('My Wallet')
  })

  test('SignTransactionResult has expected fields', () => {
    const result: SignTransactionResult = {
      txId: 'abc123',
      targetTick: 12345,
      txBytesBase64: 'base64data',
      txBytesHex: 'hexdata',
    }

    expect(result.txId).toBeTypeOf('string')
    expect(result.targetTick).toBeTypeOf('number')
    expect(result.txBytesBase64).toBeTypeOf('string')
    expect(result.txBytesHex).toBeTypeOf('string')
    expect(result.txId).toBe('abc123')
    expect(result.targetTick).toBe(12345)
  })

  test('SendTransactionResult extends SignTransactionResult', () => {
    const broadcast: SendTransactionResult['broadcast'] = { transactionId: 'net456' }
    const result: SendTransactionResult = {
      txId: 'abc123',
      targetTick: 12345,
      txBytesBase64: 'base64data',
      txBytesHex: 'hexdata',
      networkTxId: 'net456',
      broadcast,
    }

    // Inherited fields from SignTransactionResult
    expect(result.txId).toBe('abc123')
    expect(result.targetTick).toBe(12345)
    expect(result.txBytesBase64).toBe('base64data')
    expect(result.txBytesHex).toBe('hexdata')
    // SendTransactionResult-specific fields
    expect(result.networkTxId).toBeTypeOf('string')
    expect(result.broadcast).toBeDefined()
  })

  test('SignMessageResult has expected fields', () => {
    const result: SignMessageResult = {
      signatureHex: 'aabbcc',
      digestHex: 'ddeeff',
    }

    expect(result.signatureHex).toBeTypeOf('string')
    expect(result.digestHex).toBeTypeOf('string')
    expect(result.signatureHex).toBe('aabbcc')
    expect(result.digestHex).toBe('ddeeff')
  })

  test('WalletConnector interface has all required members', () => {
    // Verify the interface compiles and has the expected shape by creating a conforming object
    const broadcast: SendTransactionResult['broadcast'] = { transactionId: '' }
    const connector: WalletConnector = {
      id: 'test-connector',
      isAvailable: () => true,
      connect: async () => ({ identity: 'test' }),
      getAccount: async () => null,
      disconnect: async () => {},
      sendTransaction: async () => ({
        txId: '',
        targetTick: 0,
        txBytesBase64: '',
        txBytesHex: '',
        networkTxId: '',
        broadcast,
      }),
      signTransaction: async () => ({
        txId: '',
        targetTick: 0,
        txBytesBase64: '',
        txBytesHex: '',
      }),
      signMessage: async () => ({ signatureHex: '', digestHex: '' }),
      on: () => () => {},
    }

    expect(connector.id).toBeTypeOf('string')
    expect(connector.isAvailable()).toBe(true)
    expect(typeof connector.connect).toBe('function')
    expect(typeof connector.getAccount).toBe('function')
    expect(typeof connector.disconnect).toBe('function')
    expect(typeof connector.sendTransaction).toBe('function')
    expect(typeof connector.signTransaction).toBe('function')
    expect(typeof connector.signMessage).toBe('function')
    expect(typeof connector.on).toBe('function')
  })

  test('WalletConnectorEvent type includes expected values', () => {
    // Verify the union members at compile time
    const eventA: WalletConnectorEvent = 'accountChanged'
    const eventB: WalletConnectorEvent = 'disconnect'

    expect(eventA).toBe('accountChanged')
    expect(eventB).toBe('disconnect')
  })

  test('ConnectOptions accepts optional onUri callback', () => {
    let capturedUri = ''
    const opts: ConnectOptions = {
      onUri: (uri: string) => {
        capturedUri = uri
      },
    }

    opts.onUri?.('wc://test-uri')
    expect(capturedUri).toBe('wc://test-uri')
  })

  test('ConnectOptions is valid when empty', () => {
    const opts: ConnectOptions = {}
    expect(opts.onUri).toBeUndefined()
  })
})
