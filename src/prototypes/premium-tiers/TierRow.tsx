import { EditableCell } from './EditableCell'
import { HighCell } from './HighCell'
import { RowMenu } from './RowMenu'
import { formatCurrency, formatHigh, formatLow, formatPercent, sanitizeDecimal, sanitizeInteger } from './format'
import type { DraftTier, Tier, TierErrors } from './types'

interface TierRowProps {
  index: number
  editing: boolean
  // read-only row
  tier?: Tier
  // editable row
  draft?: DraftTier
  low?: number // derived low bound, for display
  isLast?: boolean
  error?: TierErrors
  onField?: (field: 'high' | 'premium', value: string) => void
  onUnbounded?: (next: boolean) => void
  onAddAbove?: () => void
  onAddBelow?: () => void
  onRemove?: () => void
}

const cell = 'px-2 py-2 align-top'

/** One tier — a read-only row, or a row of inline inputs while editing. */
export function TierRow(props: TierRowProps) {
  const { index, editing } = props
  const tierNo = index + 1

  if (!editing && props.tier) {
    const t = props.tier
    return (
      <tr className="bg-shift-100">
        <td className={`${cell} text-default`}>{tierNo}</td>
        <td className={`${cell} text-emphasis`}>{formatCurrency(t.low)}</td>
        <td className={`${cell} text-emphasis`}>{formatHigh(t.high)}</td>
        <td className={`${cell} text-emphasis`}>{formatPercent(t.premium)}</td>
        <td className={cell} />
      </tr>
    )
  }

  const d = props.draft!
  const e = props.error ?? {}
  return (
    <tr className="bg-shift-100">
      <td className={`${cell} pt-4 text-default`}>{tierNo}</td>
      <td className={`${cell} pt-4 text-default`} title="Derived from the previous tier's high + 1">
        {formatLow(props.low ?? NaN)}
      </td>
      <td className={cell}>
        <HighCell
          value={d.high}
          unbounded={d.unbounded}
          canBeUnbounded={!!props.isLast}
          invalid={!!e.high}
          error={e.high}
          ariaLabel={`Tier ${tierNo} high bound`}
          onChange={(v) => props.onField!('high', sanitizeInteger(v))}
          onToggleUnbounded={props.onUnbounded!}
        />
      </td>
      <td className={cell}>
        <EditableCell
          suffix="%"
          value={d.premium}
          placeholder="0"
          invalid={!!e.premium}
          error={e.premium}
          ariaLabel={`Tier ${tierNo} premium percentage`}
          onChange={(v) => props.onField!('premium', sanitizeDecimal(v))}
        />
      </td>
      <td className={`${cell} pt-3`}>
        <RowMenu
          label={`Tier ${tierNo} actions`}
          onAddAbove={props.onAddAbove!}
          onAddBelow={props.onAddBelow!}
          onRemove={props.onRemove!}
        />
      </td>
    </tr>
  )
}
