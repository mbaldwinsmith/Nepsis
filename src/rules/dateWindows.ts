const MS_PER_DAY = 24 * 60 * 60 * 1000

function parseIsoDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`)
}

/** Whole calendar days between two ISO dates (b - a). Can be negative. */
export function daysBetween(a: string, b: string): number {
  return Math.round((parseIsoDate(b).getTime() - parseIsoDate(a).getTime()) / MS_PER_DAY)
}

export function addDays(isoDate: string, n: number): string {
  const d = parseIsoDate(isoDate)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export function isNextCalendarDay(a: string, b: string): boolean {
  return daysBetween(a, b) === 1
}

/**
 * Groups items into runs of calendar-consecutive dates where `predicate`
 * holds. A missing day (no item for that date, or predicate false) breaks
 * the run — this is what keeps "N consecutive nights" from silently
 * treating an unrecorded day as a match.
 */
export function consecutiveRuns<T>(
  items: T[],
  getDate: (item: T) => string,
  predicate: (item: T) => boolean,
): T[][] {
  const sorted = [...items].sort((a, b) => (getDate(a) < getDate(b) ? -1 : 1))
  const runs: T[][] = []
  let current: T[] = []

  for (const item of sorted) {
    if (!predicate(item)) {
      if (current.length) runs.push(current)
      current = []
      continue
    }
    const prev = current[current.length - 1]
    if (prev && !isNextCalendarDay(getDate(prev), getDate(item))) {
      runs.push(current)
      current = []
    }
    current.push(item)
  }
  if (current.length) runs.push(current)
  return runs
}

export function longestRun<T>(runs: T[][]): T[] {
  return runs.reduce(
    (longest, run) => (run.length > longest.length ? run : longest),
    [] as T[],
  )
}
