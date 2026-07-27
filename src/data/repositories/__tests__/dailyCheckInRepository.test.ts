import { beforeEach, describe, expect, it } from 'vitest'
import { NepsisDatabase } from '../../db'
import { createRepository } from '../createRepository'
import { dailyCheckInSchema, SCHEMA_VERSION, type DailyCheckIn } from '../../schemas'

let db: NepsisDatabase
let repo: ReturnType<typeof createRepository<DailyCheckIn>>

beforeEach(async () => {
  db = new NepsisDatabase(`test-${crypto.randomUUID()}`)
  await db.open()
  repo = createRepository<DailyCheckIn>(db.dailyCheckIns, dailyCheckInSchema)
})

function validCheckIn(overrides: Partial<DailyCheckIn> = {}): DailyCheckIn {
  return {
    id: crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    entryDate: '2026-01-15',
    recordedAt: '2026-01-15T21:00:00.000Z',
    updatedAt: '2026-01-15T21:00:00.000Z',
    sleep: {},
    mood: {},
    warningSigns: {},
    medicationEffects: {},
    appetite: {},
    urges: {},
    alcohol: {},
    social: {},
    ...overrides,
  }
}

describe('dailyCheckInRepository (createRepository)', () => {
  it('creates and retrieves a valid check-in', async () => {
    const created = await repo.create(validCheckIn())
    const found = await repo.get(created.id)
    expect(found?.id).toBe(created.id)
  })

  it('persists records across a fresh connection to the same database', async () => {
    const created = await repo.create(validCheckIn())
    db.close()

    const reopened = new NepsisDatabase(db.name)
    await reopened.open()
    const reopenedRepo = createRepository<DailyCheckIn>(
      reopened.dailyCheckIns,
      dailyCheckInSchema,
    )
    const found = await reopenedRepo.get(created.id)
    expect(found?.entryDate).toBe('2026-01-15')
    reopened.close()
  })

  it('rejects an invalid record rather than persisting it', async () => {
    await expect(
      repo.create(validCheckIn({ sleep: { sleepDurationMinutes: -5 } })),
    ).rejects.toThrow()
    const all = await repo.list()
    expect(all).toHaveLength(0)
  })

  it('updates an existing record', async () => {
    const created = await repo.create(validCheckIn())
    await repo.update({ ...created, notes: 'Updated note' })
    const found = await repo.get(created.id)
    expect(found?.notes).toBe('Updated note')
  })

  it('removes a record', async () => {
    const created = await repo.create(validCheckIn())
    await repo.remove(created.id)
    expect(await repo.get(created.id)).toBeUndefined()
  })
})
