import { ScaleInput } from '../../../components/ScaleInput'
import { TextField } from '../../../components/TextField'
import { NONE_TO_SEVERE } from '../../../utils/scaleWords'
import type { Urges } from '../../../data/schemas'

interface Props {
  value: Urges
  onChange: (value: Urges) => void
}

export function AppetiteUrgesSection({ value, onChange }: Props) {
  return (
    <section className="card stack">
      <h2>Urges</h2>
      <ScaleInput
        legend="Unusual spending urge"
        name="spendingUrge"
        min={0}
        max={4}
        value={value.spendingUrge}
        onChange={(v) => onChange({ ...value, spendingUrge: v })}
        minLabel="None"
        maxLabel="Severe"
        words={NONE_TO_SEVERE}
      />
      <ScaleInput
        legend="Gambling urge"
        name="gamblingUrge"
        min={0}
        max={4}
        value={value.gamblingUrge}
        onChange={(v) => onChange({ ...value, gamblingUrge: v })}
        minLabel="None"
        maxLabel="Severe"
        words={NONE_TO_SEVERE}
      />
      <ScaleInput
        legend="Unusually increased sexual drive"
        name="sexualDriveIncrease"
        min={0}
        max={4}
        value={value.sexualDriveIncrease}
        onChange={(v) => onChange({ ...value, sexualDriveIncrease: v })}
        minLabel="None"
        maxLabel="Severe"
        words={NONE_TO_SEVERE}
      />
      <TextField
        label="Other repetitive or compulsive urge (optional)"
        value={value.otherCompulsiveUrgeText ?? ''}
        onChange={(v) => onChange({ ...value, otherCompulsiveUrgeText: v || undefined })}
      />
    </section>
  )
}
