import type { CheckInDraft } from './useDailyCheckIn'
import type { CheckInStep } from './steps'
import {
  VERY_POOR_TO_VERY_GOOD,
  NOT_AT_ALL_TO_MARKEDLY,
  NONE_TO_SEVERE,
  NO_NEED_TO_STRONG_NEED,
  NOT_AT_ALL_TO_SEVERE,
  NOT_AT_ALL_TO_VERY_POROUS,
  VERY_LOW_TO_VERY_HIGH,
  MUCH_SLOWER_TO_MUCH_FASTER,
  NONE_TO_A_GREAT_DEAL,
  MUCH_LESS_TO_MUCH_MORE_DRIVEN,
  NONE_TO_CONSTANT,
  NOT_SATISFIED_TO_FULLY_SATISFIED,
} from '../../utils/scaleWords'

interface ScaleDescriptor {
  min: number
  words: string[]
}

/** Matches the min/words pair each field's ScaleInput is given in its section component. */
const SCALE_FIELDS: Record<string, ScaleDescriptor> = {
  sleepQuality: { min: 0, words: VERY_POOR_TO_VERY_GOOD },
  reducedNeedForSleep: { min: 0, words: NOT_AT_ALL_TO_MARKEDLY },
  difficultyFallingAsleep: { min: 0, words: NONE_TO_SEVERE },
  wakingUnusuallyEarly: { min: 0, words: NONE_TO_SEVERE },
  lunchtimeNapNeed: { min: 0, words: NO_NEED_TO_STRONG_NEED },
  lowMood: { min: 0, words: NOT_AT_ALL_TO_SEVERE },
  elevatedMood: { min: 0, words: NOT_AT_ALL_TO_SEVERE },
  irritability: { min: 0, words: NOT_AT_ALL_TO_SEVERE },
  anxiety: { min: 0, words: NOT_AT_ALL_TO_SEVERE },
  emotionalSensitivity: { min: 0, words: NOT_AT_ALL_TO_VERY_POROUS },
  energy: { min: 0, words: VERY_LOW_TO_VERY_HIGH },
  mentalSpeed: { min: -2, words: MUCH_SLOWER_TO_MUCH_FASTER },
  goalDirectedActivity: { min: 0, words: VERY_LOW_TO_VERY_HIGH },
  activityAmount: { min: 0, words: NONE_TO_A_GREAT_DEAL },
  socialDrive: { min: -2, words: MUCH_LESS_TO_MUCH_MORE_DRIVEN },
  appetite: { min: 0, words: VERY_LOW_TO_VERY_HIGH },
  hungerBetweenMeals: { min: 0, words: NONE_TO_CONSTANT },
  satietyAfterNormalMeal: { min: 0, words: NOT_SATISFIED_TO_FULLY_SATISFIED },
  foodPreoccupationOrCravings: { min: 0, words: NONE_TO_CONSTANT },
  spendingUrge: { min: 0, words: NONE_TO_SEVERE },
  gamblingUrge: { min: 0, words: NONE_TO_SEVERE },
  sexualDriveIncrease: { min: 0, words: NONE_TO_SEVERE },
  sedation: { min: 0, words: NONE_TO_SEVERE },
  dizziness: { min: 0, words: NONE_TO_SEVERE },
  nausea: { min: 0, words: NONE_TO_SEVERE },
  tremor: { min: 0, words: NONE_TO_SEVERE },
  stiffness: { min: 0, words: NONE_TO_SEVERE },
  innerRestlessness: { min: 0, words: NONE_TO_SEVERE },
}

