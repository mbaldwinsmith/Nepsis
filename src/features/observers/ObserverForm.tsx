import { useState } from 'react'
import { ScaleInput } from '../../components/ScaleInput'
import { SegmentedControl } from '../../components/SegmentedControl'
import { CheckboxField } from '../../components/CheckboxField'
import { TextField } from '../../components/TextField'
import { NONE_TO_SEVERE_SHORT } from '../../utils/scaleWords'
import type {
  ObservedActivity,
  ObservedSpeech,
  ObserverConcern,
  ObserverEntry,
  PerceivedMood,
} from '../../data/schemas'
import { todayIsoDate } from '../../utils/date'

interface Props {
  onCreate: (
    input: Omit<ObserverEntry, 'id' | 'schemaVersion' | 'recordedAt'>,
  ) => Promise<void>
}

export function ObserverForm({ onCreate }: Props) {
  const [observationDate, setObservationDate] = useState(todayIsoDate())
  const [observerLabel, setObserverLabel] = useState('')
  const [perceivedMood, setPerceivedMood] = useState<PerceivedMood | undefined>()
  const [speech, setSpeech] = useState<ObservedSpeech | undefined>()
  const [activity, setActivity] = useState<ObservedActivity | undefined>()
  const [irritability, setIrritability] = useState<number | undefined>()
  const [restlessness, setRestlessness] = useState<number | undefined>()
  const [impulsive, setImpulsive] = useState(false)
  const [concern, setConcern] = useState<ObserverConcern>('none')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!observerLabel.trim()) return
    setSaving(true)
    await onCreate({
      observationDate,
      observerLabel: observerLabel.trim(),
      perceivedMood,
      speech,
      activity,
      irritability,
      restlessness,
      impulsiveOrUncharacteristicBehaviour: impulsive || undefined,
      concern,
      note: note.trim() || undefined,
    })
    setSaving(false)
    setNote('')
  }

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <h2>Observer check-in</h2>
      <p className="hint">Describe what you observed, not what you think it means.</p>
      <TextField
        label="Your label (e.g. Mum, Dad, Friend A)"
        value={observerLabel}
        onChange={setObserverLabel}
        required
      />
      <TextField
        label="Date observed"
        type="date"
        value={observationDate}
        onChange={setObservationDate}
      />
      <SegmentedControl
        legend="Perceived mood"
        name="perceivedMood"
        options={[
          { value: 'low', label: 'Low' },
          { value: 'usual', label: 'Usual' },
          { value: 'elevated', label: 'Elevated' },
          { value: 'uncertain', label: 'Uncertain' },
        ]}
        value={perceivedMood}
        onChange={setPerceivedMood}
      />
      <SegmentedControl
        legend="Speech"
        name="speech"
        options={[
          { value: 'usual', label: 'Usual' },
          { value: 'faster', label: 'Faster' },
          { value: 'pressured', label: 'Pressured' },
        ]}
        value={speech}
        onChange={setSpeech}
      />
      <SegmentedControl
        legend="Activity"
        name="activity"
        options={[
          { value: 'usual', label: 'Usual' },
          { value: 'withdrawn', label: 'Withdrawn' },
          { value: 'unusuallyDriven', label: 'Unusually driven' },
        ]}
        value={activity}
        onChange={setActivity}
      />
      <ScaleInput
        legend="Irritability"
        name="observerIrritability"
        min={0}
        max={3}
        value={irritability}
        onChange={setIrritability}
        minLabel="None"
        maxLabel="Severe"
        words={NONE_TO_SEVERE_SHORT}
      />
      <ScaleInput
        legend="Restlessness"
        name="observerRestlessness"
        min={0}
        max={3}
        value={restlessness}
        onChange={setRestlessness}
        minLabel="None"
        maxLabel="Severe"
        words={NONE_TO_SEVERE_SHORT}
      />
      <CheckboxField
        label="Impulsive or uncharacteristic behaviour"
        checked={impulsive}
        onChange={setImpulsive}
      />
      <SegmentedControl
        legend="Concern"
        name="concern"
        options={[
          { value: 'none', label: 'None' },
          { value: 'keepWatching', label: 'Keep watching' },
          { value: 'discussSoon', label: 'Discuss soon' },
          { value: 'urgent', label: 'Urgent' },
        ]}
        value={concern}
        onChange={setConcern}
      />
      <TextField
        label="Optional factual note"
        multiline
        value={note}
        onChange={setNote}
      />
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save observation'}
      </button>
    </form>
  )
}
