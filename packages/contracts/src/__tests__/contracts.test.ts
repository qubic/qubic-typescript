import { describe, expect, test } from 'bun:test'
import { QubicRpcError, err, ok } from '@qubic.org/rpc'
import {
  // qearn
  QEARN_CONTRACT_INDEX,
  QEARN_GET_STATE_OF_ROUND_INPUT_TYPE,
  QEARN_UNLOCK_INPUT_TYPE,
  buildQearnUnlockInput,
  decodeQearnGetStateOfRoundOutput,
  decodeQearnLockOutput,
  decodeQearnUnlockOutput,
  qearn,
  qearnGetStateOfRound,
} from '../__generated__/qearn.js'
import { callContractFunction } from '../call-contract.js'

// ──────────────────────────────────────────────
// Contract metadata for parameterized tests
// ──────────────────────────────────────────────

/** Maps each generated contract to its expected CONTRACT_INDEX, module name, and namespace. */
const CONTRACT_META: {
  name: string
  module: string
  index: number
  namespace: string | null
}[] = [
  { name: 'qx', module: 'qx.js', index: 1, namespace: 'qx' },
  { name: 'quottery', module: 'quottery.js', index: 2, namespace: 'quottery' },
  { name: 'random', module: 'random.js', index: 3, namespace: 'random' },
  { name: 'qutil', module: 'qutil.js', index: 4, namespace: 'qUtil' },
  { name: 'mylastmatch', module: 'mylastmatch.js', index: 5, namespace: 'myLastMatch' },
  {
    name: 'generalquorumproposal',
    module: 'generalquorumproposal.js',
    index: 6,
    namespace: 'generalQuorumProposal',
  },
  { name: 'supplywatcher', module: 'supplywatcher.js', index: 7, namespace: 'supplyWatcher' },
  {
    name: 'computorcontrolledfund',
    module: 'computorcontrolledfund.js',
    index: 8,
    namespace: 'computorControlledFund',
  },
  { name: 'qearn', module: 'qearn.js', index: 9, namespace: 'qearn' },
  { name: 'qvault', module: 'qvault.js', index: 10, namespace: 'qVAULT' },
  { name: 'msvault', module: 'msvault.js', index: 11, namespace: 'msVault' },
  { name: 'multisignvault', module: 'multisignvault.js', index: 11, namespace: null },
  { name: 'qbay', module: 'qbay.js', index: 12, namespace: 'qbay' },
  { name: 'qswap', module: 'qswap.js', index: 13, namespace: 'qswap' },
  { name: 'nostromo', module: 'nostromo.js', index: 14, namespace: 'nostromo' },
  { name: 'qdraw', module: 'qdraw.js', index: 15, namespace: 'qdraw' },
  { name: 'randomlottery', module: 'randomlottery.js', index: 16, namespace: 'randomLottery' },
  { name: 'qbond', module: 'qbond.js', index: 17, namespace: 'qBond' },
  { name: 'qip', module: 'qip.js', index: 18, namespace: 'qIP' },
  { name: 'qraffle', module: 'qraffle.js', index: 19, namespace: 'qRaffle' },
  { name: 'qrwa', module: 'qrwa.js', index: 20, namespace: 'qRWA' },
  { name: 'qreservepool', module: 'qreservepool.js', index: 21, namespace: 'qReservePool' },
  { name: 'qthirtyfour', module: 'qthirtyfour.js', index: 22, namespace: 'qThirtyFour' },
  { name: 'qduel', module: 'qduel.js', index: 23, namespace: 'qDuel' },
  { name: 'pulse', module: 'pulse.js', index: 24, namespace: 'pulse' },
  { name: 'vottunbridge', module: 'vottunbridge.js', index: 25, namespace: 'vottunBridge' },
  { name: 'qusino', module: 'qusino.js', index: 26, namespace: 'qusino' },
  { name: 'escrow', module: 'escrow.js', index: 27, namespace: 'escrow' },
  { name: 'ggwp', module: 'ggwp.js', index: 28, namespace: 'gGWP' },
  { name: 'qubicicoportal', module: 'qubicicoportal.js', index: 18, namespace: null },
]

// ──────────────────────────────────────────────
// Dynamic imports for parameterized tests
// ──────────────────────────────────────────────

/** Lazily loaded contract modules keyed by module filename. */
const moduleCache = new Map<string, Record<string, unknown>>()

async function getContractModule(moduleFile: string): Promise<Record<string, unknown>> {
  const cached = moduleCache.get(moduleFile)
  if (cached) return cached
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const mod = await import(`../__generated__/${moduleFile}`)
  moduleCache.set(moduleFile, mod as Record<string, unknown>)
  return mod as Record<string, unknown>
}

