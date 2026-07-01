import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { DotsThreeVertical, Plus, Trash } from '../../components/icons'

interface RowMenuProps {
  onAddAbove: () => void
  onAddBelow: () => void
  onRemove: () => void
  label: string
}

/** Per-row overflow menu: add a tier above/below, or delete the row. */
export function RowMenu({ onAddAbove, onAddBelow, onRemove, label }: RowMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    // Move focus into the menu so arrow keys work immediately.
    menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus()
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const close = (returnFocus = false) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') return close(true)
    const items = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])]
    if (!items.length) return
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(i + 1) % items.length].focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(i - 1 + items.length) % items.length].focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items[0].focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[items.length - 1].focus()
    }
  }

  const run = (fn: () => void) => () => {
    fn()
    close()
  }

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex size-6 items-center justify-center rounded-xs text-muted hover:bg-shift-200 hover:text-emphasis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <DotsThreeVertical className="size-5" />
      </button>
      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className="t-dropdown-in absolute right-0 top-7 z-10 w-40 overflow-hidden rounded-tile border border-stroke bg-surface-100 py-1 shadow-lg"
        >
          <MenuItem onClick={run(onAddAbove)} icon={<Plus className="size-4" />} label="Add tier above" />
          <MenuItem onClick={run(onAddBelow)} icon={<Plus className="size-4" />} label="Add tier below" />
          <hr className="my-1 border-0 border-t border-stroke" />
          <MenuItem onClick={run(onRemove)} icon={<Trash className="size-4" />} label="Delete tier" danger />
        </div>
      )}
    </div>
  )
}

function MenuItem({
  onClick,
  icon,
  label,
  danger,
}: {
  onClick: () => void
  icon: ReactNode
  label: string
  danger?: boolean
}) {
  return (
    <button
      role="menuitem"
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-shift-100 focus-visible:bg-shift-100 focus-visible:outline-none ${
        danger ? 'text-error' : 'text-default'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
