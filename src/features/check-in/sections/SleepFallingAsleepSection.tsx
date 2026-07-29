import { ScaleInput } from '../../../components/ScaleInput'
import { NOT_AT_ALL_TO_MARKEDLY, NONE_TO_SEVERE } from '../../../utils/scaleWords'
import type { Sleep } from '../../../data/schemas'

interface Props {
  value: Sleep
  onChange: (value: Sleep) => void
}

export function SleepFallingAsleepSection({ value, onChange }: Props) {
  function set<K extends keyof Sleep>(key: K, next: Sleep[K]) {
    onChange({ ...value, [key]: next })
  }

  return (
    <section className="card stack">
      <h2>Falling asleep and waking</h2>
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
    </section>
  )
}
