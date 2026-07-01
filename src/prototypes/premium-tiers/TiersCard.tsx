import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Plus } from '../../components/icons'
import { TierTable } from './TierTable'
import { useTiers } from './useTiers'

/** Premium Tiers card — read-only until "Edit", then inline-editable. */
export function TiersCard() {
  const t = useTiers()

  const action = t.editing ? (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={t.cancel}>
        Cancel
      </Button>
      <Button variant="primary" size="sm" onClick={t.save} disabled={!t.isValid}>
        Save
      </Button>
    </div>
  ) : (
    <Button variant="secondary" size="sm" onClick={t.startEdit}>
      Edit
    </Button>
  )

  return (
    <Card
      title="Premium Tiers"
      description="Premium percentage charged per settlement-balance tier."
      action={action}
    >
      <TierTable {...t} />

      {t.editing && (
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={t.addEnd}>
            <Plus className="size-4" />
            Add tier
          </Button>
          {!t.isValid && (
            <p className="text-xs text-error">Fix the highlighted fields before saving.</p>
          )}
        </div>
      )}
    </Card>
  )
}
