import type { DraftTier, TierErrors } from './types'

/**
 * Validate one draft row: numbers only, required fields present, high >= low.
 * (Letters are already stripped at the input, so this mostly catches blanks
 * and an upper bound that sits below the lower bound.)
 */
export function validateDraft(d: DraftTier): TierErrors {
  const errors: TierErrors = {}
  const low = Number(d.low)
  const high = d.high.trim() === '' ? null : Number(d.high)
  const premium = Number(d.premium)

  if (d.low.trim() === '' || Number.isNaN(low)) {
    errors.low = 'Enter a number'
  }

  if (d.high.trim() !== '' && Number.isNaN(high)) {
    errors.high = 'Enter a number'
  } else if (high !== null && !Number.isNaN(low) && high < low) {
    errors.high = 'Must be ≥ low'
  }

  if (d.premium.trim() === '' || Number.isNaN(premium)) {
    errors.premium = 'Enter a number'
  }

  return errors
}

export const hasErrors = (e: TierErrors): boolean => Object.keys(e).length > 0
