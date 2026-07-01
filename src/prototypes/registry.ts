import type { ComponentType } from 'react'
import { PremiumTiers } from './premium-tiers/PremiumTiers'

export interface Prototype {
  slug: string
  title: string
  description: string
  Component: ComponentType
}

/** Every prototype in the workspace. Add new entries here as they are built. */
export const prototypes: Prototype[] = [
  {
    slug: 'premium-tiers',
    title: 'Premium Tiers',
    description:
      'Editable pricing-tier table with inline numeric validation, percentage formatting, and add/remove rows.',
    Component: PremiumTiers,
  },
]
