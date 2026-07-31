import { useEffect, useRef } from 'react'
import { useCommitments } from './useCommitments'
import { CommitmentCard } from './CommitmentCard'
import { NewCommitmentForm } from './NewCommitmentForm'
import { ShowMoreList } from '../../components/ShowMoreList'
import { useToast } from '../../components/toastContext'
import type { SocialCommitment } from '../../data/schemas'
import { COMMITMENT_OUTCOME_LABELS } from '../../utils/enumLabels'

// CommitmentCard auto-saves each field the moment it changes (outcome,
// reasons, notice, after-effect, note), so a burst of edits to one entry
// would otherwise fire a toast per click/keystroke. Collapsing them into one
// toast after a short pause reads as "your changes are saved", not noise.
const UPDATE_TOAST_DELAY_MS = 700

export function CommitmentsPage() {
  const { commitments, loading, create, update, remove, restore } = useCommitments()
  const { showToast } = useToast()
  const updateToastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(updateToastTimer.current), [])

  async function handleCreate(input: Parameters<typeof create>[0]) {
    try {
      await create(input)
      showToast('Commitment added', 'success')
    } catch {
      showToast('Could not add this commitment. Please try again.', 'error')
    }
  }

  async function handleUpdate(commitment: SocialCommitment) {
    try {
      await update(commitment)
      clearTimeout(updateToastTimer.current)
      updateToastTimer.current = setTimeout(() => {
        showToast('Commitment updated', 'success')
      }, UPDATE_TOAST_DELAY_MS)
    } catch {
      showToast('Could not save this change. Please try again.', 'error')
    }
  }

  async function handleOutcomeChange(next: SocialCommitment, previous: SocialCommitment) {
    try {
      await update(next)
      // A deliberate, undoable moment in its own right, so it isn't folded
      // into the debounced "Commitment updated" toast used for the rest of
      // the card's auto-saving fields.
      showToast(`Marked as ${COMMITMENT_OUTCOME_LABELS[next.outcome]}`, 'success', {
        label: 'Undo',
        onClick: () => {
          update(previous).catch(() => {
            showToast('Could not undo. Please try again.', 'error')
          })
        },
      })
    } catch {
      showToast('Could not save this change. Please try again.', 'error')
    }
  }

  async function handleRemove(commitment: SocialCommitment) {
    try {
      await remove(commitment.id)
      showToast('Commitment deleted', 'success', {
        label: 'Undo',
        onClick: () => {
          restore(commitment).catch(() => {
            showToast('Could not undo. Please try again.', 'error')
          })
        },
      })
    } catch {
      showToast('Could not delete this commitment. Please try again.', 'error')
    }
  }

  return (
    <div className="page stack">
      <h1>Plans & commitments</h1>
      <NewCommitmentForm onCreate={handleCreate} />
      {loading ? (
        <p>Loading…</p>
      ) : commitments.length === 0 ? (
        <p className="hint">Nothing planned yet. Add a commitment above.</p>
      ) : (
        <ShowMoreList
          items={commitments}
          getKey={(commitment) => commitment.id}
          renderItem={(commitment) => (
            <CommitmentCard
              commitment={commitment}
              onUpdate={handleUpdate}
              onOutcomeChange={handleOutcomeChange}
              onRemove={handleRemove}
            />
          )}
        />
      )}
    </div>
  )
}
