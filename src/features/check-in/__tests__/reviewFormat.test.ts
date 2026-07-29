import { describe, expect, it } from 'vitest'
import { summarizeStep } from '../reviewFormat'
import { checkInSteps } from '../steps'
import type { CheckInDraft } from '../useDailyCheckIn'

function draft(overrides: Partial<CheckInDraft> = {}): CheckInDraft {
  return {
    sleep: {},
    mood: {},
    warningSigns: {},
    medicationEffects: {},
    appetite: {},
    urges: {},
    alcohol: {},
    social: {},
    notes: '',
    ...overrides,
  }
}

function stepById(id: string) {
  const step = checkInSteps.find((s) => s.id === id)
  if (!step) throw new Error(`Unknown step: ${id}`)
  return step
}

describe('summarizeStep', () => {
  it('returns no rows when every field in the step is unanswered', () => {
    expect(summarizeStep(stepById('sleep-last-night'), draft())).toEqual([])
  })

  it('translates a scale value into its word label', () => {
    const rows = summarizeStep(
      stepById('sleep-last-night'),
      draft({ sleep: { sleepDurationMinutes: 420, sleepQuality: 3 } }),
    )
    expect(rows).toEqual([
      { label: 'Sleep duration', value: '420 min' },
      { label: 'Sleep quality', value: 'good' },
    ])
  })

  it('translates a negative-minimum scale (e.g. mental speed) correctly', () => {
    const rows = summarizeStep(
      stepById('mood-pace'),
      draft({ mood: { mentalSpeed: -1 } }),
    )
    expect(rows).toEqual([{ label: 'Mental speed', value: 'slower' }])
  })

  it('shows a boolean field as Yes only when true', () => {
    expect(
      summarizeStep(
        stepById('warning-signs'),
        draft({ warningSigns: { headBuzz: true, tightShoulders: false } }),
      ),
    ).toEqual([{ label: 'Head buzz', value: 'Yes' }])
  })

  it('translates an enum field to its display label', () => {
    expect(
      summarizeStep(
        stepById('alcohol'),
        draft({ alcohol: { unitsConsumed: 2, context: 'withMeal' } }),
      ),
    ).toEqual([
      { label: 'Units consumed', value: '2 units' },
      { label: 'Context', value: 'With meal' },
    ])
  })

  it('joins multiple interaction types into one readable list', () => {
    expect(
      summarizeStep(
        stepById('social'),
        draft({ social: { interactionTypes: ['inPerson', 'work'] } }),
      ),
    ).toEqual([{ label: 'Interaction types', value: 'In person, Work' }])
  })

  it('returns the trimmed note text for the notes step, or nothing when blank', () => {
    expect(summarizeStep(stepById('note'), draft({ notes: '  Felt tired  ' }))).toEqual([
      { label: 'Note', value: 'Felt tired' },
    ])
    expect(summarizeStep(stepById('note'), draft({ notes: '   ' }))).toEqual([])
  })
})
