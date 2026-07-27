import { useHealthMeasurements } from './useHealthMeasurements'
import { HealthMeasurementForm } from './HealthMeasurementForm'
import { HealthMeasurementList } from './HealthMeasurementList'

export function HealthPage() {
  const { measurements, loading, create } = useHealthMeasurements()

  return (
    <div className="page stack">
      <h1>Health measurements</h1>
      <HealthMeasurementForm onCreate={create} />
      {loading ? <p>Loading…</p> : <HealthMeasurementList measurements={measurements} />}
    </div>
  )
}
