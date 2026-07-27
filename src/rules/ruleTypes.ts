import type { DailyCheckIn, RuleType, SocialCommitment } from '../data/schemas'
import { consecutiveRuns } from './dateWindows'
import type { Evidence, RuleContext, RuleEvaluation, RuleTypeDefinition } from './types'

const DISTRESS_REASONS = ['distress', 'anxiety', 'lowEnergy', 'overwhelmed'] as const

function isNum(v: number | undefined): v is number {
  return typeof v === 'number'
}

function average(values: number[]): number | undefined {
  if (values.length === 0) return undefined
  return values.reduce((a, b) => a + b, 0) / values.length
}

function checkInEvidence(ci: DailyCheckIn, description: string): Evidence {
  return { date: ci.entryDate, source: 'self-report', description }
}

function commitmentEvidence(c: SocialCommitment, description: string): Evidence {
  return { date: c.plannedDate, source: 'commitments', description }
}

const notTriggered: RuleEvaluation = { triggered: false, summary: '', evidence: [] }

// --- 1. Reduced sleep plus activation -------------------------------------

function evaluateReducedSleepPlusActivation(context: RuleContext): RuleEvaluation {
  const { checkIns, baseline, params } = context
  const usualSleep = baseline?.usualSleepDurationMinutes
  if (!isNum(usualSleep)) return notTriggered

  const threshold = usualSleep - params.sleepDeficitMinutes!
  const predicate = (ci: DailyCheckIn) => {
    const duration = ci.sleep.sleepDurationMinutes
    if (!isNum(duration) || duration > threshold) return false
    const energy = ci.mood.energy
    const mentalSpeed = ci.mood.mentalSpeed
    const reducedNeed = ci.sleep.reducedNeedForSleep
    return (
      (isNum(energy) && energy >= params.energyThreshold!) ||
      (isNum(mentalSpeed) && mentalSpeed >= params.mentalSpeedThreshold!) ||
      (isNum(reducedNeed) && reducedNeed >= params.reducedNeedThreshold!)
    )
  }

  const runs = consecutiveRuns(checkIns, (ci) => ci.entryDate, predicate)
  const match = runs.find((run) => run.length >= params.consecutiveNights!)
  if (!match) return notTriggered

  return {
    triggered: true,
    summary: `Sleep was reduced with signs of activation for ${match.length} consecutive nights.`,
    evidence: match.map((ci) =>
      checkInEvidence(
        ci,
        `Sleep ${ci.sleep.sleepDurationMinutes} min (usual ${usualSleep} min) with elevated energy, mental speed, or reduced need for sleep`,
      ),
    ),
  }
}

// --- 2. Daytime-alertness change -------------------------------------------

function evaluateDaytimeAlertnessChange(context: RuleContext): RuleEvaluation {
  const { checkIns, baseline, params } = context
  const usualNapNeed = baseline?.usualLunchtimeNapNeed
  const usualSleep = baseline?.usualSleepDurationMinutes
  if (!isNum(usualNapNeed) || usualNapNeed <= params.napNeedMax!) return notTriggered
  if (!isNum(usualSleep)) return notTriggered

  const sleepThreshold = usualSleep - params.sleepDeficitMinutes!
  const predicate = (ci: DailyCheckIn) => {
    const napNeed = ci.sleep.lunchtimeNapNeed
    const duration = ci.sleep.sleepDurationMinutes
    const energy = ci.mood.energy
    return (
      isNum(napNeed) &&
      napNeed <= params.napNeedMax! &&
      isNum(duration) &&
      duration <= sleepThreshold &&
      isNum(energy) &&
      energy >= params.energyThreshold!
    )
  }

  const runs = consecutiveRuns(checkIns, (ci) => ci.entryDate, predicate)
  const match = runs.find((run) => run.length >= params.consecutiveDays!)
  if (!match) return notTriggered

  return {
    triggered: true,
    summary: `No usual need for a lunchtime nap for ${match.length} days, alongside shorter sleep and higher energy.`,
    evidence: match.map((ci) =>
      checkInEvidence(
        ci,
        `Lunchtime nap need ${ci.sleep.lunchtimeNapNeed} (usual ${usualNapNeed}), sleep ${ci.sleep.sleepDurationMinutes} min, energy ${ci.mood.energy}`,
      ),
    ),
  }
}

