# Lead Design System

> Source of truth for tokens and component patterns. Pulled from the
> **Program Config** Figma file (`3eM1fRDNELWca68g03BppC`). Reconcile against
> Figma before adding new tokens — the system grows by need, not anticipation.

## Brand

- Voice: clear, precise, trustworthy. Financial UI — clarity over cleverness.
- Primary accent: Lead blue `#3237ff` (links, active nav, card titles, primary actions).

## Colors

### Tokens

| Token                 | Value                    | Tailwind       | Usage                                   |
| --------------------- | ------------------------ | -------------- | --------------------------------------- |
| color.brand           | `#3237ff`                | `brand`        | Primary actions, links, card titles     |
| color.text.emphasis   | `#121215`                | `emphasis`     | Strong body copy, values                |
| color.text.default    | `#494d5a`                | `default`      | Body copy, labels                       |
| color.text.muted      | `#7e8395`                | `muted`        | Secondary text, placeholders, captions  |
| color.text.contrast   | `#ffffff`                | `contrast`     | Text on brand / dark fills              |
| color.border.default  | `#d5d7dd`                | `stroke`       | Dividers, input borders                 |
| color.surface.0       | `#f7f7f8`                | `surface-0`    | Page background                         |
| color.surface.100     | `#ffffff`                | `surface-100`  | Cards, inputs, menus                    |
| color.shift.100       | `rgba(75,91,159,0.04)`   | `shift-100`    | Subtle panel / table-row tint           |
| color.shift.200       | `rgba(75,91,159,0.08)`   | `shift-200`    | Hover tint, chips                       |
| color.status.error    | `#d92d20`                | `error`        | Validation errors, destructive actions  |
| color.status.error.bg | `#fef3f2`                | `error-bg`     | Error hover surface                     |

> `error` / `error-bg` are additions — Figma had no status palette for this
> screen. Flag for reconciliation when a status set is defined upstream.

## Typography

Family: **Lead Sans Variable** (fallback: `ui-sans-serif, system-ui, …`).
The licensed font is not bundled; the fallback renders if it isn't installed.

| Token           | Size | Weight        | Tailwind                |
| --------------- | ---- | ------------- | ----------------------- |
| type.title.sm   | 20px | Medium (500)  | `text-xl font-medium`   |
| type.body.md    | 16px | Regular (400) | `text-base`             |
| type.body.sm    | 14px | Regular (400) | `text-sm`               |
| type.body.sm.em | 14px | Medium (500)  | `text-sm font-medium`   |
| type.caption    | 12px | Medium (500)  | `text-xs font-medium`   |

## Spacing

Base unit 4px. Scale: `2 4 8 12 16 20 24 32`. Use Tailwind spacing utilities
(`gap-2`, `p-6`, …) — no arbitrary values.

## Border Radius

| Token       | Value  | Tailwind        |
| ----------- | ------ | --------------- |
| radius.xs   | 2px    | `rounded-xs`    |
| radius.tile | 8px    | `rounded-tile`  |
| radius.card | 24px   | `rounded-card`  |
| radius.pill | 9999px | `rounded-pill`  |

## Layout

- Page background `surface-0`; content on `shift-100` panels and `surface-100` cards.
- Left nav 224px (`w-56`), hidden below `lg`.
- Cards: `rounded-tile`, `p-6`, 16px vertical rhythm.

## Components

### Button (`src/components/Button.tsx`)

- Variants: `primary` | `secondary` | `ghost` | `danger`
- Sizes: `sm` | `md` (pill radius)
- States: default · hover · focus-visible · active · disabled
- Notes: `secondary` is the outlined pill (the "Edit" control); `primary` is the
  filled Save action.

### Card (`src/components/Card.tsx`)

- Titled white tile with an optional right-aligned `action` slot and a divider.
- Title uses `text-brand`.

### EditableCell (`src/prototypes/premium-tiers/EditableCell.tsx`)

- Inline numeric input with a `$`/`%` adornment.
- States: default · focus-within · invalid (`error` ring). Numeric-only input.

## Patterns

- **Inline table editing** — a card toggles between read-only and an editable
  draft via Edit / Cancel / Save. The draft holds raw strings; values are parsed
  and validated on save, then persisted to `localStorage`.
- **Per-row overflow menu** — `⋮` opens add-above / add-below / delete, closing on
  outside click or Escape (`role="menu"`).
