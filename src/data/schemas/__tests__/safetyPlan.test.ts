import { describe, expect, it } from 'vitest'
import { safetyPlanSchema, type SafetyPlan } from '../safetyPlan'
import { SCHEMA_VERSION } from '../shared'

function basePlan(overrides: Partial<SafetyPlan> = {}): SafetyPlan {
  return {
    id: 'safety-plan',
    schemaVersion: SCHEMA_VERSION,
    ...overrides,
  }
}

describe('safetyPlanSchema', () => {
  it('accepts a plan with everything left blank', () => {
    expect(safetyPlanSchema.safeParse(basePlan()).success).toBe(true)
  })

  it('accepts a fully filled-in plan', () => {
    const result = safetyPlanSchema.safeParse(
      basePlan({
        prescribingTeamContacts: [
          { id: 'contact-1', label: 'Prescriber', details: 'Call the clinic' },
        ],
        trustedContacts: [
          { id: 'contact-2', label: 'Partner', details: 'Call any time' },
        ],
        reviewActions: 'Reach out to a trusted contact.',
        urgentActions: 'Follow the agreed crisis plan.',
        crisisInstructions: 'Contact the crisis line already agreed with the team.',
        lastReviewedDate: '2026-01-15',
      }),
    )
    expect(result.success).toBe(true)
  })

  it('rejects a contact missing its label', () => {
    const result = safetyPlanSchema.safeParse(
      basePlan({
        trustedContacts: [
          // @ts-expect-error intentionally missing required field
          { id: 'contact-1', details: 'Call any time' },
        ],
      }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects an empty contact label', () => {
    const result = safetyPlanSchema.safeParse(
      basePlan({
        trustedContacts: [{ id: 'contact-1', label: '', details: 'Call any time' }],
      }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects a malformed last-reviewed date', () => {
    const result = safetyPlanSchema.safeParse(
      basePlan({ lastReviewedDate: '15/01/2026' }),
    )
    expect(result.success).toBe(false)
  })
})
