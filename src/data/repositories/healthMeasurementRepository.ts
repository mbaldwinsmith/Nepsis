import { db } from '../db'
import {
  healthMeasurementSchema,
  type HealthMeasurement,
  type HealthMeasurementType,
} from '../schemas'
import { createRepository } from './createRepository'

const base = createRepository<HealthMeasurement>(
  db.healthMeasurements,
  healthMeasurementSchema,
)

export const healthMeasurementRepository = {
  ...base,
  async listByType(type: HealthMeasurementType): Promise<HealthMeasurement[]> {
    return db.healthMeasurements.where('type').equals(type).sortBy('measuredAt')
  },
}
