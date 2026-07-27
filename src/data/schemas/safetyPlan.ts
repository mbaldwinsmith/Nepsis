import { z } from 'zod'
import { id, isoDate, optionalText, SCHEMA_VERSION } from './shared'

export const contactSchema = z.object({
  id: id(),
  label: z.string().trim().min(1).max(80),
  details: z.string().trim().min(1).max(300),
})

export const warningSignDefinitionSchema = z.object({
  id: id(),
  label: z.string().trim().min(1).max(120),
  description: optionalText(300),
  enabled: z.boolean(),
})

export const safetyPlanSchema = z.object({
  id: id(),
  schemaVersion: z.literal(SCHEMA_VERSION),
  prescribingTeamContacts: z.array(contactSchema).optional(),
  trustedContacts: z.array(contactSchema).optional(),
  personalisedWarningSigns: z.array(warningSignDefinitionSchema).optional(),
  reviewActions: optionalText(2000),
  urgentActions: optionalText(2000),
  crisisInstructions: optionalText(2000),
  lastReviewedDate: isoDate().optional(),
})

export type SafetyPlan = z.infer<typeof safetyPlanSchema>
export type Contact = z.infer<typeof contactSchema>
export type WarningSignDefinition = z.infer<typeof warningSignDefinitionSchema>
