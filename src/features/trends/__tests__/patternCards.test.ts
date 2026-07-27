import { describe, expect, it } from 'vitest'
import { enumerateDates } from '../../../utils/dateWindows'
import { buildPatternCards, type PatternCardContext } from '../patternCards'
import { baseline, checkIn, commitment } from './fixtures'

const BANNED_PHRASES = [
  'manic',
  'hypomanic',
  'akathisia',
  'your medication is causing',
  'you are',
]

function assertNoBannedPhrase(text: string) {
  const lower = text.toLowerCase()
  for (const phrase of BANNED_PHRASES) {
    expect(lower, `card text contains prohibited wording: "${phrase}"`).not.toContain(
      phrase,
    )
  }
}

function context(partial: Partial<PatternCardContext>): PatternCardContext {
  const windowStart = partial.windowStart ?? '2026-01-01'
  const windowEnd = partial.windowEnd ?? '2026-01-10'
  return {
    windowStart,
    windowEnd,
    dates: enumerateDates(windowStart, windowEnd),
    checkIns: [],
    commitments: [],
    baseline: undefined,
    ...partial,
  }
}

describe('baseline-comparison pattern card', () => {
  it('reports when a metric is above baseline on a majority of recorded days', () => {
    const cards = buildPatternCards(
      context({
        baseline: baseline({ usualSocialDrive: 0 }),
        checkIns: [
          checkIn('2026-01-01', { social: { socialDrive: 2 } }),
          checkIn('2026-01-02', { social: { socialDrive: 2 } }),
          checkIn('2026-01-03', { social: { socialDrive: 2 } }),
          checkIn('2026-01-04', { social: { socialDrive: -1 } }),
        ],
      }),
    )
    const card = cards.find((c) => c.id.startsWith('baseline-'))
    expect(card?.text).toContain(
      'Social drive was above your recorded baseline on 3 of the last 4 days.',
    )
  })

  it('produces no card without a recorded baseline', () => {
    const cards = buildPatternCards(
      context({
        checkIns: [
          checkIn('2026-01-01', { social: { socialDrive: 2 } }),
          checkIn('2026-01-02', { social: { socialDrive: 2 } }),
          checkIn('2026-01-03', { social: { socialDrive: 2 } }),
        ],
      }),
    )
    expect(cards.some((c) => c.id.startsWith('baseline-'))).toBe(false)
  })

  it('produces no card with too few recorded days', () => {
    const cards = buildPatternCards(
      context({
        baseline: baseline({ usualSocialDrive: 0 }),
        checkIns: [checkIn('2026-01-01', { social: { socialDrive: 2 } })],
      }),
    )
    expect(cards.some((c) => c.id.startsWith('baseline-'))).toBe(false)
  })
})

describe('cancellation summary pattern card', () => {
  it('counts meaningful/essential cancellations and the distress-related subset', () => {
    const cards = buildPatternCards(
      context({
        commitments: [
          commitment('2026-01-02', {
            importance: 'meaningful',
            outcome: 'cancelled',
            reasons: ['distress'],
          }),
          commitment('2026-01-03', {
            importance: 'essential',
            outcome: 'didNotAttend',
            reasons: ['healthyBoundary'],
          }),
          commitment('2026-01-04', { importance: 'routine', outcome: 'cancelled' }),
        ],
      }),
    )
    const card = cards.find((c) => c.id === 'cancellation-summary')
    expect(card?.text).toContain(
      'You cancelled 2 meaningful commitments in 10 days, including 1 recorded as distress-related.',
    )
    expect(card?.linkTo).toBe('/commitments')
  })

  it('produces no card when nothing was cancelled', () => {
    const cards = buildPatternCards(
      context({ commitments: [commitment('2026-01-02', { outcome: 'attended' })] }),
    )
    expect(cards.some((c) => c.id === 'cancellation-summary')).toBe(false)
  })
})

describe('appetite/satiety divergence pattern card', () => {
  it('reports appetite decreasing while satiety increases', () => {
    const cards = buildPatternCards(
      context({
        windowStart: '2026-01-01',
        windowEnd: '2026-01-04',
        checkIns: [
          checkIn('2026-01-01', { appetite: { appetite: 4, satietyAfterNormalMeal: 1 } }),
          checkIn('2026-01-02', { appetite: { appetite: 4, satietyAfterNormalMeal: 1 } }),
          checkIn('2026-01-03', { appetite: { appetite: 1, satietyAfterNormalMeal: 4 } }),
          checkIn('2026-01-04', { appetite: { appetite: 1, satietyAfterNormalMeal: 4 } }),
        ],
      }),
    )
    const card = cards.find((c) => c.id === 'appetite-satiety-divergence')
    expect(card?.text).toBe(
      'Appetite decreased while satiety increased during the selected period.',
    )
  })

  it('produces no card without enough data on both metrics', () => {
    const cards = buildPatternCards(
      context({
        windowStart: '2026-01-01',
        windowEnd: '2026-01-04',
        checkIns: [checkIn('2026-01-01', { appetite: { appetite: 4 } })],
      }),
    )
    expect(cards.some((c) => c.id === 'appetite-satiety-divergence')).toBe(false)
  })
})

describe('pattern card wording', () => {
  it('never uses prohibited diagnostic or medication-causation wording', () => {
    const cards = buildPatternCards(
      context({
        windowStart: '2026-01-01',
        windowEnd: '2026-01-10',
        baseline: baseline({ usualSocialDrive: 0, usualAppetite: 2 }),
        checkIns: [
          checkIn('2026-01-01', {
            social: { socialDrive: 2 },
            appetite: { appetite: 4, satietyAfterNormalMeal: 1 },
          }),
          checkIn('2026-01-02', {
            social: { socialDrive: 2 },
            appetite: { appetite: 4, satietyAfterNormalMeal: 1 },
          }),
          checkIn('2026-01-08', {
            social: { socialDrive: 2 },
            appetite: { appetite: 1, satietyAfterNormalMeal: 4 },
          }),
          checkIn('2026-01-09', {
            social: { socialDrive: 2 },
            appetite: { appetite: 1, satietyAfterNormalMeal: 4 },
          }),
        ],
        commitments: [
          commitment('2026-01-02', {
            importance: 'meaningful',
            outcome: 'cancelled',
            reasons: ['distress'],
          }),
        ],
      }),
    )
    expect(cards.length).toBeGreaterThan(0)
    for (const card of cards) assertNoBannedPhrase(card.text)
  })
})
