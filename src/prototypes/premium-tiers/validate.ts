import { deriveLows, formatCurrency } from './format'
import { evalMath } from './math'
import type { DraftTier, TierErrors } from './types'

/**
 * Validate the whole draft. Lows are derived, so ranges never overlap; we just
 * need each high (or math expression) to resolve to a number greater than its
 * derived low, plus a resolvable premium. Only the last tier may be unbounded.
 */
export function validateDrafts(drafts: DraftTier[]): TierErrors[] {
  const lows = deriveLows(drafts)
  const lastIndex = drafts.length - 1

  return drafts.map((d, i) => {
    const errors: TierErrors = {}

    if (d.unbounded) {
      if (i !== lastIndex) errors.high = 'Only the last tier can be unbounded'
    } else {
      const high = evalMath(d.high)
      if (high === null) errors.high = 'Enter a number or math (e.g. 20000000+1)'
      else if (!Number.isNaN(lows[i]) && high <= lows[i]) {
        errors.high = `Must be greater than ${formatCurrency(lows[i])}`
      }
    }

    if (evalMath(d.premium) === null) errors.premium = 'Enter a number or math'

    return errors
  })
}

export const hasErrors = (e: TierErrors): boolean => Object.keys(e).length > 0

/** How a field should present: a fresh field is "new" (blue), it only turns
 *  "error" (red) once it's been touched while invalid. */
export type FieldStatus = 'valid' | 'new' | 'error'

export const fieldStatus = (message: string | undefined, touched: boolean): FieldStatus =>
  !message ? 'valid' : touched ? 'error' : 'new'
