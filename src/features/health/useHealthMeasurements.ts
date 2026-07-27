import { useEffect, useState } from 'react'
import { healthMeasurementRepository } from '../../data/repositories'
import { SCHEMA_VERSION, type HealthMeasurement } from '../../data/schemas'

export function useHealthMeasurements() {
  const [measurements, setMeasurements] = useState<HealthMeasurement[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const all = await healthMeasurementRepository.list()
    all.sort((a, b) => (a.measuredAt < b.measuredAt ? 1 : -1))
    setMeasurements(all)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  async function create(input: Omit<HealthMeasurement, 'id' | 'schemaVersion'>) {
    await healthMeasurementRepository.create({
      ...input,
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
    })
    await refresh()
  }

  return { measurements, loading, create }
}
