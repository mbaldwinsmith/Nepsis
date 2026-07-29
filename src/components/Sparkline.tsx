import type { TrendSeries } from '../features/trends/useTrendData'
import { daysBetween } from '../utils/dateWindows'
import { formatIsoDateForDisplay } from '../utils/date'
import { toValueSegments } from '../utils/chartSegments'

interface Props {
  series: TrendSeries
  rangeStart: string
  rangeEnd: string
}

const WIDTH = 280
const HEIGHT = 56
const PADDING = 6
const PLOT_WIDTH = WIDTH - PADDING * 2
const PLOT_HEIGHT = HEIGHT - PADDING * 2

/**
 * A compact single-metric trend line for a quick glance — no axis labels or
 * legend. A dashed line marks the personal baseline when one is set. Always
 * pair with a text summary or table for a non-visual equivalent.
 */
export function Sparkline({ series, rangeStart, rangeEnd }: Props) {
  const totalDays = Math.max(1, daysBetween(rangeStart, rangeEnd))
  const segments = toValueSegments(series.points)
  const label = `${series.label} from ${formatIsoDateForDisplay(rangeStart)} to ${formatIsoDateForDisplay(rangeEnd)}`

  function xFor(date: string): number {
    return PADDING + (daysBetween(rangeStart, date) / totalDays) * PLOT_WIDTH
  }

  function yFor(value: number): number {
    const { min, max } = series
    const fraction = max === min ? 0.5 : (value - min) / (max - min)
    const clamped = Math.min(1, Math.max(0, fraction))
    return PADDING + (1 - clamped) * PLOT_HEIGHT
  }

  if (segments.length === 0) {
    return (
      <p className="hint" style={{ margin: 0 }}>
        No days recorded in this range yet.
      </p>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={label}
      style={{ width: '100%', height: 'auto' }}
    >
      {series.baselineValue !== undefined && (
        <line
          x1={PADDING}
          x2={WIDTH - PADDING}
          y1={yFor(series.baselineValue)}
          y2={yFor(series.baselineValue)}
          stroke="var(--color-series-1)"
          strokeOpacity={0.4}
          strokeDasharray="4 3"
        />
      )}
      {segments.map((segment, i) => (
        <g key={i}>
          {segment.length > 1 && (
            <path
              d={segment
                .map((p, j) => `${j === 0 ? 'M' : 'L'} ${xFor(p.date)} ${yFor(p.value)}`)
                .join(' ')}
              fill="none"
              stroke="var(--color-series-1)"
              strokeWidth={2}
            />
          )}
          {segment.map((p, j) => (
            <circle
              key={j}
              cx={xFor(p.date)}
              cy={yFor(p.value)}
              r={2.5}
              fill="var(--color-series-1)"
            />
          ))}
        </g>
      ))}
    </svg>
  )
}
