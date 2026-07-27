import { z } from 'zod'
import {
  id,
  isoDate,
  isoDateTime,
  scale,
  nonNegativeInt,
  optionalText,
  SCHEMA_VERSION,
} from './shared'

export const napEffectSchema = z.enum(['refreshed', 'unchanged', 'groggy'])
export const napReasonSchema = z.enum([
  'poorSleep',
  'medication',
  'routine',
  'illness',
  'unclear',
])

export const sleepSchema = z
  .object({
    sleepDurationMinutes: nonNegativeInt().optional(),
    sleepQuality: scale(0, 4).optional(),
    reducedNeedForSleep: scale(0, 2).optional(),
    difficultyFallingAsleep: scale(0, 4).optional(),
    wakingUnusuallyEarly: scale(0, 4).optional(),
    lunchtimeNapNeed: scale(0, 3).optional(),
    napTaken: z.boolean().optional(),
    napDurationMinutes: nonNegativeInt().optional(),
    napEffect: napEffectSchema.optional(),
    napReason: napReasonSchema.optional(),
  })
  .refine(
    (v) =>
      v.napTaken || (v.napDurationMinutes === undefined && v.napEffect === undefined),
    {
      message: 'Nap duration and effect can only be recorded when a nap was taken',
      path: ['napDurationMinutes'],
    },
  )

export const moodSchema = z.object({
  lowMood: scale(0, 4).optional(),
  elevatedMood: scale(0, 4).optional(),
  irritability: scale(0, 4).optional(),
  anxiety: scale(0, 4).optional(),
  emotionalSensitivity: scale(0, 4).optional(),
  energy: scale(0, 4).optional(),
  mentalSpeed: scale(-2, 2).optional(),
  goalDirectedActivity: scale(0, 4).optional(),
})

export const customWarningSignObservationSchema = z.object({
  signId: id(),
  present: z.boolean(),
})

export const warningSignsSchema = z.object({
  headBuzz: z.boolean().optional(),
  tightShoulders: z.boolean().optional(),
  shallowBreathing: z.boolean().optional(),
  pressuredSpeech: z.boolean().optional(),
  unusualIdeas: z.boolean().optional(),
  unusuallyDrivenBehaviour: z.boolean().optional(),
  custom: z.array(customWarningSignObservationSchema).optional(),
})

export const medicationEffectsSchema = z.object({
  medicationEntryIds: z.array(id()).optional(),
  missedOrDelayedDose: z.boolean().optional(),
  sedation: scale(0, 4).optional(),
  dizziness: scale(0, 4).optional(),
  nausea: scale(0, 4).optional(),
  tremorOrStiffness: scale(0, 4).optional(),
  innerRestlessness: scale(0, 4).optional(),
  otherSideEffectText: optionalText(),
})

export const appetiteSchema = z.object({
  appetite: scale(0, 4).optional(),
  hungerBetweenMeals: scale(0, 4).optional(),
  satietyAfterNormalMeal: scale(0, 4).optional(),
  foodPreoccupationOrCravings: scale(0, 4).optional(),
  bingeOrLossOfControlEating: z.boolean().optional(),
})

export const urgesSchema = z.object({
  spendingUrge: scale(0, 4).optional(),
  gamblingUrge: scale(0, 4).optional(),
  sexualDriveIncrease: scale(0, 4).optional(),
  otherCompulsiveUrgeText: optionalText(),
})

export const alcoholContextSchema = z.enum([
  'social',
  'withMeal',
  'relaxingAlone',
  'celebration',
  'coping',
  'other',
])
export const alcoholPerceivedEffectSchema = z.enum([
  'better',
  'neutral',
  'worse',
  'unclear',
])

export const alcoholSchema = z
  .object({
    unitsConsumed: z.number().nonnegative().optional(),
    context: alcoholContextSchema.optional(),
    perceivedEffect: alcoholPerceivedEffectSchema.optional(),
  })
  .refine(
    (v) =>
      (v.unitsConsumed ?? 0) > 0 ||
      (v.context === undefined && v.perceivedEffect === undefined),
    {
      message: 'Alcohol context and perceived effect require units greater than zero',
      path: ['context'],
    },
  )

export const socialEffectSchema = z.enum([
  'depleted',
  'slightlyDrained',
  'neutral',
  'nourished',
  'energisedOrOverstimulated',
])
export const socialInteractionTypeSchema = z.enum([
  'inPerson',
  'phoneOrVideo',
  'messaging',
  'groupEvent',
  'churchOrCommunity',
  'work',
])

export const socialSchema = z.object({
  activityAmount: scale(0, 4).optional(),
  socialDrive: scale(-2, 2).optional(),
  effect: socialEffectSchema.optional(),
  interactionTypes: z.array(socialInteractionTypeSchema).optional(),
})

export const dailyCheckInSchema = z.object({
  id: id(),
  schemaVersion: z.literal(SCHEMA_VERSION),
  entryDate: isoDate(),
  recordedAt: isoDateTime(),
  updatedAt: isoDateTime(),
  notes: optionalText(),
  sleep: sleepSchema,
  mood: moodSchema,
  warningSigns: warningSignsSchema,
  medicationEffects: medicationEffectsSchema,
  appetite: appetiteSchema,
  urges: urgesSchema,
  alcohol: alcoholSchema,
  social: socialSchema,
})

export type DailyCheckIn = z.infer<typeof dailyCheckInSchema>
export type Sleep = z.infer<typeof sleepSchema>
export type Mood = z.infer<typeof moodSchema>
export type WarningSigns = z.infer<typeof warningSignsSchema>
export type MedicationEffects = z.infer<typeof medicationEffectsSchema>
export type Appetite = z.infer<typeof appetiteSchema>
export type Urges = z.infer<typeof urgesSchema>
export type Alcohol = z.infer<typeof alcoholSchema>
export type Social = z.infer<typeof socialSchema>
export type SocialInteractionType = z.infer<typeof socialInteractionTypeSchema>
export type AlcoholContext = z.infer<typeof alcoholContextSchema>
export type AlcoholPerceivedEffect = z.infer<typeof alcoholPerceivedEffectSchema>
export type SocialEffect = z.infer<typeof socialEffectSchema>
export type NapEffect = z.infer<typeof napEffectSchema>
export type NapReason = z.infer<typeof napReasonSchema>
