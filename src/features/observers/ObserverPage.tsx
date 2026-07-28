import { useObserverEntries } from './useObserverEntries'
import { ObserverForm } from './ObserverForm'
import { ObserverEntryCard } from './ObserverEntryCard'
import { ShowMoreList } from '../../components/ShowMoreList'

export function ObserverPage() {
  const { entries, loading, create } = useObserverEntries()

  return (
    <div className="page stack">
      <h1>Observer check-in</h1>
      <p className="hint">
        Observer entries are kept separate from your own check-ins, so each perspective
        stays distinct rather than being blended into one score.
      </p>
      <ObserverForm onCreate={create} />
      {loading ? (
        <p>Loading…</p>
      ) : entries.length === 0 ? (
        <p className="hint">No observer entries recorded yet.</p>
      ) : (
        <ShowMoreList
          items={entries}
          getKey={(entry) => entry.id}
          renderItem={(entry) => <ObserverEntryCard entry={entry} />}
        />
      )}
    </div>
  )
}
