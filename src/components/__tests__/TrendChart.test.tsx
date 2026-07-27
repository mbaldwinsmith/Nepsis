import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrendChart } from '../TrendChart'
import type { TrendSeries, EventMarker } from '../../features/trends/useTrendData'

const rangeStart = '2026-01-01'
const rangeEnd = '2026-01-05'

function points(values: (number | undefined)[]) {
  const dates = ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04', '2026-01-05']
  return dates.map((date, i) => ({ date, value: values[i] }))
}

describe('TrendChart', () => {
  it('breaks the line into two paths when a day is missing (no interpolation)', () => {
    const series: TrendSeries[] = [
      {
        key: 'sleepDuration',
        label: 'Sleep duration',
        unit: 'min',
        min: 0,
        max: 600,
        points: points([400, 410, undefined, 420, 430]),
        baselineValue: undefined,
      },
    ]
    const { container } = render(
      <TrendChart
        series={series}
        events={[]}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
      />,
    )
    const paths = container.querySelectorAll('svg path')
    expect(paths).toHaveLength(2)
  })

  it('renders a text legend entry for every series, distinguishing them beyond colour', () => {
    const series: TrendSeries[] = [
      {
        key: 'energy',
        label: 'Energy',
        unit: undefined,
        min: 0,
        max: 4,
        points: points([2, 2, 3, 3, 4]),
        baselineValue: 2,
      },
      {
        key: 'appetite',
        label: 'Appetite',
        unit: undefined,
        min: 0,
        max: 4,
        points: points([1, 1, 2, 2, 3]),
        baselineValue: undefined,
      },
    ]
    const { container } = render(
      <TrendChart
        series={series}
        events={[]}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
      />,
    )
    const legendText = Array.from(container.querySelectorAll('.stack > div > span')).map(
      (el) => el.textContent,
    )
    expect(legendText).toEqual(['Energy — baseline 2', 'Appetite'])
  })

  it('always renders a data table with the correct values, even for missing days', () => {
    const series: TrendSeries[] = [
      {
        key: 'energy',
        label: 'Energy',
        unit: undefined,
        min: 0,
        max: 4,
        points: points([2, undefined, 3, 3, 4]),
        baselineValue: undefined,
      },
    ]
    render(
      <TrendChart
        series={series}
        events={[]}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
      />,
    )
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    const cells = Array.from(table.querySelectorAll('tbody td')).map(
      (td) => td.textContent,
    )
    expect(cells).toEqual(['2', '—', '3', '3', '4'])
  })

  it('renders an event marker with a tooltip', () => {
    const series: TrendSeries[] = [
      {
        key: 'energy',
        label: 'Energy',
        unit: undefined,
        min: 0,
        max: 4,
        points: points([2, 2, 2, 2, 2]),
        baselineValue: undefined,
      },
    ]
    const events: EventMarker[] = [{ date: '2026-01-03', label: 'Dose increased' }]
    const { container } = render(
      <TrendChart
        series={series}
        events={events}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
      />,
    )
    expect(container.querySelector('title')?.textContent).toContain('Dose increased')
    expect(screen.getByText(/Events:/)).toHaveTextContent('Dose increased')
  })

  it('shows a hint instead of a chart when no metrics are selected', () => {
    render(
      <TrendChart series={[]} events={[]} rangeStart={rangeStart} rangeEnd={rangeEnd} />,
    )
    expect(
      screen.getByText('Select at least one metric to see a chart.'),
    ).toBeInTheDocument()
  })
})
