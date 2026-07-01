import { useMemo, useState } from 'react'
import type { DraftTier, Tier } from './types'
import { evalMath, isInfinityTrigger } from './math'
import { fromDrafts, toDraft } from './format'
import { hasErrors, validateDrafts } from './validate'

const STORAGE_KEY = 'lead-prototypes:premium-tiers:v3'

/** Blank by default — mirrors a fresh product setup. */
const SEED: Tier[] = []

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
 * cross-row validation, and add / remove / update / commit operations. Low
 * bounds are always derived, so ranges stay contiguous and non-overlapping.
 */
export function useTiers() {
  const [tiers, setTiers] = useState<Tier[]>(load)
  const [draft, setDraft] = useState<DraftTier[] | null>(null)
  // Fields the user has committed (blurred) at least once — keyed `${id}:${field}`.
  // Until then a fresh field reads as "new" (blue) rather than an error (red).
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const editing = draft !== null

  const errors = useMemo(() => (draft ? validateDrafts(draft) : []), [draft])
  const isValid = errors.every((e) => !hasErrors(e))
  const revealedError = !!draft?.some(
    (d, i) =>
      (errors[i].high && touched[`${d.id}:high`]) ||
      (errors[i].premium && touched[`${d.id}:premium`]),
  )

  const startEdit = () => {
    setTouched({})
    setDraft(tiers.map(toDraft))
  }
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

  /** On blur/Enter: mark the field touched (so an empty one now reads as an
   *  error), turn an infinity trigger into ∞ (last tier), then fold the math
   *  expression down to its result. Invalid input is left as typed. */
  const commitField = (id: string, field: 'high' | 'premium') => {
    setTouched((t) => ({ ...t, [`${id}:${field}`]: true }))
    setDraft((d) => {
      if (!d) return d
      const i = d.findIndex((r) => r.id === id)
      if (i === -1) return d
      const row = d[i]
      const next = [...d]

      if (field === 'high' && isInfinityTrigger(row.high)) {
        if (i !== d.length - 1) return d // only the last tier can be unbounded
        next[i] = { ...row, unbounded: true, high: '' }
        return next
      }

      const value = evalMath(row[field])
      if (value === null) return d
      next[i] = { ...row, [field]: String(value) }
      return next
    })
  }

  const setUnbounded = (id: string, unbounded: boolean) =>
    setDraft((d) => d && normalize(d.map((r) => (r.id === id ? { ...r, unbounded } : r))))

  const addEnd = () =>
    setDraft((d) => {
      const rows = d ?? []
      const last = rows[rows.length - 1]
      return normalize([...rows, blankDraft(last?.unbounded ?? false)])
    })

  const remove = (id: string) => setDraft((d) => d && normalize(d.filter((r) => r.id !== id)))

  return {
    tiers,
    draft,
    editing,
    errors,
    touched,
    isValid,
    revealedError,
    startEdit,
    cancel,
    save,
    updateField,
    commitField,
    setUnbounded,
    addEnd,
    remove,
  }
}
