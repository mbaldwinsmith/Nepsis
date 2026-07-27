import { describe, expect, it } from 'vitest'
import type { TrendDataIndex } from '../metrics'
import { metricDefinitions } from '../metrics'
import type { DailyCheckIn, SocialCommitment } from '../../../data/schemas'
import { baseline, checkIn, commitment } from './fixtures'

function indexFor(
  checkIns: DailyCheckIn[],
  commitments: SocialCommitment[] = [],
  weightByDate: Map<string, number> = new Map(),
): TrendDataIndex {
  const checkInsByDate = new Map(checkIns.map((c) => [c.entryDate, c]))
  const commitmentsByDate = new Map<string, SocialCommitment[]>()
  for (const c of commitments) {
    const list = commitmentsByDate.get(c.plannedDate) ?? []
    list.push(c)
    commitmentsByDate.set(c.plannedDate, list)
  }
  return { checkInsByDate, commitmentsByDate, weightByDate }
}

describe('metricDefinitions.sleepDuration', () => {
  it('reads sleep duration from the matching check-in', () => {
    const index = indexFor([
      checkIn('2026-01-01', { sleep: { sleepDurationMinutes: 420 } }),
    ])
    expect(metricDefinitions.sleepDuration.getValue('2026-01-01', index)).toBe(420)
  })

  it('is undefined (not zero) for a day with no check-in', () => {
    const index = indexFor([
      checkIn('2026-01-01', { sleep: { sleepDurationMinutes: 420 } }),
    ])
    expect(metricDefinitions.sleepDuration.getValue('2026-01-02', index)).toBeUndefined()
  })

  it('reads the baseline from usualSleepDurationMinutes', () => {
    expect(
      metricDefinitions.sleepDuration.getBaseline?.(
        baseline({ usualSleepDurationMinutes: 440 }),
      ),
    ).toBe(440)
  })
})

describe('metricDefinitions.alcoholUnits', () => {
  it('approximates a daily baseline from the weekly baseline', () => {
    const value = metricDefinitions.alcoholUnits.getBaseline?.(
      baseline({ usualWeeklyAlcoholUnits: 7 }),
    )
    expect(value).toBe(1)
  })

  it('has no baseline when none is recorded', () => {
    expect(metricDefinitions.alcoholUnits.getBaseline?.(baseline())).toBeUndefined()
  })
})

describe('metricDefinitions.cancellations', () => {
  it('counts same-day cancelled, postponed, and did-not-attend commitments', () => {
    const index = indexFor(
      [],
      [
        commitment('2026-01-01', { outcome: 'cancelled' }),
        commitment('2026-01-01', { outcome: 'attended' }),
        commitment('2026-01-01', { outcome: 'postponed' }),
      ],
    )
    expect(metricDefinitions.cancellations.getValue('2026-01-01', index)).toBe(2)
  })

  it('is a real zero (not missing) when commitments exist but none were cancelled', () => {
    const index = indexFor([], [commitment('2026-01-01', { outcome: 'attended' })])
    expect(metricDefinitions.cancellations.getValue('2026-01-01', index)).toBe(0)
  })

  it('is undefined when no commitments were planned that day', () => {
    const index = indexFor([], [])
    expect(metricDefinitions.cancellations.getValue('2026-01-01', index)).toBeUndefined()
  })

  it('has no baseline mapping', () => {
    expect(metricDefinitions.cancellations.getBaseline).toBeUndefined()
  })
})

describe('metricDefinitions.weight', () => {
  it('reads from the pre-indexed weight-by-date map', () => {
    const index = indexFor([], [], new Map([['2026-01-01', 78.5]]))
    expect(metricDefinitions.weight.getValue('2026-01-01', index)).toBe(78.5)
    expect(metricDefinitions.weight.getValue('2026-01-02', index)).toBeUndefined()
  })
})
