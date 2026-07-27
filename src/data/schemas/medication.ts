import { z } from 'zod'
import { id, isoDateTime, optionalText, SCHEMA_VERSION } from './shared'

export const medicationDefinitionSchema = z.object({
  id: id(),
  schemaVersion: z.literal(SCHEMA_VERSION),
  name: z.string().trim().min(1).max(120),
  formulation: z.string().trim().min(1).max(120).optional(),
  notes: optionalText(),
  active: z.boolean(),
  createdAt: isoDateTime(),
  updatedAt: isoDateTime(),
})

export type MedicationDefinition = z.infer<typeof medicationDefinitionSchema>

export const medicationEntryStatusSchema = z.enum([
  'taken',
  'delayed',
  'missed',
  'notScheduled',
])

export const medicationEntrySchema = z.object({
  id: id(),
  schemaVersion: z.literal(SCHEMA_VERSION),
  medicationDefinitionId: id(),
  takenAt: isoDateTime(),
  plannedDose: z.number().nonnegative().optional(),
  doseTaken: z.number().nonnegative().optional(),
  unit: z.string().trim().min(1).max(20).optional(),
  status: medicationEntryStatusSchema,
  notes: optionalText(),
})

export type MedicationEntry = z.infer<typeof medicationEntrySchema>
export type MedicationEntryStatus = z.infer<typeof medicationEntryStatusSchema>
