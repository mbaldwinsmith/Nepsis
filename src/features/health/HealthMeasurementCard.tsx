import { isOutsideReferenceRange, type HealthMeasurement } from '../../data/schemas'

export function HealthMeasurementCard({
  measurement: m,
}: {
  measurement: HealthMeasurement
}) {
  const outside = isOutsideReferenceRange(m)
  return (
    <div className="card">
      <strong>
        {m.value} {m.unit}
      </strong>{' '}
      <span className="hint">{m.type}</span>
      <p className="hint" style={{ margin: 0 }}>
        {new Date(m.measuredAt).toLocaleString()}
      </p>
      {(m.referenceMin !== undefined || m.referenceMax !== undefined) && (
        <p className="hint" style={{ margin: 0 }}>
          Reference range: {m.referenceMin ?? '—'} to {m.referenceMax ?? '—'} {m.unit}
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
}
