import { evalMath } from './math'
import type { DraftTier, Tier } from './types'

/** Whole-dollar currency with a space after the symbol, e.g. "$ 20,000,000". */
export const formatCurrency = (n: number): string =>
  `$ ${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
export const formatHigh = (n: number | null): string => (n === null ? '∞' : formatCurrency(n))
/** Derived low: em dash when it can't be computed yet (previous high blank/invalid). */
export const formatLow = (n: number): string => (Number.isNaN(n) ? '—' : formatCurrency(n))

/** Decimal fraction -> percentage string, e.g. 0.13 -> "13.0%". */
export const formatPercent = (decimal: number): string => `${(decimal * 100).toFixed(1)}%`

/** Allow digits, math operators, parentheses, a dot, and spaces. */
export const sanitizeMath = (s: string): string => s.replace(/[^0-9.+\-*/() ]/g, '')
/** Same as math, plus letters and ∞ so the infinity trigger ("inf") can be typed. */
export const sanitizeHigh = (s: string): string => s.replace(/[^0-9.+\-*/()∞a-zA-Z ]/g, '')

/**
 * Derived low bound: tier 0 starts at 0; every other tier starts one dollar
 * above the previous tier's high (evaluating any math expression). NaN when it
 * can't be computed yet.
 */
export const deriveLows = (drafts: DraftTier[]): number[] =>
  drafts.map((_, i) => {
    if (i === 0) return 0
    const prev = drafts[i - 1]
    if (prev.unbounded) return NaN
    const v = evalMath(prev.high)
    return v === null ? NaN : v + 1
  })

/** Stored tier -> editable draft. */
export const toDraft = (t: Tier): DraftTier => ({
  id: t.id,
  high: t.high === null ? '' : String(t.high),
  premium: String(+(t.premium * 100).toFixed(4)),
  unbounded: t.high === null,
})

/** Editable drafts -> stored tiers, recomputing each contiguous low bound. */
export const fromDrafts = (drafts: DraftTier[]): Tier[] => {
  const tiers: Tier[] = []
  drafts.forEach((d, i) => {
    const low = i === 0 ? 0 : (tiers[i - 1].high ?? 0) + 1
    tiers.push({
      id: d.id,
      low,
      high: d.unbounded ? null : (evalMath(d.high) ?? 0),
      premium: (evalMath(d.premium) ?? 0) / 100,
    })
  })
  return tiers
}
