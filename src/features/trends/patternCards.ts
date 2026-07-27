import type { DailyCheckIn, PersonalBaseline, SocialCommitment } from '../../data/schemas'
import { isDistressRelated } from '../../utils/distressReasons'
import { formatIsoDateForDisplay } from '../../utils/date'
import { metricDefinitions, type MetricKey, type TrendDataIndex } from './metrics'

export interface PatternCardData {
  id: string
  text: string
  linkTo: string
}

export interface PatternCardContext {
  windowStart: string
  windowEnd: string
  dates: string[]
  checkIns: DailyCheckIn[]
  commitments: SocialCommitment[]
  baseline: PersonalBaseline | undefined
}

const BASELINE_METRIC_PRIORITY: MetricKey[] = [
  'socialDrive',
  'socialActivity',
  'energy',
  'lowMood',
  'elevatedMood',
  'appetite',
  'satiety',
  'sleepDuration',
  'napNeed',
  'alcoholUnits',
]

const MIN_DAYS_WITH_DATA = 3
const MAJORITY_RATIO = 0.6

function average(values: number[]): number | undefined {
  if (values.length === 0) return undefined
  return values.reduce((a, b) => a + b, 0) / values.length
}

function buildIndex(context: PatternCardContext): TrendDataIndex {
  const checkInsByDate = new Map(context.checkIns.map((c) => [c.entryDate, c]))
  const commitmentsByDate = new Map<string, SocialCommitment[]>()
  for (const commitment of context.commitments) {
    const list = commitmentsByDate.get(commitment.plannedDate) ?? []
    list.push(commitment)
    commitmentsByDate.set(commitment.plannedDate, list)
  }
  return { checkInsByDate, commitmentsByDate, weightByDate: new Map() }
}

function buildBaselineComparisonCard(
  context: PatternCardContext,
): PatternCardData | undefined {
  if (!context.baseline) return undefined
  const index = buildIndex(context)

  let best:
    { metricKey: MetricKey; count: number; total: number; above: boolean } | undefined

  for (const key of BASELINE_METRIC_PRIORITY) {
    const def = metricDefinitions[key]
    const baselineValue = def.getBaseline?.(context.baseline)
    if (baselineValue === undefined) continue

    let above = 0
    let below = 0
    let total = 0
    for (const date of context.dates) {
      const value = def.getValue(date, index)
      if (value === undefined) continue
      total += 1
      if (value > baselineValue) above += 1
      else if (value < baselineValue) below += 1
    }
    if (total < MIN_DAYS_WITH_DATA) continue

    const aboveRatio = above / total
    const belowRatio = below / total
    if (aboveRatio >= MAJORITY_RATIO) {
      if (!best || above / total > best.count / best.total) {
        best = { metricKey: key, count: above, total, above: true }
      }
    } else if (belowRatio >= MAJORITY_RATIO) {
      if (!best || below / total > best.count / best.total) {
        best = { metricKey: key, count: below, total, above: false }
      }
    }
  }

  if (!best) return undefined
  const label = metricDefinitions[best.metricKey].label
  return {
    id: `baseline-${best.metricKey}`,
    text: `${label} was ${best.above ? 'above' : 'below'} your recorded baseline on ${best.count} of the last ${best.total} days.`,
    linkTo: '/trends',
  }
}

function buildCancellationSummaryCard(
  context: PatternCardContext,
): PatternCardData | undefined {
  const relevant = context.commitments.filter(
    (c) =>
      (c.importance === 'meaningful' || c.importance === 'essential') &&
      ['postponed', 'cancelled', 'didNotAttend'].includes(c.outcome),
  )
  if (relevant.length === 0) return undefined

  const distressCount = relevant.filter((c) => isDistressRelated(c.reasons)).length
  const days = context.dates.length

  return {
    id: 'cancellation-summary',
    text: `You cancelled ${relevant.length} meaningful commitment${relevant.length === 1 ? '' : 's'} in ${days} days, including ${distressCount} recorded as distress-related.`,
    linkTo: '/commitments',
  }
}

function buildAppetiteSatietyDivergenceCard(
  context: PatternCardContext,
): PatternCardData | undefined {
  const index = buildIndex(context)
  const half = Math.floor(context.dates.length / 2)
  if (half < 2) return undefined

  const firstHalfDates = context.dates.slice(0, half)
  const secondHalfDates = context.dates.slice(half)

  const appetiteFirst = average(
    firstHalfDates
      .map((d) => metricDefinitions.appetite.getValue(d, index))
      .filter((v): v is number => v !== undefined),
  )
  const appetiteSecond = average(
    secondHalfDates
      .map((d) => metricDefinitions.appetite.getValue(d, index))
      .filter((v): v is number => v !== undefined),
  )
  const satietySecond = average(
    secondHalfDates
      .map((d) => metricDefinitions.satiety.getValue(d, index))
      .filter((v): v is number => v !== undefined),
  )
  const satietyFirst = average(
    firstHalfDates
      .map((d) => metricDefinitions.satiety.getValue(d, index))
      .filter((v): v is number => v !== undefined),
  )

  if (
    appetiteFirst === undefined ||
    appetiteSecond === undefined ||
    satietyFirst === undefined ||
    satietySecond === undefined
  ) {
    return undefined
  }

  const MARGIN = 0.5
  const appetiteRose = appetiteSecond - appetiteFirst >= MARGIN
  const appetiteFell = appetiteFirst - appetiteSecond >= MARGIN
  const satietyRose = satietySecond - satietyFirst >= MARGIN
  const satietyFell = satietyFirst - satietySecond >= MARGIN

  if (appetiteRose && satietyFell) {
    return {
      id: 'appetite-satiety-divergence',
      text: 'Appetite increased while satiety decreased during the selected period.',
      linkTo: '/check-in',
    }
  }
  if (appetiteFell && satietyRose) {
    return {
      id: 'appetite-satiety-divergence',
      text: 'Appetite decreased while satiety increased during the selected period.',
      linkTo: '/check-in',
    }
  }
  return undefined
}

/**
 * Transparent, fact-stating summaries over a date window. Every card states
 * only counts or comparisons already visible in the recorded data — never a
 * diagnosis or a causal claim.
 */
export function buildPatternCards(context: PatternCardContext): PatternCardData[] {
  return [
    buildBaselineComparisonCard(context),
    buildCancellationSummaryCard(context),
    buildAppetiteSatietyDivergenceCard(context),
  ].filter((card): card is PatternCardData => card !== undefined)
}

export function formatWindowLabel(windowStart: string, windowEnd: string): string {
  return `${formatIsoDateForDisplay(windowStart)} – ${formatIsoDateForDisplay(windowEnd)}`
}
