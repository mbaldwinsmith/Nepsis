import { useHealthMeasurements } from './useHealthMeasurements'
import { HealthMeasurementForm } from './HealthMeasurementForm'
import { HealthMeasurementCard } from './HealthMeasurementCard'
import { ShowMoreList } from '../../components/ShowMoreList'
import { useToast } from '../../components/toastContext'

export function HealthPage() {
  const { measurements, loading, create } = useHealthMeasurements()
  const { showToast } = useToast()

  async function handleCreate(input: Parameters<typeof create>[0]) {
    try {
      await create(input)
      showToast('Measurement recorded', 'success')
    } catch {
      showToast('Could not record this measurement. Please try again.', 'error')
    }
  }

  return (
    <div className="page stack">
      <h1>Health measurements</h1>
      <HealthMeasurementForm onCreate={handleCreate} />
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
