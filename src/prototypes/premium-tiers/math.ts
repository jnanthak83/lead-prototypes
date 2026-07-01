/** Ways to type "unbounded" into the high field. `inf` is the recommended one. */
export const INFINITY_TRIGGERS = ['inf', 'infinity', '∞', '+++']

export const isInfinityTrigger = (s: string): boolean =>
  INFINITY_TRIGGERS.includes(s.trim().toLowerCase())

/**
 * Safely evaluate a basic arithmetic expression — `+ - * /`, parentheses,
 * decimals, and unary +/-. Returns null for anything invalid. No eval/Function,
 * so arbitrary code can't run: it's a tiny recursive-descent parser.
 */
export function evalMath(input: string): number | null {
  const parsed = tokenize(input.trim())
  if (!parsed || parsed.length === 0) return null
  const tokens: string[] = parsed

  let pos = 0
  const peek = () => tokens[pos]

  const parseFactor = (): number | null => {
    const t = peek()
    if (t === '+' || t === '-') {
      pos++
      const f = parseFactor()
      return f === null ? null : t === '-' ? -f : f
    }
    if (t === '(') {
      pos++
      const e = parseExpr()
      if (e === null || peek() !== ')') return null
      pos++
      return e
    }
    if (t !== undefined && /^[0-9.]+$/.test(t)) {
      pos++
      const n = Number(t)
      return Number.isFinite(n) ? n : null
    }
    return null
  }

  const parseTerm = (): number | null => {
    let left = parseFactor()
    if (left === null) return null
    while (peek() === '*' || peek() === '/') {
      const op = tokens[pos++]
      const right = parseFactor()
      if (right === null || (op === '/' && right === 0)) return null
      left = op === '*' ? left * right : left / right
    }
    return left
  }

  function parseExpr(): number | null {
    let left = parseTerm()
    if (left === null) return null
    while (peek() === '+' || peek() === '-') {
      const op = tokens[pos++]
      const right = parseTerm()
      if (right === null) return null
      left = op === '+' ? left + right : left - right
    }
    return left
  }

  const result = parseExpr()
  if (result === null || pos !== tokens.length) return null
  return Number.isFinite(result) ? result : null
}

function tokenize(s: string): string[] | null {
  const tokens: string[] = []
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (c === ' ') {
      i++
    } else if ('+-*/()'.includes(c)) {
      tokens.push(c)
      i++
    } else if (/[0-9.]/.test(c)) {
      let num = ''
      while (i < s.length && /[0-9.]/.test(s[i])) num += s[i++]
      if ((num.match(/\./g) || []).length > 1) return null
      tokens.push(num)
    } else {
      return null
    }
  }
  return tokens
}