// --- 3. Possible low-energy pattern ----------------------------------------

function evaluatePossibleLowEnergyPattern(context: RuleContext): RuleEvaluation {
  const { checkIns, commitments, params } = context

  const matchingDays = checkIns.filter((ci) => {
    const napNeed = ci.sleep.lunchtimeNapNeed
    const lowMood = ci.mood.lowMood
    return (
      isNum(napNeed) &&
      napNeed >= params.napNeedThreshold! &&
      isNum(lowMood) &&
      lowMood >= params.lowMoodThreshold!
    )
  })
  if (matchingDays.length < params.minDays!) return notTriggered

  const socialDriveValues = checkIns.map((ci) => ci.social.socialDrive).filter(isNum)
  const avgSocialDrive = average(socialDriveValues)
  const reducedSocialDrive =
    avgSocialDrive !== undefined && avgSocialDrive < params.socialDriveNegative!

  const cancellations = commitments.filter((c) =>
    ['cancelled', 'didNotAttend'].includes(c.outcome),
  )
  const repeatedCancellations = cancellations.length >= params.minCancellations!

  if (!reducedSocialDrive && !repeatedCancellations) return notTriggered

  const evidence = matchingDays.map((ci) =>
    checkInEvidence(
      ci,
      `Nap need ${ci.sleep.lunchtimeNapNeed}, low mood ${ci.mood.lowMood}`,
    ),
  )
  if (repeatedCancellations) {
    evidence.push(
      ...cancellations.map((c) =>
        commitmentEvidence(c, `${c.type} commitment ${c.outcome}`),
      ),
    )
  }

  return {
    triggered: true,
    summary: `Increased nap need and lower mood on ${matchingDays.length} days, together with ${
      reducedSocialDrive ? 'reduced social drive' : 'repeated cancellations'
    }.`,
    evidence,
  }
}

// --- 4. Social-activation pattern ------------------------------------------

function evaluateSocialActivationPattern(context: RuleContext): RuleEvaluation {
  const { checkIns, baseline, params } = context

  const matchingDays = checkIns.filter((ci) => {
    const activity = ci.social.activityAmount
    const drive = ci.social.socialDrive
    return (
      isNum(activity) &&
      activity >= params.activityThreshold! &&
      isNum(drive) &&
      drive >= params.socialDriveThreshold!
    )
  })
  if (matchingDays.length < params.minDays!) return notTriggered

  const usualSleep = baseline?.usualSleepDurationMinutes
  const secondaryDay = matchingDays.find((ci) => {
    const duration = ci.sleep.sleepDurationMinutes
    const shorterSleep =
      isNum(usualSleep) &&
      isNum(duration) &&
      duration <= usualSleep - params.sleepDeficitMinutes!
    return (
      shorterSleep ||
      ci.social.effect === 'energisedOrOverstimulated' ||
      ci.warningSigns.pressuredSpeech === true
    )
  })
  if (!secondaryDay) return notTriggered

  return {
    triggered: true,
    summary: `Social activity and social drive were above threshold on ${matchingDays.length} days, combined with shorter sleep, overstimulation, or pressured speech.`,
    evidence: matchingDays.map((ci) =>
      checkInEvidence(
        ci,
        `Social activity ${ci.social.activityAmount}, social drive ${ci.social.socialDrive}`,
      ),
    ),
  }
}

// --- 5. Withdrawal pattern ---------------------------------------------------

