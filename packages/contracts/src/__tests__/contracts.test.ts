import { describe, expect, test } from 'bun:test'
import { QubicRpcError, ok, err } from '@qubic.org/rpc'
import {
  QEARN_CONTRACT_INDEX,
  QEARN_GET_STATE_OF_ROUND_INPUT_TYPE,
  QEARN_UNLOCK_INPUT_TYPE,
  buildQearnGetStateOfRoundInput,
  buildQearnUnlockInput,
  decodeQearnGetStateOfRoundOutput,
  decodeQearnLockOutput,
  decodeQearnUnlockOutput,
  qearn,
  qearnGetStateOfRound,
} from '../__generated__/qearn.js'
import { callContractFunction } from '../call-contract.js'

describe('generated constants', () => {
  test('QEARN_CONTRACT_INDEX is 9', () => {
    expect(QEARN_CONTRACT_INDEX).toBe(9)
  })

  test('QEARN_UNLOCK_INPUT_TYPE is 7', () => {
    // lock_input is ordinal 6, unlock_input is ordinal 7 in the header declaration order
    expect(QEARN_UNLOCK_INPUT_TYPE).toBe(7)
  })

  test('QEARN_GET_STATE_OF_ROUND_INPUT_TYPE is 3', () => {
    expect(QEARN_GET_STATE_OF_ROUND_INPUT_TYPE).toBe(3)
  })
})

describe('buildQearnUnlockInput', () => {
  test('produces 12-byte payload', () => {
    const payload = buildQearnUnlockInput({ amount: 5_000_000n, lockedEpoch: 150 })
    expect(payload.byteLength).toBe(12)
  })

  test('encodes amount as uint64 LE', () => {
    const payload = buildQearnUnlockInput({ amount: 5_000_000n, lockedEpoch: 150 })
    expect(new DataView(payload.buffer).getBigUint64(0, true)).toBe(5_000_000n)
  })

  test('encodes lockedEpoch as uint32 LE', () => {
    const payload = buildQearnUnlockInput({ amount: 5_000_000n, lockedEpoch: 150 })
    expect(new DataView(payload.buffer).getUint32(8, true)).toBe(150)
  })
})

describe('decodeQearnUnlockOutput', () => {
  test('decodes returnCode', () => {
    const data = new Uint8Array(4)
    new DataView(data.buffer).setUint32(0, 42, true)
    const output = decodeQearnUnlockOutput(data)
    expect(output.returnCode).toBe(42)
  })
})

describe('decodeQearnLockOutput', () => {
  test('decodes returnCode', () => {
    const data = new Uint8Array(4)
    new DataView(data.buffer).setUint32(0, 0, true)
    expect(decodeQearnLockOutput(data).returnCode).toBe(0)
  })
})

describe('buildQearnGetStateOfRoundInput', () => {
  test('encodes epoch as uint32 LE', () => {
    const payload = buildQearnGetStateOfRoundInput({ epoch: 137 })
    expect(payload.byteLength).toBe(4)
    expect(new DataView(payload.buffer).getUint32(0, true)).toBe(137)
  })
})

describe('decodeQearnGetStateOfRoundOutput', () => {
  test('decodes state', () => {
    const data = new Uint8Array(4)
    new DataView(data.buffer).setUint32(0, 99, true)
    expect(decodeQearnGetStateOfRoundOutput(data).state).toBe(99)
  })
})

describe('high-level function wrappers', () => {
  function makeBase64(bytes: Uint8Array): string {
    let s = ''
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i] ?? 0)
    return btoa(s)
  }

  test('qearnGetStateOfRound returns decoded output', async () => {
    const responseData = new Uint8Array(4)
    new DataView(responseData.buffer).setUint32(0, 99, true)
    const live = {
      async querySmartContract() {
        return ok({ responseData: makeBase64(responseData) })
      },
    }
    const result = await qearnGetStateOfRound(live, { epoch: 212 })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.state).toBe(99)
  })

  test('qearn.getStateOfRound is the same function via namespace', async () => {
    expect(qearn.getStateOfRound).toBe(qearnGetStateOfRound)
  })

  test('qearn.contractIndex is 9', () => {
    expect(qearn.contractIndex).toBe(9)
  })

  test('qearn.buildUnlockInput is the procedure builder', () => {
    const payload = qearn.buildUnlockInput({ amount: 1000n, lockedEpoch: 212 })
    expect(payload.byteLength).toBe(12)
  })
})

describe('callContractFunction', () => {
  function makeBase64(bytes: Uint8Array): string {
    let s = ''
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i] ?? 0)
    return btoa(s)
  }

  test('returns ok result with decoded output', async () => {
    const responseData = new Uint8Array(4)
    new DataView(responseData.buffer).setUint32(0, 7, true)

    const live = {
      async querySmartContract() {
        return ok({ responseData: makeBase64(responseData) })
      },
    }

    const result = await callContractFunction<{ epoch: number }, { state: number }>({
      live,
      contractIndex: QEARN_CONTRACT_INDEX,
      inputType: QEARN_GET_STATE_OF_ROUND_INPUT_TYPE,
      inputSize: 4,
      inputFields: [{ name: 'epoch', type: 'uint32', offset: 0, byteLength: 4 }],
      outputFields: [{ name: 'state', type: 'uint32', offset: 0, byteLength: 4 }],
      structs: {},
      input: { epoch: 137 },
      identityToPublicKey: () => new Uint8Array(32),
      publicKeyToIdentity: () => 'A'.repeat(60),
    })

    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.state).toBe(7)
  })

  test('returns err result when live returns err Result', async () => {
    const live = {
      async querySmartContract() {
        return err(new QubicRpcError(500, '/querySmartContract'))
      },
    }

    const result = await callContractFunction<{ epoch: number }, { state: number }>({
      live,
      contractIndex: QEARN_CONTRACT_INDEX,
      inputType: QEARN_GET_STATE_OF_ROUND_INPUT_TYPE,
      inputSize: 4,
      inputFields: [{ name: 'epoch', type: 'uint32', offset: 0, byteLength: 4 }],
      outputFields: [{ name: 'state', type: 'uint32', offset: 0, byteLength: 4 }],
      structs: {},
      input: { epoch: 137 },
      identityToPublicKey: () => new Uint8Array(32),
      publicKeyToIdentity: () => 'A'.repeat(60),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toBeInstanceOf(QubicRpcError)
  })

  test('sends correct contractIndex and inputType to live client', async () => {
    let capturedReq: unknown
    const live = {
      async querySmartContract(req: unknown) {
        capturedReq = req
        return ok({ responseData: makeBase64(new Uint8Array(4)) })
      },
    }

    await callContractFunction<{ epoch: number }, { state: number }>({
      live,
      contractIndex: 9,
      inputType: 3,
      inputSize: 4,
      inputFields: [{ name: 'epoch', type: 'uint32', offset: 0, byteLength: 4 }],
      outputFields: [{ name: 'state', type: 'uint32', offset: 0, byteLength: 4 }],
      structs: {},
      input: { epoch: 200 },
      identityToPublicKey: () => new Uint8Array(32),
      publicKeyToIdentity: () => 'A'.repeat(60),
    })

    const req = capturedReq as { contractIndex?: number; inputType?: number; inputSize?: number }
    expect(req.contractIndex).toBe(9)
    expect(req.inputType).toBe(3)
    expect(req.inputSize).toBe(4)
  })
})
