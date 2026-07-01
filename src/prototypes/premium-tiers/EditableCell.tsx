import { useId } from 'react'
import type { FieldStatus } from './validate'

interface EditableCellProps {
  value: string
  onChange: (value: string) => void
  /** Fired on blur / Enter — used to fold a math expression into its result. */
  onCommit?: () => void
  /** 'new' = fresh field (blue), 'error' = touched & invalid (red). */
  status: FieldStatus
  /** Hint/error text; shown (tinted to match the status) when not valid. */
  message?: string
  prefix?: string
  suffix?: string
  placeholder?: string
  ariaLabel: string
}

const boxByStatus: Record<FieldStatus, string> = {
  valid: 'border-stroke focus-within:border-brand focus-within:ring-1 focus-within:ring-brand',
  new: 'border-highlight ring-1 ring-highlight',
  error: 't-shake border-error ring-1 ring-error',
}

/** Inline input that accepts numbers or math (e.g. 20000000+1), with a
 *  $/% adornment and a new (blue) / error (red) state. */
export function EditableCell({
  value,
  onChange,
  onCommit,
  status,
  message,
  prefix,
  suffix,
  placeholder,
  ariaLabel,
}: EditableCellProps) {
  const msgId = useId()
  const showMessage = status !== 'valid' && !!message
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`flex h-8 items-center gap-1 rounded-xs border bg-surface-100 px-2 ${boxByStatus[status]}`}>
        {prefix && (
          <span aria-hidden="true" className="select-none text-muted">
            {prefix}
          </span>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onCommit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
          }}
          placeholder={placeholder}
          inputMode="text"
          aria-label={ariaLabel}
          aria-invalid={status === 'error' || undefined}
          aria-describedby={showMessage ? msgId : undefined}
          className="w-full min-w-0 bg-transparent text-emphasis outline-none placeholder:text-muted"
        />
        {suffix && (
          <span aria-hidden="true" className="select-none text-muted">
            {suffix}
          </span>
        )}
      </span>
      {showMessage && (
        <span
          id={msgId}
          role={status === 'error' ? 'alert' : undefined}
          className={`t-msg-in text-xs ${status === 'error' ? 'text-error' : 'text-highlight'}`}
        >
          {message}
        </span>
      )}
    </div>
  )
}
