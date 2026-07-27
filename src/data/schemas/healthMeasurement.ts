import { z } from 'zod'
import { id, isoDateTime, optionalText, SCHEMA_VERSION } from './shared'

export const healthMeasurementTypeSchema = z.enum([
  'weight',
  'waistCircumference',
  'restingPulse',
  'systolicBloodPressure',
  'diastolicBloodPressure',
  'alt',
  'ast',
  'alp',
  'ggt',
  'bilirubin',
  'hba1c',
  'glucose',
  'totalCholesterol',
  'hdl',
  'ldl',
  'triglycerides',
])

export const healthMeasurementSchema = z
  .object({
    id: id(),
    schemaVersion: z.literal(SCHEMA_VERSION),
    measuredAt: isoDateTime(),
    type: healthMeasurementTypeSchema,
    value: z.number(),
    unit: z.string().trim().min(1).max(20),
    referenceMin: z.number().optional(),
    referenceMax: z.number().optional(),
    notes: optionalText(),
  })
  .refine(
    (v) =>
      v.referenceMin === undefined ||
      v.referenceMax === undefined ||
      v.referenceMin <= v.referenceMax,
    {
      message: 'Reference minimum must not be greater than reference maximum',
      path: ['referenceMin'],
    },
  )

export type HealthMeasurement = z.infer<typeof healthMeasurementSchema>
export type HealthMeasurementType = z.infer<typeof healthMeasurementTypeSchema>

/** Non-interpretive helper: compares a value against a user-supplied reference range only. */
export function isOutsideReferenceRange(
  measurement: Pick<HealthMeasurement, 'value' | 'referenceMin' | 'referenceMax'>,
): boolean {
  const { value, referenceMin, referenceMax } = measurement
  if (referenceMin === undefined && referenceMax === undefined) return false
  if (referenceMin !== undefined && value < referenceMin) return true
  if (referenceMax !== undefined && value > referenceMax) return true
  return false
}
