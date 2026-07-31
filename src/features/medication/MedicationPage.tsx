import { useMedications } from './useMedications'
import { MedicationDefinitions } from './MedicationDefinitions'
import { DoseLog } from './DoseLog'
import { TransitionTimeline } from './TransitionTimeline'
import { useToast } from '../../components/toastContext'
import type { MedicationDefinition } from '../../data/schemas'

export function MedicationPage() {
  const {
    definitions,
    entries,
    events,
    loading,
    createDefinition,
    archiveDefinition,
    unarchiveDefinition,
    createEntry,
    createEvent,
  } = useMedications()
  const { showToast } = useToast()

  async function handleCreateDefinition(input: Parameters<typeof createDefinition>[0]) {
    try {
      await createDefinition(input)
      showToast('Medication added', 'success')
    } catch {
      showToast('Could not add this medication. Please try again.', 'error')
    }
  }

  async function handleArchive(definition: MedicationDefinition) {
    try {
      await archiveDefinition(definition)
      showToast(`${definition.name} archived`, 'success')
    } catch {
      showToast('Could not archive this medication. Please try again.', 'error')
    }
  }

  async function handleUnarchive(definition: MedicationDefinition) {
    try {
      await unarchiveDefinition(definition)
      showToast(`${definition.name} unarchived`, 'success')
    } catch {
      showToast('Could not unarchive this medication. Please try again.', 'error')
    }
  }

  async function handleCreateEntry(input: Parameters<typeof createEntry>[0]) {
    try {
      await createEntry(input)
      showToast('Dose logged', 'success')
    } catch {
      showToast('Could not log this dose. Please try again.', 'error')
    }
  }

  async function handleCreateEvent(input: Parameters<typeof createEvent>[0]) {
    try {
      await createEvent(input)
      showToast('Event added', 'success')
    } catch {
      showToast('Could not add this event. Please try again.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <div className="page stack">
      <h1>Medication & timeline</h1>
      <MedicationDefinitions
        definitions={definitions}
        onCreate={handleCreateDefinition}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
      />
      <DoseLog definitions={definitions} entries={entries} onCreate={handleCreateEntry} />
      <TransitionTimeline events={events} onCreate={handleCreateEvent} />
    </div>
  )
}
