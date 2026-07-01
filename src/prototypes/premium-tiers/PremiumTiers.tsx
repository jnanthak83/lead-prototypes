import { ChevronLeft } from '../../components/icons'
import { Sidebar } from './Sidebar'
import { TiersCard } from './TiersCard'

/** Program Config → Credit → Billing screen, focused on the Premium Tiers card. */
export function PremiumTiers() {
  return (
    <div className="flex min-h-full flex-col gap-4 py-4">
      <Breadcrumb />
      <div className="flex gap-4 px-4 sm:px-6">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col gap-4 rounded-card bg-shift-100 p-4">
          <header className="px-2 pt-2">
            <h1 className="text-xl font-medium tracking-tight text-emphasis">Billing</h1>
            <p className="text-sm text-muted">Configure premium pricing tiers for this product.</p>
          </header>
          <TiersCard />
        </main>
      </div>
    </div>
  )
}

function Breadcrumb() {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 text-sm text-default sm:px-6">
      <a href="#/" className="flex items-center gap-1 text-muted hover:text-emphasis">
        <ChevronLeft className="size-4" />
        Prototypes
      </a>
      <span className="text-muted">/</span>
      <span>monzo-payments</span>
      <span className="text-muted">/</span>
      <span className="rounded-xs bg-shift-200 px-2 py-0.5 text-emphasis">monzo-checking-product</span>
    </div>
  )
}
