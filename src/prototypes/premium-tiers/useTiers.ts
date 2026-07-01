import { useMemo, useState } from 'react'
import type { DraftTier, Tier } from './types'
import { fromDrafts, toDraft } from './format'
import { hasErrors, validateDrafts } from './validate'

const STORAGE_KEY = 'lead-prototypes:premium-tiers:v2'

/** Seed data: contiguous, non-overlapping tiers with an unbounded top tier. */
const SEED: Tier[] = [
  { id: 't1', low: 0, high: 20_000_000, premium: 0.13 },
  { id: 't2', low: 20_000_001, high: 50_000_000, premium: 0.11 },
  { id: 't3', low: 50_000_001, high: 100_000_000, premium: 0.11 },
  { id: 't4', low: 100_000_001, high: 200_000_000, premium: 0.11 },
  { id: 't5', low: 200_000_001, high: null, premium: 0.11 },
]

function load(): Tier[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Tier[]) : SEED
  } catch {
    return SEED
  }
}

const blankDraft = (unbounded = false): DraftTier => ({
  id: crypto.randomUUID(),
  high: '',
  premium: '',
  unbounded,
})

/** Enforce the invariant that only the last tier may be unbounded. */
const normalize = (drafts: DraftTier[]): DraftTier[] =>
  drafts.map((d, i) => (i < drafts.length - 1 && d.unbounded ? { ...d, unbounded: false } : d))

/**
 * Owns the Premium Tiers state: the persisted table, the edit-mode draft,
 * cross-row validation, and add / remove / update operations. Low bounds are
 * always derived, so ranges stay contiguous and non-overlapping by construction.
 */
export function useTiers() {
  const [tiers, setTiers] = useState<Tier[]>(load)
  const [draft, setDraft] = useState<DraftTier[] | null>(null)
  const editing = draft !== null

  const errors = useMemo(() => (draft ? validateDrafts(draft) : []), [draft])
  const isValid = errors.every((e) => !hasErrors(e))

  const startEdit = () => setDraft(tiers.map(toDraft))
  const cancel = () => setDraft(null)

  const save = () => {
    if (!draft || !isValid) return
    const next = fromDrafts(draft)
    setTiers(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable — keep the in-memory copy */
    }
    setDraft(null)
  }

  const updateField = (id: string, field: 'high' | 'premium', value: string) =>
    setDraft((d) => d && d.map((r) => (r.id === id ? { ...r, [field]: value } : r)))

  const setUnbounded = (id: string, unbounded: boolean) =>
    setDraft((d) => d && normalize(d.map((r) => (r.id === id ? { ...r, unbounded } : r))))

  const insertAt = (index: number, inheritFrom?: DraftTier) =>
    setDraft((d) => {
      if (!d) return d
      const next = [...d]
      next.splice(index, 0, blankDraft(inheritFrom?.unbounded ?? false))
      return normalize(next)
    })

  const addAbove = (id: string) => insertAt(draft!.findIndex((r) => r.id === id))
  const addBelow = (id: string) => {
    const i = draft!.findIndex((r) => r.id === id)
    // Adding below the last tier hands the unbounded (∞) top to the new last row.
    insertAt(i + 1, i === draft!.length - 1 ? draft![i] : undefined)
  }
  const addEnd = () => insertAt(draft!.length, draft![draft!.length - 1])
  const remove = (id: string) => setDraft((d) => d && normalize(d.filter((r) => r.id !== id)))

  return {
    tiers,
    draft,
    editing,
    errors,
    isValid,
    startEdit,
    cancel,
    save,
    updateField,
    setUnbounded,
    addAbove,
    addBelow,
    addEnd,
    remove,
  }
}
