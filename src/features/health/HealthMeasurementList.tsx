import { isOutsideReferenceRange, type HealthMeasurement } from '../../data/schemas'

export function HealthMeasurementList({
  measurements,
}: {
  measurements: HealthMeasurement[]
}) {
  if (measurements.length === 0) {
    return <p className="hint">No measurements recorded yet.</p>
  }

  return (
    <div className="stack">
      {measurements.map((m) => {
        const outside = isOutsideReferenceRange(m)
        return (
          <div key={m.id} className="card">
            <strong>
              {m.value} {m.unit}
            </strong>{' '}
            <span className="hint">{m.type}</span>
            <p className="hint" style={{ margin: 0 }}>
              {new Date(m.measuredAt).toLocaleString()}
            </p>
            {(m.referenceMin !== undefined || m.referenceMax !== undefined) && (
              <p className="hint" style={{ margin: 0 }}>
                Reference range: {m.referenceMin ?? '—'} to {m.referenceMax ?? '—'}{' '}
                {m.unit}
              </p>
            )}
            {outside && (
              <p style={{ color: 'var(--color-review)', margin: 0 }}>
                Outside the supplied reference range — discuss with your clinician.
              </p>
            )}
            {m.notes && <p style={{ margin: 0 }}>{m.notes}</p>}
          </div>
        )
      })}
    </div>
  )
}
