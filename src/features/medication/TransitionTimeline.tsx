import { useState } from 'react'
import { SegmentedControl } from '../../components/SegmentedControl'
import { TextField } from '../../components/TextField'
import { AddDisclosure } from '../../components/AddDisclosure'
import type { TransitionEvent, TransitionEventType } from '../../data/schemas'
import { nowIsoDateTime } from '../../utils/date'

interface Props {
  events: TransitionEvent[]
  onCreate: (input: Omit<TransitionEvent, 'id' | 'schemaVersion'>) => Promise<void>
}

const typeLabels: Record<TransitionEventType, string> = {
  medicationStarted: 'Medication started',
  medicationStopped: 'Medication stopped',
  doseIncreased: 'Dose increased',
  doseReduced: 'Dose reduced',
  missedMedication: 'Missed medication',
  clinicianAppointment: 'Clinician appointment',
  illness: 'Illness',
  majorStress: 'Major stress',
  bloodTest: 'Blood test',
  custom: 'Custom',
}

export function TransitionTimeline({ events, onCreate }: Props) {
  const [type, setType] = useState<TransitionEventType>('clinicianAppointment')
  const [title, setTitle] = useState('')
  const [occurredAt, setOccurredAt] = useState(() => nowIsoDateTime().slice(0, 16))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await onCreate({
      type,
      title: title.trim(),
      occurredAt: new Date(occurredAt).toISOString(),
    })
    setTitle('')
  }

  return (
    <section className="card stack">
      <h2>Transition timeline</h2>
      {events.length === 0 ? (
        <p className="hint">No events recorded yet.</p>
      ) : (
        <ol className="timeline">
          {events.map((event, i) => (
            <li className="timeline__item" key={event.id}>
              <span className="timeline__rail" aria-hidden="true">
                <span className="timeline__node" />
                {i < events.length - 1 && <span className="timeline__connector" />}
              </span>
              <div className="timeline__content">
                <strong>{typeLabels[event.type]}</strong>
                <p className="hint" style={{ margin: 0 }}>
                  {new Date(event.occurredAt).toLocaleString()}
                </p>
                <p style={{ margin: 0 }}>{event.title}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      <AddDisclosure label="+ Add an event">
        <form className="stack" onSubmit={handleSubmit}>
          <SegmentedControl
            legend="Event type"
            name="transitionEventType"
            options={Object.entries(typeLabels).map(([value, label]) => ({
              value: value as TransitionEventType,
              label,
            }))}
            value={type}
            onChange={setType}
          />
          <TextField label="Title" value={title} onChange={setTitle} required />
          <TextField
            label="When"
            type="datetime-local"
            value={occurredAt}
            onChange={setOccurredAt}
          />
          <button type="submit" className="btn btn-primary">
            Add event
          </button>
        </form>
      </AddDisclosure>
    </section>
  )
}
