import { ScaleInput } from '../../../components/ScaleInput'
import { TextField } from '../../../components/TextField'
import { QuickValues } from '../../../components/QuickValues'
import { VERY_POOR_TO_VERY_GOOD } from '../../../utils/scaleWords'
import type { Sleep } from '../../../data/schemas'

interface Props {
  value: Sleep
  onChange: (value: Sleep) => void
}

const durationShortcuts = [
  { value: '360', label: '6h' },
  { value: '420', label: '7h' },
  { value: '480', label: '8h' },
]

export function SleepLastNightSection({ value, onChange }: Props) {
  function set<K extends keyof Sleep>(key: K, next: Sleep[K]) {
    onChange({ ...value, [key]: next })
  }

  return (
    <section className="card stack">
      <h2>Last night</h2>
      <TextField
        label="Sleep duration (minutes)"
        type="number"
        min={0}
        value={value.sleepDurationMinutes?.toString() ?? ''}
        onChange={(v) => set('sleepDurationMinutes', v === '' ? undefined : Number(v))}
      />
      <QuickValues
        label="Sleep duration shortcuts"
        values={durationShortcuts}
        onSelect={(v) => set('sleepDurationMinutes', Number(v))}
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
    </section>
  )
}
