import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/toastContext'
import { TextField } from '../../components/TextField'
import { useDailyCheckIn } from './useDailyCheckIn'
import { checkInSteps } from './steps'
import { ReviewStep } from './ReviewStep'
import { SleepLastNightSection } from './sections/SleepLastNightSection'
import { SleepFallingAsleepSection } from './sections/SleepFallingAsleepSection'
import { SleepDaytimeRestSection } from './sections/SleepDaytimeRestSection'
import { MoodTodaySection } from './sections/MoodTodaySection'
import { MoodPaceSection } from './sections/MoodPaceSection'
import { WarningSignsSection } from './sections/WarningSignsSection'
import { AlcoholSection } from './sections/AlcoholSection'
import { SocialActivitySection } from './sections/SocialActivitySection'
import { AppetiteEatingSection } from './sections/AppetiteEatingSection'
import { AppetiteUrgesSection } from './sections/AppetiteUrgesSection'
import { MedicationEffectsSection } from './sections/MedicationEffectsSection'
import { todayIsoDate } from '../../utils/date'

const TOTAL_STEPS = checkInSteps.length

export function CheckInPage() {
  const entryDate = todayIsoDate()
  const { draft, setDraft, existing, loading, save } = useDailyCheckIn(entryDate)
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [saving, setSaving] = useState(false)
  const stepContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    stepContentRef.current?.focus()
  }, [stepIndex])

  if (loading) {
    return (
      <div className="page page--narrow">
        <p>Loading…</p>
      </div>
    )
  }

  const isReview = stepIndex === TOTAL_STEPS
  const step = checkInSteps[stepIndex]

  async function handleSave() {
    setSaving(true)
    const result = await save()
    setSaving(false)
    if (result.success) {
      showToast('Check-in saved', 'success')
      navigate('/')
    } else {
      showToast(result.error, 'error')
    }
  }

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, TOTAL_STEPS))
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  function renderStepContent() {
    if (!step) return null
    switch (step.id) {
      case 'sleep-last-night':
        return (
          <SleepLastNightSection
            value={draft.sleep}
            onChange={(sleep) => setDraft({ ...draft, sleep })}
          />
        )
      case 'sleep-falling-asleep':
        return (
          <SleepFallingAsleepSection
            value={draft.sleep}
            onChange={(sleep) => setDraft({ ...draft, sleep })}
          />
        )
      case 'sleep-daytime-rest':
        return (
          <SleepDaytimeRestSection
            value={draft.sleep}
            onChange={(sleep) => setDraft({ ...draft, sleep })}
          />
        )
      case 'mood-today':
        return (
          <MoodTodaySection
            value={draft.mood}
            onChange={(mood) => setDraft({ ...draft, mood })}
          />
        )
      case 'mood-pace':
        return (
          <MoodPaceSection
            value={draft.mood}
            onChange={(mood) => setDraft({ ...draft, mood })}
          />
        )
      case 'warning-signs':
        return (
          <WarningSignsSection
            value={draft.warningSigns}
            onChange={(warningSigns) => setDraft({ ...draft, warningSigns })}
          />
        )
      case 'alcohol':
        return (
          <AlcoholSection
            value={draft.alcohol}
            onChange={(alcohol) => setDraft({ ...draft, alcohol })}
          />
        )
      case 'social':
        return (
          <SocialActivitySection
            value={draft.social}
            onChange={(social) => setDraft({ ...draft, social })}
          />
        )
      case 'appetite-eating':
        return (
          <AppetiteEatingSection
            value={draft.appetite}
            onChange={(appetite) => setDraft({ ...draft, appetite })}
          />
        )
      case 'appetite-urges':
        return (
          <AppetiteUrgesSection
            value={draft.urges}
            onChange={(urges) => setDraft({ ...draft, urges })}
          />
        )
      case 'medication':
        return (
          <MedicationEffectsSection
            value={draft.medicationEffects}
            onChange={(medicationEffects) => setDraft({ ...draft, medicationEffects })}
          />
        )
      case 'note':
        return (
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
        )
      default:
        return null
    }
  }

  const progressFraction = (isReview ? TOTAL_STEPS : stepIndex) / TOTAL_STEPS

  return (
    <div className="page page--narrow stack check-in">
      <h1 className="visually-hidden">Daily check-in</h1>
      <div className="check-in__header">
        <div className="check-in__header-row">
          {stepIndex > 0 ? (
            <button type="button" className="btn" onClick={goBack}>
              Back
            </button>
          ) : (
            <span />
          )}
          <p className="check-in__step-label" aria-live="polite">
            {isReview ? 'Review' : `Step ${stepIndex + 1} of ${TOTAL_STEPS}`}
          </p>
          <button type="button" className="btn" onClick={handleSave} disabled={saving}>
            Save &amp; close
          </button>
        </div>
        <div className="check-in__progress" aria-hidden="true">
          <div
            className="check-in__progress-bar"
            style={{ width: `${progressFraction * 100}%` }}
          />
        </div>
      </div>

      <div ref={stepContentRef} tabIndex={-1}>
        {isReview ? (
          <ReviewStep draft={draft} onEditStep={setStepIndex} />
        ) : (
          renderStepContent()
        )}
      </div>

      {isReview ? (
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : existing ? 'Update check-in' : 'Save check-in'}
        </button>
      ) : (
        <div className="check-in__nav">
          <button type="button" className="btn" onClick={goNext}>
            Skip
          </button>
          <button type="button" className="btn btn-primary" onClick={goNext}>
            {stepIndex === TOTAL_STEPS - 1 ? 'Review' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  )
}
