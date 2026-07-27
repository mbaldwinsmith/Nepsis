import {
  alertRuleRepository,
  dailyCheckInRepository,
  observerEntryRepository,
  personalBaselineRepository,
  socialCommitmentRepository,
} from '../data/repositories'
import type { AlertSeverity } from '../data/schemas'
import { todayIsoDate } from '../utils/date'
import { addDays } from '../utils/dateWindows'
import { resolveParams } from './params'
import { getRuleTypeDefinition } from './ruleTypes'
import type { Evidence } from './types'

export interface AlertTrigger {
  ruleId: string
  ruleLabel: string
  ruleVersion: number
  severity: AlertSeverity
  dateRangeStart: string
  dateRangeEnd: string
  summary: string
  evidence: Evidence[]
  actionText: string
}

/**
 * Evaluates every enabled AlertRule against recorded data up to
 * `referenceDate` (defaults to today) and returns the ones that trigger.
 * Deterministic and side-effect free beyond reading from the local
 * database — no network access, no randomness.
 */
export async function evaluateEnabledRules(
  referenceDate: string = todayIsoDate(),
): Promise<AlertTrigger[]> {
  const rules = await alertRuleRepository.listEnabled()
  if (rules.length === 0) return []

  const maxLookback = Math.max(...rules.map((r) => r.lookbackDays))
  const widestStart = addDays(referenceDate, -(maxLookback - 1))

  const [checkIns, commitments, observerEntries, baseline] = await Promise.all([
    dailyCheckInRepository.listByDateRange(widestStart, referenceDate),
    socialCommitmentRepository.listByDateRange(widestStart, referenceDate),
    observerEntryRepository.listByDateRange(widestStart, referenceDate),
    personalBaselineRepository.getSingleton(),
  ])

  const triggers: AlertTrigger[] = []

  for (const rule of rules) {
    const def = getRuleTypeDefinition(rule.ruleType)
    const windowStart = addDays(referenceDate, -(rule.lookbackDays - 1))

    const result = def.evaluate({
      windowStart,
      windowEnd: referenceDate,
      checkIns: checkIns.filter((ci) => ci.entryDate >= windowStart),
      commitments: commitments.filter((c) => c.plannedDate >= windowStart),
      observerEntries: observerEntries.filter((o) => o.observationDate >= windowStart),
      baseline,
      params: resolveParams(def.paramSchema, rule.params),
    })

    if (result.triggered) {
      triggers.push({
        ruleId: rule.id,
        ruleLabel: rule.label,
        ruleVersion: rule.ruleVersion,
        severity: rule.severity,
        dateRangeStart: windowStart,
        dateRangeEnd: referenceDate,
        summary: result.summary,
        evidence: result.evidence,
        actionText: rule.actionText,
      })
    }
  }

  return triggers
}
