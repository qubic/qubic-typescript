export class BinaryWriter {
  private readonly buf: Uint8Array
  private readonly view: DataView
  private offset = 0

  constructor(size: number) {
    this.buf = new Uint8Array(size)
    this.view = new DataView(this.buf.buffer)
  }

  private require(n: number): void {
    if (this.offset + n > this.buf.byteLength)
      throw new RangeError(
        `BinaryWriter: need ${n} byte(s) at offset ${this.offset}, only ${this.buf.byteLength - this.offset} remaining`,
      )
  }

  writeUint8(v: number): void {
    this.require(1)
    this.view.setUint8(this.offset, v)
    this.offset += 1
  }

  writeUint16(v: number): void {
    this.require(2)
    this.view.setUint16(this.offset, v, true)
    this.offset += 2
  }

  writeUint32(v: number): void {
    this.require(4)
    this.view.setUint32(this.offset, v, true)
    this.offset += 4
  }

  writeInt64(v: bigint): void {
    this.require(8)
    this.view.setBigInt64(this.offset, v, true)
    this.offset += 8
  }

  writeUint64(v: bigint): void {
    this.require(8)
    this.view.setBigUint64(this.offset, v, true)
    this.offset += 8
  }

  writeBytes(v: Uint8Array): void {
    this.require(v.byteLength)
    this.buf.set(v, this.offset)
    this.offset += v.byteLength
  }

  getBytes(): Uint8Array {
    return this.buf.slice(0, this.offset)
  }

  get bytesWritten(): number {
    return this.offset
  }
}
