import { useObserverEntries } from './useObserverEntries'
import { ObserverForm } from './ObserverForm'
import { ObserverEntryCard } from './ObserverEntryCard'

export function ObserverPage() {
  const { entries, loading, create } = useObserverEntries()

  return (
    <div className="page stack">
      <h1>Observer check-in</h1>
      <ObserverForm onCreate={create} />
      {loading ? (
        <p>Loading…</p>
      ) : entries.length === 0 ? (
        <p className="hint">No observer entries recorded yet.</p>
      ) : (
        <div className="stack">
          {entries.map((entry) => (
            <ObserverEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