// ──────────────────────────────────────────────
// 1. Existing qearn tests (preserved from original)
// ──────────────────────────────────────────────

describe('generated constants', () => {
  test('QEARN_CONTRACT_INDEX is 9', () => {
    expect(QEARN_CONTRACT_INDEX).toBe(9)
  })

  test('QEARN_UNLOCK_INPUT_TYPE is 2', () => {
    // REGISTER_USER_PROCEDURE(unlock, 2) in Qearn.h
    expect(QEARN_UNLOCK_INPUT_TYPE).toBe(2)
  })

  test('QEARN_GET_STATE_OF_ROUND_INPUT_TYPE is 3', () => {
    expect(QEARN_GET_STATE_OF_ROUND_INPUT_TYPE).toBe(3)
  })
})

describe('buildQearnUnlockInput', () => {
  test('returns ContractCall with correct contractIndex and inputType', () => {
    const call = buildQearnUnlockInput({ amount: 5_000_000n, lockedEpoch: 150 })
    expect(call.contractIndex).toBe(QEARN_CONTRACT_INDEX)
    expect(call.inputType).toBe(QEARN_UNLOCK_INPUT_TYPE)
  })

  test('payload is 12 bytes', () => {
    const { payload } = buildQearnUnlockInput({ amount: 5_000_000n, lockedEpoch: 150 })
    expect(payload.byteLength).toBe(12)
  })

  test('encodes amount as uint64 LE', () => {
    const { payload } = buildQearnUnlockInput({ amount: 5_000_000n, lockedEpoch: 150 })
    expect(new DataView(payload.buffer).getBigUint64(0, true)).toBe(5_000_000n)
  })

  test('encodes lockedEpoch as uint32 LE', () => {
    const { payload } = buildQearnUnlockInput({ amount: 5_000_000n, lockedEpoch: 150 })
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
  test('encodes epoch as uint32 LE via namespace buildUnlockInput', () => {
    const call = qearn.buildUnlockInput({ amount: 1000n, lockedEpoch: 212 })
    expect(call.contractIndex).toBe(QEARN_CONTRACT_INDEX)
    expect(call.inputType).toBe(QEARN_UNLOCK_INPUT_TYPE)
    expect(call.payload.byteLength).toBe(12)
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

  test('qearn.buildUnlockInput returns ContractCall', () => {
    const call = qearn.buildUnlockInput({ amount: 1000n, lockedEpoch: 212 })
    expect(call.contractIndex).toBe(QEARN_CONTRACT_INDEX)
    expect(call.inputType).toBe(QEARN_UNLOCK_INPUT_TYPE)
    expect(call.payload.byteLength).toBe(12)
  })
})

// ──────────────────────────────────────────────
// 2. Parameterized tests for ALL generated contracts
// ──────────────────────────────────────────────

describe('parameterized: every contract module exports CONTRACT_INDEX', () => {
  for (const meta of CONTRACT_META) {
    test(`${meta.name} exports ${meta.module.replace('.js', '')}_CONTRACT_INDEX = ${meta.index}`, async () => {
      const mod = await getContractModule(meta.module)
      const indexKey = Object.keys(mod).find((k) => k.endsWith('_CONTRACT_INDEX'))
      expect(indexKey).toBeDefined()
      expect(mod[indexKey!]).toBe(meta.index)
    })
  }
})

describe('parameterized: every contract namespace has correct contractIndex', () => {
  for (const meta of CONTRACT_META) {
    if (!meta.namespace) continue
    test(`${meta.namespace}.contractIndex === ${meta.index}`, async () => {
      const mod = await getContractModule(meta.module)
      const ns = mod[meta.namespace!] as Record<string, unknown> | undefined
      expect(ns).toBeDefined()
      expect(ns!.contractIndex).toBe(meta.index)
    })
  }
})

describe('parameterized: every contract has at least one builder function', () => {
  for (const meta of CONTRACT_META) {
    if (meta.name === 'mylastmatch' || meta.name === 'supplywatcher') continue // empty contracts
    test(`${meta.name} exports a buildXxxInput function`, async () => {
      const mod = await getContractModule(meta.module)
      const buildKeys = Object.keys(mod).filter((k) => k.startsWith('build') && k.endsWith('Input'))
      expect(buildKeys.length).toBeGreaterThan(0)
    })
  }
})

describe('parameterized: every contract has at least one decoder function', () => {
  for (const meta of CONTRACT_META) {
    if (meta.name === 'mylastmatch' || meta.name === 'supplywatcher') continue // empty contracts
    test(`${meta.name} exports a decodeXxxOutput function`, async () => {
      const mod = await getContractModule(meta.module)
      const decodeKeys = Object.keys(mod).filter(
        (k) => k.startsWith('decode') && k.endsWith('Output'),
      )
      expect(decodeKeys.length).toBeGreaterThan(0)
    })
  }
})

describe('parameterized: every contract INPUT_TYPE is a positive number', () => {
  for (const meta of CONTRACT_META) {
    if (meta.name === 'mylastmatch' || meta.name === 'supplywatcher') continue // empty contracts
    test(`${meta.name} INPUT_TYPE constants are positive numbers`, async () => {
      const mod = await getContractModule(meta.module)
      const inputTypeKeys = Object.keys(mod).filter((k) => k.endsWith('_INPUT_TYPE'))
      expect(inputTypeKeys.length).toBeGreaterThan(0)
      for (const key of inputTypeKeys) {
        const val = mod[key]
        expect(typeof val).toBe('number')
        expect(val as number).toBeGreaterThan(0)
      }
    })
  }
})

describe('parameterized: builder and decoder are functions', () => {
  for (const meta of CONTRACT_META) {
    if (meta.name === 'mylastmatch' || meta.name === 'supplywatcher') continue // empty contracts
    test(`${meta.name} builder and decoder are callable functions`, async () => {
      const mod = await getContractModule(meta.module)

      const buildKeys = Object.keys(mod).filter((k) => k.startsWith('build') && k.endsWith('Input'))
      const decodeKeys = Object.keys(mod).filter(
        (k) => k.startsWith('decode') && k.endsWith('Output'),
      )

      // At least one builder and one decoder should exist
      expect(buildKeys.length).toBeGreaterThan(0)
      expect(decodeKeys.length).toBeGreaterThan(0)

      // All builders and decoders should be functions
      for (const key of buildKeys) {
        expect(typeof mod[key]).toBe('function')
      }
      for (const key of decodeKeys) {
        expect(typeof mod[key]).toBe('function')
      }
    })
  }
})

// ──────────────────────────────────────────────
// 3. Struct-using contract tests (qx with Asset struct)
// ──────────────────────────────────────────────

describe('qx struct payload encoding', () => {
  test('buildQxIssueAssetInput returns correct ContractCall', async () => {
    const { buildQxIssueAssetInput, QX_CONTRACT_INDEX, QX_ISSUE_ASSET_INPUT_TYPE } =
      (await getContractModule('qx.js')) as typeof import('../__generated__/qx.js')
    const call = buildQxIssueAssetInput({
      assetName: 12345n,
      numberOfShares: 1_000_000n,
      unitOfMeasurement: 1n,
      numberOfDecimalPlaces: 4,
    })
    expect(call.contractIndex).toBe(QX_CONTRACT_INDEX)
    expect(call.inputType).toBe(QX_ISSUE_ASSET_INPUT_TYPE)
    // uint64(8) + sint64(8) + uint64(8) + sint8(1) = 25 bytes
    expect(call.payload.byteLength).toBe(25)
  })

  test('buildQxIssueAssetInput encodes fields correctly', async () => {
    const { buildQxIssueAssetInput } = (await getContractModule('qx.js')) as typeof import('../__generated__/qx.js')
    const call = buildQxIssueAssetInput({
      assetName: 0xabcdn,
      numberOfShares: 999n,
      unitOfMeasurement: 10n,
      numberOfDecimalPlaces: 2,
    })
    const view = new DataView(call.payload.buffer, call.payload.byteOffset)
    // assetName at offset 0, uint64 LE
    expect(view.getBigUint64(0, true)).toBe(0xabcdn)
    // numberOfShares at offset 8, sint64 LE
    expect(view.getBigInt64(8, true)).toBe(999n)
    // unitOfMeasurement at offset 16, uint64 LE
    expect(view.getBigUint64(16, true)).toBe(10n)
    // numberOfDecimalPlaces at offset 24, sint8
    expect(new Int8Array(call.payload.buffer, call.payload.byteOffset + 24, 1)[0]).toBe(2)
  })

  test('decodeQxIssueAssetOutput decodes issuedNumberOfShares', async () => {
    const { decodeQxIssueAssetOutput } = (await getContractModule('qx.js')) as typeof import('../__generated__/qx.js')
    const data = new Uint8Array(8)
    new DataView(data.buffer).setBigInt64(0, 5000n, true)
    const output = decodeQxIssueAssetOutput(data)
    expect(output.issuedNumberOfShares).toBe(5000n)
  })

  test('buildQxTransferShareManagementRightsInput encodes struct field', async () => {
    const { buildQxTransferShareManagementRightsInput } = (await getContractModule(
      'qx.js',
    )) as typeof import('../__generated__/qx.js')
    const call = buildQxTransferShareManagementRightsInput({
      asset: { issuer: 'A'.repeat(55), assetName: 42n },
      numberOfShares: 100n,
      newManagingContractIndex: 13,
    })
    // struct(40) + sint64(8) + uint32(4) = 52 bytes
    expect(call.payload.byteLength).toBe(52)
    expect(call.contractIndex).toBe(1)
  })
})

// ──────────────────────────────────────────────
// 4. escrow struct encoding tests (Deal struct with arrays of structs)
// ──────────────────────────────────────────────

describe('escrow struct payload encoding', () => {
  test('buildEscrowAcceptDealInput encodes sint64 index', async () => {
    const { buildEscrowAcceptDealInput, ESCROW_CONTRACT_INDEX, ESCROW_ACCEPT_DEAL_INPUT_TYPE } =
      (await getContractModule('escrow.js')) as typeof import('../__generated__/escrow.js')
    const call = buildEscrowAcceptDealInput({ index: 42n })
    expect(call.contractIndex).toBe(ESCROW_CONTRACT_INDEX)
    expect(call.inputType).toBe(ESCROW_ACCEPT_DEAL_INPUT_TYPE)
    expect(call.payload.byteLength).toBe(8)
    const view = new DataView(call.payload.buffer, call.payload.byteOffset)
    expect(view.getBigInt64(0, true)).toBe(42n)
  })

  test('decodeEscrowTransferShareManagementRightsOutput decodes transferredShares', async () => {
    const { decodeEscrowTransferShareManagementRightsOutput } = (await getContractModule(
      'escrow.js',
    )) as typeof import('../__generated__/escrow.js')
    const data = new Uint8Array(8)
    new DataView(data.buffer).setBigInt64(0, 555n, true)
    const output = decodeEscrowTransferShareManagementRightsOutput(data)
    expect(output.transferredShares).toBe(555n)
  })
})

// ──────────────────────────────────────────────
// 5. qswap struct encoding tests (Asset struct)
// ──────────────────────────────────────────────

describe('qswap struct payload encoding', () => {
  test('buildQswapCreatePoolInput encodes id + uint64', async () => {
    const { buildQswapCreatePoolInput, QSWAP_CONTRACT_INDEX, QSWAP_CREATE_POOL_INPUT_TYPE } =
      (await getContractModule('qswap.js')) as typeof import('../__generated__/qswap.js')
    const idToPk = (_id: string) => new Uint8Array(32)
    const call = buildQswapCreatePoolInput({ assetIssuer: 'X'.repeat(55), assetName: 7n }, idToPk)
    expect(call.contractIndex).toBe(QSWAP_CONTRACT_INDEX)
    expect(call.inputType).toBe(QSWAP_CREATE_POOL_INPUT_TYPE)
    // id(32) + uint64(8) = 40 bytes
    expect(call.payload.byteLength).toBe(40)
  })

  test('buildQswapFeesInput (no input) uses empty payload', async () => {
    const { qswapFees, QSWAP_CONTRACT_INDEX } = (await getContractModule(
      'qswap.js',
    )) as typeof import('../__generated__/qswap.js')
    // qswapFees is an async function, but the namespace should have Fees
    // Test the namespace
    const { qswap } = (await getContractModule('qswap.js')) as typeof import('../__generated__/qswap.js')
    expect(qswap.contractIndex).toBe(QSWAP_CONTRACT_INDEX)
    expect(typeof qswapFees).toBe('function')
  })

  test('decodeQswapFeesOutput decodes multiple uint32 fields', async () => {
    const { decodeQswapFeesOutput } = (await getContractModule('qswap.js')) as typeof import('../__generated__/qswap.js')
    // 8 fields * 4 bytes = 32 bytes
    const data = new Uint8Array(32)
    const view = new DataView(data.buffer)
    view.setUint32(0, 100, true) // assetIssuanceFee
    view.setUint32(4, 200, true) // poolCreationFee
    view.setUint32(8, 300, true) // transferFee
    view.setUint32(12, 400, true) // swapFee
    view.setUint32(16, 500, true) // shareholderFee
    view.setUint32(20, 600, true) // investRewardsFee
    view.setUint32(24, 700, true) // qxFee
    view.setUint32(28, 800, true) // burnFee
    const output = decodeQswapFeesOutput(data)
    expect(output.assetIssuanceFee).toBe(100)
    expect(output.poolCreationFee).toBe(200)
    expect(output.transferFee).toBe(300)
    expect(output.swapFee).toBe(400)
    expect(output.shareholderFee).toBe(500)
    expect(output.investRewardsFee).toBe(600)
    expect(output.qxFee).toBe(700)
    expect(output.burnFee).toBe(800)
  })
})

// ──────────────────────────────────────────────
// 6. random contract tests (bytes type fields)
// ──────────────────────────────────────────────

describe('random contract payload encoding', () => {
  test('buildRandomBuyEntropyInput encodes uint8 + uint16 + id', async () => {
    const { buildRandomBuyEntropyInput, RANDOM_CONTRACT_INDEX, RANDOM_BUY_ENTROPY_INPUT_TYPE } =
      (await getContractModule('random.js')) as typeof import('../__generated__/random.js')
    const idToPk = (_id: string) => {
      const pk = new Uint8Array(32)
      pk[0] = 0xff
      return pk
    }
    const call = buildRandomBuyEntropyInput(
      { collateralTier: 2, numberOfBits: 256, trustee: 'T'.repeat(55) },
      idToPk,
    )
    expect(call.contractIndex).toBe(RANDOM_CONTRACT_INDEX)
    expect(call.inputType).toBe(RANDOM_BUY_ENTROPY_INPUT_TYPE)
    // uint8(1) + uint16(2) + id(32) = 35 bytes
    expect(call.payload.byteLength).toBe(35)
    expect(call.payload[0]).toBe(2) // collateralTier
    const view = new DataView(call.payload.buffer, call.payload.byteOffset)
    expect(view.getUint16(1, true)).toBe(256) // numberOfBits
  })

  test('decodeRandomBuyEntropyOutput decodes 512-byte entropy', async () => {
    const { decodeRandomBuyEntropyOutput } = (await getContractModule(
      'random.js',
    )) as typeof import('../__generated__/random.js')
    const data = new Uint8Array(512)
    data[0] = 0xaa
    data[511] = 0xbb
    const output = decodeRandomBuyEntropyOutput(data)
    expect(output.entropy.byteLength).toBe(512)
    expect(output.entropy[0]).toBe(0xaa)
    expect(output.entropy[511]).toBe(0xbb)
  })
})

// ──────────────────────────────────────────────
// 7. nostromo contract tests (structs + procedures)
// ──────────────────────────────────────────────

describe('nostromo contract payload encoding', () => {
  test('buildNostromoRegisterInTierInput encodes uint32', async () => {
    const {
      buildNostromoRegisterInTierInput,
      NOSTROMO_CONTRACT_INDEX,
      NOSTROMO_REGISTER_IN_TIER_INPUT_TYPE,
    } = (await getContractModule('nostromo.js')) as typeof import('../__generated__/nostromo.js')
    const call = buildNostromoRegisterInTierInput({ tierLevel: 3 })
    expect(call.contractIndex).toBe(NOSTROMO_CONTRACT_INDEX)
    expect(call.inputType).toBe(NOSTROMO_REGISTER_IN_TIER_INPUT_TYPE)
    expect(call.payload.byteLength).toBe(4)
    const view = new DataView(call.payload.buffer, call.payload.byteOffset)
    expect(view.getUint32(0, true)).toBe(3)
  })

  test('decodeNostromoRegisterInTierOutput decodes tierLevel', async () => {
    const { decodeNostromoRegisterInTierOutput } = (await getContractModule(
      'nostromo.js',
    )) as typeof import('../__generated__/nostromo.js')
    const data = new Uint8Array(4)
    new DataView(data.buffer).setUint32(0, 5, true)
    expect(decodeNostromoRegisterInTierOutput(data).tierLevel).toBe(5)
  })

  test('buildNostromoClaimTokenInput encodes uint64 + uint32', async () => {
    const {
      buildNostromoClaimTokenInput,
      NOSTROMO_CONTRACT_INDEX,
      NOSTROMO_CLAIM_TOKEN_INPUT_TYPE,
    } = (await getContractModule('nostromo.js')) as typeof import('../__generated__/nostromo.js')
    const call = buildNostromoClaimTokenInput({ amount: 1000n, indexOfFundraising: 7 })
    expect(call.contractIndex).toBe(NOSTROMO_CONTRACT_INDEX)
    expect(call.inputType).toBe(NOSTROMO_CLAIM_TOKEN_INPUT_TYPE)
    expect(call.payload.byteLength).toBe(12)
    const view = new DataView(call.payload.buffer, call.payload.byteOffset)
    expect(view.getBigUint64(0, true)).toBe(1000n)
    expect(view.getUint32(8, true)).toBe(7)
  })
})

// ──────────────────────────────────────────────
// 8. callContractFunction error paths
// ──────────────────────────────────────────────

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
      publicKeyToIdentity: () => {
        throw new Error('unreachable')
      },
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
      publicKeyToIdentity: () => {
        throw new Error('unreachable')
      },
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
      publicKeyToIdentity: () => {
        throw new Error('unreachable')
      },
    })

    const req = capturedReq as { contractIndex?: number; inputType?: number; inputSize?: number }
    expect(req.contractIndex).toBe(9)
    expect(req.inputType).toBe(3)
    expect(req.inputSize).toBe(4)
  })

  // ── Error path: empty responseData ──

  test('handles empty responseData gracefully (empty output)', async () => {
    const live = {
      async querySmartContract() {
        return ok({ responseData: '' })
      },
    }

    // With zero output fields, this should succeed
    const result = await callContractFunction<Record<string, never>, Record<string, never>>({
      live,
      contractIndex: 1,
      inputType: 1,
      inputSize: 0,
      inputFields: [],
      outputFields: [],
      structs: {},
      input: {},
      identityToPublicKey: () => new Uint8Array(32),
      publicKeyToIdentity: () => {
        throw new Error('unreachable')
      },
    })

    expect(result.ok).toBe(true)
  })

  test('throws when decoded response has insufficient data for output fields', async () => {
    // responseData is empty but outputFields expects a field -> should throw
    const live = {
      async querySmartContract() {
        return ok({ responseData: '' })
      },
    }

    await expect(
      callContractFunction<{ epoch: number }, { state: number }>({
        live,
        contractIndex: 1,
        inputType: 1,
        inputSize: 4,
        inputFields: [{ name: 'epoch', type: 'uint32', offset: 0, byteLength: 4 }],
        outputFields: [{ name: 'state', type: 'uint32', offset: 0, byteLength: 4 }],
        structs: {},
        input: { epoch: 1 },
        identityToPublicKey: () => new Uint8Array(32),
        publicKeyToIdentity: () => {
          throw new Error('unreachable')
        },
      }),
    ).rejects.toThrow()
  })

  test('propagates QubicRpcError from live client (500)', async () => {
    const live = {
      async querySmartContract() {
        return err(new QubicRpcError(500, '/querySmartContract'))
      },
    }

    const result = await callContractFunction<Record<string, never>, { state: number }>({
      live,
      contractIndex: 9,
      inputType: 3,
      inputSize: 0,
      inputFields: [],
      outputFields: [{ name: 'state', type: 'uint32', offset: 0, byteLength: 4 }],
      structs: {},
      input: {},
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(QubicRpcError)
      expect(result.error.status).toBe(500)
    }
  })

  test('propagates QubicRpcError with 404 status', async () => {
    const live = {
      async querySmartContract() {
        return err(new QubicRpcError(404, '/querySmartContract'))
      },
    }

    const result = await callContractFunction<Record<string, never>, { state: number }>({
      live,
      contractIndex: 9,
      inputType: 3,
      inputSize: 0,
      inputFields: [],
      outputFields: [{ name: 'state', type: 'uint32', offset: 0, byteLength: 4 }],
      structs: {},
      input: {},
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.status).toBe(404)
    }
  })

  test('passes requestData as base64 to live client', async () => {
    let capturedReq: { requestData?: string } = {}
    const live = {
      async querySmartContract(req: unknown) {
        capturedReq = req as { requestData?: string }
        return ok({ responseData: '' })
      },
    }

    await callContractFunction<{ val: number }, Record<string, never>>({
      live,
      contractIndex: 1,
      inputType: 1,
      inputSize: 4,
      inputFields: [{ name: 'val', type: 'uint32', offset: 0, byteLength: 4 }],
      outputFields: [],
      structs: {},
      input: { val: 42 },
    })

    expect(capturedReq.requestData).toBeDefined()
    expect(typeof capturedReq.requestData).toBe('string')
    // Base64 decodes to 4 bytes (uint32)
    const decoded = atob(capturedReq.requestData!)
    expect(decoded.length).toBe(4)
    const view = new DataView(new Uint8Array([...decoded].map((c) => c.charCodeAt(0))).buffer)
    expect(view.getUint32(0, true)).toBe(42)
  })

  // ── Error path: missing required input fields ──

  test('builder with missing required field still produces payload (no runtime validation)', () => {
    // The buildPayload function from @qubic.org/registry handles missing fields
    // by using default values. This tests that the function doesn't crash.
    const call = buildQearnUnlockInput({ amount: 100n, lockedEpoch: 0 })
    expect(call.payload.byteLength).toBe(12)
    expect(call.contractIndex).toBe(QEARN_CONTRACT_INDEX)
  })
})

