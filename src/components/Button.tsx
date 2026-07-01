import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

const button = cva(
  'inline-flex items-center justify-center gap-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-contrast hover:opacity-90 active:opacity-80',
        secondary: 'border border-stroke bg-surface-100 text-emphasis hover:bg-shift-100 active:bg-shift-200',
        ghost: 'text-default hover:bg-shift-100 active:bg-shift-200',
        danger: 'text-error hover:bg-error-bg',
      },
      size: {
        sm: 'h-8 rounded-pill px-3 text-xs',
        md: 'h-10 rounded-pill px-4 text-sm',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'sm' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

/**
 * Button — the Lead system's interactive control.
 * `primary` for the main action (Save), `secondary` for the Edit pill,
 * `ghost` for low-emphasis actions, `danger` for destructive ones.
 */
export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={button({ variant, size, className })} {...props} />
}
