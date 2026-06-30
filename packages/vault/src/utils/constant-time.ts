export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    const aVal = a[i]
    const bVal = b[i]
    if (aVal === undefined || bVal === undefined) return false
    result |= aVal ^ bVal
  }
  return result === 0
}