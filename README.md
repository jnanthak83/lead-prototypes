# Lead Prototypes

A small, deployable collection of interactive prototypes built on the Lead
design system. Each prototype lives under `src/prototypes/<name>/` and is listed
on the home page.

## Prototypes

- **Premium Tiers** — an editable pricing-tier table (from the Program Config
  Figma). Starts blank (a fresh setup); press **Edit**, then:
  - `high` and `premium` accept a number **or a math expression** — `20000000+1`,
    `5000*12`, `(100+5)/2` — evaluated on blur/Enter,
  - the percentage column shows decimals as percentages (`0.13` → `13.0%`),
  - `low` is **derived** (previous tier's high + 1), so tiers stay contiguous and
    non-overlapping; deleting a tier re-links the next one automatically,
  - the last tier can be **unbounded (∞)** — type `inf` (or use the ∞ button),
  - **Add tier** (the row below the table) appends; each row has a **Delete**,
  - **Save** validates every row and persists to `localStorage`; **Cancel** reverts.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build & deploy

```bash
npm run build    # type-checks, then outputs a static site to dist/
npm run preview  # serve the production build locally
```

`dist/` is a fully static bundle with relative asset paths (`base: './'`), so it
deploys as-is to Netlify, Vercel, GitHub Pages, or any static host. No backend —
edits persist per-browser via `localStorage`.

## Structure

```
src/
├── App.tsx                 # tiny hash router (home ↔ prototype)
├── components/             # shared UI: Button, Card, Home, icons
└── prototypes/
    ├── registry.ts         # the list of prototypes
    └── premium-tiers/      # the Premium Tiers prototype
        ├── PremiumTiers.tsx   # page (breadcrumb, nav, section)
        ├── TiersCard.tsx      # card + Edit/Save/Cancel
        ├── TierTable.tsx      # table structure
        ├── TierRow.tsx        # a read-only or editable row
        ├── EditableCell.tsx   # inline numeric input
        ├── RowMenu.tsx        # per-row overflow menu
        ├── useTiers.ts        # state: edit draft, add/remove, persistence
        ├── validate.ts        # numeric / required-field validation
        └── format.ts          # currency & percentage formatting
```

Design tokens and component conventions live in [`DESIGN.md`](./DESIGN.md).

## Adding a prototype

1. Create `src/prototypes/<name>/<Name>.tsx` exporting a component.
2. Add an entry to `src/prototypes/registry.ts`.

It appears on the home page automatically.

## Notes

- **Font:** the licensed *Lead Sans Variable* isn't bundled; a system-font stack
  is the fallback, so type looks close but not pixel-identical to Figma.
- **Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4.
