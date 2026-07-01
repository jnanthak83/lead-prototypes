/** A small fixed marker shown only on the staging build (VITE_APP_ENV=staging). */
export function EnvBadge() {
  if (import.meta.env.VITE_APP_ENV !== 'staging') return null
  return (
    <div className="fixed bottom-3 left-3 z-50 rounded-pill bg-brand px-3 py-1 text-xs font-medium tracking-wide text-contrast shadow-lg">
      STAGING
    </div>
  )
}
