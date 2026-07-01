import { useId } from 'react'

interface EditableCellProps {
  value: string
  onChange: (value: string) => void
  /** Fired on blur / Enter — used to fold a math expression into its result. */
  onCommit?: () => void
  prefix?: string
  suffix?: string
  placeholder?: string
  invalid?: boolean
  error?: string
  ariaLabel: string
}

/** Inline input that accepts numbers or math (e.g. 20000000+1), with a
 *  $/% adornment and an error state. */
export function EditableCell({
  value,
  onChange,
  onCommit,
  prefix,
  suffix,
  placeholder,
  invalid,
  error,
  ariaLabel,
}: EditableCellProps) {
  const errorId = useId()
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`flex h-8 items-center gap-1 rounded-xs border bg-surface-100 px-2 ${
          invalid
            ? 't-shake border-error ring-1 ring-error'
            : 'border-stroke focus-within:border-brand focus-within:ring-1 focus-within:ring-brand'
        }`}
      >
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
          aria-invalid={invalid || undefined}
          aria-describedby={error ? errorId : undefined}
          className="w-full min-w-0 bg-transparent text-emphasis outline-none placeholder:text-muted"
        />
        {suffix && (
          <span aria-hidden="true" className="select-none text-muted">
            {suffix}
          </span>
        )}
      </span>
      {error && (
        <span id={errorId} role="alert" className="t-error-in text-xs text-error">
          {error}
        </span>
      )}
    </div>
  )
}
