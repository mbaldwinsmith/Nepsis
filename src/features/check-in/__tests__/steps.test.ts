import { describe, expect, it } from 'vitest'
import { checkInSteps } from '../steps'
import {
  sleepSchema,
  moodSchema,
  warningSignsSchema,
  medicationEffectsSchema,
  appetiteSchema,
  urgesSchema,
  alcoholSchema,
  socialSchema,
} from '../../../data/schemas'

// Fields with no UI control in the current app — schema-only today, not
// reachable through any form. Excluded here rather than added to a step,
// since wiring them up is out of scope for this presentation-only pass.
const ORPHANED_FIELDS: Record<string, string[]> = {
  warningSigns: ['custom'],
  medicationEffects: ['medicationEntryIds'],
}

const schemasBySection = {
  sleep: sleepSchema,
  mood: moodSchema,
  warningSigns: warningSignsSchema,
  medicationEffects: medicationEffectsSchema,
  appetite: appetiteSchema,
  urges: urgesSchema,
  alcohol: alcoholSchema,
  social: socialSchema,
} as const

describe('checkInSteps', () => {
  it('has exactly 12 steps', () => {
    expect(checkInSteps).toHaveLength(12)
  })

  it('has a unique id for every step', () => {
    const ids = checkInSteps.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes the notes step with no nested fields', () => {
    const noteStep = checkInSteps.find((s) => s.section === 'notes')
    expect(noteStep).toBeDefined()
    expect(noteStep?.fields).toEqual([])
  })

  for (const [section, schema] of Object.entries(schemasBySection)) {
    it(`covers every reachable field of the "${section}" schema exactly once`, () => {
      const stepFields = checkInSteps
        .filter((s) => s.section === section)
        .flatMap((s) => s.fields)

      const schemaFields = Object.keys(schema.shape).filter(
        (key) => !(ORPHANED_FIELDS[section] ?? []).includes(key),
      )

      expect(new Set(stepFields).size).toBe(stepFields.length) // no field covered twice
      expect(new Set(stepFields)).toEqual(new Set(schemaFields))
    })
  }
})
