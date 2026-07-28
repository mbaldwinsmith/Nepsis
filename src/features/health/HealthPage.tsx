import { useHealthMeasurements } from './useHealthMeasurements'
import { HealthMeasurementForm } from './HealthMeasurementForm'
import { HealthMeasurementCard } from './HealthMeasurementCard'
import { ShowMoreList } from '../../components/ShowMoreList'

export function HealthPage() {
  const { measurements, loading, create } = useHealthMeasurements()

  return (
    <div className="page stack">
      <h1>Health measurements</h1>
      <HealthMeasurementForm onCreate={create} />
      {loading ? (
        <p>Loading…</p>
      ) : measurements.length === 0 ? (
        <p className="hint">No measurements recorded yet.</p>
      ) : (
        <ShowMoreList
          items={measurements}
          getKey={(measurement) => measurement.id}
          renderItem={(measurement) => (
            <HealthMeasurementCard measurement={measurement} />
          )}
        />
      )}
    </div>
  )
}
