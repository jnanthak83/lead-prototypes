import { deriveLows, formatCurrency } from './format'
import type { DraftTier, TierErrors } from './types'

/**
 * Validate the whole draft at once. Because each low is derived from the
 * previous high, ranges can never overlap; we only need each high to be a
 * number greater than its (derived) low, plus a numeric premium. Only the last
 * tier may be unbounded.
 */
export function validateDrafts(drafts: DraftTier[]): TierErrors[] {
  const lows = deriveLows(drafts)
  const lastIndex = drafts.length - 1

  return drafts.map((d, i) => {
    const errors: TierErrors = {}

    if (d.unbounded) {
      if (i !== lastIndex) errors.high = 'Only the last tier can be unbounded'
    } else if (d.high.trim() === '' || Number.isNaN(Number(d.high))) {
      errors.high = 'Enter a number'
    } else if (!Number.isNaN(lows[i]) && Number(d.high) <= lows[i]) {
      errors.high = `Must be greater than ${formatCurrency(lows[i])}`
    }

    if (d.premium.trim() === '' || Number.isNaN(Number(d.premium))) {
      errors.premium = 'Enter a number'
    }

    return errors
  })
}

export const hasErrors = (e: TierErrors): boolean => Object.keys(e).length > 0
