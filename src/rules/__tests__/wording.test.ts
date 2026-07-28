import { describe, it } from 'vitest'
import { buildDefaultRuleRecords } from '../defaultRules'
import { ruleTypeDefinitions } from '../ruleTypes'
import { resolveParams } from '../params'
import { assertNoBannedPhrase } from '../../utils/prohibitedWording'

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