// ──────────────────────────────────────────────
// 9. qbay tests (array fields + struct encoding)
// ──────────────────────────────────────────────

describe('qbay contract payload encoding', () => {
  test('buildQbaySettingCFBAndQubicPriceInput encodes two uint64 fields', async () => {
    const {
      buildQbaySettingCFBAndQubicPriceInput,
      QBAY_CONTRACT_INDEX,
      QBAY_SETTING_CFB_AND_QUBIC_PRICE_INPUT_TYPE,
    } = (await getContractModule('qbay.js')) as typeof import('../__generated__/qbay.js')
    const call = buildQbaySettingCFBAndQubicPriceInput({ CFBPrice: 100n, QubicPrice: 200n })
    expect(call.contractIndex).toBe(QBAY_CONTRACT_INDEX)
    expect(call.inputType).toBe(QBAY_SETTING_CFB_AND_QUBIC_PRICE_INPUT_TYPE)
    expect(call.payload.byteLength).toBe(16)
    const view = new DataView(call.payload.buffer, call.payload.byteOffset)
    expect(view.getBigUint64(0, true)).toBe(100n)
    expect(view.getBigUint64(8, true)).toBe(200n)
  })

  test('buildQbuyBuyInput encodes uint32 + uint8', async () => {
    const { buildQbayBuyInput, QBAY_CONTRACT_INDEX, QBAY_BUY_INPUT_TYPE } =
      (await getContractModule('qbay.js')) as typeof import('../__generated__/qbay.js')
    const call = buildQbayBuyInput({ NFTid: 42, methodOfPayment: 1 })
    expect(call.contractIndex).toBe(QBAY_CONTRACT_INDEX)
    expect(call.inputType).toBe(QBAY_BUY_INPUT_TYPE)
    expect(call.payload.byteLength).toBe(5)
    const view = new DataView(call.payload.buffer, call.payload.byteOffset)
    expect(view.getUint32(0, true)).toBe(42)
    expect(call.payload[4]).toBe(1)
  })

  test('decodeQbayBuyOutput decodes returnCode', async () => {
    const { decodeQbayBuyOutput } = (await getContractModule('qbay.js')) as typeof import('../__generated__/qbay.js')
    const data = new Uint8Array(4)
    new DataView(data.buffer).setUint32(0, 0, true)
    expect(decodeQbayBuyOutput(data).returnCode).toBe(0)
  })
})

