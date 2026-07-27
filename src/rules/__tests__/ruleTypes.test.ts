import { describe, expect, it } from 'vitest'
import type { RuleContext } from '../types'
import type { RuleType } from '../../data/schemas'
import { resolveParams } from '../params'
import { getRuleTypeDefinition } from '../ruleTypes'
import { baseline, checkIn, commitment, observerEntry } from './fixtures'

function run(
  ruleType: RuleType,
  overrides: Partial<Omit<RuleContext, 'params'>> & {
    paramsOverride?: Record<string, number>
  } = {},
) {
  const def = getRuleTypeDefinition(ruleType)
  const params = resolveParams(def.paramSchema, overrides.paramsOverride ?? {})
  return def.evaluate({
    windowStart: overrides.windowStart ?? '2026-01-01',
    windowEnd: overrides.windowEnd ?? '2026-01-14',
    checkIns: overrides.checkIns ?? [],
    commitments: overrides.commitments ?? [],
    observerEntries: overrides.observerEntries ?? [],
    baseline: overrides.baseline,
    params,
  })
}

describe('reducedSleepPlusActivation', () => {
  it('triggers on 2 consecutive nights of reduced sleep with elevated energy', () => {
    const result = run('reducedSleepPlusActivation', {
      baseline: baseline({ usualSleepDurationMinutes: 440 }),
      checkIns: [
        checkIn('2026-01-05', {
          sleep: { sleepDurationMinutes: 300 },
          mood: { energy: 4 },
        }),
        checkIn('2026-01-06', {
          sleep: { sleepDurationMinutes: 310 },
          mood: { energy: 4 },
        }),
      ],
    })
    expect(result.triggered).toBe(true)
    expect(result.evidence).toHaveLength(2)
  })

  it('does not trigger when only one matching night occurs', () => {
    const result = run('reducedSleepPlusActivation', {
      baseline: baseline({ usualSleepDurationMinutes: 440 }),
      checkIns: [
        checkIn('2026-01-05', {
          sleep: { sleepDurationMinutes: 300 },
          mood: { energy: 4 },
        }),
      ],
    })
    expect(result.triggered).toBe(false)
  })

  it('does not trigger without a recorded baseline (missing data is not a match)', () => {
    const result = run('reducedSleepPlusActivation', {
      checkIns: [
        checkIn('2026-01-05', {
          sleep: { sleepDurationMinutes: 100 },
          mood: { energy: 4 },
        }),
        checkIn('2026-01-06', {
          sleep: { sleepDurationMinutes: 100 },
          mood: { energy: 4 },
        }),
      ],
    })
    expect(result.triggered).toBe(false)
  })
})

describe('daytimeAlertnessChange', () => {
  it('triggers on 3 consecutive days without the usual nap need, shorter sleep, higher energy', () => {
    const result = run('daytimeAlertnessChange', {
      baseline: baseline({ usualLunchtimeNapNeed: 2, usualSleepDurationMinutes: 440 }),
      checkIns: [
        checkIn('2026-01-05', {
          sleep: { lunchtimeNapNeed: 0, sleepDurationMinutes: 400 },
          mood: { energy: 3 },
        }),
        checkIn('2026-01-06', {
          sleep: { lunchtimeNapNeed: 0, sleepDurationMinutes: 400 },
          mood: { energy: 3 },
        }),
        checkIn('2026-01-07', {
          sleep: { lunchtimeNapNeed: 0, sleepDurationMinutes: 400 },
          mood: { energy: 3 },
        }),
      ],
    })
    expect(result.triggered).toBe(true)
  })

  it('does not trigger when the baseline shows no usual nap need', () => {
    const result = run('daytimeAlertnessChange', {
      baseline: baseline({ usualLunchtimeNapNeed: 0, usualSleepDurationMinutes: 440 }),
      checkIns: [
        checkIn('2026-01-05', {
          sleep: { lunchtimeNapNeed: 0, sleepDurationMinutes: 400 },
          mood: { energy: 3 },
        }),
        checkIn('2026-01-06', {
          sleep: { lunchtimeNapNeed: 0, sleepDurationMinutes: 400 },
          mood: { energy: 3 },
        }),
        checkIn('2026-01-07', {
          sleep: { lunchtimeNapNeed: 0, sleepDurationMinutes: 400 },
          mood: { energy: 3 },
        }),
      ],
    })
    expect(result.triggered).toBe(false)
  })

  it('does not trigger without a baseline sleep duration', () => {
    const result = run('daytimeAlertnessChange', {
      baseline: baseline({ usualLunchtimeNapNeed: 2 }),
      checkIns: [
        checkIn('2026-01-05', {
          sleep: { lunchtimeNapNeed: 0, sleepDurationMinutes: 400 },
          mood: { energy: 3 },
        }),
        checkIn('2026-01-06', {
          sleep: { lunchtimeNapNeed: 0, sleepDurationMinutes: 400 },
          mood: { energy: 3 },
        }),
        checkIn('2026-01-07', {
          sleep: { lunchtimeNapNeed: 0, sleepDurationMinutes: 400 },
          mood: { energy: 3 },
        }),
      ],
    })
    expect(result.triggered).toBe(false)
  })
})

