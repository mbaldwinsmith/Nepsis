import { ScaleInput } from '../../../components/ScaleInput'
import { SegmentedControl } from '../../../components/SegmentedControl'
import { CheckboxField } from '../../../components/CheckboxField'
import { TextField } from '../../../components/TextField'
import {
  VERY_POOR_TO_VERY_GOOD,
  NOT_AT_ALL_TO_MARKEDLY,
  NONE_TO_SEVERE,
  NO_NEED_TO_STRONG_NEED,
} from '../../../utils/scaleWords'
import type { Sleep } from '../../../data/schemas'

interface Props {
  value: Sleep
  onChange: (value: Sleep) => void
}

export function SleepSection({ value, onChange }: Props) {
  function set<K extends keyof Sleep>(key: K, next: Sleep[K]) {
    onChange({ ...value, [key]: next })
  }

  return (
    <section className="card stack">
      <h2>Sleep</h2>
      <TextField
        label="Sleep duration (minutes)"
        type="number"
        min={0}
        value={value.sleepDurationMinutes?.toString() ?? ''}
        onChange={(v) => set('sleepDurationMinutes', v === '' ? undefined : Number(v))}
      />
      <ScaleInput
        legend="Sleep quality"
        name="sleepQuality"
        min={0}
        max={4}
        value={value.sleepQuality}
        onChange={(v) => set('sleepQuality', v)}
        minLabel="Very poor"
        maxLabel="Very good"
        words={VERY_POOR_TO_VERY_GOOD}
      />
      <ScaleInput
        legend="Reduced need for sleep"
        name="reducedNeedForSleep"
        min={0}
        max={2}
        value={value.reducedNeedForSleep}
        onChange={(v) => set('reducedNeedForSleep', v)}
        minLabel="Not at all"
        maxLabel="Markedly"
        words={NOT_AT_ALL_TO_MARKEDLY}
        hint="Feeling rested on less sleep than usual — different from sleeping badly."
      />
      <ScaleInput
        legend="Difficulty falling asleep"
        name="difficultyFallingAsleep"
        min={0}
        max={4}
        value={value.difficultyFallingAsleep}
        onChange={(v) => set('difficultyFallingAsleep', v)}
        minLabel="None"
        maxLabel="Severe"
        words={NONE_TO_SEVERE}
      />
      <ScaleInput
        legend="Waking unusually early"
        name="wakingUnusuallyEarly"
        min={0}
        max={4}
        value={value.wakingUnusuallyEarly}
        onChange={(v) => set('wakingUnusuallyEarly', v)}
        minLabel="None"
        maxLabel="Severe"
        words={NONE_TO_SEVERE}
      />
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
      <CheckboxField
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
