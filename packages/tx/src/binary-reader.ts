export class BinaryReader {
  private readonly view: DataView
  private offset = 0

  constructor(private readonly bytes: Uint8Array) {
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  }

  readUint8(): number {
    const v = this.view.getUint8(this.offset)
    this.offset += 1
    return v
  }

  readUint16(): number {
    const v = this.view.getUint16(this.offset, true)
    this.offset += 2
    return v
  }

  readUint32(): number {
    const v = this.view.getUint32(this.offset, true)
    this.offset += 4
    return v
  }

  readInt64(): bigint {
    const v = this.view.getBigInt64(this.offset, true)
    this.offset += 8
    return v
  }

  readUint64(): bigint {
    const v = this.view.getBigUint64(this.offset, true)
    this.offset += 8
    return v
  }

  readBytes(n: number): Uint8Array {
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
