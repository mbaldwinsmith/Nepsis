import { ScaleInput } from '../../../components/ScaleInput'
import type { Mood } from '../../../data/schemas'

interface Props {
  value: Mood
  onChange: (value: Mood) => void
}

export function MoodSection({ value, onChange }: Props) {
  function set<K extends keyof Mood>(key: K, next: Mood[K]) {
    onChange({ ...value, [key]: next })
  }

  return (
    <section className="card stack">
      <h2>Mood and activation</h2>
      <ScaleInput
        legend="Low mood"
        name="lowMood"
        min={0}
        max={4}
        value={value.lowMood}
        onChange={(v) => set('lowMood', v)}
        minLabel="Not at all"
        maxLabel="Severe"
      />
      <ScaleInput
        legend="Elevated or expansive mood"
        name="elevatedMood"
        min={0}
        max={4}
        value={value.elevatedMood}
        onChange={(v) => set('elevatedMood', v)}
        minLabel="Not at all"
        maxLabel="Severe"
      />
      <ScaleInput
        legend="Irritability"
        name="irritability"
        min={0}
        max={4}
        value={value.irritability}
        onChange={(v) => set('irritability', v)}
        minLabel="Not at all"
        maxLabel="Severe"
      />
      <ScaleInput
        legend="Anxiety"
        name="anxiety"
        min={0}
        max={4}
        value={value.anxiety}
        onChange={(v) => set('anxiety', v)}
        minLabel="Not at all"
        maxLabel="Severe"
      />
      <ScaleInput
        legend="Emotional sensitivity"
        name="emotionalSensitivity"
        min={0}
        max={4}
        value={value.emotionalSensitivity}
        onChange={(v) => set('emotionalSensitivity', v)}
        minLabel="Not at all"
        maxLabel="Very porous"
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
      />
    </section>
  )
}
