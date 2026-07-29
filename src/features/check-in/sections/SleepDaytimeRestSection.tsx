import { ScaleInput } from '../../../components/ScaleInput'
import { SegmentedControl } from '../../../components/SegmentedControl'
import { ToggleField } from '../../../components/ToggleField'
import { TextField } from '../../../components/TextField'
import { NO_NEED_TO_STRONG_NEED } from '../../../utils/scaleWords'
import type { Sleep } from '../../../data/schemas'

interface Props {
  value: Sleep
  onChange: (value: Sleep) => void
}

export function SleepDaytimeRestSection({ value, onChange }: Props) {
  function set<K extends keyof Sleep>(key: K, next: Sleep[K]) {
    onChange({ ...value, [key]: next })
  }

  return (
    <section className="card stack">
      <h2>Daytime rest</h2>
      <ScaleInput
        legend="Need to nap at lunchtime"
        name="lunchtimeNapNeed"
        min={0}
        max={3}
        value={value.lunchtimeNapNeed}
        onChange={(v) => set('lunchtimeNapNeed', v)}
        minLabel="No need"
        maxLabel="Strong need"
        words={NO_NEED_TO_STRONG_NEED}
      />
      <ToggleField
        label="Nap taken"
        checked={value.napTaken ?? false}
        onChange={(checked) =>
          onChange({
            ...value,
            napTaken: checked,
            napDurationMinutes: checked ? value.napDurationMinutes : undefined,
            napEffect: checked ? value.napEffect : undefined,
          })
        }
      />
      {value.napTaken && (
        <>
          <TextField
            label="Nap duration (minutes)"
            type="number"
            min={0}
            value={value.napDurationMinutes?.toString() ?? ''}
            onChange={(v) => set('napDurationMinutes', v === '' ? undefined : Number(v))}
          />
          <SegmentedControl
            legend="Nap after-effect"
            name="napEffect"
            options={[
              { value: 'refreshed', label: 'Refreshed' },
              { value: 'unchanged', label: 'Unchanged' },
              { value: 'groggy', label: 'Groggy' },
            ]}
            value={value.napEffect}
            onChange={(v) => set('napEffect', v)}
          />
          <SegmentedControl
            legend="Likely nap reason (optional)"
            name="napReason"
            options={[
              { value: 'poorSleep', label: 'Poor sleep' },
              { value: 'medication', label: 'Medication' },
              { value: 'routine', label: 'Routine' },
              { value: 'illness', label: 'Illness' },
              { value: 'unclear', label: 'Unclear' },
            ]}
            value={value.napReason}
            onChange={(v) => set('napReason', v)}
          />
        </>
      )}
    </section>
  )
}