function distressRelatedCancellations(
  commitments: SocialCommitment[],
): SocialCommitment[] {
  return commitments.filter(
    (c) =>
      (c.importance === 'meaningful' || c.importance === 'essential') &&
      ['postponed', 'cancelled', 'didNotAttend'].includes(c.outcome) &&
      (c.reasons ?? []).some((r) => (DISTRESS_REASONS as readonly string[]).includes(r)),
  )
}

function evaluateWithdrawalPattern(context: RuleContext): RuleEvaluation {
  const { commitments, params } = context
  const matches = distressRelatedCancellations(commitments)
  if (matches.length < params.minCancellations!) return notTriggered

  return {
    triggered: true,
    summary: `${matches.length} meaningful or essential commitments were cancelled or missed for distress-related reasons.`,
    evidence: matches.map((c) =>
      commitmentEvidence(
        c,
        `${c.type} (${c.importance}) ${c.outcome}: ${(c.reasons ?? []).join(', ')}`,
      ),
    ),
  }
}

// --- 6. Essential commitment missed -----------------------------------------

function evaluateEssentialCommitmentMissed(context: RuleContext): RuleEvaluation {
  const { commitments } = context
  const matches = commitments.filter(
    (c) =>
      c.importance === 'essential' &&
      ['cancelled', 'didNotAttend'].includes(c.outcome) &&
      (c.reasons ?? []).some((r) => (DISTRESS_REASONS as readonly string[]).includes(r)),
  )
  if (matches.length === 0) return notTriggered

  return {
    triggered: true,
    summary: `An essential commitment was missed for a distress-related reason.`,
    evidence: matches.map((c) =>
      commitmentEvidence(
        c,
        `${c.title ?? c.type} ${c.outcome}: ${(c.reasons ?? []).join(', ')}`,
      ),
    ),
  }
}

// --- 7. Alcohol-pattern change -----------------------------------------------

function evaluateAlcoholPatternChange(context: RuleContext): RuleEvaluation {
  const { checkIns, baseline, params } = context
  const usualWeekly = baseline?.usualWeeklyAlcoholUnits
  if (!isNum(usualWeekly)) return notTriggered

  const daysWithUnits = checkIns.filter((ci) => isNum(ci.alcohol.unitsConsumed))
  const sum = daysWithUnits.reduce(
    (total, ci) => total + (ci.alcohol.unitsConsumed ?? 0),
    0,
  )
  if (sum <= usualWeekly + params.unitsAboveBaseline!) return notTriggered

  return {
    triggered: true,
    summary: `Recorded alcohol units (${sum}) were above your usual baseline (${usualWeekly}) for this period.`,
    evidence: daysWithUnits.map((ci) =>
      checkInEvidence(ci, `${ci.alcohol.unitsConsumed} units recorded`),
    ),
  }
}

// --- 8. Restlessness review --------------------------------------------------

function evaluateRestlessnessReview(context: RuleContext): RuleEvaluation {
  const { checkIns, params } = context
  const withRestlessness = [...checkIns]
    .filter((ci) => isNum(ci.medicationEffects.innerRestlessness))
    .sort((a, b) => (a.entryDate < b.entryDate ? -1 : 1))

  const highDays = withRestlessness.filter(
    (ci) => (ci.medicationEffects.innerRestlessness ?? 0) >= params.highThreshold!,
  )

  let increaseDetected = false
  if (withRestlessness.length >= params.minDaysForTrend!) {
    const mid = Math.floor(withRestlessness.length / 2)
    const firstHalf = average(
      withRestlessness
        .slice(0, mid)
        .map((ci) => ci.medicationEffects.innerRestlessness ?? 0),
    )
    const secondHalf = average(
      withRestlessness
        .slice(mid)
        .map((ci) => ci.medicationEffects.innerRestlessness ?? 0),
    )
    if (firstHalf !== undefined && secondHalf !== undefined) {
      increaseDetected = secondHalf - firstHalf >= params.increaseThreshold!
    }
  }

  if (highDays.length === 0 && !increaseDetected) return notTriggered

  const evidence =
    highDays.length > 0
      ? highDays.map((ci) =>
          checkInEvidence(
            ci,
            `Inner restlessness ${ci.medicationEffects.innerRestlessness}`,
          ),
        )
      : withRestlessness.map((ci) =>
          checkInEvidence(
            ci,
            `Inner restlessness ${ci.medicationEffects.innerRestlessness}`,
          ),
        )

  return {
    triggered: true,
    summary:
      highDays.length > 0
        ? 'Inner restlessness was recorded at a high level.'
        : 'Inner restlessness has been rising across the period.',
    evidence,
  }
}