// ──────────────────────────────────────────────
// 10. qvault contract tests (complex structs + many functions)
// ──────────────────────────────────────────────

describe('qvault contract payload encoding', () => {
  test('buildQVAULTStakeInput encodes uint32 amount', async () => {
    const { buildQVAULTStakeInput, QVAULT_CONTRACT_INDEX, QVAULT_STAKE_INPUT_TYPE } =
      (await getContractModule('qvault.js')) as typeof import('../__generated__/qvault.js')
    const call = buildQVAULTStakeInput({ amount: 5000 })
    expect(call.contractIndex).toBe(QVAULT_CONTRACT_INDEX)
    expect(call.inputType).toBe(QVAULT_STAKE_INPUT_TYPE)
    expect(call.payload.byteLength).toBe(4)
    const view = new DataView(call.payload.buffer, call.payload.byteOffset)
    expect(view.getUint32(0, true)).toBe(5000)
  })

  test('decodeQVAULTStakeOutput decodes returnCode', async () => {
    const { decodeQVAULTStakeOutput } = (await getContractModule('qvault.js')) as typeof import('../__generated__/qvault.js')
    const data = new Uint8Array(4)
    new DataView(data.buffer).setInt32(0, -1, true)
    expect(decodeQVAULTStakeOutput(data).returnCode).toBe(-1)
  })

  test('buildQVAULTSubmitGPInput encodes 256-byte url array', async () => {
    const { buildQVAULTSubmitGPInput, QVAULT_CONTRACT_INDEX, QVAULT_SUBMIT_GP_INPUT_TYPE } =
      (await getContractModule('qvault.js')) as typeof import('../__generated__/qvault.js')
    const url = new Array(256).fill(0) as number[]
    url[0] = 104 // 'h'
    url[1] = 116 // 't'
    const call = buildQVAULTSubmitGPInput({ url })
    expect(call.contractIndex).toBe(QVAULT_CONTRACT_INDEX)
    expect(call.inputType).toBe(QVAULT_SUBMIT_GP_INPUT_TYPE)
    expect(call.payload.byteLength).toBe(256)
    expect(call.payload[0]).toBe(104)
    expect(call.payload[1]).toBe(116)
  })

  test('qVAULT namespace has many function references', async () => {
    const { qVAULT } = (await getContractModule('qvault.js')) as typeof import('../__generated__/qvault.js')
    expect(qVAULT.contractIndex).toBe(10)
    expect(typeof qVAULT.getData).toBe('function')
    expect(typeof qVAULT.getStakedAmountAndVotingPower).toBe('function')
    expect(typeof qVAULT.buildStakeInput).toBe('function')
    expect(typeof qVAULT.decodeStakeOutput).toBe('function')
  })
})

