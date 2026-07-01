/** A pricing tier as stored/persisted — numbers are the source of truth. */
export interface Tier {
  id: string
  low: number
  high: number | null // null = unbounded (∞)
  premium: number // decimal fraction, e.g. 0.13 == 13%
}

/** A tier while it is being edited — every field is the raw string in its input. */
export interface DraftTier {
  id: string
  low: string
  high: string // '' == unbounded (∞)
  premium: string // percentage value as typed, e.g. '13' or '12.5'
}

export interface TierErrors {
  low?: string
  high?: string
  premium?: string
}
