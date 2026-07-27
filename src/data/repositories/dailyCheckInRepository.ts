import { db } from '../db'
import { dailyCheckInSchema, type DailyCheckIn } from '../schemas'
import { createRepository } from './createRepository'

const base = createRepository<DailyCheckIn>(db.dailyCheckIns, dailyCheckInSchema)

export const dailyCheckInRepository = {
  ...base,
  async getByDate(entryDate: string): Promise<DailyCheckIn | undefined> {
    return db.dailyCheckIns.where('entryDate').equals(entryDate).first()
  },
  async listByDateRange(startDate: string, endDate: string): Promise<DailyCheckIn[]> {
    return db.dailyCheckIns
      .where('entryDate')
      .between(startDate, endDate, true, true)
      .sortBy('entryDate')
  },
}
