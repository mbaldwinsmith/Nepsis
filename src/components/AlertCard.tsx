import { Link } from 'react-router-dom'
import type { AlertTrigger } from '../rules/alertEngine'
import { formatIsoDateForDisplay } from '../utils/date'

interface Props {
  trigger: AlertTrigger
  onDismiss: () => void
}

const sourceLabels: Record<string, string> = {
  'self-report': 'Self-report',
  'observer-report': 'Observer report',
  commitments: 'Commitments',
}

export function AlertCard({ trigger, onDismiss }: Props) {
  const isAct = trigger.severity === 'act'

  return (
    <div
      className="card stack"
      style={{
        borderLeft: `3px solid ${isAct ? 'var(--color-urgent)' : 'var(--color-review)'}`,
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 'var(--space-2)',
        }}
      >
        <strong>{trigger.ruleLabel}</strong>
        <span
          style={{
            fontWeight: 700,
            fontSize: 'var(--text-label)',
            color: isAct ? 'var(--color-urgent)' : 'var(--color-review)',
            alignSelf: 'flex-start',
          }}
        >
          {isAct ? 'Act' : 'Review'}
        </span>
      </div>

      <p className="hint" style={{ margin: 0 }}>
        {formatIsoDateForDisplay(trigger.dateRangeStart)} –{' '}
        {formatIsoDateForDisplay(trigger.dateRangeEnd)}
      </p>

      <p style={{ margin: 0 }}>{trigger.summary}</p>

      <details>
        <summary>What triggered this ({trigger.evidence.length})</summary>
        <ul style={{ margin: 'var(--space-2) 0 0', paddingLeft: '1.2rem' }}>
          {trigger.evidence.map((e, i) => (
            <li key={i}>
              <span className="hint">
                {formatIsoDateForDisplay(e.date)} · {sourceLabels[e.source] ?? e.source}:
              </span>{' '}
              {e.description}
            </li>
          ))}
        </ul>
      </details>

      <p style={{ margin: 0 }}>{trigger.actionText}</p>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Link to="/safety-plan" className="btn" style={{ textDecoration: 'none' }}>
          View safety plan
        </Link>
        <button type="button" className="btn" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  )
}
