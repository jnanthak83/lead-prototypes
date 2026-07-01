import { EditableCell } from './EditableCell'

interface HighCellProps {
  value: string
  onChange: (value: string) => void
  unbounded: boolean
  onToggleUnbounded: (next: boolean) => void
  /** Only the last tier may run to ∞, so the toggle only shows there. */
  canBeUnbounded: boolean
  invalid?: boolean
  error?: string
  ariaLabel: string
}

/** The high-bound cell: a numeric input, or an ∞ (unbounded) state on the last tier. */
export function HighCell({
  value,
  onChange,
  unbounded,
  onToggleUnbounded,
  canBeUnbounded,
  invalid,
  error,
  ariaLabel,
}: HighCellProps) {
  if (unbounded) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 flex-1 items-center rounded-xs border border-stroke bg-shift-100 px-2 text-emphasis"
          aria-label={`${ariaLabel}: unbounded`}
        >
          ∞
        </span>
        <button
          type="button"
          onClick={() => onToggleUnbounded(false)}
          className="shrink-0 rounded-xs px-2 py-1 text-xs text-default hover:bg-shift-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Set limit
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-1">
      <div className="min-w-0 flex-1">
        <EditableCell
          prefix="$"
          value={value}
          placeholder="0"
          invalid={invalid}
          error={error}
          ariaLabel={ariaLabel}
          onChange={onChange}
        />
      </div>
      {canBeUnbounded && (
        <button
          type="button"
          title="Set to unbounded (∞)"
          aria-label={`Set ${ariaLabel} to unbounded`}
          onClick={() => onToggleUnbounded(true)}
          className="flex size-8 shrink-0 items-center justify-center rounded-xs border border-stroke text-default hover:bg-shift-200 hover:text-emphasis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          ∞
        </button>
      )}
    </div>
  )
}
