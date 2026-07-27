import { db } from '../db'
import { alertRuleSchema, type AlertRule } from '../schemas'
import { createRepository } from './createRepository'

const base = createRepository<AlertRule>(db.alertRules, alertRuleSchema)

export const alertRuleRepository = {
  ...base,
  async listEnabled(): Promise<AlertRule[]> {
    return db.alertRules.filter((r) => r.enabled).toArray()
  },
}
