import { checkInSteps } from './steps'
import { summarizeStep } from './reviewFormat'
import type { CheckInDraft } from './useDailyCheckIn'

interface Props {
  draft: CheckInDraft
  onEditStep: (stepIndex: number) => void
}

export function ReviewStep({ draft, onEditStep }: Props) {
  return (
    <section className="stack">
      <h2>Review</h2>
      <p className="hint">
        Check what you've recorded before saving. Anything left blank is saved as not
        recorded, not as zero.
      </p>
      {checkInSteps.map((step, index) => {
        const rows = summarizeStep(step, draft)
        const isNote = step.section === 'notes'
        return (
          <div className="card stack" key={step.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <strong>{step.title}</strong>
              <button type="button" className="btn" onClick={() => onEditStep(index)}>
                Edit
              </button>
            </div>
            {rows.length === 0 ? (
              <p className="hint" style={{ margin: 0 }}>
                Not recorded
              </p>
            ) : isNote ? (
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{rows[0]!.value}</p>
            ) : (
              <dl className="stack" style={{ margin: 0, gap: 'var(--space-2)' }}>
                {rows.map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <dt className="hint">{row.label}</dt>
                    <dd style={{ margin: 0, textAlign: 'right' }}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )
      })}
    </section>
  )
}
