import type { CheckInDraft } from './useDailyCheckIn'

/**
 * The 12-step daily check-in flow. `section` names the top-level `CheckInDraft`
 * key a step edits; `fields` lists the schema field names covered by that step
 * (used by steps.test.ts to confirm every reachable field is covered by exactly
 * one step). The `notes` step has no nested fields — it edits the top-level
 * `notes` string directly.
 */
export interface CheckInStep {
  id: string
  group: string
  title: string
  section: keyof CheckInDraft
  fields: string[]
}

export const checkInSteps: CheckInStep[] = [
  {
    id: 'sleep-last-night',
    group: 'Sleep',
    title: 'Last night',
    section: 'sleep',
    fields: ['sleepDurationMinutes', 'sleepQuality'],
  },
  {
    id: 'sleep-falling-asleep',
    group: 'Sleep',
    title: 'Falling asleep and waking',
    section: 'sleep',
    fields: ['reducedNeedForSleep', 'difficultyFallingAsleep', 'wakingUnusuallyEarly'],
  },
  {
    id: 'sleep-daytime-rest',
    group: 'Sleep',
    title: 'Daytime rest',
    section: 'sleep',
    fields: [
      'lunchtimeNapNeed',
      'napTaken',
      'napDurationMinutes',
      'napEffect',
      'napReason',
    ],
  },
  {
    id: 'mood-today',
    group: 'Mood and activation',
    title: 'How today felt',
    section: 'mood',
    fields: ['lowMood', 'elevatedMood', 'irritability', 'anxiety'],
  },
  {
    id: 'mood-pace',
    group: 'Mood and activation',
    title: 'Pace and drive',
    section: 'mood',
    fields: ['emotionalSensitivity', 'energy', 'mentalSpeed', 'goalDirectedActivity'],
  },
  {
    id: 'warning-signs',
    group: 'Personal warning signs',
    title: 'Personal warning signs',
    section: 'warningSigns',
    fields: [
      'headBuzz',
      'tightShoulders',
      'shallowBreathing',
      'pressuredSpeech',
      'unusualIdeas',
      'unusuallyDrivenBehaviour',
    ],
  },
  {
    id: 'alcohol',
    group: 'Daily rhythm',
    title: 'Alcohol',
    section: 'alcohol',
    fields: ['unitsConsumed', 'context', 'perceivedEffect'],
  },
  {
    id: 'social',
    group: 'Daily rhythm',
    title: 'Other people',
    section: 'social',
    fields: ['activityAmount', 'socialDrive', 'effect', 'interactionTypes'],
  },
  {
    id: 'appetite-eating',
    group: 'Appetite',
    title: 'Eating',
    section: 'appetite',
    fields: [
      'appetite',
      'hungerBetweenMeals',
      'satietyAfterNormalMeal',
      'foodPreoccupationOrCravings',
      'bingeOrLossOfControlEating',
    ],
  },
  {
    id: 'appetite-urges',
    group: 'Appetite',
    title: 'Urges',
    section: 'urges',
    fields: [
      'spendingUrge',
      'gamblingUrge',
      'sexualDriveIncrease',
      'otherCompulsiveUrgeText',
    ],
  },
  {
    id: 'medication',
    group: 'Medication and side effects',
    title: 'Medication and side effects',
    section: 'medicationEffects',
    fields: [
      'missedOrDelayedDose',
      'sedation',
      'dizziness',
      'nausea',
      'tremor',
      'stiffness',
      'innerRestlessness',
      'otherSideEffectText',
    ],
  },
  {
    id: 'note',
    group: 'Note',
    title: 'Note',
    section: 'notes',
    fields: [],
  },
]
