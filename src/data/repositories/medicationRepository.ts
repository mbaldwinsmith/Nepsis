import { db } from '../db'
import {
  medicationDefinitionSchema,
  medicationEntrySchema,
  type MedicationDefinition,
  type MedicationEntry,
} from '../schemas'
import { createRepository } from './createRepository'

const definitionsBase = createRepository<MedicationDefinition>(
  db.medicationDefinitions,
  medicationDefinitionSchema,
)

export const medicationDefinitionRepository = {
  ...definitionsBase,
  async listActive(): Promise<MedicationDefinition[]> {
    return db.medicationDefinitions.filter((d) => d.active).toArray()
  },
}

const entriesBase = createRepository<MedicationEntry>(
  db.medicationEntries,
  medicationEntrySchema,
)

export const medicationEntryRepository = {
  ...entriesBase,
  async listByDefinition(medicationDefinitionId: string): Promise<MedicationEntry[]> {
    return db.medicationEntries
      .where('medicationDefinitionId')
      .equals(medicationDefinitionId)
      .sortBy('takenAt')
  },
}
