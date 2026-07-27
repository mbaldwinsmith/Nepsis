import { useEffect, useState } from 'react'
import { observerEntryRepository } from '../../data/repositories'
import { SCHEMA_VERSION, type ObserverEntry } from '../../data/schemas'
import { nowIsoDateTime } from '../../utils/date'

export function useObserverEntries() {
  const [entries, setEntries] = useState<ObserverEntry[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const all = await observerEntryRepository.list()
    all.sort((a, b) => (a.recordedAt < b.recordedAt ? 1 : -1))
    setEntries(all)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  async function create(
    input: Omit<ObserverEntry, 'id' | 'schemaVersion' | 'recordedAt'>,
  ) {
    await observerEntryRepository.create({
      ...input,
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      recordedAt: nowIsoDateTime(),
    })
    await refresh()
  }

  return { entries, loading, create }
}
