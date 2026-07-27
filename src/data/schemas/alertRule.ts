import { z } from 'zod'
import { id, isoDateTime, optionalText, SCHEMA_VERSION } from './shared'

export const alertSeveritySchema = z.enum(['review', 'act'])
export const alertRuleSourceSchema = z.enum(['default', 'userCreated'])

/**
 * Which built-in evaluator (src/rules/ruleTypes.ts) this rule instance runs.
 * The condition logic itself lives in code, keyed by this id; only the
 * label, severity, lookback, thresholds ("params"), and action text are
 * user-editable data, so every rule stays deterministic and auditable.
 */
export const ruleTypeSchema = z.enum([
  'reducedSleepPlusActivation',
  'daytimeAlertnessChange',
  'possibleLowEnergyPattern',
  'socialActivationPattern',
  'withdrawalPattern',
  'essentialCommitmentMissed',
  'alcoholPatternChange',
  'restlessnessReview',
  'compulsiveUrgeReview',
  'observerConcern',
])

export const alertRuleSchema = z.object({
  id: id(),
  schemaVersion: z.literal(SCHEMA_VERSION),
  ruleType: ruleTypeSchema,
  label: z.string().trim().min(1).max(160),
  description: optionalText(500),
  enabled: z.boolean(),
  severity: alertSeveritySchema,
  lookbackDays: z.number().int().positive(),
  params: z.record(z.string(), z.number()),
  actionText: z.string().trim().min(1).max(500),
  source: alertRuleSourceSchema,
  ruleVersion: z.number().int().positive(),
  createdAt: isoDateTime(),
  updatedAt: isoDateTime(),
})

export type AlertRule = z.infer<typeof alertRuleSchema>
export type RuleType = z.infer<typeof ruleTypeSchema>
export type AlertSeverity = z.infer<typeof alertSeveritySchema>
