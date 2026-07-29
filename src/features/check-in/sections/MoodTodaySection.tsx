import { ScaleInput } from '../../../components/ScaleInput'
import { NOT_AT_ALL_TO_SEVERE } from '../../../utils/scaleWords'
import type { Mood } from '../../../data/schemas'

interface Props {
  value: Mood
  onChange: (value: Mood) => void
}

export function MoodTodaySection({ value, onChange }: Props) {
  function set<K extends keyof Mood>(key: K, next: Mood[K]) {
    onChange({ ...value, [key]: next })
  }

  return (
    <section className="card stack">
      <h2>How today felt</h2>
      <ScaleInput
        legend="Low mood"
        name="lowMood"
        min={0}
        max={4}
        value={value.lowMood}
        onChange={(v) => set('lowMood', v)}
        minLabel="Not at all"
        maxLabel="Severe"
        words={NOT_AT_ALL_TO_SEVERE}
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
        words={NOT_AT_ALL_TO_SEVERE}
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
        words={NOT_AT_ALL_TO_SEVERE}
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
        words={NOT_AT_ALL_TO_SEVERE}
      />
    </section>
  )
}
