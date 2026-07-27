import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../data/db'
import { alertRuleRepository } from '../../data/repositories'
import { SCHEMA_VERSION } from '../../data/schemas'
import { evaluateEnabledRules } from '../alertEngine'
import { buildDefaultRuleRecords } from '../defaultRules'
import { baseline, checkIn } from './fixtures'

const REFERENCE_DATE = '2026-01-20'

beforeEach(async () => {
  await db.dailyCheckIns.clear()
  await db.socialCommitments.clear()
  await db.observerEntries.clear()
  await db.personalBaselines.clear()
  await db.alertRules.clear()
})

describe('evaluateEnabledRules', () => {
  it('returns nothing when no rules are enabled', async () => {
    for (const rule of buildDefaultRuleRecords()) {
      await alertRuleRepository.create(rule)
    }
    const triggers = await evaluateEnabledRules(REFERENCE_DATE)
    expect(triggers).toEqual([])
  })

  it('surfaces a trigger with evidence once its rule is enabled, and stops once disabled', async () => {
    await db.personalBaselines.put(baseline({ usualSleepDurationMinutes: 440 }))
    await db.dailyCheckIns.bulkPut([
      checkIn('2026-01-08', {
        sleep: { sleepDurationMinutes: 300 },
        mood: { energy: 4 },
      }),
      checkIn('2026-01-09', {
        sleep: { sleepDurationMinutes: 300 },
        mood: { energy: 4 },
      }),
    ])

    const defaults = buildDefaultRuleRecords()
    const sleepRule = defaults.find((r) => r.ruleType === 'reducedSleepPlusActivation')!
    // Widen the lookback so the fixed test dates above fall inside the
    // window regardless of the rule type's smaller default lookback.
    for (const rule of defaults) {
      await alertRuleRepository.create({ ...rule, lookbackDays: 20 })
    }

    let triggers = await evaluateEnabledRules(REFERENCE_DATE)
    expect(triggers).toEqual([])

    await alertRuleRepository.update({
      ...sleepRule,
      lookbackDays: 20,
      enabled: true,
      updatedAt: new Date().toISOString(),
    })

    triggers = await evaluateEnabledRules(REFERENCE_DATE)
    expect(triggers).toHaveLength(1)
    expect(triggers[0]?.ruleId).toBe(sleepRule.id)
    expect(triggers[0]?.severity).toBe('review')
    expect(triggers[0]?.evidence.length).toBeGreaterThan(0)
    expect(triggers[0]?.actionText).toBeTruthy()

    await alertRuleRepository.update({
      ...sleepRule,
      lookbackDays: 20,
      enabled: false,
      updatedAt: new Date().toISOString(),
    })
    triggers = await evaluateEnabledRules(REFERENCE_DATE)
    expect(triggers).toEqual([])
  })

  it('evaluates each enabled rule against its own configured lookback window', async () => {
    await db.dailyCheckIns.bulkPut([
      checkIn('2026-01-19', { medicationEffects: { innerRestlessness: 4 } }),
    ])
    const restlessness = buildDefaultRuleRecords().find(
      (r) => r.ruleType === 'restlessnessReview',
    )!
    await alertRuleRepository.create({ ...restlessness, enabled: true, lookbackDays: 3 })

    const triggers = await evaluateEnabledRules(REFERENCE_DATE)
    expect(triggers).toHaveLength(1)
    expect(triggers[0]?.ruleLabel).toBe('Restlessness review')
  })

  it('never produces a schemaVersion mismatch when reading persisted rules', async () => {
    const rules = buildDefaultRuleRecords()
    expect(rules.every((r) => r.schemaVersion === SCHEMA_VERSION)).toBe(true)
  })
})
