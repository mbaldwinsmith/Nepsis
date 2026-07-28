import { useState } from 'react'
import { TextField } from '../../components/TextField'
import type { HealthMeasurement, HealthMeasurementType } from '../../data/schemas'
import { nowIsoDateTime } from '../../utils/date'

interface Props {
  onCreate: (input: Omit<HealthMeasurement, 'id' | 'schemaVersion'>) => Promise<void>
}

const typeOptions: {
  value: HealthMeasurementType
  label: string
  defaultUnit: string
}[] = [
  { value: 'weight', label: 'Weight', defaultUnit: 'kg' },
  { value: 'waistCircumference', label: 'Waist circumference', defaultUnit: 'cm' },
  { value: 'restingPulse', label: 'Resting pulse', defaultUnit: 'bpm' },
  {
    value: 'systolicBloodPressure',
    label: 'Systolic blood pressure',
    defaultUnit: 'mmHg',
  },
  {
    value: 'diastolicBloodPressure',
    label: 'Diastolic blood pressure',
    defaultUnit: 'mmHg',
  },
  { value: 'alt', label: 'ALT', defaultUnit: 'U/L' },
  { value: 'ast', label: 'AST', defaultUnit: 'U/L' },
  { value: 'alp', label: 'ALP', defaultUnit: 'U/L' },
  { value: 'ggt', label: 'GGT', defaultUnit: 'U/L' },
  { value: 'bilirubin', label: 'Bilirubin', defaultUnit: 'µmol/L' },
  { value: 'hba1c', label: 'HbA1c', defaultUnit: 'mmol/mol' },
  { value: 'glucose', label: 'Glucose', defaultUnit: 'mmol/L' },
  { value: 'totalCholesterol', label: 'Total cholesterol', defaultUnit: 'mmol/L' },
  { value: 'hdl', label: 'HDL', defaultUnit: 'mmol/L' },
  { value: 'ldl', label: 'LDL', defaultUnit: 'mmol/L' },
  { value: 'triglycerides', label: 'Triglycerides', defaultUnit: 'mmol/L' },
]

const plainLanguageHints: Partial<Record<HealthMeasurementType, string>> = {
  alt: 'A liver-function marker.',
  ast: 'A liver-function marker.',
  alp: 'A liver-function marker.',
  ggt: 'A liver-function marker, sometimes checked alongside alcohol use.',
  bilirubin: 'A liver-function marker.',
  hba1c: 'Average blood glucose over the past two to three months.',
  glucose: 'Blood sugar level at the time of the test.',
  totalCholesterol: 'A blood-fat marker.',
  hdl: 'A blood-fat marker, often called "good" cholesterol.',
  ldl: 'A blood-fat marker, often called "bad" cholesterol.',
  triglycerides: 'A blood-fat marker.',
}

export function HealthMeasurementForm({ onCreate }: Props) {
  const [type, setType] = useState<HealthMeasurementType>('weight')
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState(typeOptions[0]!.defaultUnit)
  const [referenceMin, setReferenceMin] = useState('')
  const [referenceMax, setReferenceMax] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  function handleTypeChange(next: HealthMeasurementType) {
    setType(next)
    const option = typeOptions.find((o) => o.value === next)
    if (option) setUnit(option.defaultUnit)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === '') return
    setSaving(true)
    await onCreate({
      type,
      value: Number(value),
      unit,
      measuredAt: nowIsoDateTime(),
      referenceMin: referenceMin === '' ? undefined : Number(referenceMin),
      referenceMax: referenceMax === '' ? undefined : Number(referenceMax),
      notes: notes.trim() || undefined,
    })
    setSaving(false)
    setValue('')
    setReferenceMin('')
    setReferenceMax('')
    setNotes('')
  }

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <h2>Add a measurement</h2>
      <div className="field">
        <label htmlFor="measurement-type">Type</label>
        <select
          id="measurement-type"
          value={type}
          onChange={(e) => handleTypeChange(e.target.value as HealthMeasurementType)}
        >
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {plainLanguageHints[type] && <p className="hint">{plainLanguageHints[type]}</p>}
      </div>
      <TextField label="Value" type="number" value={value} onChange={setValue} required />
      <TextField label="Unit" value={unit} onChange={setUnit} required />
      <TextField
        label="Reference minimum (optional)"
        type="number"
        value={referenceMin}
        onChange={setReferenceMin}
        hint="From the laboratory report, if supplied."
      />
      <TextField
        label="Reference maximum (optional)"
        type="number"
        value={referenceMax}
        onChange={setReferenceMax}
      />
      <TextField label="Notes (optional)" multiline value={notes} onChange={setNotes} />
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save measurement'}
      </button>
    </form>
  )
}
