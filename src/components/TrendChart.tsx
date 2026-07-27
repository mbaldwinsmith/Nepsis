import type { EventMarker, TrendSeries } from '../features/trends/useTrendData'
import { addDays, daysBetween, enumerateDates } from '../utils/dateWindows'
import { formatIsoDateForDisplay } from '../utils/date'

interface Props {
  series: TrendSeries[]
  events: EventMarker[]
  rangeStart: string
  rangeEnd: string
}

const SERIES_COLORS = [
  'var(--color-series-1)',
  'var(--color-series-2)',
  'var(--color-series-3)',
]
const SERIES_DASH: (string | undefined)[] = [undefined, '7 4', '2 3']

const WIDTH = 640
const HEIGHT = 220
const PADDING_LEFT = 12
const PADDING_RIGHT = 16
const PADDING_TOP = 16
const PADDING_BOTTOM = 28
const PLOT_WIDTH = WIDTH - PADDING_LEFT - PADDING_RIGHT
const PLOT_HEIGHT = HEIGHT - PADDING_TOP - PADDING_BOTTOM

function round(value: number): number {
  return Math.round(value * 10) / 10
}

function toSegments(
  points: { date: string; value: number | undefined }[],
): { date: string; value: number }[][] {
  const segments: { date: string; value: number }[][] = []
  let current: { date: string; value: number }[] = []
  for (const point of points) {
    if (point.value === undefined) {
      if (current.length) segments.push(current)
      current = []
    } else {
      current.push({ date: point.date, value: point.value })
    }
  }
  if (current.length) segments.push(current)
  return segments
}

/**
 * A gap-aware, multi-series line chart with no interpolation across missing
 * days. Each series is plotted on its own normalized scale (metrics share no
 * common unit), distinguished by colour, dash pattern, and a text label —
 * never colour alone. A collapsible data table is the non-visual
 * equivalent, always present in the DOM.
 */
export function TrendChart({ series, events, rangeStart, rangeEnd }: Props) {
  const dates = enumerateDates(rangeStart, rangeEnd)
  const totalDays = Math.max(1, daysBetween(rangeStart, rangeEnd))

  if (series.length === 0) {
    return <p className="hint">Select at least one metric to see a chart.</p>
  }

  function xFor(date: string): number {
    return PADDING_LEFT + (daysBetween(rangeStart, date) / totalDays) * PLOT_WIDTH
  }

  function yFor(value: number, min: number, max: number): number {
    const fraction = max === min ? 0.5 : (value - min) / (max - min)
    const clamped = Math.min(1, Math.max(0, fraction))
    return PADDING_TOP + (1 - clamped) * PLOT_HEIGHT
  }

  const midDate = addDays(rangeStart, Math.floor(totalDays / 2))
  const chartLabel = `Trend chart for ${series.map((s) => s.label).join(', ')} from ${formatIsoDateForDisplay(rangeStart)} to ${formatIsoDateForDisplay(rangeEnd)}`

  return (
    <div className="stack">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={chartLabel}
        style={{ width: '100%', height: 'auto' }}
      >
        <line
          x1={PADDING_LEFT}
          y1={HEIGHT - PADDING_BOTTOM}
          x2={WIDTH - PADDING_RIGHT}
          y2={HEIGHT - PADDING_BOTTOM}
          stroke="var(--color-border)"
        />
        <text
          x={xFor(rangeStart)}
          y={HEIGHT - 8}
          fontSize="10"
          fill="var(--color-text-muted)"
        >
          {formatIsoDateForDisplay(rangeStart)}
        </text>
        <text
          x={xFor(midDate)}
          y={HEIGHT - 8}
          fontSize="10"
          textAnchor="middle"
          fill="var(--color-text-muted)"
        >
          {formatIsoDateForDisplay(midDate)}
        </text>
        <text
          x={xFor(rangeEnd)}
          y={HEIGHT - 8}
          fontSize="10"
          textAnchor="end"
          fill="var(--color-text-muted)"
        >
          {formatIsoDateForDisplay(rangeEnd)}
        </text>

        {events.map((event, i) => (
          <line
            key={i}
            x1={xFor(event.date)}
            x2={xFor(event.date)}
            y1={PADDING_TOP}
            y2={HEIGHT - PADDING_BOTTOM}
            stroke="var(--color-text-muted)"
            strokeDasharray="2 2"
          >
            <title>{`${formatIsoDateForDisplay(event.date)}: ${event.label}`}</title>
          </line>
        ))}

        {series.map((s, sIndex) => {
          const color = SERIES_COLORS[sIndex % SERIES_COLORS.length]
          const dash = SERIES_DASH[sIndex % SERIES_DASH.length]
          const segments = toSegments(s.points)

          return (
            <g key={s.key}>
              {s.baselineValue !== undefined && (
                <line
                  x1={PADDING_LEFT}
                  x2={WIDTH - PADDING_RIGHT}
                  y1={yFor(s.baselineValue, s.min, s.max)}
                  y2={yFor(s.baselineValue, s.min, s.max)}
                  stroke={color}
                  strokeOpacity={0.4}
                  strokeDasharray="4 3"
                />
              )}
              {segments.map((segment, segIndex) => (
                <g key={segIndex}>
                  {segment.length > 1 && (
                    <path
                      d={segment
                        .map(
                          (p, i) =>
                            `${i === 0 ? 'M' : 'L'} ${xFor(p.date)} ${yFor(p.value, s.min, s.max)}`,
                        )
                        .join(' ')}
                      fill="none"
                      stroke={color}
                      strokeWidth={2}
                      strokeDasharray={dash}
                    />
                  )}
                  {segment.map((p, i) => (
                    <circle
                      key={i}
                      cx={xFor(p.date)}
                      cy={yFor(p.value, s.min, s.max)}
                      r={3}
                      fill={color}
                    />
                  ))}
                </g>
              ))}
            </g>
          )
        })}
      </svg>

      <div className="stack" style={{ gap: 'var(--space-2)' }}>
        {series.map((s, sIndex) => (
          <div
            key={s.key}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <svg width="24" height="12" aria-hidden="true">
              <line
                x1="0"
                y1="6"
                x2="24"
                y2="6"
                stroke={SERIES_COLORS[sIndex % SERIES_COLORS.length]}
                strokeWidth={2}
                strokeDasharray={SERIES_DASH[sIndex % SERIES_DASH.length]}
              />
            </svg>
            <span>
              {s.label}
              {s.unit ? ` (${s.unit})` : ''}
              {s.baselineValue !== undefined
                ? ` — baseline ${round(s.baselineValue)}`
                : ''}
            </span>
          </div>
        ))}
      </div>

      {events.length > 0 && (
        <p className="hint" style={{ margin: 0 }}>
          Events:{' '}
          {events
            .map((e) => `${formatIsoDateForDisplay(e.date)} – ${e.label}`)
            .join('; ')}
        </p>
      )}

      <details>
        <summary>View data as a table</summary>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                {series.map((s) => (
                  <th scope="col" key={s.key}>
                    {s.label}
                    {s.unit ? ` (${s.unit})` : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dates.map((date) => (
                <tr key={date}>
                  <th scope="row">{formatIsoDateForDisplay(date)}</th>
                  {series.map((s) => {
                    const point = s.points.find((p) => p.date === date)
                    return <td key={s.key}>{point?.value ?? '—'}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