// --- 9. Compulsive-urge review -----------------------------------------------

function evaluateCompulsiveUrgeReview(context: RuleContext): RuleEvaluation {
  const { checkIns, params } = context
  const matches = checkIns.filter((ci) => {
    const spending = ci.urges.spendingUrge
    const gambling = ci.urges.gamblingUrge
    const sexual = ci.urges.sexualDriveIncrease
    const otherText = ci.urges.otherCompulsiveUrgeText
    return (
      (isNum(spending) && spending >= params.urgeThreshold!) ||
      (isNum(gambling) && gambling >= params.urgeThreshold!) ||
      (isNum(sexual) && sexual >= params.urgeThreshold!) ||
      (typeof otherText === 'string' && otherText.trim().length > 0)
    )
  })
  if (matches.length === 0) return notTriggered

  return {
    triggered: true,
    summary: 'A new or increased compulsive urge was recorded.',
    evidence: matches.map((ci) => {
      const parts: string[] = []
      if (isNum(ci.urges.spendingUrge)) parts.push(`spending ${ci.urges.spendingUrge}`)
      if (isNum(ci.urges.gamblingUrge)) parts.push(`gambling ${ci.urges.gamblingUrge}`)
      if (isNum(ci.urges.sexualDriveIncrease))
        parts.push(`sexual drive ${ci.urges.sexualDriveIncrease}`)
      if (ci.urges.otherCompulsiveUrgeText) parts.push(ci.urges.otherCompulsiveUrgeText)
      return checkInEvidence(ci, parts.join(', '))
    }),
  }
}

// --- 10. Observer concern -----------------------------------------------------

function evaluateObserverConcern(context: RuleContext): RuleEvaluation {
  const { observerEntries, params } = context
  const urgent = observerEntries.filter((o) => o.concern === 'urgent')
  const discussSoon = observerEntries.filter((o) => o.concern === 'discussSoon')

  if (urgent.length === 0 && discussSoon.length < params.discussSoonCount!)
    return notTriggered

  const matches = urgent.length > 0 ? urgent : discussSoon
  return {
    triggered: true,
    summary:
      urgent.length > 0
        ? 'An observer recorded an urgent concern.'
        : `Observers recorded "discuss soon" concern ${discussSoon.length} times.`,
    evidence: matches.map((o) => ({
      date: o.observationDate,
      source: 'observer-report' as const,
      description: `${o.observerLabel}: concern level ${o.concern}`,
    })),
  }
}

