import { describe, expect, it } from 'vitest'
import { addDays, consecutiveRuns, daysBetween, isNextCalendarDay } from '../dateWindows'

describe('daysBetween', () => {
  it('counts whole calendar days between two dates', () => {
    expect(daysBetween('2026-01-01', '2026-01-05')).toBe(4)
    expect(daysBetween('2026-01-05', '2026-01-01')).toBe(-4)
    expect(daysBetween('2026-01-01', '2026-01-01')).toBe(0)
  })
})

describe('addDays', () => {
  it('adds and subtracts calendar days, crossing month boundaries', () => {
    expect(addDays('2026-01-30', 3)).toBe('2026-02-02')
    expect(addDays('2026-02-02', -3)).toBe('2026-01-30')
  })
})

describe('isNextCalendarDay', () => {
  it('is true only for exactly one day later', () => {
    expect(isNextCalendarDay('2026-01-01', '2026-01-02')).toBe(true)
    expect(isNextCalendarDay('2026-01-01', '2026-01-03')).toBe(false)
    expect(isNextCalendarDay('2026-01-02', '2026-01-01')).toBe(false)
  })
})

describe('consecutiveRuns', () => {
  interface Item {
    date: string
    match: boolean
  }
  const getDate = (i: Item) => i.date
  const predicate = (i: Item) => i.match

  it('groups matching items into calendar-consecutive runs', () => {
    const items: Item[] = [
      { date: '2026-01-01', match: true },
      { date: '2026-01-02', match: true },
      { date: '2026-01-03', match: true },
      { date: '2026-01-04', match: false },
      { date: '2026-01-05', match: true },
    ]
    const runs = consecutiveRuns(items, getDate, predicate)
    expect(runs).toHaveLength(2)
    expect(runs[0]).toHaveLength(3)
    expect(runs[1]).toHaveLength(1)
  })

  it('breaks a run when a day is missing entirely, not just non-matching', () => {
    const items: Item[] = [
      { date: '2026-01-01', match: true },
      { date: '2026-01-02', match: true },
      // 2026-01-03 has no record at all
      { date: '2026-01-04', match: true },
    ]
    const runs = consecutiveRuns(items, getDate, predicate)
    expect(runs).toHaveLength(2)
    expect(runs[0]).toHaveLength(2)
    expect(runs[1]).toHaveLength(1)
  })

  it('returns no runs when nothing matches', () => {
    const items: Item[] = [
      { date: '2026-01-01', match: false },
      { date: '2026-01-02', match: false },
    ]
    expect(consecutiveRuns(items, getDate, predicate)).toHaveLength(0)
  })
})
