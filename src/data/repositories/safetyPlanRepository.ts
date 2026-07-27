import { db } from '../db'
import { safetyPlanSchema, SCHEMA_VERSION, type SafetyPlan } from '../schemas'
import { createRepository } from './createRepository'

/** There is exactly one safety plan for the MVP, stored under this fixed id. */
export const SINGLETON_SAFETY_PLAN_ID = 'safety-plan'

const base = createRepository<SafetyPlan>(db.safetyPlans, safetyPlanSchema)

export const safetyPlanRepository = {
  ...base,
  async getSingleton(): Promise<SafetyPlan | undefined> {
    return db.safetyPlans.get(SINGLETON_SAFETY_PLAN_ID)
  },
  async save(input: Omit<SafetyPlan, 'id' | 'schemaVersion'>): Promise<SafetyPlan> {
    return base.update({
      ...input,
      id: SINGLETON_SAFETY_PLAN_ID,
      schemaVersion: SCHEMA_VERSION,
    })
  },
}
