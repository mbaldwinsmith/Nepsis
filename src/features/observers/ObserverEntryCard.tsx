import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { safetyPlanRepository } from '../../data/repositories'
import type { ObserverEntry, SafetyPlan } from '../../data/schemas'
import { formatIsoDateForDisplay } from '../../utils/date'
import {
  PERCEIVED_MOOD_LABELS,
  OBSERVED_SPEECH_LABELS,
  OBSERVED_ACTIVITY_LABELS,
  OBSERVER_CONCERN_LABELS,
} from '../../utils/enumLabels'

function UrgentSafetyPlanActions() {
  const [plan, setPlan] = useState<SafetyPlan | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    safetyPlanRepository.getSingleton().then((found) => {
      setPlan(found)
      setLoading(false)
    })
  }, [])

  if (loading) return null

  return (
    <div
      className="stack"
      style={{
        borderLeft: '3px solid var(--color-urgent)',
        background: 'var(--color-urgent-bg)',
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <strong style={{ color: 'var(--color-urgent)' }}>
        Safety plan: what &quot;act&quot; means
      </strong>
      {plan?.urgentActions ? (
        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{plan.urgentActions}</p>
      ) : (
        <p style={{ margin: 0 }}>
          No urgent actions have been configured yet.{' '}
          <Link to="/safety-plan">Set up the safety plan</Link>.
        </p>
      )}
      <p className="hint" style={{ margin: 0 }}>
        <Link to="/safety-plan">View the full safety plan</Link>
      </p>
    </div>
  )
}

export function ObserverEntryCard({ entry }: { entry: ObserverEntry }) {
  return (
    <div
      className="card stack"
      style={{
        borderLeft: '4px solid var(--color-accent)',
        background: 'var(--color-surface-raised)',
      }}
    >
      <div>
        <strong>Observer: {entry.observerLabel}</strong>
        <p className="hint" style={{ margin: 0 }}>
          {formatIsoDateForDisplay(entry.observationDate)}
        </p>
      </div>
      {(entry.perceivedMood || entry.speech || entry.activity) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {entry.perceivedMood && (
            <span className="chip">
              Mood: {PERCEIVED_MOOD_LABELS[entry.perceivedMood]}
            </span>
          )}
          {entry.speech && (
            <span className="chip">Speech: {OBSERVED_SPEECH_LABELS[entry.speech]}</span>
          )}
          {entry.activity && (
            <span className="chip">
              Activity: {OBSERVED_ACTIVITY_LABELS[entry.activity]}
            </span>
          )}
        </div>
      )}
      {entry.note && <p style={{ margin: 0 }}>{entry.note}</p>}
      <p className="hint" style={{ margin: 0 }}>
        Concern: {OBSERVER_CONCERN_LABELS[entry.concern]}
      </p>
      {entry.concern === 'urgent' && <UrgentSafetyPlanActions />}
    </div>
  )
}
