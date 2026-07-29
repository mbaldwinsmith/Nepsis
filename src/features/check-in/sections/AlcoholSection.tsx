import { SegmentedControl } from '../../../components/SegmentedControl'
import { TextField } from '../../../components/TextField'
import type { Alcohol } from '../../../data/schemas'

interface Props {
  value: Alcohol
  onChange: (value: Alcohol) => void
}

export function AlcoholSection({ value, onChange }: Props) {
  const units = value.unitsConsumed ?? 0

  return (
    <section className="card stack">
      <h2>Alcohol</h2>
      <TextField
        label="Units consumed"
        type="number"
        min={0}
        step={0.5}
        value={value.unitsConsumed?.toString() ?? ''}
        onChange={(v) =>
          onChange({
            ...value,
            unitsConsumed: v === '' ? undefined : Number(v),
            context: v === '' || Number(v) <= 0 ? undefined : value.context,
            perceivedEffect:
              v === '' || Number(v) <= 0 ? undefined : value.perceivedEffect,
          })
        }
      />
      {units > 0 && (
        <>
          <SegmentedControl
            legend="Context"
            name="alcoholContext"
            options={[
              { value: 'social', label: 'Social' },
              { value: 'withMeal', label: 'With meal' },
              { value: 'relaxingAlone', label: 'Relaxing alone' },
              { value: 'celebration', label: 'Celebration' },
              { value: 'coping', label: 'Coping' },
              { value: 'other', label: 'Other' },
            ]}
            value={value.context}
            onChange={(v) => onChange({ ...value, context: v })}
          />
          <SegmentedControl
            legend="Perceived effect"
            name="alcoholEffect"
            options={[
              { value: 'better', label: 'Better' },
              { value: 'neutral', label: 'Neutral' },
              { value: 'worse', label: 'Worse' },
              { value: 'unclear', label: 'Unclear' },
            ]}
            value={value.perceivedEffect}
            onChange={(v) => onChange({ ...value, perceivedEffect: v })}
          />
        </>
      )}
    </section>
  )
}
