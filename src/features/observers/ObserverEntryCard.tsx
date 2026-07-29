import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { safetyPlanRepository } from '../../data/repositories'
import type { ObserverEntry, SafetyPlan } from '../../data/schemas'
import { formatIsoDateForDisplay } from '../../utils/date'

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
        borderLeft: '4px solid var(--color-urgent)',
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
      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-2)',
          margin: 0,
        }}
      >
        {entry.perceivedMood && (
          <>
            <dt className="hint">Mood</dt>
            <dd style={{ margin: 0 }}>{entry.perceivedMood}</dd>
          </>
        )}
        {entry.speech && (
          <>
            <dt className="hint">Speech</dt>
            <dd style={{ margin: 0 }}>{entry.speech}</dd>
          </>
        )}
        {entry.activity && (
          <>
            <dt className="hint">Activity</dt>
            <dd style={{ margin: 0 }}>{entry.activity}</dd>
          </>
        )}
      </dl>
      {entry.note && <p style={{ margin: 0 }}>{entry.note}</p>}
      <p className="hint" style={{ margin: 0 }}>
        Concern: {entry.concern}
      </p>
      {entry.concern === 'urgent' && <UrgentSafetyPlanActions />}
    </div>
  )
}
