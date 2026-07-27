import { useEffect, useState } from 'react'
import { safetyPlanRepository } from '../../data/repositories'
import type { SafetyPlan } from '../../data/schemas'

const empty: Omit<SafetyPlan, 'id' | 'schemaVersion'> = {
  prescribingTeamContacts: [],
  trustedContacts: [],
  personalisedWarningSigns: [],
  reviewActions: undefined,
  urgentActions: undefined,
  crisisInstructions: undefined,
  lastReviewedDate: undefined,
}

export function useSafetyPlan() {
  const [plan, setPlan] = useState<Omit<SafetyPlan, 'id' | 'schemaVersion'>>(empty)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    safetyPlanRepository.getSingleton().then((found) => {
      if (found) {
        const { id: _id, schemaVersion: _schemaVersion, ...rest } = found
        setPlan(rest)
      }
      setLoading(false)
    })
  }, [])

  async function save(next: Omit<SafetyPlan, 'id' | 'schemaVersion'>) {
    await safetyPlanRepository.save(next)
    setPlan(next)
  }

  return { plan, loading, save }
}
