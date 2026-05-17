export function isValidIndex(v: unknown): v is number {
  return Number.isInteger(v) && (v as number) >= 0
}