export const ruleTypeDefinitions: Record<RuleType, RuleTypeDefinition> = {
  reducedSleepPlusActivation: {
    ruleType: 'reducedSleepPlusActivation',
    defaultLabel: 'Reduced sleep plus activation',
    defaultDescription:
      'Sleep below your baseline for consecutive nights, combined with increased energy, mental speed, or reduced need for sleep.',
    defaultSeverity: 'review',
    defaultLookbackDays: 7,
    defaultActionText:
      'Several of your agreed early-warning signs have changed together. This pattern may be worth reviewing with someone from your support plan.',
    paramSchema: [
      {
        key: 'consecutiveNights',
        label: 'Consecutive nights',
        min: 1,
        max: 7,
        step: 1,
        default: 2,
      },
      {
        key: 'sleepDeficitMinutes',
        label: 'Sleep deficit (minutes below baseline)',
        min: 0,
        max: 240,
        step: 15,
        default: 60,
      },
      {
        key: 'energyThreshold',
        label: 'Energy at or above',
        min: 0,
        max: 4,
        step: 1,
        default: 3,
      },
      {
        key: 'mentalSpeedThreshold',
        label: 'Mental speed at or above',
        min: -2,
        max: 2,
        step: 1,
        default: 1,
      },
      {
        key: 'reducedNeedThreshold',
        label: 'Reduced need for sleep at or above',
        min: 0,
        max: 2,
        step: 1,
        default: 1,
      },
    ],
    evaluate: evaluateReducedSleepPlusActivation,
    describe: (p, lookbackDays) =>
      `Triggers when sleep is at least ${p.sleepDeficitMinutes} minutes below your baseline for ${p.consecutiveNights} consecutive nights, together with energy ≥ ${p.energyThreshold}, mental speed ≥ ${p.mentalSpeedThreshold}, or reduced need for sleep ≥ ${p.reducedNeedThreshold}, looking back ${lookbackDays} days.`,
  },
  daytimeAlertnessChange: {
    ruleType: 'daytimeAlertnessChange',
    defaultLabel: 'Daytime-alertness change',
    defaultDescription:
      'No need for a usual lunchtime nap for several days, combined with shorter sleep and increased energy.',
    defaultSeverity: 'review',
    defaultLookbackDays: 7,
    defaultActionText:
      'Your usual lunchtime nap need and sleep pattern have both changed. This pattern may be worth reviewing with someone from your support plan.',
    paramSchema: [
      {
        key: 'consecutiveDays',
        label: 'Consecutive days',
        min: 1,
        max: 7,
        step: 1,
        default: 3,
      },
      {
        key: 'napNeedMax',
        label: 'Nap need at or below',
        min: 0,
        max: 3,
        step: 1,
        default: 0,
      },
      {
        key: 'sleepDeficitMinutes',
        label: 'Sleep deficit (minutes below baseline)',
        min: 0,
        max: 240,
        step: 15,
        default: 30,
      },
      {
        key: 'energyThreshold',
        label: 'Energy at or above',
        min: 0,
        max: 4,
        step: 1,
        default: 3,
      },
    ],
    evaluate: evaluateDaytimeAlertnessChange,
    describe: (p, lookbackDays) =>
      `Triggers when lunchtime nap need is ≤ ${p.napNeedMax} and sleep is ≥ ${p.sleepDeficitMinutes} minutes below your baseline, with energy ≥ ${p.energyThreshold}, for ${p.consecutiveDays} consecutive days, looking back ${lookbackDays} days. Requires a baseline showing you usually need a nap.`,
  },
  possibleLowEnergyPattern: {
    ruleType: 'possibleLowEnergyPattern',
    defaultLabel: 'Possible low-energy pattern',
    defaultDescription:
      'Increased nap need and lower mood, combined with reduced social drive or repeated cancellations.',
    defaultSeverity: 'review',
    defaultLookbackDays: 10,
    defaultActionText:
      'Your energy, mood, and social rhythm differ from your recorded baseline. This pattern may be worth reviewing with someone from your support plan.',
    paramSchema: [
      {
        key: 'minDays',
        label: 'Minimum matching days',
        min: 1,
        max: 10,
        step: 1,
        default: 3,
      },
      {
        key: 'napNeedThreshold',
        label: 'Nap need at or above',
        min: 0,
        max: 3,
        step: 1,
        default: 2,
      },
      {
        key: 'lowMoodThreshold',
        label: 'Low mood at or above',
        min: 0,
        max: 4,
        step: 1,
        default: 3,
      },
      {
        key: 'socialDriveNegative',
        label: 'Average social drive below',
        min: -2,
        max: 2,
        step: 1,
        default: 0,
      },
      {
        key: 'minCancellations',
        label: 'Or cancellations at least',
        min: 1,
        max: 10,
        step: 1,
        default: 2,
      },
    ],
    evaluate: evaluatePossibleLowEnergyPattern,
    describe: (p, lookbackDays) =>
      `Triggers when nap need ≥ ${p.napNeedThreshold} and low mood ≥ ${p.lowMoodThreshold} occur on at least ${p.minDays} days, together with average social drive below ${p.socialDriveNegative} or at least ${p.minCancellations} cancellations, looking back ${lookbackDays} days.`,
  },
  socialActivationPattern: {
    ruleType: 'socialActivationPattern',
    defaultLabel: 'Social-activation pattern',
    defaultDescription:
      'Social drive and social activity substantially above baseline, combined with shorter sleep, faster speech, or overstimulation.',
    defaultSeverity: 'review',
    defaultLookbackDays: 7,
    defaultActionText:
      'Your social rhythm differs from your recorded baseline. This pattern may be worth reviewing with someone from your support plan.',
    paramSchema: [
      {
        key: 'minDays',
        label: 'Minimum matching days',
        min: 1,
        max: 7,
        step: 1,
        default: 2,
      },
      {
        key: 'activityThreshold',
        label: 'Social activity at or above',
        min: 0,
        max: 4,
        step: 1,
        default: 3,
      },
      {
        key: 'socialDriveThreshold',
        label: 'Social drive at or above',
        min: -2,
        max: 2,
        step: 1,
        default: 1,
      },
      {
        key: 'sleepDeficitMinutes',
        label: 'Sleep deficit (minutes below baseline)',
        min: 0,
        max: 240,
        step: 15,
        default: 45,
      },
    ],
    evaluate: evaluateSocialActivationPattern,
    describe: (p, lookbackDays) =>
      `Triggers when social activity ≥ ${p.activityThreshold} and social drive ≥ ${p.socialDriveThreshold} occur on at least ${p.minDays} days, together with shorter sleep, overstimulation, or pressured speech, looking back ${lookbackDays} days.`,
  },
  withdrawalPattern: {
    ruleType: 'withdrawalPattern',
    defaultLabel: 'Withdrawal pattern',
    defaultDescription:
      'Several meaningful commitments cancelled within a selected period, at least some due to distress, anxiety, low energy, or overwhelm.',
    defaultSeverity: 'review',
    defaultLookbackDays: 14,
    defaultActionText:
      'Several planned commitments were cancelled or missed recently. This may be worth reviewing with someone from your support plan.',
    paramSchema: [
      {
        key: 'minCancellations',
        label: 'Minimum cancellations',
        min: 1,
        max: 10,
        step: 1,
        default: 2,
      },
    ],
    evaluate: evaluateWithdrawalPattern,
    describe: (p, lookbackDays) =>
      `Triggers when at least ${p.minCancellations} meaningful or essential commitments are postponed, cancelled, or missed for a distress-related reason, looking back ${lookbackDays} days.`,
  },
  essentialCommitmentMissed: {
    ruleType: 'essentialCommitmentMissed',
    defaultLabel: 'Essential commitment missed',
    defaultDescription:
      'Work, appointment, or another user-marked essential commitment missed due to distress.',
    defaultSeverity: 'act',
    defaultLookbackDays: 14,
    defaultActionText:
      'An essential commitment was missed. This may be worth reviewing with someone from your support plan.',
    paramSchema: [],
    evaluate: evaluateEssentialCommitmentMissed,
    describe: (_p, lookbackDays) =>
      `Triggers when any essential commitment is cancelled or missed for a distress-related reason, looking back ${lookbackDays} days.`,
  },
  alcoholPatternChange: {
    ruleType: 'alcoholPatternChange',
    defaultLabel: 'Alcohol-pattern change',
    defaultDescription:
      'Weekly alcohol units above personal baseline, optionally combined with lower sleep quality or changed mood.',
    defaultSeverity: 'review',
    defaultLookbackDays: 7,
    defaultActionText:
      'Recorded alcohol intake is above your usual baseline for this period. This may be worth reviewing with someone from your support plan.',
    paramSchema: [
      {
        key: 'unitsAboveBaseline',
        label: 'Units above baseline',
        min: 0,
        max: 20,
        step: 1,
        default: 0,
      },
    ],
    evaluate: evaluateAlcoholPatternChange,
    describe: (p, lookbackDays) =>
      `Triggers when alcohol units recorded over ${lookbackDays} days exceed your usual weekly baseline by more than ${p.unitsAboveBaseline}. Requires a recorded baseline.`,
  },
  restlessnessReview: {
    ruleType: 'restlessnessReview',
    defaultLabel: 'Restlessness review',
    defaultDescription:
      'Inner restlessness at a high level, or a sharp increase from baseline.',
    defaultSeverity: 'review',
    defaultLookbackDays: 10,
    defaultActionText:
      'Inner restlessness has been high or increasing. This may be worth discussing with your prescriber or someone from your support plan.',
    paramSchema: [
      {
        key: 'highThreshold',
        label: 'High level at or above',
        min: 0,
        max: 4,
        step: 1,
        default: 3,
      },
      {
        key: 'increaseThreshold',
        label: 'Rise between first and second half',
        min: 0,
        max: 4,
        step: 1,
        default: 2,
      },
      {
        key: 'minDaysForTrend',
        label: 'Minimum recorded days for a trend',
        min: 2,
        max: 14,
        step: 1,
        default: 4,
      },
    ],
    evaluate: evaluateRestlessnessReview,
    describe: (p, lookbackDays) =>
      `Triggers when inner restlessness reaches ≥ ${p.highThreshold} on any day, or rises by ≥ ${p.increaseThreshold} between the first and second half of the period (with at least ${p.minDaysForTrend} recorded days), looking back ${lookbackDays} days.`,
  },
  compulsiveUrgeReview: {
    ruleType: 'compulsiveUrgeReview',
    defaultLabel: 'Compulsive-urge review',
    defaultDescription:
      'New or increased spending, gambling, eating, sexual, or other compulsive urge.',
    defaultSeverity: 'review',
    defaultLookbackDays: 7,
    defaultActionText:
      'A new or increased urge has been recorded. This may be worth reviewing with someone from your support plan.',
    paramSchema: [
      {
        key: 'urgeThreshold',
        label: 'Urge level at or above',
        min: 0,
        max: 4,
        step: 1,
        default: 3,
      },
    ],
    evaluate: evaluateCompulsiveUrgeReview,
    describe: (p, lookbackDays) =>
      `Triggers when spending, gambling, or sexual-drive urge reaches ≥ ${p.urgeThreshold}, or another compulsive urge is recorded, looking back ${lookbackDays} days.`,
  },
  observerConcern: {
    ruleType: 'observerConcern',
    defaultLabel: 'Observer concern',
    defaultDescription:
      'One urgent observer entry, or repeated "discuss soon" entries within a selected period.',
    defaultSeverity: 'act',
    defaultLookbackDays: 14,
    defaultActionText:
      'A trusted observer has raised a concern. This may be worth reviewing with someone from your support plan.',
    paramSchema: [
      {
        key: 'discussSoonCount',
        label: '"Discuss soon" count at least',
        min: 1,
        max: 10,
        step: 1,
        default: 2,
      },
    ],
    evaluate: evaluateObserverConcern,
    describe: (p, lookbackDays) =>
      `Triggers on any "urgent" observer entry, or at least ${p.discussSoonCount} "discuss soon" entries, looking back ${lookbackDays} days.`,
  },
}

export function getRuleTypeDefinition(ruleType: RuleType): RuleTypeDefinition {
  return ruleTypeDefinitions[ruleType]
}
