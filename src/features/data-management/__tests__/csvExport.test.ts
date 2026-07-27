import { describe, expect, it } from 'vitest'
import { SCHEMA_VERSION } from '../../../data/schemas'
import type { DailyCheckIn, ObserverEntry } from '../../../data/schemas'
import {
  toDailyCheckInsCsv,
  toObserverEntriesCsv,
  buildDataDictionary,
} from '../csvExport'

function checkIn(overrides: Partial<DailyCheckIn> = {}): DailyCheckIn {
  return {
    id: 'checkin-1',
    schemaVersion: SCHEMA_VERSION,
    entryDate: '2026-01-15',
    recordedAt: '2026-01-15T21:00:00.000Z',
    updatedAt: '2026-01-15T21:00:00.000Z',
    sleep: { sleepDurationMinutes: 420 },
    mood: { lowMood: 1 },
    warningSigns: {},
    medicationEffects: {},
    appetite: {},
    urges: {},
    alcohol: {},
    social: {},
    ...overrides,
  }
}

function observerEntry(overrides: Partial<ObserverEntry> = {}): ObserverEntry {
  return {
    id: 'observer-1',
    schemaVersion: SCHEMA_VERSION,
    observationDate: '2026-01-15',
    recordedAt: '2026-01-15T20:00:00.000Z',
    observerLabel: 'Friend A',
    concern: 'none',
    ...overrides,
  }
}

describe('toDailyCheckInsCsv', () => {
  it('flattens nested fields into dot-prefixed columns', () => {
    const csv = toDailyCheckInsCsv([checkIn()], {
      includeNotes: true,
      includeObserverLabels: true,
    })
    const [header] = csv.split('\r\n')
    expect(header).toContain('sleep.sleepDurationMinutes')
    expect(header).toContain('mood.lowMood')
  })

  it('drops the notes column entirely when notes are excluded', () => {
    const csv = toDailyCheckInsCsv([checkIn({ notes: 'a private note' })], {
      includeNotes: false,
      includeObserverLabels: true,
    })
    expect(csv).not.toContain('notes')
    expect(csv).not.toContain('a private note')
  })

  it('keeps the notes column and value when notes are included', () => {
    const csv = toDailyCheckInsCsv([checkIn({ notes: 'a private note' })], {
      includeNotes: true,
      includeObserverLabels: true,
    })
    expect(csv).toContain('notes')
    expect(csv).toContain('a private note')
  })

  it('escapes commas, quotes, and newlines in free-text fields', () => {
    const csv = toDailyCheckInsCsv(
      [checkIn({ notes: 'has a, comma "and quotes"\nand a newline' })],
      { includeNotes: true, includeObserverLabels: true },
    )
    expect(csv).toContain('"has a, comma ""and quotes""\nand a newline"')
  })
})

describe('toObserverEntriesCsv', () => {
  it('drops the observerLabel column when observer labels are excluded', () => {
    const csv = toObserverEntriesCsv([observerEntry()], {
      includeNotes: true,
      includeObserverLabels: false,
    })
    expect(csv).not.toContain('observerLabel')
    expect(csv).not.toContain('Friend A')
  })

  it('keeps observerLabel when included', () => {
    const csv = toObserverEntriesCsv([observerEntry()], {
      includeNotes: true,
      includeObserverLabels: true,
    })
    expect(csv).toContain('observerLabel')
    expect(csv).toContain('Friend A')
  })
})

describe('buildDataDictionary', () => {
  it('documents that alerts reflect current configuration, not fired-alert history', () => {
    const dictionary = buildDataDictionary(['alerts'], {
      includeNotes: true,
      includeObserverLabels: true,
    })
    expect(dictionary).toMatch(/does not keep a history of past fired alerts/)
  })
})
