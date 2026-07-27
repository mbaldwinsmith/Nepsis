import { db } from '../data/db'
import {
  alertRuleSchema,
  SCHEMA_VERSION,
  type AlertRule,
  type RuleType,
} from '../data/schemas'
import { nowIsoDateTime } from '../utils/date'
import { defaultParams } from './params'
import { ruleTypeDefinitions } from './ruleTypes'

function stableId(ruleType: RuleType): string {
  return `default-${ruleType.replace(/([A-Z])/g, '-$1').toLowerCase()}`
}

export function buildDefaultRuleRecords(): AlertRule[] {
  const now = nowIsoDateTime()
  return (Object.keys(ruleTypeDefinitions) as RuleType[]).map((ruleType) => {
    const def = ruleTypeDefinitions[ruleType]
    return {
      id: stableId(ruleType),
      schemaVersion: SCHEMA_VERSION,
      ruleType,
      label: def.defaultLabel,
      description: def.defaultDescription,
      enabled: false,
      severity: def.defaultSeverity,
      lookbackDays: def.defaultLookbackDays,
      params: defaultParams(def.paramSchema),
      actionText: def.defaultActionText,
      source: 'default',
      ruleVersion: 1,
      createdAt: now,
      updatedAt: now,
    }
  })
}

/**
 * Inserts any of the ten default rules that don't already exist yet
 * (keyed by their stable id), disabled. Never touches an existing row, so
 * a user's edits to a default rule are never silently reset by a later
 * app update. Runs inside a single read-write transaction on the
 * alertRules table so two near-simultaneous calls (e.g. React Strict
 * Mode's double effect invocation in development) serialize instead of
 * racing to insert the same id twice.
 */
export async function ensureDefaultRulesExist(): Promise<void> {
  await db.transaction('rw', db.alertRules, async () => {
    for (const rule of buildDefaultRuleRecords()) {
      const existing = await db.alertRules.get(rule.id)
      if (existing) continue
      await db.alertRules.add(alertRuleSchema.parse(rule))
    }
  })
}
