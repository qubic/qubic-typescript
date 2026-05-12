export class BinaryWriter {
  private readonly buf: Uint8Array
  private readonly view: DataView
  private offset = 0

  constructor(size: number) {
    this.buf = new Uint8Array(size)
    this.view = new DataView(this.buf.buffer)
  }

  writeUint8(v: number): void {
    this.view.setUint8(this.offset, v)
    this.offset += 1
  }

  writeUint16(v: number): void {
    this.view.setUint16(this.offset, v, true)
    this.offset += 2
  }

  writeUint32(v: number): void {
    this.view.setUint32(this.offset, v, true)
    this.offset += 4
  }

  writeInt64(v: bigint): void {
    this.view.setBigInt64(this.offset, v, true)
    this.offset += 8
  }

  writeUint64(v: bigint): void {
    this.view.setBigUint64(this.offset, v, true)
    this.offset += 8
  }

  writeBytes(v: Uint8Array): void {
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
