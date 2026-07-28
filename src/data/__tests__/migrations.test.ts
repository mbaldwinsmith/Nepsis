import Dexie from 'dexie'
import { describe, expect, it } from 'vitest'
import { NepsisDatabase } from '../db'
import { migrationHistory } from '../migrations'

describe('database schema', () => {
  it('opens at the expected Dexie version with every entity table', async () => {
    const db = new NepsisDatabase(`migration-test-${crypto.randomUUID()}`)
    await db.open()

    expect(db.verno).toBe(2)
    expect(db.tables.map((t) => t.name).sort()).toEqual(
      [
        'alertRules',
        'appPreferences',
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

  it('upgrades an existing version-1 database to version 2 without losing data', async () => {
    const name = `migration-upgrade-test-${crypto.randomUUID()}`

    // Simulate a browser that already has a version-1 database on disk,
    // written before appPreferences existed.
    const v1Only = new Dexie(name)
    v1Only.version(1).stores({
      dailyCheckIns: 'id, entryDate, recordedAt, updatedAt',
      socialCommitments: 'id, plannedDate, outcome, type',
      observerEntries: 'id, observationDate, concern',
      medicationDefinitions: 'id, name',
      medicationEntries: 'id, medicationDefinitionId, takenAt, status',
      transitionEvents: 'id, occurredAt, type',
      healthMeasurements: 'id, type, measuredAt',
      personalBaselines: 'id',
      safetyPlans: 'id',
      alertRules: 'id, source',
    })
    await v1Only.open()
    await v1Only
      .table('personalBaselines')
      .put({ id: 'personal-baseline', notes: 'v1 data' })
    v1Only.close()

    const upgraded = new NepsisDatabase(name)
    await upgraded.open()

    expect(upgraded.verno).toBe(2)
    const baseline = await upgraded.personalBaselines.get('personal-baseline')
    expect(baseline?.notes).toBe('v1 data')
    expect(await upgraded.appPreferences.toArray()).toEqual([])

    upgraded.close()
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
