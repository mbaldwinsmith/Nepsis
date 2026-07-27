import { describe, expect, it } from 'vitest'
import { dailyCheckInSchema, type DailyCheckIn } from '../dailyCheckIn'
import { SCHEMA_VERSION } from '../shared'

function baseCheckIn(overrides: Partial<DailyCheckIn> = {}): DailyCheckIn {
  return {
    id: 'check-in-1',
    schemaVersion: SCHEMA_VERSION,
    entryDate: '2026-01-15',
    recordedAt: '2026-01-15T21:00:00.000Z',
    updatedAt: '2026-01-15T21:00:00.000Z',
    sleep: {},
    mood: {},
    warningSigns: {},
    medicationEffects: {},
    appetite: {},
    urges: {},
    alcohol: {},
    social: {},
    ...overrides,
  }
}

describe('dailyCheckInSchema', () => {
  it('accepts a minimal valid check-in', () => {
    expect(dailyCheckInSchema.safeParse(baseCheckIn()).success).toBe(true)
  })

  it('rejects a negative sleep duration', () => {
    const result = dailyCheckInSchema.safeParse(
      baseCheckIn({ sleep: { sleepDurationMinutes: -10 } }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects nap duration when no nap was taken', () => {
    const result = dailyCheckInSchema.safeParse(
      baseCheckIn({ sleep: { napTaken: false, napDurationMinutes: 30 } }),
    )
    expect(result.success).toBe(false)
  })

  it('accepts nap duration when a nap was taken', () => {
    const result = dailyCheckInSchema.safeParse(
      baseCheckIn({
        sleep: { napTaken: true, napDurationMinutes: 30, napEffect: 'refreshed' },
      }),
    )
    expect(result.success).toBe(true)
  })

  it('rejects negative alcohol units', () => {
    const result = dailyCheckInSchema.safeParse(
      baseCheckIn({ alcohol: { unitsConsumed: -1 } }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects alcohol context without units greater than zero', () => {
    const result = dailyCheckInSchema.safeParse(
      baseCheckIn({ alcohol: { context: 'social' } }),
    )
    expect(result.success).toBe(false)
  })

  it('accepts alcohol context when units are greater than zero', () => {
    const result = dailyCheckInSchema.safeParse(
      baseCheckIn({
        alcohol: { unitsConsumed: 2, context: 'social', perceivedEffect: 'neutral' },
      }),
    )
    expect(result.success).toBe(true)
  })

  it('rejects a malformed entry date', () => {
    const result = dailyCheckInSchema.safeParse(baseCheckIn({ entryDate: '15/01/2026' }))
    expect(result.success).toBe(false)
  })

  it('rejects an out-of-range scale value', () => {
    const result = dailyCheckInSchema.safeParse(baseCheckIn({ mood: { lowMood: 5 } }))
    expect(result.success).toBe(false)
  })

  it('rejects an unsupported enum value', () => {
    const result = dailyCheckInSchema.safeParse(
      // @ts-expect-error intentionally invalid enum value
      baseCheckIn({ sleep: { napTaken: true, napEffect: 'ecstatic' } }),
    )
    expect(result.success).toBe(false)
  })
})
