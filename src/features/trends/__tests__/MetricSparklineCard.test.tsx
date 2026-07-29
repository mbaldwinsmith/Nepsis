import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricSparklineCard } from '../MetricSparklineCard'
import type { TrendSeries } from '../useTrendData'

function series(overrides: Partial<TrendSeries> = {}): TrendSeries {
  return {
    key: 'sleepDuration',
    label: 'Sleep duration',
    unit: 'min',
    min: 0,
    max: 720,
    points: [
      { date: '2026-01-01', value: 360 },
      { date: '2026-01-02', value: 420 },
    ],
    baselineValue: undefined,
    ...overrides,
  }
}

describe('MetricSparklineCard', () => {
  it('shows the metric label with its unit', () => {
    render(
      <MetricSparklineCard
        series={series()}
        rangeStart="2026-01-01"
        rangeEnd="2026-01-02"
      />,
    )
    expect(
      screen.getByText('Sleep duration (min)', { selector: 'strong' }),
    ).toBeInTheDocument()
  })

  it('shows the factual summary text', () => {
    render(
      <MetricSparklineCard
        series={series()}
        rangeStart="2026-01-01"
        rangeEnd="2026-01-02"
      />,
    )
    expect(
      screen.getByText('2 of 2 days recorded. Latest: 420 min. Range: 360–420 min.'),
    ).toBeInTheDocument()
  })

  it('lists every date and its value in the data table, including unrecorded days', () => {
    render(
      <MetricSparklineCard
        series={series({
          points: [
            { date: '2026-01-01', value: 360 },
            { date: '2026-01-02', value: undefined },
          ],
        })}
        rangeStart="2026-01-01"
        rangeEnd="2026-01-02"
      />,
    )
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(3) // header + 2 days
    expect(screen.getByText('360')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
