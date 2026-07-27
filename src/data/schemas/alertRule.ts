import { z } from 'zod'
import { id, isoDateTime, optionalText, SCHEMA_VERSION } from './shared'

export const alertSeveritySchema = z.enum(['review', 'act'])
export const alertRuleSourceSchema = z.enum(['default', 'userCreated'])

/**
 * A single transparent, inspectable condition. The rule engine (Phase 8) evaluates
 * these against recorded observations; this schema only defines their shape so the
 * evidence shown to the user is always traceable back to a plain description.
 */
export const alertConditionSchema = z.object({
  id: id(),
  description: z.string().trim().min(1).max(300),
  metric: z.string().trim().min(1).max(120),
  comparator: z.enum(['gte', 'lte', 'gt', 'lt', 'eq']),
  threshold: z.number(),
})

export const alertRuleSchema = z.object({
  id: id(),
  schemaVersion: z.literal(SCHEMA_VERSION),
  label: z.string().trim().min(1).max(160),
  description: optionalText(500),
  enabled: z.boolean(),
  severity: alertSeveritySchema,
  lookbackDays: z.number().int().positive(),
  conditions: z.array(alertConditionSchema).min(1),
  actionText: z.string().trim().min(1).max(500),
  source: alertRuleSourceSchema,
  ruleVersion: z.number().int().positive(),
  createdAt: isoDateTime(),
  updatedAt: isoDateTime(),
})

export type AlertRule = z.infer<typeof alertRuleSchema>
export type AlertCondition = z.infer<typeof alertConditionSchema>
