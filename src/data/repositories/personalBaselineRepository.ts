import { db } from '../db'
import { personalBaselineSchema, SCHEMA_VERSION, type PersonalBaseline } from '../schemas'
import { createRepository } from './createRepository'

/** There is exactly one baseline record for the MVP, stored under this fixed id. */
export const SINGLETON_BASELINE_ID = 'personal-baseline'

const base = createRepository<PersonalBaseline>(
  db.personalBaselines,
  personalBaselineSchema,
)

export const personalBaselineRepository = {
  ...base,
  async getSingleton(): Promise<PersonalBaseline | undefined> {
    return db.personalBaselines.get(SINGLETON_BASELINE_ID)
  },
  async save(
    input: Omit<PersonalBaseline, 'id' | 'schemaVersion'>,
  ): Promise<PersonalBaseline> {
    return base.update({
      ...input,
      id: SINGLETON_BASELINE_ID,
      schemaVersion: SCHEMA_VERSION,
    })
  },
}
