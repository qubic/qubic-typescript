import type { ReactNode } from 'react'

type TokType = 'kw' | 'str' | 'tpl' | 'num' | 'cmt' | 'fn' | 'type' | 'prop' | 'op' | 'plain'

interface Token {
  type: TokType
  value: string
  pos: number
}

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'const',
  'let',
  'var',
  'function',
  'async',
  'await',
  'return',
  'if',
  'else',
  'throw',
  'new',
  'as',
  'type',
  'typeof',
  'instanceof',
  'in',
  'of',
  'for',
  'while',
  'try',
  'catch',
  'finally',
  'true',
  'false',
  'null',
  'undefined',
  'void',
  'class',
  'extends',
])

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < code.length) {
    const pos = i

    // Line comment
    if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i)
      const value = end === -1 ? code.slice(i) : code.slice(i, end)
      tokens.push({ type: 'cmt', value, pos })
      i += value.length
      continue
    }

    // Template literal
    if (code[i] === '`') {
      let j = i + 1
      while (j < code.length && code[j] !== '`') {
        if (code[j] === '\\') j++
        j++
      }
      tokens.push({ type: 'tpl', value: code.slice(i, j + 1), pos })
      i = j + 1
      continue
    }

    // Single or double quoted string
    if (code[i] === "'" || code[i] === '"') {
      const q = code[i]
      let j = i + 1
      while (j < code.length && code[j] !== q) {
        if (code[j] === '\\') j++
        j++
      }
      tokens.push({ type: 'str', value: code.slice(i, j + 1), pos })
      i = j + 1
      continue
    }

    // Number / bigint
    if (/[0-9]/.test(code[i])) {
      let j = i
      while (j < code.length && /[0-9_.]/.test(code[j])) j++
      if (code[j] === 'n') j++
      tokens.push({ type: 'num', value: code.slice(i, j), pos })
      i = j
      continue
    }

    // Identifier or keyword
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++
      const word = code.slice(i, j)

      let type: TokType
      if (KEYWORDS.has(word)) {
        type = 'kw'
      } else if (code[j] === '(') {
        type = 'fn'
      } else if (/^[A-Z]/.test(word)) {
        type = 'type'
      } else {
        type = 'plain'
      }

      tokens.push({ type, value: word, pos })
      i = j
      continue
    }

    // Property access: .identifier
    if (code[i] === '.' && /[a-zA-Z_$]/.test(code[i + 1] ?? '')) {
      let j = i + 1
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++
      const word = code.slice(i + 1, j)
      const type: TokType = code[j] === '(' ? 'fn' : 'prop'
      tokens.push({ type: 'op', value: '.', pos: i })
      tokens.push({ type, value: word, pos: i + 1 })
      i = j
      continue
    }

    tokens.push({ type: 'plain', value: code[i], pos })
    i++
  }

  return tokens
}

const CLASS: Record<TokType, string> = {
  kw: 'tok-kw',
  str: 'tok-s',
  tpl: 'tok-tpl',
  num: 'tok-n',
  cmt: 'tok-c',
  fn: 'tok-fn',
  type: 'tok-type',
  prop: 'tok-prop',
  op: 'tok-op',
  plain: '',
}

export function TsHighlight({ code }: { code: string }): ReactNode {
  const tokens = tokenize(code)
  return (
    <>
      {tokens.map((tok) =>
        tok.type === 'plain' ? (
          tok.value
        ) : (
          <span key={tok.pos} className={CLASS[tok.type]}>
            {tok.value}
          </span>
        ),
      )}
    </>
  )
}
