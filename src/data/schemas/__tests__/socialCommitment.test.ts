import { describe, expect, it } from 'vitest'
import { socialCommitmentSchema, type SocialCommitment } from '../socialCommitment'
import { SCHEMA_VERSION } from '../shared'

function base(overrides: Partial<SocialCommitment> = {}): SocialCommitment {
  return {
    id: 'commitment-1',
    schemaVersion: SCHEMA_VERSION,
    plannedDate: '2026-01-20',
    type: 'friends',
    importance: 'routine',
    outcome: 'planned',
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-01-15T09:00:00.000Z',
    ...overrides,
  }
}

describe('socialCommitmentSchema', () => {
  it('accepts a planned commitment with no cancellation detail', () => {
    expect(socialCommitmentSchema.safeParse(base()).success).toBe(true)
  })

  it('accepts a cancelled commitment with reason, notice, and after-effect', () => {
    const result = socialCommitmentSchema.safeParse(
      base({
        outcome: 'cancelled',
        reasons: ['distress'],
        notice: 'sameDay',
        afterEffect: 'disappointed',
      }),
    )
    expect(result.success).toBe(true)
  })

  it('rejects a planned or attended commitment carrying cancellation detail', () => {
    const result = socialCommitmentSchema.safeParse(
      base({ outcome: 'attended', reasons: ['distress'] }),
    )
    expect(result.success).toBe(false)
  })

  it('accepts healthy boundary as a cancellation reason', () => {
    const result = socialCommitmentSchema.safeParse(
      base({ outcome: 'cancelled', reasons: ['healthyBoundary'] }),
    )
    expect(result.success).toBe(true)
  })
})
