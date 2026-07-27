import { z } from 'zod'
import { id, isoDateTime, optionalText, SCHEMA_VERSION } from './shared'

export const transitionEventTypeSchema = z.enum([
  'medicationStarted',
  'medicationStopped',
  'doseIncreased',
  'doseReduced',
  'missedMedication',
  'clinicianAppointment',
  'illness',
  'majorStress',
  'bloodTest',
  'custom',
])

export const transitionEventSchema = z.object({
  id: id(),
  schemaVersion: z.literal(SCHEMA_VERSION),
  occurredAt: isoDateTime(),
  type: transitionEventTypeSchema,
  title: z.string().trim().min(1).max(160),
  description: optionalText(),
  linkedMedicationDefinitionId: id().optional(),
})

export type TransitionEvent = z.infer<typeof transitionEventSchema>
export type TransitionEventType = z.infer<typeof transitionEventTypeSchema>
