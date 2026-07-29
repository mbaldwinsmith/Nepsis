import { isOutsideReferenceRange, type HealthMeasurement } from '../../data/schemas'
import { HEALTH_MEASUREMENT_TYPE_LABELS } from '../../utils/enumLabels'

export function HealthMeasurementCard({
  measurement: m,
}: {
  measurement: HealthMeasurement
}) {
  const outside = isOutsideReferenceRange(m)
  const hasReferenceRange = m.referenceMin !== undefined || m.referenceMax !== undefined

  return (
    <div className="card">
      <strong>
        {m.value} {m.unit}
      </strong>{' '}
      <span className="hint">{HEALTH_MEASUREMENT_TYPE_LABELS[m.type] ?? m.type}</span>
      <p className="hint" style={{ margin: 0 }}>
        {new Date(m.measuredAt).toLocaleString()}
        {hasReferenceRange
          ? ` · Reference range: ${m.referenceMin ?? '—'} to ${m.referenceMax ?? '—'} ${m.unit}`
          : ''}
      </p>
      {outside && (
        <p style={{ color: 'var(--color-review)', margin: 0 }}>
          Outside the supplied reference range — discuss with your clinician.
        </p>
      )}
      {m.notes && <p style={{ margin: 0 }}>{m.notes}</p>}
    </div>
  )
}
