import { z } from 'zod'
import { id, isoDate, scale, optionalText, SCHEMA_VERSION } from './shared'

export const personalBaselineSchema = z.object({
  id: id(),
  schemaVersion: z.literal(SCHEMA_VERSION),
  usualSleepDurationMinutes: z.number().int().nonnegative().optional(),
  usualSleepQuality: scale(0, 4).optional(),
  usualLunchtimeNapNeed: scale(0, 3).optional(),
  usualWeeklyAlcoholUnits: z.number().nonnegative().optional(),
  usualSocialActivity: scale(0, 4).optional(),
  usualSocialDrive: scale(-2, 2).optional(),
  usualAppetite: scale(0, 4).optional(),
  usualSatiety: scale(0, 4).optional(),
  usualEnergy: scale(0, 4).optional(),
  usualLowMood: scale(0, 4).optional(),
  usualElevatedMood: scale(0, 4).optional(),
  comparisonWindowDays: z.number().int().positive().optional(),
  baselineStartDate: isoDate().optional(),
  baselineEndDate: isoDate().optional(),
  notes: optionalText(),
})

export type PersonalBaseline = z.infer<typeof personalBaselineSchema>
