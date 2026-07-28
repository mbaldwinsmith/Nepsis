import { useEffect, useState } from 'react'
import {
  medicationDefinitionRepository,
  medicationEntryRepository,
  transitionEventRepository,
} from '../../data/repositories'
import {
  SCHEMA_VERSION,
  type MedicationDefinition,
  type MedicationEntry,
  type TransitionEvent,
} from '../../data/schemas'
import { nowIsoDateTime } from '../../utils/date'

export function useMedications() {
  const [definitions, setDefinitions] = useState<MedicationDefinition[]>([])
  const [entries, setEntries] = useState<MedicationEntry[]>([])
  const [events, setEvents] = useState<TransitionEvent[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const [defs, allEntries, allEvents] = await Promise.all([
      medicationDefinitionRepository.list(),
      medicationEntryRepository.list(),
      transitionEventRepository.listChronological(),
    ])
    setDefinitions(defs)
    setEntries(allEntries.sort((a, b) => (a.takenAt < b.takenAt ? 1 : -1)))
    setEvents([...allEvents].reverse())
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  async function createDefinition(input: {
    name: string
    formulation?: string
    notes?: string
  }) {
    const now = nowIsoDateTime()
    await medicationDefinitionRepository.create({
      ...input,
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      active: true,
      createdAt: now,
      updatedAt: now,
    })
    await refresh()
  }

  async function archiveDefinition(definition: MedicationDefinition) {
    await medicationDefinitionRepository.update({
      ...definition,
      active: false,
      updatedAt: nowIsoDateTime(),
    })
    await refresh()
  }

  async function unarchiveDefinition(definition: MedicationDefinition) {
    await medicationDefinitionRepository.update({
      ...definition,
      active: true,
      updatedAt: nowIsoDateTime(),
    })
    await refresh()
  }

  async function createEntry(input: Omit<MedicationEntry, 'id' | 'schemaVersion'>) {
    await medicationEntryRepository.create({
      ...input,
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
    })
    await refresh()
  }

  async function createEvent(input: Omit<TransitionEvent, 'id' | 'schemaVersion'>) {
    await transitionEventRepository.create({
      ...input,
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
    })
    await refresh()
  }

  return {
    definitions,
    entries,
    events,
    loading,
    createDefinition,
    archiveDefinition,
    unarchiveDefinition,
    createEntry,
    createEvent,
  }
}
