import { useState } from 'react'
import { SegmentedControl } from '../../components/SegmentedControl'
import { TextField } from '../../components/TextField'
import type {
  MedicationDefinition,
  MedicationEntry,
  MedicationEntryStatus,
} from '../../data/schemas'
import { nowIsoDateTime } from '../../utils/date'

interface Props {
  definitions: MedicationDefinition[]
  entries: MedicationEntry[]
  onCreate: (input: Omit<MedicationEntry, 'id' | 'schemaVersion'>) => Promise<void>
}

export function DoseLog({ definitions, entries, onCreate }: Props) {
  const active = definitions.filter((d) => d.active)
  const [medicationDefinitionId, setMedicationDefinitionId] = useState(
    active[0]?.id ?? '',
  )
  const [status, setStatus] = useState<MedicationEntryStatus>('taken')
  const [doseTaken, setDoseTaken] = useState('')
  const [unit, setUnit] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!medicationDefinitionId) return
    await onCreate({
      medicationDefinitionId,
      takenAt: nowIsoDateTime(),
      status,
      doseTaken: doseTaken === '' ? undefined : Number(doseTaken),
      unit: unit || undefined,
    })
    setDoseTaken('')
  }

  if (active.length === 0) {
    return (
      <section className="card">
        <h2>Log a dose</h2>
        <p className="hint">Add a medication above before logging a dose.</p>
      </section>
    )
  }

  return (
    <section className="card stack">
      <h2>Log a dose</h2>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="medication-select">Medication</label>
          <select
            id="medication-select"
            value={medicationDefinitionId}
            onChange={(e) => setMedicationDefinitionId(e.target.value)}
          >
            {active.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <SegmentedControl
          legend="Status"
          name="doseStatus"
          options={[
            { value: 'taken', label: 'Taken' },
            { value: 'delayed', label: 'Delayed' },
            { value: 'missed', label: 'Missed' },
            { value: 'notScheduled', label: 'Not scheduled' },
          ]}
          value={status}
          onChange={setStatus}
        />
        <TextField
          label="Dose taken (optional)"
          type="number"
          value={doseTaken}
          onChange={setDoseTaken}
        />
        <TextField label="Unit (optional)" value={unit} onChange={setUnit} />
        <button type="submit" className="btn btn-primary">
          Log dose
        </button>
      </form>
      {entries.length > 0 && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} className="stack">
          {entries.slice(0, 5).map((entry) => {
            const def = definitions.find((d) => d.id === entry.medicationDefinitionId)
            return (
              <li key={entry.id} className="hint">
                {new Date(entry.takenAt).toLocaleString()} — {def?.name ?? 'Unknown'} —{' '}
                {entry.status}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
