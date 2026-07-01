import { EditableCell } from './EditableCell'
import type { FieldStatus } from './validate'

interface HighCellProps {
  value: string
  onChange: (value: string) => void
  onCommit: () => void
  unbounded: boolean
  onToggleUnbounded: (next: boolean) => void
  /** Only the last tier may run to ∞, so the toggle only shows there. */
  canBeUnbounded: boolean
  status: FieldStatus
  message?: string
  ariaLabel: string
}

/** The high-bound cell: a number/math input, or an ∞ (unbounded) state on the
 *  last tier. Type "inf" (or use the ∞ button) to make it unbounded. */
export function HighCell({
  value,
  onChange,
  onCommit,
  unbounded,
  onToggleUnbounded,
  canBeUnbounded,
  status,
  message,
  ariaLabel,
}: HighCellProps) {
  if (unbounded) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 flex-1 items-center rounded-xs border border-stroke bg-shift-100 px-2 text-sm leading-none text-emphasis"
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
          placeholder='0 (or "inf")'
          status={status}
          message={message}
          ariaLabel={ariaLabel}
          onChange={onChange}
          onCommit={onCommit}
        />
      </div>
      {canBeUnbounded && (
        <button
          type="button"
          title="Set to unbounded (∞) — or type inf"
          aria-label={`Set ${ariaLabel} to unbounded`}
          onClick={() => onToggleUnbounded(true)}
          className="flex size-8 shrink-0 items-center justify-center rounded-xs border border-stroke text-sm leading-none text-default hover:bg-shift-200 hover:text-emphasis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          ∞
        </button>
      )}
    </div>
  )
}
