import type { TrendSeries } from './useTrendData'

/** A one-sentence factual summary of a series — counts and values only, no interpretation. */
export function summarizeSeries(series: TrendSeries): string {
  const recorded = series.points.filter(
    (p): p is { date: string; value: number } => p.value !== undefined,
  )
  const total = series.points.length
  const dayWord = total === 1 ? 'day' : 'days'

  if (recorded.length === 0) {
    return `No ${dayWord} recorded in this range yet.`
  }

  const unit = series.unit ? ` ${series.unit}` : ''
  const latest = recorded[recorded.length - 1]!
  const values = recorded.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const recordedText = `${recorded.length} of ${total} ${dayWord} recorded`

  if (min === max) {
    return `${recordedText}. Latest: ${latest.value}${unit}.`
  }
  return `${recordedText}. Latest: ${latest.value}${unit}. Range: ${min}–${max}${unit}.`
}
