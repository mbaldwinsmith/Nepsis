import { useCommitments } from './useCommitments'
import { CommitmentCard } from './CommitmentCard'
import { NewCommitmentForm } from './NewCommitmentForm'

export function CommitmentsPage() {
  const { commitments, loading, create, update } = useCommitments()

  return (
    <div className="page stack">
      <h1>Plans & commitments</h1>
      <NewCommitmentForm onCreate={create} />
      {loading ? (
        <p>Loading…</p>
      ) : commitments.length === 0 ? (
        <p className="hint">Nothing planned yet. Add a commitment above.</p>
      ) : (
        <div className="stack">
          {commitments.map((commitment) => (
            <CommitmentCard
              key={commitment.id}
              commitment={commitment}
              onUpdate={update}
            />
          ))}
        </div>
      )}
    </div>
  )
}