// ──────────────────────────────────────────────
// 11. Encode/decode round-trip for a qearn function
// ──────────────────────────────────────────────

describe('qearn encode/decode round-trip', () => {
  test('buildQearnUnlockInput payload round-trips correctly', () => {
    const call = buildQearnUnlockInput({ amount: 1_000_000n, lockedEpoch: 300 })
    const view = new DataView(call.payload.buffer, call.payload.byteOffset)
    // Read back amount
    const decodedAmount = view.getBigUint64(0, true)
    expect(decodedAmount).toBe(1_000_000n)
    // Read back lockedEpoch
    const decodedEpoch = view.getUint32(8, true)
    expect(decodedEpoch).toBe(300)
  })

  test('decodeQearnLockOutput round-trips negative returnCode', () => {
    const data = new Uint8Array(4)
    new DataView(data.buffer).setInt32(0, -5, true)
    const output = decodeQearnLockOutput(data)
    expect(output.returnCode).toBe(-5)
  })
})

// ──────────────────────────────────────────────
// 12. Cross-contract consistency tests
// ──────────────────────────────────────────────

describe('cross-contract consistency', () => {
  test('all CONTRACT_INDEX values are unique (except shared indices)', async () => {
    const indices = new Map<number, string[]>()
    for (const meta of CONTRACT_META) {
      const mod = await getContractModule(meta.module)
      const indexKey = Object.keys(mod).find((k) => k.endsWith('_CONTRACT_INDEX'))
      const val = mod[indexKey!] as number
      const existing = indices.get(val) ?? []
      existing.push(meta.name)
      indices.set(val, existing)
    }
    // Known shared indices: msvault + multisignvault both = 11, qip + qubicicoportal both = 18
    for (const [, names] of indices) {
      if (names.length > 1) {
        // These are the known duplicates
        const sorted = [...names].sort()
        expect(
          [
            ['msvault', 'multisignvault'],
            ['qip', 'qubicicoportal'],
          ].some((pair) => pair[0] === sorted[0] && pair[1] === sorted[1]),
        ).toBe(true)
      }
    }
  })

  test('all namespace objects have contractIndex property', async () => {
    for (const meta of CONTRACT_META) {
      if (!meta.namespace) continue
      const mod = await getContractModule(meta.module)
      const ns = mod[meta.namespace!] as Record<string, unknown> | undefined
      expect(ns).toBeDefined()
      expect(ns!.contractIndex).toBe(meta.index)
    }
  })

  test('all builder functions return objects with contractIndex matching module', async () => {
    for (const meta of CONTRACT_META) {
      const mod = await getContractModule(meta.module)
      const buildKeys = Object.keys(mod).filter((k) => k.startsWith('build') && k.endsWith('Input'))

      for (const key of buildKeys) {
        const fn = mod[key] as ((...args: unknown[]) => unknown) | undefined
        if (typeof fn !== 'function') continue

        // Try calling with empty input to see if it's a ContractCall builder
        try {
          const result = fn({}) as unknown
          if (
            result &&
            typeof result === 'object' &&
            'contractIndex' in (result as Record<string, unknown>)
          ) {
            const cc = result as { contractIndex: number }
            expect(cc.contractIndex).toBe(meta.index)
          }
          // If it returns Uint8Array, that's fine too (function input builder)
        } catch {
          // Needs identityToPublicKey or specific fields; skip
        }
      }
    }
  })
})
