/**
 * @module fourq-constants
 * Precomputed constants for FourQ curve operations.
 * Ported from Cloudflare CIRCL ecc/fourq/tableBase.go and params.go.
 */
import type { FqElement } from './fq.js'

export const PARAM_D: FqElement = [
  0x00000000000000e40000000000000142n,
  0x5e472f846657e0fcb3821488f1fc0c8dn,
]

export const GENERATOR_X: FqElement = [
  0x1a3472237c2fb305286592ad7b3833aan,
  0x1e1f553f2878aa9c96869fb360ac77f6n,
]

export const GENERATOR_Y: FqElement = [
  0x0e3fee9ba120785ab924a2462bcbb287n,
  0x6e1c4af8630e024249a7c344844c8b5cn,
]

interface PointR3Const {
  addYX: FqElement
  subYX: FqElement
  dt2: FqElement
}

export const TABLE_BASE_FIXED: PointR3Const[][] = [
  [
    {
      addYX: [0x287460bf1d502b5fe18a34f3a703e631n, 0xc3ba0378b86acdee02e62f7e4f90353n],
      subYX: [0x740b7c7824f0c55590bf0f98b0937edcn, 0x4ffcf5b93a9557a5b321239123a01366n],
      dt2: [0x5948d137556c97c6297afccbabda42bbn, 0xcaf2b720a341f27a8189a393330684cn],
    },
    {
      addYX: [0x3276a7efa06f2a5a5f8bf22ecf5d236an, 0x4bc4d555e631bc6adf43c4601a0bad57n],
      subYX: [0x642993a9036564cafe138c55d2bfabf7n, 0x68a16f2511774122bc0e5ab117dd9bb5n],
      dt2: [0x16a823058d2c5fc4c84e31a114fe76b6n, 0x7d9aeb6d062c717a5a220ad7976d459dn],
    },
    {
      addYX: [0x39f066fadcc10a402b9a137feb696b46n, 0x554f5af8e07f1dbdc6b3650e0ad99c77n],
      subYX: [0x7a2749fdeb6b0e8e6263c5d009b588c1n, 0x5b4d68949f4bda2fe45e1705065e388cn],
      dt2: [0x533fef2fe69ec7fab40c26083ff3846fn, 0x6d911a0bbe4903944ecd2e9d8871d147n],
    },
    {
      addYX: [0x26eb757cadba3df2da8c3969993b9b73n, 0x1862002a6004253313f310a4a9e65618n],
      subYX: [0x38f43d45210cd95fb4dad1ceca87cd6dn, 0x6e578fcdf2aaf8c713305764a603e5c1n],
      dt2: [0x7cd06f90dde0e0a920a024d613cb0205n, 0x41f6e2ce824cc0e1f58ea45b145991fcn],
    },
  ],
  [
    {
      addYX: [0x212ef31b0afce88cdb367fb0c2b83160n, 0x42ccdb67f226e61020e547fcf0d9895en],
      subYX: [0x6dfe7428439997739e40a31512ad3b0en, 0x5fee892113364a1b4f70aff5e8689392n],
      dt2: [0x7fc240be5f7f49008299a4f7c753c541n, 0x7754524b01f436ff4ceec76e40e322a6n],
    },
    {
      addYX: [0x1dd8894d2ff22e59f9dfbbbc56ef5835n, 0x12a82b3346f58ece3a243989dee6de6cn],
      subYX: [0x79bf95235eb7ee6e087daf06b1417260n, 0x255e48104bb45db9be9496733adc4234n],
      dt2: [0xdba68eeab5c4d9f14f49d9038f4ff44n, 0xd82fad35112891fe87b152091e59545n],
    },
    {
      addYX: [0x416eb31a7729cc262d4f287633f8a30cn, 0x4d80a91c5804e05cd12f5d265d87c8efn],
      subYX: [0x7d0a22fa4cfb2acdfac576e44206ff0an, 0xea1d1242b9a429b30ae8636d895cd9n],
      dt2: [0x11dde37af1bfa110411132db409d59b3n, 0x6ae77fb282b15196d295d51c985ccc2cn],
    },
    {
      addYX: [0x52d07032b0c27c43d79ff2eb83b9e907n, 0x225a1a9773876ce9759f9a7a318270f9n],
      subYX: [0x5341603522347eb7f5d1f6dc98e53b0bn, 0x28012982582633bd93e76bb56ccf41fn],
      dt2: [0x3b2a634a0bd405416e5d61707a9adcebn, 0x35c81bc1eb1cf8552db08a3fb1e052abn],
    },
  ],
]
