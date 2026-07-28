import { describe, expect, it } from 'vitest'
import { alertRuleSchema, type AlertRule } from '../alertRule'
import { SCHEMA_VERSION } from '../shared'

function baseRule(overrides: Partial<AlertRule> = {}): AlertRule {
  return {
    id: 'rule-1',
    schemaVersion: SCHEMA_VERSION,
    ruleType: 'restlessnessReview',
    label: 'Restlessness review',
    enabled: false,
    severity: 'review',
    lookbackDays: 7,
    params: { thresholdDays: 3 },
    actionText: 'Consider discussing this with your prescriber.',
    source: 'default',
    ruleVersion: 1,
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-01-15T09:00:00.000Z',
    ...overrides,
  }
}

describe('alertRuleSchema', () => {
  it('accepts a minimal valid rule', () => {
    expect(alertRuleSchema.safeParse(baseRule()).success).toBe(true)
  })

  it('rejects an unsupported rule type', () => {
    const result = alertRuleSchema.safeParse(
      // @ts-expect-error intentionally invalid enum value
      baseRule({ ruleType: 'somethingMadeUp' }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects an unsupported severity', () => {
    const result = alertRuleSchema.safeParse(
      // @ts-expect-error intentionally invalid enum value
      baseRule({ severity: 'critical' }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects a non-positive lookback window', () => {
    const result = alertRuleSchema.safeParse(baseRule({ lookbackDays: 0 }))
    expect(result.success).toBe(false)
  })

  it('rejects an empty action text', () => {
    const result = alertRuleSchema.safeParse(baseRule({ actionText: '' }))
    expect(result.success).toBe(false)
  })

  it('rejects a non-numeric params value', () => {
    const result = alertRuleSchema.safeParse(
      // @ts-expect-error intentionally invalid params value
      baseRule({ params: { thresholdDays: 'three' } }),
    )
    expect(result.success).toBe(false)
  })
})
