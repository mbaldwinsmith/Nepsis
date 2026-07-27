import type { DailyCheckIn, PersonalBaseline, SocialCommitment } from '../../data/schemas'

export type MetricKey =
  | 'sleepDuration'
  | 'reducedNeedForSleep'
  | 'energy'
  | 'mentalSpeed'
  | 'lowMood'
  | 'elevatedMood'
  | 'irritability'
  | 'innerRestlessness'
  | 'appetite'
  | 'satiety'
  | 'napNeed'
  | 'alcoholUnits'
  | 'socialActivity'
  | 'socialDrive'
  | 'cancellations'
  | 'weight'

/** Pre-indexed lookups built once per render, shared across every metric's getValue. */
export interface TrendDataIndex {
  checkInsByDate: Map<string, DailyCheckIn>
  commitmentsByDate: Map<string, SocialCommitment[]>
  weightByDate: Map<string, number>
}

export interface MetricDefinition {
  key: MetricKey
  label: string
  unit?: string
  min: number
  max: number
  getValue: (date: string, index: TrendDataIndex) => number | undefined
  getBaseline?: (baseline: PersonalBaseline) => number | undefined
}

const CANCELLED_OUTCOMES = ['cancelled', 'postponed', 'didNotAttend']

export const metricDefinitions: Record<MetricKey, MetricDefinition> = {
  sleepDuration: {
    key: 'sleepDuration',
    label: 'Sleep duration',
    unit: 'min',
    min: 0,
    max: 720,
    getValue: (date, i) => i.checkInsByDate.get(date)?.sleep.sleepDurationMinutes,
    getBaseline: (b) => b.usualSleepDurationMinutes,
  },
  reducedNeedForSleep: {
    key: 'reducedNeedForSleep',
    label: 'Reduced need for sleep',
    min: 0,
    max: 2,
    getValue: (date, i) => i.checkInsByDate.get(date)?.sleep.reducedNeedForSleep,
  },
  energy: {
    key: 'energy',
    label: 'Energy',
    min: 0,
    max: 4,
    getValue: (date, i) => i.checkInsByDate.get(date)?.mood.energy,
    getBaseline: (b) => b.usualEnergy,
  },
  mentalSpeed: {
    key: 'mentalSpeed',
    label: 'Mental speed',
    min: -2,
    max: 2,
    getValue: (date, i) => i.checkInsByDate.get(date)?.mood.mentalSpeed,
  },
  lowMood: {
    key: 'lowMood',
    label: 'Low mood',
    min: 0,
    max: 4,
    getValue: (date, i) => i.checkInsByDate.get(date)?.mood.lowMood,
    getBaseline: (b) => b.usualLowMood,
  },
  elevatedMood: {
    key: 'elevatedMood',
    label: 'Elevated mood',
    min: 0,
    max: 4,
    getValue: (date, i) => i.checkInsByDate.get(date)?.mood.elevatedMood,
    getBaseline: (b) => b.usualElevatedMood,
  },
  irritability: {
    key: 'irritability',
    label: 'Irritability',
    min: 0,
    max: 4,
    getValue: (date, i) => i.checkInsByDate.get(date)?.mood.irritability,
  },
  innerRestlessness: {
    key: 'innerRestlessness',
    label: 'Inner restlessness',
    min: 0,
    max: 4,
    getValue: (date, i) =>
      i.checkInsByDate.get(date)?.medicationEffects.innerRestlessness,
  },
  appetite: {
    key: 'appetite',
    label: 'Appetite',
    min: 0,
    max: 4,
    getValue: (date, i) => i.checkInsByDate.get(date)?.appetite.appetite,
    getBaseline: (b) => b.usualAppetite,
  },
  satiety: {
    key: 'satiety',
    label: 'Satiety',
    min: 0,
    max: 4,
    getValue: (date, i) => i.checkInsByDate.get(date)?.appetite.satietyAfterNormalMeal,
    getBaseline: (b) => b.usualSatiety,
  },
  napNeed: {
    key: 'napNeed',
    label: 'Nap need',
    min: 0,
    max: 3,
    getValue: (date, i) => i.checkInsByDate.get(date)?.sleep.lunchtimeNapNeed,
    getBaseline: (b) => b.usualLunchtimeNapNeed,
  },
  alcoholUnits: {
    key: 'alcoholUnits',
    label: 'Alcohol units',
    unit: 'units',
    min: 0,
    max: 10,
    getValue: (date, i) => i.checkInsByDate.get(date)?.alcohol.unitsConsumed,
    // Baseline is recorded as a weekly total; dividing by 7 gives an
    // approximate daily reference line, not a claim about daily limits.
    getBaseline: (b) =>
      b.usualWeeklyAlcoholUnits === undefined ? undefined : b.usualWeeklyAlcoholUnits / 7,
  },
  socialActivity: {
    key: 'socialActivity',
    label: 'Social activity',
    min: 0,
    max: 4,
    getValue: (date, i) => i.checkInsByDate.get(date)?.social.activityAmount,
    getBaseline: (b) => b.usualSocialActivity,
  },
  socialDrive: {
    key: 'socialDrive',
    label: 'Social drive',
    min: -2,
    max: 2,
    getValue: (date, i) => i.checkInsByDate.get(date)?.social.socialDrive,
    getBaseline: (b) => b.usualSocialDrive,
  },
  cancellations: {
    key: 'cancellations',
    label: 'Cancellations',
    min: 0,
    max: 5,
    getValue: (date, i) => {
      const commitments = i.commitmentsByDate.get(date)
      if (!commitments) return undefined
      return commitments.filter((c) => CANCELLED_OUTCOMES.includes(c.outcome)).length
    },
  },
  weight: {
    key: 'weight',
    label: 'Weight',
    unit: 'kg',
    min: 0,
    max: 200,
    getValue: (date, i) => i.weightByDate.get(date),
  },
}

export const metricKeys = Object.keys(metricDefinitions) as MetricKey[]

export const defaultMetricKeys: MetricKey[] = ['sleepDuration', 'energy', 'appetite']
