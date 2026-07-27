import type { CommitmentReason } from '../data/schemas'

/** Reasons that indicate a commitment was missed because things felt harder, not a healthy boundary or scheduling clash. */
export const DISTRESS_RELATED_REASONS: readonly CommitmentReason[] = [
  'distress',
  'anxiety',
  'lowEnergy',
  'overwhelmed',
]

export function isDistressRelated(reasons: CommitmentReason[] | undefined): boolean {
  return (reasons ?? []).some((r) => DISTRESS_RELATED_REASONS.includes(r))
}
