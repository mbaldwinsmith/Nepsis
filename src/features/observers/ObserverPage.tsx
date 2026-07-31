import { useObserverEntries } from './useObserverEntries'
import { ObserverForm } from './ObserverForm'
import { ObserverEntryCard } from './ObserverEntryCard'
import { ShowMoreList } from '../../components/ShowMoreList'
import { useToast } from '../../components/toastContext'

export function ObserverPage() {
  const { entries, loading, create } = useObserverEntries()
  const { showToast } = useToast()

  async function handleCreate(input: Parameters<typeof create>[0]) {
    try {
      await create(input)
      showToast('Observation saved', 'success')
    } catch {
      showToast('Could not save this observation. Please try again.', 'error')
    }
  }

  return (
    <div className="page stack">
      <h1>Observer check-in</h1>
      <p className="hint">
        Observer entries are kept separate from your own check-ins, so each perspective
        stays distinct rather than being blended into one score.
      </p>
      <ObserverForm onCreate={handleCreate} />
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
