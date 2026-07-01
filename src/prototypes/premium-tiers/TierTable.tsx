import { TierRow } from './TierRow'
import { deriveLows } from './format'
import type { useTiers } from './useTiers'

type Props = Pick<
  ReturnType<typeof useTiers>,
  | 'tiers'
  | 'draft'
  | 'editing'
  | 'errors'
  | 'updateField'
  | 'setUnbounded'
  | 'addAbove'
  | 'addBelow'
  | 'remove'
>

const head = 'px-2 py-1 text-left text-sm font-medium text-emphasis'

/** The Premium Tiers table: two-level header + one row per tier. */
export function TierTable({
  tiers,
  draft,
  editing,
  errors,
  updateField,
  setUnbounded,
  addAbove,
  addBelow,
  remove,
}: Props) {
  const lows = draft ? deriveLows(draft) : []

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
          {editing && draft!.length === 0 && (
            <tr>
              <td colSpan={5} className="px-2 py-6 text-center text-sm text-muted">
                No tiers yet — add one to get started.
              </td>
            </tr>
          )}
          {editing
            ? draft!.map((row, i) => (
                <TierRow
                  key={row.id}
                  index={i}
                  editing
                  draft={row}
                  low={lows[i]}
                  isLast={i === draft!.length - 1}
                  error={errors[i]}
                  onField={(f, v) => updateField(row.id, f, v)}
                  onUnbounded={(next) => setUnbounded(row.id, next)}
                  onAddAbove={() => addAbove(row.id)}
                  onAddBelow={() => addBelow(row.id)}
                  onRemove={() => remove(row.id)}
                />
              ))
            : tiers.map((row, i) => <TierRow key={row.id} index={i} editing={false} tier={row} />)}
        </tbody>
      </table>
    </div>
  )
}
