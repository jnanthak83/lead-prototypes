import { TierRow } from './TierRow'
import { Plus } from '../../components/icons'
import { deriveLows } from './format'
import type { useTiers } from './useTiers'

type Props = Pick<
  ReturnType<typeof useTiers>,
  'tiers' | 'draft' | 'editing' | 'errors' | 'updateField' | 'commitField' | 'setUnbounded' | 'addEnd' | 'remove'
>

const head = 'px-2 py-1 text-left text-sm font-medium text-emphasis'

/** The Premium Tiers table: a single-row header, one row per tier, and an
 *  "Add tier" row at the bottom while editing. */
export function TierTable({
  tiers,
  draft,
  editing,
  errors,
  updateField,
  commitField,
  setUnbounded,
  addEnd,
  remove,
}: Props) {
  const lows = draft ? deriveLows(draft) : []
  const isEmpty = editing ? draft!.length === 0 : tiers.length === 0

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-xl table-fixed border-separate border-spacing-0 text-sm">
        <colgroup>
          <col className="w-16" />
          <col />
          <col />
          <col className="w-56" />
          <col className="w-10" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={head}>
              Tier
            </th>
            <th scope="col" className={head}>
              low
            </th>
            <th scope="col" className={head}>
              high
            </th>
            <th scope="col" className={head}>
              Premium Percentage (%)
            </th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {isEmpty && !editing && (
            <tr>
              <td colSpan={5} className="px-2 py-6 text-center text-sm text-muted">
                No tiers configured yet. Press Edit to add pricing tiers.
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
                  onCommit={(f) => commitField(row.id, f)}
                  onUnbounded={(next) => setUnbounded(row.id, next)}
                  onRemove={() => remove(row.id)}
                />
              ))
            : tiers.map((row, i) => <TierRow key={row.id} index={i} editing={false} tier={row} />)}
          {editing && (
            <tr>
              <td colSpan={5} className="px-2 pt-3">
                <button
                  type="button"
                  onClick={addEnd}
                  className="flex h-8 items-center gap-1 rounded-pill px-3 text-xs font-medium text-default hover:bg-shift-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Plus className="size-4" />
                  Add tier
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
