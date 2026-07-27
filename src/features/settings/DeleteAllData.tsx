import { useState } from 'react'
import { deleteAllLocalData } from '../../data/db'
import { useToast } from '../../components/toastContext'

export function DeleteAllData() {
  const [confirming, setConfirming] = useState(false)
  const { showToast } = useToast()

  async function handleDelete() {
    await deleteAllLocalData()
    setConfirming(false)
    showToast('All local data deleted', 'success')
  }

  return (
    <section className="card stack">
      <h2>Delete all data</h2>
      <p className="hint">
        This removes all records stored in this browser. Files you have already exported
        are not affected and cannot be deleted by Nepsis.
      </p>
      {!confirming ? (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => setConfirming(true)}
        >
          Delete all local data
        </button>
      ) : (
        <div className="stack">
          <p>Are you sure? This cannot be undone.</p>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Yes, delete everything
            </button>
            <button type="button" className="btn" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
