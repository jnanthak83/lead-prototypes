import { useMemo, useState } from 'react'
import type { DraftTier, Tier } from './types'
import { fromDraft, toDraft } from './format'
import { hasErrors, validateDraft } from './validate'

const STORAGE_KEY = 'lead-prototypes:premium-tiers'

/** Seed data mirrors the Figma design. */
const SEED: Tier[] = [
  { id: 't1', low: 0, high: 20_000_000, premium: 0.13 },
  { id: 't2', low: 20_000_001, high: 50_000_000, premium: 0.11 },
  { id: 't3', low: 50_000_001, high: 100_000_000, premium: 0.11 },
  { id: 't4', low: 100_000_001, high: 200_000_000, premium: 0.11 },
  { id: 't5', low: 20_000_001, high: null, premium: 0.11 },
]

function load(): Tier[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Tier[]) : SEED
  } catch {
    return SEED
  }
}

const blankDraft = (): DraftTier => ({ id: crypto.randomUUID(), low: '', high: '', premium: '' })

/**
 * Owns the Premium Tiers state: the persisted table, the edit-mode draft,
 * per-row validation, and add / remove / update operations.
 */
export function useTiers() {
  const [tiers, setTiers] = useState<Tier[]>(load)
  const [draft, setDraft] = useState<DraftTier[] | null>(null)
  const editing = draft !== null

  const errors = useMemo(() => (draft ? draft.map(validateDraft) : []), [draft])
  const isValid = errors.every((e) => !hasErrors(e))

  const startEdit = () => setDraft(tiers.map(toDraft))
  const cancel = () => setDraft(null)

  const save = () => {
    if (!draft || !isValid) return
    const next = draft.map(fromDraft)
    setTiers(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable — keep the in-memory copy */
    }
    setDraft(null)
  }

  const updateField = (id: string, field: keyof DraftTier, value: string) =>
    setDraft((d) => d && d.map((r) => (r.id === id ? { ...r, [field]: value } : r)))

  const insertRelativeTo = (id: string, offset: 0 | 1) =>
    setDraft((d) => {
      if (!d) return d
      const i = d.findIndex((r) => r.id === id)
      const next = [...d]
      next.splice(i + offset, 0, blankDraft())
      return next
    })

  const addAbove = (id: string) => insertRelativeTo(id, 0)
  const addBelow = (id: string) => insertRelativeTo(id, 1)
  const addEnd = () => setDraft((d) => (d ? [...d, blankDraft()] : d))
  const remove = (id: string) => setDraft((d) => (d ? d.filter((r) => r.id !== id) : d))

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
    addAbove,
    addBelow,
    addEnd,
    remove,
  }
}
