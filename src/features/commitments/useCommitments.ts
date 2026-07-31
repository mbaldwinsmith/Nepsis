import { useEffect, useState } from 'react'
import { socialCommitmentRepository } from '../../data/repositories'
import { SCHEMA_VERSION, type SocialCommitment } from '../../data/schemas'
import { nowIsoDateTime } from '../../utils/date'

export function useCommitments() {
  const [commitments, setCommitments] = useState<SocialCommitment[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const all = await socialCommitmentRepository.list()
    all.sort((a, b) => (a.plannedDate < b.plannedDate ? 1 : -1))
    setCommitments(all)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  async function create(
    input: Omit<
      SocialCommitment,
      'id' | 'schemaVersion' | 'createdAt' | 'updatedAt' | 'outcome'
    >,
  ) {
    const now = nowIsoDateTime()
    await socialCommitmentRepository.create({
      ...input,
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      outcome: 'planned',
      createdAt: now,
      updatedAt: now,
    })
    await refresh()
  }

  async function update(commitment: SocialCommitment) {
    await socialCommitmentRepository.update({
      ...commitment,
      updatedAt: nowIsoDateTime(),
    })
    await refresh()
  }

  async function remove(id: string) {
    await socialCommitmentRepository.remove(id)
    await refresh()
  }

  /** Re-inserts a commitment exactly as it was, id and timestamps included — for undoing a remove. */
  async function restore(commitment: SocialCommitment) {
    await socialCommitmentRepository.create(commitment)
    await refresh()
  }

  return { commitments, loading, create, update, remove, restore, refresh }
}
