import { db } from '../db'
import { appPreferenceSchema, SCHEMA_VERSION, type AppPreference } from '../schemas'
import { createRepository } from './createRepository'

/** There is exactly one app-preferences record for the MVP, stored under this fixed id. */
export const SINGLETON_APP_PREFERENCE_ID = 'app-preferences'

const DEFAULT_APP_PREFERENCE: AppPreference = {
  id: SINGLETON_APP_PREFERENCE_ID,
  schemaVersion: SCHEMA_VERSION,
  privacyCurtainEnabled: false,
}

const base = createRepository<AppPreference>(db.appPreferences, appPreferenceSchema)

export const appPreferenceRepository = {
  ...base,
  async getSingleton(): Promise<AppPreference> {
    const existing = await db.appPreferences.get(SINGLETON_APP_PREFERENCE_ID)
    return existing ?? DEFAULT_APP_PREFERENCE
  },
  async save(input: Omit<AppPreference, 'id' | 'schemaVersion'>): Promise<AppPreference> {
    return base.update({
      ...input,
      id: SINGLETON_APP_PREFERENCE_ID,
      schemaVersion: SCHEMA_VERSION,
    })
  },
}
