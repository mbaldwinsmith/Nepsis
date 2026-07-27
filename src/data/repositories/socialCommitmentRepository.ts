import { db } from '../db'
import { socialCommitmentSchema, type SocialCommitment } from '../schemas'
import { createRepository } from './createRepository'

const base = createRepository<SocialCommitment>(
  db.socialCommitments,
  socialCommitmentSchema,
)

export const socialCommitmentRepository = {
  ...base,
  async listByDateRange(startDate: string, endDate: string): Promise<SocialCommitment[]> {
    return db.socialCommitments
      .where('plannedDate')
      .between(startDate, endDate, true, true)
      .sortBy('plannedDate')
  },
  async listUpcoming(fromDate: string, limit = 5): Promise<SocialCommitment[]> {
    const upcoming = await db.socialCommitments
      .where('plannedDate')
      .aboveOrEqual(fromDate)
      .and((c) => c.outcome === 'planned')
      .sortBy('plannedDate')
    return upcoming.slice(0, limit)
  },
}
