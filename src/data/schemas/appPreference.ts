import { z } from 'zod'
import { id, SCHEMA_VERSION } from './shared'

/**
 * Device-local UI preferences — never included in encrypted backup/restore
 * (src/data/backup/), since these describe how this device's screen
 * behaves, not portable personal data.
 */
export const appPreferenceSchema = z.object({
  id: id(),
  schemaVersion: z.literal(SCHEMA_VERSION),
  privacyCurtainEnabled: z.boolean(),
})

export type AppPreference = z.infer<typeof appPreferenceSchema>
