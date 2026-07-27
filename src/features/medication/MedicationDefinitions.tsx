import { useState } from 'react'
import { TextField } from '../../components/TextField'
import type { MedicationDefinition } from '../../data/schemas'

interface Props {
  definitions: MedicationDefinition[]
  onCreate: (input: {
    name: string
    formulation?: string
    notes?: string
  }) => Promise<void>
  onArchive: (definition: MedicationDefinition) => Promise<void>
}

export function MedicationDefinitions({ definitions, onCreate, onArchive }: Props) {
  const [name, setName] = useState('')
  const [formulation, setFormulation] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await onCreate({ name: name.trim(), formulation: formulation.trim() || undefined })
    setName('')
    setFormulation('')
  }

  return (
    <section className="card stack">
      <h2>Medications</h2>
      <p className="hint">
        Only change medication according to the plan agreed with your prescriber.
      </p>
      {definitions.length === 0 ? (
        <p className="hint">No medications recorded yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} className="stack">
          {definitions.map((d) => (
            <li
              key={d.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: d.active ? 1 : 0.6,
              }}
            >
              <span>
                {d.name}
                {d.formulation ? ` (${d.formulation})` : ''} {!d.active && '· archived'}
              </span>
              {d.active && (
                <button type="button" className="btn" onClick={() => onArchive(d)}>
                  Archive
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <form className="stack" onSubmit={handleSubmit}>
        <TextField label="Medication name" value={name} onChange={setName} required />
        <TextField
          label="Formulation (optional)"
          value={formulation}
          onChange={setFormulation}
        />
        <button type="submit" className="btn btn-primary">
          Add medication
        </button>
      </form>
    </section>
  )
}
