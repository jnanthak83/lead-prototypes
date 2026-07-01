import type { DraftTier, Tier } from './types'

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const formatCurrency = (n: number): string => usd.format(n)
export const formatHigh = (n: number | null): string => (n === null ? '∞' : usd.format(n))
/** Derived low: shows an em dash when it can't be computed yet (previous high blank). */
export const formatLow = (n: number): string => (Number.isNaN(n) ? '—' : usd.format(n))

/** Decimal fraction -> percentage string, e.g. 0.13 -> "13.0%". */
export const formatPercent = (decimal: number): string => `${(decimal * 100).toFixed(1)}%`

/** Keep only digits — currency bounds are whole dollars, no letters allowed. */
export const sanitizeInteger = (s: string): string => s.replace(/[^0-9]/g, '')

/** Keep digits and a single decimal point — for percentage inputs (e.g. 12.5). */
export const sanitizeDecimal = (s: string): string => {
  const cleaned = s.replace(/[^0-9.]/g, '')
  const [whole, ...rest] = cleaned.split('.')
  return rest.length ? `${whole}.${rest.join('')}` : cleaned
}

/**
 * The low bound of each tier is derived, never edited: tier 0 starts at 0, and
 * every other tier starts one dollar above the previous tier's high. Returns
 * NaN where it can't be computed (previous high blank or unbounded).
 */
export const deriveLows = (drafts: DraftTier[]): number[] =>
  drafts.map((_, i) => {
    if (i === 0) return 0
    const prev = drafts[i - 1]
    if (prev.unbounded || prev.high.trim() === '') return NaN
    const prevHigh = Number(prev.high)
    return Number.isNaN(prevHigh) ? NaN : prevHigh + 1
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
      high: d.unbounded ? null : Number(d.high),
      premium: Number(d.premium) / 100,
    })
  })
  return tiers
}
