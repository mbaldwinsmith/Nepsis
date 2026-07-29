/** Today's date in the device's local timezone, as an ISO date (YYYY-MM-DD). */
export function todayIsoDate(): string {
  const now = new Date()
  const localMidnightUtc = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return localMidnightUtc.toISOString().slice(0, 10)
}

/** The current instant as an ISO datetime string. */
export function nowIsoDateTime(): string {
  return new Date().toISOString()
}

export function formatIsoDateForDisplay(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

/** e.g. "Tuesday 21 July 2026". Formats in UTC so the calendar date shown never shifts with the viewer's timezone. */
export function formatIsoDateLong(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`)
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** True for a well-formed, real calendar date in YYYY-MM-DD form (rejects e.g. "2026-02-30"). */
export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}
