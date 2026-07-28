import { describe, expect, it } from 'vitest'
import { appPreferenceSchema, type AppPreference } from '../appPreference'
import { SCHEMA_VERSION } from '../shared'

function basePreference(overrides: Partial<AppPreference> = {}): AppPreference {
  return {
    id: 'app-preferences',
    schemaVersion: SCHEMA_VERSION,
    privacyCurtainEnabled: false,
    ...overrides,
  }
}

describe('appPreferenceSchema', () => {
  it('accepts a valid preference record', () => {
    expect(appPreferenceSchema.safeParse(basePreference()).success).toBe(true)
  })

  it('accepts the curtain enabled', () => {
    const result = appPreferenceSchema.safeParse(
      basePreference({ privacyCurtainEnabled: true }),
    )
    expect(result.success).toBe(true)
  })

  it('rejects a non-boolean privacyCurtainEnabled', () => {
    const result = appPreferenceSchema.safeParse(
      // @ts-expect-error intentionally invalid type
      basePreference({ privacyCurtainEnabled: 'yes' }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects a missing id', () => {
    const result = appPreferenceSchema.safeParse({
      schemaVersion: SCHEMA_VERSION,
      privacyCurtainEnabled: false,
    })
    expect(result.success).toBe(false)
  })
})
