import { useMedications } from './useMedications'
import { MedicationDefinitions } from './MedicationDefinitions'
import { DoseLog } from './DoseLog'
import { TransitionTimeline } from './TransitionTimeline'

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
        onCreate={createDefinition}
        onArchive={archiveDefinition}
        onUnarchive={unarchiveDefinition}
      />
      <DoseLog definitions={definitions} entries={entries} onCreate={createEntry} />
      <TransitionTimeline events={events} onCreate={createEvent} />
    </div>
  )
}
