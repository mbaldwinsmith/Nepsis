import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db'
import {
  dailyCheckInRepository,
  socialCommitmentRepository,
  observerEntryRepository,
  healthMeasurementRepository,
} from '../repositories'
import { SCHEMA_VERSION } from '../schemas'
import type {
  DailyCheckIn,
  SocialCommitment,
  ObserverEntry,
  HealthMeasurement,
} from '../schemas'

/**
 * A generous time budget for fake-indexeddb (an in-memory JS implementation,
 * not a real browser IndexedDB) — this catches a genuinely broken index or
 * full-table scan, not a real-device performance benchmark.
 */
const QUERY_BUDGET_MS = 200

const YEARS = 5
const DAY_COUNT = 365 * YEARS

function isoDatePlusDays(base: string, days: number): string {
  const d = new Date(`${base}T00:00:00.000Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function buildCheckIns(startDate: string): DailyCheckIn[] {
  const records: DailyCheckIn[] = []
  for (let i = 0; i < DAY_COUNT; i++) {
    const entryDate = isoDatePlusDays(startDate, i)
    const recordedAt = `${entryDate}T21:00:00.000Z`
    records.push({
      id: `checkin-${i}`,
      schemaVersion: SCHEMA_VERSION,
      entryDate,
      recordedAt,
      updatedAt: recordedAt,
      sleep: { sleepDurationMinutes: 420, sleepQuality: 3 },
      mood: { lowMood: 1, energy: 2 },
      warningSigns: {},
      medicationEffects: {},
      appetite: {},
      urges: {},
      alcohol: {},
      social: {},
    })
  }
  return records
}

function buildCommitments(startDate: string): SocialCommitment[] {
  const records: SocialCommitment[] = []
  for (let i = 0; i < DAY_COUNT; i += 3) {
    const plannedDate = isoDatePlusDays(startDate, i)
    const createdAt = `${plannedDate}T09:00:00.000Z`
    records.push({
      id: `commitment-${i}`,
      schemaVersion: SCHEMA_VERSION,
      plannedDate,
      type: 'friends',
      importance: 'routine',
      outcome: 'attended',
      createdAt,
      updatedAt: createdAt,
    })
  }
  return records
}

function buildObserverEntries(startDate: string): ObserverEntry[] {
  const records: ObserverEntry[] = []
  for (let i = 0; i < DAY_COUNT; i += 7) {
    const observationDate = isoDatePlusDays(startDate, i)
    records.push({
      id: `observer-${i}`,
      schemaVersion: SCHEMA_VERSION,
      observationDate,
      recordedAt: `${observationDate}T20:00:00.000Z`,
      observerLabel: 'Friend A',
      concern: 'none',
    })
  }
  return records
}

function buildHealthMeasurements(startDate: string): HealthMeasurement[] {
  const records: HealthMeasurement[] = []
  for (let i = 0; i < DAY_COUNT; i += 30) {
    const measuredAt = `${isoDatePlusDays(startDate, i)}T09:00:00.000Z`
    records.push({
      id: `weight-${i}`,
      schemaVersion: SCHEMA_VERSION,
      type: 'weight',
      value: 78,
      unit: 'kg',
      measuredAt,
    })
  }
  return records
}

beforeEach(async () => {
  await db.dailyCheckIns.clear()
  await db.socialCommitments.clear()
  await db.observerEntries.clear()
  await db.healthMeasurements.clear()

  const startDate = '2021-01-01'
  await db.dailyCheckIns.bulkAdd(buildCheckIns(startDate))
  await db.socialCommitments.bulkAdd(buildCommitments(startDate))
  await db.observerEntries.bulkAdd(buildObserverEntries(startDate))
  await db.healthMeasurements.bulkAdd(buildHealthMeasurements(startDate))
})

async function assertFast(label: string, run: () => Promise<unknown>) {
  const start = performance.now()
  await run()
  const elapsed = performance.now() - start
  expect(elapsed, `${label} took ${elapsed.toFixed(1)}ms`).toBeLessThan(QUERY_BUDGET_MS)
}

describe('repository query performance with ~5 years of representative data', () => {
  it("Home's 7-day check-in window query stays fast", async () => {
    await assertFast('listByDateRange (7 days)', () =>
      dailyCheckInRepository.listByDateRange('2025-12-25', '2025-12-31'),
    )
  })

  it("Trends' 90-day check-in window query stays fast", async () => {
    await assertFast('listByDateRange (90 days)', () =>
      dailyCheckInRepository.listByDateRange('2025-10-03', '2025-12-31'),
    )
  })

  it('listing the full commitment history stays fast', async () => {
    await assertFast('socialCommitmentRepository.list()', () =>
      socialCommitmentRepository.list(),
    )
  })

  it('listing the full observer-entry history stays fast', async () => {
    await assertFast('observerEntryRepository.list()', () =>
      observerEntryRepository.list(),
    )
  })

  it('listing the full health-measurement history stays fast', async () => {
    await assertFast('healthMeasurementRepository.list()', () =>
      healthMeasurementRepository.list(),
    )
  })
})
