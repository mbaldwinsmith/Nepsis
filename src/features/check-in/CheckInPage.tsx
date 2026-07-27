import { useState } from 'react'
import { useToast } from '../../components/toastContext'
import { TextField } from '../../components/TextField'
import { useDailyCheckIn } from './useDailyCheckIn'
import { SleepSection } from './sections/SleepSection'
import { MoodSection } from './sections/MoodSection'
import { WarningSignsSection } from './sections/WarningSignsSection'
import { DailyRhythmSection } from './sections/DailyRhythmSection'
import { AppetiteSection } from './sections/AppetiteSection'
import { MedicationEffectsSection } from './sections/MedicationEffectsSection'
import { formatIsoDateForDisplay, todayIsoDate } from '../../utils/date'

export function CheckInPage() {
  const entryDate = todayIsoDate()
  const { draft, setDraft, existing, loading, save } = useDailyCheckIn(entryDate)
  const { showToast } = useToast()
  const [saving, setSaving] = useState(false)

  if (loading) {
    return (
      <div className="page">
        <p>Loading…</p>
      </div>
    )
  }

  async function handleSave() {
    setSaving(true)
    const result = await save()
    setSaving(false)
    if (result.success) {
      showToast('Check-in saved', 'success')
    } else {
      showToast(result.error, 'error')
    }
  }

  return (
    <div className="page stack">
      <div>
        <h1>Daily check-in</h1>
        <p className="hint">{formatIsoDateForDisplay(entryDate)}</p>
        {existing && (
          <p className="hint">
            Last updated {new Date(existing.updatedAt).toLocaleTimeString()}
          </p>
        )}
      </div>

      <SleepSection
        value={draft.sleep}
        onChange={(sleep) => setDraft({ ...draft, sleep })}
      />
      <MoodSection value={draft.mood} onChange={(mood) => setDraft({ ...draft, mood })} />
      <WarningSignsSection
        value={draft.warningSigns}
        onChange={(warningSigns) => setDraft({ ...draft, warningSigns })}
      />
      <DailyRhythmSection
        alcohol={draft.alcohol}
        social={draft.social}
        onChangeAlcohol={(alcohol) => setDraft({ ...draft, alcohol })}
        onChangeSocial={(social) => setDraft({ ...draft, social })}
      />
      <AppetiteSection
        appetite={draft.appetite}
        urges={draft.urges}
        onChangeAppetite={(appetite) => setDraft({ ...draft, appetite })}
        onChangeUrges={(urges) => setDraft({ ...draft, urges })}
      />
      <MedicationEffectsSection
        value={draft.medicationEffects}
        onChange={(medicationEffects) => setDraft({ ...draft, medicationEffects })}
      />

      <section className="card stack">
        <h2>Note</h2>
        <TextField
          label="Optional note"
          multiline
          value={draft.notes}
          onChange={(notes) => setDraft({ ...draft, notes })}
          hint="Describe what you observed, not what it means."
        />
      </section>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving…' : existing ? 'Update check-in' : 'Save check-in'}
      </button>
    </div>
  )
}
