export function zeroize(data: Uint8Array): void {
  data.fill(0)
}

export function zeroizeString(str: string): void {
  // Strings are immutable in JS, cannot be zeroized
  // This is a placeholder for documentation purposes
  // In practice, ensure sensitive strings are not stored longer than needed
}