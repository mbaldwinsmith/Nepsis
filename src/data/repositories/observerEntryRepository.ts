import { db } from '../db'
import { observerEntrySchema, type ObserverEntry } from '../schemas'
import { createRepository } from './createRepository'

const base = createRepository<ObserverEntry>(db.observerEntries, observerEntrySchema)

export const observerEntryRepository = {
  ...base,
  async listByDateRange(startDate: string, endDate: string): Promise<ObserverEntry[]> {
    return db.observerEntries
      .where('observationDate')
      .between(startDate, endDate, true, true)
      .sortBy('observationDate')
  },
}
