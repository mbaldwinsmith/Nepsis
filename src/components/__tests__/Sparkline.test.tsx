import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Sparkline } from '../Sparkline'
import type { TrendSeries } from '../../features/trends/useTrendData'

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

describe('Sparkline', () => {
  it('renders an accessible image with a descriptive label when there are recorded points', () => {
    render(
      <Sparkline
        series={series({
          points: [
            { date: '2026-01-01', value: 360 },
            { date: '2026-01-02', value: 420 },
          ],
        })}
        rangeStart="2026-01-01"
        rangeEnd="2026-01-02"
      />,
    )
    expect(
      screen.getByRole('img', {
        name: 'Sleep duration from 01/01/2026 to 02/01/2026',
      }),
    ).toBeInTheDocument()
  })

  it('falls back to a text message when no points are recorded', () => {
    render(
      <Sparkline
        series={series({
          points: [
            { date: '2026-01-01', value: undefined },
            { date: '2026-01-02', value: undefined },
          ],
        })}
        rangeStart="2026-01-01"
        rangeEnd="2026-01-02"
      />,
    )
    expect(screen.getByText('No days recorded in this range yet.')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
