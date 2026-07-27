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

  it('records a migration note for every shipped Dexie version', () => {
    const versions = migrationHistory.map((m) => m.dexieVersion)
    expect(versions).toEqual([...versions].sort((a, b) => a - b))
    expect(new Set(versions).size).toBe(versions.length)
  })
})
