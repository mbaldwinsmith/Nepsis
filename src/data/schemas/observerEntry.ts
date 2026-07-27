import { z } from 'zod'
import { id, isoDate, isoDateTime, scale, optionalText, SCHEMA_VERSION } from './shared'

export const perceivedMoodSchema = z.enum(['low', 'usual', 'elevated', 'uncertain'])
export const observedSpeechSchema = z.enum(['usual', 'faster', 'pressured'])
export const observedActivitySchema = z.enum(['usual', 'withdrawn', 'unusuallyDriven'])
export const observerConcernSchema = z.enum([
  'none',
  'keepWatching',
  'discussSoon',
  'urgent',
])

export const observerEntrySchema = z.object({
  id: id(),
  schemaVersion: z.literal(SCHEMA_VERSION),
  observationDate: isoDate(),
  recordedAt: isoDateTime(),
  observerLabel: z.string().trim().min(1).max(60),
  perceivedMood: perceivedMoodSchema.optional(),
  speech: observedSpeechSchema.optional(),
  activity: observedActivitySchema.optional(),
  irritability: scale(0, 3).optional(),
  restlessness: scale(0, 3).optional(),
  impulsiveOrUncharacteristicBehaviour: z.boolean().optional(),
  concern: observerConcernSchema,
  note: optionalText(),
  linkedCommitmentId: id().optional(),
  linkedDailyCheckInId: id().optional(),
})

export type ObserverEntry = z.infer<typeof observerEntrySchema>
export type PerceivedMood = z.infer<typeof perceivedMoodSchema>
export type ObservedSpeech = z.infer<typeof observedSpeechSchema>
export type ObservedActivity = z.infer<typeof observedActivitySchema>
export type ObserverConcern = z.infer<typeof observerConcernSchema>
