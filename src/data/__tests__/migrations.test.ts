import { describe, expect, it } from 'vitest'
import { NepsisDatabase } from '../db'
import { migrationHistory } from '../migrations'

describe('database schema', () => {
  it('opens at the expected Dexie version with every entity table', async () => {
    const db = new NepsisDatabase(`migration-test-${crypto.randomUUID()}`)
    await db.open()

    expect(db.verno).toBe(1)
    expect(db.tables.map((t) => t.name).sort()).toEqual(
      [
        'alertRules',
        'dailyCheckIns',
        'healthMeasurements',
        'medicationDefinitions',
        'medicationEntries',
        'observerEntries',
        'personalBaselines',
        'safetyPlans',
        'socialCommitments',
        'transitionEvents',
      ].sort(),
    )

    db.close()
  })

  it('orders migration notes non-decreasingly by Dexie version', () => {
    // Multiple notes may share a dexieVersion (a schema shape finalized
    // within the same Dexie version, with no table/index change), but
    // notes must never appear out of order relative to shipped versions.
    const versions = migrationHistory.map((m) => m.dexieVersion)
    expect(versions).toEqual([...versions].sort((a, b) => a - b))
  })

  it('matches the highest dexieVersion mentioned in migration notes to the live schema', async () => {
    const highestNoted = Math.max(...migrationHistory.map((m) => m.dexieVersion))
    const db = new NepsisDatabase(`migration-test-${crypto.randomUUID()}`)
    await db.open()
    expect(db.verno).toBe(highestNoted)
    db.close()
  })
})
