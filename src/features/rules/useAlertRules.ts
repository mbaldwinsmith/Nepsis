import { useEffect, useState } from 'react'
import { alertRuleRepository } from '../../data/repositories'
import type { AlertRule } from '../../data/schemas'
import { nowIsoDateTime } from '../../utils/date'

export function useAlertRules() {
  const [rules, setRules] = useState<AlertRule[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const all = await alertRuleRepository.list()
    all.sort((a, b) => a.label.localeCompare(b.label))
    setRules(all)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  async function update(rule: AlertRule) {
    await alertRuleRepository.update({ ...rule, updatedAt: nowIsoDateTime() })
    await refresh()
  }

  async function duplicate(rule: AlertRule) {
    const now = nowIsoDateTime()
    await alertRuleRepository.create({
      ...rule,
      id: crypto.randomUUID(),
      label: `${rule.label} (copy)`,
      source: 'userCreated',
      ruleVersion: 1,
      createdAt: now,
      updatedAt: now,
    })
    await refresh()
  }

  return { rules, loading, update, duplicate }
}
