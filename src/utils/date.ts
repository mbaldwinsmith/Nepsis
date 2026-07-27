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
