import { TierRow } from './TierRow'
import type { DraftTier, Tier } from './types'
import type { useTiers } from './useTiers'

type Props = Pick<
  ReturnType<typeof useTiers>,
  'tiers' | 'draft' | 'editing' | 'errors' | 'updateField' | 'addAbove' | 'addBelow' | 'remove'
>

const head = 'px-2 py-1 text-left text-sm font-medium text-emphasis'

/** The Premium Tiers table: two-level header + one row per tier. */
export function TierTable({ tiers, draft, editing, errors, updateField, addAbove, addBelow, remove }: Props) {
  const rows = editing ? draft! : tiers

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-xl table-fixed border-separate border-spacing-0 text-sm">
      <colgroup>
        <col className="w-16" />
        <col />
        <col />
        <col className="w-48" />
        <col className="w-10" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" className={head}>
            Tier
          </th>
          <th scope="colgroup" colSpan={2} className={head}>
            Bounds
          </th>
          <th scope="col" className={head}>
            premium_percentage
          </th>
          <th aria-hidden="true" />
        </tr>
        <tr>
          <th aria-hidden="true" />
          <th scope="col" className={head}>
            low
          </th>
          <th scope="col" className={head}>
            high
          </th>
          <th scope="col" className={head}>
            %
          </th>
          <th aria-hidden="true" />
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={5} className="px-2 py-6 text-center text-sm text-muted">
              No tiers yet — add one to get started.
            </td>
          </tr>
        )}
        {rows.map((row, i) =>
          editing ? (
            <TierRow
              key={row.id}
              index={i}
              editing
              draft={row as DraftTier}
              error={errors[i]}
              onField={(f, v) => updateField(row.id, f, v)}
              onAddAbove={() => addAbove(row.id)}
              onAddBelow={() => addBelow(row.id)}
              onRemove={() => remove(row.id)}
            />
          ) : (
            <TierRow key={row.id} index={i} editing={false} tier={row as Tier} />
          ),
        )}
      </tbody>
      </table>
    </div>
  )
}
