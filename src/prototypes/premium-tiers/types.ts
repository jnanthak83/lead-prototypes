/** A pricing tier as stored/persisted. `low` is derived (previous tier's
 *  high + 1) and kept here for convenience; `high === null` means unbounded (∞). */
export interface Tier {
  id: string
  low: number
  high: number | null
  premium: number // decimal fraction, e.g. 0.13 == 13%
}

/** A tier while being edited. `low` is not edited — it is derived from the
 *  previous tier's high — so only `high`, `premium`, and the unbounded flag live here. */
export interface DraftTier {
  id: string
  high: string // whole-dollar amount as typed; ignored when `unbounded`
  premium: string // percentage value as typed, e.g. '13' or '12.5'
  unbounded: boolean // true == this (last) tier runs to ∞
}

export interface TierErrors {
  high?: string
  premium?: string
}
