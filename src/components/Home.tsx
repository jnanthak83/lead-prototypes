import { prototypes } from '../prototypes/registry'

/** Landing page — lists every prototype in the workspace. */
export function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-xl font-medium tracking-tight text-emphasis">Lead Prototypes</h1>
        <p className="text-sm text-muted">
          A small collection of interactive prototypes built on the Lead design system.
        </p>
      </header>
      <ul className="flex flex-col gap-3">
        {prototypes.map((p) => (
          <li key={p.slug}>
            <a
              href={`#/${p.slug}`}
              className="flex flex-col gap-1 rounded-tile border border-stroke bg-surface-100 p-5 transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span className="text-base font-medium text-brand">{p.title}</span>
              <span className="text-sm text-muted">{p.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