describe('possibleLowEnergyPattern', () => {
  const lowEnergyDays = [
    checkIn('2026-01-01', { sleep: { lunchtimeNapNeed: 3 }, mood: { lowMood: 4 } }),
    checkIn('2026-01-02', { sleep: { lunchtimeNapNeed: 3 }, mood: { lowMood: 4 } }),
    checkIn('2026-01-03', { sleep: { lunchtimeNapNeed: 3 }, mood: { lowMood: 4 } }),
  ]

  it('triggers with enough low-energy days plus repeated cancellations', () => {
    const result = run('possibleLowEnergyPattern', {
      checkIns: lowEnergyDays,
      commitments: [
        commitment('2026-01-02', { outcome: 'cancelled' }),
        commitment('2026-01-03', { outcome: 'didNotAttend' }),
      ],
    })
    expect(result.triggered).toBe(true)
  })

  it('does not trigger with too few matching days', () => {
    const result = run('possibleLowEnergyPattern', {
      checkIns: lowEnergyDays.slice(0, 2),
      commitments: [
        commitment('2026-01-02', { outcome: 'cancelled' }),
        commitment('2026-01-03', { outcome: 'didNotAttend' }),
      ],
    })
    expect(result.triggered).toBe(false)
  })

  it('does not trigger on enough matching days alone without the secondary signal', () => {
    const result = run('possibleLowEnergyPattern', { checkIns: lowEnergyDays })
    expect(result.triggered).toBe(false)
  })
})

describe('socialActivationPattern', () => {
  it('triggers on above-threshold days combined with overstimulation', () => {
    const result = run('socialActivationPattern', {
      checkIns: [
        checkIn('2026-01-01', { social: { activityAmount: 4, socialDrive: 2 } }),
        checkIn('2026-01-02', {
          social: {
            activityAmount: 4,
            socialDrive: 2,
            effect: 'energisedOrOverstimulated',
          },
        }),
      ],
    })
    expect(result.triggered).toBe(true)
  })

  it('does not trigger without the secondary signal', () => {
    const result = run('socialActivationPattern', {
      checkIns: [
        checkIn('2026-01-01', { social: { activityAmount: 4, socialDrive: 2 } }),
        checkIn('2026-01-02', { social: { activityAmount: 4, socialDrive: 2 } }),
      ],
    })
    expect(result.triggered).toBe(false)
  })
})

describe('withdrawalPattern', () => {
  it('triggers on repeated distress-related cancellations', () => {
    const result = run('withdrawalPattern', {
      commitments: [
        commitment('2026-01-01', {
          importance: 'meaningful',
          outcome: 'cancelled',
          reasons: ['distress'],
        }),
        commitment('2026-01-02', {
          importance: 'essential',
          outcome: 'didNotAttend',
          reasons: ['overwhelmed'],
        }),
      ],
    })
    expect(result.triggered).toBe(true)
  })

  it('does not trigger on a single cancellation', () => {
    const result = run('withdrawalPattern', {
      commitments: [
        commitment('2026-01-01', {
          importance: 'meaningful',
          outcome: 'cancelled',
          reasons: ['distress'],
        }),
      ],
    })
    expect(result.triggered).toBe(false)
  })

  it('does not trigger on healthy-boundary cancellations', () => {
    const result = run('withdrawalPattern', {
      commitments: [
        commitment('2026-01-01', {
          importance: 'meaningful',
          outcome: 'cancelled',
          reasons: ['healthyBoundary'],
        }),
        commitment('2026-01-02', {
          importance: 'meaningful',
          outcome: 'cancelled',
          reasons: ['healthyBoundary'],
        }),
      ],
    })
    expect(result.triggered).toBe(false)
  })
})

