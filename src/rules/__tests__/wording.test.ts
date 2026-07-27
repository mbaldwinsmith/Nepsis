import { describe, expect, it } from 'vitest'
import { buildDefaultRuleRecords } from '../defaultRules'
import { ruleTypeDefinitions } from '../ruleTypes'
import { resolveParams } from '../params'

const BANNED_PHRASES = [
  'you are manic',
  'you are becoming hypomanic',
  'this is akathisia',
  'your medication is causing',
  'manic',
  'hypomanic',
  'akathisia',
  'addicted',
]

function assertNoBannedPhrase(text: string, label: string) {
  const lower = text.toLowerCase()
  for (const phrase of BANNED_PHRASES) {
    expect(lower, `${label} contains prohibited wording: "${phrase}"`).not.toContain(
      phrase,
    )
  }
}

describe('rule engine wording', () => {
  it('never uses prohibited diagnostic or medication-causation wording in default action text', () => {
    for (const rule of buildDefaultRuleRecords()) {
      assertNoBannedPhrase(rule.actionText, `actionText for ${rule.ruleType}`)
      if (rule.description)
        assertNoBannedPhrase(rule.description, `description for ${rule.ruleType}`)
    }
  })

  it('never uses prohibited wording in the plain-language rule preview', () => {
    for (const def of Object.values(ruleTypeDefinitions)) {
      const params = resolveParams(def.paramSchema, {})
      const preview = def.describe(params, def.defaultLookbackDays)
      assertNoBannedPhrase(preview, `describe() for ${def.ruleType}`)
      assertNoBannedPhrase(def.defaultLabel, `defaultLabel for ${def.ruleType}`)
    }
  })
})
