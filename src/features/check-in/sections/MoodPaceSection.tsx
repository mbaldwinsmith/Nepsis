import { ScaleInput } from '../../../components/ScaleInput'
import {
  NOT_AT_ALL_TO_VERY_POROUS,
  VERY_LOW_TO_VERY_HIGH,
  MUCH_SLOWER_TO_MUCH_FASTER,
} from '../../../utils/scaleWords'
import type { Mood } from '../../../data/schemas'

interface Props {
  value: Mood
  onChange: (value: Mood) => void
}

export function MoodPaceSection({ value, onChange }: Props) {
  function set<K extends keyof Mood>(key: K, next: Mood[K]) {
    onChange({ ...value, [key]: next })
  }

  return (
    <section className="card stack">
      <h2>Pace and drive</h2>
      <ScaleInput
        legend="Emotional sensitivity"
        name="emotionalSensitivity"
        min={0}
        max={4}
        value={value.emotionalSensitivity}
        onChange={(v) => set('emotionalSensitivity', v)}
        minLabel="Not at all"
        maxLabel="Very porous"
        words={NOT_AT_ALL_TO_VERY_POROUS}
      />
      <ScaleInput
        legend="Energy"
        name="energy"
        min={0}
        max={4}
        value={value.energy}
        onChange={(v) => set('energy', v)}
        minLabel="Very low"
        maxLabel="Very high"
        words={VERY_LOW_TO_VERY_HIGH}
      />
      <ScaleInput
        legend="Mental speed"
        name="mentalSpeed"
        min={-2}
        max={2}
        value={value.mentalSpeed}
        onChange={(v) => set('mentalSpeed', v)}
        minLabel="Much slower"
        maxLabel="Much faster"
        words={MUCH_SLOWER_TO_MUCH_FASTER}
      />
      <ScaleInput
        legend="Goal-directed activity"
        name="goalDirectedActivity"
        min={0}
        max={4}
        value={value.goalDirectedActivity}
        onChange={(v) => set('goalDirectedActivity', v)}
        minLabel="Very low"
        maxLabel="Very high"
        words={VERY_LOW_TO_VERY_HIGH}
      />
    </section>
  )
}
