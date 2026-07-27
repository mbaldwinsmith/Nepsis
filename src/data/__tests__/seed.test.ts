import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db'
import { loadSeedData } from '../seed'
import {
  dailyCheckInSchema,
  socialCommitmentSchema,
  observerEntrySchema,
  medicationDefinitionSchema,
  medicationEntrySchema,
  transitionEventSchema,
  healthMeasurementSchema,
} from '../schemas'

beforeEach(async () => {
  await db.dailyCheckIns.clear()
  await db.socialCommitments.clear()
  await db.observerEntries.clear()
  await db.medicationDefinitions.clear()
  await db.medicationEntries.clear()
  await db.transitionEvents.clear()
  await db.healthMeasurements.clear()
})

describe('loadSeedData', () => {
  it('inserts only records that satisfy their Zod schema', async () => {
    await loadSeedData()

    const [
      checkIns,
      commitments,
      observerEntries,
      definitions,
      entries,
      events,
      measurements,
    ] = await Promise.all([
      db.dailyCheckIns.toArray(),
      db.socialCommitments.toArray(),
      db.observerEntries.toArray(),
      db.medicationDefinitions.toArray(),
      db.medicationEntries.toArray(),
      db.transitionEvents.toArray(),
      db.healthMeasurements.toArray(),
    ])

    for (const record of checkIns)
      expect(dailyCheckInSchema.safeParse(record).success).toBe(true)
    for (const record of commitments)
      expect(socialCommitmentSchema.safeParse(record).success).toBe(true)
    for (const record of observerEntries)
      expect(observerEntrySchema.safeParse(record).success).toBe(true)
    for (const record of definitions)
      expect(medicationDefinitionSchema.safeParse(record).success).toBe(true)
    for (const record of entries)
      expect(medicationEntrySchema.safeParse(record).success).toBe(true)
    for (const record of events)
      expect(transitionEventSchema.safeParse(record).success).toBe(true)
    for (const record of measurements)
      expect(healthMeasurementSchema.safeParse(record).success).toBe(true)

    expect(checkIns.length).toBeGreaterThan(0)
    expect(commitments.length).toBeGreaterThan(0)
  })
})
