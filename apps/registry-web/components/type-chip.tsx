export function TypeChip({ type }: { type: string }) {
  const isArr = type.includes('[')
  const base = type.replace(/\[.*/, '')
  let cls = 'tchip'
  if (/^(uint|sint)/i.test(base)) cls += ' int'
  else if (base === 'id') cls += ' id'
  else if (base === 'bytes') cls += ' bytes'
  else if (base === 'array') cls += ' arr'
  else if (base === 'struct' || /^[A-Z]/.test(base)) cls += ' struct'
  if (isArr) cls += ' arr'
  return <span className={cls}>{type}</span>
}
