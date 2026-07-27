import { ScaleInput } from '../../../components/ScaleInput'
import { CheckboxField } from '../../../components/CheckboxField'
import { TextField } from '../../../components/TextField'
import type { MedicationEffects } from '../../../data/schemas'

interface Props {
  value: MedicationEffects
  onChange: (value: MedicationEffects) => void
}

export function MedicationEffectsSection({ value, onChange }: Props) {
  return (
    <section className="card stack">
      <h2>Medication and side effects</h2>
      <CheckboxField
        label="Missed or delayed a dose today"
        checked={value.missedOrDelayedDose ?? false}
        onChange={(checked) =>
          onChange({ ...value, missedOrDelayedDose: checked || undefined })
        }
      />
      <ScaleInput
        legend="Sedation"
        name="sedation"
        min={0}
        max={4}
        value={value.sedation}
        onChange={(v) => onChange({ ...value, sedation: v })}
        minLabel="None"
        maxLabel="Severe"
      />
      <ScaleInput
        legend="Dizziness"
        name="dizziness"
        min={0}
        max={4}
        value={value.dizziness}
        onChange={(v) => onChange({ ...value, dizziness: v })}
        minLabel="None"
        maxLabel="Severe"
      />
      <ScaleInput
        legend="Nausea"
        name="nausea"
        min={0}
        max={4}
        value={value.nausea}
        onChange={(v) => onChange({ ...value, nausea: v })}
        minLabel="None"
        maxLabel="Severe"
      />
      <ScaleInput
        legend="Tremor or stiffness"
        name="tremorOrStiffness"
        min={0}
        max={4}
        value={value.tremorOrStiffness}
        onChange={(v) => onChange({ ...value, tremorOrStiffness: v })}
        minLabel="None"
        maxLabel="Severe"
      />
      <ScaleInput
        legend="Inner restlessness or need to move"
        name="innerRestlessness"
        min={0}
        max={4}
        value={value.innerRestlessness}
        onChange={(v) => onChange({ ...value, innerRestlessness: v })}
        minLabel="None"
        maxLabel="Severe"
        hint="This can be worth discussing with your prescriber — it is different from anxiety."
      />
      <TextField
        label="Other side effect (optional)"
        value={value.otherSideEffectText ?? ''}
        onChange={(v) => onChange({ ...value, otherSideEffectText: v || undefined })}
      />
    </section>
  )
}
