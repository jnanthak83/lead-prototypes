import type { DraftTier, Tier } from './types'

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const formatCurrency = (n: number): string => usd.format(n)
export const formatHigh = (n: number | null): string => (n === null ? '∞' : usd.format(n))

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

/** Stored tier -> editable draft (percent shown as its whole value, e.g. 13). */
export const toDraft = (t: Tier): DraftTier => ({
  id: t.id,
  low: String(t.low),
  high: t.high === null ? '' : String(t.high),
  premium: String(+(t.premium * 100).toFixed(4)),
})

/** Editable draft -> stored tier (percent divided back to a decimal fraction). */
export const fromDraft = (d: DraftTier): Tier => ({
  id: d.id,
  low: Number(d.low),
  high: d.high.trim() === '' ? null : Number(d.high),
  premium: Number(d.premium) / 100,
})