const FIELD_LABELS: Record<string, string> = {
  sleepDurationMinutes: 'Sleep duration',
  sleepQuality: 'Sleep quality',
  reducedNeedForSleep: 'Reduced need for sleep',
  difficultyFallingAsleep: 'Difficulty falling asleep',
  wakingUnusuallyEarly: 'Waking unusually early',
  lunchtimeNapNeed: 'Need to nap at lunchtime',
  napTaken: 'Nap taken',
  napDurationMinutes: 'Nap duration',
  napEffect: 'Nap after-effect',
  napReason: 'Likely nap reason',
  lowMood: 'Low mood',
  elevatedMood: 'Elevated or expansive mood',
  irritability: 'Irritability',
  anxiety: 'Anxiety',
  emotionalSensitivity: 'Emotional sensitivity',
  energy: 'Energy',
  mentalSpeed: 'Mental speed',
  goalDirectedActivity: 'Goal-directed activity',
  headBuzz: 'Head buzz',
  tightShoulders: 'Tight shoulders',
  shallowBreathing: 'Shallow breathing',
  pressuredSpeech: 'Pressured or unusually rapid speech',
  unusualIdeas: 'Unusually numerous ideas or projects',
  unusuallyDrivenBehaviour: 'Unusually driven behaviour',
  unitsConsumed: 'Units consumed',
  context: 'Context',
  perceivedEffect: 'Perceived effect',
  activityAmount: 'Activity amount',
  socialDrive: 'Social drive',
  effect: 'Effect of social contact',
  interactionTypes: 'Interaction types',
  appetite: 'Appetite',
  hungerBetweenMeals: 'Hunger between meals',
  satietyAfterNormalMeal: 'Satiety after a normal meal',
  foodPreoccupationOrCravings: 'Food preoccupation or cravings',
  bingeOrLossOfControlEating: 'Binge or loss-of-control eating',
  spendingUrge: 'Unusual spending urge',
  gamblingUrge: 'Gambling urge',
  sexualDriveIncrease: 'Unusually increased sexual drive',
  otherCompulsiveUrgeText: 'Other repetitive or compulsive urge',
  missedOrDelayedDose: 'Missed or delayed a dose today',
  sedation: 'Sedation',
  dizziness: 'Dizziness',
  nausea: 'Nausea',
  tremor: 'Tremor',
  stiffness: 'Stiffness',
  innerRestlessness: 'Inner restlessness or need to move',
  otherSideEffectText: 'Other side effect',
}

const ENUM_LABELS: Record<string, Record<string, string>> = {
  napEffect: { refreshed: 'Refreshed', unchanged: 'Unchanged', groggy: 'Groggy' },
  napReason: {
    poorSleep: 'Poor sleep',
    medication: 'Medication',
    routine: 'Routine',
    illness: 'Illness',
    unclear: 'Unclear',
  },
  context: {
    social: 'Social',
    withMeal: 'With meal',
    relaxingAlone: 'Relaxing alone',
    celebration: 'Celebration',
    coping: 'Coping',
    other: 'Other',
  },
  perceivedEffect: {
    better: 'Better',
    neutral: 'Neutral',
    worse: 'Worse',
    unclear: 'Unclear',
  },
  effect: {
    depleted: 'Depleted',
    slightlyDrained: 'Slightly drained',
    neutral: 'Neutral',
    nourished: 'Nourished',
    energisedOrOverstimulated: 'Energised or overstimulated',
  },
}

const INTERACTION_TYPE_LABELS: Record<string, string> = {
  inPerson: 'In person',
  phoneOrVideo: 'Phone or video',
  messaging: 'Messaging',
  groupEvent: 'Group event',
  churchOrCommunity: 'Church or community',
  work: 'Work',
}

export interface ReviewRow {
  label: string
  value: string
}

function formatFieldValue(field: string, raw: unknown): string | undefined {
  if (raw === undefined || raw === null) return undefined

  if (field === 'interactionTypes') {
    const types = raw as string[]
    if (types.length === 0) return undefined
    return types.map((t) => INTERACTION_TYPE_LABELS[t] ?? t).join(', ')
  }

  const scale = SCALE_FIELDS[field]
  if (scale) {
    const n = raw as number
    return scale.words[n - scale.min] ?? String(n)
  }

  const enumLabels = ENUM_LABELS[field]
  if (enumLabels) {
    return enumLabels[raw as string] ?? String(raw)
  }

  if (typeof raw === 'boolean') {
    return raw ? 'Yes' : undefined
  }

  if (field === 'sleepDurationMinutes' || field === 'napDurationMinutes') {
    return `${raw} min`
  }
  if (field === 'unitsConsumed') {
    return `${raw} units`
  }

  return String(raw)
}

/** Every non-empty field a step covers, formatted for display — empty when nothing was recorded. */
export function summarizeStep(step: CheckInStep, draft: CheckInDraft): ReviewRow[] {
  if (step.section === 'notes') {
    const text = draft.notes.trim()
    return text ? [{ label: 'Note', value: text }] : []
  }

  const sectionValue = draft[step.section] as Record<string, unknown>
  const rows: ReviewRow[] = []
  for (const field of step.fields) {
    const formatted = formatFieldValue(field, sectionValue[field])
    if (formatted !== undefined) {
      rows.push({ label: FIELD_LABELS[field] ?? field, value: formatted })
    }
  }
  return rows
}
