import type { ReactNode } from 'react'

interface CardProps {
  title: string
  description?: string
  /** Right-aligned header slot — e.g. the Edit / Save buttons. */
  action?: ReactNode
  children: ReactNode
}

/** Card — a white tile with a titled header, optional action, and a divider. */
export function Card({ title, description, action, children }: CardProps) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-tile bg-surface-100 p-6">
      <header className="flex items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="text-xl font-medium tracking-tight text-brand">{title}</h2>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        {action}
      </header>
      <hr className="border-0 border-t border-stroke" />
      {children}
    </section>
  )
}
