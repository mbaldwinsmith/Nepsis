/** Splits a date/value series into contiguous runs, breaking at any undefined value. */
export function toValueSegments(
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
