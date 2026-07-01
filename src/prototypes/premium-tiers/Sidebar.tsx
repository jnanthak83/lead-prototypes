/** Static navigation echoing the Program Config screen (visual context only). */
export function Sidebar() {
  return (
    <nav className="hidden w-56 shrink-0 flex-col gap-1 self-start rounded-card bg-shift-100 p-4 text-sm lg:flex">
      <span className="px-2 py-2 font-medium text-emphasis">Product Configuration</span>
      <NavItem label="Overview" />

      <span className="px-2 pb-1 pt-4 text-xs font-medium text-muted">CAPABILITY CONFIGURATIONS</span>
      <NavItem label="Deposit" />
      <NavItem label="Credit" active />
      <div className="ml-3 flex flex-col gap-1 border-l border-stroke pl-3">
        <NavItem label="General" nested />
        <NavItem label="Billing" nested current />
        <NavItem label="Skip & SLA" nested />
        <NavItem label="Account Entries" nested />
        <NavItem label="Card Networks" nested />
      </div>
      <NavItem label="Collateral" />
    </nav>
  )
}

function NavItem({
  label,
  active,
  current,
  nested,
}: {
  label: string
  active?: boolean
  current?: boolean
  nested?: boolean
}) {
  const emphasis = active || current ? 'font-medium text-brand' : 'text-default'
  return <span className={`rounded-xs px-2 ${nested ? 'py-1.5' : 'py-2'} ${emphasis}`}>{label}</span>
}
