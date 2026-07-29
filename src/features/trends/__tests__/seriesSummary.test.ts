import { describe, expect, it } from 'vitest'
import { summarizeSeries } from '../seriesSummary'
import type { TrendSeries } from '../useTrendData'

function series(overrides: Partial<TrendSeries> = {}): TrendSeries {
  return {
    key: 'sleepDuration',
    label: 'Sleep duration',
    unit: 'min',
    min: 0,
    max: 720,
    points: [],
    baselineValue: undefined,
    ...overrides,
  }
}

describe('summarizeSeries', () => {
  it('reports no days recorded when every point is undefined', () => {
    const s = series({
      points: [
        { date: '2026-01-01', value: undefined },
        { date: '2026-01-02', value: undefined },
      ],
    })
    expect(summarizeSeries(s)).toBe('No days recorded in this range yet.')
  })

  it('reports the count, latest value, and range when values vary', () => {
    const s = series({
      points: [
        { date: '2026-01-01', value: 360 },
        { date: '2026-01-02', value: undefined },
        { date: '2026-01-03', value: 420 },
      ],
    })
    expect(summarizeSeries(s)).toBe(
      '2 of 3 days recorded. Latest: 420 min. Range: 360–420 min.',
    )
  })

  it('omits the range when every recorded value is identical', () => {
    const s = series({
      points: [
        { date: '2026-01-01', value: 400 },
        { date: '2026-01-02', value: 400 },
      ],
    })
    expect(summarizeSeries(s)).toBe('2 of 2 days recorded. Latest: 400 min.')
  })

  it('omits the unit suffix when the metric has none', () => {
    const s = series({
      unit: undefined,
      points: [{ date: '2026-01-01', value: 2 }],
    })
    expect(summarizeSeries(s)).toBe('1 of 1 day recorded. Latest: 2.')
  })
})
