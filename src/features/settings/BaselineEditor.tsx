import { useState } from 'react'
import { TextField } from '../../components/TextField'
import type { PersonalBaseline } from '../../data/schemas'
import { useToast } from '../../components/toastContext'

type BaselineDraft = Omit<PersonalBaseline, 'id' | 'schemaVersion'>

interface Props {
  baseline: BaselineDraft
  onSave: (next: BaselineDraft) => Promise<void>
}

function numberField(value: number | undefined) {
  return value === undefined ? '' : String(value)
}

export function BaselineEditor({ baseline, onSave }: Props) {
  const [draft, setDraft] = useState(baseline)
  const { showToast } = useToast()

  function setNumber(key: keyof BaselineDraft, raw: string) {
    setDraft({ ...draft, [key]: raw === '' ? undefined : Number(raw) })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSave(draft)
    showToast('Baseline saved', 'success')
  }

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <h2>Personal baseline</h2>
      <p className="hint">
        Optional. Recording what is usual for you helps trends and review rules stay
        personalised rather than assuming a universal "normal".
      </p>
      <TextField
        label="Usual sleep duration (minutes)"
        type="number"
        value={numberField(draft.usualSleepDurationMinutes)}
        onChange={(v) => setNumber('usualSleepDurationMinutes', v)}
      />
      <TextField
        label="Usual lunchtime nap need (0-3)"
        type="number"
        value={numberField(draft.usualLunchtimeNapNeed)}
        onChange={(v) => setNumber('usualLunchtimeNapNeed', v)}
      />
      <TextField
        label="Usual weekly alcohol units"
        type="number"
        value={numberField(draft.usualWeeklyAlcoholUnits)}
        onChange={(v) => setNumber('usualWeeklyAlcoholUnits', v)}
      />
      <TextField
        label="Usual social activity (0-4)"
        type="number"
        value={numberField(draft.usualSocialActivity)}
        onChange={(v) => setNumber('usualSocialActivity', v)}
      />
      <TextField
        label="Usual social drive (-2 to 2)"
        type="number"
        value={numberField(draft.usualSocialDrive)}
        onChange={(v) => setNumber('usualSocialDrive', v)}
      />
      <TextField
        label="Usual appetite (0-4)"
        type="number"
        value={numberField(draft.usualAppetite)}
        onChange={(v) => setNumber('usualAppetite', v)}
      />
      <TextField
        label="Usual satiety (0-4)"
        type="number"
        value={numberField(draft.usualSatiety)}
        onChange={(v) => setNumber('usualSatiety', v)}
      />
      <TextField
        label="Usual energy (0-4)"
        type="number"
        value={numberField(draft.usualEnergy)}
        onChange={(v) => setNumber('usualEnergy', v)}
      />
      <TextField
        label="Comparison window (days)"
        type="number"
        value={numberField(draft.comparisonWindowDays)}
        onChange={(v) => setNumber('comparisonWindowDays', v)}
      />
      <TextField
        label="Notes (optional)"
        multiline
        value={draft.notes ?? ''}
        onChange={(v) => setDraft({ ...draft, notes: v || undefined })}
      />
      <button type="submit" className="btn btn-primary">
        Save baseline
      </button>
    </form>
  )
}
