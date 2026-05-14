export class BinaryReader {
  private readonly view: DataView
  private offset = 0

  constructor(private readonly bytes: Uint8Array) {
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  }

  private require(n: number): void {
    if (this.offset + n > this.bytes.byteLength)
      throw new RangeError(
        `BinaryReader: need ${n} byte(s) at offset ${this.offset}, only ${this.remaining} remaining`,
      )
  }

  readUint8(): number {
    this.require(1)
    const v = this.view.getUint8(this.offset)
    this.offset += 1
    return v
  }

  readUint16(): number {
    this.require(2)
    const v = this.view.getUint16(this.offset, true)
    this.offset += 2
    return v
  }

  readUint32(): number {
    this.require(4)
    const v = this.view.getUint32(this.offset, true)
    this.offset += 4
    return v
  }

  readInt64(): bigint {
    this.require(8)
    const v = this.view.getBigInt64(this.offset, true)
    this.offset += 8
    return v
  }

  readUint64(): bigint {
    this.require(8)
    const v = this.view.getBigUint64(this.offset, true)
    this.offset += 8
    return v
  }

  readBytes(n: number): Uint8Array {
    this.require(n)
    const slice = this.bytes.slice(this.offset, this.offset + n)
    this.offset += n
    return slice
  }

  get bytesRead(): number {
    return this.offset
  }

  get remaining(): number {
    return this.bytes.byteLength - this.offset
  }
}
