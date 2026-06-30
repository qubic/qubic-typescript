export function detectVersion(data: Uint8Array): number {
  // v3: first byte is 0x03 and total length >= 61
  if (data[0] === 0x03 && data.length >= 61) return 3

  // v1: valid JSON with salt, iv, cipher fields
  try {
    const json = JSON.parse(new TextDecoder().decode(data))
    if (json.salt && json.iv && json.cipher) return 1
  } catch {}

  throw new Error('Unknown vault format')
}