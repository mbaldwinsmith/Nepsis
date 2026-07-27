import { useState } from 'react'
import { SegmentedControl } from '../../components/SegmentedControl'
import { TextField } from '../../components/TextField'
import type { CommitmentImportance, CommitmentType } from '../../data/schemas'
import { todayIsoDate } from '../../utils/date'

interface Props {
  onCreate: (input: {
    plannedDate: string
    plannedTime?: string
    title?: string
    type: CommitmentType
    importance: CommitmentImportance
  }) => Promise<void>
}

export function NewCommitmentForm({ onCreate }: Props) {
  const [plannedDate, setPlannedDate] = useState(todayIsoDate())
  const [plannedTime, setPlannedTime] = useState('')
  const [title, setTitle] = useState('')
  const [type, setType] = useState<CommitmentType>('friends')
  const [importance, setImportance] = useState<CommitmentImportance>('routine')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onCreate({
      plannedDate,
      plannedTime: plannedTime || undefined,
      title: title || undefined,
      type,
      importance,
    })
    setSaving(false)
    setTitle('')
  }

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <h2>New commitment</h2>
      <TextField
        label="Date"
        type="date"
        value={plannedDate}
        onChange={setPlannedDate}
        required
      />
      <TextField
        label="Time (optional)"
        type="time"
        value={plannedTime}
        onChange={setPlannedTime}
      />
      <TextField label="Title (optional)" value={title} onChange={setTitle} />
      <SegmentedControl
        legend="Type"
        name="commitmentType"
        options={[
          { value: 'friends', label: 'Friends' },
          { value: 'family', label: 'Family' },
          { value: 'work', label: 'Work' },
          { value: 'church', label: 'Church' },
          { value: 'appointment', label: 'Appointment' },
          { value: 'volunteering', label: 'Volunteering' },
          { value: 'other', label: 'Other' },
        ]}
        value={type}
        onChange={setType}
      />
      <SegmentedControl
        legend="Importance"
        name="commitmentImportance"
        options={[
          { value: 'routine', label: 'Routine' },
          { value: 'meaningful', label: 'Meaningful' },
          { value: 'essential', label: 'Essential' },
        ]}
        value={importance}
        onChange={setImportance}
      />
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Add commitment'}
      </button>
    </form>
  )
}