describe('essentialCommitmentMissed', () => {
  it('triggers when an essential commitment is missed for a distress-related reason', () => {
    const result = run('essentialCommitmentMissed', {
      commitments: [
        commitment('2026-01-01', {
          importance: 'essential',
          outcome: 'didNotAttend',
          reasons: ['distress'],
        }),
      ],
    })
    expect(result.triggered).toBe(true)
  })

  it('does not trigger for a healthy-boundary reason', () => {
    const result = run('essentialCommitmentMissed', {
      commitments: [
        commitment('2026-01-01', {
          importance: 'essential',
          outcome: 'cancelled',
          reasons: ['healthyBoundary'],
        }),
      ],
    })
    expect(result.triggered).toBe(false)
  })

  it('does not trigger for a non-essential commitment', () => {
    const result = run('essentialCommitmentMissed', {
      commitments: [
        commitment('2026-01-01', {
          importance: 'routine',
          outcome: 'didNotAttend',
          reasons: ['distress'],
        }),
      ],
    })
    expect(result.triggered).toBe(false)
  })
})

describe('alcoholPatternChange', () => {
  it('triggers when recorded units exceed the baseline', () => {
    const result = run('alcoholPatternChange', {
      baseline: baseline({ usualWeeklyAlcoholUnits: 4 }),
      checkIns: [
        checkIn('2026-01-01', { alcohol: { unitsConsumed: 5 } }),
        checkIn('2026-01-02', { alcohol: { unitsConsumed: 5 } }),
      ],
    })
    expect(result.triggered).toBe(true)
  })

  it('does not trigger when units equal the baseline', () => {
    const result = run('alcoholPatternChange', {
      baseline: baseline({ usualWeeklyAlcoholUnits: 4 }),
      checkIns: [checkIn('2026-01-01', { alcohol: { unitsConsumed: 4 } })],
    })
    expect(result.triggered).toBe(false)
  })

  it('does not trigger without a recorded baseline', () => {
    const result = run('alcoholPatternChange', {
      checkIns: [checkIn('2026-01-01', { alcohol: { unitsConsumed: 20 } })],
    })
    expect(result.triggered).toBe(false)
  })
})

describe('restlessnessReview', () => {
  it('triggers on a single high-restlessness day', () => {
    const result = run('restlessnessReview', {
      checkIns: [checkIn('2026-01-01', { medicationEffects: { innerRestlessness: 4 } })],
    })
    expect(result.triggered).toBe(true)
  })

  it('triggers on a rising trend across the window even below the high threshold', () => {
    const result = run('restlessnessReview', {
      checkIns: [
        checkIn('2026-01-01', { medicationEffects: { innerRestlessness: 0 } }),
        checkIn('2026-01-02', { medicationEffects: { innerRestlessness: 0 } }),
        checkIn('2026-01-03', { medicationEffects: { innerRestlessness: 2 } }),
        checkIn('2026-01-04', { medicationEffects: { innerRestlessness: 2 } }),
      ],
    })
    expect(result.triggered).toBe(true)
  })

  it('does not trigger when nothing was ever recorded', () => {
    const result = run('restlessnessReview', {
      checkIns: [checkIn('2026-01-01', {}), checkIn('2026-01-02', {})],
    })
    expect(result.triggered).toBe(false)
  })
})

describe('compulsiveUrgeReview', () => {
  it('triggers on an above-threshold urge scale', () => {
    const result = run('compulsiveUrgeReview', {
      checkIns: [checkIn('2026-01-01', { urges: { spendingUrge: 3 } })],
    })
    expect(result.triggered).toBe(true)
  })

  it('triggers on free-text other-urge content', () => {
    const result = run('compulsiveUrgeReview', {
      checkIns: [
        checkIn('2026-01-01', {
          urges: { otherCompulsiveUrgeText: 'Urge to reorganise everything' },
        }),
      ],
    })
    expect(result.triggered).toBe(true)
  })

  it('does not trigger below threshold with no free text', () => {
    const result = run('compulsiveUrgeReview', {
      checkIns: [checkIn('2026-01-01', { urges: { spendingUrge: 1, gamblingUrge: 0 } })],
    })
    expect(result.triggered).toBe(false)
  })
})

describe('observerConcern', () => {
  it('triggers on a single urgent entry', () => {
    const result = run('observerConcern', {
      observerEntries: [observerEntry('2026-01-01', { concern: 'urgent' })],
    })
    expect(result.triggered).toBe(true)
  })

  it('triggers on repeated discuss-soon entries', () => {
    const result = run('observerConcern', {
      observerEntries: [
        observerEntry('2026-01-01', { concern: 'discussSoon' }),
        observerEntry('2026-01-05', { concern: 'discussSoon' }),
      ],
    })
    expect(result.triggered).toBe(true)
  })

  it('does not trigger on a single discuss-soon entry', () => {
    const result = run('observerConcern', {
      observerEntries: [observerEntry('2026-01-01', { concern: 'discussSoon' })],
    })
    expect(result.triggered).toBe(false)
  })

  it('does not trigger with no observer entries', () => {
    const result = run('observerConcern', {})
    expect(result.triggered).toBe(false)
  })
})
